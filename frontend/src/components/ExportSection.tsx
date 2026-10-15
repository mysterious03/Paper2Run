import React, { useState } from 'react';
import { Download, Copy, Check, FileText, Code2, CheckSquare, Layers } from 'lucide-react';
import { AnalysisResult } from '../types';
import { getExportUrl } from '../lib/api';

interface ExportSectionProps {
  paper: AnalysisResult;
}

export const ExportSection: React.FC<ExportSectionProps> = ({ paper }) => {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const exportCards = [
    {
      format: 'markdown' as const,
      name: '1. Reproduction Report (.md)',
      badge: 'Full Documentation',
      icon: <FileText size={20} color="#ffffff" aria-hidden="true" />,
      desc: 'Complete academic report including verified quotes, section citations, model specifications, and gap investigation notes.',
      samplePreview: `# Reproduction Report: ${paper.metadata.title}\n\n## 1. Verified Parameters (${paper.metadata.reported_fields}/${paper.metadata.total_fields} Reported)\n- Architecture: ${paper.blueprint.find(f => f.category.includes('architecture'))?.value || 'See blueprint'}\n- Optimizer: ${paper.blueprint.find(f => f.category.includes('optimizer'))?.value || 'See blueprint'}\n\n## 2. Reproduction Gaps\n${paper.gaps.map(g => `- ${g.field_name}: ${g.missing_explanation}`).join('\n')}`
    },
    {
      format: 'json' as const,
      name: '2. Structured Blueprint (.json)',
      badge: 'Machine-Readable',
      icon: <Code2 size={20} color="#ffffff" aria-hidden="true" />,
      desc: 'Strict JSON schema preserving null values for unstated parameters and explicit provenance for all values.',
      samplePreview: JSON.stringify({
        paper_id: paper.paper_id,
        title: paper.metadata.title,
        parameters: paper.blueprint.slice(0, 3).map(f => ({
          name: f.name,
          value: f.value,
          status: f.status
        }))
      }, null, 2)
    },
    {
      format: 'yaml' as const,
      name: '3. Experiment Config (.yaml)',
      badge: 'Hydra / PyTorch Ready',
      icon: <Layers size={20} color="#ffffff" aria-hidden="true" />,
      desc: 'Hierarchical YAML configuration ready to drop directly into PyTorch, Lightning, or Hydra training workflows.',
      samplePreview: `experiment:\n  title: "${paper.metadata.title}"\n  reported_fields: ${paper.metadata.reported_fields}\nmodel:\n  parameters:\n${paper.blueprint.slice(0, 4).map(f => `    ${f.id}: "${f.value || 'null'}"`).join('\n')}`
    },
    {
      format: 'checklist' as const,
      name: '4. Actionable Checklist (.md)',
      badge: 'Step-by-Step QA',
      icon: <CheckSquare size={20} color="#ffffff" aria-hidden="true" />,
      desc: 'Five-phase execution checklist covering Environment, Data Ingestion, Model Checkpoint Verification, Training, and Evaluation.',
      samplePreview: `# Reproduction Execution Checklist\n\n- [ ] Phase 1: Environment & CUDA Hardware Alignment\n- [ ] Phase 2: Tokenization & Dataset Splits Verification\n- [ ] Phase 3: Model Architecture Hyperparameters Alignment\n- [ ] Phase 4: Optimizer Hyperparameter Tuning & Warmup\n- [ ] Phase 5: Evaluation Metric Computation`
    }
  ];

  const handleCopyPreview = (content: string, format: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    });
  };

  return (
    <section aria-labelledby="export-hub-heading" style={{ marginBottom: '36px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 id="export-hub-heading" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '4px' }}>
          Step 5: Export Reproduction Recipes & Code Assets
        </h2>
        <p style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>
          Download ready-to-run configurations, academic reproduction reports, and phase-by-phase execution checklists.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {exportCards.map((card) => {
          const downloadUrl = getExportUrl(paper.paper_id, card.format);
          const isCopied = copiedFormat === card.format;

          return (
            <article
              key={card.format}
              className="glass-card"
              style={{
                padding: '20px',
                background: '#0d0d0d',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      background: '#18181b',
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(255, 255, 255, 0.12)'
                    }}>
                      {card.icon}
                    </div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                      {card.name}
                    </h3>
                  </div>
                  <span style={{
                    fontSize: '0.65rem',
                    background: '#141414',
                    color: '#e4e4e7',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {card.badge}
                  </span>
                </div>

                <p style={{ fontSize: '0.78rem', color: '#a1a1aa', lineHeight: 1.5, marginBottom: '12px' }}>
                  {card.desc}
                </p>

                {/* Code Preview Block */}
                <div style={{
                  background: '#050505',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: '#a1a1aa',
                  maxHeight: '120px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.45
                }}>
                  {card.samplePreview}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
                <a
                  href={downloadUrl}
                  download
                  className="btn-primary"
                  style={{ flex: 1, textDecoration: 'none', justifyContent: 'center', padding: '8px 12px', fontSize: '0.78rem' }}
                  aria-label={`Download ${card.name}`}
                >
                  <Download size={14} aria-hidden="true" />
                  <span>Download File</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopyPreview(card.samplePreview, card.format)}
                  className="btn-secondary"
                  style={{ padding: '8px 12px', fontSize: '0.78rem' }}
                  aria-label={`Copy preview snippet of ${card.name}`}
                >
                  {isCopied ? <Check size={14} color="#ffffff" aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
