import json
import re
import os
import requests
from typing import Optional, Dict, Any, Tuple
from ..config import settings

class LLMException(Exception):
    pass

class LLMClient:
    def __init__(self):
        self.gemini_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
        self.openai_key = settings.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY", "")
        self.anthropic_key = settings.ANTHROPIC_API_KEY or os.getenv("ANTHROPIC_API_KEY", "")

    def set_key(self, provider: str, key: str):
        provider = provider.lower().strip()
        if provider == "gemini":
            self.gemini_key = key.strip()
            os.environ["GEMINI_API_KEY"] = self.gemini_key
        elif provider == "openai":
            self.openai_key = key.strip()
            os.environ["OPENAI_API_KEY"] = self.openai_key
        elif provider == "anthropic":
            self.anthropic_key = key.strip()
            os.environ["ANTHROPIC_API_KEY"] = self.anthropic_key

    def is_configured(self) -> bool:
        return bool(self.gemini_key or self.openai_key or self.anthropic_key)

    def get_provider_name(self) -> str:
        if self.gemini_key:
            return "Google Gemini"
        if self.openai_key:
            return "OpenAI"
        if self.anthropic_key:
            return "Anthropic"
        return "Not Configured"

    def test_connection(self) -> Tuple[bool, str]:
        if not self.is_configured():
            return False, "No API key configured. Please enter a Google Gemini or OpenAI API key."

        try:
            res = self.generate_text_response(
                "You are an AI assistant.",
                "Respond with the word 'OK' if you can read this."
            )
            if "OK" in res.upper() or len(res.strip()) > 0:
                return True, f"Successfully connected to {self.get_provider_name()}!"
            return False, f"Unexpected response from {self.get_provider_name()}."
        except Exception as e:
            return False, f"Connection test failed: {str(e)}"

    def clean_json_text(self, text: str) -> str:
        """Strips markdown code fences and returns clean json string."""
        text = text.strip()
        if text.startswith("```json"):
            text = text[7:]
        elif text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        return text.strip()

    def generate_json_response(self, system_prompt: str, user_prompt: str) -> Dict[str, Any]:
        """Calls the configured LLM and enforces JSON return."""
        if not self.is_configured():
            raise LLMException(
                "LLM API Key Required: To extract research blueprints from uploaded PDFs in real-time, "
                "please enter a Gemini API Key (free from https://aistudio.google.com/app/apikey) or OpenAI API Key."
            )

        # 1. Try Gemini
        if self.gemini_key:
            # First try direct REST API (guarantees zero SDK version mismatch)
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.gemini_key}"
                payload = {
                    "contents": [{
                        "parts": [
                            {"text": f"{system_prompt}\n\nTask:\n{user_prompt}\n\nCRITICAL: Respond with strictly valid JSON only."}
                        ]
                    }],
                    "generationConfig": {
                        "responseMimeType": "application/json",
                        "temperature": 0.1
                    }
                }
                r = requests.post(url, json=payload, timeout=60)
                if r.status_code == 200:
                    data = r.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        text_out = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "{}")
                        return json.loads(self.clean_json_text(text_out))
                elif r.status_code == 400:
                    err_msg = r.json().get("error", {}).get("message", r.text)
                    raise LLMException(f"Gemini API Error (400): {err_msg}")
                elif r.status_code == 403:
                    raise LLMException("Gemini API Key is invalid or unauthorized. Please verify your key at Google AI Studio.")
                elif r.status_code == 429:
                    raise LLMException("Gemini API Rate limit reached. Please wait a moment or upgrade your quota.")
            except LLMException:
                raise
            except Exception as e:
                # Fallback to google.genai SDK
                try:
                    from google import genai
                    from google.genai import types
                    client = genai.Client(api_key=self.gemini_key)
                    response = client.models.generate_content(
                        model="gemini-2.0-flash",
                        contents=f"{system_prompt}\n\nTask:\n{user_prompt}",
                        config=types.GenerateContentConfig(
                            response_mime_type="application/json",
                            temperature=0.1
                        )
                    )
                    raw_text = response.text or "{}"
                    return json.loads(self.clean_json_text(raw_text))
                except Exception as sdk_err:
                    raise LLMException(f"Gemini API request failed: {str(e)} / {str(sdk_err)}")

        # 2. Try OpenAI
        if self.openai_key:
            try:
                headers = {
                    "Authorization": f"Bearer {self.openai_key}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "model": "gpt-4o-mini",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    "response_format": {"type": "json_object"},
                    "temperature": 0.1
                }
                r = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=60)
                if r.status_code == 200:
                    res_data = r.json()
                    text_out = res_data["choices"][0]["message"]["content"]
                    return json.loads(self.clean_json_text(text_out))
                else:
                    err_json = r.json().get("error", {})
                    raise LLMException(f"OpenAI API Error ({r.status_code}): {err_json.get('message', r.text)}")
            except LLMException:
                raise
            except Exception as e:
                raise LLMException(f"OpenAI API call failed: {str(e)}")

        # 3. Try Anthropic
        if self.anthropic_key:
            try:
                import anthropic
                client = anthropic.Anthropic(api_key=self.anthropic_key)
                message = client.messages.create(
                    model="claude-3-5-haiku-20241022",
                    max_tokens=4000,
                    system=system_prompt,
                    messages=[
                        {"role": "user", "content": f"{user_prompt}\n\nRespond with valid JSON only."}
                    ]
                )
                raw_text = message.content[0].text
                return json.loads(self.clean_json_text(raw_text))
            except Exception as e:
                raise LLMException(f"Anthropic API call failed: {str(e)}")

        raise LLMException("Failed to call LLM provider.")

    def generate_text_response(self, system_prompt: str, user_prompt: str) -> str:
        """Generates plain text response."""
        if not self.is_configured():
            raise LLMException("No LLM API Key configured.")

        if self.gemini_key:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.gemini_key}"
                payload = {
                    "contents": [{
                        "parts": [{"text": f"{system_prompt}\n\n{user_prompt}"}]
                    }],
                    "generationConfig": {"temperature": 0.2}
                }
                r = requests.post(url, json=payload, timeout=30)
                if r.status_code == 200:
                    candidates = r.json().get("candidates", [])
                    if candidates:
                        return candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
            except Exception:
                pass

        if self.openai_key:
            try:
                headers = {
                    "Authorization": f"Bearer {self.openai_key}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "model": "gpt-4o-mini",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    "temperature": 0.2
                }
                r = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=30)
                if r.status_code == 200:
                    return r.json()["choices"][0]["message"]["content"]
            except Exception as e:
                raise LLMException(f"OpenAI call failed: {str(e)}")

        raise LLMException("Provider unavailable.")
