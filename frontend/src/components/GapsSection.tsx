import React, { useState } from 'react';
import { GapItem } from '../types';
import { AlertOctagon, HelpCircle, CheckSquare, Square, ExternalLink, Lightbulb, Compass, Search } from 'lucide-react';

interface GapsSectionProps {
  gaps: GapItem[];
}

export const GapsSection: React.FC<GapsSectionProps> = ({ gaps }) => {
  const [checkedActions, setCheckedActions] = useState<Record<string, boolean>>({});

  const toggleAction = (gapId: string, actionIdx: number) => {
    const key = `${gapId}_${actionIdx}`;
    setCheckedActions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
            Unresolved Reproduction Gaps & Verification
          </h2>
          <span style={{
            fontSize: '0.72rem',
            background: 'rgba(244, 63, 94, 0.15)',
            color: '#fb7185',
            padding: '2px 8px',
            borderRadius: '4px',
            fontWeight: 700
          }}>
            {gaps.length} CRITICAL GAPS IDENTIFIED
          </span>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Transparent breakdown of ambiguous or omitted parameters, why they matter to training convergence, and candidate suggestions.
        </p>
      </div>

      {gaps.length === 0 ? (
        <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: '#34d399' }}>
          ✓ No critical reproduction gaps detected in examined sections.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {gaps.map((gap) => (
            <div
              key={gap.field_id}
              className="glass-panel"
              style={{
                padding: '20px',
                borderLeft: '4px solid #fb7185',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className={`status-badge status-${gap.status}`}>
                      {gap.status.replace('_', ' ')}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {gap.category}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                    {gap.field_name}
                  </h3>
                </div>

                <div style={{
                  background: 'rgba(244, 63, 94, 0.1)',
                  border: '1px solid rgba(244, 63, 94, 0.25)',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.74rem',
                  color: '#fb7185',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <AlertOctagon size={14} />
                  <span>Missing from Paper Text</span>
                </div>
              </div>

              {/* What is missing & Why it matters */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '12px 16px'
                }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
                    What is Missing or Ambiguous?
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                    {gap.missing_explanation}
                  </p>
                </div>

                <div style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '12px 16px'
                }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#fb7185', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Why Does This Matter to Reproduction?
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                    {gap.why_it_matters}
                  </p>
                </div>
              </div>

              {/* Examined sections */}
              {gap.examined_sections && gap.examined_sections.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  <Search size={14} color="#64748b" />
                  <span><strong>Sections Examined in PDF:</strong> {gap.examined_sections.join(', ')}</span>
                </div>
              )}

              {/* Candidate Suggestion (Marked explicitly as suggestion) */}
              {gap.suggested_candidate_value && (
                <div style={{
                  background: 'rgba(6, 182, 212, 0.08)',
                  border: '1px solid rgba(6, 182, 212, 0.25)',
                  borderRadius: '8px',
                  padding: '14px 18px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    <Lightbulb size={14} />
                    <span>Candidate Implementation Suggestion (Not Author-Reported)</span>
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    color: '#fff',
                    marginTop: '6px',
                    fontWeight: 600,
                    background: 'rgba(0, 0, 0, 0.3)',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    display: 'inline-block'
                  }}>
                    {gap.suggested_candidate_value}
                  </div>
                  {gap.candidate_rationale && (
                    <p style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '6px' }}>
                      <em>Rationale:</em> {gap.candidate_rationale}
                    </p>
                  )}
                  {gap.candidate_source && (
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                      <em>Recommended Reference Source:</em> {gap.candidate_source}
                    </div>
                  )}
                </div>
              )}

              {/* Actionable Investigation Checklist */}
              {gap.recommended_actions && gap.recommended_actions.length > 0 && (
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Investigation & Reproduction Checklist:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {gap.recommended_actions.map((act, actIdx) => {
                      const isChecked = !!checkedActions[`${gap.field_id}_${actIdx}`];
                      return (
                        <div
                          key={actIdx}
                          onClick={() => toggleAction(gap.field_id, actIdx)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            cursor: 'pointer',
                            fontSize: '0.82rem',
                            color: isChecked ? '#94a3b8' : '#f1f5f9',
                            textDecoration: isChecked ? 'line-through' : 'none'
                          }}
                        >
                          {isChecked ? (
                            <CheckSquare size={16} color="#10b981" />
                          ) : (
                            <Square size={16} color="#64748b" />
                          )}
                          <span>{act}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
