import { useState, useEffect } from 'react';
import { authApi } from './api';

// Simple auth state management
let authState = {
  user: JSON.parse(localStorage.getItem('eaziwage_user') || 'null'),
  token: localStorage.getItem('eaziwage_token'),
  isAuthenticated: !!localStorage.getItem('eaziwage_token'),
  isLoading: false,
  error: null,
};

const listeners = new Set();

const setAuthState = (newState) => {
  authState = { ...authState, ...newState };
  listeners.forEach((listener) => listener(authState));
};

export const login = async (email, password) => {
  setAuthState({ isLoading: true, error: null });
  try {
    const response = await authApi.login({ email, password });
    const { access_token, user } = response.data;
    
    localStorage.setItem('eaziwage_token', access_token);
    localStorage.setItem('eaziwage_user', JSON.stringify(user));
    
    setAuthState({
      user,
      token: access_token,
      isAuthenticated: true,
      isLoading: false,
    });
    
    return { success: true, user };
  } catch (error) {
    const message = error.response?.data?.detail || 'Login failed';
    setAuthState({ isLoading: false, error: message });
    return { success: false, error: message };
  }
};

export const register = async (data) => {
  setAuthState({ isLoading: true, error: null });
  try {
    const response = await authApi.register(data);
    const { access_token, user } = response.data;
    
    localStorage.setItem('eaziwage_token', access_token);
    localStorage.setItem('eaziwage_user', JSON.stringify(user));
    
    setAuthState({
      user,
      token: access_token,
      isAuthenticated: true,
      isLoading: false,
    });
    
    return { success: true, user };
  } catch (error) {
    const message = error.response?.data?.detail || 'Registration failed';
    setAuthState({ isLoading: false, error: message });
    return { success: false, error: message };
  }
};

export const logout = () => {
  localStorage.removeItem('eaziwage_token');
  localStorage.removeItem('eaziwage_user');
  setAuthState({
    user: null,
    token: null,
    isAuthenticated: false,
    error: null,
  });
};

export const useAuth = () => {
  const [state, setState] = useState(authState);

  useEffect(() => {
    const listener = (newState) => setState(newState);
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  return state;
};

export const getAuthState = () => authState;
