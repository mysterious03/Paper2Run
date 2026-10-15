import os
import re
import uuid
import shutil
from pathlib import Path
from typing import Dict, Optional, Literal
from fastapi import FastAPI, UploadFile, File, HTTPException, Query, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .config import settings
from .schemas.models import (
    AnalysisResult,
    PaperMetadata,
    BlueprintField,
    ResearchGraph,
    LearningExplanation,
    GapItem,
    DocumentPage
)
from .services.pdf_parser import PDFParser, PDFParseException
from .services.extraction import ExtractionService
from .services.learning import LearningService
from .services.export_service import ExportService
from .services.sample_data import get_sample_analysis, get_sample_document_pages, get_lora_sample_analysis

app = FastAPI(
    title="Paper2Run API",
    description="Evidence-backed AI/ML research-to-reproduction assistant backend",
    version="1.0.0"
)

# Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

# Enable CORS for frontend Vite development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session store (backed by file storage)
PAPERS_STORE: Dict[str, AnalysisResult] = {}
PAGES_STORE: Dict[str, list[DocumentPage]] = {}

# Preload sample analyses
sample_transformer = get_sample_analysis()
sample_lora = get_lora_sample_analysis()

PAPERS_STORE[sample_transformer.paper_id] = sample_transformer
PAPERS_STORE[sample_lora.paper_id] = sample_lora

PAGES_STORE[sample_transformer.paper_id] = get_sample_document_pages()
PAGES_STORE[sample_lora.paper_id] = []

extraction_service = ExtractionService()
learning_service = LearningService()

class ExplainRequest(BaseModel):
    field_id: str
    level: Literal["beginner", "technical", "math"] = "technical"

class SetKeyRequest(BaseModel):
    provider: Literal["gemini", "openai", "anthropic"]
    key: str

@app.get("/api/settings/keys")
def get_key_status():
    client = extraction_service.llm_client
    def mask(k: str):
        if not k or len(k) < 8:
            return ""
        return k[:4] + "..." + k[-4:]

    return {
        "gemini_configured": bool(client.gemini_key),
        "gemini_masked": mask(client.gemini_key),
        "openai_configured": bool(client.openai_key),
        "openai_masked": mask(client.openai_key),
        "anthropic_configured": bool(client.anthropic_key),
        "anthropic_masked": mask(client.anthropic_key),
        "active_provider": client.get_provider_name()
    }

@app.post("/api/settings/keys")
def update_key(req: SetKeyRequest):
    extraction_service.llm_client.set_key(req.provider, req.key)
    learning_service.llm_client.set_key(req.provider, req.key)
    ok, msg = extraction_service.llm_client.test_connection()
    return {
        "success": ok,
        "message": msg,
        "active_provider": extraction_service.llm_client.get_provider_name()
    }

@app.post("/api/settings/test")
def test_active_connection():
    ok, msg = extraction_service.llm_client.test_connection()
    return {
        "success": ok,
        "message": msg,
        "active_provider": extraction_service.llm_client.get_provider_name()
    }

@app.get("/api/health")
def health_check():
    provider = extraction_service.llm_client.get_provider_name()
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "llm_provider": provider,
        "llm_configured": extraction_service.llm_client.is_configured()
    }

@app.get("/api/sample/list")
def list_samples():
    return [
        {
            "id": "transformer",
            "paper_id": sample_transformer.paper_id,
            "title": "Attention Is All You Need (Vaswani et al., 2017)",
            "domain": "Sequence Transduction / Transformer",
            "gaps": 3
        },
        {
            "id": "lora",
            "paper_id": sample_lora.paper_id,
            "title": "LoRA: Low-Rank Adaptation (Hu et al., 2021)",
            "domain": "Parameter-Efficient Fine-Tuning (PEFT)",
            "gaps": 2
        }
    ]

@app.get("/api/sample")
def get_sample(paper: Optional[str] = Query("transformer")):
    """Returns sample benchmark analysis (transformer or lora)."""
    if paper == "lora":
        return sample_lora
    return sample_transformer

