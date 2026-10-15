# Paper2Run --- Complete Product Context & Build Specification

> **Product tagline:** Understand the paper. Connect the evidence.
> Reproduce the experiment.\
> **Product category:** Evidence-backed AI/ML research-to-reproduction
> assistant\
> **Primary audience:** Students, ML engineers, research interns, and
> developers who want to understand and reproduce AI/ML research papers\
> **Document purpose:** This is the source-of-truth product brief for
> the Antigravity IDE. Read it before making architectural or product
> decisions.

------------------------------------------------------------------------

## 0. Instructions for the IDE / coding agent

Treat this document as the product specification. Do not implement every
long-term feature immediately.

1.  **Inspect the existing repository first.** Identify the framework,
    current files, package manager, existing routes, and what already
    works. Do not overwrite working code or initialize a competing app
    without checking.
2.  **Build a working vertical slice first.** A complete flow for one
    uploaded PDF is more valuable than many disconnected screens.
3.  **Keep the product centered on research reproduction.** Learning is
    not a separate generic tutor; it is driven by the experiment
    blueprint, its concepts, and its gaps.
4.  **Never fabricate research facts.** If a value cannot be supported
    by the source, do not fill it in as if it were reported.
5.  **Preserve provenance.** Every extracted fact should link to the
    document and page/passage when available. Relationships should also
    have evidence or be labeled as inferred.
6.  **Distinguish extraction failure from missing information.** "Not
    extracted" and "Not reported / not found in examined content" are
    different states.
7.  **Use typed, structured outputs.** Validate model responses before
    showing them as trusted structured data.
8.  **Avoid premature complexity.** No graph database, multi-agent
    orchestration, authentication, billing, browser extension, bots, MCP
    server, or code generation is required for the first MVP unless the
    existing repo already supports it and the core flow is complete.
9.  **Make failures visible.** Handle invalid PDFs, scanned/image-only
    PDFs, extraction errors, model/API failures, timeouts, and malformed
    structured output with useful UI states.
10. **Do not claim the product guarantees reproducibility.** It helps
    identify requirements, evidence, and gaps; successful reproduction
    still depends on source completeness, implementation, data,
    environment, and experimental variation.
11. **Do not use fake analysis disguised as live analysis.** If using a
    precomputed demo paper, label it as a demo/sample. Never imply that
    static example output came from the user's uploaded paper.
12. **Implement in small, testable steps.** After each phase, run the
    app, inspect the user flow, fix errors, and keep the project
    runnable.

### Definition of a successful first build

A user can upload one text-based AI/ML PDF, see a useful paper overview,
inspect structured experiment fields with source evidence and statuses,
click a field to learn about it, view a few grounded relationships,
identify an unresolved field, and export the blueprint. This flow must
work end to end before expanding scope.

------------------------------------------------------------------------

## 1. Executive summary

Paper2Run transforms an AI/ML research paper into an **evidence-backed
experiment blueprint connected to a targeted learning experience**.

A reader often needs to do much more than summarize a paper. They need
to understand the research problem, learn unfamiliar concepts, discover
the relationships between the method and the training setup, extract
implementation details, verify where those details came from, and
identify what remains unknown before they can attempt a reproduction.

Paper2Run brings these tasks into one connected workspace:

**Paper → Evidence → Connected Blueprint → Learning → Gap Investigation
→ Implementation Plan**

The core system extracts paper facts and evidence, represents important
concepts and relationships in a Research Connection Graph, and uses the
same structured blueprint to power the learning experience. If a field
is missing or ambiguous, the product explains why it matters and helps
the user investigate it without pretending the original authors reported
a value they did not report.

### Product promise

> Paper2Run helps you understand what you can reproduce from a research
> paper, what evidence supports each detail, what remains unresolved,
> and what you need to learn to make informed implementation decisions.

This is a product goal, not a guarantee that all papers can be fully
reproduced.

------------------------------------------------------------------------

## 2. The problem being solved

### 2.1 Understanding gap

Research papers frequently assume background knowledge in areas such as
neural networks, optimization, probability, mathematical notation, model
architecture, and evaluation methodology. A beginner can read the words
without understanding why a method works or why the authors chose it.

A generic summary may tell the user *what* the paper says, but still
leave them unable to understand the methodology or implement it.

### 2.2 Knowledge-prerequisite gap

A learner may not know what to learn first. For a paper using a
Transformer, AdamW, a cosine learning-rate schedule, and a specialized
evaluation metric, the required concepts are related to the paper's
actual design. A generic list of machine-learning topics does not
necessarily help the reader understand this specific experiment.

### 2.3 Implementation-detail gap

Important settings can be scattered across: - Abstract and methodology
text - Tables and figure captions - Equations and notation - Training
and evaluation sections - Appendices and supplementary PDFs - Cited
papers - Official implementation repositories, when available

