import React, { useState, useEffect } from 'react';
import { X, Key, CheckCircle2, AlertCircle, ExternalLink, ShieldCheck, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { getKeyStatus, saveApiKey, testApiConnection } from '../lib/api';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChanged: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onConfigChanged
}) => {
  const [provider, setProvider] = useState<'gemini' | 'openai' | 'anthropic'>('gemini');
  const [apiKey, setApiKey] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [keyStatus, setKeyStatus] = useState<any>(null);
  const [testing, setTesting] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadStatus();
    }
  }, [isOpen]);

  const loadStatus = () => {
    getKeyStatus()
      .then((data) => setKeyStatus(data))
      .catch((err) => console.error(err));
  };

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!apiKey.trim()) return;
    setSaving(true);
    setTestResult(null);

    try {
      const res = await saveApiKey(provider, apiKey);
      setTestResult({ success: res.success, message: res.message });
      setApiKey('');
      loadStatus();
      onConfigChanged();
    } catch (err: any) {
      setTestResult({ success: false, message: err.message || 'Failed to save key' });
    } finally {
      setSaving(false);
    }
  };

  const handleTestOnly = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const res = await testApiConnection();
      setTestResult({ success: res.success, message: res.message });
    } catch (err: any) {
      setTestResult({ success: false, message: err.message || 'Connection failed' });
    } finally {
      setTesting(false);
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
      zIndex: 110,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        background: '#0f172a',
        width: '100%',
        maxWidth: '620px',
        borderRadius: '12px',
        border: '1px solid var(--border-accent)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'rgba(99, 102, 241, 0.15)',
              padding: '8px',
              borderRadius: '8px',
              color: '#818cf8'
            }}>
              <Key size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                AI Engine & API Key Configuration
              </h3>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                Configure real-time research extraction and pedagogical explanations.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ borderRadius: '50%', padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Active Status Card */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '14px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Active LLM Provider
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: keyStatus?.active_provider && keyStatus?.active_provider !== 'Not Configured' ? '#10b981' : '#f59e0b'
                }} />
                <span>{keyStatus?.active_provider || 'Not Configured'}</span>
              </div>
            </div>

            <button
              onClick={handleTestOnly}
              className="btn-secondary"
              disabled={testing}
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
            >
              <RefreshCw size={13} className={testing ? 'animate-spin' : ''} />
              <span>{testing ? 'Testing...' : 'Test Connection'}</span>
            </button>
          </div>

          {/* Provider Selection */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              Select Provider to Configure:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {[
                { id: 'gemini', label: 'Google Gemini', sub: 'Free & Fast (Recommended)' },
                { id: 'openai', label: 'OpenAI', sub: 'GPT-4o-mini' },
                { id: 'anthropic', label: 'Anthropic', sub: 'Claude 3.5 Haiku' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProvider(p.id as any)}
                  style={{
                    background: provider === p.id ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    border: provider === p.id ? '1px solid #6366f1' : '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: provider === p.id ? '#fff' : '#cbd5e1' }}>
                    {p.label}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {p.sub}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Instructions Box */}
          <div style={{
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '0.78rem',
            color: '#e0f2fe'
          }}>
            {provider === 'gemini' ? (
              <div>
                <strong>How to get a Free Google Gemini API Key:</strong>
                <ol style={{ paddingLeft: '20px', marginTop: '6px', lineHeight: 1.5 }}>
                  <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', fontWeight: 600 }}>Google AI Studio (aistudio.google.com/app/apikey)</a>.</li>
                  <li>Sign in with your Google account and click <strong>Create API Key</strong>.</li>
                  <li>Copy and paste your key below. (Free tier includes generous request limits).</li>
                </ol>
              </div>
            ) : provider === 'openai' ? (
              <div>
                <strong>How to get an OpenAI API Key:</strong>
                <p style={{ marginTop: '4px' }}>
                  Generate an API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', fontWeight: 600 }}>platform.openai.com/api-keys</a>.
                </p>
              </div>
            ) : (
              <div>
                <strong>How to get an Anthropic API Key:</strong>
                <p style={{ marginTop: '4px' }}>
                  Generate an API key from <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', fontWeight: 600 }}>console.anthropic.com/settings/keys</a>.
                </p>
              </div>
            )}
          </div>

          {/* Key Input */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              {provider.toUpperCase()} API Key:
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showKey ? 'text' : 'password'}
                placeholder={`Paste your ${provider} API key here...`}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '10px 42px 10px 14px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Feedback Result */}
          {testResult && (
            <div style={{
              background: testResult.success ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              border: testResult.success ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.82rem',
              color: testResult.success ? '#34d399' : '#f87171'
            }}>
              {testResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Privacy Notice */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={14} color="#10b981" />
            <span>
              Your API key is used strictly for paper analysis and is never sent to third-party telemetry servers.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button onClick={onClose} className="btn-ghost">
            Close
          </button>
          <button
            onClick={handleSave}
            disabled={!apiKey.trim() || saving}
            className="btn-primary"
            style={{ opacity: (!apiKey.trim() || saving) ? 0.6 : 1 }}
          >
            <span>{saving ? 'Testing & Saving...' : 'Save & Activate Key'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
