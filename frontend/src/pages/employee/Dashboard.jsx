import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Wallet, TrendingUp, Clock, ArrowRight, 
  AlertCircle, CheckCircle2, History, Bell,
  Home, User, Calendar, Building2, Sun, Moon, LogOut
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { dashboardApi, employeeApi } from '../../lib/api';
import { formatCurrency, cn } from '../../lib/utils';
import { useTheme } from '../../lib/ThemeContext';

// Animated Speed Dial Counter Component - Fixed text positioning
const SpeedDialCounter = ({ value, max }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const animationRef = useRef(null);
  
  useEffect(() => {
    const startTime = performance.now();
    const duration = 1500;
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * easeOut));
      if (progress < 1) animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [value]);
  
  const percentage = max > 0 ? (value / max) * 100 : 0;
  
  return (
    <div className="relative w-44 h-44 mx-auto">
      {/* Glow effect */}
      <div className="absolute inset-4 rounded-full bg-primary/20 blur-xl" />
      
      {/* SVG Progress Ring */}
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800/50" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="url(#dialGradient)" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={`${percentage * 2.51} 251`} className="transition-all duration-1000 ease-out" />
        <defs>
          <linearGradient id="dialGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0df259" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center text - positioned properly */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Available</span>
        <span className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{formatCurrency(displayValue)}</span>
      </div>
    </div>
  );
};

