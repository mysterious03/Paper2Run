from ..schemas.models import (
    AnalysisResult,
    PaperMetadata,
    PaperOverview,
    BlueprintField,
    EvidenceItem,
    ResearchGraph,
    GraphNode,
    GraphEdge,
    GapItem,
    DocumentPage
)

def get_sample_analysis() -> AnalysisResult:
    paper_id = "sample_vaswani_transformer_2017"

    overview = PaperOverview(
        research_problem="Dominant sequence transduction models rely on complex recurrent or convolutional neural networks with encoder-decoder attention. Recurrent networks inherently preclude parallelization within training examples, creating severe computational bottlenecks for long sequences.",
        motivation_and_method="The Transformer eschews recurrence and convolutions entirely, relying solely on multi-head self-attention mechanisms to draw global dependencies between input and output representations in constant time.",
        main_architecture="Encoder-decoder architecture with 6 stacked layers each. Each layer has two sub-layers: multi-head self-attention and a point-wise fully connected feed-forward network, augmented with residual connections and layer normalization (d_model=512, 8 attention heads, d_ff=2048).",
        main_results="Transformer (base) achieves 27.3 BLEU on WMT 2014 English-to-German, outperforming previous ensembles. Big model achieves state-of-the-art 28.4 BLEU on En-De and 41.8 BLEU on En-Fr with drastically reduced training cost (3.5 days on 8 P100 GPUs).",
        limitations_and_questions="Quadratic computational and memory complexity with respect to sequence length in self-attention. Weight initialization distributions and precise numerical learning rate peak constants are omitted from the main text, creating implementation ambiguity."
    )

    metadata = PaperMetadata(
        paper_id=paper_id,
        filename="attention_is_all_you_need.pdf",
        title="Attention Is All You Need (Vaswani et al., 2017)",
        page_count=15,
        created_at="2026-10-15T12:00:00Z",
        status="analyzed",
        is_sample_demo=True,
        overview=overview,
        total_fields=14,
        reported_fields=11,
        unresolved_gaps=3
    )

    blueprint: list[BlueprintField] = [
        BlueprintField(
            id="field_dataset",
            name="Training Dataset",
            category="dataset",
            value="WMT 2014 English-to-German (4.5M pairs) & English-to-French (36M pairs)",
            status="reported",
            document_id=paper_id,
            evidence=[
                EvidenceItem(
                    evidence_id="ev_data_1",
                    page_index=6,
                    section="5.1 Training Data and Batching",
                    quote="We trained on the standard WMT 2014 English-German dataset consisting of about 4.5 million sentence pairs. Sentences were encoded using byte-pair encoding, which has a shared source-target vocabulary of about 37000 tokens.",
                    quote_match=True,
                    semantic_support="verified"
                )
            ],
            notes=["Tokens split using Byte-Pair Encoding (BPE)."],
            relationships=["node_dataset", "edge_trained_on"]
        ),
        BlueprintField(
            id="field_preprocessing",
            name="Preprocessing & Tokenization",
            category="preprocessing",
            value="Byte-Pair Encoding (BPE) with shared 37k vocabulary for En-De; 32k word-piece for En-Fr",
            status="reported",
            document_id=paper_id,
            evidence=[
                EvidenceItem(
                    evidence_id="ev_prep_1",
                    page_index=6,
                    section="5.1 Training Data and Batching",
                    quote="Sentences were encoded using byte-pair encoding, which has a shared source-target vocabulary of about 37000 tokens. For English-French, we used the significantly larger WMT 2014 English-French dataset consisting of 36M sentences and split tokens into a 32000 word-piece vocabulary.",
                    quote_match=True,
                    semantic_support="verified"
                )
            ],
            notes=[],
            relationships=["node_preprocessing", "edge_preprocessed_with"]
        ),
        BlueprintField(
            id="field_architecture",
            name="Model Architecture",
            category="model_architecture",
            value="Transformer Encoder-Decoder (6 layers, d_model=512, 8 heads, d_ff=2048)",
            status="reported",
            document_id=paper_id,
            evidence=[
                EvidenceItem(
                    evidence_id="ev_arch_1",
                    page_index=2,
                    section="3.1 Encoder and Decoder Stacks",
                    quote="The encoder is composed of a stack of N = 6 identical layers. Each layer has two sub-layers. The first is a multi-head self-attention mechanism, and the second is a simple, position-wise fully connected feed-forward network.",
                    quote_match=True,
                    semantic_support="verified"
                ),
                EvidenceItem(
                    evidence_id="ev_arch_2",
                    page_index=3,
                    section="3.2.2 Multi-Head Attention",
                    quote="In this work we employ h = 8 parallel attention layers, or heads. For each of these we use d_k = d_v = d_model/h = 64.",
                    quote_match=True,
                    semantic_support="verified"
                )
            ],
            notes=["Base model settings: N=6, d_model=512, d_ff=2048, h=8, d_k=d_v=64."],
            relationships=["node_model_arch", "edge_uses_arch"]
        ),
        BlueprintField(
            id="field_optimizer",
            name="Optimizer",
            category="optimizer",
            value="Adam (beta1=0.9, beta2=0.98, epsilon=1e-9)",
            status="reported",
            document_id=paper_id,
            evidence=[
                EvidenceItem(
                    evidence_id="ev_opt_1",
                    page_index=7,
                    section="5.3 Optimizer",
                    quote="We used the Adam optimizer with beta_1 = 0.9, beta_2 = 0.98 and epsilon = 10^-9.",
                    quote_match=True,
                    semantic_support="verified"
                )
            ],
            notes=["Note that beta_2=0.98 is non-standard (typical PyTorch default is 0.999)."],
            relationships=["node_optimizer", "edge_optimized_with"]
        ),
        BlueprintField(
            id="field_lr_schedule",
            name="Learning Rate Schedule",
            category="learning_rate_schedule",
            value="Inverse square-root decay with 4000 warmup steps",
            status="reported",
            document_id=paper_id,
            evidence=[
                EvidenceItem(
                    evidence_id="ev_lr_1",
                    page_index=7,
                    section="5.3 Optimizer",
                    quote="We varied the learning rate over the course of training, according to the formula: lrate = d_model^(-0.5) * min(step_num^(-0.5), step_num * warmup_steps^(-1.5)). This corresponds to increasing the learning rate linearly for the first warmup_steps training steps, and decreasing it thereafter proportionally to the inverse square root of the step number. We used warmup_steps = 4000.",
                    quote_match=True,
                    semantic_support="verified"
                )
            ],
            notes=["Formula relies on d_model^-0.5 scaling factor."],
            relationships=["node_lr_schedule", "edge_uses_schedule"]
        ),
        BlueprintField(
            id="field_batch_size",
            name="Batch Size & Tokens",
            category="training_setup",
            value="Batched by sentence pairs containing approx 25,000 source tokens and 25,000 target tokens",
            status="reported",
            document_id=paper_id,
            evidence=[
                EvidenceItem(
                    evidence_id="ev_batch_1",
                    page_index=6,
                    section="5.1 Training Data and Batching",
                    quote="Sentence pairs were batched together by approximate sequence length. Each training batch contained a set of sentence pairs containing approximately 25000 source tokens and 25000 target tokens.",
                    quote_match=True,
                    semantic_support="verified"
                )
            ],
            notes=[],
            relationships=["node_training_setup"]
        ),
        BlueprintField(
            id="field_training_duration",
            name="Training Duration & Steps",
            category="training_setup",
            value="100,000 steps (12 hours) for base model; 300,000 steps (3.5 days) for big model",
            status="reported",
            document_id=paper_id,
            evidence=[
                EvidenceItem(
                    evidence_id="ev_time_1",
                    page_index=7,
                    section="5.2 Hardware and Schedule",
                    quote="We trained our base models on one machine with 8 NVIDIA P100 GPUs. For our base models using the hyperparameters described throughout the paper, each training step took about 0.4 seconds. We trained the base models for a total of 100,000 steps or 12 hours. For our big models, step time was 1.0 seconds. The big models were trained for 300,000 steps (3.5 days).",
                    quote_match=True,
                    semantic_support="verified"
                )
            ],
            notes=[],
            relationships=["node_training_setup"]
        ),
        BlueprintField(
            id="field_regularization",
            name="Regularization & Dropout",
            category="training_setup",
            value="Residual dropout P_drop = 0.1, Label smoothing epsilon_ls = 0.1",
            status="reported",
            document_id=paper_id,
            evidence=[
                EvidenceItem(
                    evidence_id="ev_reg_1",
                    page_index=7,
                    section="5.4 Regularization",
                    quote="We apply dropout to the output of each sub-layer, before it is added to the sub-layer input and normalized. In addition, we apply dropout to sums of the embeddings and the positional encodings in both the encoder and decoder stacks. For the base model, we use a rate of P_drop = 0.1. During training, we employed label smoothing of value epsilon_ls = 0.1.",
                    quote_match=True,
                    semantic_support="verified"
                )
            ],
            notes=["Label smoothing hurts perplexity as the model learns to be more unsure, but improves accuracy and BLEU score."],
            relationships=["node_training_setup"]
        ),
        BlueprintField(
            id="field_loss",
            name="Loss Function",
            category="loss",
            value="Cross-entropy with label smoothing (epsilon_ls = 0.1)",
            status="reported",
            document_id=paper_id,
            evidence=[
                EvidenceItem(
                    evidence_id="ev_loss_1",
                    page_index=7,
                    section="5.4 Regularization",
                    quote="During training, we employed label smoothing of value epsilon_ls = 0.1. This hurts perplexity, as the model learns to be more unsure, but improves accuracy and BLEU score.",
                    quote_match=True,
                    semantic_support="verified"
                )
            ],
            notes=["Standard token-level cross-entropy loss over vocabulary."],
            relationships=["node_loss", "edge_uses_loss"]
        ),
        BlueprintField(
            id="field_hardware",
            name="Hardware Environment",
            category="environment",
            value="8 NVIDIA P100 GPUs on a single node",
            status="reported",
            document_id=paper_id,
            evidence=[
                EvidenceItem(
                    evidence_id="ev_hw_1",
                    page_index=7,
                    section="5.2 Hardware and Schedule",
                    quote="We trained our base models on one machine with 8 NVIDIA P100 GPUs.",
                    quote_match=True,
                    semantic_support="verified"
                )
            ],
            notes=["Framework used was Tensor2Tensor / TensorFlow, though not highlighted in main text body."],
            relationships=["node_hardware"]
        ),
        BlueprintField(
            id="field_evaluation_metric",
            name="Evaluation Metric",
            category="evaluation",
            value="BLEU score on WMT 2014 newstest2014 with beam search (beam_size=4, alpha=0.6)",
            status="reported",
            document_id=paper_id,
            evidence=[
                EvidenceItem(
                    evidence_id="ev_eval_1",
                    page_index=8,
                    section="6.1 Machine Translation Results",
                    quote="On the WMT 2014 English-to-German translation task, the big transformer model (Transformer (big) in Table 2) outperforms the best previously reported models (including ensembles) by more than 2.0 BLEU, establishing a new state-of-the-art BLEU score of 28.4.",
                    quote_match=True,
                    semantic_support="verified"
                )
            ],
            notes=["Length penalty parameter alpha = 0.6."],
            relationships=["node_eval_metric", "edge_evaluated_with"]
        ),
        BlueprintField(
            id="field_weight_init",
            name="Weight Initialization Scheme",
            category="model_architecture",
            value=None,
            status="not_found",
            document_id=paper_id,
            evidence=[],
            notes=[
                "Explicit distribution parameters (Xavier uniform vs normal, fan-in/fan-out scaling) for projection matrices are not reported in the main paper text.",
                "Must be resolved from official Tensor2Tensor repository or community replication."
            ],
            relationships=["node_gap_init", "edge_blocked_by"]
        ),
        BlueprintField(
            id="field_lr_peak_constant",
            name="Absolute Numerical Peak Learning Rate",
            category="learning_rate_schedule",
            value=None,
            status="ambiguous",
            document_id=paper_id,
            evidence=[
                EvidenceItem(
                    evidence_id="ev_gap_lr",
                    page_index=7,
                    section="5.3 Optimizer",
                    quote="lrate = d_model^(-0.5) * min(step_num^(-0.5), step_num * warmup_steps^(-1.5))",
                    quote_match=True,
                    semantic_support="needs_review"
                )
            ],
            notes=[
                "Formula is reported, but resulting absolute peak LR (~0.000707 for d_model=512 at step 4000) is not stated numerically.",
                "Different implementations often multiply by a constant learning rate factor."
            ],
            relationships=["node_gap_lr"]
        ),
        BlueprintField(
            id="field_checkpoint_averaging",
            name="Checkpoint Averaging Policy",
            category="evaluation",
            value="Averaged the last 5 checkpoints (written at 10-minute intervals) for base; 20 for big",
            status="reported",
            document_id=paper_id,
            evidence=[
                EvidenceItem(
                    evidence_id="ev_chk_1",
                    page_index=8,
                    section="6.1 Machine Translation Results",
                    quote="For the base models, we used a single model obtained by averaging the last 5 checkpoints, which were written at 10-minute intervals. For the big models, we averaged the last 20 checkpoints.",
                    quote_match=True,
                    semantic_support="verified"
                )
            ],
            notes=["Important: reproducing the exact BLEU score requires weight averaging across multiple consecutive checkpoints."],
            relationships=["node_eval_metric"]
        )
    ]

    nodes: list[GraphNode] = [
        GraphNode(id="node_obj", type="research_objective", label="Parallel Sequence Transduction", status="reported", value="Eliminate recurrence bottleneck"),
        GraphNode(id="node_method", type="method", label="Multi-Head Self-Attention", status="reported", value="Constant O(1) sequential operations"),
        GraphNode(id="node_model_arch", type="model_architecture", label="Transformer (6 enc, 6 dec)", status="reported", value="d_model=512, h=8, d_ff=2048"),
        GraphNode(id="node_dataset", type="dataset", label="WMT 2014 En-De & En-Fr", status="reported", value="4.5M / 36M sentence pairs"),
        GraphNode(id="node_preprocessing", type="preprocessing_step", label="Shared BPE (37k vocab)", status="reported", value="Byte-Pair Encoding"),
        GraphNode(id="node_optimizer", type="optimizer", label="Adam Optimizer", status="reported", value="beta1=0.9, beta2=0.98, eps=1e-9"),
        GraphNode(id="node_lr_schedule", type="learning_rate_schedule", label="Inverse Sqrt Warmup", status="reported", value="4000 warmup steps"),
        GraphNode(id="node_loss", type="loss_function", label="Cross-Entropy + Label Smoothing", status="reported", value="epsilon_ls = 0.1"),
        GraphNode(id="node_training_setup", type="training_procedure", label="25k Token Batches (8x P100)", status="reported", value="100k steps base"),
        GraphNode(id="node_eval_metric", type="evaluation_metric", label="BLEU Score (newstest2014)", status="reported", value="28.4 BLEU En-De (Big)"),
        GraphNode(id="node_gap_init", type="reproduction_gap", label="Weight Initialization Distribution", status="not_found", value="Omitted in main text"),
        GraphNode(id="node_gap_lr", type="reproduction_gap", label="Peak LR Constant Scaling", status="ambiguous", value="Formula given without explicit scalar factor")
    ]

    edges: list[GraphEdge] = [
        GraphEdge(id="e1", source="node_obj", target="node_method", type="motivates", provenance_type="explicit", label="motivates elimination of RNNs"),
        GraphEdge(id="e2", source="node_method", target="node_model_arch", type="uses_method", provenance_type="explicit", label="core attention blocks"),
        GraphEdge(id="e3", source="node_dataset", target="node_preprocessing", type="preprocessed_with", provenance_type="explicit", label="tokenized via BPE"),
        GraphEdge(id="e4", source="node_model_arch", target="node_training_setup", type="trained_on", provenance_type="explicit", label="trained on WMT 2014"),
        GraphEdge(id="e5", source="node_training_setup", target="node_optimizer", type="optimized_with", provenance_type="explicit", label="Adam optimization"),
        GraphEdge(id="e6", source="node_optimizer", target="node_lr_schedule", type="uses_schedule", provenance_type="explicit", label="inverse sqrt decay"),
        GraphEdge(id="e7", source="node_training_setup", target="node_loss", type="uses_loss", provenance_type="explicit", label="smoothed cross-entropy"),
        GraphEdge(id="e8", source="node_model_arch", target="node_eval_metric", type="evaluated_with", provenance_type="explicit", label="evaluated by BLEU"),
        GraphEdge(id="e9", source="node_model_arch", target="node_gap_init", type="blocked_by", provenance_type="inferred", label="unspecified weight init variance"),
        GraphEdge(id="e10", source="node_lr_schedule", target="node_gap_lr", type="blocked_by", provenance_type="inferred", label="implicit peak multiplier")
    ]

    graph = ResearchGraph(document_id=paper_id, nodes=nodes, edges=edges)

    gaps: list[GapItem] = [
        GapItem(
            field_id="field_weight_init",
            field_name="Weight Initialization Scheme",
            category="model_architecture",
            status="not_found",
            missing_explanation="The paper states that weights are initialized according to specific distributions, but the exact standard deviation, Glorot/Xavier uniform bounds, or projection scaling are omitted from the main text.",
            why_it_matters="In deep Transformer models with residual connections, layer normalization and self-attention can cause gradient vanishing or exploding during the first few warmup iterations if initialization variance is incorrect.",
            examined_sections=["Section 3.1 Encoder and Decoder Stacks", "Section 5.3 Optimizer", "Section 5.4 Regularization"],
            recommended_actions=[
                "Check official Tensor2Tensor repository source code (trax/tensor2tensor model definition).",
                "Inspect standard PyTorch nn.Transformer default initialization (Xavier uniform with gain=1.0).",
                "Apply Xavier uniform to attention projection weights, normal distribution (0, 0.02) to embeddings."
            ],
            suggested_candidate_value="nn.init.xavier_uniform_(weight) with gain=1.0 for linear layers; normal(mean=0.0, std=0.02) for embeddings",
            candidate_rationale="Widely verified convention used in the official Tensor2Tensor release and HuggingFace Transformers reproduction.",
            candidate_source="Official Tensor2Tensor repository (github.com/tensorflow/tensor2tensor)"
        ),
        GapItem(
            field_id="field_lr_peak_constant",
            field_name="Absolute Numerical Peak Learning Rate",
            category="learning_rate_schedule",
            status="ambiguous",
            missing_explanation="The learning rate schedule is specified via formula lrate = d_model^(-0.5) * min(step^(-0.5), step * warmup^(-1.5)), but the paper does not state whether a base learning rate scalar multiplier (e.g. 1.0 or 2.0) is applied.",
            why_it_matters="For d_model=512 and warmup=4000, pure formula evaluation yields peak lr = 1/(sqrt(512)*sqrt(4000)) ≈ 0.000707. If an implementer mistakenly applies a default Adam lr of 0.001 as a multiplier, the effective learning rate becomes ~7e-7, causing training failure.",
            examined_sections=["Section 5.3 Optimizer", "Table 2 Hyperparameters"],
            recommended_actions=[
                "Explicitly verify that your optimizer scheduler does NOT multiply by the default base lr if using the exact raw Vaswani formula.",
                "Confirm peak lr reaches ~7.07e-4 at step 4000 before initiating full 100k run."
            ],
            suggested_candidate_value="Peak learning rate ≈ 0.000707 at step 4000 (raw formula with scale factor 1.0)",
            candidate_rationale="Direct algebraic evaluation of Vaswani equation (3) at step_num = warmup_steps = 4000.",
            candidate_source="Equation (3) algebraic derivation"
        ),
        GapItem(
            field_id="field_gradient_accumulation",
            field_name="Gradient Accumulation Steps",
            category="training_setup",
            status="not_found",
            missing_explanation="The paper reports batch size as approximately 25,000 source and 25,000 target tokens across 8 P100 GPUs, but does not state the per-GPU micro-batch size or whether gradient accumulation was applied.",
            why_it_matters="Modern consumer GPUs with 16GB-24GB VRAM cannot fit 25,000 tokens in a single forward/backward pass without Out-Of-Memory (OOM) errors unless micro-batching with gradient accumulation is used.",
            examined_sections=["Section 5.1 Training Data and Batching", "Section 5.2 Hardware and Schedule"],
            recommended_actions=[
                "Compute micro-batch size based on available VRAM (e.g., 2048 or 4096 tokens per step).",
                "Set gradient accumulation steps = total_target_tokens / (micro_batch * num_gpus)."
            ],
            suggested_candidate_value="Micro-batch size: 3125 tokens per GPU across 8 GPUs, or accumulate gradients over 8 steps on a single GPU",
            candidate_rationale="Maintains the exact effective batch size (25,000 tokens) required to match the optimization dynamics.",
            candidate_source="Reproduction best practice"
        )
    ]

    return AnalysisResult(
        paper_id=paper_id,
        metadata=metadata,
        overview=overview,
        blueprint=blueprint,
        graph=graph,
        gaps=gaps
    )

