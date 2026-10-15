import re
from typing import List
from ..schemas.models import BlueprintField, EvidenceItem, DocumentPage

class EvidenceValidator:
    @staticmethod
    def normalize_text(text: str) -> str:
        """Lowercases, removes special punctuation, and collapses consecutive whitespace."""
        if not text:
            return ""
        # Collapse whitespace and newlines
        text = re.sub(r'\s+', ' ', text)
        return text.strip().lower()

    @classmethod
    def validate_field_evidence(
        cls,
        field: BlueprintField,
        pages: List[DocumentPage],
        total_pages: int
    ) -> BlueprintField:
        """
        Validates evidence quotes against the exact extracted text for the stated page.
        Distinguishes quote matching from semantic verification.
        """
        validated_evidence: List[EvidenceItem] = []

        for ev in field.evidence:
            # 1. Page index check
            if ev.page_index < 0 or ev.page_index >= total_pages:
                ev.quote_match = False
                ev.semantic_support = "unsupported"
                ev.notes = f"Invalid page reference: Page {ev.page_index + 1} exceeds document length ({total_pages} pages)."
                validated_evidence.append(ev)
                continue

            page_text = pages[ev.page_index].text if ev.page_index < len(pages) else ""
            norm_page_text = cls.normalize_text(page_text)
            norm_quote = cls.normalize_text(ev.quote)

            if not norm_quote:
                ev.quote_match = False
                ev.semantic_support = "needs_review"
                ev.notes = "Quotation was empty or not provided."
                validated_evidence.append(ev)
                continue

            # 2. Strict / normalized substring search on stated page
            if norm_quote in norm_page_text:
                ev.quote_match = True
                # Quote exists, but semantic support still requires human verification unless explicitly proven
                if ev.semantic_support not in ["verified", "supported"]:
                    ev.semantic_support = "supported"
                ev.notes = f"Verifiable quote match found on page {ev.page_index + 1}."
            else:
                # 3. Check adjacent pages (off-by-one check common in page citations)
                found_adjacent = False
                for adj_idx in [ev.page_index - 1, ev.page_index + 1]:
                    if 0 <= adj_idx < total_pages:
                        adj_text = cls.normalize_text(pages[adj_idx].text)
                        if norm_quote in adj_text:
                            ev.quote_match = True
                            ev.notes = f"Quote match found on adjacent page {adj_idx + 1} rather than stated page {ev.page_index + 1}."
                            ev.page_index = adj_idx
                            ev.semantic_support = "supported"
                            found_adjacent = True
                            break

                if not found_adjacent:
                    ev.quote_match = False
                    ev.semantic_support = "needs_review"
                    ev.notes = f"Quote not found in extracted text of page {ev.page_index + 1}. Requires source inspection."

            validated_evidence.append(ev)

        field.evidence = validated_evidence

        # Validate status consistency
        if field.status == "reported":
            if not field.evidence or not any(e.quote_match for e in field.evidence):
                # If marked reported but no verified quote, flag with note
                if not field.notes:
                    field.notes = []
                field.notes.append("Field is labeled reported, but exact source quotation was not strictly verified in extracted text.")

        return field

    @classmethod
    def validate_all_fields(
        cls,
        fields: List[BlueprintField],
        pages: List[DocumentPage]
    ) -> List[BlueprintField]:
        total_pages = len(pages)
        return [cls.validate_field_evidence(f, pages, total_pages) for f in fields]
