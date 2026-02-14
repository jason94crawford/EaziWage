import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Lock, Check, Shield } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Create a fresh axios instance without interceptors for auth
const authAxios = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [companyCode, setCompanyCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!fullName || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }
    
    setError('');
    setIsLoading(true);

    try {
      const response = await authAxios.post('/api/auth/register', { 
        full_name: fullName, 
        email, 
        phone: '', // Optional field
        password, 
        role: 'employee',
        company_code: companyCode
      });
      const data = response.data;

      localStorage.setItem('eaziwage_token', data.access_token);
      localStorage.setItem('eaziwage_user', JSON.stringify(data.user));
      
      // Navigate to onboarding after registration
      navigate('/employee/onboarding');
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.detail || 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [fullName, email, companyCode, password, agreedToTerms, navigate]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f8f6] dark:bg-[#102216] font-sans antialiased text-slate-900 dark:text-white transition-colors duration-200">
      {/* Mobile Container */}
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto">
        
        {/* Top App Bar */}
        <div className="flex items-center p-4 pb-2 justify-between">
          <Link 
            to="/"
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            data-testid="back-button"
          >
            <ArrowLeft className="w-6 h-6 text-slate-900 dark:text-white" />
          </Link>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
            EaziWage
          </h2>
        </div>

        {/* Headline & Description */}
        <div className="px-4 pt-4 pb-2 text-center">
          <h1 className="text-slate-900 dark:text-white tracking-tight text-[28px] font-bold leading-tight mb-2">
            Access your wages, anytime.
          </h1>
          <p className="text-slate-600 dark:text-gray-400 text-base font-normal leading-normal">
            Sign up to link your employment profile.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-4">
            <Alert variant="destructive" className="mb-4 bg-red-500/10 border-red-500/20 rounded-xl" data-testid="register-error">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Registration Form */}
        <div className="flex flex-col gap-5 px-4 py-6 w-full">
          
          {/* Full Name */}
          <label className="flex flex-col w-full">
            <p className="text-slate-900 dark:text-white text-sm font-medium leading-normal pb-2">Full Name</p>
            <Input
              type="text"
              placeholder="e.g. Jane Doe"
              className="flex w-full resize-none overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0df259] focus:ring-1 focus:ring-[#0df259] h-14 placeholder:text-slate-400 dark:placeholder:text-gray-500 px-4 text-base font-normal leading-normal transition-all"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onKeyPress={handleKeyPress}
              data-testid="register-name"
            />
          </label>

          {/* Work Email */}
          <label className="flex flex-col w-full">
            <p className="text-slate-900 dark:text-white text-sm font-medium leading-normal pb-2">Work Email</p>
            <Input
              type="email"
              placeholder="name@company.com"
              className="flex w-full resize-none overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0df259] focus:ring-1 focus:ring-[#0df259] h-14 placeholder:text-slate-400 dark:placeholder:text-gray-500 px-4 text-base font-normal leading-normal transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              data-testid="register-email"
            />
          </label>

          {/* Company Code */}
          <label className="flex flex-col w-full">
            <div className="flex justify-between items-baseline pb-2">
              <p className="text-slate-900 dark:text-white text-sm font-medium leading-normal">Company Code</p>
              <span className="text-xs text-[#0df259] cursor-pointer hover:underline">Find my code</span>
            </div>
            <Input
              type="text"
              placeholder="e.g. EZ-8842"
              className="flex w-full resize-none overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0df259] focus:ring-1 focus:ring-[#0df259] h-14 placeholder:text-slate-400 dark:placeholder:text-gray-500 px-4 text-base font-normal leading-normal transition-all uppercase tracking-wide"
              value={companyCode}
              onChange={(e) => setCompanyCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              data-testid="register-company-code"
            />
            <p className="text-slate-500 dark:text-gray-500 text-xs pt-1.5">Ask your HR manager if you are unsure.</p>
          </label>

          {/* Password */}
          <label className="flex flex-col w-full relative">
            <p className="text-slate-900 dark:text-white text-sm font-medium leading-normal pb-2">Password</p>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a secure password"
                className="flex w-full resize-none overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0df259] focus:ring-1 focus:ring-[#0df259] h-14 placeholder:text-slate-400 dark:placeholder:text-gray-500 pl-4 pr-12 text-base font-normal leading-normal transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                data-testid="register-password"
              />
              <button
                type="button"
                className="absolute right-0 top-0 h-full px-4 flex items-center justify-center text-slate-400 hover:text-[#0df259] transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                data-testid="toggle-password"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </label>

          {/* Terms & Conditions */}
          <div className="flex items-start gap-3 py-2">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 dark:border-white/20 bg-white dark:bg-white/5 checked:border-[#0df259] checked:bg-[#0df259] transition-all hover:border-[#0df259]"
                data-testid="terms-checkbox"
              />
              <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-black opacity-0 peer-checked:opacity-100">
                <Check className="w-4 h-4 font-bold" />
              </span>
            </div>
            <label htmlFor="terms" className="text-sm text-slate-600 dark:text-gray-400 leading-snug cursor-pointer select-none">
              I agree to the{' '}
              <Link to="/terms" className="text-[#0df259] hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-[#0df259] hover:underline">Privacy Policy</Link>.
            </label>
          </div>

          {/* Action Button */}
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full h-14 rounded-xl bg-[#0df259] text-[#102216] font-bold text-lg shadow-lg shadow-[#0df259]/20 hover:bg-[#0be050] hover:shadow-[#0df259]/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 border-0"
            data-testid="register-submit-btn"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-[#102216]/30 border-t-[#102216] rounded-full animate-spin" />
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </Button>

          {/* Security Note */}
          <div className="flex items-center justify-center gap-1.5 pt-2 opacity-60">
            <Lock className="w-4 h-4 text-slate-500 dark:text-gray-400" />
            <span className="text-xs font-medium text-slate-500 dark:text-gray-400">Bank-grade 256-bit encryption</span>
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-auto pb-8 pt-4 text-center">
          <p className="text-slate-600 dark:text-gray-400 text-sm">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-[#0df259] font-semibold hover:underline"
              data-testid="login-link"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
