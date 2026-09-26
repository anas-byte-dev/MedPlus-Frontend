import React, { useState, useEffect } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw,
  Building2,
  Stethoscope,
  HeartPulse,
  UserCheck
} from 'lucide-react';

export const PatientPortal = ({ onSelectPatientCase }) => {
  const { user, login } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyCases = async () => {
    try {
      const res = await API.get('/api/triage/my-cases');
      setCases(res.data);
    } catch (err) {
      console.error('Failed to load patient records', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCases();
  }, [user]);

  const handleDemoPatientLogin = async () => {
    await login('patient@medplus.com', 'password123');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'INCOMING_TRIAGE':
        return <span className="badge badge-amber">Triage Queue</span>;
      case 'AI_EVALUATED':
        return <span className="badge badge-cyan">Vitals Evaluated</span>;
      case 'PHYSICIAN_REVIEW':
        return <span className="badge badge-cyan">Physician Review</span>;
      case 'IN_TREATMENT':
        return <span className="badge badge-amber">Under Treatment</span>;
      case 'DISCHARGED':
        return <span className="badge badge-emerald">Discharged & Stable</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 960, margin: '0 auto', width: '100%', overflowX: 'hidden' }}>
      {/* Header */}
      <div>
        <h1 style={{ color: '#ffffff' }}>Patient Medical Chart & Clinical Records</h1>
        <p style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>
          Review active hospital admissions, verified vital signs telemetry, and physician care plans.
        </p>
      </div>

      {!user ? (
        <div className="glass-panel" style={{ padding: '36px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: 'rgba(6, 182, 212, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <UserCheck size={28} color="#06b6d4" />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff' }}>Sign in to access your clinical chart</h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 460 }}>
            Access verified biometric records, triage status, medication contraindications, and discharge instructions.
          </p>
          <button onClick={handleDemoPatientLogin} className="btn btn-primary" style={{ padding: '10px 20px' }}>
            <span>Sign In as Demo Patient (John Doe)</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {cases.map((patientCase) => (
            <div 
              key={patientCase.id}
              onClick={() => onSelectPatientCase(patientCase)}
              className="glass-panel card-interactive glow-card"
              style={{ padding: '20px 22px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span className="badge badge-cyan">{patientCase.patientId}</span>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc' }}>
                      {patientCase.patientName}
                    </h3>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Building2 size={13} color="#06b6d4" />
                    Medical Unit: {patientCase.departmentName || 'Emergency Medicine'} ({patientCase.departmentCode || 'ED'})
                  </p>
                </div>
                {getStatusBadge(patientCase.triageStatus)}
              </div>

              <div>
                <span style={{ fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Chief Complaint
                </span>
                <p style={{ fontSize: 13.5, color: '#cbd5e1', marginTop: 2 }}>
                  {patientCase.chiefComplaint}
                </p>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 8,
                padding: '10px 14px',
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: 8,
                fontSize: 12
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                  {patientCase.vitalSigns}
                </span>
                <span style={{ fontWeight: 600, color: '#38bdf8' }}>
                  {patientCase.aiAcuityLevel || 'Triage Assessment Pending'}
                </span>
              </div>
            </div>
          ))}

          {cases.length === 0 && (
            <div className="glass-panel" style={{ padding: 36, textAlign: 'center', color: 'var(--text-muted)' }}>
              No clinical cases registered under this patient account.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
