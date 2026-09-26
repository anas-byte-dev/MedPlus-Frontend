import React, { useState, useEffect } from 'react';
import API from '../api';
import { MetricCard } from '../components/MetricCard';
import { 
  Building2, 
  Users, 
  Sparkles, 
  AlertTriangle, 
  Activity, 
  Clock, 
  RefreshCw,
  Cpu, 
  ArrowRight,
  Zap,
  HeartPulse,
  Stethoscope,
  ShieldAlert,
  FileText,
  CalendarCheck
} from 'lucide-react';

export const Dashboard = ({ onSelectPatientCase, onNavigateTab, onOpenAiConfig, aiConfig }) => {
  const [metrics, setMetrics] = useState(null);
  const [recentCases, setRecentCases] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [batchRunning, setBatchRunning] = useState(false);

  const fetchDashboardData = async () => {
    try {
      // Auto-authenticate as demo doctor if no token exists
      if (!localStorage.getItem('medplus_token') && !localStorage.getItem('medpulse_token')) {
        try {
          const authRes = await API.post('/api/auth/login', {
            email: 'doctor@medplus.com',
            password: 'password123'
          });
          localStorage.setItem('medplus_token', authRes.data.token);
          localStorage.setItem('medplus_user', JSON.stringify(authRes.data));
        } catch (ignored) {}
      }

      const [mRes, cRes, lRes] = await Promise.all([
        API.get('/api/analytics/hospital-overview'),
        API.get('/api/triage'),
        API.get('/api/agent/audit-logs').catch(() => ({ data: [] }))
      ]);
      setMetrics(mRes.data);
      setRecentCases(cRes.data.slice(0, 6));
      setAuditLogs(lRes.data.slice(0, 6));
    } catch (err) {
      console.error('Failed to load clinical dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRunBatchTriage = async () => {
    setBatchRunning(true);
    try {
      const res = await API.post('/api/triage/batch-evaluate');
      alert(`Triage Queue Re-evaluated: Successfully processed ${res.data.totalProcessed} patient records in ${res.data.executionTimeMs} ms (${res.data.criticalHighRiskCount} high-acuity cases prioritized for immediate physician attention).`);
      await fetchDashboardData();
    } catch (err) {
      alert('Batch triage error: ' + (err.response?.data?.message || err.message));
    } finally {
      setBatchRunning(false);
    }
  };

  const getAcuityBadgeClass = (score) => {
    if (!score) return 'badge-cyan';
    if (score >= 80) return 'badge-rose';
    if (score >= 60) return 'badge-amber';
    return 'badge-emerald';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <RefreshCw className="live-pulse-indicator" size={32} color="#06b6d4" />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', overflowX: 'hidden' }}>
      {/* Top Banner with Hospital Status & Quick Batch Triage */}
      <div className="glass-panel glow-card responsive-banner-panel" style={{
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(16, 185, 129, 0.06) 100%)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16
      }}>
        <div style={{ flex: '1 1 240px', minWidth: 0, width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
            <span className="badge badge-cyan">Hospital Emergency Command</span>
            <span 
              onClick={onOpenAiConfig}
              style={{
                fontSize: 11,
                cursor: 'pointer',
                padding: '3px 10px',
                borderRadius: 14,
                background: aiConfig?.configured ? 'rgba(16, 185, 129, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                color: aiConfig?.configured ? '#6ee7b7' : '#67e8f9',
                border: `1px solid ${aiConfig?.configured ? 'rgba(16, 185, 129, 0.3)' : 'rgba(6, 182, 212, 0.3)'}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              <span className="live-pulse-indicator" />
              {aiConfig?.configured ? `Gemini Live (${aiConfig.activeModel || 'gemini-3.8-flash'})` : 'Clinical Decision Support (Offline Safe)'}
            </span>
          </div>
          <h1 style={{ color: '#ffffff', letterSpacing: -0.5 }}>
            MedPlus Clinical Triage & Telemetry Center
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            Emergency decision support, early warning acuity scoring (NEWS2/ESI), and real-time bed capacity analytics.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: 'auto', flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigateTab('appointments')}
            className="btn btn-secondary"
            style={{
              padding: '9px 14px',
              borderColor: 'rgba(6, 182, 212, 0.4)',
              color: '#67e8f9',
              background: 'rgba(6, 182, 212, 0.1)'
            }}
            title="Book Specialist Consultations across Muzaffarpur, Delhi, & Patna"
          >
            <CalendarCheck size={15} color="#06b6d4" />
            <span>Book Specialist</span>
          </button>

          <button
            onClick={handleRunBatchTriage}
            disabled={batchRunning}
            className="btn btn-primary"
            style={{
              padding: '9px 16px',
              boxShadow: '0 0 25px rgba(6, 182, 212, 0.4)'
            }}
            title="Evaluate active triage queue with concurrent multithreaded engine"
          >
            {batchRunning ? (
              <>
                <RefreshCw size={16} className="live-pulse-indicator" />
                <span>Evaluating Triage Queue...</span>
              </>
            ) : (
              <>
                <Cpu size={16} />
                <span>Evaluate Triage Batch</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* KPI Cards Grid - Responsive 2x2 on mobile, 4 columns on desktop */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
        gap: 12
      }}>
        <MetricCard
          title="Active Admissions"
          value={metrics?.totalActivePatients ?? 0}
          subtitle="Under observation / in care"
          icon={Users}
          color="#06b6d4"
        />
        <MetricCard
          title="Critical Red Alerts"
          value={metrics?.criticalEmergencyCases ?? 0}
          subtitle="Level 1 resuscitation priority"
          icon={AlertTriangle}
          color="#f43f5e"
        />
        <MetricCard
          title="Bed Occupancy Rate"
          value={`${metrics?.overallBedOccupancyRate ?? 0}%`}
          subtitle="Across all inpatient units"
          icon={Building2}
          color="#f59e0b"
        />
        <MetricCard
          title="Evaluated Cases"
          value={metrics?.aiEvaluatedCasesCount ?? 0}
          subtitle="Differential diagnoses ready"
          icon={Sparkles}
          color="#10b981"
        />
      </div>

      {/* Interactive Live ECG Monitor + Department Bed Occupancy Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
        gap: 16
      }}>
        {/* Live Vitals Telemetry Monitor */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <HeartPulse size={18} color="#06b6d4" />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc' }}>Live Telemetry & ECG Waveform</h3>
            </div>
            <span className="badge badge-emerald" style={{ fontSize: 10 }}>24/7 ACTIVE</span>
          </div>

          {/* Animated ECG Waveform Canvas Simulation */}
          <div style={{
            height: 90,
            background: 'rgba(3, 7, 18, 0.95)',
            borderRadius: 10,
            border: '1px solid rgba(6, 182, 212, 0.25)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            padding: '0 8px'
          }}>
            {/* Grid overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(to right, rgba(6, 182, 212, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(6, 182, 212, 0.08) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }} />

            <svg viewBox="0 0 600 80" style={{ width: '100%', height: '100%', position: 'relative', zIndex: 2 }}>
              <path
                d="M0 40 L60 40 L70 30 L80 50 L90 40 L160 40 L170 20 L180 65 L190 10 L200 60 L210 35 L220 40 L300 40 L310 25 L320 60 L330 15 L340 55 L350 40 L440 40 L450 30 L460 50 L470 40 L540 40 L550 20 L560 65 L570 15 L580 55 L600 40"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: 'drop-shadow(0 0 6px #10b981)' }}
              />
            </svg>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(65px, 1fr))', gap: 6, textAlign: 'center' }}>
            <div style={{ background: 'rgba(17, 26, 48, 0.5)', padding: '6px 4px', borderRadius: 6, minWidth: 0 }}>
              <span style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>Avg HR</span>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>78 bpm</p>
            </div>
            <div style={{ background: 'rgba(17, 26, 48, 0.5)', padding: '6px 4px', borderRadius: 6, minWidth: 0 }}>
              <span style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>Avg SpO2</span>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#34d399' }}>96.8%</p>
            </div>
            <div style={{ background: 'rgba(17, 26, 48, 0.5)', padding: '6px 4px', borderRadius: 6, minWidth: 0 }}>
              <span style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>Avg MAP</span>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#38bdf8' }}>92 mmHg</p>
            </div>
            <div style={{ background: 'rgba(17, 26, 48, 0.5)', padding: '6px 4px', borderRadius: 6, minWidth: 0 }}>
              <span style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>Triage Time</span>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b' }}>4.2 min</p>
            </div>
          </div>
        </div>

        {/* Clinical Unit Bed Occupancy Breakdown */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Building2 size={18} color="#f59e0b" />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc' }}>Department Bed Occupancy</h3>
            </div>
            <button 
              onClick={() => onNavigateTab('departments')} 
              className="btn btn-secondary btn-sm"
              style={{ fontSize: 11, padding: '3px 8px' }}
            >
              View Units
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {metrics?.departmentBedOccupancy?.map((dept) => (
              <div key={dept.departmentId}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{dept.departmentName}</span>
                  <span style={{ color: dept.occupancyPercent >= 80 ? '#f43f5e' : '#38bdf8', fontWeight: 600 }}>
                    {dept.occupied}/{dept.capacity} beds ({dept.occupancyPercent}%)
                  </span>
                </div>
                <div style={{ width: '100%', height: 6, background: '#1e293b', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min(100, dept.occupancyPercent)}%`,
                    height: '100%',
                    background: dept.occupancyPercent >= 80 
                      ? 'linear-gradient(90deg, #f59e0b, #f43f5e)' 
                      : 'linear-gradient(90deg, #06b6d4, #10b981)',
                    borderRadius: 4
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Clinical Arrivals & Clinical Agent Logs Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
        gap: 16
      }}>
        {/* Recent Triage Arrivals Table */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Stethoscope size={18} color="#06b6d4" />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc' }}>Recent Patient Arrivals</h3>
            </div>
            <button 
              onClick={() => onNavigateTab('pipeline')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: 11, padding: '3px 8px' }}
            >
              Open Queue <ArrowRight size={12} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentCases.map((patientCase) => (
              <div 
                key={patientCase.id}
                onClick={() => onSelectPatientCase(patientCase)}
                className="card-interactive"
                style={{
                  padding: 12,
                  background: 'rgba(17, 26, 48, 0.45)',
                  borderRadius: 8,
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 8
                }}
              >
                <div style={{ minWidth: 0, flex: '1 1 180px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span className="badge badge-cyan" style={{ fontSize: 9 }}>{patientCase.patientId}</span>
                    <strong style={{ fontSize: 13.5, color: '#f8fafc' }}>{patientCase.patientName}</strong>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>({patientCase.age}y)</span>
                  </div>
                  <p style={{
                    fontSize: 12,
                    color: 'var(--text-secondary)',
                    marginTop: 4,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {patientCase.chiefComplaint}
                  </p>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span className={`badge ${getAcuityBadgeClass(patientCase.triageRiskScore)}`} style={{ fontSize: 9 }}>
                    Acuity: {patientCase.triageRiskScore}
                  </span>
                  <p style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 4 }}>
                    {patientCase.triageStatus?.replace('_', ' ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Decision Support Audit Trail */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Cpu size={18} color="#10b981" />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc' }}>Decision Support Audit Log</h3>
            </div>
            <button 
              onClick={() => onNavigateTab('copilot')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: 11, padding: '3px 8px' }}
            >
              Open Copilot <ArrowRight size={12} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {auditLogs.length > 0 ? (
              auditLogs.map((log) => (
                <div 
                  key={log.id}
                  style={{
                    padding: 10,
                    background: 'rgba(15, 23, 42, 0.6)',
                    borderRadius: 6,
                    border: '1px solid var(--border-subtle)',
                    fontSize: 12
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ fontWeight: 600, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                      {log.toolName}
                    </span>
                    <span style={{ color: '#10b981', fontSize: 11, fontWeight: 600 }}>
                      {log.latencyMs} ms
                    </span>
                  </div>
                  <p style={{
                    color: 'var(--text-muted)',
                    fontSize: 11,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {log.inputSummary}
                  </p>
                </div>
              ))
            ) : (
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                No clinical agent tools executed recently. Trigger automated triage to generate telemetry logs.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
