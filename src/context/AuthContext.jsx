import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);         // Supabase user object + profile metadata
  const [session, setSession] = useState(null);   // Supabase session (contains access_token)
  const [loading, setLoading] = useState(true);   // True while restoring session on mount
  const [profileLoaded, setProfileLoaded] = useState(false);

  // ─── Fetch user profile from our `users` table ─────────────────────────────
  const fetchProfile = async (supabaseUser) => {
    if (!supabaseUser) {
      setUser(null);
      setProfileLoaded(true);
      return null;
    }
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error.message);
      }

      // Merge Supabase auth user + our profile row
      const merged = {
        id: supabaseUser.id,
        email: supabaseUser.email,
        emailVerified: !!supabaseUser.email_confirmed_at,
        fullName: profile?.full_name || supabaseUser.user_metadata?.full_name || '',
        phone: profile?.phone || supabaseUser.user_metadata?.phone || '',
        role: profile?.role || 'ROLE_PATIENT',
        doctorId: profile?.doctor_id || null,
        hospital: profile?.hospital || null,
        departmentName: profile?.department_name || null,
        medicalLicense: profile?.medical_license || null,
        avatarUrl: profile?.avatar_url || null,
      };
      setUser(merged);
      setProfileLoaded(true);
      return merged;
    } catch (err) {
      console.error('Profile fetch error:', err);
      setUser(null);
      setProfileLoaded(true);
      return null;
    }
  };

  // Sync token to localStorage so axios API interceptors have immediate access
  const syncTokens = (s) => {
    if (s?.access_token) {
      localStorage.setItem('medpulse_token', s.access_token);
      localStorage.setItem('medplus_token', s.access_token);
      if (s.user) {
        localStorage.setItem('medpulse_user', JSON.stringify(s.user));
      }
    } else {
      localStorage.removeItem('medpulse_token');
      localStorage.removeItem('medplus_token');
      localStorage.removeItem('medpulse_user');
      localStorage.removeItem('medplus_user');
    }
  };

  // ─── On mount: restore session ─────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      syncTokens(session);
      if (session?.user) {
        fetchProfile(session.user).finally(() => {
          if (mounted) setLoading(false);
        });
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    // Listen for auth state changes (login, logout, token refresh, email confirm)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        setSession(session);
        syncTokens(session);
        if (session?.user) {
          await fetchProfile(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ─── REGISTER ──────────────────────────────────────────────────────────────
  const register = async ({ fullName, email, password, phone, role = 'ROLE_PATIENT' }) => {
    setLoading(true);
    try {
      // 1. Create auth user with email confirmation
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { full_name: fullName, phone, role },
          emailRedirectTo: `${window.location.origin}`,
        },
      });

      if (error) throw new Error(error.message);

      const authUser = data.user;
      if (!authUser) throw new Error('Registration failed — no user returned.');

      // 2. Insert profile row into our public.users table
      const { error: profileError } = await supabase.from('users').upsert({
        id: authUser.id,
        email: email.trim().toLowerCase(),
        full_name: fullName.trim(),
        phone: phone?.trim() || '',
        role,
        created_at: new Date().toISOString(),
      });

      if (profileError && profileError.code !== '23505') {
        console.warn('Profile insert warning:', profileError.message);
      }

      // 3. Tell frontend to show email-verification message (not auto-login)
      return {
        success: true,
        needsEmailVerification: !authUser.email_confirmed_at,
        message: 'Registration successful! Please check your email to verify your account before logging in.',
      };
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed.' };
    } finally {
      setLoading(false);
    }
  };

  // ─── LOGIN ─────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        // Handle email-not-confirmed specifically
        if (error.message?.toLowerCase().includes('email not confirmed')) {
          return {
            success: false,
            needsEmailVerification: true,
            error: 'Please verify your email before logging in. Check your inbox for the verification link.',
          };
        }
        throw new Error(error.message);
      }

      const supabaseUser = data.user;

      // Check if email is confirmed
      if (!supabaseUser.email_confirmed_at) {
        await supabase.auth.signOut();
        return {
          success: false,
          needsEmailVerification: true,
          error: 'Your email is not verified yet. Please check your inbox and click the verification link.',
        };
      }

      const profile = await fetchProfile(supabaseUser);
      return { success: true, user: profile };
    } catch (err) {
      return { success: false, error: err.message || 'Login failed. Check your credentials.' };
    } finally {
      setLoading(false);
    }
  };

  // ─── LOGOUT ────────────────────────────────────────────────────────────────
  const logout = async () => {
    await supabase.auth.signOut();
    syncTokens(null);
    setUser(null);
    setSession(null);
  };

  // ─── Resend verification email ─────────────────────────────────────────────
  const resendVerification = async (email) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim().toLowerCase(),
    });
    if (error) return { success: false, error: error.message };
    return { success: true, message: 'Verification email resent! Check your inbox.' };
  };

  // ─── Role helpers ──────────────────────────────────────────────────────────
  const isDoctor     = user?.role === 'ROLE_DOCTOR';
  const isNurse      = user?.role === 'ROLE_TRIAGE_NURSE';
  const isPatient    = user?.role === 'ROLE_PATIENT';
  const isHospital   = user?.role === 'ROLE_HOSPITAL';
  const isAdmin      = user?.role === 'ROLE_ADMIN';
  const isClinicalStaff = isDoctor || isNurse || isAdmin || isHospital;

  // The Supabase JWT access token — sent as Bearer to Spring Boot APIs
  const token = session?.access_token || null;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      session,
      loading,
      profileLoaded,
      login,
      register,
      logout,
      resendVerification,
      isDoctor,
      isNurse,
      isPatient,
      isHospital,
      isAdmin,
      isClinicalStaff,
      isAuthenticated: !!session && !!user?.emailVerified,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