// Bottom Navigation - Green theme only
const BottomNav = ({ active }) => {
  const navigate = useNavigate();
  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/employee' },
    { id: 'wallet', icon: Wallet, label: 'Advance', path: '/employee/advances' },
    { id: 'history', icon: History, label: 'History', path: '/employee/transactions' },
    { id: 'profile', icon: User, label: 'Profile', path: '/employee/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto px-4 pb-2">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-around h-16">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => navigate(item.path)}
                className={cn("flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all",
                  active === item.id ? "text-primary" : "text-slate-400 dark:text-slate-500"
                )} data-testid={`nav-${item.id}`}>
                <item.icon className={cn("w-5 h-5", active === item.id && "scale-110")} />
                <span className="text-[10px] font-semibold">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
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
        if (err.response?.status === 404) setError('profile_not_found');
        else setError('Failed to load dashboard');
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getNextPayday = () => {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const daysUntil = Math.ceil((lastDay - today) / (1000 * 60 * 60 * 24));
    return { date: lastDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), daysUntil };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 bg-grid" />
        <div className="relative"><div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
      </div>
    );
  }

  if (error === 'profile_not_found') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-5">
            <AlertCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-3 text-center">Complete Your Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6 text-center text-sm max-w-xs">Set up your employee profile to access wage advances.</p>
          <Link to="/employee/onboarding">
            <Button className="bg-gradient-to-r from-primary to-emerald-600 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-primary/25" data-testid="complete-profile-btn">
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const earnedWages = stats?.earned_wages || 0;
  const advanceLimit = stats?.advance_limit || 0;
  const totalAdvances = stats?.total_advances || 0;
  const kycPending = employee?.kyc_status === 'pending' || employee?.kyc_status === 'submitted';
  const canRequestAdvance = employee?.status === 'approved' && employee?.kyc_status === 'approved' && advanceLimit > 0;
  const payday = getNextPayday();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/8 rounded-full blur-[100px]" />

      {/* Header */}
      <header className="relative z-10 max-w-md mx-auto px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-emerald-600 rounded-full flex items-center justify-center shadow-md shadow-primary/25">
              <span className="text-white font-bold">{employee?.full_name?.[0] || 'U'}</span>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{getGreeting()}</p>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">{employee?.full_name?.split(' ')[0] || 'User'}</h2>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={toggleTheme} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all" data-testid="theme-toggle">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button className="relative p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all" data-testid="notifications-btn">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
            </button>
            <button onClick={handleLogout} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-red-500 transition-all" data-testid="logout-btn">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-md mx-auto px-5 pb-28 space-y-4">
        {/* KYC Alert */}
        {kycPending && (
          <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-3 flex items-center gap-3 border border-primary/10" data-testid="kyc-alert">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Verification in progress</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">{employee?.kyc_status === 'submitted' ? 'Review takes 1-2 days' : 'Complete your KYC'}</p>
            </div>
          </div>
        )}

        {/* Speed Dial Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-slate-200/50 dark:border-slate-700/50" data-testid="withdraw-card">
          <SpeedDialCounter value={advanceLimit} max={earnedWages || advanceLimit * 2 || 10000} />
          
          <div className="grid grid-cols-2 gap-2 mt-4 mb-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2.5 text-center">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Fee</span>
              <span className="font-bold text-slate-900 dark:text-white text-xs">3.5% - 6%</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2.5 text-center">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Transfer</span>
              <span className="font-bold text-slate-900 dark:text-white text-xs">Instant</span>
            </div>
          </div>

          <Link to="/employee/advances" className="block">
            <Button className="w-full h-11 rounded-xl bg-gradient-to-r from-primary to-emerald-600 text-white font-semibold text-sm shadow-lg shadow-primary/25"
              disabled={!canRequestAdvance} data-testid="request-withdrawal-btn">
              <Wallet className="w-4 h-4 mr-2" /> Request Withdrawal
            </Button>
          </Link>
        </div>

        {/* Stats Grid - Green theme only */}
        <div className="grid grid-cols-2 gap-3" data-testid="quick-stats">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Earned Wages</p>
            <p className="text-base font-bold text-slate-900 dark:text-white">{formatCurrency(earnedWages)}</p>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Next Payday</p>
            <p className="text-base font-bold text-slate-900 dark:text-white">{payday.date}</p>
            <p className="text-[9px] text-slate-400">{payday.daysUntil} days</p>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
              <Wallet className="w-4 h-4 text-primary" />
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Withdrawn</p>
            <p className="text-base font-bold text-slate-900 dark:text-white">{formatCurrency(totalAdvances)}</p>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
              <Building2 className="w-4 h-4 text-primary" />
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Employer</p>
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{employee?.employer_name || 'Not assigned'}</p>
          </div>
        </div>

        {/* Account Status */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden" data-testid="account-status">
          <div className="px-4 py-2.5 border-b border-slate-200/50 dark:border-slate-700/50">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs">Account Status</h3>
          </div>
          <div className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", employee?.status === 'approved' ? 'bg-primary/10' : 'bg-slate-100 dark:bg-slate-800')}>
                {employee?.status === 'approved' ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <Clock className="w-4 h-4 text-slate-400" />}
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-slate-400">Account</p>
                <p className="font-semibold text-slate-900 dark:text-white text-xs capitalize">{employee?.status || 'Pending'}</p>
              </div>
              {employee?.status === 'approved' && <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-semibold rounded-full">Verified</span>}
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", employee?.kyc_status === 'approved' ? 'bg-primary/10' : 'bg-slate-100 dark:bg-slate-800')}>
                {employee?.kyc_status === 'approved' ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <Clock className="w-4 h-4 text-slate-400" />}
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-slate-400">KYC Status</p>
                <p className="font-semibold text-slate-900 dark:text-white text-xs capitalize">{employee?.kyc_status || 'Pending'}</p>
              </div>
              {employee?.kyc_status !== 'approved' && (
                <Link to="/employee/onboarding">
                  <Button size="sm" variant="ghost" className="text-primary text-[10px] h-6 px-2">Complete</Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden" data-testid="recent-activity">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200/50 dark:border-slate-700/50">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs">Recent Activity</h3>
            <Link to="/employee/transactions" className="text-[10px] font-semibold text-primary">See All</Link>
          </div>
          {stats?.recent_transactions?.length > 0 ? (
            <div className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
              {stats.recent_transactions.slice(0, 3).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", tx.type === 'disbursement' ? 'bg-slate-100 dark:bg-slate-800' : 'bg-primary/10')}>
                      {tx.type === 'disbursement' ? <Wallet className="w-4 h-4 text-slate-500" /> : <CheckCircle2 className="w-4 h-4 text-primary" />}
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-slate-900 dark:text-white">{tx.type === 'disbursement' ? 'Withdrawal' : 'Earned'}</p>
                      <p className="text-[9px] text-slate-400">{new Date(tx.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={cn("text-xs font-bold", tx.type === 'disbursement' ? 'text-slate-600 dark:text-slate-300' : 'text-primary')}>
                    {tx.type === 'disbursement' ? '-' : '+'}{formatCurrency(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-2">
                <History className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-xs">No transactions yet</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav active="home" />
    </div>
  );
}
