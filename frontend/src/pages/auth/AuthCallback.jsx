import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Use ref to prevent double processing in StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processAuth = async () => {
      try {
        // Extract session_id from URL fragment
        const hash = location.hash;
        const sessionIdMatch = hash.match(/session_id=([^&]+)/);
        
        if (!sessionIdMatch) {
          console.error('No session_id found in URL');
          navigate('/login');
          return;
        }

        const sessionId = sessionIdMatch[1];
        
        // Get pending role from localStorage (set during registration)
        const pendingRole = localStorage.getItem('eaziwage_pending_role') || 'employee';
        localStorage.removeItem('eaziwage_pending_role');

        // Call backend to process the session
        const response = await axios.post(`${API_URL}/api/auth/google/callback`, {
          session_id: sessionId,
          role: pendingRole
        });

        const data = response.data;

        // Store auth data
        localStorage.setItem('eaziwage_token', data.access_token);
        localStorage.setItem('eaziwage_user', JSON.stringify(data.user));

        // Navigate based on user role and whether they're new
        const user = data.user;
        if (data.is_new_user) {
          // New user - go to onboarding
          if (user.role === 'employer') {
            navigate('/employer/onboarding', { state: { user } });
          } else {
            navigate('/employee/onboarding', { state: { user } });
          }
        } else {
          // Existing user - go to dashboard
          switch (user.role) {
            case 'admin':
              navigate('/admin', { state: { user } });
              break;
            case 'employer':
              navigate('/employer', { state: { user } });
              break;
            case 'employee':
              navigate('/employee', { state: { user } });
              break;
            default:
              navigate('/', { state: { user } });
          }
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/login');
      }
    };

    processAuth();
  }, [navigate, location]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="text-white font-bold text-2xl">E</span>
        </div>
        <p className="text-slate-600 dark:text-slate-300">Completing sign in...</p>
      </div>
    </div>
  );
}
