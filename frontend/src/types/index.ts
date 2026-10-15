export type FieldStatus =
  | 'reported'
  | 'external_source'
  | 'suggested'
  | 'ambiguous'
  | 'not_found'
  | 'not_extracted'
  | 'conflicting';

export type SemanticSupportStatus =
  | 'verified'
  | 'supported'
  | 'needs_review'
  | 'unsupported'
  | 'inferred';

export interface EvidenceItem {
  evidence_id: string;
  page_index: number;
  printed_page_number?: number;
  section?: string;
  quote: string;
  quote_match: boolean;
  semantic_support: SemanticSupportStatus;
  notes?: string;
}

export interface BlueprintField {
  id: string;
  name: string;
  category: string;
  value: string | null;
  status: FieldStatus;
  evidence: EvidenceItem[];
  notes: string[];
  document_id: string;
  relationships: string[];
}

export interface PaperOverview {
  research_problem: string;
  motivation_and_method: string;
  main_architecture: string;
  main_results: string;
  limitations_and_questions: string;
}

export interface GraphNode {
  id: string;
  type: string;
  label: string;
  status: FieldStatus;
  value?: string | null;
  evidence_ids: string[];
  metadata?: Record<string, any>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  provenance_type: 'explicit' | 'inferred' | 'external';
  evidence_ids?: string[];
  status?: string;
  label?: string;
}

export interface ResearchGraph {
  document_id: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface LearningExplanation {
  concept_id: string;
  concept_name: string;
  explanation_level: 'beginner' | 'technical' | 'math';
  summary: string;
  content: string;
  paper_context: string;
  math_formulation?: string | null;
  analogies_or_examples?: string | null;
  reproduction_note: string;
  related_evidence: EvidenceItem[];
  related_nodes: string[];
  is_author_reported: boolean;
}

export interface GapItem {
  field_id: string;
  field_name: string;
  category: string;
  status: FieldStatus;
  missing_explanation: string;
  why_it_matters: string;
  examined_sections: string[];
  recommended_actions: string[];
  suggested_candidate_value?: string | null;
  candidate_rationale?: string | null;
  candidate_source?: string | null;
}

export interface PaperMetadata {
  paper_id: string;
  filename: string;
  title: string;
  page_count: number;
  created_at: string;
  status: 'uploaded' | 'extracting' | 'analyzed' | 'error';
  error_message?: string | null;
  is_sample_demo: boolean;
  overview?: PaperOverview;
  total_fields: number;
  reported_fields: number;
  unresolved_gaps: number;
}

export interface AnalysisResult {
  paper_id: string;
  metadata: PaperMetadata;
  overview: PaperOverview;
  blueprint: BlueprintField[];
  graph: ResearchGraph;
  gaps: GapItem[];
}