Values can also be described using different names or conventions. A
user can miss a detail or mistakenly assume that a common default was
used.

### 2.4 Evidence and provenance gap

An extracted value is only useful if the user can inspect its source. A
fluent AI answer may still misread a table, associate a value with the
wrong experiment, or turn an assumption into a fact.

Paper2Run should retain the evidence passage, page number, document
identity, and verification status for each extracted field. A quotation
existing in the PDF is necessary but does not, by itself, prove that the
quotation semantically supports the field.

### 2.5 Relationship gap --- connecting the dots

Individual facts do not fully describe an experiment. Users need to see
how: - The research objective motivates the proposed method - The method
uses particular model components - The model is trained with a loss,
optimizer, schedule, and data pipeline - An experimental configuration
relates to a result - A result supports or fails to support a claim - A
missing setting creates an implementation uncertainty - An uncertainty
triggers a learning or investigation task

These connections should be explicit, navigable, and evidence-backed
where the paper supports them.

### 2.6 Missing-information gap

A field that appears blank can have multiple meanings: - The paper does
not appear to report it in the examined content. - The PDF extractor
failed to read the relevant table or equation. - The value exists but is
ambiguous. - The detail is in supplementary material that has not been
processed. - The information may be present in another cited source, but
has not yet been verified for applicability.

Paper2Run must not collapse these cases into one "missing" status.

### 2.7 Reproduction gap

After reading a paper, a developer still needs to turn it into an
actionable checklist and configuration. They need to know what is
reported, what is uncertain, what must be investigated, and which
implementation choices are their own.

Paper2Run's goal is to bridge the gap between **reading research and
preparing a defensible implementation**.

------------------------------------------------------------------------

## 3. Existing tools and the market landscape

Paper2Run must be positioned accurately. It should not claim that other
tools cannot summarize papers, chat with PDFs, extract evidence, compare
studies, or create citation graphs. Several established products already
provide meaningful parts of this workflow.

The following is a high-level positioning snapshot based on public
product descriptions, not an exhaustive feature-by-feature benchmark.
Product capabilities change, so verify current features before using
this comparison in a pitch.

### 3.1 Elicit

Elicit supports academic-paper discovery, summaries, structured data
extraction, evidence-backed answers, and research synthesis. Its public
materials describe extraction supported by source quotes and workflows
for reviewing many papers.

**Official product:** https://elicit.com/

**Implication for Paper2Run:** Evidence-backed extraction is not unique
by itself. Paper2Run should focus on the way extracted facts become a
connected implementation blueprint, how missing experiment details
trigger targeted learning, and how those decisions are tracked through
to implementation.

### 3.2 SciSpace

SciSpace provides research-paper discovery, literature-review workflows,
structured paper comparisons, and chat with research papers/PDFs. Its
tools can help explain paper content and extract comparable information.

**Official product:** https://scispace.com/

**Implication for Paper2Run:** "Chat with a paper" or "explain a paper
simply" is not enough differentiation. The explanation should be
contextual to a specific blueprint field, its evidence, its relationship
to the experiment, and any unresolved reproduction gap.

### 3.3 Consensus

Consensus supports scientific-paper search, AI-assisted synthesis,
comparison of findings, citations, chat with full text, and a citation
graph for exploring relationships between papers.

**Official product:** https://consensus.app/

**Implication for Paper2Run:** Do not claim citation graphs or
evidence-backed synthesis are absent from existing tools. Paper2Run's
proposed graph should emphasize **within-paper experiment relationships
and links from those relationships to reproduction requirements and
learning actions**, with cross-paper investigation as a later extension.

### 3.4 Google Scholar and general-purpose LLM assistants

Google Scholar is useful for discovering academic literature.
General-purpose LLMs can explain concepts, summarize text, and help with
implementation. Depending on the model and workflow, users may need to
provide PDFs, verify source claims, and manually organize the results.

**Google Scholar:** https://scholar.google.com/

**Implication for Paper2Run:** The goal is not to replace literature
search or general AI. It is to provide a focused workflow for going from
one selected research paper to a source-traceable, gap-aware experiment
blueprint and learning path.

### 3.5 Defensible gap and positioning

The defensible product hypothesis is:

> Existing research assistants help users discover, read, summarize,
> chat with, extract from, and synthesize research. Paper2Run focuses on
> connecting source evidence to an actionable experiment blueprint,
> explicitly tracking uncertainty, and using the blueprint's real
> concepts and gaps to drive targeted learning and reproduction
> planning.

This is a hypothesis to validate, not proof that no competitor has any
overlapping feature. Before presenting "first," "only," or "no existing
tool" claims, perform a systematic competitor review and test the
current products.

