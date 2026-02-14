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

// Animated Speed Dial Counter Component
const SpeedDialCounter = ({ value, max, label }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const animationRef = useRef(null);
  
  useEffect(() => {
    const startTime = performance.now();
    const duration = 1500;
    const startValue = 0;
    const endValue = value;
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * easeOut;
      setDisplayValue(Math.round(currentValue));
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [value]);
  
  const percentage = max > 0 ? (value / max) * 100 : 0;
  
  return (
    <div className="relative w-52 h-52 mx-auto">
      <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-200 dark:text-slate-800" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="url(#gradient)" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={`${percentage * 2.64} 264`} className="transition-all duration-1000" />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0df259" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{label}</span>
        <span className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrency(displayValue)}</span>
        <span className="text-xs text-slate-400 dark:text-slate-500 mt-1">of {formatCurrency(max)}</span>
      </div>
    </div>
  );
};

// Bottom Navigation Component - Centered 4 icons
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
        <div className="glass-card rounded-2xl shadow-xl border border-slate-200/50 dark:border-white/10">
          <div className="flex items-center justify-around h-16">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-300",
                  active === item.id 
                    ? "text-primary" 
                    : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                )}
                data-testid={`nav-${item.id}`}
              >
                <item.icon className={cn("w-5 h-5 transition-transform", active === item.id && "scale-110")} />
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
        <div className="relative flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (error === 'profile_not_found') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px]" />
        
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <AlertCircle className="w-10 h-10 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 text-center">Complete Your Profile</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8 text-center max-w-sm">
            Complete your employee profile before accessing the dashboard and requesting advances.
          </p>
          <Link to="/employee/onboarding">
            <Button className="bg-gradient-to-r from-primary to-emerald-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-primary/30" data-testid="complete-profile-btn">
              Complete Profile <ArrowRight className="w-4 h-4 ml-2" />
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
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 relative overflow-hidden">
      {/* Background - Same as Login */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/5 rounded-full blur-[200px]" />

      {/* Header */}
      <header className="relative z-10 max-w-md mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-primary to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="text-white font-bold text-lg">{employee?.full_name?.[0] || 'U'}</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{getGreeting()}</p>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">{employee?.full_name?.split(' ')[0] || 'User'}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all" data-testid="theme-toggle">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="relative p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all" data-testid="notifications-btn">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button onClick={handleLogout} className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all" data-testid="logout-btn">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-md mx-auto px-4 pb-28 space-y-5">
        {/* KYC Alert */}
        {kycPending && (
          <div className="glass-card rounded-2xl p-4 flex items-start gap-3 border border-amber-200/50 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/10" data-testid="kyc-alert">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-800 dark:text-amber-200 text-sm">Complete verification</h3>
              <p className="text-xs text-amber-700 dark:text-amber-300/80 mt-0.5">
                {employee?.kyc_status === 'submitted' ? 'Documents under review (1-2 days)' : 'Upload KYC documents to access advances'}
              </p>
            </div>
          </div>
        )}

        {/* Speed Dial Card */}
        <div className="glass-card rounded-3xl p-6 shadow-xl" data-testid="withdraw-card">
          <SpeedDialCounter value={advanceLimit} max={earnedWages || advanceLimit * 2 || 10000} label="Available" />
          
          <div className="grid grid-cols-2 gap-3 mt-5 mb-5">
            <div className="bg-slate-50/80 dark:bg-slate-800/50 rounded-xl p-3 text-center border border-slate-200/50 dark:border-slate-700/50">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">Fee Rate</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">3.5% - 6%</span>
            </div>
            <div className="bg-slate-50/80 dark:bg-slate-800/50 rounded-xl p-3 text-center border border-slate-200/50 dark:border-slate-700/50">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">Transfer</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">Instant</span>
            </div>
          </div>

          <Link to="/employee/advances" className="block">
            <Button 
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-emerald-600 text-white font-bold shadow-xl shadow-primary/30 btn-glow"
              disabled={!canRequestAdvance}
              data-testid="request-withdrawal-btn"
            >
              <Wallet className="w-5 h-5 mr-2" /> Request Withdrawal
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3" data-testid="quick-stats">
          <div className="glass-card p-4 rounded-2xl">
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Earned Wages</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(earnedWages)}</p>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="w-9 h-9 bg-blue-500/10 rounded-lg flex items-center justify-center mb-2">
              <Calendar className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Next Payday</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{payday.date}</p>
            <p className="text-[10px] text-slate-400">{payday.daysUntil} days away</p>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="w-9 h-9 bg-orange-500/10 rounded-lg flex items-center justify-center mb-2">
              <Wallet className="w-4 h-4 text-orange-500" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Withdrawn</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(totalAdvances)}</p>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="w-9 h-9 bg-purple-500/10 rounded-lg flex items-center justify-center mb-2">
              <Building2 className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Employer</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{employee?.employer_name || 'Not assigned'}</p>
          </div>
        </div>

        {/* Account Status */}
        <div className="glass-card rounded-2xl overflow-hidden" data-testid="account-status">
          <div className="px-4 py-3 border-b border-slate-200/50 dark:border-slate-700/50">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Account Status</h3>
          </div>
          <div className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
            <div className="flex items-center gap-3 p-4">
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", employee?.status === 'approved' ? 'bg-green-100 dark:bg-green-500/20' : 'bg-amber-100 dark:bg-amber-500/20')}>
                {employee?.status === 'approved' ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Clock className="w-4 h-4 text-amber-600" />}
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500 dark:text-slate-400">Account</p>
                <p className="font-semibold text-slate-900 dark:text-white text-sm capitalize">{employee?.status || 'Pending'}</p>
              </div>
              {employee?.status === 'approved' && <span className="px-2 py-0.5 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-[10px] font-semibold rounded-full">Verified</span>}
            </div>
            <div className="flex items-center gap-3 p-4">
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", employee?.kyc_status === 'approved' ? 'bg-green-100 dark:bg-green-500/20' : 'bg-amber-100 dark:bg-amber-500/20')}>
                {employee?.kyc_status === 'approved' ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Clock className="w-4 h-4 text-amber-600" />}
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500 dark:text-slate-400">KYC Status</p>
                <p className="font-semibold text-slate-900 dark:text-white text-sm capitalize">{employee?.kyc_status || 'Pending'}</p>
              </div>
              {employee?.kyc_status !== 'approved' && (
                <Link to="/employee/onboarding">
                  <Button size="sm" variant="outline" className="text-primary border-primary/30 hover:bg-primary/10 text-xs h-7 px-2">Complete</Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card rounded-2xl overflow-hidden" data-testid="recent-activity">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/50 dark:border-slate-700/50">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Recent Activity</h3>
            <Link to="/employee/transactions" className="text-xs font-semibold text-primary">See All</Link>
          </div>
          {stats?.recent_transactions?.length > 0 ? (
            <div className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
              {stats.recent_transactions.slice(0, 3).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-9 h-9 rounded-full flex items-center justify-center", tx.type === 'disbursement' ? 'bg-red-100 dark:bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary')}>
                      {tx.type === 'disbursement' ? <Wallet className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">{tx.type === 'disbursement' ? 'Withdrawal' : 'Shift Completed'}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{new Date(tx.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={cn("text-sm font-bold", tx.type === 'disbursement' ? 'text-red-500' : 'text-primary')}>
                    {tx.type === 'disbursement' ? '-' : '+'}{formatCurrency(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <History className="w-7 h-7 text-slate-400" />
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">No transactions yet</p>
              <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Your activity will appear here</p>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav active="home" />
    </div>
  );
}
