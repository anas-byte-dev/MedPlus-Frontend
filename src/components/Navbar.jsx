import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  HeartPulse, 
  Stethoscope, 
  Building2, 
  CalendarCheck, 
  Shield, 
  LogOut, 
  LogIn, 
  Sparkles, 
  Menu, 
  X,
  User,
  Users,
  ChevronDown,
  Calendar,
  Sun,
  Moon,
  Eye
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, logout, isDoctor, isHospital, isPatient, isAdmin } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header style={{
      borderBottom: '1px solid var(--border)',
      backgroundColor: 'var(--card-bg)',
      boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%',
      transition: 'background-color 0.2s ease, border-color 0.2s ease'
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 16px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12
      }}>
        {/* Brand Logo & Name */}
        <div 
          onClick={() => handleTabClick(isPatient ? 'patient' : isDoctor ? 'doctor' : isHospital ? 'hospital' : isAdmin ? 'admin' : 'directory')}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 }}
        >
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #0f2942 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 3px 8px rgba(15, 41, 66, 0.18)'
          }}>
            <HeartPulse size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', letterSpacing: -0.4 }}>
                MedPlus
              </span>
              <span className="badge badge-emerald hide-on-mobile" style={{ fontSize: 9.5, padding: '1px 6px' }}>
                VERIFIED
              </span>
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, margin: 0 }} className="hide-on-mobile">
              Specialist Healthcare & OPD
            </p>
          </div>
        </div>

        {/* Desktop Navigation Tabs (Role-tailored & beginner friendly) */}
        <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Guest / Public Navigation */}
          {!user && (
            <>
              <button
                onClick={() => handleTabClick('directory')}
                className={`btn btn-sm ${activeTab === 'directory' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 8 }}
              >
                <Stethoscope size={14} />
                <span>Find Doctors & Book</span>
              </button>

              <button
                onClick={() => handleTabClick('ai-assistant')}
                className={`btn btn-sm ${activeTab === 'ai-assistant' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 8 }}
              >
                <Sparkles size={14} color={activeTab === 'ai-assistant' ? '#ffffff' : '#2563eb'} />
                <span>AI Health Assistant</span>
              </button>
            </>
          )}

          {/* Patient Role Navigation */}
          {user && isPatient && (
            <>
              <button
                onClick={() => handleTabClick('directory')}
                className={`btn btn-sm ${activeTab === 'directory' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 8 }}
              >
                <Stethoscope size={14} />
                <span>Find Doctors</span>
              </button>

              <button
                onClick={() => handleTabClick('patient')}
                className={`btn btn-sm ${activeTab === 'patient' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 8 }}
              >
                <Calendar size={14} />
                <span>My Appointments & Passes</span>
              </button>

              <button
                onClick={() => handleTabClick('ai-assistant')}
                className={`btn btn-sm ${activeTab === 'ai-assistant' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 8 }}
              >
                <Sparkles size={14} color={activeTab === 'ai-assistant' ? '#ffffff' : '#2563eb'} />
                <span>AI Health Assistant</span>
              </button>
            </>
          )}

          {/* Doctor Role Navigation */}
          {user && isDoctor && (
            <>
              <button
                onClick={() => handleTabClick('doctor')}
                className={`btn btn-sm ${activeTab === 'doctor' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 8 }}
              >
                <Stethoscope size={14} />
                <span>My Patient OPD Queue</span>
              </button>
            </>
          )}

          {/* Hospital Admin Role Navigation */}
          {user && isHospital && (
            <>
              <button
                onClick={() => handleTabClick('hospital')}
                className={`btn btn-sm ${activeTab === 'hospital' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 8 }}
              >
                <Building2 size={14} />
                <span>Hospital Operations & Doctors</span>
              </button>
            </>
          )}

          {/* Super Admin Role Navigation */}
          {user && isAdmin && (
            <>
              <button
                onClick={() => handleTabClick('admin')}
                className={`btn btn-sm ${activeTab === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 8 }}
              >
                <Shield size={14} />
                <span>Admin Command Center</span>
              </button>
            </>
          )}
        </nav>

        {/* Right Section: Theme Mode Switcher & Authentication */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* 3-Mode Theme Switcher: Light, Dark, Eye Comfort (desktop/laptop only, mobile has it in drawer) */}
          <div className="desktop-theme-switcher" style={{
            alignItems: 'center',
            backgroundColor: 'var(--bg-muted)',
            padding: 2,
            borderRadius: 10,
            border: '1px solid var(--border)'
          }}>
            <button
              type="button"
              onClick={() => setTheme('light')}
              style={{
                padding: '5px 8px',
                borderRadius: 8,
                border: 'none',
                background: theme === 'light' ? 'var(--card-bg)' : 'transparent',
                color: theme === 'light' ? '#d97706' : 'var(--text-muted)',
                boxShadow: theme === 'light' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11.5,
                fontWeight: 700,
                transition: 'all 0.15s ease'
              }}
              title="Light Clinical Theme"
            >
              <Sun size={13} />
              <span className="theme-btn-label">Light</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              style={{
                padding: '5px 8px',
                borderRadius: 8,
                border: 'none',
                background: theme === 'dark' ? 'var(--card-bg)' : 'transparent',
                color: theme === 'dark' ? '#38bdf8' : 'var(--text-muted)',
                boxShadow: theme === 'dark' ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11.5,
                fontWeight: 700,
                transition: 'all 0.15s ease'
              }}
              title="Dark Midnight Theme"
            >
              <Moon size={13} />
              <span className="theme-btn-label">Dark</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('eye-comfort')}
              style={{
                padding: '5px 8px',
                borderRadius: 8,
                border: 'none',
                background: theme === 'eye-comfort' ? 'var(--card-bg)' : 'transparent',
                color: theme === 'eye-comfort' ? '#b45309' : 'var(--text-muted)',
                boxShadow: theme === 'eye-comfort' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11.5,
                fontWeight: 700,
                transition: 'all 0.15s ease'
              }}
              title="Eye Comfort / Warm Sepia Tone (Reduces Blue Light Strain)"
            >
              <Eye size={13} />
              <span className="theme-btn-label">Eye Comfort</span>
            </button>
          </div>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }} className="desktop-only">
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.fullName || user.email}
                </span>
                <span style={{ fontSize: 10.5, color: isDoctor ? '#059669' : isHospital ? '#0284c7' : isAdmin ? '#d97706' : '#2563eb', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {isDoctor ? <><Stethoscope size={11} /> Physician</> : isHospital ? <><Building2 size={11} /> Hospital</> : isAdmin ? <><Shield size={11} /> Admin</> : <><User size={11} /> Patient</>}
                </span>
              </div>

              <button
                onClick={logout}
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: 8, padding: '6px 9px', color: '#e11d48' }}
                title="Log out"
              >
                <LogOut size={14} />
                <span className="desktop-only">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleTabClick('login')}
              className="btn btn-primary btn-sm login-nav-btn"
              style={{ borderRadius: 8, padding: '6px 12px', whiteSpace: 'nowrap' }}
            >
              <LogIn size={14} />
              <span className="login-btn-full">Sign In / Register</span>
              <span className="login-btn-short">Sign In</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-only btn btn-secondary btn-sm"
            style={{ padding: 6 }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--card-bg)',
          borderTop: '1px solid var(--border)',
          padding: '12px 16px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          boxShadow: 'var(--shadow-md)'
        }}>
          {/* Mobile Theme Switcher */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 10px',
            backgroundColor: 'var(--bg-muted)',
            borderRadius: 8,
            marginBottom: 2
          }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)' }}>Display Mode:</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                type="button"
                onClick={() => setTheme('light')}
                style={{
                  padding: '4px 8px',
                  borderRadius: 6,
                  border: 'none',
                  background: theme === 'light' ? 'var(--card-bg)' : 'transparent',
                  color: theme === 'light' ? '#d97706' : 'var(--text-muted)',
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <Sun size={12} /> Light
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                style={{
                  padding: '4px 8px',
                  borderRadius: 6,
                  border: 'none',
                  background: theme === 'dark' ? 'var(--card-bg)' : 'transparent',
                  color: theme === 'dark' ? '#38bdf8' : 'var(--text-muted)',
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <Moon size={12} /> Dark
              </button>
              <button
                type="button"
                onClick={() => setTheme('eye-comfort')}
                style={{
                  padding: '4px 8px',
                  borderRadius: 6,
                  border: 'none',
                  background: theme === 'eye-comfort' ? 'var(--card-bg)' : 'transparent',
                  color: theme === 'eye-comfort' ? '#b45309' : 'var(--text-muted)',
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <Eye size={12} /> Eye
              </button>
            </div>
          </div>
          {!user && (
            <>
              <button
                onClick={() => handleTabClick('directory')}
                className={`btn btn-sm ${activeTab === 'directory' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'flex-start' }}
              >
                <Stethoscope size={14} />
                <span>Find Doctors & Book</span>
              </button>

              <button
                onClick={() => handleTabClick('ai-assistant')}
                className={`btn btn-sm ${activeTab === 'ai-assistant' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'flex-start' }}
              >
                <Sparkles size={14} />
                <span>AI Health Assistant</span>
              </button>

              <button
                onClick={() => handleTabClick('login')}
                className="btn btn-primary btn-sm"
                style={{ justifyContent: 'flex-start' }}
              >
                <LogIn size={14} />
                <span>Sign In / Register</span>
              </button>
            </>
          )}

          {user && isPatient && (
            <>
              <button
                onClick={() => handleTabClick('directory')}
                className={`btn btn-sm ${activeTab === 'directory' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'flex-start' }}
              >
                <Stethoscope size={14} />
                <span>Find Doctors</span>
              </button>

              <button
                onClick={() => handleTabClick('patient')}
                className={`btn btn-sm ${activeTab === 'patient' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'flex-start' }}
              >
                <Calendar size={14} />
                <span>My Appointments</span>
              </button>

              <button
                onClick={() => handleTabClick('ai-assistant')}
                className={`btn btn-sm ${activeTab === 'ai-assistant' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'flex-start' }}
              >
                <Sparkles size={14} />
                <span>AI Health Assistant</span>
              </button>
            </>
          )}

          {user && isDoctor && (
            <button
              onClick={() => handleTabClick('doctor')}
              className={`btn btn-sm ${activeTab === 'doctor' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ justifyContent: 'flex-start' }}
            >
              <Stethoscope size={14} />
              <span>My Patient OPD Queue</span>
            </button>
          )}

          {user && isHospital && (
            <button
              onClick={() => handleTabClick('hospital')}
              className={`btn btn-sm ${activeTab === 'hospital' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ justifyContent: 'flex-start' }}
            >
              <Building2 size={14} />
              <span>Hospital Operations & Doctors</span>
            </button>
          )}

          {user && isAdmin && (
            <button
              onClick={() => handleTabClick('admin')}
              className={`btn btn-sm ${activeTab === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ justifyContent: 'flex-start' }}
            >
              <Shield size={14} />
              <span>Admin Command Center</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