### 3.6 Why Paper2Run is not just another chatbot

A generic chatbot starts with a question and returns an answer.
Paper2Run maintains a structured representation of the paper: - Fields
and their values - Evidence passages and page references - Provenance
and status labels - Nodes and typed relationships - Learning resources
linked to fields and concepts - Open gaps and investigation tasks -
Exportable implementation requirements

The same underlying data powers the explanation, blueprint, graph, gap
checklist, and report. That shared structure is the product's intended
distinction.

------------------------------------------------------------------------

## 4. Product principles

1.  **Evidence before confidence.** Do not treat fluent language or a
    model's confidence as proof.
2.  **Unknown is an acceptable answer.** Never silently invent an
    experimental setting to make a blueprint look complete.
3.  **Facts, interpretations, and suggestions are separate.** Users
    should be able to tell which is which.
4.  **Learning is blueprint-driven.** Explain the concepts used by the
    paper and the fields that block implementation, not a generic course
    disconnected from the experiment.
5.  **Relationships require provenance.** An inferred graph edge must be
    labeled as inferred, not presented as an explicit author claim.
6.  **The paper remains the source of truth for author-reported
    details.** External papers and repositories can provide additional
    evidence, not rewrite what the uploaded paper says.
7.  **The user stays in control.** Suggestions should be reviewable and
    editable; do not automatically treat them as verified settings.
8.  **A readiness indicator is not a guarantee.** If one is shown,
    explain the checklist criteria. Do not imply a probability of
    successful reproduction without validation.
9.  **Scope the domain initially.** Optimize the first version for AI/ML
    experimental papers instead of claiming universal support for every
    discipline.
10. **Make source inspection easy.** Every important claim should be
    traceable back to the relevant text, table, figure, or equation when
    possible.

------------------------------------------------------------------------

## 5. Product workflow

### Step 1 --- Upload a paper

The user uploads an AI/ML research paper as a PDF. Show its filename,
extracted title when available, page count, and processing status.

The first version should support text-based PDFs. If a document is
scanned or contains image-only pages, explain the limitation and mark
the affected content as not extracted. OCR can be added later.

### Step 2 --- Parse and structure the document

Extract: - Text by page - Section headings when possible - Tables and
captions where possible - Equations or their surrounding descriptions
where possible - References - Appendix and supplementary-material
indicators

Preserve page numbers and stable text locations. PDF page indexing and
printed page numbering may differ; record which numbering convention is
used.

### Step 3 --- Extract the experiment blueprint

Use structured model output to identify important fields such as the
dataset, preprocessing, architecture, loss, optimizer, schedule,
hyperparameters, training procedure, metrics, baselines, and results.

For each field, store: - Field identifier and category - Extracted value
or explicit unknown - Status - Evidence passage(s) - Page/section -
Document identifier - Notes on ambiguity - Whether a value is reported,
externally sourced, or suggested

### Step 4 --- Verify evidence

Run deterministic checks where possible: - Does the quoted text exist in
the extracted text for the stated page? - Does the cited page belong to
the uploaded document? - Is the field value actually present in or
supported by the passage? - Does the value belong to the correct
experiment, dataset, or model? - Are there multiple conflicting
candidate values? - Is the field still unresolved?

Quote matching is a first validation layer, not full semantic
verification. Mark uncertain interpretations for review rather than
treating every quote match as proof.

### Step 5 --- Build the Research Connection Graph

Create nodes for important entities and typed relationships between
them. Keep the evidence and provenance for each node and relationship.

Example: - Research objective → motivates → proposed method - Proposed
method → uses → model architecture - Training setup → uses → optimizer -
Training setup → uses → learning-rate schedule - Experiment →
evaluates_with → metric - Experiment result → supports_or_qualifies →
claim - Blueprint field → explained_by → learning resource - Blueprint
field → blocked_by → unresolved gap

Only create edges supported by explicit text, table/figure evidence, or
clearly labeled inference. Do not invent causal relationships just
because two concepts appear near one another.

### Step 6 --- Generate targeted learning

Use the blueprint and graph to determine which concepts to explain. Each
field should have a contextual "Learn" action.

Offer three explanation levels: 1. **Beginner:** plain language,
analogy, concrete example 2. **Technical intuition:** mechanism, why it
matters, connection to the paper 3. **Mathematical deep dive:**
equations, symbols, assumptions, derivation where supported

The answer should distinguish: - What the uploaded paper explicitly
says - General background knowledge - A model-generated interpretation -
A suggestion for further investigation or implementation

### Step 7 --- Resolve gaps

