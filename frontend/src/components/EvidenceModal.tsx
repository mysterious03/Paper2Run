import React, { useState } from 'react';
import { BlueprintField } from '../types';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Quote, Copy, Check } from 'lucide-react';

interface EvidenceModalProps {
  field: BlueprintField | null;
  onClose: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({ field, onClose }) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (!field) return null;

  const handleCopyCitation = (quote: string, page: number, section: string, idx: number) => {
    const citation = `> "${quote}"\n> — Section: ${section}, Page ${page}`;
    navigator.clipboard.writeText(citation).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        background: '#0a0a0a',
        width: '100%',
        maxWidth: '680px',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 20px rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '85vh',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <span className={`status-badge status-${field.status}`}>
                {field.status.replace('_', ' ')}
              </span>
              <span style={{ fontSize: '0.68rem', color: '#71717a', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                {field.category.replace('_', ' ')}
              </span>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              Evidence Provenance: {field.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost"
            style={{ borderRadius: '50%', padding: '6px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Extracted Value */}
          <div style={{
            background: '#050505',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            padding: '12px 14px'
          }}>
            <div style={{ fontSize: '0.68rem', color: '#71717a', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 600 }}>
              Extracted Setting Value
            </div>
            <div style={{ fontSize: '0.9rem', fontFamily: 'var(--font-mono)', color: '#ffffff', fontWeight: 600 }}>
              {field.value || 'UNKNOWN / NOT REPORTED'}
            </div>
          </div>

          {/* Citations List */}
          <div>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#71717a', textTransform: 'uppercase', marginBottom: '10px' }}>
              Document Citations & Verification Details ({field.evidence.length})
            </div>

            {field.evidence.length === 0 ? (
              <p style={{ color: '#71717a', fontStyle: 'italic', fontSize: '0.82rem' }}>
                No direct citations found in examined content for this field.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {field.evidence.map((ev, i) => (
                  <div
                    key={ev.evidence_id || i}
                    style={{
                      background: '#0d0d0d',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    {/* Top Row: Page, Section & Quote Verification Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontSize: '0.68rem',
                          background: '#141414',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          color: '#ffffff',
                          padding: '2px 6px',
                          borderRadius: '3px',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 600
                        }}>
                          PAGE {ev.page_index}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: '#a1a1aa', fontWeight: 500 }}>
                          {ev.section}
                        </span>
                      </div>

                      {/* Deterministic quote match badge */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '0.68rem',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: ev.quote_match ? 'rgba(255, 255, 255, 0.08)' : '#18181b',
                        color: ev.quote_match ? '#ffffff' : '#a1a1aa',
                        border: ev.quote_match ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid #3f3f46'
                      }}>
                        {ev.quote_match ? <CheckCircle2 size={12} color="#ffffff" /> : <AlertTriangle size={12} color="#a1a1aa" />}
                        <span>{ev.quote_match ? 'Quote Verified in Source' : 'Quote Mismatch'}</span>
                      </div>
                    </div>

                    {/* Verbatim Quote Excerpt */}
                    <blockquote style={{
                      margin: 0,
                      padding: '10px 12px',
                      background: '#050505',
                      borderLeft: '2px solid #ffffff',
                      borderRadius: '0 4px 4px 0',
                      fontSize: '0.8rem',
                      fontStyle: 'italic',
                      color: '#ffffff',
                      lineHeight: 1.55
                    }}>
                      "{ev.quote}"
                    </blockquote>

                    {/* Actions: Copy Citation */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
                      <button
                        onClick={() => handleCopyCitation(ev.quote, ev.page_index, ev.section || 'Main Text', i)}
                        className="btn-ghost"
                        style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                      >
                        {copiedIdx === i ? (
                          <>
                            <Check size={12} color="#ffffff" />
                            <span>Copied to Clipboard</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy Citation</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: '#070707',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.7rem', color: '#71717a' }}>
            Bound to exact page indices in parsed PDF stream
          </span>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '6px 14px' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
