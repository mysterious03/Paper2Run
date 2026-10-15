import React from 'react';
import { BlueprintField } from '../types';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Quote, FileText } from 'lucide-react';

interface EvidenceModalProps {
  field: BlueprintField | null;
  onClose: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({ field, onClose }) => {
  if (!field) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        background: '#0f172a',
        width: '100%',
        maxWidth: '680px',
        borderRadius: '12px',
        border: '1px solid var(--border-accent)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '85vh',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <span className={`status-badge status-${field.status}`}>
                {field.status.replace('_', ' ')}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Category: {field.category}
              </span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
              Evidence Provenance: {field.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost"
            style={{ borderRadius: '50%', padding: '6px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Extracted Value */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '12px 16px'
          }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Extracted Setting Value
            </div>
            <div style={{ fontSize: '0.95rem', fontFamily: 'var(--font-mono)', color: '#38bdf8', fontWeight: 600 }}>
              {field.value || 'UNKNOWN / NOT REPORTED'}
            </div>
          </div>

          {/* Citations List */}
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
              Document Citations & Verification Details ({field.evidence.length})
            </div>

            {field.evidence.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.85rem' }}>
                No direct citations found in examined content for this field.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {field.evidence.map((ev, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: ev.quote_match ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                      borderRadius: '8px',
                      padding: '14px 18px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>
                        Page {ev.page_index + 1} • {ev.section}
                      </span>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: ev.quote_match ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: ev.quote_match ? '#34d399' : '#fbbf24',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {ev.quote_match ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
                        {ev.quote_match ? 'VERIFIED QUOTE MATCH' : 'NEEDS REVIEW'}
                      </span>
                    </div>

                    <blockquote style={{
                      margin: '8px 0',
                      padding: '10px 14px',
                      borderLeft: '3px solid #6366f1',
                      background: 'rgba(99, 102, 241, 0.06)',
                      color: '#f1f5f9',
                      fontSize: '0.85rem',
                      fontStyle: 'italic',
                      lineHeight: 1.55,
                      borderRadius: '0 6px 6px 0'
                    }}>
                      "{ev.quote}"
                    </blockquote>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        <strong>Semantic Analysis:</strong> {ev.semantic_support.toUpperCase().replace('_', ' ')}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(`Page ${ev.page_index + 1} (${ev.section}): "${ev.quote}"`);
                        }}
                        className="btn-ghost"
                        style={{ fontSize: '0.7rem', padding: '2px 8px' }}
                        title="Copy quote citation to clipboard"
                      >
                        Copy Citation
                      </button>
                    </div>

                    {ev.notes && (
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '6px' }}>
                        ℹ️ {ev.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Validation Boundary Note */}
          <div style={{
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px dashed rgba(99, 102, 241, 0.3)',
            borderRadius: '8px',
            padding: '12px 16px',
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-start',
            fontSize: '0.75rem',
            color: '#c7d2fe'
          }}>
            <ShieldCheck size={16} color="#818cf8" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Verification Standard:</strong> A "Verified Quote Match" indicates that the verbatim string was located in the PyMuPDF-extracted text of the cited page. Semantic validation (whether the quotation actually answers the parameter) requires reviewer confirmation.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button onClick={onClose} className="btn-secondary">
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
