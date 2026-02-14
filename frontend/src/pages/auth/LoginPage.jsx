import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Mail, Lock, AlertCircle, Wallet, Zap, Shield, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
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
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
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
    <div className="min-h-screen flex bg-[#f5f8f6] dark:bg-[#0a1510]">
      {/* Left Side - Visual/Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#102216] via-[#152b1d] to-[#0a1510]" />
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[200px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[180px] -ml-32 -mb-32" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[150px]" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" data-testid="login-logo">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
              <span className="text-black font-bold text-xl">E</span>
            </div>
            <span className="font-heading font-bold text-2xl text-white">EaziWage</span>
          </Link>
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center py-12">
            <div className="max-w-lg">
              <h1 className="font-heading text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
                Access Your
                <span className="block text-gradient">Earned Wages</span>
                Instantly
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed mb-10">
                No waiting for payday. No predatory loans. Just your money, when you need it most.
              </p>
              
              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3 mb-12">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm text-white font-medium">Instant Transfers</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-sm text-white font-medium">Bank-Grade Security</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
                  <Wallet className="w-4 h-4 text-primary" />
                  <span className="text-sm text-white font-medium">Zero Interest</span>
                </div>
              </div>
              
              {/* Mock Phone UI */}
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-br from-primary/20 to-emerald-500/10 rounded-3xl transform rotate-3 blur-sm" />
                <div className="relative bg-[#1A2C20] rounded-3xl p-6 border border-white/10 shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider">Available Balance</p>
                      <p className="text-3xl font-bold text-white">KES 24,500</p>
                    </div>
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Earned this month</span>
                      <span className="text-white font-semibold">KES 49,000</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-primary rounded-full h-2 w-1/2" />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">50% available for advance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Stats */}
          <div className="flex items-center gap-8">
            <div>
              <p className="text-2xl font-bold text-white">50K+</p>
              <p className="text-sm text-slate-400">Active Users</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <p className="text-2xl font-bold text-white">$2B+</p>
              <p className="text-sm text-slate-400">Disbursed</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <p className="text-2xl font-bold text-white">&lt;3s</p>
              <p className="text-sm text-slate-400">Transfer Time</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-10">
            <Link to="/" className="flex items-center justify-center gap-3" data-testid="login-logo-mobile">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="text-black font-bold text-xl">E</span>
              </div>
              <span className="font-heading font-bold text-2xl text-slate-900 dark:text-white">EaziWage</span>
            </Link>
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-[#152b1d] rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-white/5 p-8 sm:p-10">
            <div className="text-center mb-8">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Welcome back
              </h2>
              <p className="text-slate-500 dark:text-slate-400">Sign in to access your account</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20" data-testid="login-error">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium">
                  Email address
                </Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    className="pl-12 h-12 rounded-xl bg-slate-50 dark:bg-[#102216] border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    data-testid="login-email"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-medium">
                    Password
                  </Label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:text-primary/80 font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="pl-12 pr-12 h-12 rounded-xl bg-slate-50 dark:bg-[#102216] border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    data-testid="login-password"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    data-testid="toggle-password"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button 
                type="button"
                onClick={handleSubmit}
                className="w-full h-12 rounded-xl bg-primary text-black font-bold text-base hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all active:scale-[0.98]"
                disabled={isLoading}
                data-testid="login-submit-btn"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign in
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </div>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-[#152b1d] px-4 text-slate-400 dark:text-slate-500">
                  New to EaziWage?
                </span>
              </div>
            </div>

            <Link to="/register" className="block" data-testid="register-link">
              <Button 
                type="button" 
                variant="outline" 
                className="w-full h-12 rounded-xl border-2 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 font-semibold transition-all"
              >
                Create an account
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-slate-400 dark:text-slate-500 mt-8 px-4">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
