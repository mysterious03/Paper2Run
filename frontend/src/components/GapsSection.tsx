import React, { useState } from 'react';
import { GapItem } from '../types';
import { AlertOctagon, HelpCircle, CheckSquare, Square, ExternalLink, Lightbulb, Search } from 'lucide-react';

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
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Unresolved Reproduction Gaps & Verification
          </h2>
          <span style={{
            fontSize: '0.68rem',
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '2px 8px',
            borderRadius: '4px',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)'
          }}>
            {gaps.length} GAPS DETECTED
          </span>
        </div>
        <p style={{ fontSize: '0.76rem', color: '#71717a' }}>
          Detailed audit of ambiguous or omitted parameters, why they affect convergence, and transparent candidate suggestions.
        </p>
      </div>

      {gaps.length === 0 ? (
        <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: '#ffffff', background: '#0a0a0a' }}>
          ✓ No critical reproduction gaps detected in examined sections.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {gaps.map((gap) => (
            <div
              key={gap.field_id}
              className="glass-panel"
              style={{
                padding: '20px',
                borderLeft: '3px solid #ffffff',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                background: '#0a0a0a'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className={`status-badge status-${gap.status}`}>
                      {gap.status.replace('_', ' ')}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: '#71717a', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                      {gap.category}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                    {gap.field_name}
                  </h3>
                </div>

                <div style={{
                  background: '#141414',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '5px',
                  padding: '4px 10px',
                  fontSize: '0.72rem',
                  color: '#ffffff',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <AlertOctagon size={13} color="#ffffff" />
                  <span>Missing from Paper Text</span>
                </div>
              </div>

              {/* What is missing & Why it matters */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{
                  background: '#050505',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  padding: '12px 14px'
                }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#71717a', textTransform: 'uppercase', marginBottom: '4px' }}>
                    What is Missing or Ambiguous?
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#e4e4e7', lineHeight: 1.5 }}>
                    {gap.missing_explanation}
                  </p>
                </div>

                <div style={{
                  background: '#050505',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  padding: '12px 14px'
                }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#71717a', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Why It Directly Threatens Reproduction
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#e4e4e7', lineHeight: 1.5 }}>
                    {gap.why_it_matters}
                  </p>
                </div>
              </div>

              {/* Candidate Suggestion (Labeled Transparently) */}
              {gap.suggested_candidate_value && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  padding: '12px 16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{
                      background: '#ffffff',
                      color: '#000000',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '3px',
                      letterSpacing: '0.04em'
                    }}>
                      TRANSPARENT SUGGESTION
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>
                      (Community candidate — NOT authors' claim)
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#71717a' }}>Recommended Value:</span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.84rem',
                      color: '#ffffff',
                      fontWeight: 700,
                      background: '#141414',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      border: '1px solid rgba(255, 255, 255, 0.15)'
                    }}>
                      {gap.suggested_candidate_value}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: '#a1a1aa', lineHeight: 1.45, marginBottom: '6px' }}>
                    {gap.candidate_rationale}
                  </p>

                  {gap.candidate_source && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#71717a' }}>
                      <ExternalLink size={12} color="#ffffff" />
                      <span>Reference source: <strong style={{ color: '#ffffff' }}>{gap.candidate_source}</strong></span>
                    </div>
                  )}
                </div>
              )}

              {/* Investigation Checklist */}
              {gap.recommended_actions && gap.recommended_actions.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#71717a', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Reproduction Investigation Checklist
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {gap.recommended_actions.map((step: string, sIdx: number) => {
                      const isDone = Boolean(checkedActions[`${gap.field_id}_${sIdx}`]);
                      return (
                        <div
                          key={sIdx}
                          role="checkbox"
                          tabIndex={0}
                          aria-checked={isDone}
                          aria-label={`Checklist action: ${step}`}
                          onClick={() => toggleAction(gap.field_id, sIdx)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              toggleAction(gap.field_id, sIdx);
                            }
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            color: isDone ? '#52525b' : '#e4e4e7',
                            textDecoration: isDone ? 'line-through' : 'none',
                            transition: 'all 0.15s ease',
                            outline: 'none'
                          }}
                        >
                          {isDone ? (
                            <CheckSquare size={15} color="#ffffff" aria-hidden="true" />
                          ) : (
                            <Square size={15} color="#71717a" aria-hidden="true" />
                          )}
                          <span>{step}</span>
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
