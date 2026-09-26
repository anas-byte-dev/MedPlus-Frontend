import axios from 'axios';
import { supabase } from './lib/supabaseClient';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://medplus-backend-brkh.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT Bearer token to all outgoing requests automatically
API.interceptors.request.use(async (config) => {
  let token = localStorage.getItem('medpulse_token') || localStorage.getItem('medplus_token');
  if (!token) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        token = session.access_token;
        localStorage.setItem('medpulse_token', token);
      }
    } catch (e) {
      // Proceed without token if session check fails
    }
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Intercept 401 Unauthorized responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('medplus_token');
      localStorage.removeItem('medplus_user');
      localStorage.removeItem('medpulse_token');
      localStorage.removeItem('medpulse_user');
    }
    return Promise.reject(error);
  }
);

export default API;
