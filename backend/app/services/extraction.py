import json
import uuid
from typing import List, Dict, Any, Tuple
from ..schemas.models import (
    PaperOverview,
    BlueprintField,
    EvidenceItem,
    ResearchGraph,
    GraphNode,
    GraphEdge,
    GapItem,
    DocumentPage,
    AnalysisResult,
    PaperMetadata
)
from .llm_client import LLMClient, LLMException
from .evidence_validation import EvidenceValidator
from .sample_data import get_sample_analysis

SYSTEM_EXTRACTION_PROMPT = """
You are Paper2Run's precision AI/ML research extraction engine.
Your task is to analyze the provided research paper text and extract an evidence-backed experiment blueprint, research overview, connection graph, and unresolved reproduction gaps.

STRICT PRINCIPLES:
1. NEVER fabricate facts. If a parameter or value is NOT explicitly stated in the paper text, set its value to null and status to "not_found" or "ambiguous".
2. DO NOT use common defaults (e.g. do not guess Adam lr=1e-3 if not stated).
3. Every reported fact MUST include the exact verbatim quote and the 0-indexed page number from the text.
4. Distinguish:
   - "reported": Explicitly stated in the uploaded paper text with exact quote.
   - "external_source": Stated to come from cited work or external URL/repo.
   - "suggested": Recommended candidate by you, clearly distinct from authors' text.
   - "ambiguous": Present in text, but conflicting or unclear value.
   - "not_found": Not found in the provided document text.
   - "not_extracted": Complex table or formula that couldn't be parsed.
5. Inferred graph relationships must have provenance_type = "inferred". Explicit relationships supported by quotes must have provenance_type = "explicit".

Return a strictly valid JSON object with the following structure:
{
  "overview": {
    "research_problem": "...",
    "motivation_and_method": "...",
    "main_architecture": "...",
    "main_results": "...",
    "limitations_and_questions": "..."
  },
  "fields": [
    {
      "id": "field_dataset",
      "name": "Dataset",
      "category": "dataset",
      "value": "WMT 2014 En-De",
      "status": "reported",
      "evidence": [
        {
          "page_index": 4,
          "section": "Experiments",
          "quote": "verbatim text excerpt from page 4"
        }
      ],
      "notes": ["note 1"]
    }
  ],
  "nodes": [
    {
      "id": "node_obj",
      "type": "research_objective",
      "label": "Short label",
      "status": "reported",
      "value": "details"
    }
  ],
  "edges": [
    {
      "id": "edge_1",
      "source": "node_obj",
      "target": "node_method",
      "type": "motivates",
      "provenance_type": "explicit",
      "label": "short description"
    }
  ],
  "gaps": [
    {
      "field_id": "field_weight_init",
      "field_name": "Weight Initialization Scheme",
      "category": "model_architecture",
      "status": "not_found",
      "missing_explanation": "...",
      "why_it_matters": "...",
      "examined_sections": ["Section 3", "Section 5"],
      "recommended_actions": ["check repository", "..."],
      "suggested_candidate_value": "...",
      "candidate_rationale": "...",
      "candidate_source": "..."
    }
  ]
}
"""