def get_sample_document_pages() -> list[DocumentPage]:
    """Returns synthetic document pages matching the sample paper for quote matching testing."""
    sample = get_sample_analysis()
    pages_text = [
        # Page 0: Title & Abstract
        "Attention Is All You Need\nAshish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin\nAbstract\nThe dominant sequence transduction models are based on complex recurrent or convolutional neural networks...",
        # Page 1: Introduction
        "1 Introduction\nRecurrent neural networks, long short-term memory and gated recurrent neural networks in particular, have been firmly established as state of the art approaches...",
        # Page 2: Architecture
        "3 Model Architecture\n3.1 Encoder and Decoder Stacks\nThe encoder is composed of a stack of N = 6 identical layers. Each layer has two sub-layers. The first is a multi-head self-attention mechanism, and the second is a simple, position-wise fully connected feed-forward network...",
        # Page 3: Attention
        "3.2 Attention\n3.2.2 Multi-Head Attention\nIn this work we employ h = 8 parallel attention layers, or heads. For each of these we use d_k = d_v = d_model/h = 64...",
        # Page 4: Positional Encoding
        "3.5 Positional Encoding\nSince our model contains no recurrence and no convolution, in order for the model to make use of the order of the sequence, we must inject some information about the relative or absolute positions of the tokens...",
        # Page 5: Why Self-Attention
        "4 Why Self-Attention\nIn this section we compare various aspects of self-attention layers to the recurrent and convolutional layers commonly used for mapping one variable-length sequence...",
        # Page 6: Training Data
        "5 Training\n5.1 Training Data and Batching\nWe trained on the standard WMT 2014 English-German dataset consisting of about 4.5 million sentence pairs. Sentences were encoded using byte-pair encoding, which has a shared source-target vocabulary of about 37000 tokens. For English-French, we used the significantly larger WMT 2014 English-French dataset consisting of 36M sentences and split tokens into a 32000 word-piece vocabulary. Sentence pairs were batched together by approximate sequence length. Each training batch contained a set of sentence pairs containing approximately 25000 source tokens and 25000 target tokens...",
        # Page 7: Optimizer & Regularization
        "5.2 Hardware and Schedule\nWe trained our base models on one machine with 8 NVIDIA P100 GPUs. For our base models using the hyperparameters described throughout the paper, each training step took about 0.4 seconds. We trained the base models for a total of 100,000 steps or 12 hours. For our big models, step time was 1.0 seconds. The big models were trained for 300,000 steps (3.5 days).\n5.3 Optimizer\nWe used the Adam optimizer with beta_1 = 0.9, beta_2 = 0.98 and epsilon = 10^-9. We varied the learning rate over the course of training, according to the formula: lrate = d_model^(-0.5) * min(step_num^(-0.5), step_num * warmup_steps^(-1.5)). This corresponds to increasing the learning rate linearly for the first warmup_steps training steps, and decreasing it thereafter proportionally to the inverse square root of the step number. We used warmup_steps = 4000.\n5.4 Regularization\nWe apply dropout to the output of each sub-layer, before it is added to the sub-layer input and normalized. In addition, we apply dropout to sums of the embeddings and the positional encodings in both the encoder and decoder stacks. For the base model, we use a rate of P_drop = 0.1. During training, we employed label smoothing of value epsilon_ls = 0.1. This hurts perplexity, as the model learns to be more unsure, but improves accuracy and BLEU score...",
        # Page 8: Results
        "6 Results\n6.1 Machine Translation Results\nOn the WMT 2014 English-to-German translation task, the big transformer model (Transformer (big) in Table 2) outperforms the best previously reported models (including ensembles) by more than 2.0 BLEU, establishing a new state-of-the-art BLEU score of 28.4. For the base models, we used a single model obtained by averaging the last 5 checkpoints, which were written at 10-minute intervals. For the big models, we averaged the last 20 checkpoints...",
    ]
    return [
        DocumentPage(
            page_index=i,
            text=t,
            char_count=len(t),
            has_text=True
        ) for i, t in enumerate(pages_text)
    ]

