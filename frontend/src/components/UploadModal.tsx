import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, AlertCircle, X, CheckCircle2, ArrowRight, Key } from 'lucide-react';
import { uploadPdfPaper } from '../lib/api';
import { AnalysisResult } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings?: () => void;
  onUploadSuccess: (result: AnalysisResult) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
  onUploadSuccess
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (f: File) => {
    setError(null);
    if (!f.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are supported.');
      return;
    }
    if (f.size > 25 * 1024 * 1024) {
      setError('File size exceeds the 25MB limit.');
      return;
    }
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const result = await uploadPdfPaper(file);
      onUploadSuccess(result);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to process and analyze paper.');
    } finally {
      setLoading(false);
    }
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
        maxWidth: '560px',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 20px rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              Upload Research Paper
            </h3>
            <p style={{ fontSize: '0.72rem', color: '#71717a' }}>
              Text-based AI/ML PDF format (arXiv, NeurIPS, ICML, ICLR, CVPR)
            </p>
          </div>
          <button onClick={onClose} className="btn-ghost" disabled={loading} style={{ borderRadius: '50%', padding: '6px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Drop Zone */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            style={{
              border: dragOver ? '2px dashed #ffffff' : '2px dashed rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              padding: '36px 20px',
              textAlign: 'center',
              background: dragOver ? 'rgba(255, 255, 255, 0.05)' : '#050505',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              background: '#141414',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px'
            }}>
              <UploadCloud size={22} color="#ffffff" />
            </div>

            {file ? (
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>
                  {file.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#71717a', marginTop: '4px' }}>
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to analyze
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>
                  Drag & drop your PDF here, or <span style={{ textDecoration: 'underline' }}>browse</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#71717a', marginTop: '6px' }}>
                  Extracts page-indexed text, architecture parameters, and verified quotes.
                </div>
              </div>
            )}
          </div>

          {error && (
            <div style={{
              background: '#141414',
              border: '1px solid #3f3f46',
              borderRadius: '6px',
              padding: '12px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              color: '#e4e4e7',
              fontSize: '0.78rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <AlertCircle size={16} color="#ffffff" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ lineHeight: 1.5 }}>{error}</span>
              </div>
              {onOpenSettings && error.includes('API Key') && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={onOpenSettings}
                    className="btn-primary"
                    style={{ padding: '6px 12px', fontSize: '0.74rem' }}
                  >
                    <Key size={12} />
                    <span>Open API Key Settings</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Processing Indicator */}
          {loading && (
            <div style={{
              background: '#0d0d0d',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '6px',
              padding: '14px 18px',
              fontSize: '0.8rem',
              color: '#ffffff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255, 255, 255, 0.2)', borderTopColor: '#ffffff', borderRadius: '50%', animation: 'spinSlow 0.9s linear infinite' }} />
                <strong>Running Live Extraction Workflow...</strong>
              </div>
              <ul style={{ paddingLeft: '24px', lineHeight: 1.5, fontSize: '0.74rem', color: '#a1a1aa' }}>
                <li>Parsing page-indexed text blocks via PyMuPDF...</li>
                <li>Extracting experiment parameters and source quotes...</li>
                <li>Running deterministic quote verification...</li>
                <li>Constructing Research Topology Graph...</li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: '#070707',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button onClick={onClose} className="btn-ghost" disabled={loading}>
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="btn-primary"
            disabled={!file || loading}
            style={{ opacity: (!file || loading) ? 0.6 : 1 }}
          >
            <span>{loading ? 'Analyzing Paper...' : 'Extract & Analyze'}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
