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
  activeTab: 'blueprint' | 'learn' | 'connections' | 'verify' | 'export';
  setActiveTab: (tab: 'blueprint' | 'learn' | 'connections' | 'verify' | 'export') => void;
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

  const tabs: Array<{ id: 'blueprint' | 'learn' | 'connections' | 'verify' | 'export'; label: string; badge?: string }> = [
    { id: 'blueprint', label: '1. Blueprint' },
    { id: 'learn', label: '2. Learn' },
    { id: 'connections', label: '3. Topology' },
    { id: 'verify', label: '4. Gaps & Fixes' },
    { id: 'export', label: '5. Export & Run' }
  ];

  return (
    <header role="banner" style={{
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
            boxShadow: '0 0 16px rgba(255, 255, 255, 0.2)'
          }}>
            <FileText size={18} color="#000000" aria-hidden="true" />
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
                RESEARCH REPRODUCTION
              </span>
            </div>
            <p style={{ fontSize: '0.68rem', color: '#71717a', lineHeight: 1 }}>
              Understand the paper • Connect evidence • Reproduce experiment
            </p>
          </div>
        </div>

        {/* Numbered Workspace Mode Tabs with ARIA attributes */}
        <nav role="tablist" aria-label="Workflow Navigation" style={{
          display: 'flex',
          gap: '2px',
          background: '#0d0d0d',
          padding: '3px',
          borderRadius: '6px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginLeft: '12px'
        }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
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
        <button
          type="button"
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
          aria-label={`AI Provider: ${llmProvider}. Click to configure API keys.`}
          title="Click to configure AI Engine / API Keys"
        >
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: isLLMConfigured ? '#ffffff' : '#52525b',
            boxShadow: isLLMConfigured ? '0 0 6px rgba(255, 255, 255, 0.6)' : 'none'
          }} aria-hidden="true" />
          <span style={{ fontWeight: 500 }}>{llmProvider}</span>
        </button>

        {/* API Key Modal Button */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="btn-secondary"
          aria-label="Configure API Keys"
          title="Configure Google Gemini, OpenAI, or Anthropic API Keys"
        >
          <Key size={13} color="#ffffff" aria-hidden="true" />
          <span>API Keys</span>
        </button>

        {/* Upload Paper */}
        <button
          type="button"
          onClick={onOpenUpload}
          className="btn-primary"
          aria-label="Upload PDF Research Paper"
        >
          <UploadCloud size={14} color="#000000" aria-hidden="true" />
          <span>Upload PDF</span>
        </button>
      </div>
    </header>
  );
};
