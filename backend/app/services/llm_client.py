import json
import re
import os
from typing import Optional, Dict, Any
from ..config import settings

class LLMException(Exception):
    pass

class LLMClient:
    def __init__(self):
        self.gemini_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
        self.openai_key = settings.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY", "")
        self.anthropic_key = settings.ANTHROPIC_API_KEY or os.getenv("ANTHROPIC_API_KEY", "")

    def is_configured(self) -> bool:
        return bool(self.gemini_key or self.openai_key or self.anthropic_key)

    def get_provider_name(self) -> str:
        if self.gemini_key:
            return "Google Gemini"
        if self.openai_key:
            return "OpenAI"
        if self.anthropic_key:
            return "Anthropic"
        return "None (Demo / Offline Mode)"

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
                "No LLM API Key configured. Please add GEMINI_API_KEY, OPENAI_API_KEY, or ANTHROPIC_API_KEY to your .env file."
            )

        # 1. Try Gemini
        if self.gemini_key:
            try:
                from google import genai
                from google.genai import types
                client = genai.Client(api_key=self.gemini_key)
                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=f"{system_prompt}\n\nTask:\n{user_prompt}",
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        temperature=0.1
                    )
                )
                raw_text = response.text or "{}"
                return json.loads(self.clean_json_text(raw_text))
            except Exception as e:
                # If google-genai package syntax fails, try standard openai compatibility or fallback
                pass

        # 2. Try OpenAI
        if self.openai_key:
            try:
                from openai import OpenAI
                client = OpenAI(api_key=self.openai_key)
                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    response_format={"type": "json_object"},
                    temperature=0.1
                )
                raw_text = response.choices[0].message.content or "{}"
                return json.loads(self.clean_json_text(raw_text))
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
        """Generates plain text or markdown response."""
        if not self.is_configured():
            raise LLMException("No LLM API Key configured.")

        if self.gemini_key:
            try:
                from google import genai
                client = genai.Client(api_key=self.gemini_key)
                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=f"{system_prompt}\n\n{user_prompt}"
                )
                return response.text or ""
            except Exception:
                pass

        if self.openai_key:
            try:
                from openai import OpenAI
                client = OpenAI(api_key=self.openai_key)
                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.2
                )
                return response.choices[0].message.content or ""
            except Exception as e:
                raise LLMException(f"OpenAI call failed: {str(e)}")

        raise LLMException("Provider unavailable.")
