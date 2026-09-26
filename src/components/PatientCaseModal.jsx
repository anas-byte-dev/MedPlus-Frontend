import React, { useState } from 'react';
import API from '../api';
import confetti from 'canvas-confetti';
import { 
  X, 
  Sparkles, 
  Activity, 
  AlertTriangle, 
  Heart, 
  FileText,
  Clock,
  Building2,
  Copy,
  Check,
  Zap,
  Stethoscope,
  ShieldAlert,
  Send
} from 'lucide-react';

export const PatientCaseModal = ({ patientCase, onClose, onUpdate, onOpenAiConfig, aiConfig }) => {
  const [loading, setLoading] = useState(false);
  const [sbarText, setSbarText] = useState('');
  const [showSbarDraft, setShowSbarDraft] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!patientCase) return null;

  const handleEvaluateNow = async () => {
    setLoading(true);
    try {
      const res = await API.post(`/api/triage/${patientCase.id}/ai-evaluate`);
      onUpdate(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Clinical evaluation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await API.patch(`/api/triage/${patientCase.id}/status`, { status: newStatus });
      if (newStatus === 'DISCHARGED') {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      }
      onUpdate(res.data);
    } catch (err) {
      alert('Status update failed');
    }
  };

  const handleDraftSbar = async () => {
    setLoading(true);
    try {
      const res = await API.post('/api/agent/chat', {
        message: `Draft clinical discharge summary and SBAR handoff note for patient ${patientCase.patientId}`,
        patientCaseId: patientCase.id
      });
      setSbarText(res.data.reply);
      setShowSbarDraft(true);
    } catch (err) {
      alert('Failed to draft SBAR note');
    } finally {
      setLoading(false);
    }
  };

  const getAcuityColor = (score) => {
    if (!score) return '#94a3b8';
    if (score >= 80) return '#f43f5e'; // Critical Resuscitation
    if (score >= 60) return '#f59e0b'; // Emergent
    if (score >= 40) return '#06b6d4'; // Urgent
    return '#10b981'; // Non-urgent
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(4, 7, 15, 0.85)',
      backdropFilter: 'blur(10px)',
      zIndex: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12
    }}>
      <div className="glass-panel responsive-modal" style={{
        maxWidth: 880,
        maxHeight: '92vh',
        background: '#0c1222',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid var(--border)'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          background: 'rgba(12, 18, 34, 0.8)',
          gap: 12
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
              <span className="badge badge-cyan" style={{ fontSize: 10 }}>{patientCase.patientId}</span>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff' }}>{patientCase.patientName}</h2>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                ({patientCase.age} y/o {patientCase.gender})
              </span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Building2 size={13} color="#06b6d4" />
              Medical Unit: <strong>{patientCase.departmentName || 'Emergency Medicine'}</strong>
            </p>
          </div>
          <button 
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px 8px', borderRadius: 8 }}
            aria-label="Close patient modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div style={{ padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          
          {/* Vitals & Acuity Ribbon */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
            gap: 10,
            padding: 12,
            background: 'rgba(17, 26, 48, 0.6)',
            borderRadius: 12,
            border: '1px solid var(--border-subtle)'
          }}>
            <div>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Vital Signs Biometrics
              </span>
              <p style={{ fontSize: 12.5, fontWeight: 600, color: '#f8fafc', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                {patientCase.vitalSigns}
              </p>
            </div>

            <div>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Triage Acuity Level
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                <span 
                  className="badge" 
                  style={{ 
                    background: `${getAcuityColor(patientCase.triageRiskScore)}20`,
                    color: getAcuityColor(patientCase.triageRiskScore),
                    border: `1px solid ${getAcuityColor(patientCase.triageRiskScore)}40`
                  }}
                >
                  {patientCase.aiAcuityLevel || 'Awaiting Triage'}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: getAcuityColor(patientCase.triageRiskScore) }}>
                  Score: {patientCase.triageRiskScore}/100
                </span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Known Allergies
              </span>
              <p style={{ fontSize: 12.5, fontWeight: 600, color: patientCase.allergies && !patientCase.allergies.toLowerCase().includes('none') ? '#f43f5e' : '#34d399', marginTop: 4 }}>
                {patientCase.allergies || 'None recorded'}
              </p>
            </div>
          </div>

          {/* Chief Complaint */}
          <div>
            <h4 style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertTriangle size={15} color="#f59e0b" />
              Chief Complaint & Acute Presentation
            </h4>
            <div style={{
              padding: 12,
              background: 'rgba(15, 23, 42, 0.8)',
              borderRadius: 8,
              border: '1px solid var(--border-subtle)',
              fontSize: 13.5,
              lineHeight: 1.6,
              color: '#e2e8f0'
            }}>
              {patientCase.chiefComplaint}
            </div>
          </div>

          {/* Medical History */}
          {patientCase.medicalHistory && (
            <div>
              <h4 style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Medical History & Comorbidities
              </h4>
              <p style={{ fontSize: 12.5, color: 'var(--text-muted)', background: 'rgba(17, 26, 48, 0.4)', padding: 10, borderRadius: 6 }}>
                {patientCase.medicalHistory}
              </p>
            </div>
          )}

          {/* Clinical Diagnostic Decision Support */}
          {patientCase.aiDifferentialDiagnosis && (
            <div style={{
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: 12,
              padding: 14,
              background: 'rgba(6, 182, 212, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Sparkles size={16} color="#06b6d4" />
                <h4 style={{ fontSize: 14.5, fontWeight: 700, color: '#38bdf8' }}>
                  Differential Diagnostic Considerations (Clinical Reference)
                </h4>
              </div>
              <pre style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 12.5,
                color: '#cbd5e1',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.6
              }}>
                {patientCase.aiDifferentialDiagnosis}
              </pre>
            </div>
          )}

          {/* SBAR / Discharge Document Generator Box */}
          {showSbarDraft && (
            <div style={{
              background: '#090e1a',
              border: '1px solid #10b981',
              borderRadius: 12,
              padding: 14
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FileText size={15} />
                  Physician SBAR Clinical Summary & Transfer Note
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(sbarText);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: 11, padding: '4px 8px' }}
                >
                  {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                  <span>{copied ? 'Copied' : 'Copy SBAR'}</span>
                </button>
              </div>
              <textarea
                value={sbarText}
                onChange={(e) => setSbarText(e.target.value)}
                rows={7}
                className="form-textarea"
                style={{ fontSize: 12, fontFamily: 'var(--font-mono)' }}
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '12px 14px',
          borderTop: '1px solid var(--border)',
          background: 'rgba(12, 18, 34, 0.9)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 10
        }}>
          {/* Status Progression */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Stage:</span>
            <select
              value={patientCase.triageStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="form-select"
              style={{ width: 'auto', fontSize: 12, padding: '5px 10px' }}
            >
              <option value="INCOMING_TRIAGE">Incoming Triage</option>
              <option value="AI_EVALUATED">Evaluated</option>
              <option value="PHYSICIAN_REVIEW">Physician Review</option>
              <option value="IN_TREATMENT">In Treatment</option>
              <option value="DISCHARGED">Discharged / Stable</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={handleEvaluateNow}
              disabled={loading}
              className="btn btn-secondary btn-sm"
              style={{ borderColor: 'rgba(6, 182, 212, 0.4)', color: '#67e8f9' }}
            >
              <Zap size={14} />
              <span>{loading ? 'Evaluating...' : 'Re-Evaluate Vitals'}</span>
            </button>

            <button
              onClick={handleDraftSbar}
              disabled={loading}
              className="btn btn-primary btn-sm"
            >
              <FileText size={14} />
              <span>Draft SBAR Note</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
