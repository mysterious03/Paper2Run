import React, { useState, useEffect } from 'react';
import { BlueprintField, LearningExplanation } from '../types';
import { requestExplanation } from '../lib/api';
import { BookOpen, GraduationCap, Cpu, Binary, Quote, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LearningPanelProps {
  paperId: string;
  selectedField: BlueprintField | null;
  onSelectField: (field: BlueprintField) => void;
  allFields: BlueprintField[];
}

export const LearningPanel: React.FC<LearningPanelProps> = ({
  paperId,
  selectedField,
  onSelectField,
  allFields
}) => {
  const [level, setLevel] = useState<'beginner' | 'technical' | 'math'>('technical');
  const [explanation, setExplanation] = useState<LearningExplanation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const activeField = selectedField || (allFields.length > 0 ? allFields[0] : null);

  useEffect(() => {
    if (!activeField) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    requestExplanation(paperId, activeField.id, level)
      .then((res) => {
        if (isMounted) {
          setExplanation(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to load explanation');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [paperId, activeField?.id, level]);

  if (!activeField) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Select any blueprint field to begin learning.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px', alignItems: 'start' }}>
      {/* Sidebar: Available Concepts from Blueprint */}
      <div className="glass-panel" style={{ padding: '16px', maxHeight: '720px', overflowY: 'auto' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.04em' }}>
          Blueprint Concepts
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {allFields.map((f) => {
            const isSelected = activeField.id === f.id;
            return (
              <button
                key={f.id}
                onClick={() => onSelectField(f)}
                style={{
                  textAlign: 'left',
                  background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                  border: isSelected ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                  color: isSelected ? '#fff' : 'var(--text-secondary)',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: isSelected ? 600 : 400,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {f.name}
                </span>
                <span className={`status-badge status-${f.status}`} style={{ fontSize: '0.62rem', padding: '1px 4px' }}>
                  {f.status}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Learning Canvas */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Header & Concept Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className={`status-badge status-${activeField.status}`}>
                {activeField.status.replace('_', ' ')}
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Category: {activeField.category}
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
              {activeField.name}
            </h2>
            {activeField.value && (
              <div style={{ fontSize: '0.85rem', color: '#38bdf8', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                Extracted Value: {activeField.value}
              </div>
            )}
          </div>

          {/* 3-Tier Level Selector */}
          <div style={{
            display: 'flex',
            background: 'rgba(15, 23, 42, 0.9)',
            padding: '3px',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)'
          }}>
            {[
              { id: 'beginner', label: 'Beginner', icon: <GraduationCap size={14} /> },
              { id: 'technical', label: 'Technical Intuition', icon: <Cpu size={14} /> },
              { id: 'math', label: 'Mathematical Deep Dive', icon: <Binary size={14} /> }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setLevel(btn.id as any)}
                style={{
                  background: level === btn.id ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'transparent',
                  color: level === btn.id ? '#fff' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  fontWeight: level === btn.id ? 700 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: level === btn.id ? '0 2px 8px rgba(99, 102, 241, 0.3)' : 'none'
                }}
              >
                {btn.icon}
                <span>{btn.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ display: 'inline-block', width: '28px', height: '28px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '12px' }} />
            <p>Formulating grounded {level} explanation...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '20px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#f87171' }}>
            {error}
          </div>
        ) : explanation ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Core Summary Card */}
            <div style={{
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '8px',
              padding: '14px 18px',
              fontSize: '0.92rem',
              fontWeight: 600,
              color: '#c7d2fe',
              lineHeight: 1.5
            }}>
              💡 {explanation.summary}
            </div>

            {/* Deep Explanation */}
            <div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.04em' }}>
                Explanation ({explanation.explanation_level.toUpperCase()})
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#f1f5f9', lineHeight: 1.65, whiteSpace: 'pre-line' }}>
                {explanation.content}
              </p>
            </div>

            {/* Math Formulation Block (If available) */}
            {explanation.math_formulation && (
              <div style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '14px 18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: '#a855f7', fontSize: '0.78rem', fontWeight: 700 }}>
                  <Binary size={14} />
                  <span>Mathematical Formalism & Equations</span>
                </div>
                <pre style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  color: '#e2e8f0',
                  overflowX: 'auto',
                  lineHeight: 1.5
                }}>
                  {explanation.math_formulation}
                </pre>
              </div>
            )}

            {/* Concrete Analogy or Example */}
            {explanation.analogies_or_examples && (
              <div style={{
                background: 'rgba(6, 182, 212, 0.06)',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '0.82rem',
                color: '#a5f3fc'
              }}>
                <strong>Intuitive Analogy:</strong> {explanation.analogies_or_examples}
              </div>
            )}

            {/* Critical Reproduction Tip */}
            <div style={{
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '8px',
              padding: '12px 16px',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start'
            }}>
              <AlertTriangle size={18} color="#fbbf24" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase' }}>
                  Reproduction Implementation Warning
                </div>
                <div style={{ fontSize: '0.82rem', color: '#fef3c7', marginTop: '2px', lineHeight: 1.45 }}>
                  {explanation.reproduction_note}
                </div>
              </div>
            </div>

            {/* Source Quotes from the Paper */}
            {explanation.related_evidence && explanation.related_evidence.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 700 }}>
                  <Quote size={14} />
                  <span>Verified Textual Citations From Document</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {explanation.related_evidence.map((ev, i) => (
                    <div key={i} style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '10px 14px',
                      fontSize: '0.78rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#38bdf8' }}>
                        <span>Page {ev.page_index + 1} • {ev.section}</span>
                        <span style={{ color: ev.quote_match ? '#34d399' : '#fbbf24', fontWeight: 600 }}>
                          {ev.quote_match ? '✓ Verifiable Quote Match' : '⚠ Off-page / Needs Review'}
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.4 }}>
                        "{ev.quote}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
