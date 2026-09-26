import React, { useState, useEffect } from 'react';
import API from '../api';
import confetti from 'canvas-confetti';
import { 
  X, 
  Sparkles, 
  Key, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  Cpu, 
  Zap, 
  RefreshCw,
  Layers,
  ShieldCheck,
  Check,
  HeartPulse
} from 'lucide-react';

export const AiConfigModal = ({ isOpen, onClose, onConfigUpdated }) => {
  const [config, setConfig] = useState(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-3.8-flash');
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingConfig, setFetchingConfig] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const fetchConfig = async () => {
    setFetchingConfig(true);
    try {
      const res = await API.get('/api/agent/config');
      setConfig(res.data);
      if (res.data.activeModel) {
        setSelectedModel(res.data.activeModel);
      }
    } catch (err) {
      console.error('Failed to fetch AI configuration', err);
    } finally {
      setFetchingConfig(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setFeedback(null);
      setApiKeyInput('');
      fetchConfig();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleActivate = async (e) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) {
      setFeedback({
        type: 'error',
        message: 'Please paste your Google Gemini API key to activate live AI.'
      });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const res = await API.post('/api/agent/config', {
        apiKey: apiKeyInput.trim(),
        model: selectedModel
      });

      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      setFeedback({
        type: 'success',
        message: res.data.message || 'Google Gemini Clinical AI activated successfully!',
        latency: res.data.latencyMs
      });
      setApiKeyInput('');
      await fetchConfig();
      onConfigUpdated?.(res.data);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to activate Gemini API key';
      setFeedback({
        type: 'error',
        message: errMsg
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToLocal = async () => {
    if (!window.confirm('Switch back to MedPlus Offline Clinical Decision Support?')) return;
    setLoading(true);
    setFeedback(null);
    try {
      const res = await API.post('/api/agent/config', {
        apiKey: '',
        model: selectedModel
      });
      setFeedback({
        type: 'info',
        message: 'Switched to MedPlus Offline Clinical Intelligence mode.'
      });
      await fetchConfig();
      onConfigUpdated?.(res.data);
    } catch (err) {
      setFeedback({
        type: 'error',
        message: 'Failed to reset configuration.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 8, 15, 0.88)',
      backdropFilter: 'blur(12px)',
      zIndex: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12
    }}>
      <div className="glass-panel responsive-modal" style={{
        maxWidth: 680,
        maxHeight: '92vh',
        overflowY: 'auto',
        border: '1px solid rgba(6, 182, 212, 0.35)',
        background: '#0d1322',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(6, 182, 212, 0.15)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 22px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(6, 182, 212, 0.05)',
          gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(6, 182, 212, 0.4)',
              flexShrink: 0
            }}>
              <HeartPulse size={20} color="white" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: 18, fontWeight: 800 }}>Clinical AI Engine Configuration</h3>
                <span className="badge badge-cyan" style={{ fontSize: 9 }}>Google Gemini v1beta</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                Connect live Gemini models for real-time diagnostic intelligence, or use offline clinical rules.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px 8px', borderRadius: 8 }}
            aria-label="Close AI config modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Current Status Card */}
          <div style={{
            padding: 12,
            borderRadius: 12,
            background: config?.hasApiKey ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
            border: `1px solid ${config?.hasApiKey ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: config?.hasApiKey ? '#10b981' : '#f59e0b',
                boxShadow: config?.hasApiKey ? '0 0 12px #10b981' : '0 0 12px #f59e0b',
                flexShrink: 0
              }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {config?.hasApiKey ? (
                      <>
                        <Zap size={14} color="#10b981" />
                        <span>Live Google Gemini Connected</span>
                      </>
                    ) : (
                      <>
                        <Cpu size={14} color="#f59e0b" />
                        <span>Offline Clinical Decision Support (Standby)</span>
                      </>
                    )}
                  </span>
                  {config?.hasApiKey && (
                    <span className="badge badge-emerald" style={{ fontSize: 10 }}>
                      {config.activeModel}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  {config?.hasApiKey 
                    ? `Live LLM generative mode active. Key: ${config.maskedApiKey || 'Protected'}`
                    : 'Currently utilizing internal clinical rule sets. Activate Gemini API key below for live AI reasoning.'}
                </p>
              </div>
            </div>

            {config?.hasApiKey && (
              <button 
                onClick={handleSwitchToLocal}
                disabled={loading}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: 11, padding: '4px 10px' }}
                title="Disconnect Gemini key"
              >
                Disconnect Key
              </button>
            )}
          </div>

          {/* Feedback Banner */}
          {feedback && (
            <div style={{
              padding: '12px 14px',
              borderRadius: 10,
              background: feedback.type === 'success' 
                ? 'rgba(16, 185, 129, 0.15)' 
                : feedback.type === 'info' 
                  ? 'rgba(6, 182, 212, 0.15)' 
                  : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${
                feedback.type === 'success' 
                  ? 'rgba(16, 185, 129, 0.35)' 
                  : feedback.type === 'info' 
                    ? 'rgba(6, 182, 212, 0.35)' 
                    : 'rgba(239, 68, 68, 0.35)'
              }`,
              color: feedback.type === 'success' ? '#6ee7b7' : feedback.type === 'info' ? '#67e8f9' : '#fca5a5',
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}>
              {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
              <div style={{ flex: 1 }}>
                <div>{feedback.message}</div>
                {feedback.latency && (
                  <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>
                    API round-trip verification time: {feedback.latency}ms
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Activation Form */}
          <form onSubmit={handleActivate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* API Key Input */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', gap: 6 }}>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: '#67e8f9', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Key size={14} color="#06b6d4" />
                  Google Gemini API Key
                </label>
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: 12,
                    color: '#38bdf8',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  Get free key at Google AI Studio
                  <ExternalLink size={12} />
                </a>
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  type={showKey ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Paste your Gemini API key (starts with AIzaSy...)"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  disabled={loading}
                  style={{
                    paddingRight: 40,
                    fontFamily: showKey ? 'monospace' : 'inherit',
                    fontSize: 13
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: 4
                  }}
                  aria-label={showKey ? "Hide API key" : "Show API key"}
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Model Selection */}
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: '#67e8f9', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Cpu size={14} color="#06b6d4" />
                Gemini Model Selection
              </label>
              <select
                className="form-select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={loading}
                style={{ fontSize: 13 }}
              >
                <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended — Current Google Flagship)</option>
                <option value="gemini-flash-latest">gemini-flash-latest (Stable flash release)</option>
                <option value="gemini-3.5-flash-lite">gemini-3.5-flash-lite (Ultra-fast response)</option>
                <option value="gemini-3.5-flash">gemini-3.5-flash (Standard flash)</option>
                <option value="gemini-pro-latest">gemini-pro-latest (Deep reasoning)</option>
              </select>
            </div>

            {/* Submit / Activate Button */}
            <button
              type="submit"
              disabled={loading || !apiKeyInput.trim()}
              className="btn btn-primary"
              style={{
                padding: '12px 20px',
                fontSize: 14,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginTop: 4
              }}
            >
              {loading ? (
                <>
                  <RefreshCw className="live-pulse-indicator" size={16} />
                  <span>Verifying Key with Google Gemini...</span>
                </>
              ) : (
                <>
                  <Zap size={16} />
                  <span>Verify & Activate Live Gemini AI</span>
                </>
              )}
            </button>
          </form>

          {/* Feature Highlights Grid */}
          <div style={{
            marginTop: 6,
            borderTop: '1px solid var(--border)',
            paddingTop: 14,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: 12
          }}>
            <div style={{
              background: 'rgba(9, 13, 22, 0.6)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: 12,
              fontSize: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#38bdf8', fontWeight: 600, marginBottom: 4 }}>
                <Sparkles size={14} />
                <span>Autonomous Triage Decision Support</span>
              </div>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.4 }}>
                Executes multi-tool clinical loop to compute NEWS2 early warning acuity scores, synthesize differential diagnoses, and screen drug-allergy contraindications.
              </p>
            </div>

            <div style={{
              background: 'rgba(9, 13, 22, 0.6)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: 12,
              fontSize: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#10b981', fontWeight: 600, marginBottom: 4 }}>
                <Cpu size={14} />
                <span>Clinical Decision Copilot</span>
              </div>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.4 }}>
                Interactive natural language decision support to query patient vitals history, review lab panels, and draft structured SBAR physician transfer notes.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 22px',
          borderTop: '1px solid var(--border)',
          background: 'rgba(9, 13, 22, 0.5)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-dim)' }}>
            <ShieldCheck size={14} color="#10b981" />
            <span>Keys are tested live and stored in runtime memory</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary btn-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
