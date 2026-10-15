import React from 'react';
import { FileText, Download, Sparkles, UploadCloud, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { AnalysisResult } from '../types';
import { getExportUrl } from '../lib/api';

interface NavbarProps {
  currentPaper: AnalysisResult | null;
  onOpenUpload: () => void;
  onLoadSample: () => void;
  llmProvider: string;
  isLLMConfigured: boolean;
  activeTab: 'blueprint' | 'learn' | 'connections' | 'verify';
  setActiveTab: (tab: 'blueprint' | 'learn' | 'connections' | 'verify') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPaper,
  onOpenUpload,
  onLoadSample,
  llmProvider,
  isLLMConfigured,
  activeTab,
  setActiveTab
}) => {
  const paperId = currentPaper?.paper_id;

  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0 24px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Brand & Tagline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            width: '34px',
            height: '34px',
            borderRadius: '9px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)'
          }}>
            <FileText size={19} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
                Paper<span style={{ color: '#38bdf8' }}>2</span>Run
              </span>
              <span style={{
                fontSize: '0.65rem',
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#818cf8',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: 600,
                border: '1px solid rgba(99, 102, 241, 0.3)'
              }}>
                v1.0
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1 }}>
              Understand the paper. Connect the evidence. Reproduce the experiment.
            </p>
          </div>
        </div>

        {/* Workspace Mode Tabs */}
        <nav style={{
          display: 'flex',
          gap: '4px',
          background: 'rgba(15, 23, 42, 0.8)',
          padding: '4px',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)',
          marginLeft: '20px'
        }}>
          {[
            { id: 'blueprint', label: 'Blueprint', icon: '📋' },
            { id: 'learn', label: 'Learn', icon: '💡' },
            { id: 'connections', label: 'Connections', icon: '🕸️' },
            { id: 'verify', label: 'Verify & Gaps', icon: '🛡️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: activeTab === tab.id ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
                border: activeTab === tab.id ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: activeTab === tab.id ? 600 : 500,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Action Controls & Export */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* LLM Status Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '6px',
          background: isLLMConfigured ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
          border: isLLMConfigured ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(245, 158, 11, 0.25)',
          fontSize: '0.74rem',
          color: isLLMConfigured ? '#34d399' : '#fbbf24'
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: isLLMConfigured ? '#10b981' : '#f59e0b'
          }} />
          <span>{llmProvider}</span>
        </div>

        {/* Sample Paper Loader */}
        <button
          onClick={onLoadSample}
          className="btn-secondary"
          title="Load precomputed Vaswani et al. Attention Is All You Need sample"
        >
          <Sparkles size={14} color="#38bdf8" />
          <span>Sample Demo</span>
        </button>

        {/* Upload Paper */}
        <button
          onClick={onOpenUpload}
          className="btn-primary"
        >
          <UploadCloud size={15} />
          <span>Upload PDF</span>
        </button>

        {/* Export Dropdown */}
        {paperId && (
          <div style={{ display: 'flex', gap: '6px' }}>
            <a
              href={getExportUrl(paperId, 'markdown')}
              download
              className="btn-secondary"
              style={{ textDecoration: 'none' }}
              title="Download evidence-backed Markdown reproduction report"
            >
              <Download size={14} />
              <span>Report (.md)</span>
            </a>
            <a
              href={getExportUrl(paperId, 'json')}
              download
              className="btn-secondary"
              style={{ textDecoration: 'none' }}
              title="Download structured JSON blueprint (retains nulls for gaps)"
            >
              <span>JSON</span>
            </a>
            <a
              href={getExportUrl(paperId, 'checklist')}
              download
              className="btn-secondary"
              style={{ textDecoration: 'none' }}
              title="Download actionable reproduction checklist"
            >
              <span>Checklist</span>
            </a>
          </div>
        )}
      </div>
    </header>
  );
};
