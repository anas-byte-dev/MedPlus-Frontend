import React, { useState, useRef, useEffect } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { 
  HeartPulse, 
  Send, 
  Sparkles, 
  Cpu, 
  Terminal,
  User,
  Zap,
  Shield,
  Activity,
  CheckCircle2,
  RefreshCw,
  Stethoscope,
  Pill,
  FileText
} from 'lucide-react';

const SUGGESTIONS = [
  "Evaluate vital signs biometrics for patient PT-9401",
  "Generate differential diagnosis for acute retrosternal chest pain",
  "Screen drug interactions: Aspirin and Heparin with Penicillin allergy",
  "What are the emergency resuscitation protocols for acute severe asthma?",
  "Draft clinical SBAR discharge summary for patient PT-9402",
  "Evaluate Code Stroke criteria for acute facial droop and hemiparesis"
];

export const AgentCopilot = ({ onOpenAiConfig, aiConfig }) => {
  const { user, login } = useAuth();
  const [messages, setMessages] = useState([
    {
      sender: 'agent',
      text: "Welcome to **MedPlus Clinical Decision Support**.\n\nI assist attending physicians and emergency triage staff with automated NEWS2 vital signs acuity scoring, differential diagnostic hypotheses, contraindication checks, and structured SBAR handoff summaries. How can I assist with patient care today?",
      tools: [],
      isLiveGemini: aiConfig?.configured || false,
      aiProvider: aiConfig?.configured ? `Google Gemini (${aiConfig.activeModel || 'gemini-2.5-flash'})` : 'MedPlus Clinical Intelligence Engine'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    if (!user) {
      await login('doctor@medplus.com', 'password123');
    }

    const newMsgs = [...messages, { sender: 'user', text }];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);

    try {
      const res = await API.post('/api/agent/chat', { message: text });
      setMessages([...newMsgs, {
        sender: 'agent',
        text: res.data.reply,
        tools: res.data.executedTools || [],
        isLiveGemini: res.data.liveModelUsed,
        aiProvider: res.data.liveModelUsed ? `Google Gemini (${res.data.activeModel})` : 'MedPlus Clinical Intelligence Engine'
      }]);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message;
      setMessages([...newMsgs, {
        sender: 'agent',
        text: "I was unable to complete the clinical request: " + errMsg + "\n\nPlease ensure clinical portal authentication is active.",
        tools: [],
        isLiveGemini: false,
        aiProvider: 'Clinical Error Handler'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr',
      maxWidth: 960,
      margin: '0 auto',
      width: '100%',
      gap: 16,
      overflowX: 'hidden'
    }}>
      {/* Clinical Engine Status Banner */}
      <div className="glass-panel" style={{
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 10,
        background: 'rgba(6, 182, 212, 0.06)',
        border: '1px solid rgba(6, 182, 212, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: 'rgba(6, 182, 212, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <HeartPulse size={18} color="#06b6d4" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: '#f8fafc' }}>
                MedPlus Clinical Decision Support
              </span>
              <span className="badge badge-cyan" style={{ fontSize: 9 }}>v2.5 CLINICAL</span>
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              Telemetry Engine: <strong style={{ color: '#38bdf8' }}>{aiConfig?.configured ? `Google Gemini (${aiConfig.activeModel || 'gemini-2.5-flash'})` : 'MedPlus Offline Decision Support'}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAiConfig}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: 11, padding: '4px 10px', borderColor: 'rgba(6, 182, 212, 0.3)' }}
        >
          <Zap size={12} color="#06b6d4" />
          <span>Configure Engine</span>
        </button>
      </div>

      {/* Chat Messages Log */}
      <div className="glass-panel" style={{
        minHeight: '52vh',
        maxHeight: '65vh',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 14,
        overflow: 'hidden'
      }}>
        <div style={{
          flex: 1,
          padding: '16px 18px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 14
        }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 10,
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '92%'
              }}
            >
              {msg.sender === 'agent' && (
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #06b6d4, #10b981)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 2
                }}>
                  <HeartPulse size={16} color="white" />
                </div>
              )}

              <div style={{
                background: msg.sender === 'user' ? '#0891b2' : '#0c1424',
                color: '#f8fafc',
                padding: '12px 16px',
                borderRadius: 12,
                border: msg.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                fontSize: 13.5,
                lineHeight: 1.6
              }}>
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {msg.text}
                </div>

                {/* Executed Tools Audit Badges */}
                {msg.tools && msg.tools.length > 0 && (
                  <div style={{
                    marginTop: 10,
                    paddingTop: 8,
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6
                  }}>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                      Clinical Decision Tools Executed:
                    </span>
                    {msg.tools.map((t, idx) => (
                      <div 
                        key={idx}
                        style={{
                          fontSize: 11,
                          fontFamily: 'var(--font-mono)',
                          background: 'rgba(6, 182, 212, 0.12)',
                          padding: '3px 8px',
                          borderRadius: 4,
                          color: '#67e8f9',
                          display: 'flex',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span>{t.toolName}</span>
                        <span style={{ color: '#10b981' }}>{t.latencyMs}ms</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #06b6d4, #10b981)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <HeartPulse size={16} color="white" />
              </div>
              <div style={{
                background: '#0c1424',
                padding: '10px 16px',
                borderRadius: 12,
                fontSize: 13,
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                <RefreshCw size={14} className="live-pulse-indicator" />
                <span>Evaluating clinical parameters and diagnostic protocols...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border)',
          background: 'rgba(12, 18, 34, 0.95)'
        }}>
          {/* Quick Suggestion Chips */}
          <div className="horizontal-scroll-touch" style={{ display: 'flex', gap: 8, paddingBottom: 8, marginBottom: 6 }}>
            {SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(s)}
                className="btn btn-secondary btn-sm"
                style={{
                  fontSize: 11,
                  padding: '4px 10px',
                  whiteSpace: 'nowrap',
                  background: 'rgba(17, 26, 48, 0.7)',
                  borderRadius: 16
                }}
              >
                <Sparkles size={11} color="#06b6d4" />
                <span>{s}</span>
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            style={{ display: 'flex', gap: 10 }}
          >
            <input
              type="text"
              placeholder="Ask about patient vitals, differential diagnoses, or drug interactions..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="form-input"
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn btn-primary"
              style={{ padding: '0 16px' }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
