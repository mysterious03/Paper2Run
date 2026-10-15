import React from 'react';
import { FileText, Download, UploadCloud, RefreshCw, Key, ExternalLink } from 'lucide-react';
import { AnalysisResult } from '../types';
import { getExportUrl } from '../lib/api';

interface NavbarProps {
  currentPaper: AnalysisResult | null;
  onOpenUpload: () => void;
  onOpenSettings: () => void;
  onLoadSample: (paperType?: 'transformer' | 'lora') => void;
  llmProvider: string;
  isLLMConfigured: boolean;
  activeTab: 'blueprint' | 'learn' | 'connections' | 'verify';
  setActiveTab: (tab: 'blueprint' | 'learn' | 'connections' | 'verify') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPaper,
  onOpenUpload,
  onOpenSettings,
  onLoadSample,
  llmProvider,
  isLLMConfigured,
  activeTab,
  setActiveTab
}) => {
  const paperId = currentPaper?.paper_id;

  return (
    <header style={{
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      background: 'rgba(0, 0, 0, 0.92)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0 24px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Brand & Tagline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: '#ffffff',
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(255, 255, 255, 0.2)',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}>
            <FileText size={18} color="#000000" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff' }}>
                Paper2Run
              </span>
              <span style={{
                fontSize: '0.62rem',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#a1a1aa',
                padding: '1px 5px',
                borderRadius: '3px',
                fontWeight: 600,
                border: '1px solid rgba(255, 255, 255, 0.12)',
                letterSpacing: '0.04em'
              }}>
                RESEARCH
              </span>
            </div>
            <p style={{ fontSize: '0.68rem', color: '#71717a', lineHeight: 1 }}>
              Understand the paper • Connect evidence • Reproduce experiment
            </p>
          </div>
        </div>

        {/* Workspace Mode Tabs - Minimal Segmented Control */}
        <nav style={{
          display: 'flex',
          gap: '2px',
          background: '#0d0d0d',
          padding: '3px',
          borderRadius: '6px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginLeft: '12px'
        }}>
          {[
            { id: 'blueprint', label: 'Blueprint' },
            { id: 'learn', label: 'Learn' },
            { id: 'connections', label: 'Topology' },
            { id: 'verify', label: 'Gaps & Verification' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  background: isActive ? '#ffffff' : 'transparent',
                  color: isActive ? '#000000' : '#a1a1aa',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '5px 12px',
                  fontSize: '0.78rem',
                  fontWeight: isActive ? 600 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  cursor: 'pointer',
                  transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.4)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#a1a1aa';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Action Controls & Export */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* LLM Status Badge & Settings Trigger */}
        <div
          onClick={onOpenSettings}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: '6px',
            background: isLLMConfigured ? 'rgba(255, 255, 255, 0.06)' : '#0d0d0d',
            border: isLLMConfigured ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #27272a',
            fontSize: '0.72rem',
            color: isLLMConfigured ? '#ffffff' : '#71717a',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.09)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = isLLMConfigured ? 'rgba(255, 255, 255, 0.2)' : '#27272a';
            e.currentTarget.style.background = isLLMConfigured ? 'rgba(255, 255, 255, 0.06)' : '#0d0d0d';
          }}
          title="Click to configure AI Engine / API Keys"
        >
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: isLLMConfigured ? '#ffffff' : '#52525b',
            boxShadow: isLLMConfigured ? '0 0 6px rgba(255, 255, 255, 0.6)' : 'none'
          }} />
          <span style={{ fontWeight: 500 }}>{llmProvider}</span>
        </div>

        {/* API Key Modal Button */}
        <button
          onClick={onOpenSettings}
          className="btn-secondary"
          title="Configure Google Gemini, OpenAI, or Anthropic API Keys"
        >
          <Key size={13} color="#ffffff" />
          <span>API Keys</span>
        </button>

        {/* Benchmark Selector */}
        <select
          onChange={(e) => onLoadSample(e.target.value as any)}
          style={{
            background: '#0d0d0d',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '6px',
            padding: '6px 10px',
            fontSize: '0.76rem',
            fontWeight: 500,
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.15s ease'
          }}
          defaultValue="transformer"
        >
          <option value="transformer">Vaswani et al. (Transformer, 2017)</option>
          <option value="lora">Hu et al. (LoRA PEFT, 2021)</option>
        </select>

        {/* Upload Paper */}
        <button
          onClick={onOpenUpload}
          className="btn-primary"
        >
          <UploadCloud size={14} color="#000000" />
          <span>Upload PDF</span>
        </button>

        {/* Export Buttons */}
        {paperId && (
          <div style={{ display: 'flex', gap: '5px' }}>
            <a
              href={getExportUrl(paperId, 'markdown')}
              download
              className="btn-secondary"
              style={{ textDecoration: 'none' }}
              title="Download evidence-backed Markdown reproduction report"
            >
              <Download size={13} />
              <span>Report</span>
            </a>
            <a
              href={getExportUrl(paperId, 'json')}
              download
              className="btn-secondary"
              style={{ textDecoration: 'none' }}
              title="Download structured JSON blueprint"
            >
              <span>JSON</span>
            </a>
            <a
              href={getExportUrl(paperId, 'yaml')}
              download
              className="btn-secondary"
              style={{ textDecoration: 'none' }}
              title="Download structured YAML blueprint"
            >
              <span>YAML</span>
            </a>
            <a
              href={getExportUrl(paperId, 'checklist')}
              download
              className="btn-secondary"
              style={{ textDecoration: 'none' }}
              title="Download reproduction checklist"
            >
              <span>Checklist</span>
            </a>
          </div>
        )}
      </div>
    </header>
  );
};