For each ambiguous or not-found field: - Explain what is currently
unknown. - Explain why the field matters to reproduction. - Identify
where the system searched. - Suggest targeted next steps: inspect
table/appendix, process supplementary material, follow a citation,
inspect an official repository, or ask the user to review a passage. -
If appropriate, provide a candidate implementation choice as a
**suggestion**, with rationale and source where available. - Keep the
original author-reported value unknown unless evidence establishes it.

### Step 8 --- Export the implementation plan

Generate: - A Markdown research/experiment report - A reproduction
checklist - JSON and/or YAML configuration - A list of unresolved gaps
and user decisions - Optional graph data for later use

Unknown values should remain `null`, `UNKNOWN`, or a similarly explicit
representation. Never silently replace them with common defaults.

------------------------------------------------------------------------

## 6. Core features

### Feature A --- Evidence-verified experiment blueprint

Extract and organize:

  -----------------------------------------------------------------------
  Field group                         Example details
  ----------------------------------- -----------------------------------
  Research objective                  Problem, motivation, stated
                                      hypothesis

  Dataset                             Name, source, size, split, license
                                      if stated

  Preprocessing                       Resize, normalize, tokenize,
                                      augmentation, filtering

  Model architecture                  Model family, components,
                                      dimensions, variants

  Training setup                      Epochs, batch size, optimizer,
                                      learning rate, schedule

  Loss                                Objective, equation, coefficients

  Evaluation                          Metrics, validation/test procedure,
                                      evaluation conditions

  Baselines                           Comparison methods and their
                                      configurations

  Results                             Reported score, uncertainty,
                                      table/figure reference

  Environment                         Hardware, framework, dependencies,
                                      versions if stated

  Reproduction gaps                   Unknown, ambiguous, unextracted, or
                                      conflicting fields
  -----------------------------------------------------------------------

Not every paper contains every field. The schema must allow fields to be
absent or unresolved.

### Feature B --- Evidence and provenance

Each extracted field should display its evidence and source. Let the
user open the relevant page/passage and see the surrounding context.

Recommended statuses:

-   **Reported:** Explicitly supported by the uploaded paper.
-   **From cited paper / External source:** Found in a separate
    identified source. Keep the source identity and its evidence
    separate.
-   **Suggested:** A possible choice, not confirmed as the authors'
    setting.
-   **Ambiguous:** Evidence exists, but interpretation or value is
    unclear.
-   **Not reported / Not found in examined content:** Not found after a
    defined search of the content examined.
-   **Not extracted:** The system could not reliably inspect or parse
    the relevant content.
-   **Conflicting evidence:** Different passages or sources appear to
    report inconsistent values.

For the first implementation, it is acceptable to use fewer statuses if
the data model can extend to all of them. At minimum, keep Reported,
External/Cited source, Suggested, Ambiguous, Not found, and Not
extracted distinct.

### Feature C --- Research Connection Graph

Create a graph of research entities and relationships. The graph should
answer questions like: - Which configuration belongs to which
experiment? - Which evidence passage supports this parameter? - Which
model component uses this method? - Which results correspond to which
evaluation metric? - Which field is unresolved? - Which concept should I
learn to understand the field? - Which related source may help
investigate the gap?

The graph is more than a visual decoration. It should drive navigation
and contextual learning.

### Feature D --- Gap-driven learning

When a field is missing or ambiguous, do not just display a warning.
Explain: - What the field means - Why it matters to the current
experiment - How the paper uses the concept - What evidence is
available - What is unknown - What the user can learn or investigate
next - Which candidate settings are only suggestions

Example: "Warmup duration was not found in the examined content. Warmup
gradually changes the learning rate early in training. Its effect
depends on the optimizer and schedule. Check the appendix or official
implementation. If you need to proceed, document a candidate value as
your own experimental choice; do not label it as the authors' value."

### Feature E --- Blueprint-driven prerequisites

Derive a learning path from the actual extracted architecture and
training setup. For example, a paper using a Transformer and AdamW may
link to attention, model components, optimization, weight decay, and
learning-rate schedules.

Do not generate a fixed generic list for every paper. Order
prerequisites using explicit dependency information where available and
clearly mark inferred learning relationships. Allow the user to indicate
their familiarity and skip concepts.

### Feature F --- Click-to-learn

Every relevant blueprint field and graph node should expose a Learn
action. Selecting "AdamW," "cross-entropy loss," "batch size," or an
evaluation metric should open the corresponding explanation at the
chosen level, with source evidence and related nodes.

### Feature G --- Export

Provide: - Markdown report with evidence and status labels - Checklist
of implementation tasks - JSON/YAML with explicit unknown values -
Unresolved-gap list - Optional graph JSON

A generated config is not executable truth by default. It is a
structured starting point for the user to review.

### Feature H --- Cross-paper investigation (later)

