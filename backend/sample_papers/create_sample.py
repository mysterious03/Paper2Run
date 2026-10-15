import os
from pathlib import Path

# Pure-python basic PDF generator to create a genuine valid PDF with extractable text
def create_basic_pdf(filename: Path):
    content = b"""%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R 4 0 R 5 0 R] /Count 3 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 6 0 R /Resources << /Font << /F1 9 0 R >> >> >>
endobj
4 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 7 0 R /Resources << /Font << /F1 9 0 R >> >> >>
endobj
5 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 8 0 R /Resources << /Font << /F1 9 0 R >> >> >>
endobj
6 0 obj
<< /Length 400 >>
stream
BT
/F1 14 Tf
50 720 Td
(Attention Is All You Need) Tj
/F1 10 Tf
0 -30 Td
(Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit) Tj
0 -20 Td
(Abstract: The dominant sequence transduction models are based on RNNs.) Tj
0 -20 Td
(We propose the Transformer, based solely on attention mechanisms.) Tj
0 -40 Td
(1 Introduction) Tj
0 -20 Td
(Recurrent models preclude parallelization within training examples.) Tj
ET
endstream
endobj
7 0 obj
<< /Length 420 >>
stream
BT
/F1 12 Tf
50 720 Td
(3 Model Architecture) Tj
/F1 10 Tf
0 -25 Td
(The encoder is composed of a stack of N = 6 identical layers.) Tj
0 -20 Td
(Each layer has multi-head self-attention and position-wise feed-forward.) Tj
0 -20 Td
(In this work we employ h = 8 parallel attention layers, or heads.) Tj
0 -20 Td
(For each of these we use d_k = d_v = d_model/h = 64.) Tj
ET
endstream
endobj
8 0 obj
<< /Length 520 >>
stream
BT
/F1 12 Tf
50 720 Td
(5 Training and Results) Tj
/F1 10 Tf
0 -25 Td
(We trained on the standard WMT 2014 English-German dataset consisting of 4.5M sentence pairs.) Tj
0 -20 Td
(We used the Adam optimizer with beta_1 = 0.9, beta_2 = 0.98 and epsilon = 10^-9.) Tj
0 -20 Td
(We used warmup_steps = 4000 with inverse square root decay.) Tj
0 -20 Td
(We trained base models on one machine with 8 NVIDIA P100 GPUs.) Tj
0 -20 Td
(On WMT 2014 En-De, the Transformer achieves 28.4 BLEU.) Tj
ET
endstream
endobj
9 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 10
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000125 00000 n 
0000000244 00000 n 
0000000363 00000 n 
0000000482 00000 n 
0000000936 00000 n 
0000001410 00000 n 
0000001984 00000 n 
trailer
<< /Size 10 /Root 1 0 R >>
startxref
2051
%%EOF
"""
    filename.parent.mkdir(parents=True, exist_ok=True)
    with open(filename, "wb") as f:
        f.write(content)
    print(f"Generated genuine valid PDF: {filename}")

if __name__ == "__main__":
    out_file = Path(__file__).parent / "attention_sample.pdf"
    create_basic_pdf(out_file)
