import React, { useState, useEffect } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, 
  ShieldCheck,
  User,
  Users, 
  Calendar, 
  Activity, 
  Building2, 
  Stethoscope, 
  Zap, 
  Terminal, 
  Code2, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Filter, 
  Key, 
  Save, 
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Download,
  Phone,
  Mail,
  Clock,
  MapPin,
  Check
} from 'lucide-react';
import { generateAppointmentPdf } from '../utils/pdfGenerator';

export const AdminPanel = ({ onOpenAiConfig, aiConfig, onRefreshConfig }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // overview, doctors, appointments, users, ai-settings
  
  const [stats, setStats] = useState({
    doctorsCount: 0,
    appointmentsCount: 0,
    usersCount: 0,
    departmentsCount: 0
  });

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dbUsers, setDbUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [doctorSearch, setDoctorSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [aptSearch, setAptSearch] = useState('');
  const [aptStatusFilter, setAptStatusFilter] = useState('ALL');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');

  // AI Key state (Only Admin can see!)
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [currentApiKey, setCurrentApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-3.8-flash');
  const [showKey, setShowKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [savingKey, setSavingKey] = useState(false);
  const [testingKey, setTestingKey] = useState(false);
  const [keyFeedback, setKeyFeedback] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [docsRes, aptsRes, usersRes, deptsRes] = await Promise.all([
        API.get('/api/doctors'),
        API.get('/api/appointments'),
        API.get('/api/auth/users'),
        API.get('/api/departments')
      ]);

      setDoctors(docsRes.data);
      setAppointments(aptsRes.data);
      setDbUsers(usersRes.data);
      setStats({
        doctorsCount: docsRes.data.length,
        appointmentsCount: aptsRes.data.length,
        usersCount: usersRes.data.length,
        departmentsCount: deptsRes.data.length
      });
    } catch (err) {
      console.error('Failed to load admin telemetry', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    if (aiConfig?.activeModel) {
      setSelectedModel(aiConfig.activeModel);
    }
    if (aiConfig?.maskedKey && !currentApiKey) {
      setCurrentApiKey(aiConfig.maskedKey);
    }
  }, [aiConfig]);

  const handleCopyKey = () => {
    if (currentApiKey) {
      navigator.clipboard.writeText(currentApiKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const handleSaveApiKey = async (e) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;

    setSavingKey(true);
    setKeyFeedback(null);
    try {
      await API.post('/api/agent/config', {
        apiKey: apiKeyInput.trim(),
        modelName: selectedModel
      });
      setCurrentApiKey(apiKeyInput.trim());
      setKeyFeedback({
        type: 'success',
        message: 'Google Gemini API key verified and updated successfully in the system runtime.'
      });
      setApiKeyInput('');
      onRefreshConfig?.();
    } catch (err) {
      setKeyFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update API key.'
      });
    } finally {
      setSavingKey(false);
    }
  };

  const handleTestAiConnection = async () => {
    setTestingKey(true);
    setKeyFeedback(null);
    try {
      const res = await API.post('/api/agent/chat', { message: 'Clinical system health ping. Are you active?' });
      setKeyFeedback({
        type: 'success',
        message: `Live Gemini AI Response: "${res.data?.reply?.substring(0, 120)}..." (Status: Online)`
      });
    } catch (err) {
      setKeyFeedback({
        type: 'error',
        message: 'AI Endpoint Test Error: ' + (err.response?.data?.message || err.message)
      });
    } finally {
      setTestingKey(false);
    }
  };

  // Filtered lists
  const filteredDoctors = doctors.filter(d => {
    const matchesSearch = 
      (d.name && d.name.toLowerCase().includes(doctorSearch.toLowerCase())) ||
      (d.specialty && d.specialty.toLowerCase().includes(doctorSearch.toLowerCase())) ||
      (d.hospital && d.hospital.toLowerCase().includes(doctorSearch.toLowerCase()));
    const matchesCity = cityFilter === 'ALL' || d.city?.toLowerCase() === cityFilter.toLowerCase();
    return matchesSearch && matchesCity;
  });

  const filteredAppointments = appointments.filter(a => {
    const matchesSearch = 
      (a.patientName && a.patientName.toLowerCase().includes(aptSearch.toLowerCase())) ||
      (a.doctorName && a.doctorName.toLowerCase().includes(aptSearch.toLowerCase())) ||
      (a.bookingReference && a.bookingReference.toLowerCase().includes(aptSearch.toLowerCase()));
    const matchesStatus = aptStatusFilter === 'ALL' || a.status === aptStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredDbUsers = dbUsers.filter(u => {
    const matchesSearch = 
      (u.fullName && u.fullName.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.phone && u.phone.includes(userSearch));
    const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', maxWidth: 1240, margin: '0 auto' }}>
      {/* Admin Master Header Banner */}
      <div className="glass-panel" style={{
        padding: '24px 28px',
        borderRadius: 16,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 54,
            height: 54,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #0f2942 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(15, 41, 66, 0.15)',
            flexShrink: 0
          }}>
            <Shield size={28} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                MedPlus Central Administrative Center
              </h1>
              <span className="badge badge-amber" style={{ fontSize: 11, padding: '2px 8px' }}>
                SUPER ADMIN
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Full network telemetry across all 41 doctors, registered DBMS user accounts, master appointments & AI keys.
            </p>
          </div>
        </div>

        {/* Master Navigation Tabs */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 8 }}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`btn btn-sm ${activeTab === 'doctors' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 8 }}
          >
            All Doctors ({stats.doctorsCount})
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`btn btn-sm ${activeTab === 'appointments' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 8 }}
          >
            Appointments ({stats.appointmentsCount})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`btn btn-sm ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 8 }}
          >
            DBMS Users ({stats.usersCount})
          </button>
          <button
            onClick={() => setActiveTab('ai-settings')}
            className={`btn btn-sm ${activeTab === 'ai-settings' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 8, color: activeTab === 'ai-settings' ? '#ffffff' : '#d97706', borderColor: '#d97706' }}
          >
            <Zap size={13} style={{ marginRight: 4 }} />
            AI API Key & Settings
          </button>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="kpi-stats-grid">
        <div className="glass-panel" style={{ padding: 18, borderRadius: 14, display: 'flex', alignItems: 'center', gap: 14, background: 'var(--bg-surface)' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Stethoscope size={22} color="var(--accent-blue)" />
          </div>
          <div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Total Verified Doctors</span>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{stats.doctorsCount}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: 18, borderRadius: 14, display: 'flex', alignItems: 'center', gap: 14, background: 'var(--bg-surface)' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={22} color="var(--success)" />
          </div>
          <div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Master Appointments</span>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{stats.appointmentsCount}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: 18, borderRadius: 14, display: 'flex', alignItems: 'center', gap: 14, background: 'var(--bg-surface)' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--warning-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} color="var(--warning)" />
          </div>
          <div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Registered DBMS Accounts</span>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{stats.usersCount}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: 18, borderRadius: 14, display: 'flex', alignItems: 'center', gap: 14, background: 'var(--bg-surface)' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={22} color="#0f2942" />
          </div>
          <div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Hospital Departments</span>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{stats.departmentsCount}</h3>
          </div>
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 16 }}>
          {/* Recent Appointments */}
          <div className="glass-panel" style={{ padding: 20, borderRadius: 14, background: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Recent Appointments</h3>
              <button onClick={() => setActiveTab('appointments')} className="btn btn-secondary btn-sm" style={{ fontSize: 12 }}>
                View All
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {appointments.slice(0, 5).map(apt => (
                <div key={apt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', backgroundColor: 'var(--bg-muted)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-main)' }}>{apt.patientName}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Dr: {apt.doctorName} • {apt.appointmentDate}</div>
                  </div>
                  <span className={`badge ${apt.status === 'CONFIRMED' ? 'badge-emerald' : apt.status === 'COMPLETED' ? 'badge-blue' : 'badge-rose'}`} style={{ fontSize: 11 }}>
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Network Hubs */}
          <div className="glass-panel" style={{ padding: 20, borderRadius: 14, background: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Specialist Network Distribution</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ padding: 12, backgroundColor: 'var(--bg-muted)', borderRadius: 8, border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>Muzaffarpur Hub</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Prasad Hospital, Juran Chapra, Maripur, Ramna</div>
                </div>
                <span className="badge badge-blue">10 Specialists</span>
              </div>

              <div style={{ padding: 12, backgroundColor: 'var(--bg-muted)', borderRadius: 8, border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>Patna Hub</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>AIIMS Patna, IGIMS, Medanta, Paras HMRI, Khan Healthcare</div>
                </div>
                <span className="badge badge-emerald">15 Specialists</span>
              </div>

              <div style={{ padding: 12, backgroundColor: 'var(--bg-muted)', borderRadius: 8, border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>Delhi NCR Hub</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>AIIMS New Delhi, Safdarjung, Max Super Specialty, Apollo</div>
                </div>
                <span className="badge badge-navy">16 Specialists</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ALL 41 DOCTORS */}
      {activeTab === 'doctors' && (
        <div className="glass-panel" style={{ padding: 20, borderRadius: 16, background: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 260 }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: 360 }}>
                <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input
                  type="text"
                  placeholder="Search doctor, hospital, or specialty..."
                  value={doctorSearch}
                  onChange={(e) => setDoctorSearch(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: 36 }}
                />
              </div>

              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="input-field"
                style={{ width: 160 }}
              >
                <option value="ALL">All Cities</option>
                <option value="Muzaffarpur">Muzaffarpur</option>
                <option value="Patna">Patna</option>
                <option value="Delhi">Delhi NCR</option>
              </select>
            </div>

            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Showing {filteredDoctors.length} of {doctors.length} doctors
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="health-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Doctor Name</th>
                  <th>Specialty</th>
                  <th>Hospital & Address</th>
                  <th>City</th>
                  <th>Fee (₹)</th>
                  <th>Available Days & Hours</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map(doc => (
                  <tr key={doc.id}>
                    <td style={{ fontWeight: 700, color: 'var(--text-muted)' }}>#{doc.id}</td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{doc.name}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{doc.qualifications}</div>
                    </td>
                    <td>
                      <span className="badge badge-blue">{doc.specialty}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{doc.hospital}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)', maxWidth: 260 }}>{doc.address}</div>
                    </td>
                    <td>
                      <span className="badge badge-secondary">{doc.city}</span>
                    </td>
                    <td style={{ fontWeight: 700, color: '#059669' }}>
                      ₹{doc.consultationFee}
                    </td>
                    <td style={{ fontSize: 12 }}>
                      <div>{doc.availableDays}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>{doc.availableTimeSlots}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MASTER APPOINTMENTS LEDGER */}
      {activeTab === 'appointments' && (
        <div className="glass-panel" style={{ padding: 20, borderRadius: 16, background: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 260 }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: 360 }}>
                <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input
                  type="text"
                  placeholder="Search patient, doctor, or reference code..."
                  value={aptSearch}
                  onChange={(e) => setAptSearch(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: 36 }}
                />
              </div>

              <select
                value={aptStatusFilter}
                onChange={(e) => setAptStatusFilter(e.target.value)}
                className="input-field"
                style={{ width: 160 }}
              >
                <option value="ALL">All Statuses</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Showing {filteredAppointments.length} appointments
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="health-table">
              <thead>
                <tr>
                  <th>Booking Ref</th>
                  <th>Patient Details</th>
                  <th>Attending Doctor</th>
                  <th>Hospital & Date</th>
                  <th>Status</th>
                  <th>Consultation Fee</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map(apt => (
                  <tr key={apt.id}>
                    <td>
                      <code style={{ fontWeight: 700, color: '#0284c7' }}>{apt.bookingReference}</code>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{apt.patientName}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{apt.patientPhone || 'No phone'} • {apt.patientEmail || ''}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{apt.doctorName}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{apt.doctorSpecialty}</div>
                    </td>
                    <td>
                      <div>{apt.hospital}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{apt.appointmentDate} ({apt.timeSlot})</div>
                    </td>
                    <td>
                      <span className={`badge ${apt.status === 'CONFIRMED' ? 'badge-emerald' : apt.status === 'COMPLETED' ? 'badge-blue' : 'badge-rose'}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: '#059669' }}>
                      ₹{apt.consultationFee || 600}
                    </td>
                    <td>
                      <button
                        onClick={() => generateAppointmentPdf(apt)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: 12, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4 }}
                        title="Download Official A4 OPD Pass"
                      >
                        <Download size={13} />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: REGISTERED ACCOUNTS IN DBMS */}
      {activeTab === 'users' && (
        <div className="glass-panel" style={{ padding: 20, borderRadius: 16, background: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                Registered Accounts Stored in Database (DBMS)
              </h3>
              <p style={{ fontSize: 12.5, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                All user accounts created through registration or data seeding directly in the system database.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ position: 'relative', width: 260 }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input
                  type="text"
                  placeholder="Filter users by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: 32, fontSize: 12.5 }}
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="input-field"
                style={{ width: 150, fontSize: 12.5 }}
              >
                <option value="ALL">All Roles</option>
                <option value="ROLE_PATIENT">Patient</option>
                <option value="ROLE_DOCTOR">Doctor</option>
                <option value="ROLE_HOSPITAL">Hospital</option>
                <option value="ROLE_ADMIN">Admin</option>
              </select>

              <button
                onClick={fetchAdminData}
                className="btn btn-secondary btn-sm"
                title="Refresh users from DBMS"
              >
                <RefreshCw size={13} className={loading ? 'spin' : ''} />
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="health-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Full Name / Facility</th>
                  <th>Email (Username)</th>
                  <th>Role</th>
                  <th>Contact Phone</th>
                  <th>Associated Facility / Specialty</th>
                  <th>Medical License / Doc ID</th>
                </tr>
              </thead>
              <tbody>
                {filteredDbUsers.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 700, color: 'var(--text-muted)' }}>#{u.id}</td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{u.fullName}</div>
                    </td>
                    <td>
                      <code style={{ fontSize: 12 }}>{u.email}</code>
                    </td>
                    <td>
                      <span className={`badge ${
                        u.role === 'ROLE_PATIENT' ? 'badge-secondary' :
                        u.role === 'ROLE_DOCTOR' ? 'badge-emerald' :
                        u.role === 'ROLE_HOSPITAL' ? 'badge-blue' :
                        'badge-amber'
                      }`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        {u.role === 'ROLE_PATIENT' ? <><User size={12} /> Patient</> :
                         u.role === 'ROLE_DOCTOR' ? <><Stethoscope size={12} /> Doctor</> :
                         u.role === 'ROLE_HOSPITAL' ? <><Building2 size={12} /> Hospital</> : <><ShieldCheck size={12} /> Super Admin</>}
                      </span>
                    </td>
                    <td style={{ fontSize: 12.5 }}>
                      {u.phone || '—'}
                    </td>
                    <td style={{ fontSize: 12.5 }}>
                      {u.hospital ? <strong>{u.hospital}</strong> : (u.departmentName || '—')}
                    </td>
                    <td style={{ fontSize: 12 }}>
                      {u.medicalLicense ? <code>{u.medicalLicense}</code> : (u.doctorId ? `#DOC-${u.doctorId}` : '—')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: AI API KEY & SYSTEM SETTINGS (ADMIN ONLY) */}
      {activeTab === 'ai-settings' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
          {/* Key Management Card */}
          <div className="glass-panel" style={{ padding: 24, borderRadius: 16, background: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'var(--warning-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Key size={22} color="var(--warning)" />
              </div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                  Google Gemini AI Credentials
                </h3>
                <p style={{ fontSize: 12.5, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Restricted to Super Admin. Controls the AI Health Assistant and clinical triage models.
                </p>
              </div>
            </div>

            {/* Currently Configured Key Box */}
            <div style={{
              padding: '14px 16px',
              borderRadius: 12,
              backgroundColor: 'var(--bg-muted)',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Active Gemini API Key:
              </span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <code style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#0f2942',
                  wordBreak: 'break-all'
                }}>
                  {currentApiKey 
                    ? (showKey 
                        ? currentApiKey 
                        : (currentApiKey.includes('••••') 
                            ? currentApiKey 
                            : (currentApiKey.length > 12 
                                ? currentApiKey.substring(0, 6) + '••••••••••••••••••••' + currentApiKey.substring(currentApiKey.length - 4) 
                                : '••••••••••••'))) 
                    : (aiConfig?.maskedKey || 'Configured via .env')}
                </code>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '4px 8px' }}
                    title={showKey ? 'Hide key' : 'Show key'}
                  >
                    {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyKey}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '4px 8px' }}
                    title="Copy API key"
                  >
                    {copiedKey ? <Check size={14} color="#059669" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Active Model: <code style={{ color: '#0284c7' }}>{selectedModel}</code>
              </div>
            </div>

            {/* Key Feedback */}
            {keyFeedback && (
              <div style={{
                padding: '10px 14px',
                borderRadius: 10,
                fontSize: 12.5,
                backgroundColor: keyFeedback.type === 'success' ? '#f0fdf4' : '#fff1f2',
                color: keyFeedback.type === 'success' ? '#15803d' : '#be123c',
                border: `1px solid ${keyFeedback.type === 'success' ? '#bbf7d0' : '#fecdd3'}`
              }}>
                {keyFeedback.message}
              </div>
            )}

            {/* Form to update key or model */}
            <form onSubmit={handleSaveApiKey} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 4 }}>
                  Update Gemini API Key
                </label>
                <input
                  type="text"
                  placeholder="Paste new Gemini API key here..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 4 }}>
                  Select Model Version
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="input-field"
                >
                  <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended & Verified Active)</option>
                  <option value="gemini-flash-latest">gemini-flash-latest</option>
                  <option value="gemini-2.5-flash">gemini-2.5-flash</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button
                  type="submit"
                  disabled={savingKey || !apiKeyInput.trim()}
                  className="btn btn-primary"
                  style={{ flex: 1, fontSize: 13 }}
                >
                  <Save size={14} />
                  <span>{savingKey ? 'Saving...' : 'Save Key'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleTestAiConnection}
                  disabled={testingKey}
                  className="btn btn-secondary"
                  style={{ fontSize: 13 }}
                >
                  <RefreshCw size={14} className={testingKey ? 'spin' : ''} />
                  <span>{testingKey ? 'Testing...' : 'Test Connection'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Developer Consoles (Strictly Admin Only) */}
          <div className="glass-panel" style={{ padding: 24, borderRadius: 16, background: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Terminal size={22} color="#0f2942" />
              </div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                  Developer Web Consoles & Database
                </h3>
                <p style={{ fontSize: 12.5, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Restricted infrastructure tools for administrative database review and schema debugging.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ padding: 14, backgroundColor: 'var(--bg-muted)', borderRadius: 10, border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>Swagger REST API Interactive Docs</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Explore all backend endpoints, test payloads, and inspect schema models</div>
                </div>
                <a
                  href={`${import.meta.env.VITE_API_BASE_URL || 'https://medplus-backend-brkh.onrender.com'}/swagger-ui.html`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <span>Open</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              <div style={{ padding: 14, backgroundColor: 'var(--bg-muted)', borderRadius: 10, border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>H2 In-Memory Database Web Console</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Direct SQL queries against users, doctors, and appointments tables</div>
                </div>
                <a
                  href="http://localhost:8080/h2-console"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <span>Open</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <div style={{ padding: 12, backgroundColor: 'var(--accent-blue-light)', borderRadius: 10, border: '1px solid rgba(56, 189, 248, 0.3)', fontSize: 12, color: 'var(--accent-blue)' }}>
              ℹ️ <strong>Admin Security Guarantee:</strong> These developer links are hidden from all patients, doctors, and hospital panels and are accessible exclusively from this Admin Command Center.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
