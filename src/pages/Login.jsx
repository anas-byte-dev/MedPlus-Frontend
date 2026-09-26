import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  HeartPulse, 
  LogIn, 
  UserPlus, 
  Sparkles, 
  Stethoscope, 
  Building2, 
  User, 
  Shield, 
  Phone, 
  Mail, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  RefreshCcw,
  MailCheck,
  Info
} from 'lucide-react';

export const Login = ({ onSuccess }) => {
  const { login, register, resendVerification, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [verificationPending, setVerificationPending] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [resendMsg, setResendMsg] = useState('');
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register State
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState('ROLE_PATIENT');
  const [regHospital, setRegHospital] = useState('');
  const [regSpecialty, setRegSpecialty] = useState('General Medicine');
  const [regLicense, setRegLicense] = useState('');
  const [regCity, setRegCity] = useState('Muzaffarpur');
  const [regAddress, setRegAddress] = useState('');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !password) {
      setError('Please provide both your registered email address and password.');
      return;
    }

    const res = await login(email.trim(), password);
    if (res.success) {
      onSuccess?.();
    } else if (res.needsEmailVerification) {
      setPendingEmail(email.trim());
      setVerificationPending(true);
    } else {
      setError(res.error || 'Account not recognized. If you have not registered yet, please register first using the Register tab.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!regFullName || !regEmail || !regPassword) {
      setError('Please fill in all mandatory fields (Name, Email, and Password).');
      return;
    }
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const payload = {
      fullName: regFullName.trim(),
      email: regEmail.trim(),
      password: regPassword,
      phone: regPhone.trim(),
      role: regRole,
      hospital: (regRole === 'ROLE_DOCTOR' || regRole === 'ROLE_HOSPITAL') ? regHospital.trim() : null,
      departmentName: regRole === 'ROLE_DOCTOR' ? regSpecialty : null,
      medicalLicense: regRole === 'ROLE_DOCTOR' ? regLicense.trim() : (regRole === 'ROLE_HOSPITAL' ? 'HOSP-' + Math.floor(1000 + Math.random() * 9000) : null)
    };

    const res = await register(payload);
    if (res.success) {
      if (res.needsEmailVerification) {
        setPendingEmail(regEmail.trim());
        setEmail(regEmail.trim());
        setPassword('');
        setActiveTab('login');
        setVerificationPending(false);
        setSuccessMsg('Account created successfully! Please verify your email before logging in. Check your inbox for the confirmation link.');
      } else {
        setSuccessMsg('Account registered successfully! Logging you in...');
        setTimeout(() => { onSuccess?.(); }, 800);
      }
    } else {
      setError(res.error || 'Registration failed. This email may already be registered.');
    }
  };

  const handleResendVerification = async () => {
    setResendMsg('');
    const res = await resendVerification(pendingEmail);
    setResendMsg(res.success ? res.message : res.error);
  };

  const handle1ClickDemo = async (demoEmail, demoRoleName) => {
    setError('');
    setSuccessMsg('');
    setEmail(demoEmail);
    setPassword('password123');
    const res = await login(demoEmail, 'password123');
    if (res.success) {
      onSuccess?.();
    } else {
      setError(`Could not log in as ${demoRoleName}: ${res.error}`);
    }
  };

  return (
    <div style={{
      maxWidth: 520,
      margin: '24px auto 48px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      padding: '0 12px'
    }}>

      {/* Email Verification Pending Screen */}
      {verificationPending && (
        <div className="glass-panel" style={{ padding: 36, textAlign: 'center', borderRadius: 18 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', boxShadow: '0 4px 16px rgba(5,150,105,0.25)'
          }}>
            <MailCheck size={30} color="#fff" />
          </div>
          <h2 style={{ color: 'var(--text-main)', marginBottom: 10, fontSize: 22 }}>
            Check Your Inbox
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14.5, lineHeight: 1.6, marginBottom: 8 }}>
            We sent a verification link to:
          </p>
          <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 15, marginBottom: 20 }}>
            {pendingEmail}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13.5, lineHeight: 1.6, marginBottom: 24 }}>
            Click the link in your email to verify your account. Once verified, you can log in below.
          </p>
          {resendMsg && (
            <div style={{
              padding: '10px 16px', borderRadius: 8,
              backgroundColor: 'var(--success-light)', color: 'var(--success)',
              fontSize: 13.5, marginBottom: 16
            }}>{resendMsg}</div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => { setVerificationPending(false); setActiveTab('login'); }}
              style={{ width: '100%' }}
            >
              <LogIn size={16} /> Go to Login
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleResendVerification}
              disabled={loading}
              style={{ width: '100%' }}
            >
              <RefreshCcw size={14} /> Resend Verification Email
            </button>
          </div>
        </div>
      )}

      {/* Main content — hidden when verification pending */}
      {!verificationPending && (<>

      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: 4 }}>
        <div style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: 'linear-gradient(135deg, #0f2942 0%, #2563eb 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px',
          boxShadow: '0 4px 14px rgba(15, 41, 66, 0.15)'
        }}>
          <HeartPulse size={28} color="#ffffff" />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          MedPlus
        </h1>
        <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginTop: 4 }}>
          Specialist Consultations & Hospital Network Authentication
        </p>
      </div>

      {/* Main Auth Card */}
      <div className="glass-panel" style={{
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '24px 24px',
        boxShadow: 'var(--shadow-md)'
      }}>
        {/* Navigation Tabs: Sign In vs Register */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          backgroundColor: 'var(--bg-muted)',
          padding: 4,
          borderRadius: 10,
          marginBottom: 20
        }}>
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setError(''); setSuccessMsg(''); }}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              fontWeight: 700,
              fontSize: 13.5,
              cursor: 'pointer',
              backgroundColor: activeTab === 'login' ? 'var(--bg-surface-elevated)' : 'transparent',
              color: activeTab === 'login' ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: activeTab === 'login' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setError(''); setSuccessMsg(''); }}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              fontWeight: 700,
              fontSize: 13.5,
              cursor: 'pointer',
              backgroundColor: activeTab === 'register' ? 'var(--bg-surface-elevated)' : 'transparent',
              color: activeTab === 'register' ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: activeTab === 'register' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Register New Account
          </button>
        </div>

        {/* Error Feedback */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            padding: '12px 14px',
            borderRadius: 10,
            backgroundColor: 'var(--danger-light)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: 'var(--danger)',
            fontSize: 13,
            marginBottom: 16
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Success Feedback */}
        {successMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 14px',
            borderRadius: 10,
            backgroundColor: 'var(--success-light)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: 'var(--success)',
            fontSize: 13,
            marginBottom: 16
          }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* TAB 1: SIGN IN */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 6 }}>
                Registered Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: 38 }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: 38 }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '11px',
                fontSize: 14,
                borderRadius: 10,
                marginTop: 4,
                display: 'flex',
                justifyContent: 'center',
                gap: 8
              }}
            >
              <LogIn size={16} />
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
            </button>

            <div style={{
              textAlign: 'center',
              fontSize: 12.5,
              color: 'var(--text-muted)',
              paddingTop: 8,
              borderTop: '1px solid var(--border)'
            }}>
              Not registered yet?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Register your account first
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: REGISTER NEW ACCOUNT */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 12px',
              backgroundColor: 'var(--bg-muted)',
              borderRadius: 8,
              border: '1px solid var(--border)',
              fontSize: 12,
              color: 'var(--text-secondary)'
            }}>
              <Info size={16} color="var(--accent-blue)" style={{ flexShrink: 0 }} />
              <div>
                <strong>Database Storage:</strong> All credentials are saved directly into the DBMS. Unregistered users cannot sign in until registered.
              </div>
            </div>

            {/* Select Role */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: 8 }}>
                Select Your Healthcare Role:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 130px), 1fr))', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setRegRole('ROLE_PATIENT')}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: regRole === 'ROLE_PATIENT' ? '2px solid var(--accent-blue)' : '1px solid var(--border)',
                    backgroundColor: regRole === 'ROLE_PATIENT' ? 'var(--accent-blue-light)' : 'var(--bg-surface)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    color: regRole === 'ROLE_PATIENT' ? 'var(--accent-blue)' : 'var(--text-secondary)'
                  }}
                >
                  <User size={16} />
                  <span>Patient</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRegRole('ROLE_DOCTOR')}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: regRole === 'ROLE_DOCTOR' ? '2px solid var(--success)' : '1px solid var(--border)',
                    backgroundColor: regRole === 'ROLE_DOCTOR' ? 'var(--success-light)' : 'var(--bg-surface)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    color: regRole === 'ROLE_DOCTOR' ? 'var(--success)' : 'var(--text-secondary)'
                  }}
                >
                  <Stethoscope size={16} />
                  <span>Doctor</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRegRole('ROLE_HOSPITAL')}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: regRole === 'ROLE_HOSPITAL' ? '2px solid var(--accent-blue)' : '1px solid var(--border)',
                    backgroundColor: regRole === 'ROLE_HOSPITAL' ? 'var(--accent-blue-light)' : 'var(--bg-surface)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    color: regRole === 'ROLE_HOSPITAL' ? 'var(--accent-blue)' : 'var(--text-secondary)'
                  }}
                >
                  <Building2 size={16} />
                  <span>Hospital</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRegRole('ROLE_ADMIN')}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: regRole === 'ROLE_ADMIN' ? '2px solid var(--warning)' : '1px solid var(--border)',
                    backgroundColor: regRole === 'ROLE_ADMIN' ? 'var(--warning-light)' : 'var(--bg-surface)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    color: regRole === 'ROLE_ADMIN' ? 'var(--warning)' : 'var(--text-secondary)'
                  }}
                >
                  <Shield size={16} />
                  <span>Admin</span>
                </button>
              </div>
            </div>

            {/* Common Fields */}
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 4 }}>
                {regRole === 'ROLE_HOSPITAL' ? 'Hospital / Facility Name' : 'Full Name'} *
              </label>
              <input
                type="text"
                placeholder={regRole === 'ROLE_HOSPITAL' ? 'e.g. Prasad Hospital or AIIMS' : 'e.g. Rameshwar Sharma'}
                value={regFullName}
                onChange={(e) => setRegFullName(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 4 }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 4 }}>
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 4 }}>
                Create Password *
              </label>
              <input
                type="password"
                placeholder="Choose a secure password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>

            {/* Role Specific Fields */}
            {regRole === 'ROLE_DOCTOR' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, backgroundColor: 'var(--bg-muted)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 4 }}>
                    Hospital / Clinic Affiliation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Prasad Hospital or AIIMS Patna"
                    value={regHospital}
                    onChange={(e) => setRegHospital(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 4 }}>
                    Medical Specialization
                  </label>
                  <select
                    value={regSpecialty}
                    onChange={(e) => setRegSpecialty(e.target.value)}
                    className="input-field"
                  >
                    <option value="General Medicine">General Medicine</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Gastroenterology">Gastroenterology</option>
                    <option value="Gynecology & Obstetrics">Gynecology & Obstetrics</option>
                    <option value="Urology">Urology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Emergency Medicine">Emergency Medicine</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 4 }}>
                    Medical License No. (MCI / State)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MCI-8420-NK"
                    value={regLicense}
                    onChange={(e) => setRegLicense(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            )}

            {regRole === 'ROLE_HOSPITAL' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, backgroundColor: 'var(--bg-muted)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 4 }}>
                    City / Medical Hub
                  </label>
                  <select
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    className="input-field"
                  >
                    <option value="Muzaffarpur">Muzaffarpur</option>
                    <option value="Patna">Patna</option>
                    <option value="Delhi">Delhi NCR</option>
                    <option value="Other">Other City</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 4 }}>
                    Hospital Address
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Brahmpura, Muzaffarpur, Bihar"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '11px',
                fontSize: 14,
                borderRadius: 10,
                marginTop: 6,
                display: 'flex',
                justifyContent: 'center',
                gap: 8
              }}
            >
              <UserPlus size={16} />
              <span>{loading ? 'Registering Account...' : 'Complete Registration & Store in Database'}</span>
            </button>
          </form>
        )}
      </div>

      {/* Quick 1-Click Demo Profiles for Grading / Instant Testing */}
      <div className="glass-panel" style={{
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#0369a1', fontWeight: 700 }}>
          <Sparkles size={16} />
          <span>Quick 1-Click Evaluation Logins (Pre-registered in Database):</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 8 }}>
          <button
            type="button"
            onClick={() => handle1ClickDemo('patient@medplus.com', 'Patient')}
            className="btn btn-secondary btn-sm"
            style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '8px 12px' }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: 12.5, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <User size={13} />
                <span>Patient</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>patient@medplus.com</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handle1ClickDemo('doctor@medplus.com', 'Doctor')}
            className="btn btn-secondary btn-sm"
            style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '8px 12px' }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: 12.5, color: '#059669', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Stethoscope size={13} />
                <span>Doctor (Dr. Navneet)</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>doctor@medplus.com</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handle1ClickDemo('hospital@medplus.com', 'Hospital')}
            className="btn btn-secondary btn-sm"
            style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '8px 12px' }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: 12.5, color: '#0284c7', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Building2 size={13} />
                <span>Hospital (AIIMS Patna)</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>hospital@medplus.com</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handle1ClickDemo('admin@medplus.com', 'Admin')}
            className="btn btn-secondary btn-sm"
            style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '8px 12px' }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: 12.5, color: '#d97706', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Shield size={13} />
                <span>Admin (Anas Siddiqui)</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>admin@medplus.com</div>
            </div>
          </button>
        </div>
      </div>

      </>)} {/* end of !verificationPending */}
    </div>
  );
};
