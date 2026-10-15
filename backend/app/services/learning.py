from typing import Dict, Any, List, Optional
from ..schemas.models import LearningExplanation, BlueprintField, EvidenceItem
from .llm_client import LLMClient

# Curated deep-learning knowledge repository for grounded explanations
CURATED_EXPLANATIONS = {
    "optimizer": {
        "beginner": {
            "summary": "Adam is like a ball rolling down a bumpy hill with shock absorbers and memory of which way it was rolling.",
            "content": "Imagine you are trying to find the lowest valley in a fog. Standard gradient descent takes fixed steps downhill. Adam (Adaptive Moment Estimation) does two smart things: it keeps momentum (moving faster in directions you've consistently moved) and adapts the step size for each parameter individually (taking smaller steps for parameters with wild swings, and larger steps for sluggish ones). In this paper, Adam was used with specific beta2=0.98, which gives a shorter memory of squared gradients than default 0.999.",
            "paper_context": "The authors specified: beta1 = 0.9, beta2 = 0.98, epsilon = 10^-9. In typical deep learning libraries (like PyTorch), the default beta2 is 0.999. Using 0.98 makes the second-moment estimate adapt faster to recent gradients.",
            "math_formulation": "m_t = beta_1 * m_{t-1} + (1 - beta_1) * g_t\nv_t = beta_2 * v_{t-1} + (1 - beta_2) * g_t^2\n\\hat{m}_t = m_t / (1 - beta_1^t), \\quad \\hat{v}_t = v_t / (1 - beta_2^t)\n\\theta_t = \\theta_{t-1} - \\alpha \\cdot \\hat{m}_t / (\\sqrt{\\hat{v}_t} + \\epsilon)",
            "analogies": "A hiker with heavy momentum going downhill who slows down when stepping onto gravel and speeds up on clear trails.",
            "reproduction_note": "CRITICAL: Do NOT use PyTorch's default beta2=0.999. You must explicitly instantiate torch.optim.Adam(params, betas=(0.9, 0.98), eps=1e-9)."
        },
        "technical": {
            "summary": "First and second order moment tracking with custom hyperparameter settings tailored for fast Transformer convergence.",
            "content": "Adam tracks exponential moving averages of both the gradients (first moment) and the squared uncentered gradients (second moment). In Transformer models, attention matrix gradients can fluctuate rapidly across sequence lengths. The choice of beta2=0.98 dampens the moving average memory window (effective window ~ 1/(1-0.98) = 50 steps compared to standard 1000 steps for 0.999), allowing the optimizer to respond promptly to changing token distributions.",
            "paper_context": "Extracted from Section 5.3: 'We used the Adam optimizer with beta_1 = 0.9, beta_2 = 0.98 and epsilon = 10^-9.'",
            "math_formulation": "Effective gradient smoothing window: \\tau \\approx \\frac{1}{1 - \\beta_2} = \\frac{1}{0.02} = 50 \\text{ steps.}",
            "analogies": "Low-inertia tracking loop compared to standard heavy-inertia Adam.",
            "reproduction_note": "Failing to set beta2=0.98 causes slower convergence and may degrade final BLEU by up to 0.8 points."
        },
        "math": {
            "summary": "Formal derivation of bias-corrected moment estimates with non-standard decay coefficient beta2=0.98.",
            "content": "Let g_t = \\nabla_\\theta f_t(\\theta_{t-1}). The exponentially decaying average of past gradients is m_t = \\beta_1 m_{t-1} + (1 - \\beta_1) g_t. The second raw moment is v_t = \\beta_2 v_{t-1} + (1 - \\beta_2) g_t^2. Because m_0 and v_0 are initialized to zero, both are biased toward zero, requiring bias-correction factors (1 - \\beta_1^t) and (1 - \\beta_2^t). When combined with the inverse square-root warmup schedule, the parameter update step becomes \\Delta \\theta_t = - \\frac{\\alpha_t}{\\sqrt{\\hat{v}_t} + \\epsilon} \\hat{m}_t.",
            "paper_context": "Reported in Section 5.3 with formula for learning rate scaling. Value of epsilon = 10^-9 prevents division by zero when uncentered variance is negligible.",
            "math_formulation": "\\mathbb{E}[v_t] = \\mathbb{E}\\left[(1-\\beta_2) \\sum_{i=1}^t \\beta_2^{t-i} g_i^2\\right] = \\mathbb{E}[g_t^2] (1-\\beta_2^t) + \\zeta",
            "analogies": "Bias-corrected statistical estimator of gradient variance.",
            "reproduction_note": "Verify epsilon is 1e-9 (PyTorch default is 1e-8). While small, this affects precision in FP16 / BF16 mixed-precision training."
        }
    },
    "learning_rate_schedule": {
        "beginner": {
            "summary": "Warmup and cooldown: starting slowly so the untrained model doesn't get shocked, then gradually tapering off.",
            "content": "When a neural network starts training, its weights are random guesses. If you take huge steps right away, the gradients can blow up. The learning rate schedule starts at near zero and increases linearly for 4,000 steps ('warmup'). Once the weights find a reasonable starting direction, it slowly decreases the step size proportionally to the inverse square root of the step number.",
            "paper_context": "Described in Section 5.3: 4000 warmup steps, decreasing with step_num^(-0.5).",
            "math_formulation": "Learning rate increases linearly from step 0 to 4000, then decays like 1/sqrt(step).",
            "analogies": "Warming up your car engine on a freezing morning before accelerating onto the highway.",
            "reproduction_note": "A common bug is using a step-decay or cosine schedule instead. The inverse square-root schedule never drops to zero."
        },
        "technical": {
            "summary": "Square-root dimension normalized schedule combining linear warmup with continuous inverse-sqrt polynomial decay.",
            "content": "The learning rate formula is lrate = d_model^(-0.5) * min(step_num^(-0.5), step_num * warmup_steps^(-1.5)). For d_model=512 and warmup=4000, the peak learning rate occurs exactly at step 4000, reaching 512^(-0.5) * 4000^(-0.5) = (1/22.627) * (1/63.245) ≈ 0.0006987 (~7e-4).",
            "paper_context": "Section 5.3, Equation 3.",
            "math_formulation": "lrate(t) = d_{\\text{model}}^{-0.5} \\cdot \\min\\left(t^{-0.5}, t \\cdot \\text{warmup\\_steps}^{-1.5}\\right)",
            "analogies": "Linear ramp followed by a fat-tailed inverse square-root decay curve.",
            "reproduction_note": "Check whether your scheduler is called per-step (correct) or per-epoch (incorrect)."
        },
        "math": {
            "summary": "Rigorous algebraic properties of the inverse-sqrt learning rate schedule at critical transition point.",
            "content": "At t = \\text{warmup\\_steps}, both branches coincide: t^{-0.5} = \\text{warmup\\_steps}^{-0.5} and t \\cdot \\text{warmup\\_steps}^{-1.5} = \\text{warmup\\_steps} \\cdot \\text{warmup\\_steps}^{-1.5} = \\text{warmup\\_steps}^{-0.5}. Thus the function is continuous. The derivative with respect to t has a discontinuity at t = 4000 where the slope flips from +d_model^(-0.5) * warmup^(-1.5) to -0.5 * d_model^(-0.5) * t^(-1.5).",
            "paper_context": "Section 5.3 Equation (3).",
            "math_formulation": "\\lim_{t \\to 4000^-} \\frac{d}{dt} \\text{lr}(t) = \\frac{1}{\\sqrt{512}} \\frac{1}{4000^{1.5}} \\approx 1.747 \\times 10^{-7} \\neq -2.18 \\times 10^{-8} = \\lim_{t \\to 4000^+} \\frac{d}{dt} \\text{lr}(t)",
            "analogies": "Continuous piecewise C0 function with a sharp first-derivative inflection point.",
            "reproduction_note": "Ensure your custom LambdaLR scheduler implements exact floating-point division."
        }
    },
    "model_architecture": {
        "beginner": {
            "summary": "Self-attention lets words in a sentence look at every other word simultaneously to understand context.",
            "content": "In traditional RNNs, a model reads a sentence one word at a time from left to right. By the time it reaches the 50th word, it may have forgotten the 1st word. The Transformer looks at the entire sentence at once. Through 'self-attention', each word calculates a relevance score with every other word (e.g., 'it' looks back at 'the dog' rather than 'the street'). Multi-head attention means it does this 8 times in parallel, capturing 8 different types of linguistic relationships.",
            "paper_context": "Reported in Section 3: 6 encoder layers and 6 decoder layers, with 8 parallel attention heads per layer.",
            "math_formulation": "Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V",
            "analogies": "A committee of 8 specialists each reading the same document with different colored highlighters (one for grammar, one for pronouns, one for time references).",
            "reproduction_note": "Remember to include pre-layer-norm or post-layer-norm according to the exact paper (original 2017 Transformer uses Post-LN, i.e., LayerNorm(x + Sublayer(x)))."
        },
        "technical": {
            "summary": "Stacked multi-head dot-product attention with scaled variance and residual connections.",
            "content": "The architecture consists of an encoder and decoder, each containing N=6 identical layers. Each layer has two sub-layers: a multi-head self-attention mechanism and a position-wise fully connected feed-forward network (FFN(x) = max(0, xW1 + b1)W2 + b2). Dimensionality: d_model=512, d_ff=2048, h=8 heads with projected dimensions d_k = d_v = 64.",
            "paper_context": "Sections 3.1, 3.2, 3.3.",
            "math_formulation": "\\text{MultiHead}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h)W^O, \\quad \\text{head}_i = \\text{Attention}(QW_i^Q, KW_i^K, VW_i^V)",
            "analogies": "Parallel linear projection into multiple lower-dimensional subspaces.",
            "reproduction_note": "In the decoder, causal masking (-inf above the diagonal) must be applied to self-attention to prevent positions from attending to future tokens."
        },
        "math": {
            "summary": "Variance preservation in scaled dot-product attention under independent unit-variance assumptions.",
            "content": "Assume components of q and k are independent random variables with mean 0 and variance 1. Then their dot product q \\cdot k = \\sum_{i=1}^{d_k} q_i k_i has mean 0 and variance d_k. For large d_k, the dot products grow large in magnitude, pushing the softmax function into regions with extremely small gradients. Dividing by \\sqrt{d_k} scales the variance back to 1, preventing gradient vanishing during backpropagation.",
            "paper_context": "Section 3.2.1 Scaled Dot-Product Attention.",
            "math_formulation": "\\text{Var}\\left(\\sum_{i=1}^{d_k} q_i k_i\\right) = \\sum_{i=1}^{d_k} \\text{Var}(q_i k_i) = \\sum_{i=1}^{d_k} \\mathbb{E}[q_i^2]\\mathbb{E}[k_i^2] = d_k \\implies \\text{Var}\\left(\\frac{q \\cdot k}{\\sqrt{d_k}}\\right) = 1",
            "analogies": "Standard deviation normalization preserving numerical stability.",
            "reproduction_note": "Missing the 1/sqrt(d_k) factor will cause the softmax to saturate, leading to zero gradients early in training."
        }
    }
}