Potential future capabilities: - Follow references - Search paper
metadata and open-access full text where permitted - Find supplementary
files - Inspect official repositories - Compare related papers -
Identify conflicting or inherited settings - Track provenance through a
chain of sources

Never silently transfer a value from one paper to another. Applicability
must be justified and the value must remain attributed to its source.

### Feature I --- Learning checks (later)

Short quizzes, flashcards, progress tracking, and adaptive explanations
can be added after the core blueprint-to-learning workflow works. They
are not required for the MVP.

### Feature J --- Distribution (later)

Possible extensions: - Web workspace first - Browser extension for
arXiv/PDF reading - API/Python package - MCP server -
Discord/Slack/Telegram integrations

These are future distribution channels, not MVP requirements.

------------------------------------------------------------------------

## 7. Research Connection Graph: data model

Start with ordinary typed JSON objects. Do not add a graph database for
the first build.

### Suggested node types

-   `research_objective`
-   `method`
-   `model_architecture`
-   `model_component`
-   `dataset`
-   `preprocessing_step`
-   `loss_function`
-   `optimizer`
-   `learning_rate_schedule`
-   `hyperparameter`
-   `training_procedure`
-   `evaluation_metric`
-   `baseline`
-   `experiment`
-   `result`
-   `claim`
-   `evidence_passage`
-   `reproduction_gap`
-   `learning_resource`
-   `external_source`

### Suggested relationship types

-   `motivates`
-   `proposes`
-   `uses_method`
-   `contains_component`
-   `trained_on`
-   `preprocessed_with`
-   `optimized_with`
-   `uses_loss`
-   `uses_schedule`
-   `evaluated_with`
-   `compared_against`
-   `reports_result`
-   `supports_claim`
-   `qualifies_claim`
-   `evidenced_by`
-   `explained_by`
-   `depends_on`
-   `blocked_by`
-   `cited_in`
-   `inherited_from`
-   `conflicts_with`

Use only relationships that make sense for the extracted information.
Every edge should include provenance or an explicit `inference`
classification.

### Example schema

``` json
{
  "document_id": "paper_001",
  "nodes": [
    {
      "id": "optimizer_adamw",
      "type": "optimizer",
      "label": "AdamW",
      "status": "reported",
      "value": "AdamW",
      "evidence_ids": ["evidence_012"]
    },
    {
      "id": "gap_warmup",
      "type": "reproduction_gap",
      "label": "Warmup duration",
      "status": "not_found",
      "value": null,
      "search_scope": ["main_text", "training_section"],
      "notes": "Supplementary material has not been examined."
    }
  ],
  "edges": [
    {
      "id": "edge_001",
      "source": "optimizer_adamw",
      "type": "used_in",
      "target": "training_procedure_001",
      "provenance_type": "explicit",
      "evidence_ids": ["evidence_012"],
      "status": "verified"
    }
  ]
}
```

This is an illustrative schema. The real implementation must only create
a node or edge when it has data supporting it. Do not hardcode the
sample entities as results for uploaded papers.

### Example field schema

``` json
{
  "id": "field_optimizer",
  "name": "Optimizer",
  "category": "training",
  "value": "AdamW",
  "status": "reported",
  "document_id": "paper_001",
  "evidence": [
    {
      "evidence_id": "evidence_012",
      "page_index": 4,
      "printed_page_number": null,
      "section": "Training Details",
      "quote": "Exact quote copied from extracted source text",
      "quote_match": true,
      "semantic_support": "needs_review"
    }
  ],
  "notes": [],
  "relationships": ["edge_001"]
}
```

Avoid claiming semantic verification if the system only checked quote
presence. The verification state should accurately describe which checks
were actually performed.

------------------------------------------------------------------------

## 8. Recommended technical architecture

### MVP stack

-   **Frontend:** React + Vite + TypeScript, with Tailwind CSS if useful
-   **Backend:** Python + FastAPI
-   **PDF processing:** PyMuPDF for page-aware text extraction
-   **Structured validation:** Pydantic
-   **AI:** One accessible LLM API with reliable structured output
-   **Graph visualization:** React Flow or Cytoscape.js, only after
    structured graph data exists
-   **Export:** JSON, YAML, Markdown
-   **Initial persistence:** Local/temporary document storage and
    structured JSON; choose based on the existing repository
-   **Later persistence:** PostgreSQL when saved projects and multi-user
    data become necessary

Do not add a vector database just because the app uses AI. For one
paper, page/section chunking and simple retrieval may be enough. Add
embeddings/vector retrieval only when document size or retrieval quality
justifies it.

### Logical modules

1.  **Document ingestion:** validates file type and size, parses PDF,
    preserves page-level text.
2.  **Document index:** stores sections, page text, tables/captions when
    extracted, and references.
