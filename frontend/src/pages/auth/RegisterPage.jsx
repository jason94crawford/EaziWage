import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Lock, Check, Sparkles, User, Mail, Building2, Scan } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AlertCircle, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../lib/ThemeContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Create a fresh axios instance without interceptors for auth
const authAxios = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [accountType, setAccountType] = useState('employee'); // 'employee' or 'employer'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [companyCode, setCompanyCode] = useState('');
  const [companyName, setCompanyName] = useState('');
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

    if (accountType === 'employer' && !companyName) {
      setError('Please enter your company name');
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
      const payload = { 
        full_name: fullName, 
        email, 
        phone: '',
        password, 
        role: accountType,
        company_code: accountType === 'employee' ? companyCode : '',
        company_name: accountType === 'employer' ? companyName : ''
      };
      
      const response = await authAxios.post('/api/auth/register', payload);
      const data = response.data;

      localStorage.setItem('eaziwage_token', data.access_token);
      localStorage.setItem('eaziwage_user', JSON.stringify(data.user));
      
      // Navigate to appropriate onboarding
      if (accountType === 'employer') {
        navigate('/employer/onboarding');
      } else {
        navigate('/employee/onboarding');
      }
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.detail || 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [fullName, email, companyCode, companyName, password, agreedToTerms, accountType, navigate]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
  const handleGoogleSignup = () => {
    // Store selected account type for post-auth processing
    localStorage.setItem('eaziwage_pending_role', accountType);
    const redirectUrl = window.location.origin + '/auth/callback';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const handleAppleSignup = () => {
    // Placeholder - Apple Sign In requires Apple Developer credentials
    setError('Apple Sign In coming soon! Please use email or Google signup.');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 relative overflow-hidden">
      {/* Hero Background - Matching Landing Page */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/5 rounded-full blur-[200px]" />
      
      {/* Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-end">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
            data-testid="theme-toggle"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-md">
          {/* Content */}
          <div className="stagger">
            {/* Centered Logo */}
            <div className="flex justify-center mb-6">
              <Link to="/" className="flex items-center gap-3 group" data-testid="logo-link">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/30">
                    <span className="text-white font-bold text-2xl">E</span>
                  </div>
                  <div className="absolute inset-0 bg-primary/30 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300 -z-10" />
                </div>
                <span className="font-heading font-bold text-2xl text-slate-900 dark:text-white">EaziWage</span>
              </Link>
            </div>

            {/* Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 dark:bg-primary/20 border border-primary/20 rounded-full text-sm font-semibold text-primary">
                <Sparkles className="w-4 h-4" />
                Join 50,000+ workers across East Africa
              </div>
            </div>
            
            {/* Headline */}
            <div className="text-center mb-10">
              <h1 className="font-heading text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-4">
                Get Started with
                <br />
                <span className="text-gradient">EaziWage</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Access your earned wages instantly. No loans, no interest.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/20 rounded-xl backdrop-blur-sm" data-testid="register-error">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            {/* Registration Form */}
            <div className="glass-card rounded-3xl p-8 shadow-xl">
              <div className="flex flex-col gap-5">
                {/* Account Type Toggle */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                    I am an
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setAccountType('employee')}
                      className={`py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                        accountType === 'employee'
                          ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      data-testid="account-type-employee"
                    >
                      Employee
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountType('employer')}
                      className={`py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                        accountType === 'employer'
                          ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      data-testid="account-type-employer"
                    >
                      Employer
                    </button>
                  </div>
                </div>

                {/* Full Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="e.g. Jane Doe"
                      className="h-14 pl-4 pr-12 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onKeyPress={handleKeyPress}
                      data-testid="register-name"
                    />
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </div>
                </div>

                {/* Work Email */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                    {accountType === 'employer' ? 'Business Email' : 'Work Email'}
                  </label>
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder={accountType === 'employer' ? 'ceo@company.com' : 'name@company.com'}
                      className="h-14 pl-4 pr-12 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={handleKeyPress}
                      data-testid="register-email"
                    />
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </div>
                </div>

                {/* Company Code (Employee) or Company Name (Employer) */}
                {accountType === 'employee' ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center ml-1 mr-1">
                      <label className="text-slate-700 dark:text-slate-200 text-sm font-medium">
                        Company Code
                      </label>
                      <span className="text-xs text-primary cursor-pointer hover:underline font-medium">Find my code</span>
                    </div>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="e.g. EZ-8842"
                        className="h-14 pl-4 pr-12 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 uppercase tracking-wide"
                        value={companyCode}
                        onChange={(e) => setCompanyCode(e.target.value.toUpperCase())}
                        onKeyPress={handleKeyPress}
                        data-testid="register-company-code"
                      />
                      <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs ml-1">Ask your HR manager if you are unsure.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                      Company Name
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="e.g. Acme Corporation"
                        className="h-14 pl-4 pr-12 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        data-testid="register-company-name"
                      />
                      <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                )}

                {/* Password */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a secure password"
                      className="h-14 pl-4 pr-12 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      data-testid="register-password"
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      data-testid="toggle-password"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-start gap-3 py-2">
                  <div className="relative flex items-center mt-0.5">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 checked:border-primary checked:bg-primary transition-all hover:border-primary"
                      data-testid="terms-checkbox"
                    />
                    <Check className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100" />
                  </div>
                  <label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400 leading-snug cursor-pointer select-none">
                    I agree to the{' '}
                    <Link to="/terms" className="text-primary hover:underline font-medium">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-primary hover:underline font-medium">Privacy Policy</Link>.
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full h-14 mt-2 rounded-2xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white font-semibold text-base shadow-xl shadow-primary/30 btn-glow"
                  data-testid="register-submit-btn"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Account...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Create {accountType === 'employer' ? 'Employer' : ''} Account
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>

                {/* Divider */}
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/60 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 backdrop-blur-sm rounded-full">
                      or sign up with
                    </span>
                  </div>
                </div>

                {/* Social Signup Options */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Google */}
                  <button
                    type="button"
                    onClick={handleGoogleSignup}
                    className="flex items-center justify-center gap-2 h-12 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5 transition-all text-sm font-medium text-slate-700 dark:text-slate-300"
                    data-testid="google-signup-btn"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </button>

                  {/* Apple */}
                  <button
                    type="button"
                    onClick={handleAppleSignup}
                    className="flex items-center justify-center gap-2 h-12 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5 transition-all text-sm font-medium text-slate-700 dark:text-slate-300"
                    data-testid="apple-signup-btn"
                  >
                    <svg className="w-5 h-5 text-slate-900 dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    Apple
                  </button>
                </div>

                {/* Security Note */}
                <div className="flex items-center justify-center gap-1.5 pt-2">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Bank-grade 256-bit encryption</span>
                </div>
              </div>
            </div>

            {/* Login CTA */}
            <div className="mt-8 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-primary font-semibold hover:underline"
                  data-testid="login-link"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
