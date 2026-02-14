import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle, Building2, UserCircle, CheckCircle2, Sparkles, Globe } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { cn } from '../../lib/utils';
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
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!fullName || !email || !phone || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    setError('');
    setIsLoading(true);

    try {
      const response = await authAxios.post('/api/auth/register', { 
        full_name: fullName, 
        email, 
        phone, 
        password, 
        role 
      });
      const data = response.data;

      localStorage.setItem('eaziwage_token', data.access_token);
      localStorage.setItem('eaziwage_user', JSON.stringify(data.user));
      
      const user = data.user;
      switch (user.role) {
        case 'employer':
          navigate('/employer/onboarding');
          break;
        case 'employee':
          navigate('/employee/onboarding');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.detail || 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [fullName, email, phone, password, role, navigate]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const roles = [
    { 
      value: 'employee', 
      label: 'Employee', 
      icon: UserCircle, 
      description: 'Access your earned wages instantly',
      color: 'from-primary to-emerald-500'
    },
    { 
      value: 'employer', 
      label: 'Employer', 
      icon: Building2, 
      description: 'Empower your workforce with EWA',
      color: 'from-emerald-500 to-teal-500'
    },
  ];

  const benefits = [
    { icon: CheckCircle2, text: 'No interest, ever' },
    { icon: CheckCircle2, text: 'Instant mobile money transfer' },
    { icon: CheckCircle2, text: 'Bank-grade security' },
    { icon: CheckCircle2, text: 'Works across East Africa' },
  ];

  return (
    <div className="min-h-screen flex bg-[#f5f8f6] dark:bg-[#0a1510]">
      {/* Left Side - Visual/Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#102216] via-[#152b1d] to-[#0a1510]" />
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[200px] -ml-48 -mt-48" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[180px] -mr-32 -mb-32" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-teal-500/10 rounded-full blur-[120px]" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" data-testid="register-logo">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
              <span className="text-black font-bold text-xl">E</span>
            </div>
            <span className="font-heading font-bold text-2xl text-white">EaziWage</span>
          </Link>
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center py-12">
            <div className="max-w-lg">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm font-medium text-primary mb-6">
                <Sparkles className="w-4 h-4" />
                Join 50,000+ workers across East Africa
              </div>
              
              <h1 className="font-heading text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
                Start Your
                <span className="block text-gradient">Financial Freedom</span>
                Journey Today
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed mb-10">
                Get instant access to wages you've already earned. No waiting, no loans, no stress.
              </p>
              
              {/* Benefits List */}
              <div className="space-y-4 mb-12">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                      <benefit.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-slate-300">{benefit.text}</span>
                  </div>
                ))}
              </div>
              
              {/* Countries */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  <span className="text-sm text-slate-400">Available in:</span>
                </div>
                <div className="flex items-center gap-3">
                  {['🇰🇪', '🇺🇬', '🇹🇿', '🇷🇼'].map((flag, i) => (
                    <span key={i} className="text-2xl hover:scale-125 transition-transform cursor-default">{flag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Testimonial */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <p className="text-slate-300 italic mb-4">
              "EaziWage saved me when my daughter got sick. I accessed my wages in 2 seconds and paid the hospital bill immediately. This is a game-changer!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">MW</span>
              </div>
              <div>
                <p className="text-white font-medium">Mary Wanjiku</p>
                <p className="text-sm text-slate-400">Nurse, Kenyatta Hospital</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-8 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center justify-center gap-3" data-testid="register-logo-mobile">
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
                Create your account
              </h2>
              <p className="text-slate-500 dark:text-slate-400">Start accessing your earned wages today</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20" data-testid="register-error">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-5">
              {/* Role Selection */}
              <div>
                <Label className="text-slate-700 dark:text-slate-300 font-medium mb-3 block">
                  I am an
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map((r) => {
                    const Icon = r.icon;
                    const isSelected = role === r.value;
                    return (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setRole(r.value)}
                        className={cn(
                          "relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-300 overflow-hidden group",
                          isSelected
                            ? "border-primary bg-primary/5 dark:bg-primary/10"
                            : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-slate-50 dark:bg-[#102216]"
                        )}
                        data-testid={`role-${r.value}`}
                      >
                        {/* Gradient overlay on hover/select */}
                        <div className={cn(
                          "absolute inset-0 opacity-0 transition-opacity duration-300 bg-gradient-to-br",
                          r.color,
                          isSelected ? "opacity-5" : "group-hover:opacity-[0.02]"
                        )} />
                        
                        <div className={cn(
                          "relative z-10 w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all",
                          isSelected 
                            ? "bg-primary/20" 
                            : "bg-slate-200 dark:bg-white/10 group-hover:bg-slate-300 dark:group-hover:bg-white/15"
                        )}>
                          <Icon className={cn(
                            "w-6 h-6 transition-colors",
                            isSelected ? "text-primary" : "text-slate-400 dark:text-slate-500"
                          )} />
                        </div>
                        <span className={cn(
                          "relative z-10 font-semibold transition-colors",
                          isSelected ? "text-primary" : "text-slate-700 dark:text-slate-300"
                        )}>{r.label}</span>
                        <span className="relative z-10 text-xs text-slate-500 dark:text-slate-400 mt-1 text-center leading-tight">
                          {r.description}
                        </span>
                        
                        {/* Selected indicator */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-3 h-3 text-black" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label htmlFor="full_name" className="text-slate-700 dark:text-slate-300 font-medium">
                  Full name
                </Label>
                <div className="relative mt-2">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                  <Input
                    id="full_name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-12 h-12 rounded-xl bg-slate-50 dark:bg-[#102216] border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    data-testid="register-name"
                  />
                </div>
              </div>

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
                    data-testid="register-email"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="text-slate-700 dark:text-slate-300 font-medium">
                  Phone number
                </Label>
                <div className="relative mt-2">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+254 700 000 000"
                    className="pl-12 h-12 rounded-xl bg-slate-50 dark:bg-[#102216] border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyPress={handleKeyPress}
                    data-testid="register-phone"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-medium">
                  Password
                </Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    className="pl-12 pr-12 h-12 rounded-xl bg-slate-50 dark:bg-[#102216] border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    data-testid="register-password"
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
                <p className="text-xs text-slate-400 mt-2">
                  Must be at least 8 characters
                </p>
              </div>

              <Button 
                type="button"
                onClick={handleSubmit}
                className="w-full h-12 rounded-xl bg-primary text-black font-bold text-base hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all active:scale-[0.98]"
                disabled={isLoading}
                data-testid="register-submit-btn"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Create account
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </div>

            <p className="text-center mt-6 text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:text-primary/80 transition-colors" data-testid="login-link">
                Sign in
              </Link>
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-slate-400 dark:text-slate-500 mt-8 px-4">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