3.  **Extraction service:** requests structured fields from the model.
4.  **Validation service:** validates schemas, quote presence, page
    references, and required provenance.
5.  **Graph builder:** creates nodes and relationships from validated
    fields and supported inferences.
6.  **Learning service:** explains selected fields and gaps with
    evidence context.
7.  **Gap manager:** tracks unresolved fields and next investigation
    actions.
8.  **Export service:** produces Markdown, JSON, and YAML.
9.  **Frontend workspace:** upload, overview, blueprint, graph, learning
    panel, gap list, and export.

### Suggested API routes

Adapt these to the repository's conventions instead of blindly creating
every route:

-   `POST /api/papers` --- upload and create a paper record
-   `GET /api/papers/{paper_id}` --- metadata and processing status
-   `POST /api/papers/{paper_id}/analyze` --- run or rerun extraction
-   `GET /api/papers/{paper_id}/blueprint` --- fields, values, evidence,
    statuses
-   `GET /api/papers/{paper_id}/graph` --- nodes and edges
-   `POST /api/papers/{paper_id}/explain` --- explain a
    field/concept/gap at a chosen level
-   `GET /api/papers/{paper_id}/gaps` --- unresolved fields and
    investigation suggestions
-   `GET /api/papers/{paper_id}/export?format=markdown|json|yaml` ---
    export result

For a very short MVP, fewer endpoints are acceptable. Keep the backend
modular enough to split later.

### Suggested project organization

``` text
paper2run/
  frontend/
    src/
      components/
      features/
        upload/
        overview/
        blueprint/
        graph/
        learn/
        gaps/
        export/
      lib/
      types/
  backend/
    app/
      main.py
      api/
      models/
      schemas/
      services/
        pdf_parser.py
        extraction.py
        evidence_validation.py
        graph_builder.py
        learning.py
        gap_analysis.py
        export_service.py
      tests/
  docs/
  README.md
  PAPER2RUN_CONTEXT.md
  .env.example
```

This is a suggested organization, not a mandate to recreate an existing
repository. Keep the codebase as simple as possible while preserving
clear boundaries.

------------------------------------------------------------------------

## 9. UI/UX requirements

The user should experience one connected research workspace rather than
unrelated pages.

### Main workspace

-   Paper header: title, author/year if extracted, filename, page count,
    processing status
-   Primary navigation: **Learn**, **Blueprint**, **Connections**,
    **Verify**
-   Overview: research question, method, results, limitations
-   Blueprint list/table: field, value, status, source, action
-   Evidence viewer: quote, page, section, context, verification state
-   Learning panel: explanation level selector, answer, cited passage,
    related concepts
-   Connection view: clickable graph or a simple relationship list
-   Gaps panel: unresolved fields, why they matter, what to investigate
    next
-   Export controls: Markdown, JSON, YAML

### Interaction rules

-   Clicking a blueprint field opens its evidence and explanation.
-   Clicking an evidence item reveals the page/section context when
    possible.
-   Clicking a graph node highlights related fields and evidence.
-   Clicking a gap opens a targeted explanation and investigation
    checklist.
-   Switching explanation levels should not change the underlying
    verified fact.
-   External suggestions must be visually distinguished from
    author-reported values.
-   Unknown values should remain visibly unknown.
-   Long operations should show progress and useful failure messages.

### Visual direction

Use a clean, professional research-workspace aesthetic. Prioritize
readability, evidence hierarchy, source traceability, and dense but
navigable information. Avoid a generic chatbot-only landing page or a
dashboard full of meaningless charts. The graph should be useful and
readable, not a decorative network.

------------------------------------------------------------------------

## 10. MVP scope versus future scope

### Build in the MVP

1.  Upload one text-based AI/ML research PDF.
2.  Extract page-aware text.
3.  Generate a concise paper overview.
4.  Extract core experiment fields into validated structured data.
5.  Attach exact source quotations and page references when available.
6.  Validate quotation presence and expose limitations of the
    validation.
7.  Distinguish reported, external/cited, suggested, ambiguous, not
    found, and not extracted information (a smaller initial set is
    acceptable if semantics remain correct).
8.  Generate a basic connection graph or navigable relationship list for
    a few important nodes.
9.  Click a field to get a beginner/technical/math explanation.
10. Turn a missing/ambiguous field into a gap explanation and next-step
    checklist.
11. Export a Markdown report and JSON; YAML is optional if time is
    short.
12. Include one sample paper for a predictable demo, clearly labeled if
    precomputed.

### Defer until the core works

-   Full OCR for all scanned PDFs
-   Robust extraction of every complex table and equation
-   Multiple-paper knowledge graph
-   Citation-following and external repository search
-   Automated conflict resolution across sources
-   Automatic code generation
-   Actual training and experiment execution
-   Adaptive quizzes and long-term learning progress
-   User accounts, teams, cloud project storage
-   Browser extension
-   Bots, MCP server, public API, integrations
-   Dedicated graph database
-   Multi-agent architecture