@app.post("/api/papers")
async def upload_paper(file: UploadFile = File(...)):
    """Accepts PDF upload, validates, extracts text page-by-page, and prepares paper."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Invalid file format. Only PDF files are supported.")

    # Sanitize filename against path traversal
    safe_name = re.sub(r'[^a-zA-Z0-9_.-]', '_', Path(file.filename).name)
    paper_id = f"paper_{uuid.uuid4().hex[:10]}"
    file_path = settings.UPLOAD_DIR / f"{paper_id}_{safe_name}"

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save uploaded file: {str(e)}")

    # Enforce maximum size limit (30MB)
    if file_path.stat().st_size > 30 * 1024 * 1024:
        file_path.unlink(missing_ok=True)
        raise HTTPException(status_code=400, detail="File size exceeds the 30MB limit.")

    # Parse with PyMuPDF
    try:
        title, pages, is_scanned, msg = PDFParser.parse_pdf(file_path)
    except PDFParseException as pe:
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(status_code=400, detail=str(pe))

    PAGES_STORE[paper_id] = pages

    # Initial metadata record
    metadata = PaperMetadata(
        paper_id=paper_id,
        filename=file.filename,
        title=title,
        page_count=len(pages),
        created_at="2026-10-15T12:00:00Z",
        status="uploaded",
        error_message=msg if is_scanned else None,
        is_sample_demo=False
    )

    # Automatically trigger extraction pipeline
    try:
        result = extraction_service.analyze_document(paper_id, file.filename, title, pages)
        PAPERS_STORE[paper_id] = result
        return result
    except Exception as e:
        metadata.status = "error"
        metadata.error_message = str(e)
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/papers/{paper_id}")
def get_paper(paper_id: str):
    if paper_id not in PAPERS_STORE:
        raise HTTPException(status_code=404, detail="Paper not found.")
    return PAPERS_STORE[paper_id]

@app.post("/api/papers/{paper_id}/analyze")
def run_analysis(paper_id: str):
    if paper_id not in PAGES_STORE:
        raise HTTPException(status_code=404, detail="Paper pages not found.")
    pages = PAGES_STORE[paper_id]
    existing = PAPERS_STORE.get(paper_id)
    filename = existing.metadata.filename if existing else "paper.pdf"
    title = existing.metadata.title if existing else "Research Paper"

    result = extraction_service.analyze_document(paper_id, filename, title, pages)
    PAPERS_STORE[paper_id] = result
    return result

@app.get("/api/papers/{paper_id}/blueprint")
def get_blueprint(paper_id: str):
    if paper_id not in PAPERS_STORE:
        raise HTTPException(status_code=404, detail="Paper not found.")
    return PAPERS_STORE[paper_id].blueprint

@app.get("/api/papers/{paper_id}/graph")
def get_graph(paper_id: str):
    if paper_id not in PAPERS_STORE:
        raise HTTPException(status_code=404, detail="Paper not found.")
    return PAPERS_STORE[paper_id].graph

@app.post("/api/papers/{paper_id}/explain")
def explain_field(paper_id: str, req: ExplainRequest):
    if paper_id not in PAPERS_STORE:
        raise HTTPException(status_code=404, detail="Paper not found.")
    paper = PAPERS_STORE[paper_id]

    # Find the target field
    field = next((f for f in paper.blueprint if f.id == req.field_id), None)
    if not field:
        # Check if it was requested by node id
        field = next((f for f in paper.blueprint if req.field_id in f.relationships), None)

    if not field:
        # Generic field synthesis
        field = BlueprintField(
            id=req.field_id,
            name=req.field_id.replace("field_", "").replace("node_", "").replace("_", " ").title(),
            category="training_setup",
            value=None,
            status="reported",
            document_id=paper_id
        )

    explanation = learning_service.explain_field(field, req.level)
    return explanation

@app.get("/api/papers/{paper_id}/gaps")
def get_gaps(paper_id: str):
    if paper_id not in PAPERS_STORE:
        raise HTTPException(status_code=404, detail="Paper not found.")
    return PAPERS_STORE[paper_id].gaps

@app.get("/api/papers/{paper_id}/export")
def export_paper(
    paper_id: str,
    format: Literal["markdown", "json", "yaml", "checklist"] = Query("markdown")
):
    if paper_id not in PAPERS_STORE:
        raise HTTPException(status_code=404, detail="Paper not found.")
    paper = PAPERS_STORE[paper_id]

    if format == "json":
        content = ExportService.generate_json_blueprint(paper)
        return Response(
            content=content,
            media_type="application/json",
            headers={"Content-Disposition": f"attachment; filename={paper_id}_blueprint.json"}
        )
    elif format == "yaml":
        content = ExportService.generate_yaml_blueprint(paper)
        return Response(
            content=content,
            media_type="text/yaml",
            headers={"Content-Disposition": f"attachment; filename={paper_id}_blueprint.yaml"}
        )
    elif format == "checklist":
        content = ExportService.generate_checklist_markdown(paper)
        return Response(
            content=content,
            media_type="text/markdown",
            headers={"Content-Disposition": f"attachment; filename={paper_id}_checklist.md"}
        )
    else:
        content = ExportService.generate_markdown_report(paper)
        return Response(
            content=content,
            media_type="text/markdown",
            headers={"Content-Disposition": f"attachment; filename={paper_id}_reproduction_report.md"}
        )
