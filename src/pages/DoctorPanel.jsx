import React, { useState, useEffect } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  RefreshCw,
  Download,
  FileText,
  AlertCircle
} from 'lucide-react';
import { generateAppointmentPdf } from '../utils/pdfGenerator';

export const DoctorPanel = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchDoctorAppointments = async () => {
    setLoading(true);
    try {
      // Query parameters for this doctor: filter by hospital or doctorId
      const params = {};
      if (user?.hospital) params.hospital = user.hospital;
      if (user?.doctorId) params.doctorId = user.doctorId;

      const res = await API.get('/api/appointments', { params });
      setAppointments(res.data);
    } catch (err) {
      console.error('Failed to fetch doctor appointments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorAppointments();
  }, [user]);

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await API.patch(`/api/appointments/${id}/status`, { status: newStatus });
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Could not update status: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredAppointments = appointments.filter(a => {
    const matchesSearch = 
      (a.patientName && a.patientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (a.bookingReference && a.bookingReference.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (a.symptoms && a.symptoms.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const confirmedCount = appointments.filter(a => a.status === 'CONFIRMED').length;
  const completedCount = appointments.filter(a => a.status === 'COMPLETED').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', maxWidth: 1100, margin: '0 auto' }}>
      {/* Doctor Header Banner */}
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
            width: 52,
            height: 52,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #0f2942 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(15, 41, 66, 0.15)',
            flexShrink: 0
          }}>
            <Stethoscope size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                {user?.fullName || 'Physician OPD Schedule'}
              </h1>
              <span className="badge badge-emerald" style={{ fontSize: 11, padding: '2px 8px' }}>
                ATTENDING PHYSICIAN
              </span>
              {user?.medicalLicense && (
                <span className="badge badge-secondary" style={{ fontSize: 11, padding: '2px 8px' }}>
                  {user.medicalLicense}
                </span>
              )}
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Hospital: <strong style={{ color: 'var(--text-main)' }}>{user?.hospital || 'Assigned Hospital / Clinic'}</strong> • Specialization: <strong style={{ color: '#0284c7' }}>{user?.departmentName || 'Specialist Medicine'}</strong>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={fetchDoctorAppointments}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: 8, fontSize: 13 }}
            title="Refresh appointments"
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            <span>Refresh Queue</span>
          </button>
        </div>
      </div>

      {/* Quick KPI Stat Chips */}
      <div className="kpi-stats-grid">
        <div className="glass-panel" style={{ padding: 16, borderRadius: 12, background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--accent-blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={20} color="var(--accent-blue)" />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Total Bookings</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)' }}>{appointments.length}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: 16, borderRadius: 12, background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={20} color="var(--success)" />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Confirmed Pending</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#059669' }}>{confirmedCount}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: 16, borderRadius: 12, background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={20} color="var(--text-secondary)" />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Completed Consultations</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)' }}>{completedCount}</div>
          </div>
        </div>
      </div>

      {/* Consultations List Section */}
      <div className="glass-panel" style={{
        padding: 22,
        borderRadius: 16,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '1 1 min(100%, 260px)', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 0 }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="text"
                placeholder="Search patient name, phone, or symptom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
                style={{ paddingLeft: 36, width: '100%' }}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
              style={{ flex: '0 1 150px', minWidth: 120 }}
            >
              <option value="ALL">All Statuses</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Showing {filteredAppointments.length} patients scheduled
          </span>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            <RefreshCw size={20} className="spin" style={{ margin: '0 auto 8px', display: 'block' }} />
            Loading scheduled patient consultations...
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--bg-muted)', borderRadius: 12 }}>
            <AlertCircle size={24} style={{ margin: '0 auto 8px', display: 'block', color: 'var(--text-dim)' }} />
            No patient appointments match the selected criteria for this physician.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredAppointments.map(apt => (
              <div
                key={apt.id}
                style={{
                  padding: 16,
                  borderRadius: 12,
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-xs)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 14
                }}
              >
                {/* Left: Patient Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 240 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>
                      {apt.patientName}
                    </span>
                    <span className={`badge ${
                      apt.status === 'CONFIRMED' ? 'badge-emerald' :
                      apt.status === 'COMPLETED' ? 'badge-blue' :
                      'badge-rose'
                    }`}>
                      {apt.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12.5, color: 'var(--text-muted)' }}>
                    {apt.patientPhone && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Phone size={12} />
                        {apt.patientPhone}
                      </span>
                    )}
                    {apt.patientEmail && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Mail size={12} />
                        {apt.patientEmail}
                      </span>
                    )}
                    <span>Ref: <code>{apt.bookingReference}</code></span>
                  </div>

                  {apt.symptoms && (
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
                      <strong>Symptoms / Concern:</strong> {apt.symptoms}
                    </div>
                  )}
                </div>

                {/* Center: Appointment Slot */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 160 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={14} color="#0284c7" />
                    <span>{apt.appointmentDate}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={13} />
                    <span>{apt.timeSlot || 'Morning Session'}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>
                    Fee: ₹{apt.consultationFee || 600}
                  </div>
                </div>

                {/* Right: Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  {apt.status === 'CONFIRMED' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(apt.id, 'COMPLETED')}
                        disabled={updatingId === apt.id}
                        className="btn btn-sm"
                        style={{
                          backgroundColor: 'var(--success-light)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          color: 'var(--success)',
                          borderRadius: 8,
                          fontSize: 12.5
                        }}
                      >
                        <CheckCircle2 size={14} />
                        <span>Mark Completed</span>
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(apt.id, 'CANCELLED')}
                        disabled={updatingId === apt.id}
                        className="btn btn-sm"
                        style={{
                          backgroundColor: 'var(--danger-light)',
                          border: '1px solid rgba(244, 63, 94, 0.3)',
                          color: 'var(--danger)',
                          borderRadius: 8,
                          fontSize: 12.5
                        }}
                      >
                        <XCircle size={14} />
                        <span>Cancel</span>
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => generateAppointmentPdf(apt)}
                    className="btn btn-secondary btn-sm"
                    style={{ borderRadius: 8, fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 6 }}
                    title="Download Official A4 OPD Pass"
                  >
                    <Download size={13} />
                    <span>Download Slip</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
