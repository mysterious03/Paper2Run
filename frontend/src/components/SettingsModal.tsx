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
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 110,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        background: '#0a0a0a',
        width: '100%',
        maxWidth: '620px',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: '#ffffff',
              width: '30px',
              height: '30px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Key size={15} color="#000000" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                AI Engine & Provider Setup
              </h3>
              <p style={{ fontSize: '0.72rem', color: '#71717a' }}>
                Required for real-time live extraction on uploaded PDFs
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ borderRadius: '50%', padding: '6px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Current Status */}
          {keyStatus && (
            <div style={{
              background: '#050505',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              padding: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 600 }}>
                  Active Extraction Engine
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <span>{keyStatus.active_provider}</span>
                  {keyStatus.gemini_configured || keyStatus.openai_configured || keyStatus.anthropic_configured ? (
                    <span style={{ fontSize: '0.65rem', background: '#141414', border: '1px solid rgba(255,255,255,0.2)', color: '#ffffff', padding: '1px 6px', borderRadius: '3px' }}>
                      CONFIGURED
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.65rem', background: '#141414', border: '1px solid #3f3f46', color: '#a1a1aa', padding: '1px 6px', borderRadius: '3px' }}>
                      NOT CONFIGURED
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={handleTestOnly}
                disabled={testing}
                className="btn-secondary"
                style={{ fontSize: '0.76rem', padding: '6px 12px' }}
              >
                <RefreshCw size={12} className={testing ? 'spin-slow' : ''} />
                <span>{testing ? 'Testing...' : 'Ping Test'}</span>
              </button>
            </div>
          )}

          {/* Provider Selection */}
          <div>
            <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
              Select LLM Provider
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {[
                { id: 'gemini', name: 'Google Gemini', desc: '100% Free Tier', badge: 'Recommended' },
                { id: 'openai', name: 'OpenAI', desc: 'GPT-4o mini', badge: 'Paid' },
                { id: 'anthropic', name: 'Anthropic', desc: 'Claude 3 Haiku', badge: 'Paid' }
              ].map((p) => {
                const isSelected = provider === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setProvider(p.id as any)}
                    style={{
                      background: isSelected ? '#ffffff' : '#0d0d0d',
                      color: isSelected ? '#000000' : '#ffffff',
                      border: isSelected ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      padding: '10px 12px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 2px 10px rgba(255,255,255,0.2)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{p.name}</span>
                    </div>
                    <div style={{ fontSize: '0.68rem', color: isSelected ? '#52525b' : '#71717a' }}>
                      {p.desc} {p.badge ? `• ${p.badge}` : ''}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Provider Direct Help Link */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '6px',
            padding: '10px 14px',
            fontSize: '0.76rem',
            color: '#a1a1aa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {provider === 'gemini' ? (
              <span>Get a free Gemini API key with zero credit card from Google AI Studio.</span>
            ) : provider === 'openai' ? (
              <span>Get your secret key from your OpenAI Platform account dashboard.</span>
            ) : (
              <span>Get your secret key from the Anthropic Console dashboard.</span>
            )}
            <a
              href={
                provider === 'gemini'
                  ? 'https://aistudio.google.com/app/apikey'
                  : provider === 'openai'
                  ? 'https://platform.openai.com/api-keys'
                  : 'https://console.anthropic.com/settings/keys'
              }
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: '#ffffff',
                textDecoration: 'none',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                borderBottom: '1px solid rgba(255, 255, 255, 0.4)'
              }}
            >
              <span>Get Key</span>
              <ExternalLink size={11} />
            </a>
          </div>

          {/* API Key Input */}
          <div>
            <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
              Enter {provider.toUpperCase()} API Key
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showKey ? 'text' : 'password'}
                placeholder={
                  provider === 'gemini'
                    ? 'AIzaSy...'
                    : provider === 'openai'
                    ? 'sk-proj-...'
                    : 'sk-ant-...'
                }
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={{
                  width: '100%',
                  background: '#050505',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  padding: '9px 40px 9px 12px',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-mono)'
                }}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#71717a',
                  cursor: 'pointer'
                }}
              >
                {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <p style={{ fontSize: '0.7rem', color: '#71717a', marginTop: '4px' }}>
              Keys are stored in local server memory and session state. They are never exposed to client-side code.
            </p>
          </div>

          {/* Test or Feedback Result */}
          {testResult && (
            <div style={{
              background: testResult.success ? 'rgba(255, 255, 255, 0.05)' : '#141414',
              border: testResult.success ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid #3f3f46',
              borderRadius: '6px',
              padding: '10px 14px',
              fontSize: '0.78rem',
              color: testResult.success ? '#ffffff' : '#a1a1aa',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {testResult.success ? <CheckCircle2 size={16} color="#ffffff" /> : <AlertCircle size={16} color="#a1a1aa" />}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: '#070707',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px'
        }}>
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !apiKey.trim()}
            className="btn-primary"
            style={{ opacity: !apiKey.trim() ? 0.5 : 1 }}
          >
            {saving ? 'Testing & Saving...' : 'Save & Activate Key'}
          </button>
        </div>
      </div>
    </div>
  );
};
