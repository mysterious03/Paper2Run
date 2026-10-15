import React from 'react';
import { PaperMetadata } from '../types';
import { FileText, CheckCircle2, AlertOctagon, HelpCircle, ShieldAlert, Sparkles } from 'lucide-react';

interface PaperHeaderProps {
  metadata: PaperMetadata;
}

export const PaperHeader: React.FC<PaperHeaderProps> = ({ metadata }) => {
  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.7)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '20px 28px',
      position: 'relative'
    }}>
      {/* Sample demo notification banner */}
      {metadata.is_sample_demo && (
        <div style={{
          background: 'rgba(56, 189, 248, 0.1)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          padding: '6px 14px',
          borderRadius: '8px',
          marginBottom: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.8rem',
          color: '#38bdf8'
        }}>
          <Sparkles size={16} />
          <span>
            <strong>Demo Mode:</strong> Precomputed verified sample paper (Vaswani et al., 2017). Upload your own AI/ML PDF anytime.
          </span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#a5b4fc',
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)'
            }}>
              {metadata.filename}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              • {metadata.page_count} pages extracted
            </span>
            <span style={{
              fontSize: '0.72rem',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              padding: '2px 8px',
              borderRadius: '4px',
              fontWeight: 600
            }}>
              PARSED VIA PYMUPDF
            </span>
          </div>

          <h1 style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#fff',
            lineHeight: 1.3,
            maxWidth: '900px'
          }}>
            {metadata.title}
          </h1>
        </div>

        {/* Reproduction Readiness Metric Cards */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="glass-card" style={{ padding: '10px 16px', textAlign: 'center', minWidth: '110px' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Reported
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <CheckCircle2 size={16} />
              <span>{metadata.reported_fields}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>/{metadata.total_fields}</span>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '10px 16px', textAlign: 'center', minWidth: '110px' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Open Gaps
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fb7185', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <AlertOctagon size={16} />
              <span>{metadata.unresolved_gaps}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Honest Boundary Notice */}
      <div style={{
        marginTop: '14px',
        padding: '8px 12px',
        borderRadius: '6px',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px dashed var(--border-subtle)',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <ShieldAlert size={14} color="#94a3b8" />
        <span>
          <strong>Research Integrity Notice:</strong> Paper2Run highlights reported evidence and explicit uncertainties. Having all fields identified does not guarantee exact reproduction due to environment and hardware variance.
        </span>
      </div>
    </div>
  );
};
