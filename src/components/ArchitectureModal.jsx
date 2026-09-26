import React from 'react';
import { X, Layers, Cpu, ShieldCheck, Database, Bot, Zap, HeartPulse, Activity } from 'lucide-react';

export const ArchitectureModal = ({ onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(4, 7, 15, 0.85)',
      backdropFilter: 'blur(10px)',
      zIndex: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }}>
      <div className="glass-panel responsive-modal" style={{
        maxWidth: 940,
        maxHeight: '90vh',
        background: '#0c1222',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid var(--border)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(12, 18, 34, 0.8)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'rgba(6, 182, 212, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <HeartPulse size={22} color="#06b6d4" />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff' }}>MedPlus AI — System Architecture & Engineering Specs</h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Core Java • Concurrency • Spring Boot 3 • Clinical Agentic AI • React 19</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Specs Grid */}
        <div style={{ padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
            gap: 12
          }}>
            {/* Core & Advanced Java */}
            <div className="glass-panel glow-card" style={{ padding: 14, background: 'rgba(6, 182, 212, 0.05)', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Cpu size={18} color="#06b6d4" />
                <h4 style={{ fontSize: 15, color: '#67e8f9' }}>Core & Advanced Java</h4>
              </div>
              <ul style={{ fontSize: 12, color: '#cbd5e1', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li>• <strong>Design Patterns:</strong> Strategy Pattern (<code>TriageRiskScoringStrategy</code> with VitalSigns vs SymptomSeverity implementations), Factory/Context Pattern, Builder Pattern.</li>
                <li>• <strong>Concurrency:</strong> <code>CompletableFuture.supplyAsync</code> with dedicated custom <code>ThreadPoolExecutor</code> for high-throughput batch triage screening.</li>
                <li>• <strong>Streams & Collections:</strong> Functional transforms, parallel pipelines, drug-allergy cross-reference set checks.</li>
                <li>• <strong>Exception Hierarchy:</strong> Custom domain exceptions with <code>@RestControllerAdvice</code>.</li>
              </ul>
            </div>

            {/* Spring Boot 3 */}
            <div className="glass-panel glow-card" style={{ padding: 18, background: 'rgba(16, 185, 129, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <ShieldCheck size={18} color="#10b981" />
                <h4 style={{ fontSize: 15, color: '#6ee7b7' }}>Enterprise Spring Boot 3</h4>
              </div>
              <ul style={{ fontSize: 12, color: '#cbd5e1', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li>• <strong>Spring Security 6:</strong> Stateless JWT Bearer Filter (JJWT 0.12.x) with role-based access (<code>ROLE_DOCTOR</code>, <code>ROLE_TRIAGE_NURSE</code>, <code>ROLE_PATIENT</code>).</li>
                <li>• <strong>Spring Data JPA:</strong> Custom JPQL aggregation queries, transactional consistency, entity relationships.</li>
                <li>• <strong>OpenAPI 3 / Swagger:</strong> Interactive API documentation at <code>/swagger-ui.html</code>.</li>
                <li>• <strong>Jakarta Validation:</strong> DTO constraint validations (<code>@NotBlank</code>, <code>@Email</code>).</li>
              </ul>
            </div>

            {/* Agentic AI Layer */}
            <div className="glass-panel glow-card" style={{ padding: 18, background: 'rgba(14, 165, 233, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Bot size={18} color="#38bdf8" />
                <h4 style={{ fontSize: 15, color: '#7dd3fc' }}>Clinical Agentic AI</h4>
              </div>
              <ul style={{ fontSize: 12, color: '#cbd5e1', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li>• <strong>ReAct / Tool Execution:</strong> Orchestrates modular tools (<code>analyzePatientVitalsAndBiometrics</code>, <code>generateDifferentialDiagnosis</code>, <code>checkDrugInteractions</code>, <code>draftDischargeSummary</code>).</li>
                <li>• <strong>Gemini API:</strong> Integrated via Java HTTP client with fallback clinical reasoning for offline resilience.</li>
                <li>• <strong>Audit Logging:</strong> Every autonomous tool execution recorded with latency and input/output payload.</li>
              </ul>
            </div>

            {/* Frontend & UX */}
            <div className="glass-panel glow-card" style={{ padding: 18, background: 'rgba(244, 63, 94, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Activity size={18} color="#f43f5e" />
                <h4 style={{ fontSize: 15, color: '#fda4af' }}>React 19 Frontend</h4>
              </div>
              <ul style={{ fontSize: 12, color: '#cbd5e1', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li>• <strong>Live Triage Kanban:</strong> 5-stage clinical patient progression with Canvas Confetti on discharge.</li>
                <li>• <strong>Live Vitals Stream:</strong> Real-time animated ECG pulse telemetry and critical alert banners.</li>
                <li>• <strong>MedPlus Copilot:</strong> Interactive clinical diagnostic decision support chat with tool execution audit badges.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
