import React, { useState, useEffect } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Search, 
  Filter, 
  Plus, 
  Users, 
  Bed, 
  HeartPulse, 
  Activity, 
  Stethoscope, 
  ShieldCheck, 
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const DepartmentsList = ({ onSelectDepartment, onNavigateTab }) => {
  const { isDoctor, isClinicalStaff } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAcuity, setSelectedAcuity] = useState('ALL');

  // New Department Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    specialty: '',
    headPhysician: '',
    bedCapacity: 20,
    acuityLevel: 'Critical Level 1',
    description: '',
    clinicalProtocols: ''
  });

  // Admit Patient Modal state
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [admitDept, setAdmitDept] = useState(null);
  const [patientData, setPatientData] = useState({
    patientName: '',
    age: '',
    gender: 'Male',
    chiefComplaint: '',
    vitalSigns: 'HR: 80 bpm, BP: 120/80 mmHg, SpO2: 98%, Temp: 37.0°C',
    allergies: 'None',
    medicalHistory: ''
  });

  const fetchDepartments = async () => {
    try {
      const res = await API.get('/api/departments');
      setDepartments(res.data);
    } catch (err) {
      console.error('Failed to load departments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    try {
      const protocolsArray = formData.clinicalProtocols
        ? formData.clinicalProtocols.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      await API.post('/api/departments', {
        ...formData,
        bedCapacity: parseInt(formData.bedCapacity, 10),
        clinicalProtocols: protocolsArray
      });

      setShowAddModal(false);
      setFormData({
        name: '',
        code: '',
        specialty: '',
        headPhysician: '',
        bedCapacity: 20,
        acuityLevel: 'Critical Level 1',
        description: '',
        clinicalProtocols: ''
      });
      await fetchDepartments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create department');
    }
  };

  const handleAdmitPatient = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/triage', {
        ...patientData,
        age: parseInt(patientData.age, 10),
        departmentId: admitDept?.id
      });
      alert(`Patient ${patientData.patientName} admitted for triage in ${admitDept?.name}!`);
      setShowAdmitModal(false);
      setPatientData({
        patientName: '',
        age: '',
        gender: 'Male',
        chiefComplaint: '',
        vitalSigns: 'HR: 80 bpm, BP: 120/80 mmHg, SpO2: 98%, Temp: 37.0°C',
        allergies: 'None',
        medicalHistory: ''
      });
      await fetchDepartments();
      onNavigateTab('pipeline');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to admit patient');
    }
  };

  const filteredDepts = departments.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAcuity = selectedAcuity === 'ALL' || d.acuityLevel?.includes(selectedAcuity);
    return matchesSearch && matchesAcuity;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', overflowX: 'hidden' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ color: '#ffffff' }}>Medical Units & Clinical Services</h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>
            Real-time bed utilization, specialized clinical protocols, and emergency triage admission.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          {isClinicalStaff && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary"
            >
              <Plus size={16} />
              <span>Add Medical Unit</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 200px', position: 'relative', minWidth: 0, width: '100%' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by unit name, specialty, or code (e.g. Trauma, Cardiology, Stroke)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: 38 }}
          />
        </div>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <Filter size={15} color="var(--text-muted)" />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Acuity:</span>
          {['ALL', 'Critical', 'Emergent', 'Urgent'].map(level => (
            <button
              key={level}
              onClick={() => setSelectedAcuity(level)}
              className={`btn btn-sm ${selectedAcuity === level ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: 11, padding: '4px 8px', borderRadius: 6 }}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Departments Responsive Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
        gap: 16
      }}>
        {filteredDepts.map(dept => (
          <div 
            key={dept.id}
            className="glass-panel card-interactive glow-card"
            style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              <div>
                <span className="badge badge-cyan" style={{ fontSize: 10 }}>{dept.code}</span>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginTop: 4 }}>
                  {dept.name}
                </h3>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  Head: <strong>{dept.headPhysician || 'Attending Physician'}</strong>
                </p>
              </div>
              <span className={`badge ${dept.acuityLevel?.includes('Critical') ? 'badge-rose' : dept.acuityLevel?.includes('Emergent') ? 'badge-amber' : 'badge-emerald'}`} style={{ fontSize: 9 }}>
                {dept.acuityLevel}
              </span>
            </div>

            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, minHeight: 40 }}>
              {dept.description}
            </p>

            {/* Bed Occupancy Progress */}
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: 12, borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Bed size={14} color="#06b6d4" />
                  Bed Capacity
                </span>
                <span style={{ fontWeight: 700, color: dept.occupancyRate >= 80 ? '#f43f5e' : '#38bdf8' }}>
                  {dept.currentOccupancy} / {dept.bedCapacity} beds ({dept.occupancyRate}%)
                </span>
              </div>
              <div style={{ width: '100%', height: 6, background: '#1e293b', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  width: `${Math.min(100, dept.occupancyRate)}%`,
                  height: '100%',
                  background: dept.occupancyRate >= 80 
                    ? 'linear-gradient(90deg, #f59e0b, #f43f5e)' 
                    : 'linear-gradient(90deg, #06b6d4, #10b981)',
                  borderRadius: 4
                }} />
              </div>
            </div>

            {/* Protocols Tags */}
            {dept.clinicalProtocols && dept.clinicalProtocols.length > 0 && (
              <div>
                <span style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Active Clinical Protocols
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                  {dept.clinicalProtocols.map((p, i) => (
                    <span 
                      key={i}
                      style={{
                        fontSize: 11,
                        background: 'rgba(6, 182, 212, 0.08)',
                        border: '1px solid rgba(6, 182, 212, 0.2)',
                        color: '#67e8f9',
                        padding: '2px 8px',
                        borderRadius: 4
                      }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Unit Actions */}
            <div style={{ marginTop: 'auto', paddingTop: 8, display: 'flex', gap: 8 }}>
              <button
                onClick={() => {
                  setAdmitDept(dept);
                  setShowAdmitModal(true);
                }}
                className="btn btn-accent btn-sm"
                style={{ flex: 1, fontSize: 12 }}
              >
                <Plus size={14} />
                <span>Admit Patient</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Admit Patient to Department */}
      {showAdmitModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(4, 7, 15, 0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16
        }}>
          <div className="glass-panel responsive-modal" style={{
            maxWidth: 620,
            width: '100%',
            maxHeight: '92vh',
            overflowY: 'auto',
            background: '#0c1222',
            borderRadius: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc' }}>
                  Emergency Triage Admission
                </h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Unit: <strong>{admitDept?.name}</strong> ({admitDept?.code})
                </p>
              </div>
              <button onClick={() => setShowAdmitModal(false)} className="btn btn-secondary btn-sm" style={{ padding: '6px 8px' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAdmitPatient} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
                <div style={{ gridColumn: 'span 1' }}>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Patient Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jane Doe"
                    value={patientData.patientName}
                    onChange={(e) => setPatientData({ ...patientData, patientName: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Age</label>
                  <input
                    type="number"
                    required
                    placeholder="45"
                    value={patientData.age}
                    onChange={(e) => setPatientData({ ...patientData, age: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Gender</label>
                  <select
                    value={patientData.gender}
                    onChange={(e) => setPatientData({ ...patientData, gender: e.target.value })}
                    className="form-select"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Chief Complaint & Presentation</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe patient's acute symptoms, location, radiation, and onset duration..."
                  value={patientData.chiefComplaint}
                  onChange={(e) => setPatientData({ ...patientData, chiefComplaint: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Vital Signs Biometrics</label>
                <input
                  type="text"
                  required
                  placeholder="HR: 85 bpm, BP: 125/80 mmHg, SpO2: 97%, Temp: 37.2°C"
                  value={patientData.vitalSigns}
                  onChange={(e) => setPatientData({ ...patientData, vitalSigns: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Known Drug Allergies</label>
                  <input
                    type="text"
                    placeholder="e.g. Penicillin, Sulfa, None"
                    value={patientData.allergies}
                    onChange={(e) => setPatientData({ ...patientData, allergies: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Medical History</label>
                  <input
                    type="text"
                    placeholder="e.g. Hypertension, Asthma, CAD"
                    value={patientData.medicalHistory}
                    onChange={(e) => setPatientData({ ...patientData, medicalHistory: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button type="button" onClick={() => setShowAdmitModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Admit for Triage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Medical Department */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(4, 7, 15, 0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16
        }}>
          <div className="glass-panel responsive-modal" style={{
            maxWidth: 620,
            width: '100%',
            maxHeight: '92vh',
            overflowY: 'auto',
            background: '#0c1222',
            borderRadius: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc' }}>Add Medical Unit / Department</h3>
              <button onClick={() => setShowAddModal(false)} className="btn btn-secondary btn-sm" style={{ padding: '6px 8px' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateDepartment} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Unit Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Intensive Care Unit"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Unit Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ICU-MAIN"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Specialty</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Critical Care"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Bed Capacity</label>
                  <input
                    type="number"
                    required
                    value={formData.bedCapacity}
                    onChange={(e) => setFormData({ ...formData, bedCapacity: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Acuity Tier</label>
                  <select
                    value={formData.acuityLevel}
                    onChange={(e) => setFormData({ ...formData, acuityLevel: e.target.value })}
                    className="form-select"
                  >
                    <option value="Critical Level 1">Critical Level 1</option>
                    <option value="Emergent Level 2">Emergent Level 2</option>
                    <option value="Urgent Level 3">Urgent Level 3</option>
                    <option value="Routine Step-Down">Routine Step-Down</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Attending Physician (Head)</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Alex Mercer, MD"
                  value={formData.headPhysician}
                  onChange={(e) => setFormData({ ...formData, headPhysician: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Unit Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief clinical scope and equipment..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Clinical Protocols (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Sepsis Bundle, Central Line Insertion, Arterial Line"
                  value={formData.clinicalProtocols}
                  onChange={(e) => setFormData({ ...formData, clinicalProtocols: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
