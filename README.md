# Paper2Run — Evidence-Backed AI/ML Research-to-Reproduction Assistant

> **Tagline:** Understand the paper. Connect the evidence. Reproduce the experiment.  
> **Product Category:** Evidence-backed AI/ML research-to-reproduction assistant  
> **Audience:** Students, ML engineers, research interns, and developers looking to reproduce AI/ML papers without guesswork or hallucinations.

---

## 🌟 What is Paper2Run?

Paper2Run is not a generic paper chatbot or simple summarizer. It provides a structured, evidence-backed workspace for bridging the gap between reading an AI/ML research paper and preparing a defensible, reproducible experiment blueprint:

$$\text{Paper} \longrightarrow \text{Evidence} \longrightarrow \text{Connected Blueprint} \longrightarrow \text{Learning} \longrightarrow \text{Gap Investigation} \longrightarrow \text{Implementation Plan}$$

### Core Tenets & Research Integrity

1. **Evidence Before Confidence:** Extracted facts are tied to exact page indices, section titles, and verbatim source passages verified against the document.
2. **Deterministic Quote Matching:** Distinguishes string presence in the document text from semantic truth.
3. **Explicit Uncertainty Handling:** Unresolved, ambiguous, or unstated settings remain visibly `UNKNOWN` / `not_found`. Paper2Run never silently invents defaults (e.g., guessing Adam $lr=10^{-3}$ if not reported).
4. **Suggestions Labeled Transparently:** Any recommended candidate setting for an unresolved gap is marked as a **SUGGESTION** with rationale and reference source—never disguised as the original authors' value.
5. **Honest Reproduction Boundaries:** Completing a checklist does not guarantee exact reproduction, as random seed variance, framework versions, and hardware FLOP precision introduce experimental divergence.

---

## 🏗️ Architecture

- **Frontend:** React 18, Vite, TypeScript, Lucide Icons, Glassmorphic Research Dark Theme with Plus Jakarta Sans and JetBrains Mono typography.
- **Backend:** Python 3.11+, FastAPI, PyMuPDF (`fitz`) with resilient pure-Python `pypdf` fallback, Pydantic V2 schemas.
- **AI & Extraction Engine:** Multi-provider LLM support (Google Gemini, OpenAI, Anthropic) with strict JSON output validation and fallback to a sample baseline if offline or without keys.

---

## 🚀 Quickstart & Setup Guide

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Backend Setup

```bash
# In project root:
cd backend

# Install dependencies:
python -m pip install fastapi uvicorn pydantic pydantic-settings pyyaml python-multipart pypdf pytest requests

# (Optional) Configure LLM API Keys in .env:
cp ../.env.example .env
# Edit .env and supply GEMINI_API_KEY, OPENAI_API_KEY, or ANTHROPIC_API_KEY.
# Note: Paper2Run operates seamlessly in demo/offline mode even without an API key!

# Start the FastAPI server:
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The backend API documentation is available at `http://127.0.0.1:8000/docs`.

### 3. Frontend Setup

```bash
# In another terminal from project root:
cd frontend

# Install packages:
npm install

# Start Vite dev server:
npm run dev -- --host 127.0.0.1 --port 5173
```
Open **`http://127.0.0.1:5173`** in your browser.

---

## 🧪 Running Tests

### Run Backend Unit & Integration Tests:
```bash
cd backend
python -m pytest tests/ -v
```
This tests:
- Quote matching and boundary verification
- Quote mismatch detection and status adjustment
- Pydantic schema validation & serialization
- Markdown, JSON, YAML, and checklist export generation
- 3-tier explanation level consistency
- Real PDF parsing and text extraction

### Run Live Server End-to-End Test:
While the backend is running:
```bash
python backend/tests/test_live_server.py
```

---

## 🖥️ Workspace Features & Tour

### 1. Paper Header & Readiness Metrics
- Displays document title, filename, page count, reported fields count (e.g. 11/14), and unresolved gap count.
- Honest reproduction boundary notice.

### 2. Executive Research Overview
- Five structured synthesis cards: Problem & Objective, Motivation & Proposed Method, Model Architecture, Key Results, and Limitations.

### 3. Structured Experiment Blueprint
- Comprehensive parameter table organized by category (`dataset`, `model_architecture`, `optimizer`, `learning_rate_schedule`, `loss`, `training_setup`, `evaluation`).
- Precise status badges:
  - `Reported`: Supported by verbatim quote from text.
  - `Ambiguous`: Mentioned, but conflicting or unclear value.
  - `Not Found in Examined Content`: Explicitly omitted in paper text.
  - `Suggested`: Recommended candidate setting.
- Direct actions: **Learn** (opens multi-tier explanation) and **Proof** (inspects quote on page).

### 4. Paper2Run Learn (Blueprint-Grounded Learning)
- Switches between 3 depth levels for any selected field:
  - 🎓 **Beginner:** Simple intuition, analogies, and concrete examples.
  - ⚙️ **Technical Intuition:** Mechanism, engineering significance, and role in model convergence.
  - 📐 **Mathematical Deep Dive:** Equations, symbols, and variance derivations (e.g., scaled dot-product variance, Adam bias correction).
- Discloses author-reported citations vs background knowledge.
- Highlights practical reproduction warnings (e.g., critical differences in Adam $\beta_2=0.98$ vs standard library defaults).

### 5. Research Connection Graph
- Interactive entity relationship navigator connecting:
  $$\text{Objective} \xrightarrow{\text{motivates}} \text{Method} \xrightarrow{\text{uses}} \text{Architecture} \xrightarrow{\text{trained on}} \text{Dataset} \xrightarrow{\text{optimized with}} \text{Optimizer} \xrightarrow{\text{blocked by}} \text{Reproduction Gap}$$
- Distinguishes **Explicit** provenance from **Inferred** relationships.

### 6. Verify & Gaps Panel
- Contextual investigation panel for missing/ambiguous parameters.
- Explains what is missing and why it directly affects reproduction.
- Candidate suggestions with rationale and recommended community repository sources.
- Interactive investigation checklist.

### 7. Multi-Format Exports
- **Markdown Report (`.md`):** Full evidence-backed reproduction document.
- **JSON Blueprint (`.json`):** Machine-readable schema retaining `null` for unknown fields.
- **YAML Blueprint (`.yaml`):** Human-readable YAML configuration.
- **Reproduction Checklist (`.md`):** Phase-by-phase actionable reproduction checklist.

---

## 🔒 Security & Privacy

- API keys are read from environment variables and `.env`, never exposed to client-side code.
- PDF text is treated as untrusted data input, preventing prompt injection.
- Temporary files and uploads are stored locally in `backend/uploads`.
