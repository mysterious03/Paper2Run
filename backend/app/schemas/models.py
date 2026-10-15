from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field

FieldStatus = Literal[
    "reported",
    "external_source",
    "suggested",
    "ambiguous",
    "not_found",
    "not_extracted",
    "conflicting"
]

SemanticSupportStatus = Literal[
    "verified",
    "supported",
    "needs_review",
    "unsupported",
    "inferred"
]

class EvidenceItem(BaseModel):
    evidence_id: str
    page_index: int  # 0-indexed
    printed_page_number: Optional[int] = None
    section: Optional[str] = "Main Text"
    quote: str
    quote_match: bool = False
    semantic_support: SemanticSupportStatus = "needs_review"
    notes: Optional[str] = None

class BlueprintField(BaseModel):
    id: str
    name: str
    category: str  # dataset, architecture, training, loss, optimizer, evaluation, etc.
    value: Optional[str] = None  # None / UNKNOWN if unresolved
    status: FieldStatus
    evidence: List[EvidenceItem] = []
    notes: List[str] = []
    document_id: str
    relationships: List[str] = []  # related node / edge ids

class PaperOverview(BaseModel):
    research_problem: str
    motivation_and_method: str
    main_architecture: str
    main_results: str
    limitations_and_questions: str

class GraphNode(BaseModel):
    id: str
    type: str  # research_objective, method, model_architecture, dataset, loss_function, optimizer, etc.
    label: str
    status: FieldStatus = "reported"
    value: Optional[str] = None
    evidence_ids: List[str] = []
    metadata: Dict[str, Any] = {}

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    type: str  # motivates, proposes, uses_method, contains_component, trained_on, optimized_with, etc.
    provenance_type: Literal["explicit", "inferred", "external"] = "explicit"
    evidence_ids: List[str] = []
    status: str = "verified"
    label: Optional[str] = None

class ResearchGraph(BaseModel):
    document_id: str
    nodes: List[GraphNode]
    edges: List[GraphEdge]

class LearningExplanation(BaseModel):
    concept_id: str
    concept_name: str
    explanation_level: Literal["beginner", "technical", "math"]
    summary: str
    content: str
    paper_context: str
    math_formulation: Optional[str] = None
    analogies_or_examples: Optional[str] = None
    reproduction_note: str
    related_evidence: List[EvidenceItem] = []
    related_nodes: List[str] = []
    is_author_reported: bool = True

class GapItem(BaseModel):
    field_id: str
    field_name: str
    category: str
    status: FieldStatus
    missing_explanation: str
    why_it_matters: str
    examined_sections: List[str] = []
    recommended_actions: List[str] = []
    suggested_candidate_value: Optional[str] = None
    candidate_rationale: Optional[str] = None
    candidate_source: Optional[str] = None

class DocumentPage(BaseModel):
    page_index: int
    text: str
    char_count: int
    has_text: bool

class PaperMetadata(BaseModel):
    paper_id: str
    filename: str
    title: str
    page_count: int
    created_at: str
    status: Literal["uploaded", "extracting", "analyzed", "error"]
    error_message: Optional[str] = None
    is_sample_demo: bool = False
    overview: Optional[PaperOverview] = None
    total_fields: int = 0
    reported_fields: int = 0
    unresolved_gaps: int = 0

class AnalysisResult(BaseModel):
    paper_id: str
    metadata: PaperMetadata
    overview: PaperOverview
    blueprint: List[BlueprintField]
    graph: ResearchGraph
    gaps: List[GapItem]
