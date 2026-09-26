import React, { useState, useEffect } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Stethoscope, 
  Calendar, 
  Users, 
  Plus, 
  Clock, 
  Award, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MapPin, 
  Search, 
  Filter, 
  RefreshCw,
  X,
  Bed,
  Activity,
  Download,
  Star,
  FileText
} from 'lucide-react';
import { generateAppointmentPdf } from '../utils/pdfGenerator';

export const HospitalPanel = () => {
  const { user } = useAuth();
  const hospitalName = user?.hospital || 'Prasad Hospital';

  const [activeTab, setActiveTab] = useState('doctors'); // doctors, appointments, wards
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Doctor Modal
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [addingDoctor, setAddingDoctor] = useState(false);
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    specialty: 'General Medicine',
    city: 'Muzaffarpur',
    hospital: hospitalName,
    address: 'Hospital Medical Complex',
    designation: 'Consultant Specialist',
    qualifications: 'MBBS, MD',
    experienceYears: 10,
    consultationFee: 700,
    availableDays: 'Mon, Wed, Fri',
    availableTimeSlots: '10:00 AM - 02:00 PM',
    rating: 4.8,
    reviewCount: 25,
    verified: true
  });

  const [doctorSearch, setDoctorSearch] = useState('');
  const [appointmentSearch, setAppointmentSearch] = useState('');

  const fetchHospitalData = async () => {
    setLoading(true);
    try {
      // 1. Fetch doctors for this hospital
      const docRes = await API.get('/api/doctors', { params: { hospital: hospitalName } });
      setDoctors(docRes.data);

      // 2. Fetch appointments for this hospital
      const aptRes = await API.get('/api/appointments', { params: { hospital: hospitalName } });
      setAppointments(aptRes.data);

      // 3. Fetch departments
      const deptRes = await API.get('/api/departments');
      setDepartments(deptRes.data);
    } catch (err) {
      console.error('Failed to load hospital operations data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitalData();
  }, [hospitalName]);

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setAddingDoctor(true);
    try {
      const res = await API.post('/api/doctors', {
        ...doctorForm,
        hospital: hospitalName
      });
      setDoctors(prev => [res.data, ...prev]);
      setShowAddDoctorModal(false);
      setDoctorForm({
        name: '',
        specialty: 'General Medicine',
        city: 'Muzaffarpur',
        hospital: hospitalName,
        address: 'Hospital Medical Complex',
        designation: 'Consultant Specialist',
        qualifications: 'MBBS, MD',
        experienceYears: 10,
        consultationFee: 700,
        availableDays: 'Mon, Wed, Fri',
        availableTimeSlots: '10:00 AM - 02:00 PM',
        rating: 4.8,
        reviewCount: 25,
        verified: true
      });
    } catch (err) {
      console.error('Failed to register doctor', err);
      alert('Failed to register doctor: ' + (err.response?.data?.message || err.message));
    } finally {
      setAddingDoctor(false);
    }
  };

  const filteredDoctors = doctors.filter(d => 
    (d.name && d.name.toLowerCase().includes(doctorSearch.toLowerCase())) ||
    (d.specialty && d.specialty.toLowerCase().includes(doctorSearch.toLowerCase()))
  );

  const filteredAppointments = appointments.filter(a =>
    (a.patientName && a.patientName.toLowerCase().includes(appointmentSearch.toLowerCase())) ||
    (a.doctorName && a.doctorName.toLowerCase().includes(appointmentSearch.toLowerCase())) ||
    (a.bookingReference && a.bookingReference.toLowerCase().includes(appointmentSearch.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', maxWidth: 1200, margin: '0 auto' }}>
      {/* Hospital Banner */}
      <div className="glass-panel" style={{
        padding: '18px 16px',
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
            background: 'linear-gradient(135deg, #0f2942 0%, #0284c7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(15, 41, 66, 0.15)',
            flexShrink: 0
          }}>
            <Building2 size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                {hospitalName}
              </h1>
              <span className="badge badge-blue" style={{ fontSize: 11, padding: '2px 8px' }}>
                HOSPITAL FACILITY PANEL
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>
              View and manage affiliated specialist doctors, track booked patient consultations, and review bed allocations.
            </p>
          </div>
        </div>

        {/* Tab Controls & Add Doctor Button */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`btn btn-sm ${activeTab === 'doctors' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Stethoscope size={14} />
            <span>Our Doctors ({doctors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`btn btn-sm ${activeTab === 'appointments' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Calendar size={14} />
            <span>Consultations ({appointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wards')}
            className={`btn btn-sm ${activeTab === 'wards' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Bed size={14} />
            <span>Wards & Beds</span>
          </button>

          <button
            onClick={() => setShowAddDoctorModal(true)}
            className="btn btn-sm"
            style={{
              borderRadius: 8,
              backgroundColor: 'var(--success-light)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Plus size={14} />
            <span>Add Doctor</span>
          </button>
        </div>
      </div>

      {/* Main Tab 1: Hospital Doctors Directory */}
      {activeTab === 'doctors' && (
        <div className="glass-panel" style={{ padding: 22, borderRadius: 16, background: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: 360 }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="text"
                placeholder="Search hospital doctor by name or specialty..."
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
                className="input-field"
                style={{ paddingLeft: 36 }}
              />
            </div>

            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {filteredDoctors.length} specialist doctors affiliated with {hospitalName}
            </div>
          </div>

          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
              <RefreshCw size={20} className="spin" style={{ margin: '0 auto 8px', display: 'block' }} />
              Loading hospital doctors...
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--bg-muted)', borderRadius: 12 }}>
              No doctors currently listed under this hospital facility. Click <strong>"Add Doctor"</strong> to register new attending physicians.
            </div>
          ) : (
            <div className="doctors-grid">
              {filteredDoctors.map(doc => (
                <div 
                  key={doc.id}
                  style={{
                    padding: 18,
                    borderRadius: 14,
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-xs)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                        {doc.name}
                      </h3>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                        {doc.designation || 'Consultant Specialist'}
                      </p>
                    </div>
                    <span className="badge badge-emerald" style={{ fontSize: 11 }}>
                      Verified
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    <span className="badge badge-blue">{doc.specialty}</span>
                    <span className="badge badge-secondary">{doc.qualifications}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Clock size={13} color="var(--text-dim)" />
                      <span>{doc.availableDays} • {doc.availableTimeSlots}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <MapPin size={13} color="var(--text-dim)" />
                      <span style={{ fontSize: 12 }}>{doc.address || doc.city}</span>
                    </div>
                  </div>

                  <div style={{
                    marginTop: 'auto',
                    paddingTop: 10,
                    borderTop: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: 13
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Consultation Fee: </span>
                      <strong style={{ color: '#059669' }}>₹{doc.consultationFee}</strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#d97706', fontSize: 12, fontWeight: 700 }}>
                      <Star size={13} fill="#d97706" />
                      <span>{doc.rating || 4.8}</span>
                      <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>({doc.reviewCount || 30})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Tab 2: Hospital Consultations */}
      {activeTab === 'appointments' && (
        <div className="glass-panel" style={{ padding: 22, borderRadius: 16, background: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: 360 }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="text"
                placeholder="Search by patient or doctor name..."
                value={appointmentSearch}
                onChange={(e) => setAppointmentSearch(e.target.value)}
                className="input-field"
                style={{ paddingLeft: 36 }}
              />
            </div>

            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Showing {filteredAppointments.length} bookings for {hospitalName}
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="health-table">
              <thead>
                <tr>
                  <th>Booking Ref</th>
                  <th>Patient Name & Phone</th>
                  <th>Assigned Doctor</th>
                  <th>Date & Time Slot</th>
                  <th>Status</th>
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
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{apt.patientPhone || 'No phone provided'}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{apt.doctorName}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{apt.doctorSpecialty}</div>
                    </td>
                    <td>
                      <div>{apt.appointmentDate}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{apt.timeSlot}</div>
                    </td>
                    <td>
                      <span className={`badge ${apt.status === 'CONFIRMED' ? 'badge-emerald' : apt.status === 'COMPLETED' ? 'badge-blue' : 'badge-rose'}`}>
                        {apt.status}
                      </span>
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

      {/* Main Tab 3: Wards & Bed Capacity */}
      {activeTab === 'wards' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {departments.map(dept => (
            <div key={dept.id} className="glass-panel" style={{ padding: 20, borderRadius: 14, background: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{dept.name}</h3>
                <span className="badge badge-blue">{dept.code}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: 12, backgroundColor: 'var(--bg-muted)', borderRadius: 10 }}>
                <div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Total Beds</div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{dept.totalBeds || 40}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Occupied Beds</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#0284c7' }}>{dept.occupiedBeds || 28}</div>
                </div>
              </div>

              <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                Department Head: <strong>{dept.headOfDepartment || 'Chief Medical Officer'}</strong>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Doctor Modal */}
      {showAddDoctorModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 16
        }}>
          <div className="glass-panel" style={{
            maxWidth: 540,
            width: '100%',
            background: 'var(--bg-surface)',
            borderRadius: 16,
            padding: 24,
            boxShadow: 'var(--shadow-lg)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>
                Register Specialist Doctor at {hospitalName}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddDoctorModal(false)}
                className="btn btn-secondary btn-sm"
                style={{ padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddDoctor} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4 }}>Doctor Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Ramesh Kumar"
                  value={doctorForm.name}
                  onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div className="modal-form-grid-2" style={{ gap: 10 }}>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4 }}>Specialty *</label>
                  <input
                    type="text"
                    placeholder="e.g. Cardiology"
                    value={doctorForm.specialty}
                    onChange={(e) => setDoctorForm({ ...doctorForm, specialty: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4 }}>Consultation Fee (₹)</label>
                  <input
                    type="number"
                    value={doctorForm.consultationFee}
                    onChange={(e) => setDoctorForm({ ...doctorForm, consultationFee: Number(e.target.value) })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="modal-form-grid-2" style={{ gap: 10 }}>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4 }}>Qualifications</label>
                  <input
                    type="text"
                    placeholder="e.g. MBBS, MD, DM"
                    value={doctorForm.qualifications}
                    onChange={(e) => setDoctorForm({ ...doctorForm, qualifications: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4 }}>Experience (Years)</label>
                  <input
                    type="number"
                    value={doctorForm.experienceYears}
                    onChange={(e) => setDoctorForm({ ...doctorForm, experienceYears: Number(e.target.value) })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="modal-form-grid-2" style={{ gap: 10 }}>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4 }}>Available Days</label>
                  <input
                    type="text"
                    placeholder="e.g. Mon, Wed, Fri"
                    value={doctorForm.availableDays}
                    onChange={(e) => setDoctorForm({ ...doctorForm, availableDays: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4 }}>OPD Timings</label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 AM - 02:00 PM"
                    value={doctorForm.availableTimeSlots}
                    onChange={(e) => setDoctorForm({ ...doctorForm, availableTimeSlots: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowAddDoctorModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingDoctor}
                  className="btn btn-primary"
                >
                  {addingDoctor ? 'Registering...' : 'Save Doctor to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