class LearningService:
    def __init__(self):
        self.llm_client = LLMClient()

    def explain_field(
        self,
        field: BlueprintField,
        explanation_level: str = "technical",
        paper_context_text: Optional[str] = None
    ) -> LearningExplanation:
        """
        Generates a 3-level grounded learning explanation for any blueprint field.
        """
        category_key = field.category.lower()
        level = explanation_level.lower() if explanation_level in ["beginner", "technical", "math"] else "technical"

        # Check curated library first
        if category_key in CURATED_EXPLANATIONS and level in CURATED_EXPLANATIONS[category_key]:
            curated = CURATED_EXPLANATIONS[category_key][level]
            return LearningExplanation(
                concept_id=field.id,
                concept_name=field.name,
                explanation_level=level,  # type: ignore
                summary=curated["summary"],
                content=curated["content"],
                paper_context=curated["paper_context"],
                math_formulation=curated.get("math_formulation"),
                analogies_or_examples=curated.get("analogies"),
                reproduction_note=curated["reproduction_note"],
                related_evidence=field.evidence,
                related_nodes=field.relationships,
                is_author_reported=(field.status == "reported")
            )

        # Dynamic LLM generation if key available
        if self.llm_client.is_configured():
            prompt = f"""
Explain the concept '{field.name}' (Category: {field.category}, Extracted Value: {field.value}, Status: {field.status}) from the perspective of an ML engineer reproducing this paper.
Explanation Level: {level.upper()} (beginner = intuitive/analogy, technical = mechanism/experimental relevance, math = equations/derivation).
Grounded Quotes from Paper:
{[e.quote for e in field.evidence]}

Return JSON:
{{
  "summary": "1-2 sentence core concept",
  "content": "detailed explanation at {level} level",
  "paper_context": "how the authors used this",
  "math_formulation": "equations or null",
  "analogies_or_examples": "concrete analogy or example",
  "reproduction_note": "critical warning or tip for implementation"
}}
"""
            try:
                res = self.llm_client.generate_json_response("You are an expert ML research educator.", prompt)
                return LearningExplanation(
                    concept_id=field.id,
                    concept_name=field.name,
                    explanation_level=level,  # type: ignore
                    summary=res.get("summary", f"Overview of {field.name}"),
                    content=res.get("content", "Explanation not available."),
                    paper_context=res.get("paper_context", "Reported in document."),
                    math_formulation=res.get("math_formulation"),
                    analogies_or_examples=res.get("analogies_or_examples"),
                    reproduction_note=res.get("reproduction_note", "Verify settings against source evidence."),
                    related_evidence=field.evidence,
                    related_nodes=field.relationships,
                    is_author_reported=(field.status == "reported")
                )
            except Exception:
                pass

        # Robust programmatic fallback for any field
        return LearningExplanation(
            concept_id=field.id,
            concept_name=field.name,
            explanation_level=level,  # type: ignore
            summary=f"{field.name}: {field.value or 'Unresolved parameter'}",
            content=f"In this experiment, '{field.name}' is categorized under {field.category}. Its reported value is '{field.value}'. Understanding this parameter is critical because it directly influences the model's capacity and optimization trajectory.",
            paper_context=f"Reported in {len(field.evidence)} evidence passage(s) across the document.",
            math_formulation=None,
            analogies_or_examples="Consider this as one of the essential knobs governing experiment stability.",
            reproduction_note=f"Status: {field.status.upper()}. If attempting reproduction, double check the exact quote.",
            related_evidence=field.evidence,
            related_nodes=field.relationships,
            is_author_reported=(field.status == "reported")
        )
