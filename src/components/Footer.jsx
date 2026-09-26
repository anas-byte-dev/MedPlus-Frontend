import React from 'react';
import { 
  HeartPulse, 
  Stethoscope, 
  Calendar, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink,
  ShieldCheck,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Footer = ({ setActiveTab }) => {
  const { isAdmin } = useAuth();

  const developerEmail = 'anassidd7256@gmail.com';
  const linkedinUrl = 'https://www.linkedin.com/in/anas-siddiqui-b46a23209/';
  const githubUrl = 'https://github.com/anas-byte-dev/';

  const handleNavClick = (tabKey) => {
    if (setActiveTab) {
      setActiveTab(tabKey);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer style={{
      backgroundColor: 'var(--card-bg, #ffffff)',
      borderTop: '1px solid var(--border)',
      marginTop: 'auto',
      width: '100%',
      color: 'var(--text-secondary)'
    }}>
      {/* Main Footer Links & Directory */}
      <section style={{ padding: '48px 20px 32px' }}>
        <div style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 36
        }}>
          {/* Column 1: Brand & Healthcare Mission */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #0f2942 0%, #2563eb 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(15, 41, 66, 0.2)'
              }}>
                <HeartPulse size={20} color="#ffffff" />
              </div>
              <span style={{ fontSize: 19, fontWeight: 800, color: 'var(--text-main)', letterSpacing: -0.3 }}>
                MedPlus
              </span>
              <span className="badge badge-emerald" style={{ fontSize: 9.5, padding: '1px 6px' }}>
                VERIFIED OPD
              </span>
            </div>

            <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-muted)', margin: 0 }}>
              Streamlined clinical appointment booking and hospital OPD management across Muzaffarpur, Patna, and Delhi NCR. Direct doctor scheduling with verified hospital passes.
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              borderRadius: 8,
              background: 'rgba(5, 150, 105, 0.08)',
              border: '1px solid rgba(5, 150, 105, 0.25)',
              fontSize: 12,
              color: '#059669',
              fontWeight: 600,
              width: 'fit-content'
            }}>
              <span style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: '#059669',
                boxShadow: '0 0 6px #059669'
              }} />
              <span>OPD Queues & Booking Active</span>
            </div>
          </div>

          {/* Column 2: Regional Medical Centers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Regional Network
            </span>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <MapPin size={15} color="#0284c7" style={{ marginTop: 2, flexShrink: 0 }} />
              <span><strong>Muzaffarpur:</strong> Prasad Hospital, Narayan Heart Care, Juran Chhapra</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <MapPin size={15} color="#059669" style={{ marginTop: 2, flexShrink: 0 }} />
              <span><strong>Patna:</strong> AIIMS Patna, IGIMS, Medanta Super Specialty, Paras HMRI</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <MapPin size={15} color="#2563eb" style={{ marginTop: 2, flexShrink: 0 }} />
              <span><strong>Delhi NCR:</strong> AIIMS New Delhi, Safdarjung Hospital, Medanta Gurgaon</span>
            </div>
          </div>

          {/* Column 3: Portals & Navigation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Platform Navigation
            </span>
            <button
              onClick={() => handleNavClick('directory')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                textAlign: 'left',
                color: 'var(--text-secondary)',
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Stethoscope size={13} color="#2563eb" />
              <span>Specialist Doctor Directory</span>
            </button>

            <button
              onClick={() => handleNavClick('patient')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                textAlign: 'left',
                color: 'var(--text-secondary)',
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Calendar size={13} color="#059669" />
              <span>Patient Appointments & Passes</span>
            </button>

            <button
              onClick={() => handleNavClick('doctor')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                textAlign: 'left',
                color: 'var(--text-secondary)',
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Activity size={13} color="#0284c7" />
              <span>Doctor OPD Queue</span>
            </button>

            <button
              onClick={() => handleNavClick('hospital')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                textAlign: 'left',
                color: 'var(--text-secondary)',
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Building2 size={13} color="#7c3aed" />
              <span>Hospital Operations & Beds</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  textAlign: 'left',
                  color: 'var(--text-secondary)',
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <ShieldCheck size={13} color="#d97706" />
                <span>Admin Management</span>
              </button>
            )}

            <a
              href={`${import.meta.env.VITE_API_BASE_URL || 'https://medplus-backend-brkh.onrender.com'}/swagger-ui.html`}
              target="_blank"
              rel="noreferrer"
              style={{
                color: 'var(--text-secondary)',
                fontSize: 13,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <ExternalLink size={13} color="#64748b" />
              <span>API Documentation ↗</span>
            </a>
          </div>

          {/* Column 4: Helplines & Emergency */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Emergency & Support
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <Phone size={14} color="#e11d48" />
              <span>Emergency Services: <strong>108 / 112</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <Phone size={14} color="#0284c7" />
              <span>OPD Helpline: <strong>+91 98765 43210</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <Mail size={14} color="#2563eb" />
              <span>Support: <strong>{developerEmail}</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Bar: Copyright, Developer links, & Legal */}
      <section style={{
        borderTop: '1px solid var(--border)',
        padding: '16px 20px',
        backgroundColor: 'var(--bg-muted, #f8fafc)'
      }}>
        <div style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          fontSize: 12.5
        }}>
          <div>
            <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-main)' }}>
              © 2026 MedPlus Healthcare Portal. Built by{' '}
              <a 
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 700 }}
              >
                Anas Siddiqui
              </a>.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <span>GitHub</span>
              <ArrowUpRight size={12} />
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <span>LinkedIn</span>
              <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      </section>
    </footer>
  );
};
