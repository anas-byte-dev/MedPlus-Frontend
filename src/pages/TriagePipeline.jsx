import React, { useState, useEffect } from 'react';
import API from '../api';
import confetti from 'canvas-confetti';
import { 
  Activity, 
  Sparkles, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw,
  Search,
  Filter,
  Stethoscope,
  HeartPulse,
  FileText,
  SlidersHorizontal
} from 'lucide-react';

const STAGES = [
  { key: 'INCOMING_TRIAGE', label: 'Incoming Triage', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.4)' },
  { key: 'AI_EVALUATED', label: 'Evaluated', color: '#06b6d4', border: 'rgba(6, 182, 212, 0.4)' },
  { key: 'PHYSICIAN_REVIEW', label: 'Physician Review', color: '#6366f1', border: 'rgba(99, 102, 241, 0.4)' },
  { key: 'IN_TREATMENT', label: 'In Treatment', color: '#a855f7', border: 'rgba(168, 85, 247, 0.4)' },
  { key: 'DISCHARGED', label: 'Discharged / Stable', color: '#10b981', border: 'rgba(16, 185, 129, 0.4)' }
];

export const TriagePipeline = ({ onSelectPatientCase }) => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDepartment, setFilterDepartment] = useState('ALL');
  const [selectedMobileStage, setSelectedMobileStage] = useState('ALL');
  const [departments, setDepartments] = useState([]);

  const fetchData = async () => {
    try {
      const [cRes, dRes] = await Promise.all([
        API.get('/api/triage'),
        API.get('/api/departments')
      ]);
      setCases(cRes.data);
      setDepartments(dRes.data);
    } catch (err) {
      console.error('Failed to load triage pipeline data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdvanceStage = async (patientCase, currentStage) => {
    const currentIndex = STAGES.findIndex(s => s.key === currentStage);
    if (currentIndex >= STAGES.length - 1) return;

    const nextStage = STAGES[currentIndex + 1].key;
    try {
      const res = await API.patch(`/api/triage/${patientCase.id}/status`, { status: nextStage });
      if (nextStage === 'DISCHARGED') {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      }
      setCases(cases.map(c => c.id === patientCase.id ? res.data : c));
    } catch (err) {
      alert('Failed to advance triage stage');
    }
  };

  const handleAiEvaluate = async (e, patientCaseId) => {
    e.stopPropagation();
    try {
      const res = await API.post(`/api/triage/${patientCaseId}/ai-evaluate`);
      setCases(cases.map(c => c.id === patientCaseId ? res.data : c));
    } catch (err) {
      alert('Clinical decision evaluation failed');
    }
  };

  const filteredCases = cases.filter(c => {
    if (filterDepartment === 'ALL') return true;
    return c.departmentId === parseInt(filterDepartment, 10);
  });

  const getAcuityColor = (score) => {
    if (!score) return '#94a3b8';
    if (score >= 80) return '#f43f5e';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#06b6d4';
    return '#10b981';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <RefreshCw className="live-pulse-indicator" size={32} color="#06b6d4" />
      </div>
    );
  }

  const displayedStages = selectedMobileStage === 'ALL'
    ? STAGES
    : STAGES.filter(s => s.key === selectedMobileStage);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', overflowX: 'hidden' }}>
      {/* Header & Department Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 style={{ color: '#ffffff' }}>Emergency Clinical Triage Queue</h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>
            Real-time emergency patient progression, early warning scoring, and clinical stage transitions.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Filter Unit:</span>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="form-select"
            style={{ width: 'auto', fontSize: 13, padding: '6px 12px' }}
          >
            <option value="ALL">All Medical Units ({cases.length})</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile/Tablet Stage Focus Pills */}
      <div className="mobile-only" style={{ flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
          <SlidersHorizontal size={13} />
          <span>Stage Focus View:</span>
        </div>
        <div className="mobile-stage-bar">
          <button
            onClick={() => setSelectedMobileStage('ALL')}
            className={`btn btn-sm ${selectedMobileStage === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: 11, padding: '4px 10px', borderRadius: 16 }}
          >
            All Stages ({filteredCases.length})
          </button>
          {STAGES.map(stage => {
            const count = filteredCases.filter(c => c.triageStatus === stage.key).length;
            return (
              <button
                key={stage.key}
                onClick={() => setSelectedMobileStage(stage.key)}
                className={`btn btn-sm ${selectedMobileStage === stage.key ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: 11, padding: '4px 10px', borderRadius: 16, whiteSpace: 'nowrap' }}
              >
                {stage.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Kanban Board Container (Adaptive Grid / Horizontal Touch Scroll) */}
      <div 
        className="horizontal-scroll-touch"
        style={{
          display: 'grid',
          gridTemplateColumns: selectedMobileStage !== 'ALL'
            ? '1fr'
            : 'repeat(5, minmax(min(84vw, 260px), 1fr))',
          gap: 14,
          paddingBottom: 20,
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}
      >
        {displayedStages.map(stage => {
          const stageCases = filteredCases.filter(c => c.triageStatus === stage.key);

          return (
            <div 
              key={stage.key}
              style={{
                background: 'rgba(10, 15, 28, 0.7)',
                borderRadius: 12,
                border: `1px solid ${stage.border}`,
                display: 'flex',
                flexDirection: 'column',
                minHeight: '60vh',
                minWidth: 0,
                boxSizing: 'border-box'
              }}
            >
              {/* Stage Header */}
              <div style={{
                padding: '14px 16px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(12, 18, 34, 0.9)',
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: stage.color, boxShadow: `0 0 8px ${stage.color}` }} />
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: '#f8fafc' }}>{stage.label}</span>
                </div>
                <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#cbd5e1', fontSize: 11 }}>
                  {stageCases.length}
                </span>
              </div>

              {/* Cards Container */}
              <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 12, flex: 1, overflowY: 'auto' }}>
                {stageCases.map(patientCase => (
                  <div
                    key={patientCase.id}
                    onClick={() => onSelectPatientCase(patientCase)}
                    className="card-interactive"
                    style={{
                      padding: 14,
                      background: '#0d1424',
                      borderRadius: 10,
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      position: 'relative'
                    }}
                  >
                    {/* Top row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span className="badge badge-cyan" style={{ fontSize: 9 }}>{patientCase.patientId}</span>
                      <span 
                        className="badge" 
                        style={{ 
                          fontSize: 9,
                          background: `${getAcuityColor(patientCase.triageRiskScore)}20`,
                          color: getAcuityColor(patientCase.triageRiskScore),
                          border: `1px solid ${getAcuityColor(patientCase.triageRiskScore)}40`
                        }}
                      >
                        Score: {patientCase.triageRiskScore}
                      </span>
                    </div>

                    {/* Patient Name */}
                    <div>
                      <h4 style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>
                        {patientCase.patientName}
                      </h4>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {patientCase.age}y • {patientCase.gender} • {patientCase.departmentCode || 'ED'}
                      </span>
                    </div>

                    {/* Chief Complaint snippet */}
                    <p style={{
                      fontSize: 12,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {patientCase.chiefComplaint}
                    </p>

                    {/* Vitals */}
                    <div style={{
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)',
                      background: 'rgba(15, 23, 42, 0.8)',
                      padding: '4px 6px',
                      borderRadius: 4,
                      color: '#94a3b8',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {patientCase.vitalSigns}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, paddingTop: 6, borderTop: '1px solid var(--border-subtle)' }}>
                      {patientCase.triageStatus === 'INCOMING_TRIAGE' ? (
                        <button
                          onClick={(e) => handleAiEvaluate(e, patientCase.id)}
                          className="btn btn-sm"
                          style={{
                            fontSize: 10,
                            padding: '3px 8px',
                            background: 'rgba(6, 182, 212, 0.15)',
                            color: '#67e8f9',
                            border: '1px solid rgba(6, 182, 212, 0.3)'
                          }}
                        >
                          <Sparkles size={11} /> Evaluate Vitals
                        </button>
                      ) : (
                        <span style={{ fontSize: 10, color: '#38bdf8', fontWeight: 600 }}>
                          {patientCase.aiAcuityLevel ? patientCase.aiAcuityLevel.split(':')[0] : 'Evaluated'}
                        </span>
                      )}

                      {stage.key !== 'DISCHARGED' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAdvanceStage(patientCase, stage.key);
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: 10, padding: '3px 8px' }}
                          title="Advance patient to next clinical stage"
                        >
                          <span>Advance</span> <ChevronRight size={11} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {stageCases.length === 0 && (
                  <div style={{
                    padding: '30px 10px',
                    textAlign: 'center',
                    color: 'var(--text-dim)',
                    fontSize: 12,
                    fontStyle: 'italic'
                  }}>
                    No patients currently in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
