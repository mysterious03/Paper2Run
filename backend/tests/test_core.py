import pytest
from app.schemas.models import BlueprintField, EvidenceItem, DocumentPage
from app.services.evidence_validation import EvidenceValidator
from app.services.sample_data import get_sample_analysis, get_sample_document_pages
from app.services.export_service import ExportService
from app.services.learning import LearningService

def test_evidence_quote_matching():
    pages = [
        DocumentPage(
            page_index=0,
            text="We trained using the Adam optimizer with beta_1 = 0.9 and beta_2 = 0.98.",
            char_count=70,
            has_text=True
        )
    ]

    field = BlueprintField(
        id="f1",
        name="Optimizer",
        category="optimizer",
        value="Adam",
        status="reported",
        document_id="p1",
        evidence=[
            EvidenceItem(
                evidence_id="ev1",
                page_index=0,
                quote="Adam optimizer with beta_1 = 0.9",
                quote_match=False
            )
        ]
    )

    validated = EvidenceValidator.validate_field_evidence(field, pages, total_pages=1)
    assert validated.evidence[0].quote_match is True
    assert validated.evidence[0].semantic_support in ["verified", "supported"]

def test_evidence_quote_mismatch():
    pages = [
        DocumentPage(
            page_index=0,
            text="We evaluated on ImageNet dataset.",
            char_count=35,
            has_text=True
        )
    ]

    field = BlueprintField(
        id="f2",
        name="Dataset",
        category="dataset",
        value="CIFAR-10",
        status="reported",
        document_id="p1",
        evidence=[
            EvidenceItem(
                evidence_id="ev2",
                page_index=0,
                quote="We evaluated on CIFAR-10 dataset.",
                quote_match=False
            )
        ]
    )

    validated = EvidenceValidator.validate_field_evidence(field, pages, total_pages=1)
    assert validated.evidence[0].quote_match is False
    assert validated.evidence[0].semantic_support == "needs_review"

def test_sample_analysis_integrity():
    sample = get_sample_analysis()
    assert sample.paper_id == "sample_vaswani_transformer_2017"
    assert len(sample.blueprint) >= 10
    assert len(sample.gaps) >= 2
    assert sample.graph.nodes
    assert sample.graph.edges

def test_export_service_generation():
    sample = get_sample_analysis()
    md = ExportService.generate_markdown_report(sample)
    assert "Paper2Run Reproduction Blueprint" in md
    assert "Executive Research Overview" in md
    assert "Unresolved Reproduction Gaps" in md

    js = ExportService.generate_json_blueprint(sample)
    assert "sample_vaswani_transformer_2017" in js

    yml = ExportService.generate_yaml_blueprint(sample)
    assert "sample_vaswani_transformer_2017" in yml

    chk = ExportService.generate_checklist_markdown(sample)
    assert "Reproduction Checklist" in chk

def test_learning_service_levels():
    sample = get_sample_analysis()
    opt_field = next(f for f in sample.blueprint if f.category == "optimizer")
    service = LearningService()

    exp_beginner = service.explain_field(opt_field, "beginner")
    assert exp_beginner.explanation_level == "beginner"
    assert "Adam" in exp_beginner.content

    exp_technical = service.explain_field(opt_field, "technical")
    assert exp_technical.explanation_level == "technical"
    assert "beta2=0.98" in exp_technical.content or "beta_2" in exp_technical.content or "Adam" in exp_technical.content

    exp_math = service.explain_field(opt_field, "math")
    assert exp_math.explanation_level == "math"
    assert exp_math.math_formulation is not None
