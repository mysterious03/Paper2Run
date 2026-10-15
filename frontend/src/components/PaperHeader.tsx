import React from 'react';
import { PaperMetadata } from '../types';
import { FileText, CheckCircle2, AlertOctagon, ShieldAlert, Sparkles, UploadCloud } from 'lucide-react';

interface PaperHeaderProps {
  metadata: PaperMetadata;
  onSelectSample?: (paperType: 'transformer' | 'lora') => void;
  onOpenUpload?: () => void;
}

export const PaperHeader: React.FC<PaperHeaderProps> = ({ metadata, onSelectSample, onOpenUpload }) => {
  const isTransformer = metadata.paper_id.includes('transformer');
  const isLora = metadata.paper_id.includes('lora');

  return (
    <section aria-labelledby="active-paper-title" style={{
      background: '#070707',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '18px 28px',
      position: 'relative'
    }}>
      {/* Step 1: Active Paper & Benchmark Switcher Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '14px',
        paddingBottom: '12px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '0.68rem',
            background: '#ffffff',
            color: '#000000',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '4px',
            letterSpacing: '0.04em'
          }}>
            STEP 1: SELECT PAPER
          </span>
          <span style={{ fontSize: '0.75rem', color: '#71717a' }}>
            Choose a benchmark or upload your own research paper:
          </span>
        </div>

        {/* Friendly One-Click Paper Switcher */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          {onSelectSample && (
            <>
              <button
                type="button"
                onClick={() => onSelectSample('transformer')}
                style={{
                  background: isTransformer ? '#ffffff' : '#0d0d0d',
                  color: isTransformer ? '#000000' : '#a1a1aa',
                  border: isTransformer ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: isTransformer ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
                aria-pressed={isTransformer}
              >
                <span>⭐ Benchmark 1: Transformer (2017)</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectSample('lora')}
                style={{
                  background: isLora ? '#ffffff' : '#0d0d0d',
                  color: isLora ? '#000000' : '#a1a1aa',
                  border: isLora ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: isLora ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
                aria-pressed={isLora}
              >
                <span>⚡ Benchmark 2: LoRA (2021)</span>
              </button>
            </>
          )}

          {onOpenUpload && (
            <button
              type="button"
              onClick={onOpenUpload}
              className="btn-secondary"
              style={{ fontSize: '0.74rem', padding: '5px 12px' }}
              aria-label="Upload custom PDF paper"
            >
              <UploadCloud size={13} aria-hidden="true" />
              <span>+ Upload PDF</span>
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              background: 'rgba(255, 255, 255, 0.06)',
              color: '#ffffff',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.72rem',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              border: '1px solid rgba(255, 255, 255, 0.12)'
            }}>
              {metadata.filename}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#71717a' }}>
              • {metadata.page_count} pages extracted
            </span>
            <span style={{
              fontSize: '0.68rem',
              background: '#121212',
              color: '#a1a1aa',
              padding: '2px 6px',
              borderRadius: '3px',
              fontWeight: 600,
              border: '1px solid #27272a',
              letterSpacing: '0.04em'
            }}>
              PARSED VIA PYMUPDF
            </span>
          </div>

          <h1 id="active-paper-title" style={{
            fontSize: '1.38rem',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: '#ffffff',
            lineHeight: 1.3,
            maxWidth: '920px'
          }}>
            {metadata.title}
          </h1>
        </div>

        {/* Reproduction Readiness Metric Cards */}
        <div style={{ display: 'flex', gap: '10px' }} role="region" aria-label="Reproduction Readiness Scorecard">
          <div className="glass-card" style={{ padding: '8px 14px', textAlign: 'center', minWidth: '115px' }}>
            <div style={{ fontSize: '0.68rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>
              Verified Fields
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <CheckCircle2 size={15} color="#ffffff" aria-hidden="true" />
              <span>{metadata.reported_fields}</span>
              <span style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 500 }}>/{metadata.total_fields}</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: '#a1a1aa', marginTop: '2px' }}>
              {Math.round((metadata.reported_fields / Math.max(metadata.total_fields, 1)) * 100)}% Evidence Grounded
            </div>
          </div>

          <div className="glass-card" style={{ padding: '8px 14px', textAlign: 'center', minWidth: '115px' }}>
            <div style={{ fontSize: '0.68rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>
              Unresolved Gaps
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#e4e4e7', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <AlertOctagon size={15} color="#a1a1aa" aria-hidden="true" />
              <span>{metadata.unresolved_gaps}</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: '#a1a1aa', marginTop: '2px' }}>
              Requires Suggestions
            </div>
          </div>
        </div>
      </div>

      {/* Honest Boundary Notice */}
      <div style={{
        marginTop: '12px',
        padding: '7px 12px',
        borderRadius: '5px',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px dashed rgba(255, 255, 255, 0.12)',
        fontSize: '0.72rem',
        color: '#71717a',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }} role="note">
        <ShieldAlert size={13} color="#a1a1aa" aria-hidden="true" />
        <span>
          <strong style={{ color: '#d4d4d8' }}>Research Integrity Boundary:</strong> All extracted parameters are backed by raw PDF substring search. Having all parameters verified does not guarantee bit-exact reproduction due to random seeds and GPU float accumulation differences.
        </span>
      </div>
    </section>
  );
};
