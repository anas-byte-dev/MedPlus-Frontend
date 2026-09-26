import React, { useState } from 'react';
import { 
  HeartPulse, 
  Activity, 
  ShieldCheck, 
  Mail, 
  Phone, 
  ExternalLink, 
  Terminal, 
  Code2, 
  MapPin, 
  Sparkles, 
  Cpu, 
  Stethoscope, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  Copy, 
  Check, 
  ArrowUpRight, 
  Layers,
  FileText,
  UserCheck,
  Zap,
  Bot,
  FileCheck,
  Globe,
  Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Footer = ({ setActiveTab }) => {
  const { isAdmin } = useAuth();
  const [copiedEmail, setCopiedEmail] = useState(false);

  const developerEmail = 'anassidd7256@gmail.com';
  const linkedinUrl = 'https://www.linkedin.com/in/anas-siddiqui-b46a23209/';
  const githubUrl = 'https://github.com/anas-byte-dev/';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(developerEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleNavClick = (tabKey) => {
    if (setActiveTab) {
      setActiveTab(tabKey);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer style={{
      backgroundColor: 'var(--bg-surface)',
      borderTop: '1px solid var(--border)',
      marginTop: 'auto',
      width: '100%',
      color: 'var(--text-secondary)'
    }}>
      {/* ========================================================================= */}
      {/* 1. ARCHITECTURAL SHOWCASE: AUTONOMOUS INTELLIGENCE & REAL-TIME VELOCITY */}
      {/* ========================================================================= */}
      <section style={{
        padding: '56px 20px 48px',
        borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(180deg, var(--bg-main) 0%, var(--bg-surface) 100%)'
      }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          {/* Eyebrow & Main Section Heading */}
          <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto 40px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 30,
              background: 'rgba(37, 99, 235, 0.08)',
              border: '1px solid rgba(37, 99, 235, 0.25)',
              color: '#2563eb',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 0.6,
              textTransform: 'uppercase',
              marginBottom: 14
            }}>
              <Zap size={14} color="#2563eb" />
              <span>Autonomous Intelligence & Real-Time Velocity</span>
            </div>

            <h2 style={{
              fontSize: 'clamp(24px, 4vw, 34px)',
              fontWeight: 800,
              color: 'var(--text-main)',
              letterSpacing: -0.5,
              lineHeight: 1.25,
              marginBottom: 12
            }}>
              Engineered to eliminate diagnostic bottlenecks, triage acute emergencies, and connect patients with verified specialist care.
            </h2>

            <p style={{
              fontSize: 'clamp(14px, 2vw, 15.5px)',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              margin: 0
            }}>
              MedPulse AI unifies Spring Boot 3 reactive pipelines, cloud PostgreSQL with connection pooling, and Google Gemini 3.8 Flash multi-agent intelligence into an enterprise healthcare ecosystem.
            </p>
          </div>

          {/* 3 Pillar Architectural Feature Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 20,
            marginBottom: 44
          }}>
            {/* Pillar 1: Multi-Agent Clinical Copilot */}
            <div className="glass-panel" style={{
              padding: 24,
              borderRadius: 16,
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(59, 130, 246, 0.25) 100%)',
                border: '1px solid rgba(37, 99, 235, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563eb'
              }}>
                <Bot size={24} />
              </div>

              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-main)', margin: '0 0 6px' }}>
                  Multi-Agent Clinical Copilot
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
                  Google Gemini 3.8 Flash autonomous clinical agent executing differential diagnosis, real-time biometrics telemetry evaluation, drug interaction & contraindication screening, and discharge documentation.
                </p>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span className="badge badge-blue" style={{ fontSize: 10.5, padding: '3px 8px' }}>
                  Gemini 3.8 Flash
                </span>
                <span className="badge badge-cyan" style={{ fontSize: 10.5, padding: '3px 8px' }}>
                  Differential Dx
                </span>
                <span className="badge badge-emerald" style={{ fontSize: 10.5, padding: '3px 8px' }}>
                  Autonomous Agent
                </span>
              </div>
            </div>

            {/* Pillar 2: High-Concurrency Real-Time Triage */}
            <div className="glass-panel" style={{
              padding: 24,
              borderRadius: 16,
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(2, 132, 199, 0.25) 100%)',
                border: '1px solid rgba(14, 165, 233, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0284c7'
              }}>
                <Zap size={24} />
              </div>

              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-main)', margin: '0 0 6px' }}>
                  High-Concurrency Real-Time Triage
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
                  Java 17 & Spring Boot 3 asynchronous triage executor streaming live patient case acuity, emergency queue routing, vital sign telemetry (SpO2, BP, Heart Rate), and live bed occupancy across ICU and trauma units.
                </p>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span className="badge badge-cyan" style={{ fontSize: 10.5, padding: '3px 8px' }}>
                  Java 17 • Spring Boot 3
                </span>
                <span className="badge badge-amber" style={{ fontSize: 10.5, padding: '3px 8px' }}>
                  Async Executor
                </span>
                <span className="badge badge-blue" style={{ fontSize: 10.5, padding: '3px 8px' }}>
                  ICU Bed Telemetry
                </span>
              </div>
            </div>

            {/* Pillar 3: Verified OPD Pass & Prescription Generation */}
            <div className="glass-panel" style={{
              padding: 24,
              borderRadius: 16,
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.15) 0%, rgba(16, 185, 129, 0.25) 100%)',
                border: '1px solid rgba(5, 150, 105, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#059669'
              }}>
                <FileCheck size={24} />
              </div>

              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-main)', margin: '0 0 6px' }}>
                  Verified OPD Pass & Prescription
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
                  Instant digital appointment reservations generating official physical entry passes & clinical prescription letters with A4 hospital letterhead, doctor NMC registration, reception stamps, and chief complaints.
                </p>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span className="badge badge-emerald" style={{ fontSize: 10.5, padding: '3px 8px' }}>
                  Official A4 PDF Pass
                </span>
                <span className="badge badge-blue" style={{ fontSize: 10.5, padding: '3px 8px' }}>
                  NMC Verified
                </span>
                <span className="badge badge-cyan" style={{ fontSize: 10.5, padding: '3px 8px' }}>
                  Chief Complaint Rx
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. DEVELOPER & SYSTEMS ARCHITECT SHOWCASE CARD: ANAS SIDDIQUI */}
          {/* ========================================================================= */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(15, 41, 66, 0.04) 0%, rgba(37, 99, 235, 0.08) 100%)',
            border: '1px solid rgba(37, 99, 235, 0.25)',
            borderRadius: 20,
            padding: 'clamp(20px, 3.5vw, 32px)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)'
          }}>
            {/* Top Row: Avatar Monogram, Status, Name & Roles */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: 20,
              marginBottom: 20
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {/* AS Monogram Badge with Glow */}
                <div style={{
                  width: 58,
                  height: 58,
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, #0f2942 0%, #2563eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 900,
                  fontSize: 22,
                  letterSpacing: 0.5,
                  boxShadow: '0 4px 16px rgba(37, 99, 235, 0.35)',
                  flexShrink: 0
                }}>
                  AS
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#059669',
                      background: 'rgba(5, 150, 105, 0.1)',
                      border: '1px solid rgba(5, 150, 105, 0.25)',
                      padding: '2px 8px',
                      borderRadius: 12
                    }}>
                      <span style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: '#059669',
                        boxShadow: '0 0 6px #059669'
                      }} />
                      OPEN TO OPPORTUNITIES
                    </span>

                    <span style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                      letterSpacing: 0.5,
                      textTransform: 'uppercase'
                    }}>
                      ENGINEERED & ARCHITECTED BY
                    </span>
                  </div>

                  <h3 style={{
                    fontSize: 'clamp(20px, 3vw, 24px)',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                    margin: 0,
                    letterSpacing: -0.3
                  }}>
                    Anas Siddiqui
                  </h3>

                  <p style={{
                    fontSize: 13.5,
                    color: '#0284c7',
                    fontWeight: 600,
                    margin: '3px 0 0'
                  }}>
                    Creator • Full-Stack & Autonomous AI Systems Engineer
                  </p>
                </div>
              </div>

              {/* Quick Profile Links */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary btn-sm"
                  style={{
                    borderRadius: 10,
                    fontSize: 12.5,
                    padding: '8px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <span>LinkedIn Profile</span>
                  <ArrowUpRight size={13} />
                </a>

                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{
                    borderRadius: 10,
                    fontSize: 12.5,
                    padding: '8px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                  <span>GitHub Repository</span>
                  <ArrowUpRight size={13} />
                </a>
              </div>
            </div>

            {/* Project Bio & Architecture Narrative */}
            <p style={{
              fontSize: 14,
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              marginBottom: 18,
              maxWidth: 960
            }}>
              Architected and engineered <strong>MedPulse AI</strong> end-to-end — unifying <strong>Spring Boot 3</strong> microservices, <strong>Supabase cloud PostgreSQL</strong> with optimized Hikari connection pooling, <strong>dual-auth JWT security</strong> (MedPulse HMAC + Supabase ES256), and <strong>Google Gemini 3.8 Flash multi-agent autonomous clinical intelligence</strong> into a mission-critical hospital triage and specialist appointment ecosystem.
            </p>

            {/* Tech Stack Pills */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              marginBottom: 22
            }}>
              <span style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '4px 10px',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}>
                <Code2 size={13} color="#2563eb" />
                Java 17 • Spring Boot 3
              </span>

              <span style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '4px 10px',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}>
                <Globe size={13} color="#0284c7" />
                React 19 • Vite
              </span>

              <span style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '4px 10px',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}>
                <Sparkles size={13} color="#8b5cf6" />
                Google Gemini 3.8 Flash AI
              </span>

              <span style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '4px 10px',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}>
                <Layers size={13} color="#059669" />
                Supabase PostgreSQL (SSL)
              </span>

              <span style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '4px 10px',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}>
                <ShieldCheck size={13} color="#d97706" />
                Spring Security & Dual JWT
              </span>

              <span style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '4px 10px',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}>
                <FileText size={13} color="#e11d48" />
                jsPDF Medical Passes
              </span>

              <span style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '4px 10px',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}>
                <Cpu size={13} color="#06b6d4" />
                Docker • Cloud Deployed
              </span>
            </div>

            {/* Direct Contact Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 14,
              paddingTop: 16,
              borderTop: '1px solid var(--border)'
            }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>
                  Contact Developer:
                </span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 6 }}>
                  Connect for engineering roles, technical inquiries, or collaborations.
                </span>
              </div>

              {/* Action Buttons: Email Link & Copy Email Widget */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <a
                  href={`mailto:${developerEmail}?subject=Engineering%20Inquiry%20via%20MedPulse%20AI`}
                  className="btn btn-secondary btn-sm"
                  style={{
                    borderRadius: 8,
                    fontSize: 12,
                    padding: '7px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Send size={13} color="#2563eb" />
                  <span>Send Email • Hire Me</span>
                </a>

                {/* Copy Email Button with Feedback */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '3px 4px 3px 10px',
                  gap: 8,
                  fontSize: 12
                }}>
                  <span style={{ color: 'var(--text-main)', fontFamily: 'monospace', fontWeight: 600 }}>
                    {developerEmail}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="btn btn-sm"
                    style={{
                      background: copiedEmail ? '#059669' : '#2563eb',
                      color: 'white',
                      borderRadius: 6,
                      padding: '4px 8px',
                      fontSize: 11,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      transition: 'background 0.2s ease'
                    }}
                    title="Copy Email Address"
                  >
                    {copiedEmail ? (
                      <>
                        <Check size={12} />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PLATFORM NAVIGATION & HEALTHCARE NETWORK GRID */}
      {/* ========================================================================= */}
      <section style={{ padding: '40px 20px 28px' }}>
        <div style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 28
        }}>
          {/* Column 1: Brand & Status Overview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #0f2942 0%, #2563eb 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(15, 41, 66, 0.2)'
              }}>
                <HeartPulse size={19} color="#ffffff" />
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', letterSpacing: -0.3 }}>
                MedPulse AI
              </span>
            </div>

            <p style={{ fontSize: 12.8, lineHeight: 1.6, color: 'var(--text-muted)', margin: 0 }}>
              Autonomous Real-Time Talent & Clinical Triage Platform powered by Google Gemini multi-agent AI and enterprise Java microservices. Connecting patients with verified specialist consultants.
            </p>

            {/* Live Operational Status */}
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
              <span>All Systems Operational • Cloud Connected</span>
            </div>
          </div>

          {/* Column 2: Regional Specialist Medical Hubs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Regional Medical Hubs
            </span>
            <div style={{ fontSize: 12.8, color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <MapPin size={15} color="#0284c7" style={{ marginTop: 2, flexShrink: 0 }} />
              <span><strong>Muzaffarpur:</strong> Prasad Hospital, Narayan Heart Care, Juran Chhapra</span>
            </div>
            <div style={{ fontSize: 12.8, color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <MapPin size={15} color="#059669" style={{ marginTop: 2, flexShrink: 0 }} />
              <span><strong>Patna:</strong> AIIMS Patna, IGIMS, Medanta Super Specialty, Paras HMRI</span>
            </div>
            <div style={{ fontSize: 12.8, color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <MapPin size={15} color="#2563eb" style={{ marginTop: 2, flexShrink: 0 }} />
              <span><strong>Delhi NCR:</strong> AIIMS New Delhi, Safdarjung Hospital, Medanta Gurgaon</span>
            </div>
          </div>

          {/* Column 3: Clinical Platform Modules */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Clinical Platform
            </span>
            <button
              onClick={() => handleNavClick('directory')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                textAlign: 'left',
                color: 'var(--text-secondary)',
                fontSize: 12.8,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Stethoscope size={13} color="#2563eb" />
              <span>Explore Specialist Doctors</span>
            </button>

            <button
              onClick={() => handleNavClick('ai-assistant')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                textAlign: 'left',
                color: 'var(--text-secondary)',
                fontSize: 12.8,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Sparkles size={13} color="#8b5cf6" />
              <span>Dr. MedPlus AI Assistant</span>
            </button>

            <button
              onClick={() => handleNavClick('patient')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                textAlign: 'left',
                color: 'var(--text-secondary)',
                fontSize: 12.8,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Calendar size={13} color="#059669" />
              <span>Patient Consultation Passes</span>
            </button>

            <button
              onClick={() => handleNavClick('hospital')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                textAlign: 'left',
                color: 'var(--text-secondary)',
                fontSize: 12.8,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Building2 size={13} color="#0284c7" />
              <span>Hospital ICU & Bed Telemetry</span>
            </button>

            <a
              href={`${import.meta.env.VITE_API_BASE_URL || 'https://medplus-backend-brkh.onrender.com'}/swagger-ui.html`}
              target="_blank"
              rel="noreferrer"
              style={{
                color: 'var(--text-secondary)',
                fontSize: 12.8,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Terminal size={13} color="#d97706" />
              <span>OpenAPI Swagger Docs ↗</span>
            </a>
          </div>

          {/* Column 4: Helplines & Emergency Care */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Helpline & Emergency Care
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.8 }}>
              <Phone size={14} color="#e11d48" />
              <span>Emergency Ambulance: <strong>108 / 112</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.8 }}>
              <Phone size={14} color="#0284c7" />
              <span>Central OPD Helpline: <strong>+91 98765 43210</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.8 }}>
              <Mail size={14} color="#2563eb" />
              <span>Direct: <strong>{developerEmail}</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. COPYRIGHT & ENTERPRISE VELOCITY BAR */}
      {/* ========================================================================= */}
      <section style={{
        borderTop: '1px solid var(--border)',
        padding: '20px',
        backgroundColor: 'var(--bg-muted)'
      }}>
        <div style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          fontSize: 12.5
        }}>
          <div>
            <p style={{ margin: 0, fontWeight: 700, color: 'var(--text-main)' }}>
              © 2026 MedPulse AI — Designed, Architected & Engineered by <span style={{ color: '#2563eb' }}>Anas Siddiqui</span>. All rights reserved.
            </p>
            <p style={{ margin: '3px 0 0', fontSize: 11.5, color: 'var(--text-muted)' }}>
              Empowering clinicians, hospitals, and patients with persistent real-time intelligence, autonomous multi-agent clinical evaluation, and enterprise cloud velocity.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Connected to <strong>Supabase Cloud PostgreSQL</strong> & <strong>Google Gemini AI</strong>
            </span>
          </div>
        </div>
      </section>
    </footer>
  );
};