### One-hour sprint priority

If implementation time is extremely short, prioritize this sequence: 1.
App runs and accepts one PDF. 2. Extract text with page indices. 3.
Generate a paper overview and a small set of experiment fields. 4.
Display fields with quotes/statuses. 5. Click a field to get a grounded
explanation. 6. Display a few supported relationships. 7. Export JSON or
Markdown.

Use one or two LLM calls if needed. Do not spend the hour on
architecture diagrams, authentication, animations, external
integrations, or a complex graph engine.

------------------------------------------------------------------------

## 11. Reliability, edge cases, and safety against fabricated research facts

Research documents are difficult inputs. Handle them explicitly.

### PDF extraction limitations

-   A scanned PDF may require OCR.
-   Equations may be extracted poorly.
-   Tables can lose row/column alignment.
-   Headers, footers, and references can pollute text.
-   Page numbering printed in the document can differ from PDF page
    index.
-   Supplementary material may be a separate file.
-   An LLM can misassociate a value with the wrong model or experiment.

When content cannot be extracted reliably, mark it `not_extracted`,
describe the limitation, and offer manual review or reprocessing. Do not
label it `not_reported`.

### Evidence checks

Minimum checks: - Quote exists in the extracted text for the claimed
page. - Page index is valid. - Evidence belongs to the correct uploaded
document. - Field status is consistent with the available evidence. -
Unknown values are not silently filled. - External-source values retain
their own provenance. - Inferred relationships are labeled as
inferred. - Conflicting values are preserved for review rather than
arbitrarily choosing one.

### Prompt injection inside PDFs

Treat uploaded document text as untrusted content, not as instructions
to the AI system. The paper may contain quoted prompts or malicious
text. Do not let document contents override system/product rules or
trigger tool calls.

### Privacy and secrets

-   Keep API keys in environment variables, never in frontend code.
-   Provide `.env.example` with placeholder names only.
-   Do not log full uploaded paper contents or API secrets
    unnecessarily.
-   Make file storage and deletion behavior clear.
-   Do not send uploaded content to external APIs except as required by
    the selected service and disclosed to the user.

### No false guarantees

Do not label a blueprint "fully reproducible" just because all fields
are filled. Do not convert a checklist completion score into a
probability of success. If a readiness indicator is added, show the
exact criteria and unresolved limitations.

------------------------------------------------------------------------

## 12. Evaluation plan

Use a small, manually reviewed set of AI/ML papers. A first evaluation
set of roughly 10 papers is a practical starting point, not a
statistically conclusive benchmark.

Measure:

-   **Field extraction accuracy:** Does the extracted value match the
    paper?
-   **Evidence validity:** Does the cited quote exist on the cited page?
-   **Semantic support:** Does the passage actually support the claimed
    value?
-   **False-fill rate:** How often does the system invent or overstate a
    setting?
-   **Missing-detail detection:** Does it correctly identify known
    missing or ambiguous settings?
-   **Extraction failure classification:** Does it distinguish unparsed
    content from information not found?
-   **Relationship accuracy:** Are graph edges supported or
    appropriately labeled as inferred?
-   **Learning usefulness:** Can a user better explain the method after
    interacting with field-linked explanations?
-   **Preparation time:** How long does it take to turn a paper into an
    implementation checklist?

The product should optimize for trustworthy uncertainty handling, not
merely the number of populated fields.

------------------------------------------------------------------------

## 13. Demo scenario

Choose one AI/ML paper with a clear methodology, a few experimental
settings, and at least one genuine ambiguity or omitted detail.

Recommended demo sequence:

1.  Upload the paper.
2.  Show the paper overview.
3.  Open the experiment blueprint.
4.  Click a reported parameter and show its source quotation/page.
5.  Open the connection view and trace the parameter to the training
    setup and experiment.
6.  Click the field's Learn action and switch between beginner,
    technical, and mathematical explanations.
7.  Open a genuine unresolved field and show why it matters.
8.  Show the investigated sections or search scope.
9.  Suggest a next step without claiming the suggested setting is
    author-reported.
10. Export the blueprint and unresolved-gap checklist.

The key demo message:

> "Paper2Run doesn't just tell you what a paper says. It connects the
> evidence to the experiment, identifies what remains uncertain, and
> teaches you what you need to understand before making an
> implementation decision."

Do not stage a fake missing field in a way that implies the paper
omitted it. If using mock output, label it clearly as illustrative.

------------------------------------------------------------------------

## 14. Product positioning and messaging

### One-line description

