from pathlib import Path
from app.services.pdf_parser import PDFParser
from app.services.evidence_validation import EvidenceValidator
from app.schemas.models import BlueprintField, EvidenceItem

def test_real_pdf_parsing():
    sample_pdf_path = Path(__file__).parent.parent / "sample_papers" / "attention_sample.pdf"
    assert sample_pdf_path.exists()

    title, pages, is_scanned, msg = PDFParser.parse_pdf(sample_pdf_path)
    assert len(pages) == 3
    assert not is_scanned
    assert "Attention Is All You Need" in title or "Attention" in pages[0].text

    # Verify that text from page 2 (index 1) has architecture details
    assert "N = 6 identical layers" in pages[1].text

    # Verify quote matching on page 3 (index 2)
    assert "Adam optimizer" in pages[2].text
    field = BlueprintField(
        id="f_opt",
        name="Optimizer",
        category="optimizer",
        value="Adam",
        status="reported",
        document_id="sample_doc",
        evidence=[
            EvidenceItem(
                evidence_id="ev_opt",
                page_index=2,
                quote="Adam optimizer with beta_1 = 0.9",
                quote_match=False
            )
        ]
    )

    validated = EvidenceValidator.validate_field_evidence(field, pages, total_pages=len(pages))
    assert validated.evidence[0].quote_match is True
