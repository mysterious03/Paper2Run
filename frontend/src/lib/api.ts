import { AnalysisResult, LearningExplanation } from '../types';

const BASE_URL = '/api';

export async function checkHealth() {
  const res = await fetch(`${BASE_URL}/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function fetchSamplePaper(): Promise<AnalysisResult> {
  const res = await fetch(`${BASE_URL}/sample`);
  if (!res.ok) throw new Error('Failed to fetch sample paper');
  return res.json();
}

export async function uploadPdfPaper(file: File): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BASE_URL}/papers`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Upload failed' }));
    throw new Error(err.detail || 'Upload failed');
  }

  return res.json();
}

export async function fetchPaperAnalysis(paperId: string): Promise<AnalysisResult> {
  const res = await fetch(`${BASE_URL}/papers/${paperId}`);
  if (!res.ok) throw new Error('Failed to fetch paper analysis');
  return res.json();
}

export async function requestExplanation(
  paperId: string,
  fieldId: string,
  level: 'beginner' | 'technical' | 'math' = 'technical'
): Promise<LearningExplanation> {
  const res = await fetch(`${BASE_URL}/papers/${paperId}/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ field_id: fieldId, level }),
  });

  if (!res.ok) throw new Error('Failed to generate learning explanation');
  return res.json();
}

export function getExportUrl(paperId: string, format: 'markdown' | 'json' | 'yaml' | 'checklist'): string {
  return `${BASE_URL}/papers/${paperId}/export?format=${format}`;
}
