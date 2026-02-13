import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle, Building2, UserCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { register } from '../../lib/auth';
import { cn } from '../../lib/utils';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    role: 'employee',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await register(formData);
    setIsLoading(false);

    if (result.success) {
      const user = result.user;
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
    } else {
      setError(result.error);
    }
  };

  const roles = [
    { value: 'employee', label: 'Employee', icon: UserCircle, description: 'Access your earned wages' },
    { value: 'employer', label: 'Employer', icon: Building2, description: 'Manage your workforce' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8" data-testid="register-logo">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">E</span>
          </div>
          <span className="font-heading font-bold text-2xl text-slate-900">EaziWage</span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <div className="text-center mb-8">
            <h1 className="font-heading text-2xl font-bold text-slate-900 mb-2">Create your account</h1>
            <p className="text-slate-500">Start accessing your earned wages today</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6" data-testid="register-error">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <Label className="text-slate-700 mb-3 block">I am an</Label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: role.value })}
                      className={cn(
                        "flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200",
                        formData.role === role.value
                          ? "border-primary bg-primary/5"
                          : "border-slate-200 hover:border-slate-300"
                      )}
                      data-testid={`role-${role.value}`}
                    >
                      <Icon className={cn(
                        "w-8 h-8 mb-2",
                        formData.role === role.value ? "text-primary" : "text-slate-400"
                      )} />
                      <span className={cn(
                        "font-medium",
                        formData.role === role.value ? "text-primary" : "text-slate-700"
                      )}>{role.label}</span>
                      <span className="text-xs text-slate-500 mt-1">{role.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label htmlFor="full_name" className="text-slate-700">Full name</Label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="full_name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10 h-11"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                  data-testid="register-name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-slate-700">Email address</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  className="pl-10 h-11"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  data-testid="register-email"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="text-slate-700">Phone number</Label>
              <div className="relative mt-1.5">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+254 700 000 000"
                  className="pl-10 h-11"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  data-testid="register-phone"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-slate-700">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  className="pl-10 pr-10 h-11"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={8}
                  data-testid="register-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-primary text-white hover:bg-primary/90"
              disabled={isLoading}
              data-testid="register-submit-btn"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <p className="text-center mt-6 text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:text-primary/80" data-testid="login-link">
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-400 mt-8">
          By creating an account, you agree to our{' '}
          <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
