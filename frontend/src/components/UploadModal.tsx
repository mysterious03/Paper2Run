import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, AlertCircle, X, CheckCircle2, ArrowRight } from 'lucide-react';
import { uploadPdfPaper } from '../lib/api';
import { AnalysisResult } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (result: AnalysisResult) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
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
        maxWidth: '560px',
        borderRadius: '12px',
        border: '1px solid var(--border-accent)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
              Upload Research Paper
            </h3>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Text-based AI/ML PDF format (arXiv, NeurIPS, ICML, ICLR, CVPR)
            </p>
          </div>
          <button onClick={onClose} className="btn-ghost" disabled={loading} style={{ borderRadius: '50%', padding: '6px' }}>
            <X size={18} />
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
              border: dragOver ? '2px dashed #6366f1' : '2px dashed var(--border-subtle)',
              borderRadius: '10px',
              padding: '36px 20px',
              textAlign: 'center',
              background: dragOver ? 'rgba(99, 102, 241, 0.08)' : 'rgba(15, 23, 42, 0.5)',
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
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#818cf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px'
            }}>
              <UploadCloud size={26} />
            </div>

            {file ? (
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8' }}>
                  {file.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to analyze
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>
                  Drag & drop your PDF here, or <span style={{ color: '#38bdf8' }}>browse</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                  PyMuPDF will parse page-level text, equations, and section headings.
                </div>
              </div>
            )}
          </div>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#f87171',
              fontSize: '0.8rem'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Processing Indicator */}
          {loading && (
            <div style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: '8px',
              padding: '14px 18px',
              fontSize: '0.82rem',
              color: '#c7d2fe'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '16px', height: '16px', border: '2px solid rgba(99, 102, 241, 0.3)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <strong>Processing Paper Workflow...</strong>
              </div>
              <ul style={{ paddingLeft: '24px', lineHeight: 1.5, fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                <li>Parsing page-indexed text blocks via PyMuPDF...</li>
                <li>Extracting experiment parameters and source quotes...</li>
                <li>Running deterministic quote verification...</li>
                <li>Constructing Research Connection Graph...</li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid var(--border-subtle)',
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
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
