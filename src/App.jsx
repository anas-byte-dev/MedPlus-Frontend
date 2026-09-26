import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import API from './api';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DoctorAppointments } from './pages/DoctorAppointments';
import { PatientPanel } from './pages/PatientPanel';
import { DoctorPanel } from './pages/DoctorPanel';
import { HospitalPanel } from './pages/HospitalPanel';
import { AdminPanel } from './pages/AdminPanel';
import { AiHealthAssistant } from './pages/AiHealthAssistant';
import { Login } from './pages/Login';

const AppContent = () => {
  const { user, isPatient, isDoctor, isHospital, isAdmin } = useAuth();
  
  // Default tab based on authentication & role
  const [activeTab, setActiveTab] = useState(() => {
    if (!user) return 'directory';
    if (isPatient) return 'patient';
    if (isDoctor) return 'doctor';
    if (isHospital) return 'hospital';
    if (isAdmin) return 'admin';
    return 'directory';
  });

  const [aiConfig, setAiConfig] = useState(null);

  const fetchAiConfig = async () => {
    try {
      const res = await API.get('/api/agent/config');
      setAiConfig(res.data);
    } catch (err) {
      console.error('Failed to fetch AI configuration', err);
    }
  };

  useEffect(() => {
    fetchAiConfig();
  }, []);

  // Sync activeTab when user logs in or out
  useEffect(() => {
    if (!user) {
      setActiveTab('directory');
    } else if (isPatient) {
      setActiveTab('patient');
    } else if (isDoctor) {
      setActiveTab('doctor');
    } else if (isHospital) {
      setActiveTab('hospital');
    } else if (isAdmin) {
      setActiveTab('admin');
    }
  }, [user?.role]);

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
      />

      <main className="main-content" style={{ flex: 1, padding: '24px 16px', width: '100%', maxWidth: 1280, margin: '0 auto' }}>
        {/* Guest / Public: Specialist Doctor Directory & Booking */}
        {activeTab === 'directory' && (
          <DoctorAppointments />
        )}

        {/* Role 1: Patient Panel */}
        {activeTab === 'patient' && (
          <PatientPanel />
        )}

        {/* Role 2: Doctor Panel */}
        {activeTab === 'doctor' && (
          <DoctorPanel />
        )}

        {/* Role 3: Hospital Panel */}
        {activeTab === 'hospital' && (
          <HospitalPanel />
        )}

        {/* Role 4: Super Admin Panel */}
        {activeTab === 'admin' && (
          <AdminPanel 
            aiConfig={aiConfig}
            onRefreshConfig={fetchAiConfig}
          />
        )}

        {/* Conversational AI Health Assistant */}
        {activeTab === 'ai-assistant' && (
          <AiHealthAssistant />
        )}

        {/* Login / Register */}
        {activeTab === 'login' && (
          <Login onSuccess={() => {
            fetchAiConfig();
          }} />
        )}
      </main>

      {/* Handcrafted Footer with Anas Siddiqui Attribution */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
