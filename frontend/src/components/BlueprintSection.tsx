import React, { useState } from 'react';
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
    { id: 'all', label: 'All Fields' },
    { id: 'dataset', label: 'Dataset & Preprocessing' },
    { id: 'model_architecture', label: 'Architecture' },
    { id: 'optimizer', label: 'Optimizer & Schedule' },
    { id: 'training_setup', label: 'Training Setup' },
    { id: 'loss', label: 'Loss Function' },
    { id: 'evaluation', label: 'Evaluation & Results' },
    { id: 'environment', label: 'Environment' }
  ];

  const filteredFields = fields.filter((f) => {
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

  const getStatusBadge = (status: string) => {
    const formatted = status.replace('_', ' ');
    return <span className={`status-badge status-${status}`}>{formatted}</span>;
  };

  return (
    <div style={{ marginBottom: '32px' }}>
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
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
            Experiment Blueprint
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Evidence-backed parameters verified against extracted PDF source text.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Filter parameters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '6px 12px',
              color: '#fff',
              fontSize: '0.82rem',
              outline: 'none',
              width: '180px'
            }}
          />
        </div>
      </div>

      {/* Category Pills */}
      <div style={{
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        paddingBottom: '8px',
        marginBottom: '14px'
      }}>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            style={{
              background: selectedCategory === c.id ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              color: selectedCategory === c.id ? '#818cf8' : 'var(--text-secondary)',
              border: selectedCategory === c.id ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border-subtle)',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.76rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Blueprint Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.83rem' }}>
          <thead>
            <tr style={{
              background: 'rgba(15, 23, 42, 0.95)',
              borderBottom: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              fontSize: '0.72rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <th style={{ padding: '12px 16px', width: '22%' }}>Field / Parameter</th>
              <th style={{ padding: '12px 16px', width: '28%' }}>Extracted Value</th>
              <th style={{ padding: '12px 16px', width: '15%' }}>Status</th>
              <th style={{ padding: '12px 16px', width: '23%' }}>Source Provenance</th>
              <th style={{ padding: '12px 16px', width: '12%', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFields.map((field) => {
              const hasEvidence = field.evidence && field.evidence.length > 0;
              const firstEvidence = hasEvidence ? field.evidence[0] : null;

              return (
                <tr
                  key={field.id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Field Name & Category */}
                  <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                    <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '2px' }}>
                      {field.name}
                    </div>
                    <span style={{
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {field.category.replace('_', ' ')}
                    </span>
                  </td>

                  {/* Value */}
                  <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                    {field.value !== null ? (
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        color: '#38bdf8',
                        background: 'rgba(56, 189, 248, 0.06)',
                        padding: '3px 6px',
                        borderRadius: '4px',
                        display: 'inline-block',
                        maxWidth: '100%',
                        wordBreak: 'break-word',
                        lineHeight: 1.4
                      }}>
                        {field.value}
                      </span>
                    ) : (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{
                          color: '#fb7185',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.75rem',
                          background: 'rgba(244, 63, 94, 0.1)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontWeight: 600
                        }}>
                          UNKNOWN / NOT REPORTED
                        </span>
                      </div>
                    )}

                    {field.notes && field.notes.length > 0 && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        ℹ️ {field.notes[0]}
                      </div>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                    {getStatusBadge(field.status)}
                  </td>

                  {/* Evidence Citation */}
                  <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                    {firstEvidence ? (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: firstEvidence.quote_match ? '#34d399' : '#fbbf24',
                            background: firstEvidence.quote_match ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                            padding: '1px 5px',
                            borderRadius: '3px'
                          }}>
                            Page {firstEvidence.page_index + 1}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {firstEvidence.section}
                          </span>
                        </div>
                        <p style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-secondary)',
                          fontStyle: 'italic',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.35
                        }}>
                          "{firstEvidence.quote}"
                        </p>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        No passage citation found
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '14px 16px', verticalAlign: 'top', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        onClick={() => onSelectFieldForLearn(field)}
                        className="btn-ghost"
                        style={{
                          background: 'rgba(99, 102, 241, 0.12)',
                          color: '#818cf8',
                          padding: '4px 8px',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}
                        title="Click to learn this concept (Beginner / Technical / Math)"
                      >
                        <BookOpen size={13} />
                        <span>Learn</span>
                      </button>

                      {hasEvidence && (
                        <button
                          onClick={() => onSelectFieldForEvidence(field)}
                          className="btn-ghost"
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            padding: '4px 8px',
                            fontSize: '0.75rem'
                          }}
                          title="Inspect exact quoted evidence in PDF text"
                        >
                          <FileSearch size={13} />
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
    </div>
  );
};