def get_lora_sample_analysis() -> AnalysisResult:
    paper_id = "sample_hu_lora_2021"

    overview = PaperOverview(
        research_problem="Fine-tuning massive pre-trained language models (such as GPT-3 175B) is computationally prohibitive because it requires updating and storing all parameters for each downstream task, creating extreme storage and deployment bottlenecks.",
        motivation_and_method="Low-Rank Adaptation (LoRA) freezes pre-trained model weights and injects trainable rank-decomposition matrices into each layer of the Transformer architecture, greatly reducing the number of trainable parameters for downstream tasks by up to 10,000x.",
        main_architecture="Decomposes weight updates W = W_0 + \\Delta W where \\Delta W = B \\cdot A with B \\in \\mathbb{R}^{d \\times r}, A \\in \\mathbb{R}^{r \\times k}, and rank r \\ll \\min(d, k). Applied to query (W_q) and value (W_v) projection matrices in multi-head self-attention.",
        main_results="LoRA matches or outperforms full fine-tuning on GLUE benchmarks with RoBERTa/DeBERTa and on WikiSQL/SAMSum with GPT-3 175B, while reducing trainable parameters by 10,000x and GPU memory footprint by up to 3x.",
        limitations_and_questions="Exact inference batching latency when serving multiple distinct LoRA adapters simultaneously without weight merging. Learning rate sensitivity to scaling constant alpha / rank ratio is omitted in some task setups."
    )

    metadata = PaperMetadata(
        paper_id=paper_id,
        filename="lora_low_rank_adaptation.pdf",
        title="LoRA: Low-Rank Adaptation of Large Language Models (Hu et al., 2021)",
        page_count=26,
        created_at="2026-10-15T12:00:00Z",
        status="analyzed",
        is_sample_demo=True,
        overview=overview,
        total_fields=12,
        reported_fields=9,
        unresolved_gaps=3
    )

    blueprint: list[BlueprintField] = [
        BlueprintField(
            id="field_lora_arch",
            name="Rank Decomposition Matrices",
            category="model_architecture",
            value="r = 4 or 8 with scale alpha = 16 or 32",
            status="reported",
            document_id=paper_id,
            evidence=[
                EvidenceItem(
                    evidence_id="ev_lora_arch",
                    page_index=3,
                    section="4.1 Low-Rank Parameterized Update Matrices",
                    quote="We use a random Gaussian initialization for A and zero for B, so \\Delta W = BA is zero at the beginning of training. We then scale \\Delta Wx by \\alpha / r, where \\alpha is a constant in r.",
                    quote_match=True,
                    semantic_support="verified"
                )
            ],
            notes=["Initialized with A ~ N(0, 1/r) and B = 0 so initial delta W is zero."],
            relationships=["node_lora_method", "node_lora_matrix"]
        ),
        BlueprintField(
            id="field_lora_targets",
            name="Target Weight Matrices",
            category="model_architecture",
            value="Attention query (W_q) and value (W_v) projections only",
            status="reported",
            document_id=paper_id,
            evidence=[
                EvidenceItem(
                    evidence_id="ev_lora_targets",
                    page_index=4,
                    section="4.2 Applying LoRA to Transformer",
                    quote="In this paper, we limit our study to only adapting the attention weights for downstream tasks and freeze the MLP modules (so they are not trained in downstream tasks) for simplicity and parameter efficiency.",
                    quote_match=True,
                    semantic_support="verified"
                )
            ],
            notes=["Adapting both W_q and W_v yields best trade-off between parameter budget and accuracy."],
            relationships=["node_lora_matrix"]
        ),
        BlueprintField(
            id="field_lora_optimizer",
            name="Optimizer",
            category="optimizer",
            value="AdamW with linear learning rate warmup and decay",
            status="reported",
            document_id=paper_id,
            evidence=[
                EvidenceItem(
                    evidence_id="ev_lora_opt",
                    page_index=7,
                    section="5 Experiments and Setup",
                    quote="We optimize using AdamW with a linear learning rate decay schedule and a warmup ratio of 0.1.",
                    quote_match=True,
                    semantic_support="verified"
                )
            ],
            notes=["Standard AdamW weight decay applied only to trainable parameters A and B."],
            relationships=["node_lora_opt"]
        ),
        BlueprintField(
            id="field_lora_lr",
            name="Learning Rate",
            category="learning_rate_schedule",
            value="2e-4 for GPT-3; 5e-4 for RoBERTa/DeBERTa",
            status="reported",
            document_id=paper_id,
            evidence=[
                EvidenceItem(
                    evidence_id="ev_lora_lr",
                    page_index=8,
                    section="5.1 RoBERTa and DeBERTa Setup",
                    quote="For LoRA, we use a learning rate of 5e-4 on most GLUE tasks, which is notably higher than the learning rates typically used for full fine-tuning (1e-5 to 3e-5).",
                    quote_match=True,
                    semantic_support="verified"
                )
            ],
            notes=["LoRA typically tolerates and requires much higher learning rates than full fine-tuning."],
            relationships=["node_lora_opt"]
        ),
        BlueprintField(
            id="field_lora_rank_sweep",
            name="Optimal Intrinsic Rank Gap",
            category="model_architecture",
            value=None,
            status="ambiguous",
            document_id=paper_id,
            evidence=[
                EvidenceItem(
                    evidence_id="ev_lora_rank",
                    page_index=11,
                    section="7.1 Which Weight Matrices in Transformer Should We Apply LoRA To?",
                    quote="Setting r = 1 or r = 2 performs surprisingly well on WikiSQL, suggesting that the update matrix \\Delta W might have a very small intrinsic rank.",
                    quote_match=True,
                    semantic_support="needs_review"
                )
            ],
            notes=["The paper shows r=1 or 2 suffices for WikiSQL, but recommends r=8 for SAMSum dialogue generation without giving a general formula for task complexity."],
            relationships=["node_lora_gap_rank"]
        ),
        BlueprintField(
            id="field_lora_dropout",
            name="LoRA Layer Dropout",
            category="training_setup",
            value="p = 0.1 for LoRA matrices A and B",
            status="reported",
            document_id=paper_id,
            evidence=[
                EvidenceItem(
                    evidence_id="ev_lora_drop",
                    page_index=8,
                    section="5.1 RoBERTa Setup",
                    quote="We use a dropout probability of 0.1 for LoRA layers.",
                    quote_match=True,
                    semantic_support="verified"
                )
            ],
            notes=[],
            relationships=["node_lora_matrix"]
        ),
        BlueprintField(
            id="field_lora_multi_adapter_latency",
            name="Multi-Tenant Serving Overhead",
            category="environment",
            value=None,
            status="not_found",
            document_id=paper_id,
            evidence=[],
            notes=["The paper claims zero inference latency after weight merging W = W0 + BA, but does not report memory or latency benchmarks when serving multiple concurrent tasks dynamically without merging."],
            relationships=["node_lora_gap_serving"]
        )
    ]

    nodes: list[GraphNode] = [
        GraphNode(id="node_lora_obj", type="research_objective", label="Parameter-Efficient Adaptation", status="reported", value="Overcome 175B fine-tuning barrier"),
        GraphNode(id="node_lora_method", type="method", label="LoRA Weight Injection", status="reported", value="Delta W = B * A with r << d"),
        GraphNode(id="node_lora_matrix", type="model_architecture", label="Query & Value Projections", status="reported", value="W_q and W_v with rank r=8, alpha=32"),
        GraphNode(id="node_lora_opt", type="optimizer", label="AdamW with Higher LR", status="reported", value="lr=5e-4, weight_decay=0.01"),
        GraphNode(id="node_lora_gap_rank", type="reproduction_gap", label="Intrinsic Rank Selection Heuristic", status="ambiguous", value="Task-dependent intrinsic rank bounds"),
        GraphNode(id="node_lora_gap_serving", type="reproduction_gap", label="Dynamic Multi-Tenant Latency", status="not_found", value="Unmeasured unmerged adapter routing")
    ]

    edges: list[GraphEdge] = [
        GraphEdge(id="lora_e1", source="node_lora_obj", target="node_lora_method", type="motivates", provenance_type="explicit", label="motivates low-rank bottleneck"),
        GraphEdge(id="lora_e2", source="node_lora_method", target="node_lora_matrix", type="uses_method", provenance_type="explicit", label="applied to W_q and W_v"),
        GraphEdge(id="lora_e3", source="node_lora_matrix", target="node_lora_opt", type="optimized_with", provenance_type="explicit", label="optimized with AdamW"),
        GraphEdge(id="lora_e4", source="node_lora_matrix", target="node_lora_gap_rank", type="blocked_by", provenance_type="inferred", label="unclear rank scaling rule"),
        GraphEdge(id="lora_e5", source="node_lora_method", target="node_lora_gap_serving", type="blocked_by", provenance_type="inferred", label="unspecified concurrent serving latency")
    ]

    graph = ResearchGraph(document_id=paper_id, nodes=nodes, edges=edges)

    gaps: list[GapItem] = [
        GapItem(
            field_id="field_lora_rank_sweep",
            field_name="Optimal Intrinsic Rank Selection Heuristic",
            category="model_architecture",
            status="ambiguous",
            missing_explanation="The authors show that r=1 or r=2 suffices for classification/WikiSQL, but r=8 or r=64 was used for dialogue without specifying how to choose rank r a priori for custom datasets.",
            why_it_matters="Setting rank r too high wastes VRAM and risks overfitting on small tasks, whereas setting r too low causes underfitting and degradation compared to full fine-tuning.",
            examined_sections=["Section 4.1 Low-Rank Matrices", "Section 7.1 Parameter Budget"],
            recommended_actions=[
                "Start with rank r=8 and alpha=16 as a universal baseline.",
                "Conduct a 3-point grid search: r in {4, 8, 16}.",
                "Keep ratio alpha / r = 2.0 to maintain uniform gradient scaling."
            ],
            suggested_candidate_value="r = 8, alpha = 16 (alpha/r = 2.0 scaling)",
            candidate_rationale="HuggingFace PEFT standard default providing robust convergence across both classification and generative tasks.",
            candidate_source="HuggingFace PEFT library standard convention"
        ),
        GapItem(
            field_id="field_lora_multi_adapter_latency",
            field_name="Dynamic Multi-Tenant Serving Latency",
            category="environment",
            status="not_found",
            missing_explanation="The paper highlights zero inference latency when weights are folded (W = W0 + BA), but does not report throughput or VRAM penalties when dynamically switching between multiple adapters in real-time.",
            why_it_matters="If your deployment requires serving 100 different user adapters on a single GPU node, you cannot merge weights into W0 permanently. Unmerged execution requires extra matrix additions that can induce memory bandwidth overhead.",
            examined_sections=["Section 4.1 Zero Inference Overhead", "Section 6 Practical Deployment"],
            recommended_actions=[
                "Benchmark S-LoRA or vLLM multi-adapter batching kernels.",
                "If deploying a single task, always call model.merge_and_unload() before production serving."
            ],
            suggested_candidate_value="Call peft_model.merge_and_unload() for single-task; use vLLM Punica kernels for multi-tenant serving",
            candidate_rationale="Eliminates the intermediate activation overhead during inference.",
            candidate_source="vLLM & S-LoRA production benchmarks"
        )
    ]

    return AnalysisResult(
        paper_id=paper_id,
        metadata=metadata,
        overview=overview,
        blueprint=blueprint,
        graph=graph,
        gaps=gaps
    )

