import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Wallet, TrendingUp, Clock, ArrowRight, CreditCard, 
  AlertCircle, CheckCircle2, History, FileText, Bell,
  Home, User, ArrowUpRight, Calendar, Building2, ChevronRight,
  Sun, Moon, LogOut, Settings
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { dashboardApi, employeeApi } from '../../lib/api';
import { formatCurrency, formatDateTime, cn } from '../../lib/utils';
import { useTheme } from '../../lib/ThemeContext';

// Animated Speed Dial Counter Component
const SpeedDialCounter = ({ value, max, label }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [rotation, setRotation] = useState(-135);
  const animationRef = useRef(null);
  
  useEffect(() => {
    const startTime = performance.now();
    const duration = 1500;
    const startValue = 0;
    const endValue = value;
    const startRotation = -135;
    const endRotation = -135 + (270 * (value / max));
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out-cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = startValue + (endValue - startValue) * easeOut;
      const currentRotation = startRotation + (endRotation - startRotation) * easeOut;
      
      setDisplayValue(Math.round(currentValue));
      setRotation(currentRotation);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, max]);
  
  const percentage = max > 0 ? (value / max) * 100 : 0;
  
  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
      
      {/* Background circle */}
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-slate-200 dark:text-slate-800"
        />
        {/* Progress arc */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${percentage * 2.83} 283`}
          className="transition-all duration-300"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0df259" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
          {label}
        </span>
        <span className="text-3xl font-bold text-slate-900 dark:text-white">
          {formatCurrency(displayValue)}
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          of {formatCurrency(max)}
        </span>
      </div>
      
      {/* Needle indicator */}
      <div 
        className="absolute top-1/2 left-1/2 w-1 h-16 origin-bottom transition-transform duration-300"
        style={{ transform: `translate(-50%, -100%) rotate(${rotation}deg)` }}
      >
        <div className="w-full h-full bg-gradient-to-t from-primary to-emerald-400 rounded-full shadow-lg shadow-primary/30" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full shadow-lg" />
      </div>
    </div>
  );
};

// Bottom Navigation Component
const BottomNav = ({ active }) => {
  const navigate = useNavigate();
  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/employee' },
    { id: 'wallet', icon: Wallet, label: 'Advance', path: '/employee/advances' },
    { id: 'history', icon: History, label: 'History', path: '/employee/transactions' },
    { id: 'profile', icon: User, label: 'Profile', path: '/employee/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200/50 dark:border-white/5 z-50 md:hidden">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-full h-full transition-all duration-300",
              active === item.id 
                ? "text-primary" 
                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            )}
            data-testid={`nav-${item.id}`}
          >
            <item.icon className={cn("w-5 h-5 transition-transform", active === item.id && "scale-110")} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
      <div className="h-safe-bottom w-full bg-white/80 dark:bg-slate-900/80" />
    </nav>
  );
};

// Sidebar Navigation for Desktop
const Sidebar = ({ active, employee, onLogout }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  const navItems = [
    { id: 'home', icon: Home, label: 'Dashboard', path: '/employee' },
    { id: 'wallet', icon: CreditCard, label: 'Request Advance', path: '/employee/advances' },
    { id: 'history', icon: History, label: 'Transaction History', path: '/employee/transactions' },
    { id: 'kyc', icon: FileText, label: 'Documents & KYC', path: '/employee/kyc' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/employee/settings' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-72 min-h-screen fixed left-0 top-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-r border-slate-200/50 dark:border-white/5">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200/50 dark:border-white/5">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <span className="font-bold text-xl text-slate-900 dark:text-white">EaziWage</span>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-5 border-b border-slate-200/50 dark:border-white/5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-emerald-600 rounded-full flex items-center justify-center ring-4 ring-primary/10">
              <span className="text-white font-bold text-lg">{employee?.full_name?.[0] || 'U'}</span>
            </div>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-primary rounded-full border-2 border-white dark:border-slate-900" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900 dark:text-white truncate">{employee?.full_name || 'User'}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{employee?.employer_name || 'Employee'}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300",
              active === item.id 
                ? "bg-primary/10 text-primary shadow-sm" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
            )}
            data-testid={`sidebar-${item.id}`}
          >
            <item.icon className={cn("w-5 h-5", active === item.id && "text-primary")} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Theme Toggle & Logout */}
      <div className="p-4 space-y-2 border-t border-slate-200/50 dark:border-white/5">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-white/5 transition-all"
          data-testid="theme-toggle"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
          data-testid="logout-btn"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default function EmployeeDashboard() {
  const [stats, setStats] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, employeeRes] = await Promise.all([
          dashboardApi.getEmployeeDashboard(),
          employeeApi.getMe()
        ]);
        setStats(statsRes.data);
        setEmployee(employeeRes.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('profile_not_found');
        } else {
          setError('Failed to load dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('eaziwage_token');
    localStorage.removeItem('eaziwage_user');
    navigate('/login');
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Calculate next payday (assuming end of month)
  const getNextPayday = () => {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const daysUntil = Math.ceil((lastDay - today) / (1000 * 60 * 60 * 24));
    return { date: lastDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), daysUntil };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error === 'profile_not_found') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <AlertCircle className="w-10 h-10 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Complete Your Profile</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            You need to complete your employee profile before you can access the dashboard and request advances.
          </p>
          <Link to="/employee/onboarding">
            <Button className="bg-gradient-to-r from-primary to-emerald-600 text-white hover:opacity-90 font-bold px-8 py-3 rounded-xl shadow-lg shadow-primary/30" data-testid="complete-profile-btn">
              Complete Profile
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const earnedWages = stats?.earned_wages || 0;
  const advanceLimit = stats?.advance_limit || 0;
  const totalAdvances = stats?.total_advances || 0;
  const pendingRepayment = stats?.pending_repayment || 0;
  const kycPending = employee?.kyc_status === 'pending' || employee?.kyc_status === 'submitted';
  const canRequestAdvance = employee?.status === 'approved' && employee?.kyc_status === 'approved' && advanceLimit > 0;
  const payday = getNextPayday();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-white">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px]" />
      </div>
      
      <Sidebar active="home" employee={employee} onLogout={handleLogout} />
      
      {/* Main Content */}
      <main className="md:ml-72 pb-28 md:pb-8 relative z-10">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5">
          <div className="flex items-center p-4 justify-between max-w-lg mx-auto w-full">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 bg-gradient-to-br from-primary to-emerald-600 rounded-full flex items-center justify-center ring-2 ring-primary/20">
                  <span className="text-white font-bold">{employee?.full_name?.[0] || 'U'}</span>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-white dark:border-slate-900" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{getGreeting()},</p>
                <h2 className="text-lg font-bold leading-tight">{employee?.full_name?.split(' ')[0] || 'User'}</h2>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleTheme}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 text-slate-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
              </button>
              <button 
                className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                data-testid="notifications-btn"
              >
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-lg mx-auto w-full px-4 pt-6 space-y-6">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between">
            <div>
              <p className="text-slate-500 dark:text-slate-400">{getGreeting()},</p>
              <h1 className="text-3xl font-bold">{employee?.full_name || 'User'}</h1>
            </div>
            <button 
              className="relative p-3 bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white dark:hover:bg-white/10 transition-all border border-slate-200/50 dark:border-white/10"
              data-testid="notifications-btn-desktop"
            >
              <Bell className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
            </button>
          </div>

          {/* KYC Alert */}
          {kycPending && (
            <div className="bg-amber-50/80 dark:bg-amber-500/10 backdrop-blur-sm border border-amber-200/50 dark:border-amber-500/20 rounded-2xl p-4 flex items-start gap-4" data-testid="kyc-alert">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-amber-800 dark:text-amber-200">Complete your verification</h3>
                <p className="text-sm text-amber-700 dark:text-amber-300/80 mt-1">
                  {employee?.kyc_status === 'submitted' 
                    ? 'Your documents are under review. This usually takes 1-2 business days.'
                    : 'Upload your KYC documents to start accessing wage advances.'}
                </p>
              </div>
              {employee?.kyc_status === 'pending' && (
                <Link to="/employee/kyc">
                  <Button size="sm" className="bg-amber-500 text-white hover:bg-amber-400 font-semibold">
                    Upload
                  </Button>
                </Link>
              )}
            </div>
          )}

          {/* Speed Dial Hero Card */}
          <div className="relative overflow-hidden rounded-3xl bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl border border-slate-200/50 dark:border-white/10" data-testid="withdraw-card">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="relative p-6 z-10">
              {/* Speed Dial Counter */}
              <SpeedDialCounter 
                value={advanceLimit} 
                max={earnedWages || advanceLimit * 2 || 10000} 
                label="Available"
              />
              
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 mt-6 mb-6">
                <div className="bg-slate-50/50 dark:bg-white/5 rounded-xl p-3 text-center border border-slate-200/50 dark:border-white/5">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Fee Rate</span>
                  <span className="font-bold text-slate-900 dark:text-white">3.5% - 6%</span>
                </div>
                <div className="bg-slate-50/50 dark:bg-white/5 rounded-xl p-3 text-center border border-slate-200/50 dark:border-white/5">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Transfer</span>
                  <span className="font-bold text-slate-900 dark:text-white">Instant</span>
                </div>
              </div>

              <Link to="/employee/advances" className="block">
                <Button 
                  className="w-full flex items-center justify-center gap-2 rounded-xl h-14 bg-gradient-to-r from-primary to-emerald-600 text-white text-base font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all active:scale-[0.98]"
                  disabled={!canRequestAdvance}
                  data-testid="request-withdrawal-btn"
                >
                  <Wallet className="w-5 h-5" />
                  Request Withdrawal
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4" data-testid="quick-stats">
            {/* Earned Wages */}
            <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/50 dark:border-white/10 relative overflow-hidden group hover:shadow-lg transition-all">
              <div className="absolute -right-4 -bottom-4 text-primary/10 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-20 h-20" />
              </div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Earned Wages</p>
                <p className="text-xl font-bold mt-1">{formatCurrency(earnedWages)}</p>
              </div>
            </div>

            {/* Next Payday */}
            <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/50 dark:border-white/10 relative overflow-hidden group hover:shadow-lg transition-all">
              <div className="absolute -right-4 -bottom-4 text-blue-500/10 group-hover:scale-110 transition-transform">
                <Calendar className="w-20 h-20" />
              </div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-3">
                  <Calendar className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Next Payday</p>
                <p className="text-xl font-bold mt-1">{payday.date}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{payday.daysUntil} days away</p>
              </div>
            </div>

            {/* Total Withdrawn */}
            <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/50 dark:border-white/10 relative overflow-hidden group hover:shadow-lg transition-all">
              <div className="absolute -right-4 -bottom-4 text-orange-500/10 group-hover:scale-110 transition-transform">
                <ArrowUpRight className="w-20 h-20" />
              </div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center mb-3">
                  <ArrowUpRight className="w-5 h-5 text-orange-500" />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Withdrawn</p>
                <p className="text-xl font-bold mt-1">{formatCurrency(totalAdvances)}</p>
              </div>
            </div>

            {/* Employer */}
            <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/50 dark:border-white/10 relative overflow-hidden group hover:shadow-lg transition-all">
              <div className="absolute -right-4 -bottom-4 text-purple-500/10 group-hover:scale-110 transition-transform">
                <Building2 className="w-20 h-20" />
              </div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center mb-3">
                  <Building2 className="w-5 h-5 text-purple-500" />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Employer</p>
                <p className="text-base font-bold mt-1 truncate">{employee?.employer_name || 'Not assigned'}</p>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <section data-testid="account-status">
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-lg font-bold">Account Status</h3>
            </div>
            <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-white/10 overflow-hidden">
              <div className="flex items-center gap-4 p-4 border-b border-slate-100 dark:border-white/5">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  employee?.status === 'approved' ? 'bg-green-100 dark:bg-green-500/20' : 'bg-amber-100 dark:bg-amber-500/20'
                )}>
                  {employee?.status === 'approved' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Account Status</p>
                  <p className="font-semibold capitalize">{employee?.status || 'Pending'}</p>
                </div>
                {employee?.status === 'approved' && (
                  <span className="px-2.5 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                    Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 p-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  employee?.kyc_status === 'approved' ? 'bg-green-100 dark:bg-green-500/20' : 'bg-amber-100 dark:bg-amber-500/20'
                )}>
                  {employee?.kyc_status === 'approved' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-500 dark:text-slate-400">KYC Status</p>
                  <p className="font-semibold capitalize">{employee?.kyc_status || 'Pending'}</p>
                </div>
                {employee?.kyc_status !== 'approved' && (
                  <Link to="/employee/kyc">
                    <Button size="sm" variant="outline" className="text-primary border-primary/30 hover:bg-primary/10">
                      Complete
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </section>

          {/* Recent Activity */}
          <section data-testid="recent-activity" className="pb-6">
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-lg font-bold">Recent Activity</h3>
              <Link to="/employee/transactions" className="text-sm font-medium text-primary hover:underline">
                See All
              </Link>
            </div>
            <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-white/10 overflow-hidden">
              {stats?.recent_transactions?.length > 0 ? (
                stats.recent_transactions.slice(0, 3).map((tx, index) => (
                  <div 
                    key={tx.id}
                    className={cn(
                      "p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors",
                      index < Math.min(stats.recent_transactions.length, 3) - 1 && "border-b border-slate-100 dark:border-white/5"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        tx.type === 'disbursement' ? 'bg-red-100 dark:bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'
                      )}>
                        {tx.type === 'disbursement' ? (
                          <ArrowUpRight className="w-5 h-5" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          {tx.type === 'disbursement' ? 'Early Withdrawal' : 'Shift Completed'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{formatDateTime(tx.created_at)}</p>
                      </div>
                    </div>
                    <span className={cn(
                      "text-sm font-bold",
                      tx.type === 'disbursement' ? 'text-red-500' : 'text-primary'
                    )}>
                      {tx.type === 'disbursement' ? '-' : '+'}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <History className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">No transactions yet</p>
                  <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Your activity will appear here</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <BottomNav active="home" />
    </div>
  );
}
