import { create } from 'zustand';
import { authApi } from './api';

// Auth store using zustand pattern with vanilla JS
const createAuthStore = () => {
  let state = {
    user: JSON.parse(localStorage.getItem('eaziwage_user') || 'null'),
    token: localStorage.getItem('eaziwage_token'),
    isAuthenticated: !!localStorage.getItem('eaziwage_token'),
    isLoading: false,
    error: null,
  };

  const listeners = new Set();

  const setState = (newState) => {
    state = { ...state, ...newState };
    listeners.forEach((listener) => listener(state));
  };

  const getState = () => state;

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return {
    getState,
    setState,
    subscribe,
  };
};

export const authStore = createAuthStore();

export const login = async (email, password) => {
  authStore.setState({ isLoading: true, error: null });
  try {
    const response = await authApi.login({ email, password });
    const { access_token, user } = response.data;
    
    localStorage.setItem('eaziwage_token', access_token);
    localStorage.setItem('eaziwage_user', JSON.stringify(user));
    
    authStore.setState({
      user,
      token: access_token,
      isAuthenticated: true,
      isLoading: false,
    });
    
    return { success: true, user };
  } catch (error) {
    const message = error.response?.data?.detail || 'Login failed';
    authStore.setState({ isLoading: false, error: message });
    return { success: false, error: message };
  }
};

export const register = async (data) => {
  authStore.setState({ isLoading: true, error: null });
  try {
    const response = await authApi.register(data);
    const { access_token, user } = response.data;
    
    localStorage.setItem('eaziwage_token', access_token);
    localStorage.setItem('eaziwage_user', JSON.stringify(user));
    
    authStore.setState({
      user,
      token: access_token,
      isAuthenticated: true,
      isLoading: false,
    });
    
    return { success: true, user };
  } catch (error) {
    const message = error.response?.data?.detail || 'Registration failed';
    authStore.setState({ isLoading: false, error: message });
    return { success: false, error: message };
  }
};

export const logout = () => {
  localStorage.removeItem('eaziwage_token');
  localStorage.removeItem('eaziwage_user');
  authStore.setState({
    user: null,
    token: null,
    isAuthenticated: false,
    error: null,
  });
};

export const useAuth = () => {
  const [state, setState] = useState(authStore.getState());

  useEffect(() => {
    return authStore.subscribe(setState);
  }, []);

  return state;
};

// React hook imports
import { useState, useEffect } from 'react';
