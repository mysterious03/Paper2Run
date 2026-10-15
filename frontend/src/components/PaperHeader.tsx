import React from 'react';
import { PaperMetadata } from '../types';
import { FileText, CheckCircle2, AlertOctagon, ShieldAlert, Sparkles } from 'lucide-react';

interface PaperHeaderProps {
  metadata: PaperMetadata;
}

export const PaperHeader: React.FC<PaperHeaderProps> = ({ metadata }) => {
  return (
    <div style={{
      background: '#070707',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '18px 28px',
      position: 'relative'
    }}>
      {/* Sample demo notification banner */}
      {metadata.is_sample_demo && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '6px 12px',
          borderRadius: '6px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.78rem',
          color: '#e4e4e7'
        }}>
          <Sparkles size={14} color="#ffffff" />
          <span>
            <strong style={{ color: '#ffffff' }}>Benchmark Mode:</strong> Verified ground-truth benchmark paper ({metadata.title}). Upload your own PDF anytime for live extraction.
          </span>
        </div>
      )}

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

          <h1 style={{
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
        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="glass-card" style={{ padding: '8px 14px', textAlign: 'center', minWidth: '105px' }}>
            <div style={{ fontSize: '0.68rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>
              Reported
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <CheckCircle2 size={15} color="#ffffff" />
              <span>{metadata.reported_fields}</span>
              <span style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 500 }}>/{metadata.total_fields}</span>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '8px 14px', textAlign: 'center', minWidth: '105px' }}>
            <div style={{ fontSize: '0.68rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>
              Open Gaps
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#e4e4e7', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <AlertOctagon size={15} color="#a1a1aa" />
              <span>{metadata.unresolved_gaps}</span>
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
      }}>
        <ShieldAlert size={13} color="#a1a1aa" />
        <span>
          <strong style={{ color: '#d4d4d8' }}>Research Integrity Notice:</strong> All findings are strictly bound to reported PDF citations. Having all parameters identified does not guarantee bit-exact reproduction due to hardware tensor float precision and random seed divergence.
        </span>
      </div>
    </div>
  );
};
