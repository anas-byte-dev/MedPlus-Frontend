import React, { useState, useRef, useEffect } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { 
  HeartPulse, 
  Send, 
  Sparkles, 
  User, 
  Stethoscope, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  HelpCircle,
  RefreshCw,
  PhoneCall
} from 'lucide-react';

const COMMON_CONCERNS = [
  { label: 'Mild fever & cold', query: 'I have a mild fever (99.8 F) and a runny nose since yesterday. What home care should I take?' },
  { label: 'Throat irritation', query: 'I have a scratchy throat and dry cough. Are warm salt water gargles helpful?' },
  { label: 'Indigestion & acidity', query: 'I feel bloated with mild burning in my chest after eating spicy food. What natural relief works?' },
  { label: 'Chest pain & tightness', query: 'I am experiencing sharp pressure on the left side of my chest with breathlessness.' },
  { label: 'Knee joint pain', query: 'My knee joints ache when climbing stairs in the morning. Which specialist should I consult?' },
  { label: 'Migraine / Headache', query: 'I have a throbbing headache on one side of my forehead sensitive to light.' }
];

const renderMessageText = (text) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} style={{ color: 'inherit', fontWeight: 700 }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

export const AiHealthAssistant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: `Hello! I am your **MedPlus Health Assistant**.\n\nI can help you understand symptoms, general wellness advice, and guide you to the right medical specialist across Muzaffarpur, Patna, and Delhi.\n\nHow can I assist you today? You can describe any symptom or tap a quick question below.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const scrollToBottom = (behavior = 'smooth') => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior
      });
    }
  };

  useEffect(() => {
    // Scroll chat container down without scrolling the outer window/page
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = {
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await API.post('/api/agent/chat', { 
        message: query,
        patientName: user?.fullName || 'Guest Patient'
      });

      const replyText = res.data?.reply || res.data?.message || 'Thank you for reaching out. Please rest and consult your nearest physician if symptoms continue.';

      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isLiveGemini: res.data?.liveModelUsed || false
        }
      ]);
    } catch (err) {
      console.error('AI chat error', err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: "I experienced a brief connection delay. For any urgent or worsening health concerns, please proceed to the nearest medical center or call emergency services immediately.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '20px 24px',
        borderRadius: 16,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 14
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #0f2942 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(15, 41, 66, 0.15)',
            flexShrink: 0
          }}>
            <HeartPulse size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                Dr. MedPlus AI Assistant
              </h1>
              <span className="badge badge-emerald" style={{ fontSize: 11, padding: '2px 8px' }}>
                LIVE CLINICAL TRIAGE
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Conversational symptom guidance, home care remedies & specialist physician referrals.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setMessages([
              {
                sender: 'assistant',
                text: `Hello! I am **Dr. MedPlus AI**, your empathetic clinical health assistant on MedPlus Appointments.\n\nHow are you feeling today? You can describe any symptom or tap a quick question below.`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ])}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: 8, fontSize: 12 }}
            title="Reset conversation"
          >
            <RefreshCw size={13} />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* Quick Prompt Pills */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Common Symptom Inquiries:
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {COMMON_CONCERNS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item.query)}
              disabled={loading}
              className="btn btn-secondary btn-sm"
              style={{
                borderRadius: 20,
                fontSize: 12,
                padding: '5px 12px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)'
              }}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div 
        ref={chatContainerRef}
        className="glass-panel" 
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: '20px 16px',
          minHeight: 420,
          maxHeight: 560,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}
      >
        {messages.map((msg, index) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                gap: 12,
                flexDirection: isUser ? 'row-reverse' : 'row',
                alignItems: 'flex-start'
              }}
            >
              <div style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: isUser ? 'var(--primary)' : 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: 14,
                boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
              }}>
                {isUser ? <User size={18} /> : <Stethoscope size={18} />}
              </div>

              <div style={{
                maxWidth: '82%',
                backgroundColor: isUser ? 'var(--primary)' : 'var(--bg-muted)',
                color: isUser ? '#ffffff' : 'var(--text-main)',
                padding: '14px 18px',
                borderRadius: 14,
                borderTopRightRadius: isUser ? 2 : 14,
                borderTopLeftRadius: isUser ? 14 : 2,
                border: isUser ? 'none' : '1px solid var(--border)',
                boxShadow: isUser ? '0 2px 8px rgba(15, 41, 66, 0.12)' : 'none',
                lineHeight: 1.6,
                fontSize: 14
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, gap: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: isUser ? '#93c5fd' : 'var(--accent-blue, #0284c7)' }}>
                    {isUser ? (user?.fullName || 'You') : 'Dr. MedPlus AI'}
                  </span>
                  <span style={{ fontSize: 10.5, color: isUser ? '#cbd5e1' : 'var(--text-dim)' }}>
                    {msg.time}
                  </span>
                </div>

                <div style={{ whiteSpace: 'pre-line', fontSize: 13.5 }}>
                  {renderMessageText(msg.text)}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Stethoscope size={18} />
            </div>
            <div style={{
              backgroundColor: 'var(--bg-muted)',
              border: '1px solid var(--border)',
              padding: '12px 18px',
              borderRadius: 14,
              fontSize: 13,
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <RefreshCw size={14} className="spin" />
              <span>Dr. MedPlus AI is evaluating clinical recommendations...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        style={{
          display: 'flex',
          gap: 10,
          alignItems: 'center',
          backgroundColor: 'var(--bg-surface)',
          padding: 8,
          borderRadius: 14,
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        <input
          type="text"
          placeholder="Describe your symptoms (e.g. fever for 2 days, chest discomfort, joint pain)..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          readOnly={loading}
          style={{
            border: 'none',
            padding: '10px 14px',
            fontSize: 14,
            outline: 'none',
            width: '100%',
            backgroundColor: 'transparent',
            color: 'var(--text-main)',
            cursor: loading ? 'wait' : 'text'
          }}
        />

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="btn btn-primary"
          style={{
            borderRadius: 10,
            padding: '10px 18px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <span>Ask</span>
          <Send size={14} />
        </button>
      </form>

      {/* Safety Notice Footer */}
      <div style={{
        padding: '10px 14px',
        borderRadius: 10,
        backgroundColor: 'var(--bg-muted)',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontSize: 12,
        color: 'var(--text-muted)'
      }}>
        <AlertTriangle size={15} color="#d97706" style={{ flexShrink: 0 }} />
        <span>
          <strong>Patient Safety Notice:</strong> Dr. MedPlus AI provides informational clinical guidance. If you experience severe chest pain, sudden paralysis, severe bleeding, or acute breathlessness, proceed immediately to the nearest Emergency Room or call 108/112.
        </span>
      </div>
    </div>
  );
};
