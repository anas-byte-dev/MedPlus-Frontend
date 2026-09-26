import React, { useState, useEffect } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { 
  Stethoscope, 
  Calendar, 
  FileText, 
  Search, 
  MapPin, 
  Building2, 
  Clock, 
  CheckCircle2, 
  Download,
  User, 
  Plus,
  Phone,
  Mail,
  Sparkles,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { DoctorAppointments } from './DoctorAppointments';
import { AiHealthAssistant } from './AiHealthAssistant';
import { generateAppointmentPdf } from '../utils/pdfGenerator';

export const PatientPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('find-doctors'); // find-doctors, my-appointments, ai-assistant
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  const fetchMyAppointments = async () => {
    if (!user) return;
    setLoadingAppointments(true);
    try {
      // Fetch appointments matching patient's email or phone
      const res = await API.get('/api/appointments', {
        params: { email: user.email }
      });
      setAppointments(res.data);
    } catch (err) {
      console.error('Failed to load patient appointments', err);
    } finally {
      setLoadingAppointments(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'my-appointments') {
      fetchMyAppointments();
    }
  }, [activeTab, user]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', maxWidth: 1200, margin: '0 auto' }}>
      {/* Patient Welcome Header */}
      <div className="glass-panel" style={{
        padding: 'clamp(14px, 3.5vw, 24px)',
        borderRadius: 16,
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
            background: 'linear-gradient(135deg, #0f2942 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(15, 41, 66, 0.15)',
            flexShrink: 0
          }}>
            <User size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                Welcome, {user?.fullName || 'Patient'}
              </h1>
              <span className="badge badge-blue" style={{ fontSize: 11, padding: '2px 8px' }}>
                PATIENT PORTAL
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Search certified specialist doctors, manage your booked consultation passes, and chat with AI Health Assistant.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('find-doctors')}
            className={`btn btn-sm ${activeTab === 'find-doctors' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Stethoscope size={14} />
            <span>Find & Book Doctors</span>
          </button>

          <button
            onClick={() => setActiveTab('my-appointments')}
            className={`btn btn-sm ${activeTab === 'my-appointments' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Calendar size={14} />
            <span>My Booked Consultations</span>
            {appointments.length > 0 && (
              <span style={{ background: '#2563eb', color: '#ffffff', borderRadius: 10, padding: '1px 6px', fontSize: 11 }}>
                {appointments.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('ai-assistant')}
            className={`btn btn-sm ${activeTab === 'ai-assistant' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Sparkles size={14} color={activeTab === 'ai-assistant' ? '#ffffff' : '#2563eb'} />
            <span>Dr. MedPlus AI Assistant</span>
          </button>
        </div>
      </div>

      {/* TAB 1: FIND & BOOK SPECIALIST DOCTORS */}
      {activeTab === 'find-doctors' && (
        <div>
          <DoctorAppointments onAppointmentBooked={() => fetchMyAppointments()} />
        </div>
      )}

      {/* TAB 2: MY BOOKED APPOINTMENTS */}
      {activeTab === 'my-appointments' && (
        <div className="glass-panel" style={{
          padding: 24,
          borderRadius: 16,
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: 18
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                My Scheduled Consultations & OPD Passes
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Present your digital or downloaded PDF pass at the hospital reception OPD counter.
              </p>
            </div>

            <button
              onClick={fetchMyAppointments}
              className="btn btn-secondary btn-sm"
              style={{ borderRadius: 8 }}
              title="Refresh my appointments"
            >
              <RefreshCw size={14} className={loadingAppointments ? 'spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>

          {loadingAppointments ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
              <RefreshCw size={22} className="spin" style={{ margin: '0 auto 8px', display: 'block' }} />
              Loading your consultation passes...
            </div>
          ) : appointments.length === 0 ? (
            <div style={{
              padding: 40,
              textAlign: 'center',
              backgroundColor: 'var(--bg-muted)',
              borderRadius: 14,
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12
            }}>
              <Calendar size={32} color="var(--text-dim)" />
              <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-main)' }}>
                No Appointments Booked Yet
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 420, margin: 0 }}>
                You have not booked any specialist doctor consultations. Browse top doctors in Muzaffarpur, Patna, and Delhi to schedule your first visit.
              </p>
              <button
                onClick={() => setActiveTab('find-doctors')}
                className="btn btn-primary btn-sm"
                style={{ borderRadius: 8, marginTop: 4 }}
              >
                Browse Specialist Doctors
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: 16 }}>
              {appointments.map(apt => (
                <div
                  key={apt.id}
                  style={{
                    padding: 18,
                    borderRadius: 14,
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-xs)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14
                  }}
                >
                  {/* Top: Booking Ref & Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#0284c7' }}>
                      Ref: <code>{apt.bookingReference}</code>
                    </span>
                    <span className={`badge ${
                      apt.status === 'CONFIRMED' ? 'badge-emerald' :
                      apt.status === 'COMPLETED' ? 'badge-blue' :
                      'badge-rose'
                    }`}>
                      {apt.status}
                    </span>
                  </div>

                  {/* Doctor Info */}
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                      {apt.doctorName}
                    </h3>
                    <div style={{ fontSize: 12.5, color: '#0284c7', fontWeight: 600, marginTop: 2 }}>
                      {apt.doctorSpecialty}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      {apt.hospital} • {apt.city}
                    </div>
                  </div>

                  {/* Schedule Slot */}
                  <div style={{
                    padding: 10,
                    borderRadius: 8,
                    backgroundColor: 'var(--bg-muted)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    fontSize: 12.5
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--text-main)' }}>
                      <Calendar size={13} color="#2563eb" />
                      <span>Date: {apt.appointmentDate}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
                      <Clock size={13} color="var(--text-dim)" />
                      <span>Session: {apt.timeSlot || 'Morning OPD'}</span>
                    </div>
                    {(apt.symptoms || apt.reasonForVisit || apt.description) && (
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, background: 'rgba(37, 99, 235, 0.06)', padding: '4px 8px', borderRadius: 6, borderLeft: '2px solid #2563eb' }}>
                        Chief Complaint: <em>"{apt.symptoms || apt.reasonForVisit || apt.description}"</em>
                      </div>
                    )}
                  </div>

                  {/* Fee & PDF Download Action */}
                  <div style={{
                    marginTop: 'auto',
                    paddingTop: 10,
                    borderTop: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>OPD Fee: </span>
                      <strong style={{ color: '#059669', fontSize: 13 }}>₹{apt.consultationFee || 600}</strong>
                    </div>

                    <button
                      onClick={() => generateAppointmentPdf(apt)}
                      className="btn btn-primary btn-sm"
                      style={{ borderRadius: 8, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <Download size={13} />
                      <span>Download PDF Pass</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DR. MEDPLUS AI ASSISTANT */}
      {activeTab === 'ai-assistant' && (
        <div>
          <AiHealthAssistant />
        </div>
      )}
    </div>
  );
};
