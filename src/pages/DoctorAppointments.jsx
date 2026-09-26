import React, { useState, useEffect } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  CalendarCheck,
  Clock,
  MapPin,
  Building2,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  Stethoscope,
  HeartPulse,
  Award,
  Activity,
  Copy,
  Check,
  Printer,
  RefreshCw,
  Info,
  CalendarDays,
  ShieldCheck,
  Plus,
  Download,
  ChevronDown,
  ChevronUp,
  Eye,
  ArrowUpDown
} from 'lucide-react';
import { generateAppointmentPdf } from '../utils/pdfGenerator';

export const DoctorAppointments = ({ onSelectPatientCase }) => {
  const { user } = useAuth();

  // Navigation tab inside appointments page: 'directory' or 'my-appointments'
  const [viewMode, setViewMode] = useState('directory');

  // Doctors & Filters state
  const [doctors, setDoctors] = useState([]);
  const [cities, setCities] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCity, setSelectedCity] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [visibleCount, setVisibleCount] = useState(6);

  // Booking Modal State
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    patientName: user?.fullName || '',
    patientPhone: '',
    patientEmail: user?.email || '',
    patientAge: '',
    patientGender: 'Male',
    appointmentDate: '',
    timeSlot: '10:00 AM',
    symptoms: '',
    consultationType: 'In-Person Clinic Visit'
  });

  // My Appointments State
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [appointmentSearch, setAppointmentSearch] = useState('');
  const [cancelModalItem, setCancelModalItem] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  // Time slot options
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  // Minimum date allowed is today
  const todayStr = new Date().toISOString().split('T')[0];

  // Fetch doctors and filter options
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (selectedCity) params.city = selectedCity;
      if (selectedHospital) params.hospital = selectedHospital;
      if (selectedSpecialty) params.specialty = selectedSpecialty;
      if (searchQuery.trim()) params.q = searchQuery.trim();

      const [docsRes, citiesRes, hospsRes, specsRes] = await Promise.all([
        API.get('/api/doctors', { params }),
        API.get('/api/doctors/cities'),
        API.get('/api/doctors/hospitals'),
        API.get('/api/doctors/specialties')
      ]);

      setDoctors(docsRes.data);
      setCities(citiesRes.data);
      setHospitals(hospsRes.data);
      setSpecialties(specsRes.data);
    } catch (err) {
      console.error('Failed to load doctors list:', err);
      setError('Unable to load doctors directory. Please ensure the backend server is active.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user / all appointments
  const fetchAppointments = async () => {
    try {
      setLoadingAppointments(true);
      const res = await API.get('/api/appointments');
      setAppointments(res.data);
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoadingAppointments(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [selectedCity, selectedHospital, selectedSpecialty]);

  useEffect(() => {
    if (viewMode === 'my-appointments') {
      fetchAppointments();
    }
  }, [viewMode]);

  // Reset pagination when any filter or sort order changes
  useEffect(() => {
    setVisibleCount(6);
  }, [selectedCity, selectedHospital, selectedSpecialty, searchQuery, sortBy]);

  // Handle open booking modal
  const handleOpenBooking = (doctor) => {
    setBookingDoctor(doctor);
    setConfirmedBooking(null);
    setBookingError(null);
    setFormData({
      patientName: user?.fullName || '',
      patientPhone: '',
      patientEmail: user?.email || '',
      patientAge: '',
      patientGender: 'Male',
      appointmentDate: todayStr,
      timeSlot: '10:00 AM',
      symptoms: '',
      consultationType: 'In-Person Clinic Visit'
    });
  };

  // Handle book appointment submission
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!formData.patientName || !formData.patientPhone || !formData.appointmentDate) {
      setBookingError('Please fill in patient name, phone number, and appointment date.');
      return;
    }

    try {
      setBookingSubmitting(true);
      setBookingError(null);

      const userDescription = formData.symptoms.trim();
      const payload = {
        doctorId: bookingDoctor.id,
        patientName: formData.patientName.trim(),
        patientPhone: formData.patientPhone.trim(),
        patientEmail: formData.patientEmail.trim() || null,
        patientAge: formData.patientAge ? parseInt(formData.patientAge, 10) : null,
        patientGender: formData.patientGender,
        appointmentDate: formData.appointmentDate,
        timeSlot: formData.timeSlot,
        symptoms: userDescription ? `${formData.consultationType} - ${userDescription}` : `${formData.consultationType} - General Specialist Consultation`,
        reasonForVisit: userDescription || `${formData.consultationType} - General Specialist Consultation`,
        description: userDescription || `${formData.consultationType} - General Specialist Consultation`
      };

      const res = await API.post('/api/appointments', payload);
      setConfirmedBooking({
        ...res.data,
        symptoms: res.data.symptoms || payload.symptoms,
        reasonForVisit: userDescription || res.data.reasonForVisit || payload.symptoms,
        description: userDescription || res.data.description || payload.symptoms
      });
      // Refresh appointments list if cached
      fetchAppointments();
    } catch (err) {
      console.error('Booking submission failed:', err);
      setBookingError(err.response?.data?.message || 'Failed to confirm appointment. Please check inputs and retry.');
    } finally {
      setBookingSubmitting(false);
    }
  };

  // Copy booking reference
  const handleCopyReference = (refCode) => {
    navigator.clipboard.writeText(refCode);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2500);
  };

  // Cancel an appointment
  const handleConfirmCancel = async (aptId) => {
    try {
      setCancellingId(aptId);
      await API.patch(`/api/appointments/${aptId}/cancel`);
      setCancelModalItem(null);
      fetchAppointments();
    } catch (err) {
      console.error('Failed to cancel appointment:', err);
      alert('Could not cancel appointment. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  const handleClearFilters = () => {
    setSelectedCity('');
    setSelectedHospital('');
    setSelectedSpecialty('');
    setSearchQuery('');
    setSortBy('recommended');
    setVisibleCount(6);
  };

  const hasActiveFilters = Boolean(selectedCity || selectedHospital || selectedSpecialty || searchQuery);

  const filteredAppointments = appointments.filter(apt => {
    if (!appointmentSearch.trim()) return true;
    const q = appointmentSearch.toLowerCase();
    return (
      apt.bookingReference?.toLowerCase().includes(q) ||
      apt.doctorName?.toLowerCase().includes(q) ||
      apt.patientName?.toLowerCase().includes(q) ||
      apt.hospital?.toLowerCase().includes(q) ||
      apt.city?.toLowerCase().includes(q)
    );
  });
  const sortedDoctors = [...doctors].sort((a, b) => {
    if (sortBy === 'rating') {
      return (b.rating || 0) - (a.rating || 0);
    }
    if (sortBy === 'experience') {
      return (b.experienceYears || 0) - (a.experienceYears || 0);
    }
    if (sortBy === 'fee-asc') {
      return (a.consultationFee || 0) - (b.consultationFee || 0);
    }
    if (sortBy === 'fee-desc') {
      return (b.consultationFee || 0) - (a.consultationFee || 0);
    }
    if (sortBy === 'name') {
      return (a.name || '').localeCompare(b.name || '');
    }
    // Default 'recommended': highest rating first, then experience
    if (b.rating !== a.rating) return (b.rating || 0) - (a.rating || 0);
    return (b.experienceYears || 0) - (a.experienceYears || 0);
  });

  const displayedDoctors = sortedDoctors.slice(0, visibleCount);

  return (
    <div className="page-container" style={{ paddingBottom: 60 }}>
      {/* Top Header Banner */}
      <section className="clean-card" style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '20px 16px',
        marginBottom: 20,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ maxWidth: 720 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <span className="badge badge-blue" style={{ fontSize: 11, padding: '3px 8px' }}>
                <ShieldCheck size={12} style={{ marginRight: 4 }} />
                VERIFIED SPECIALIST DIRECTORY
              </span>
              <span className="badge badge-emerald" style={{ fontSize: 11, padding: '3px 8px' }}>
                INSTANT OPD CONFIRMATION
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(20px, 3.5vw, 26px)', fontWeight: 800, color: 'var(--text-main)', marginBottom: 8, lineHeight: 1.25 }}>
              Specialist Consultations & Direct Appointment Booking
            </h1>

            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, lineHeight: 1.5, marginBottom: 14 }}>
              Direct clinical appointment scheduling with senior faculty and specialists across <strong>Muzaffarpur</strong>, <strong>Delhi NCR</strong>, <strong>AIIMS Patna</strong>, <strong>IGIMS</strong>, <strong>Safdarjung</strong>, <strong>Medanta</strong>, and <strong>Khan Healthcare</strong>.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', fontSize: 12.5, color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Building2 size={15} color="#0284c7" />
                <span>3 Medical Hubs • 10+ Hospitals</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Stethoscope size={15} color="#059669" />
                <span>41 Verified Specialist Doctors</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={15} color="#d97706" />
                <span>Confirmed OPD Slips with PDF Download</span>
              </div>
            </div>
          </div>

          {/* View Toggle: Directory vs My Appointments */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-muted)',
            padding: 4,
            borderRadius: 10,
            border: '1px solid var(--border)',
            gap: 4,
            width: '100%',
            maxWidth: 380
          }}>
            <button
              onClick={() => setViewMode('directory')}
              className={`btn btn-sm ${viewMode === 'directory' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1, borderRadius: 8, padding: '8px 10px', fontSize: 12.5, justifyContent: 'center' }}
            >
              <Stethoscope size={14} />
              <span>Browse Doctors</span>
              <span style={{
                background: viewMode === 'directory' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
                padding: '1px 6px',
                borderRadius: 10,
                fontSize: 11
              }}>
                {doctors.length}
              </span>
            </button>

            <button
              onClick={() => setViewMode('my-appointments')}
              className={`btn btn-sm ${viewMode === 'my-appointments' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1, borderRadius: 8, padding: '8px 10px', fontSize: 12.5, justifyContent: 'center' }}
            >
              <CalendarCheck size={14} />
              <span>My Consultations</span>
              {appointments.length > 0 && (
                <span style={{
                  background: viewMode === 'my-appointments' ? 'rgba(255,255,255,0.25)' : '#06b6d4',
                  color: viewMode === 'my-appointments' ? 'white' : '#020617',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: 10,
                  fontSize: 11
                }}>
                  {appointments.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* VIEW MODE 1: DIRECTORY & SEARCH */}
      {viewMode === 'directory' && (
        <>
          {/* Smart Search & Filter Controls */}
          <section style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: 16,
            marginBottom: 20
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Row 1: Search Bar & Quick Region Pills */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Search Bar */}
                <div style={{
                  flex: '1 1 280px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12 }} />
                  <input
                    type="text"
                    placeholder="Search doctor by name, specialty, hospital, or city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchDoctors()}
                    style={{
                      width: '100%',
                      padding: '9px 12px 9px 36px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 10,
                      color: 'var(--text-main)',
                      fontSize: 13
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => { setSearchQuery(''); fetchDoctors(); }}
                      style={{ position: 'absolute', right: 10, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* City Filter Pills */}
                <div className="pill-scroll-bar">
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', marginRight: 4, fontWeight: 600, flexShrink: 0 }}>Region:</span>
                  <button
                    onClick={() => setSelectedCity('')}
                    className={`btn btn-sm ${selectedCity === '' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ borderRadius: 20, padding: '5px 12px', fontSize: 12, whiteSpace: 'nowrap' }}
                  >
                    All Locations
                  </button>
                  <button
                    onClick={() => setSelectedCity('Muzaffarpur')}
                    className={`btn btn-sm ${selectedCity === 'Muzaffarpur' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ borderRadius: 20, padding: '5px 12px', fontSize: 12, whiteSpace: 'nowrap' }}
                  >
                    Muzaffarpur (10)
                  </button>
                  <button
                    onClick={() => setSelectedCity('Delhi')}
                    className={`btn btn-sm ${selectedCity === 'Delhi' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ borderRadius: 20, padding: '5px 12px', fontSize: 12, whiteSpace: 'nowrap' }}
                  >
                    Delhi NCR (10)
                  </button>
                  <button
                    onClick={() => setSelectedCity('Patna')}
                    className={`btn btn-sm ${selectedCity === 'Patna' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ borderRadius: 20, padding: '5px 12px', fontSize: 12, whiteSpace: 'nowrap' }}
                  >
                    Patna (21)
                  </button>
                </div>
              </div>

              {/* Row 2: Secondary Dropdowns (Hospital, Specialty, Clear) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 10,
                alignItems: 'center',
                paddingTop: 8,
                borderTop: '1px solid var(--border-subtle)'
              }}>
                {/* Hospital Dropdown */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 700 }}>
                    HOSPITAL / MEDICAL CENTER
                  </label>
                  <select
                    value={selectedHospital}
                    onChange={(e) => setSelectedHospital(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      color: 'var(--text-main)',
                      fontSize: 12.5
                    }}
                  >
                    <option value="">All Medical Centers & Clinics</option>
                    {hospitals.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                {/* Specialty Dropdown */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 700 }}>
                    SPECIALTY / DEPARTMENT
                  </label>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      color: 'var(--text-main)',
                      fontSize: 12.5
                    }}
                  >
                    <option value="">All Specialties</option>
                    {specialties.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Sort By Dropdown */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 700 }}>
                    SORT SPECIALISTS
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      color: 'var(--text-main)',
                      fontSize: 12.5,
                      fontWeight: 600
                    }}
                  >
                    <option value="recommended">Recommended (Rating & Seniority)</option>
                    <option value="rating">Top Rated First (Highest Rating)</option>
                    <option value="experience">Most Experienced (Senior Faculty)</option>
                    <option value="fee-asc">Consultation Fee: Low to High</option>
                    <option value="fee-desc">Consultation Fee: High to Low</option>
                    <option value="name">Doctor Name (A to Z)</option>
                  </select>
                </div>

                {/* Clear & Search Actions */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: '100%', paddingTop: 18 }}>
                  <button
                    onClick={fetchDoctors}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, padding: '8px 10px', borderRadius: 8, fontSize: 12 }}
                  >
                    <RefreshCw size={13} />
                    <span>Apply</span>
                  </button>

                  {hasActiveFilters && (
                    <button
                      onClick={handleClearFilters}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '8px 10px', borderRadius: 8, color: '#f43f5e', fontSize: 12 }}
                      title="Reset all filters"
                    >
                      <X size={13} />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Doctors Grid Listing */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <div className="live-pulse-indicator" style={{ width: 14, height: 14, margin: '0 auto 12px' }} />
              <p style={{ fontSize: 14 }}>Retrieving verified medical specialists directory...</p>
            </div>
          ) : error ? (
            <div style={{
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: 12,
              padding: 20,
              color: '#f43f5e',
              textAlign: 'center'
            }}>
              <AlertCircle size={24} style={{ margin: '0 auto 8px' }} />
              <p>{error}</p>
            </div>
          ) : doctors.length === 0 ? (
            <div style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: '40px 20px',
              textAlign: 'center'
            }}>
              <Stethoscope size={36} color="var(--text-dim)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: 16, color: '#f8fafc', marginBottom: 6 }}>No specialist doctors found matching your criteria</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
                Try adjusting the city filter, hospital selection, or search keywords.
              </p>
              <button onClick={handleClearFilters} className="btn btn-secondary btn-sm" style={{ borderRadius: 8 }}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              {/* Active Results Summary & Progressive Count */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 10,
                marginBottom: 16,
                padding: '8px 14px',
                borderRadius: 10,
                backgroundColor: 'var(--bg-muted)',
                border: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <Stethoscope size={15} color="var(--accent-blue)" />
                  <span>
                    Showing <strong>{Math.min(visibleCount, sortedDoctors.length)}</strong> of <strong>{sortedDoctors.length}</strong> verified specialists
                    {selectedCity && <> in <strong>{selectedCity}</strong></>}
                  </span>
                </div>

                {visibleCount < sortedDoctors.length ? (
                  <button
                    onClick={() => setVisibleCount(sortedDoctors.length)}
                    style={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: 'var(--accent-blue)',
                      cursor: 'pointer',
                      padding: 0,
                      border: 'none',
                      background: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <span>View All ({sortedDoctors.length})</span>
                    <ArrowRight size={13} />
                  </button>
                ) : sortedDoctors.length > 6 ? (
                  <button
                    onClick={() => {
                      setVisibleCount(6);
                      window.scrollTo({ top: 380, behavior: 'smooth' });
                    }}
                    style={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: 0,
                      border: 'none',
                      background: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <ChevronUp size={13} />
                    <span>Show Less</span>
                  </button>
                ) : null}
              </div>

              <div className="doctors-grid">
                {displayedDoctors.map(doctor => (
                <article
                  key={doctor.id}
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border)',
                    borderRadius: 14,
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                  className="doctor-card-hover"
                >
                  <div>
                    {/* Top Row: Specialty Badge + City Pill */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 8 }}>
                      <span className="badge badge-cyan" style={{ fontSize: 10.5, padding: '2px 8px', maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {doctor.specialty}
                      </span>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 10,
                        background: doctor.city === 'Muzaffarpur' ? 'var(--success-light)' : doctor.city === 'Delhi' ? 'var(--accent-blue-light)' : 'rgba(124, 58, 237, 0.15)',
                        color: doctor.city === 'Muzaffarpur' ? 'var(--success)' : doctor.city === 'Delhi' ? 'var(--accent-blue)' : '#a78bfa'
                      }}>
                        {doctor.city}
                      </span>
                    </div>

                    {/* Doctor Header & Designation */}
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, #0f2942 0%, #2563eb 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: 16,
                        flexShrink: 0
                      }}>
                        {doctor.name.replace(/^(Dr\.|Prof\.\s*\(Dr\.\))\s*/i, '').charAt(0)}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3, margin: 0 }}>
                            {doctor.name}
                          </h2>
                          <ShieldCheck size={15} color="#059669" title="MedPlus Verified Specialist" style={{ flexShrink: 0 }} />
                        </div>
                        {doctor.designation && (
                          <p style={{ fontSize: 11.5, color: '#0284c7', fontWeight: 600, marginTop: 2 }}>
                            {doctor.designation}
                          </p>
                        )}
                        <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>
                          {doctor.qualifications || 'Certified Clinical Specialist'}
                        </p>
                      </div>
                    </div>

                    {/* Hospital & Address */}
                    <div style={{
                      background: 'var(--bg-muted)',
                      border: '1px solid var(--border)',
                      borderRadius: 10,
                      padding: '10px 12px',
                      marginBottom: 12
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <Building2 size={13} color="#0284c7" style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {doctor.hospital}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                        <MapPin size={13} color="var(--text-dim)" style={{ flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                          {doctor.address}
                        </span>
                      </div>
                    </div>

                    {/* Schedule & Consultation Fee */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, marginBottom: 10, color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Clock size={13} color="#d97706" />
                        <span>{doctor.availableDays || 'Mon - Sat'} • {doctor.availableTimeSlots || 'OPD Hours'}</span>
                      </div>
                      <div style={{ fontWeight: 700, color: '#059669', fontSize: 13.5 }}>
                        ₹{doctor.consultationFee || 600}
                      </div>
                    </div>

                    {/* Institutional Notes / Disclaimers (e.g. Khan Healthcare) */}
                    {doctor.institutionalNotes && (
                      <div style={{
                        background: 'rgba(234, 179, 8, 0.08)',
                        border: '1px solid rgba(234, 179, 8, 0.25)',
                        borderRadius: 8,
                        padding: '6px 10px',
                        fontSize: 10.5,
                        color: '#fde047',
                        lineHeight: 1.35,
                        marginBottom: 12,
                        display: 'flex',
                        gap: 6
                      }}>
                        <Info size={13} style={{ flexShrink: 0, marginTop: 1 }} />
                        <span>{doctor.institutionalNotes}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Action Buttons */}
                  <div style={{ paddingTop: 8, borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => handleOpenBooking(doctor)}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1, padding: '8px 12px', fontSize: 12, borderRadius: 8, justifyContent: 'center' }}
                    >
                      <Calendar size={13} />
                      <span>Book Consultation</span>
                    </button>

                    <a
                      href={`tel:${doctor.contactPhone || '+919800000000'}`}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '8px 10px', borderRadius: 8, color: '#94a3b8' }}
                      title="Direct Clinic Reception Line"
                    >
                      <Phone size={13} />
                    </a>
                  </div>
                </article>
              ))}
              </div>

              {/* Progressive Loading Controls: Show More / View All / Show Less */}
              {sortedDoctors.length > 6 && (
                <div style={{
                  marginTop: 28,
                  padding: '24px 20px',
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 16,
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ width: '100%', maxWidth: 360, textAlign: 'center' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                      marginBottom: 8
                    }}>
                      <span>Showing <strong>{Math.min(visibleCount, sortedDoctors.length)}</strong> of <strong>{sortedDoctors.length}</strong> doctors</span>
                      <span>{Math.round((Math.min(visibleCount, sortedDoctors.length) / sortedDoctors.length) * 100)}%</span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: 6,
                      backgroundColor: 'var(--bg-muted)',
                      borderRadius: 8,
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${(Math.min(visibleCount, sortedDoctors.length) / sortedDoctors.length) * 100}%`,
                        height: '100%',
                        backgroundColor: 'var(--accent-blue)',
                        borderRadius: 8,
                        transition: 'width 0.35s ease'
                      }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {visibleCount < sortedDoctors.length ? (
                      <>
                        <button
                          onClick={() => setVisibleCount(prev => Math.min(prev + 6, sortedDoctors.length))}
                          className="btn btn-primary"
                          style={{ borderRadius: 10, padding: '10px 22px', fontSize: 13.5, display: 'inline-flex', alignItems: 'center', gap: 8 }}
                        >
                          <ChevronDown size={16} />
                          <span>Show More ({Math.min(6, sortedDoctors.length - visibleCount)} remaining)</span>
                        </button>

                        <button
                          onClick={() => setVisibleCount(sortedDoctors.length)}
                          className="btn btn-secondary"
                          style={{ borderRadius: 10, padding: '10px 20px', fontSize: 13.5, display: 'inline-flex', alignItems: 'center', gap: 8 }}
                        >
                          <Eye size={15} />
                          <span>View All ({sortedDoctors.length})</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setVisibleCount(6);
                          window.scrollTo({ top: 380, behavior: 'smooth' });
                        }}
                        className="btn btn-secondary"
                        style={{ borderRadius: 10, padding: '10px 22px', fontSize: 13.5, display: 'inline-flex', alignItems: 'center', gap: 8 }}
                      >
                        <ChevronUp size={16} />
                        <span>Show Less (Collapse to 6)</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* VIEW MODE 2: MY APPOINTMENTS / CONSULTATION LEDGER */}
      {viewMode === 'my-appointments' && (
        <section>
          {/* Controls Bar */}
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: 16,
            marginBottom: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12
          }}>
            <div style={{ position: 'relative', flex: '1 1 240px' }}>
              <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: 10, top: 10 }} />
              <input
                type="text"
                placeholder="Search by reference code (MED-APT-...), doctor, or patient..."
                value={appointmentSearch}
                onChange={(e) => setAppointmentSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 32px',
                  background: 'rgba(2, 6, 23, 0.6)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  color: 'white',
                  fontSize: 12.5
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={fetchAppointments}
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: 8, fontSize: 12 }}
              >
                <RefreshCw size={13} />
                <span>Refresh</span>
              </button>

              <button
                onClick={() => setViewMode('directory')}
                className="btn btn-primary btn-sm"
                style={{ borderRadius: 8, fontSize: 12 }}
              >
                <Plus size={13} />
                <span>Book New</span>
              </button>
            </div>
          </div>

          {/* Appointments Table / Cards */}
          {loadingAppointments ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
              <div className="live-pulse-indicator" style={{ width: 14, height: 14, margin: '0 auto 10px' }} />
              <p>Fetching scheduled consultations...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: '40px 20px',
              textAlign: 'center'
            }}>
              <CalendarCheck size={38} color="var(--text-dim)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: 16, color: '#f8fafc', marginBottom: 6 }}>No scheduled appointments found</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
                You have not booked any specialist appointments yet.
              </p>
              <button onClick={() => setViewMode('directory')} className="btn btn-primary btn-sm" style={{ borderRadius: 8 }}>
                Explore Specialist Directory
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredAppointments.map(apt => (
                <div
                  key={apt.id}
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border)',
                    borderRadius: 14,
                    padding: 18,
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 16
                  }}
                >
                  <div style={{ flex: '1 1 min(100%, 280px)', minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                      <span style={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: 12,
                        background: 'rgba(6, 182, 212, 0.15)',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                        color: '#67e8f9',
                        padding: '2px 8px',
                        borderRadius: 6
                      }}>
                        {apt.bookingReference}
                      </span>

                      <span className={`badge ${
                        apt.status === 'CONFIRMED' ? 'badge-emerald' :
                        apt.status === 'CANCELLED' ? 'badge-rose' : 'badge-cyan'
                      }`} style={{ fontSize: 10.5, padding: '2px 8px' }}>
                        {apt.status}
                      </span>

                      <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>
                        Booked: {apt.formattedBookingTime}
                      </span>
                    </div>

                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginBottom: 4 }}>
                      {apt.doctorName}
                    </h3>

                    <p style={{ fontSize: 12, color: '#38bdf8', marginBottom: 6 }}>
                      {apt.doctorSpecialty} • {apt.hospital} ({apt.city})
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: '#cbd5e1', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Calendar size={13} color="#06b6d4" />
                        <span>Date: <strong>{apt.appointmentDate}</strong></span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Clock size={13} color="#fbbf24" />
                        <span>Slot: <strong>{apt.timeSlot}</strong></span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <User size={13} color="#10b981" />
                        <span>Patient: <strong>{apt.patientName}</strong> ({apt.patientPhone})</span>
                      </div>
                    </div>

                    {(apt.symptoms || apt.reasonForVisit || apt.description) && (
                      <p style={{ fontSize: 11.5, color: '#93c5fd', marginTop: 8, fontStyle: 'italic', background: 'rgba(37, 99, 235, 0.1)', padding: '5px 9px', borderRadius: 6, borderLeft: '2px solid #38bdf8' }}>
                        <strong>Chief Complaint:</strong> "{apt.symptoms || apt.reasonForVisit || apt.description}"
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => generateAppointmentPdf(apt)}
                      className="btn btn-primary btn-sm"
                      style={{ borderRadius: 8, fontSize: 11.5, padding: '6px 10px' }}
                      title="Download Official PDF Slip"
                    >
                      <Download size={13} />
                      <span>PDF Pass</span>
                    </button>

                    <button
                      onClick={() => handleCopyReference(apt.bookingReference)}
                      className="btn btn-secondary btn-sm"
                      style={{ borderRadius: 8, fontSize: 11.5, padding: '6px 10px' }}
                      title="Copy Reference Code"
                    >
                      {copiedRef ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                      <span>{copiedRef ? 'Copied' : 'Copy Ref'}</span>
                    </button>

                    {apt.status !== 'CANCELLED' && (
                      <button
                        onClick={() => setCancelModalItem(apt)}
                        className="btn btn-secondary btn-sm"
                        style={{ borderRadius: 8, fontSize: 11.5, padding: '6px 10px', color: '#f43f5e', borderColor: 'rgba(244, 63, 94, 0.3)' }}
                      >
                        <X size={13} />
                        <span>Cancel Slot</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* APPOINTMENT BOOKING MODAL */}
      {bookingDoctor && (
        <div 
          className="modal-overlay"
          onClick={() => !bookingSubmitting && setBookingDoctor(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: 12
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 16,
              width: '100%',
              maxWidth: confirmedBooking ? 520 : 580,
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '14px clamp(12px, 3.5vw, 20px)',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--bg-muted)'
            }}>
              <div>
                <span className="badge badge-blue" style={{ fontSize: 10, padding: '2px 6px', marginBottom: 4 }}>
                  APPOINTMENT RESERVATION
                </span>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                  {confirmedBooking ? 'Consultation Confirmed' : `Book with ${bookingDoctor.name}`}
                </h3>
              </div>
              <button
                onClick={() => setBookingDoctor(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 'clamp(12px, 3.5vw, 20px)' }}>
              {/* SUCCESS CONFIRMATION PASS VIEW */}
              {confirmedBooking ? (
                <div>
                  <div style={{
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    borderRadius: 14,
                    padding: 20,
                    textAlign: 'center',
                    marginBottom: 16
                  }}>
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'var(--success-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px'
                    }}>
                      <CheckCircle2 size={28} color="var(--success)" />
                    </div>

                    <h4 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>
                      Appointment Slip Confirmed!
                    </h4>
                    <p style={{ fontSize: 13, color: '#166534', marginBottom: 14 }}>
                      {confirmedBooking.confirmationMessage}
                    </p>

                    {/* Booking Reference Box */}
                    <div style={{
                      background: 'var(--bg-surface)',
                      border: '1px dashed #16a34a',
                      borderRadius: 10,
                      padding: '12px 16px',
                      display: 'inline-flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <span style={{ fontSize: 10.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Digital Booking Reference
                      </span>
                      <span style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 800, color: '#15803d', letterSpacing: 1 }}>
                        {confirmedBooking.bookingReference}
                      </span>
                      <button
                        onClick={() => handleCopyReference(confirmedBooking.bookingReference)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#0284c7',
                          fontSize: 11.5,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          marginTop: 4
                        }}
                      >
                        {copiedRef ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                        <span>{copiedRef ? 'Copied to clipboard' : 'Copy code'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Summary Details */}
                  <div style={{
                    background: 'var(--bg-muted)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    padding: 14,
                    fontSize: 12.5,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    marginBottom: 16
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Doctor:</span>
                      <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{confirmedBooking.doctorName}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Specialty:</span>
                      <span style={{ color: '#0284c7', fontWeight: 600 }}>{confirmedBooking.doctorSpecialty}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Medical Center:</span>
                      <span style={{ color: 'var(--text-main)' }}>{confirmedBooking.hospital} ({confirmedBooking.city})</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Scheduled Date & Time:</span>
                      <span style={{ fontWeight: 700, color: '#0f2942' }}>{confirmedBooking.appointmentDate} at {confirmedBooking.timeSlot}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Patient Name:</span>
                      <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{confirmedBooking.patientName}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Contact:</span>
                      <span style={{ color: 'var(--text-main)' }}>{confirmedBooking.patientPhone}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Consultation Fee:</span>
                      <span style={{ fontWeight: 700, color: '#059669' }}>₹{confirmedBooking.consultationFee} (Pay at Clinic Desk)</span>
                    </div>

                    {(confirmedBooking.symptoms || confirmedBooking.reasonForVisit || confirmedBooking.description) && (
                      <div style={{
                        marginTop: 4,
                        paddingTop: 8,
                        borderTop: '1px dashed var(--border)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3
                      }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: 11.5, fontWeight: 600 }}>CHIEF COMPLAINT / SYMPTOMS:</span>
                        <span style={{
                          color: 'var(--text-main)',
                          fontSize: 12,
                          background: 'rgba(37, 99, 235, 0.08)',
                          padding: '6px 10px',
                          borderRadius: 6,
                          borderLeft: '3px solid #2563eb'
                        }}>
                          "{confirmedBooking.symptoms || confirmedBooking.reasonForVisit || confirmedBooking.description}"
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button
                      onClick={() => generateAppointmentPdf(confirmedBooking)}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1, minWidth: 140, padding: '10px 14px', borderRadius: 8, fontSize: 12.5 }}
                      title="Download Official PDF Consultation Slip"
                    >
                      <Download size={14} />
                      <span>Download PDF Pass</span>
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1, minWidth: 100, padding: '10px 14px', borderRadius: 8, fontSize: 12.5 }}
                    >
                      <Printer size={14} />
                      <span>Print</span>
                    </button>

                    <button
                      onClick={() => {
                        setBookingDoctor(null);
                        setViewMode('my-appointments');
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1, minWidth: 130, padding: '10px 14px', borderRadius: 8, fontSize: 12.5 }}
                    >
                      <span>My Consultations</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                /* BOOKING FORM VIEW */
                <form onSubmit={handleSubmitBooking}>
                  {/* Doctor Snapshot banner */}
                  <div style={{
                    background: 'var(--bg-muted)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                  }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      background: 'linear-gradient(135deg, #0f2942 0%, #2563eb 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      color: 'white',
                      flexShrink: 0
                    }}>
                      {bookingDoctor.name.charAt(bookingDoctor.name.indexOf(' ') + 1 || 0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                        {bookingDoctor.name}
                      </h4>
                      <p style={{ fontSize: 12, color: '#0284c7', margin: '2px 0 0', fontWeight: 600 }}>
                        {bookingDoctor.specialty} • {bookingDoctor.hospital}
                      </p>
                      <p style={{ fontSize: 11.5, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                        Fee: ₹{bookingDoctor.consultationFee || 600} • OPD: {bookingDoctor.availableTimeSlots || 'Regular Hours'}
                      </p>
                    </div>
                  </div>

                  {bookingError && (
                    <div style={{
                      background: 'rgba(244, 63, 94, 0.1)',
                      border: '1px solid rgba(244, 63, 94, 0.3)',
                      borderRadius: 8,
                      padding: '8px 12px',
                      color: '#f43f5e',
                      fontSize: 12,
                      marginBottom: 14,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}>
                      <AlertCircle size={14} style={{ flexShrink: 0 }} />
                      <span>{bookingError}</span>
                    </div>
                  )}

                  {/* Consultation Mode */}
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 11.5, color: 'var(--text-dim)', marginBottom: 6, fontWeight: 600 }}>
                      CONSULTATION FORMAT
                    </label>
                    <div className="modal-form-grid-2" style={{ gap: 8 }}>
                      <button
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, consultationType: 'In-Person Clinic Visit' }))}
                        className={`btn btn-sm ${formData.consultationType === 'In-Person Clinic Visit' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '8px 10px', borderRadius: 8, fontSize: 12, justifyContent: 'center' }}
                      >
                        <Building2 size={13} />
                        <span>In-Person OPD Visit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, consultationType: 'Telehealth Video Consultation' }))}
                        className={`btn btn-sm ${formData.consultationType === 'Telehealth Video Consultation' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '8px 10px', borderRadius: 8, fontSize: 12, justifyContent: 'center' }}
                      >
                        <Activity size={13} />
                        <span>Telehealth Review</span>
                      </button>
                    </div>
                  </div>

                  {/* Date & Time Slot Grid */}
                  <div className="modal-form-grid-2">
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: 'var(--text-main)', marginBottom: 4, fontWeight: 700 }}>
                        APPOINTMENT DATE *
                      </label>
                      <input
                        type="date"
                        min={todayStr}
                        required
                        value={formData.appointmentDate}
                        onChange={(e) => setFormData(p => ({ ...p, appointmentDate: e.target.value }))}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: 'var(--text-main)', marginBottom: 4, fontWeight: 700 }}>
                        TIME SLOT *
                      </label>
                      <select
                        value={formData.timeSlot}
                        onChange={(e) => setFormData(p => ({ ...p, timeSlot: e.target.value }))}
                        className="input-field"
                      >
                        {timeSlots.map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Patient Name & Phone */}
                  <div className="modal-form-grid-2">
                    <div>
                      <label style={{ display: 'block', fontSize: 11.5, color: 'var(--text-dim)', marginBottom: 4, fontWeight: 600 }}>
                        PATIENT FULL NAME *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rameshwar Sharma"
                        value={formData.patientName}
                        onChange={(e) => setFormData(p => ({ ...p, patientName: e.target.value }))}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: 'var(--text-main)', marginBottom: 4, fontWeight: 700 }}>
                        MOBILE PHONE NUMBER *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.patientPhone}
                        onChange={(e) => setFormData(p => ({ ...p, patientPhone: e.target.value }))}
                        className="input-field"
                      />
                    </div>
                  </div>

                  {/* Email & Age/Gender */}
                  <div className="modal-form-grid-3">
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: 'var(--text-main)', marginBottom: 4, fontWeight: 700 }}>
                        PATIENT EMAIL
                      </label>
                      <input
                        type="email"
                        placeholder="patient@example.com"
                        value={formData.patientEmail}
                        onChange={(e) => setFormData(p => ({ ...p, patientEmail: e.target.value }))}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: 'var(--text-main)', marginBottom: 4, fontWeight: 700 }}>
                        AGE
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        placeholder="Age"
                        value={formData.patientAge}
                        onChange={(e) => setFormData(p => ({ ...p, patientAge: e.target.value }))}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: 'var(--text-main)', marginBottom: 4, fontWeight: 700 }}>
                        GENDER
                      </label>
                      <select
                        value={formData.patientGender}
                        onChange={(e) => setFormData(p => ({ ...p, patientGender: e.target.value }))}
                        className="input-field"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Symptoms & Medical History */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-main)', marginBottom: 4, fontWeight: 700 }}>
                      CHIEF COMPLAINT / PRIMARY SYMPTOMS
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Briefly describe primary health issue, prior diagnoses, medications or reason for specialist visit..."
                      value={formData.symptoms}
                      onChange={(e) => setFormData(p => ({ ...p, symptoms: e.target.value }))}
                      className="input-field"
                    />
                  </div>

                  {/* Submit Actions */}
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
                    <button
                      type="button"
                      onClick={() => setBookingDoctor(null)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '8px 16px', borderRadius: 8, fontSize: 12.5 }}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={bookingSubmitting}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '8px 18px', borderRadius: 8, fontSize: 12.5 }}
                    >
                      {bookingSubmitting ? (
                        <>
                          <div className="live-pulse-indicator" style={{ width: 8, height: 8 }} />
                          <span>Reserving Slot...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={14} />
                          <span>Confirm Booking</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CANCELLATION CONFIRMATION MODAL */}
      {cancelModalItem && (
        <div
          className="modal-overlay"
          onClick={() => setCancelModalItem(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 110,
            padding: 16
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#090e1a',
              border: '1px solid rgba(244, 63, 94, 0.4)',
              borderRadius: 14,
              padding: 20,
              maxWidth: 440,
              width: '100%',
              textAlign: 'center'
            }}
          >
            <AlertCircle size={32} color="#f43f5e" style={{ margin: '0 auto 10px' }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 8 }}>
              Cancel Consultation?
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 18 }}>
              Are you sure you wish to cancel appointment reference <strong>{cancelModalItem.bookingReference}</strong> with <strong>{cancelModalItem.doctorName}</strong> on {cancelModalItem.appointmentDate}?
            </p>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button
                onClick={() => setCancelModalItem(null)}
                className="btn btn-secondary btn-sm"
                style={{ padding: '8px 16px', borderRadius: 8 }}
              >
                Keep Slot
              </button>

              <button
                onClick={() => handleConfirmCancel(cancelModalItem.id)}
                disabled={cancellingId === cancelModalItem.id}
                className="btn btn-sm"
                style={{
                  background: '#f43f5e',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: 8
                }}
              >
                {cancellingId === cancelModalItem.id ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
