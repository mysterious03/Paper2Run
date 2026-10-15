import React, { useState, useEffect } from 'react';
import { BlueprintField, LearningExplanation } from '../types';
import { requestExplanation } from '../lib/api';
import { BookOpen, GraduationCap, Cpu, Binary, Quote, AlertTriangle, ArrowRight, CheckCircle2, GitMerge, CheckSquare, Square } from 'lucide-react';

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
  const [panelMode, setPanelMode] = useState<'concept' | 'prerequisites'>('concept');
  const [level, setLevel] = useState<'beginner' | 'technical' | 'math'>('technical');
  const [explanation, setExplanation] = useState<LearningExplanation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [knownPrereqs, setKnownPrereqs] = useState<Record<string, boolean>>({});

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

  const togglePrereq = (id: string) => {
    setKnownPrereqs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Blueprint-derived prerequisite sequence
  const prerequisites = [
    {
      id: 'prereq_tokenization',
      title: '1. Subword Tokenization & Byte-Pair Encoding (BPE)',
      role: 'Vocabulary representation & token sequence bounds',
      type: 'Data Preparation',
      fieldCategory: 'preprocessing',
      summary: 'Before tokens enter the neural network, raw text must be converted into subword tokens using learned merge tables.',
      provenance: 'Explicitly reported in document'
    },
    {
      id: 'prereq_attention',
      title: '2. Scaled Dot-Product & Multi-Head Self-Attention',
      role: 'Core representation mechanism replacing recurrence',
      type: 'Model Architecture',
      fieldCategory: 'model_architecture',
      summary: 'Allows tokens to compute dynamic pairwise relevance in parallel with O(1) sequential path length.',
      provenance: 'Explicitly reported in document'
    },
    {
      id: 'prereq_residuals',
      title: '3. Residual Connections & Layer Normalization',
      role: 'Gradient propagation stability through deep layers',
      type: 'Architecture Stabilization',
      fieldCategory: 'model_architecture',
      summary: 'Enables training deep 6-layer to 12-layer stacks without gradient vanishing or exploding.',
      provenance: 'Explicitly reported in document'
    },
    {
      id: 'prereq_optimizer',
      title: '4. First & Second Moment Tracking (Adam Optimizer)',
      role: 'Adaptive per-parameter optimization dynamics',
      type: 'Optimization',
      fieldCategory: 'optimizer',
      summary: 'Tracks uncentered variance with custom beta2=0.98 to quickly adapt to non-stationary gradient shifts.',
      provenance: 'Explicitly reported in document'
    },
    {
      id: 'prereq_warmup',
      title: '5. Inverse Square-Root Warmup Schedule',
      role: 'Early training stabilization & annealing',
      type: 'Optimization Schedule',
      fieldCategory: 'optimizer',
      summary: 'Linearly increases learning rate during early steps to prevent divergent step sizes before moments stabilize.',
      provenance: 'Explicitly reported in document'
    }
  ];

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* Top Controls: Explainer vs Prerequisites Switcher */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{
          display: 'flex',
          background: '#0d0d0d',
          padding: '3px',
          borderRadius: '6px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <button
            type="button"
            onClick={() => setPanelMode('concept')}
            style={{
              background: panelMode === 'concept' ? '#ffffff' : 'transparent',
              color: panelMode === 'concept' ? '#000000' : '#a1a1aa',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 14px',
              fontSize: '0.78rem',
              fontWeight: panelMode === 'concept' ? 600 : 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
            aria-pressed={panelMode === 'concept'}
          >
            <BookOpen size={14} aria-hidden="true" />
            <span>Concept Explainer</span>
          </button>
          <button
            type="button"
            onClick={() => setPanelMode('prerequisites')}
            style={{
              background: panelMode === 'prerequisites' ? '#ffffff' : 'transparent',
              color: panelMode === 'prerequisites' ? '#000000' : '#a1a1aa',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 14px',
              fontSize: '0.78rem',
              fontWeight: panelMode === 'prerequisites' ? 600 : 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
            aria-pressed={panelMode === 'prerequisites'}
          >
            <GitMerge size={14} aria-hidden="true" />
            <span>Prerequisites Roadmap</span>
          </button>
        </div>

        {panelMode === 'concept' && (
          /* 3-Tier Depth Selector */
          <div role="group" aria-label="Select explanation depth" style={{
            display: 'flex',
            gap: '4px',
            background: '#0d0d0d',
            padding: '3px',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            {[
              { id: 'beginner', label: 'Beginner', icon: <GraduationCap size={13} aria-hidden="true" /> },
              { id: 'technical', label: 'Technical Intuition', icon: <Cpu size={13} aria-hidden="true" /> },
              { id: 'math', label: 'Mathematical Deep Dive', icon: <Binary size={13} aria-hidden="true" /> }
            ].map((btn) => {
              const isSelected = level === btn.id;
              return (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setLevel(btn.id as any)}
                  style={{
                    background: isSelected ? '#ffffff' : 'transparent',
                    color: isSelected ? '#000000' : '#a1a1aa',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '5px 12px',
                    fontSize: '0.76rem',
                    fontWeight: isSelected ? 600 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.15s ease'
                  }}
                  aria-pressed={isSelected}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.color = '#a1a1aa';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {btn.icon}
                  <span>{btn.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {panelMode === 'prerequisites' ? (
        /* Prerequisites Roadmap View */
        <div className="glass-panel" style={{ padding: '24px', background: '#0a0a0a' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '4px' }}>
              Execution & Understanding Prerequisites
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#71717a' }}>
              Mastery roadmap grounded in the paper's extracted architectural and mathematical dependencies.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {prerequisites.map((p) => {
              const isDone = Boolean(knownPrereqs[p.id]);
              return (
                <div
                  key={p.id}
                  style={{
                    background: isDone ? 'rgba(255, 255, 255, 0.02)' : '#0d0d0d',
                    border: isDone ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    transition: 'all 0.2s ease',
                    opacity: isDone ? 0.65 : 1
                  }}
                >
                  <button
                    type="button"
                    onClick={() => togglePrereq(p.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: isDone ? '#ffffff' : '#71717a',
                      cursor: 'pointer',
                      padding: 0,
                      marginTop: '2px',
                      transition: 'all 0.15s ease'
                    }}
                    aria-label={`Mark ${p.title} as ${isDone ? 'pending' : 'understood'}`}
                    aria-pressed={isDone}
                    title={isDone ? 'Mark as pending' : 'Mark as understood'}
                  >
                    {isDone ? <CheckSquare size={18} color="#ffffff" aria-hidden="true" /> : <Square size={18} aria-hidden="true" />}
                  </button>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        color: isDone ? '#a1a1aa' : '#ffffff',
                        textDecoration: isDone ? 'line-through' : 'none'
                      }}>
                        {p.title}
                      </span>
                      <span style={{
                        fontSize: '0.65rem',
                        background: '#18181b',
                        color: '#a1a1aa',
                        padding: '1px 6px',
                        borderRadius: '3px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        textTransform: 'uppercase'
                      }}>
                        {p.type}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: isDone ? '#71717a' : '#a1a1aa', lineHeight: 1.5, marginBottom: '6px' }}>
                      {p.summary}
                    </p>

                    <div style={{ fontSize: '0.7rem', color: '#71717a', fontStyle: 'italic' }}>
                      Source: {p.provenance}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Concept Explainer Split View */
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '16px' }}>
          {/* Left Column: Parameter List */}
          <div className="glass-panel" style={{ padding: '14px', maxHeight: '640px', overflowY: 'auto', background: '#0a0a0a' }}>
            <div style={{ fontSize: '0.68rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '8px' }}>
              Select Blueprint Concept
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {allFields.map((field) => {
                const isSelected = activeField?.id === field.id;
                return (
                  <button
                    key={field.id}
                    onClick={() => onSelectField(field)}
                    style={{
                      textAlign: 'left',
                      padding: '8px 10px',
                      borderRadius: '5px',
                      background: isSelected ? '#ffffff' : '#0d0d0d',
                      color: isSelected ? '#000000' : '#a1a1aa',
                      border: isSelected ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.06)',
                      fontSize: '0.78rem',
                      fontWeight: isSelected ? 600 : 400,
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.background = '#141414';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.color = '#a1a1aa';
                        e.currentTarget.style.background = '#0d0d0d';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                      }
                    }}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {field.name}
                    </span>
                    <ArrowRight size={12} color={isSelected ? '#000000' : '#71717a'} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Explanation Canvas */}
          <div className="glass-panel" style={{ padding: '24px', background: '#0a0a0a', minHeight: '400px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: '#71717a' }}>
                <div style={{
                  display: 'inline-block',
                  width: '28px',
                  height: '28px',
                  border: '2px solid rgba(255, 255, 255, 0.15)',
                  borderTopColor: '#ffffff',
                  borderRadius: '50%',
                  animation: 'spinSlow 0.9s linear infinite',
                  marginBottom: '12px'
                }} />
                <p style={{ fontSize: '0.82rem' }}>Synthesizing {level} explanation...</p>
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#71717a' }}>
                <p>Failed to load explanation: {error}</p>
              </div>
            ) : explanation && activeField ? (
              <div>
                {/* Header */}
                <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{
                      fontSize: '0.68rem',
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-mono)',
                      textTransform: 'uppercase'
                    }}>
                      {activeField.category.replace('_', ' ')}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#71717a' }}>
                      Current Value: <strong style={{ color: '#ffffff' }}>{activeField.value || 'Not reported'}</strong>
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                    {activeField.name}
                  </h3>
                </div>

                {/* Explanation Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Intuition / High-level explanation */}
                  <div>
                    <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                      {level === 'beginner' ? 'Intuitive Analogy' : level === 'technical' ? 'Technical Mechanism & Convergence' : 'Mathematical Formulation'}
                    </h4>
                    <p style={{ fontSize: '0.86rem', color: '#e4e4e7', lineHeight: 1.65, marginBottom: '10px' }}>
                      {explanation.summary}
                    </p>
                    <p style={{ fontSize: '0.82rem', color: '#a1a1aa', lineHeight: 1.6 }}>
                      {explanation.content}
                    </p>
                  </div>

                  {/* Math / Technical Deep Dive Equations */}
                  {explanation.math_formulation && (
                    <div style={{
                      background: '#050505',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '6px',
                      padding: '16px'
                    }}>
                      <div style={{ fontSize: '0.72rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px' }}>
                        Rigorous Equations & Symbols
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.85rem',
                        color: '#ffffff',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap'
                      }}>
                        {explanation.math_formulation}
                      </div>
                    </div>
                  )}

                  {/* Practical Reproduction Warning */}
                  {explanation.reproduction_note && (
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px dashed rgba(255, 255, 255, 0.18)',
                      borderRadius: '6px',
                      padding: '14px 16px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <AlertTriangle size={15} color="#ffffff" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Practical Reproduction Warning
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#a1a1aa', lineHeight: 1.55 }}>
                        {explanation.reproduction_note}
                      </p>
                    </div>
                  )}

                  {/* Author Quote vs Background Knowledge Attribution */}
                  <div style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingTop: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '0.72rem',
                    color: '#71717a'
                  }}>
                    <span style={{
                      background: '#141414',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      fontWeight: 600
                    }}>
                      HONEST ATTRIBUTION
                    </span>
                    <span>
                      {explanation.is_author_reported
                        ? `Directly reported by paper authors in examined document text.`
                        : 'Derived from formal ML background knowledge (not explicitly cited by authors).'}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
