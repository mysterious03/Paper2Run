import React, { useState, useMemo } from 'react';
import { BlueprintField } from '../types';
import { BookOpen, FileSearch, CheckCircle, AlertTriangle, HelpCircle, Layers, ExternalLink } from 'lucide-react';

interface BlueprintSectionProps {
  fields: BlueprintField[];
  onSelectFieldForLearn: (field: BlueprintField) => void;
  onSelectFieldForEvidence: (field: BlueprintField) => void;
}

export const BlueprintSection: React.FC<BlueprintSectionProps> = ({
  fields,
  onSelectFieldForLearn,
  onSelectFieldForEvidence
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Parameters' },
    { id: 'dataset', label: 'Dataset & Preprocessing' },
    { id: 'model_architecture', label: 'Architecture' },
    { id: 'optimizer', label: 'Optimizer & Schedule' },
    { id: 'training_setup', label: 'Training Setup' },
    { id: 'loss', label: 'Loss Function' },
    { id: 'evaluation', label: 'Evaluation & Benchmarks' },
    { id: 'environment', label: 'Environment' }
  ];

  const filteredFields = useMemo(() => {
    return (fields || []).filter((f) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        f.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (selectedCategory === 'optimizer' && f.category.includes('schedule')) ||
        (selectedCategory === 'dataset' && f.category.includes('preprocessing'));

      const matchesSearch =
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.value && f.value.toLowerCase().includes(searchQuery.toLowerCase())) ||
        f.status.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [fields, selectedCategory, searchQuery]);

  const getStatusBadge = (status: string) => {
    const formatted = status.replace('_', ' ');
    return <span className={`status-badge status-${status}`}>{formatted}</span>;
  };

  return (
    <section aria-labelledby="blueprint-heading" style={{ marginBottom: '32px' }}>
      {/* Section Header & Filters */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <div>
          <h2 id="blueprint-heading" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Step 2: Structured Experiment Blueprint
          </h2>
          <p style={{ fontSize: '0.76rem', color: '#71717a' }}>
            Evidence-backed parameters verified against raw PDF source text. Click <strong>Proof</strong> for verbatim quotes or <strong>Learn</strong> for derivations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label htmlFor="param-filter-input" className="sr-only">
            Filter parameters
          </label>
          <input
            id="param-filter-input"
            type="text"
            placeholder="Search parameters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: '#0a0a0a',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '6px',
              padding: '6px 12px',
              color: '#ffffff',
              fontSize: '0.78rem',
              outline: 'none',
              width: '190px',
              transition: 'all 0.15s ease'
            }}
          />
        </div>
      </div>

      {/* Category Pills */}
      <div role="group" aria-label="Filter parameters by category" style={{
        display: 'flex',
        gap: '5px',
        overflowX: 'auto',
        paddingBottom: '8px',
        marginBottom: '14px'
      }}>
        {categories.map((c) => {
          const isSelected = selectedCategory === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              style={{
                background: isSelected ? '#ffffff' : '#0d0d0d',
                color: isSelected ? '#000000' : '#a1a1aa',
                border: isSelected ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.1)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.74rem',
                fontWeight: isSelected ? 600 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? '0 1px 6px rgba(255,255,255,0.2)' : 'none'
              }}
              aria-pressed={isSelected}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Blueprint Spec Sheet Table */}
      <div className="glass-panel" style={{ overflow: 'hidden', background: '#0a0a0a' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
          <caption className="sr-only">
            Extracted Research Paper Blueprint Parameters with Status and Provenance
          </caption>
          <thead>
            <tr style={{
              background: '#070707',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#71717a',
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <th scope="col" style={{ padding: '12px 16px', width: '22%' }}>Parameter</th>
              <th scope="col" style={{ padding: '12px 16px', width: '28%' }}>Extracted Value</th>
              <th scope="col" style={{ padding: '12px 16px', width: '15%' }}>Status</th>
              <th scope="col" style={{ padding: '12px 16px', width: '23%' }}>Source Provenance</th>
              <th scope="col" style={{ padding: '12px 16px', width: '12%', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFields.map((field, idx) => {
              const hasEvidence = field.evidence && field.evidence.length > 0;
              const firstEvidence = hasEvidence ? field.evidence[0] : null;

              return (
                <tr
                  key={field.id}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {/* Parameter Name & Category */}
                  <td style={{ padding: '12px 16px', verticalAlign: 'top' }}>
                    <div style={{ fontWeight: 600, color: '#ffffff', marginBottom: '2px', letterSpacing: '-0.01em' }}>
                      <span style={{ color: '#71717a', marginRight: '6px', fontSize: '0.74rem' }}>{idx + 1}.</span>
                      {field.name}
                    </div>
                    <span style={{
                      fontSize: '0.68rem',
                      color: '#71717a',
                      textTransform: 'uppercase',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {field.category.replace('_', ' ')}
                    </span>
                  </td>

                  {/* Value */}
                  <td style={{ padding: '12px 16px', verticalAlign: 'top' }}>
                    {field.value !== null ? (
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        color: '#ffffff',
                        background: '#141414',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        display: 'inline-block',
                        maxWidth: '100%',
                        wordBreak: 'break-word',
                        lineHeight: 1.4,
                        fontSize: '0.78rem'
                      }}>
                        {field.value}
                      </span>
                    ) : (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{
                          color: '#71717a',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem',
                          background: '#0d0d0d',
                          border: '1px dashed #27272a',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 500
                        }}>
                          UNKNOWN / NOT REPORTED
                        </span>
                      </div>
                    )}

                    {field.notes && field.notes.length > 0 && (
                      <div style={{ fontSize: '0.72rem', color: '#71717a', marginTop: '4px' }}>
                        {field.notes[0]}
                      </div>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td style={{ padding: '12px 16px', verticalAlign: 'top' }}>
                    {getStatusBadge(field.status)}
                  </td>

                  {/* Evidence / Citation */}
                  <td style={{ padding: '12px 16px', verticalAlign: 'top' }}>
                    {firstEvidence ? (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#a1a1aa' }}>
                          <span style={{
                            fontSize: '0.68rem',
                            background: '#141414',
                            border: '1px solid rgba(255,255,255,0.1)',
                            padding: '1px 5px',
                            borderRadius: '3px',
                            fontFamily: 'var(--font-mono)',
                            color: '#ffffff'
                          }}>
                            p.{firstEvidence.page_index}
                          </span>
                          <span style={{ fontWeight: 500 }}>{firstEvidence.section || 'Main Text'}</span>
                        </div>
                        <p style={{
                          fontSize: '0.73rem',
                          color: '#71717a',
                          fontStyle: 'italic',
                          marginTop: '3px',
                          lineHeight: 1.35,
                          maxWidth: '280px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          "{firstEvidence.quote}"
                        </p>
                      </div>
                    ) : (
                      <span style={{ color: '#52525b', fontSize: '0.73rem', fontStyle: 'italic' }}>
                        No direct quote citation
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '12px 16px', verticalAlign: 'top', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => onSelectFieldForLearn(field)}
                        className="btn-ghost"
                        style={{
                          fontSize: '0.73rem',
                          padding: '4px 8px',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '4px'
                        }}
                        aria-label={`Open interactive 3-tier explanation for ${field.name}`}
                        title="Open interactive 3-tier explanation"
                      >
                        <BookOpen size={13} aria-hidden="true" />
                        <span>Learn</span>
                      </button>

                      {hasEvidence && (
                        <button
                          type="button"
                          onClick={() => onSelectFieldForEvidence(field)}
                          className="btn-ghost"
                          style={{
                            fontSize: '0.73rem',
                            padding: '4px 8px',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '4px'
                          }}
                          aria-label={`Inspect verified quote in source PDF for ${field.name}`}
                          title="View verified verbatim quote in document context"
                        >
                          <FileSearch size={13} aria-hidden="true" />
                          <span>Proof</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
