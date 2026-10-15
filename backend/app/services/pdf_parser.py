import re
from pathlib import Path
from typing import List, Tuple
from ..schemas.models import DocumentPage

class PDFParseException(Exception):
    pass

class PDFParser:
    @staticmethod
    def parse_pdf(file_path: Path) -> Tuple[str, List[DocumentPage], bool, str]:
        """
        Parses a PDF file page-by-page.
        Attempts PyMuPDF first; seamlessly falls back to pypdf if DLLs or fitz are blocked.
        Returns: (title, list of DocumentPage, is_scanned_or_empty, status_message)
        """
        if not file_path.exists():
            raise PDFParseException(f"File not found: {file_path}")

        # Attempt with PyMuPDF (fitz)
        try:
            import fitz
            doc = fitz.open(file_path)
            total_pages = len(doc)
            pages: List[DocumentPage] = []
            total_chars = 0

            for idx in range(total_pages):
                text = doc[idx].get_text("text") or ""
                cleaned = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', text)
                char_count = len(cleaned.strip())
                total_chars += char_count
                pages.append(DocumentPage(
                    page_index=idx,
                    text=cleaned,
                    char_count=char_count,
                    has_text=char_count > 40
                ))

            meta_title = doc.metadata.get("title", "") if doc.metadata else ""
            doc.close()
            return PDFParser._finalize_parsing(file_path, pages, total_chars, total_pages, meta_title)
        except Exception:
            # Fallback to pure-Python pypdf
            return PDFParser._parse_with_pypdf(file_path)

    @staticmethod
    def _parse_with_pypdf(file_path: Path) -> Tuple[str, List[DocumentPage], bool, str]:
        try:
            from pypdf import PdfReader
            reader = PdfReader(file_path)
            total_pages = len(reader.pages)
            pages: List[DocumentPage] = []
            total_chars = 0

            for idx in range(total_pages):
                page = reader.pages[idx]
                text = page.extract_text() or ""
                cleaned = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', text)
                char_count = len(cleaned.strip())
                total_chars += char_count
                pages.append(DocumentPage(
                    page_index=idx,
                    text=cleaned,
                    char_count=char_count,
                    has_text=char_count > 40
                ))

            meta_title = ""
            if reader.metadata and reader.metadata.title:
                meta_title = reader.metadata.title

            return PDFParser._finalize_parsing(file_path, pages, total_chars, total_pages, meta_title)
        except Exception as e:
            raise PDFParseException(f"Failed to parse PDF document: {str(e)}")

    @staticmethod
    def _finalize_parsing(
        file_path: Path,
        pages: List[DocumentPage],
        total_chars: int,
        total_pages: int,
        meta_title: str
    ) -> Tuple[str, List[DocumentPage], bool, str]:
        if total_pages == 0:
            return "Empty Document", [], True, "Document has 0 pages."

        avg_chars = total_chars / total_pages if total_pages > 0 else 0
        is_scanned_or_empty = False
        status_message = "Parsed successfully"

        if total_chars == 0:
            is_scanned_or_empty = True
            status_message = "No text content detected. This appears to be an empty or scanned image-only PDF."
        elif avg_chars < 80:
            is_scanned_or_empty = True
            status_message = f"Low text density detected (avg {int(avg_chars)} chars/page). This may be a scanned or image-based PDF requiring OCR."

        extracted_title = ""
        if meta_title and len(meta_title.strip()) > 3:
            extracted_title = meta_title.strip()
        elif pages and pages[0].text:
            lines = [l.strip() for l in pages[0].text.split("\n") if len(l.strip()) > 4]
            if lines:
                extracted_title = lines[0]
                if len(extracted_title) < 15 and len(lines) > 1:
                    extracted_title += f" {lines[1]}"

        if not extracted_title:
            extracted_title = file_path.stem.replace("_", " ").title()

        return extracted_title, pages, is_scanned_or_empty, status_message
