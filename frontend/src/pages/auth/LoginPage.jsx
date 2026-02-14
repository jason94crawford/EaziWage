import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, AlertCircle, Scan } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Alert, AlertDescription } from '../../components/ui/alert';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Create a fresh axios instance without interceptors for auth
const authAxios = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    
    setError('');
    setIsLoading(true);

    try {
      const response = await authAxios.post('/api/auth/login', { email, password });
      const data = response.data;

      localStorage.setItem('eaziwage_token', data.access_token);
      localStorage.setItem('eaziwage_user', JSON.stringify(data.user));
      
      const user = data.user;
      switch (user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'employer':
          navigate('/employer');
          break;
        case 'employee':
          navigate('/employee');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.detail || 'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [email, password, navigate]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f8f6] dark:bg-[#102216] font-sans antialiased text-slate-900 dark:text-white transition-colors duration-200">
      {/* Mobile Container */}
      <div className="relative flex min-h-screen w-full flex-col overflow-hidden max-w-md mx-auto shadow-2xl">
        
        {/* Header / Nav */}
        <div className="flex items-center p-4 pt-12 pb-2 justify-between">
          <Link 
            to="/" 
            className="text-slate-900 dark:text-white flex w-12 h-12 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            data-testid="back-button"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0df259] flex items-center justify-center text-[#102216] font-bold text-xl">
              E
            </div>
            <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">EaziWage</h2>
          </div>
          <div className="w-12"></div> {/* Spacer for visual balance */}
        </div>

        {/* Main Content Scrollable Area */}
        <div className="flex-1 flex flex-col px-6 pt-6 pb-8 overflow-y-auto">
          
          {/* Headline Section */}
          <div className="mb-10 text-center">
            <h1 className="text-slate-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
              Access your earnings, anytime
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/20 rounded-xl" data-testid="login-error">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}

          {/* Login Form */}
          <div className="flex flex-col gap-5 w-full">
            
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-900 dark:text-white text-sm font-medium leading-normal ml-1">
                Email Address
              </label>
              <div className="relative flex w-full items-center rounded-xl bg-white dark:bg-[#1a2e22] border border-slate-200 dark:border-slate-700 focus-within:border-[#0df259] focus-within:ring-1 focus-within:ring-[#0df259] transition-all duration-200">
                <Input
                  type="email"
                  placeholder="employee@company.com"
                  className="flex w-full min-w-0 flex-1 bg-transparent text-slate-900 dark:text-white h-14 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-4 pr-12 text-base font-normal leading-normal border-none focus:ring-0 rounded-xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  data-testid="login-email"
                />
                <div className="absolute right-4 text-slate-400 dark:text-slate-500 pointer-events-none flex items-center">
                  <Mail className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-900 dark:text-white text-sm font-medium leading-normal ml-1">
                Password
              </label>
              <div className="relative flex w-full items-center rounded-xl bg-white dark:bg-[#1a2e22] border border-slate-200 dark:border-slate-700 focus-within:border-[#0df259] focus-within:ring-1 focus-within:ring-[#0df259] transition-all duration-200">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••"
                  className="flex w-full min-w-0 flex-1 bg-transparent text-slate-900 dark:text-white h-14 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-4 pr-12 text-base font-normal leading-normal border-none focus:ring-0 rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  data-testid="login-password"
                />
                <button
                  type="button"
                  className="absolute right-4 text-slate-400 dark:text-slate-500 hover:text-[#0df259] transition-colors flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="toggle-password"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link 
                to="/forgot-password" 
                className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-[#0df259] transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Spacer */}
            <div className="h-4"></div>

            {/* Login Button */}
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full h-14 bg-[#0df259] hover:bg-[#0be050] active:scale-[0.98] transition-all duration-200 rounded-full text-[#102216] font-bold text-lg shadow-[0_0_15px_rgba(13,242,89,0.2)] border-0"
              data-testid="login-submit-btn"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-[#102216]/30 border-t-[#102216] rounded-full animate-spin" />
                  Logging in...
                </span>
              ) : (
                'Log In'
              )}
            </Button>

            {/* Biometric Login */}
            <div className="flex justify-center mt-2">
              <button
                type="button"
                className="flex items-center gap-2 text-[#0df259] text-sm font-medium py-2 px-4 rounded-lg hover:bg-white/5 transition-colors"
              >
                <Scan className="w-6 h-6" />
                <span>Log in with Face ID</span>
              </button>
            </div>
          </div>

          {/* Footer / Register CTA */}
          <div className="mt-auto pt-10 pb-4 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              New to EaziWage?{' '}
              <Link 
                to="/register" 
                className="text-[#0df259] font-semibold hover:underline ml-1"
                data-testid="register-link"
              >
                Create Account
              </Link>
            </p>
          </div>

          {/* Bottom Safe Area Indicator */}
          <div className="w-full flex justify-center pt-6 pb-2">
            <div className="w-[134px] h-[5px] bg-slate-300 dark:bg-slate-700 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
