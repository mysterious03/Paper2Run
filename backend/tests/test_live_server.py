import requests
import json
from pathlib import Path

BASE_URL = "http://127.0.0.1:8000/api"

def test_live_server():
    print("--- 1. Testing Health Check ---")
    r = requests.get(f"{BASE_URL}/health")
    assert r.status_code == 200, f"Health check failed: {r.text}"
    health = r.json()
    print(f"Health Response: {health}")

    print("\n--- 2. Testing Sample Demo Fetch ---")
    r = requests.get(f"{BASE_URL}/sample")
    assert r.status_code == 200
    sample = r.json()
    paper_id = sample["paper_id"]
    print(f"Paper Title: {sample['metadata']['title']}")
    print(f"Blueprint fields: {len(sample['blueprint'])}")
    print(f"Gaps identified: {len(sample['gaps'])}")
    assert len(sample["blueprint"]) >= 10
    assert len(sample["gaps"]) >= 2

    print("\n--- 3. Testing 3-Tier Explanations (Beginner, Technical, Math) ---")
    for lvl in ["beginner", "technical", "math"]:
        payload = {"field_id": "field_optimizer", "level": lvl}
        r = requests.post(f"{BASE_URL}/papers/{paper_id}/explain", json=payload)
        assert r.status_code == 200
        res = r.json()
        print(f"[{lvl.upper()}] {res['summary']}")
        assert res["explanation_level"] == lvl
        if lvl == "math":
            assert res["math_formulation"] is not None

    print("\n--- 4. Testing Multi-format Exports ---")
    r_md = requests.get(f"{BASE_URL}/papers/{paper_id}/export?format=markdown")
    assert r_md.status_code == 200
    assert "Paper2Run Reproduction Blueprint" in r_md.text
    print(f"Markdown report generated: {len(r_md.text)} bytes")

    r_json = requests.get(f"{BASE_URL}/papers/{paper_id}/export?format=json")
    assert r_json.status_code == 200
    data_json = r_json.json()
    assert data_json["paper_id"] == paper_id
    print(f"JSON blueprint generated: {len(r_json.text)} bytes")

    r_chk = requests.get(f"{BASE_URL}/papers/{paper_id}/export?format=checklist")
    assert r_chk.status_code == 200
    assert "Reproduction Checklist" in r_chk.text
    print(f"Checklist generated: {len(r_chk.text)} bytes")

    print("\n--- 5. Testing Real PDF Upload & Extraction ---")
    pdf_path = Path(__file__).parent.parent / "sample_papers" / "attention_sample.pdf"
    assert pdf_path.exists(), f"PDF not found: {pdf_path}"

    with open(pdf_path, "rb") as f:
        r_upload = requests.post(f"{BASE_URL}/papers", files={"file": ("attention_sample.pdf", f, "application/pdf")})
    assert r_upload.status_code == 200, f"Upload failed: {r_upload.text}"
    uploaded_result = r_upload.json()
    uploaded_id = uploaded_result["paper_id"]
    print(f"Uploaded Paper ID: {uploaded_id}")
    print(f"Extracted Title: {uploaded_result['metadata']['title']}")
    print(f"Pages Parsed: {uploaded_result['metadata']['page_count']}")
    assert uploaded_result["metadata"]["page_count"] == 3

    print("\n=== ALL LIVE ENDPOINTS VERIFIED SUCCESSFULLY ===")

if __name__ == "__main__":
    test_live_server()