class ExtractionService:
    def __init__(self):
        self.llm_client = LLMClient()

    def analyze_document(
        self,
        paper_id: str,
        filename: str,
        title: str,
        pages: List[DocumentPage]
    ) -> AnalysisResult:
        """
        Runs live extraction pipeline on the uploaded document pages.
        Enforces real extraction: if no LLM API key is configured, raises LLMException
        with direct instructions on obtaining and setting a key.
        """
        total_pages = len(pages)
        created_at = "2026-10-15T12:00:00Z"

        if not self.llm_client.is_configured():
            raise LLMException(
                "LLM API Key Required: To extract and verify an experiment blueprint from this uploaded PDF in real time, "
                "please enter a Google Gemini API Key (free from Google AI Studio: https://aistudio.google.com/app/apikey) "
                "or OpenAI API Key in the Settings panel."
            )

        # Build prompt from page texts (truncate if extremely large to fit model context)
        document_text_blocks = []
        for p in pages[:25]:  # Process up to first 25 pages
            document_text_blocks.append(f"--- PAGE {p.page_index} ---\n{p.text[:3000]}")

        combined_text = "\n\n".join(document_text_blocks)
        user_prompt = f"Analyze this paper: '{title}'.\nDocument Pages:\n{combined_text}"

        try:
            raw_json = self.llm_client.generate_json_response(SYSTEM_EXTRACTION_PROMPT, user_prompt)
        except Exception as e:
            raise LLMException(f"Model extraction failed: {str(e)}")

        # Parse overview
        overview_data = raw_json.get("overview", {})
        overview = PaperOverview(
            research_problem=overview_data.get("research_problem", "Not explicitly identified."),
            motivation_and_method=overview_data.get("motivation_and_method", "Not explicitly identified."),
            main_architecture=overview_data.get("main_architecture", "Not explicitly identified."),
            main_results=overview_data.get("main_results", "Not explicitly identified."),
            limitations_and_questions=overview_data.get("limitations_and_questions", "None reported in examined text.")
        )

        # Parse blueprint fields
        fields: List[BlueprintField] = []
        for idx, f in enumerate(raw_json.get("fields", [])):
            evidence_items = []
            for e_idx, ev in enumerate(f.get("evidence", [])):
                evidence_items.append(
                    EvidenceItem(
                        evidence_id=f"ev_{idx}_{e_idx}",
                        page_index=int(ev.get("page_index", 0)),
                        section=ev.get("section", "Main Text"),
                        quote=ev.get("quote", ""),
                        quote_match=False,
                        semantic_support="needs_review"
                    )
                )

            fields.append(
                BlueprintField(
                    id=f.get("id", f"field_{idx}"),
                    name=f.get("name", f"Field {idx}"),
                    category=f.get("category", "training_setup"),
                    value=f.get("value"),
                    status=f.get("status", "not_found"),
                    document_id=paper_id,
                    evidence=evidence_items,
                    notes=f.get("notes", []),
                    relationships=f.get("relationships", [])
                )
            )

        # Validate evidence against extracted pages
        validated_fields = EvidenceValidator.validate_all_fields(fields, pages)

        # Parse graph nodes and edges
        nodes = [
            GraphNode(
                id=n.get("id", f"node_{i}"),
                type=n.get("type", "method"),
                label=n.get("label", "Concept"),
                status=n.get("status", "reported"),
                value=n.get("value"),
                evidence_ids=n.get("evidence_ids", [])
            ) for i, n in enumerate(raw_json.get("nodes", []))
        ]

        edges = [
            GraphEdge(
                id=e.get("id", f"edge_{i}"),
                source=e.get("source"),
                target=e.get("target"),
                type=e.get("type", "depends_on"),
                provenance_type=e.get("provenance_type", "inferred"),
                label=e.get("label")
            ) for i, e in enumerate(raw_json.get("edges", []))
        ]

        graph = ResearchGraph(document_id=paper_id, nodes=nodes, edges=edges)

        # Parse gaps
        gaps = [
            GapItem(
                field_id=g.get("field_id", f"gap_{i}"),
                field_name=g.get("field_name", "Unresolved Parameter"),
                category=g.get("category", "training_setup"),
                status=g.get("status", "not_found"),
                missing_explanation=g.get("missing_explanation", "Value not found in examined text."),
                why_it_matters=g.get("why_it_matters", "Critical for matching optimization trajectory."),
                examined_sections=g.get("examined_sections", ["Main Text"]),
                recommended_actions=g.get("recommended_actions", ["Check repository or appendix"]),
                suggested_candidate_value=g.get("suggested_candidate_value"),
                candidate_rationale=g.get("candidate_rationale"),
                candidate_source=g.get("candidate_source")
            ) for i, g in enumerate(raw_json.get("gaps", []))
        ]

        reported_count = sum(1 for f in validated_fields if f.status == "reported")

        metadata = PaperMetadata(
            paper_id=paper_id,
            filename=filename,
            title=title,
            page_count=total_pages,
            created_at=created_at,
            status="analyzed",
            is_sample_demo=False,
            overview=overview,
            total_fields=len(validated_fields),
            reported_fields=reported_count,
            unresolved_gaps=len(gaps)
        )

        return AnalysisResult(
            paper_id=paper_id,
            metadata=metadata,
            overview=overview,
            blueprint=validated_fields,
            graph=graph,
            gaps=gaps
        )