Paper2Run is an evidence-backed research reproduction assistant that
turns AI/ML papers into connected experiment blueprints and gap-driven
learning paths.

### Short pitch

Research papers are difficult to reproduce because their concepts,
experimental settings, and evidence are spread across the document, and
crucial details may be ambiguous or missing. Paper2Run extracts a
structured experiment blueprint, links every supported detail to source
evidence, connects methods and configurations in a Research Connection
Graph, and explains the concepts or gaps that block implementation. It
distinguishes what the authors reported from external evidence and
suggested choices, helping users move from reading research to preparing
a defensible implementation plan.

### Differentiation statement

Paper2Run does not rely on the claim that existing products lack paper
chat, summaries, citations, data extraction, or citation graphs.
Instead, it focuses on integrating: 1. Evidence-backed experiment fields
2. Explicit uncertainty and provenance 3. Within-paper connections
between method, configuration, result, and claim 4. Learning actions
tied to actual blueprint fields and gaps 5. Reproduction checklists and
exportable configurations

The differentiation must be demonstrated in the product and validated
through competitor research and user testing.

### Suggested elevator pitch

"Paper2Run helps AI/ML students go from a research paper to an
implementation plan they can actually reason about. It extracts
experimental settings with evidence, connects the methods and results,
identifies what is missing, and teaches the concepts needed to resolve
those gaps---without pretending unknown values are facts."

------------------------------------------------------------------------

## 15. Known limitations and honest boundaries

-   Paper2Run cannot infer an author's undocumented intentions with
    certainty.
-   A source quote may exist without fully supporting the model's
    interpretation.
-   A missing field may exist in a supplement, code repository, or cited
    work not yet examined.
-   A common implementation choice may not match the original
    experiment.
-   Different library versions, hardware, random seeds, data splits, and
    training conditions can affect results.
-   A complete blueprint does not guarantee exact reproduction.
-   Graph edges can be wrong unless their provenance and inference
    status are checked.
-   General background explanations can be useful but should not be
    presented as claims made by the paper.
-   The first version is intended for AI/ML experimental papers and
    text-based PDFs; complex equations, scanned documents, and tables
    need additional work.

------------------------------------------------------------------------

## 16. Suggested implementation checklist

Use this as the engineering checklist. Adapt it after inspecting the
existing repository.

### Foundation

-   [ ] Inspect repository and preserve existing working code.
-   [ ] Create a runnable frontend/backend workflow.
-   [ ] Configure API keys securely via environment variables.
-   [ ] Implement PDF upload validation.
-   [ ] Extract text by page and preserve page indices.
-   [ ] Handle empty/scanned/invalid PDFs gracefully.

### Extraction and evidence

-   [ ] Define Pydantic schemas for fields, evidence, statuses, nodes,
    and edges.
-   [ ] Generate a paper overview.
-   [ ] Extract core experiment fields.
-   [ ] Require explicit unknown values rather than guesses.
-   [ ] Validate page references and quote presence.
-   [ ] Distinguish semantic support from quote matching.
-   [ ] Keep external-source and suggested values separate.
-   [ ] Show unresolved and conflicting fields.

### Connections

-   [ ] Generate a small set of typed nodes.
-   [ ] Generate only evidence-supported or clearly labeled inferred
    edges.
-   [ ] Store evidence IDs on nodes/edges where applicable.
-   [ ] Allow users to inspect relationships.
-   [ ] Link blueprint fields to relevant concepts and evidence.

### Learning and gaps

-   [ ] Implement beginner explanation.
-   [ ] Implement technical-intuition explanation.
-   [ ] Implement mathematical explanation when suitable.
-   [ ] Link explanations to blueprint fields.
-   [ ] Generate a gap explanation and next-step checklist.
-   [ ] Distinguish paper claims from background knowledge and
    suggestions.

### Output and quality

-   [ ] Export Markdown report.
-   [ ] Export JSON.
-   [ ] Optionally export YAML.
-   [ ] Test at least one paper with reported settings and one with
    ambiguous or missing details.
-   [ ] Verify that unknown values are not silently filled.
-   [ ] Test API failure, malformed model output, and PDF parsing
    failure.
-   [ ] Confirm that the app can be started from the README.

------------------------------------------------------------------------

## 17. Final instruction to the implementation agent

Build Paper2Run as a coherent product, not as a generic chatbot with a
graph bolted onto it.

The central data structure is the evidence-backed experiment blueprint.
The Research Connection Graph links its fields to methods, results,
claims, evidence, and learning resources. The learning engine uses those
relationships to explain concepts and investigate gaps. The verification
system preserves uncertainty and source provenance. Export turns the
result into a practical implementation plan.

**Implement the smallest end-to-end version first. Keep every fact
traceable, every uncertainty visible, and every learning interaction
connected to the actual paper.**
