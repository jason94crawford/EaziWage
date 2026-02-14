import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Wallet, TrendingUp, Clock, ArrowRight, CreditCard, 
  AlertCircle, CheckCircle2, History, FileText, Bell,
  Home, User, ArrowUpRight, Calendar, Building2, ChevronRight, Work
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { dashboardApi, employeeApi } from '../../lib/api';
import { formatCurrency, formatDateTime, cn } from '../../lib/utils';
import { useTheme } from '../../lib/ThemeContext';

// Bottom Navigation Component
const BottomNav = ({ active }) => {
  const navigate = useNavigate();
  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/employee' },
    { id: 'wallet', icon: Wallet, label: 'Wallet', path: '/employee/advances' },
    { id: 'history', icon: History, label: 'History', path: '/employee/transactions' },
    { id: 'profile', icon: User, label: 'Profile', path: '/employee/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#15231b] border-t border-slate-200 dark:border-white/5 z-50 md:hidden">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors",
              active === item.id 
                ? "text-primary" 
                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            )}
            data-testid={`nav-${item.id}`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
      {/* iOS Home Indicator Spacing */}
      <div className="h-6 w-full bg-white dark:bg-[#15231b]" />
    </nav>
  );
};

// Sidebar Navigation for Desktop
const Sidebar = ({ active, employee }) => {
  const navigate = useNavigate();
  const navItems = [
    { id: 'home', icon: Home, label: 'Dashboard', path: '/employee' },
    { id: 'wallet', icon: CreditCard, label: 'Request Advance', path: '/employee/advances' },
    { id: 'history', icon: History, label: 'Transaction History', path: '/employee/transactions' },
    { id: 'kyc', icon: FileText, label: 'Documents & KYC', path: '/employee/kyc' },
    { id: 'settings', icon: User, label: 'Settings', path: '/employee/settings' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-[#152b1d] min-h-screen fixed left-0 top-0 border-r border-slate-200 dark:border-slate-800">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-black font-bold text-lg">E</span>
          </div>
          <span className="font-bold text-xl text-slate-900 dark:text-white">EaziWage</span>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-emerald-600 rounded-full flex items-center justify-center">
            <span className="text-black font-bold">{employee?.full_name?.[0] || 'U'}</span>
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white">{employee?.full_name || 'User'}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{employee?.employer_name || 'Employee'}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
              active === item.id 
                ? "bg-primary/20 text-primary" 
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
            )}
            data-testid={`sidebar-${item.id}`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button 
          onClick={() => {
            localStorage.removeItem('eaziwage_token');
            localStorage.removeItem('eaziwage_user');
            window.location.href = '/login';
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 transition-all"
          data-testid="logout-btn"
        >
          <ArrowRight className="w-5 h-5 rotate-180" />
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
  const { theme } = useTheme();

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
    const options = { month: 'short', day: 'numeric' };
    return lastDay.toLocaleDateString('en-US', options);
  };

  const getPayPeriod = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return `${firstDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${lastDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f8f6] dark:bg-[#102216] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 dark:text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error === 'profile_not_found') {
    return (
      <div className="min-h-screen bg-[#f5f8f6] dark:bg-[#102216] flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Complete Your Profile</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            You need to complete your employee profile before you can access the dashboard and request advances.
          </p>
          <Link to="/employee/onboarding">
            <Button className="bg-primary text-black hover:bg-primary/90 font-bold px-8 py-3" data-testid="complete-profile-btn">
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
  const remainingSalary = earnedWages - advanceLimit;
  const projectedSalary = earnedWages * 2; // Assuming full month projection
  const earnedProgress = earnedWages > 0 ? (advanceLimit / earnedWages) * 100 : 0;
  const withdrawnProgress = earnedWages > 0 ? (totalAdvances / earnedWages) * 100 : 0;

  const kycPending = employee?.kyc_status === 'pending' || employee?.kyc_status === 'submitted';
  const canRequestAdvance = employee?.status === 'approved' && employee?.kyc_status === 'approved' && earnedWages > 0;

  return (
    <div className="min-h-screen bg-[#f5f8f6] dark:bg-[#102216] text-slate-900 dark:text-white">
      <Sidebar active="home" employee={employee} />
      
      {/* Main Content */}
      <main className="md:ml-64 pb-28 md:pb-8">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-40 bg-[#f5f8f6]/95 dark:bg-[#102216]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/5">
          <div className="flex items-center p-4 justify-between max-w-lg mx-auto w-full">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-emerald-600 rounded-full flex items-center justify-center ring-2 ring-primary/20">
                  <span className="text-black font-bold">{employee?.full_name?.[0] || 'U'}</span>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-[#f5f8f6] dark:border-[#102216]" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{getGreeting()},</p>
                <h2 className="text-lg font-bold leading-tight">{employee?.full_name?.split(' ')[0] || 'User'}</h2>
              </div>
            </div>
            <button 
              className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              data-testid="notifications-btn"
            >
              <Bell className="w-6 h-6 text-slate-600 dark:text-slate-300" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
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
              className="relative p-3 bg-white dark:bg-[#1A2C20] rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-transparent"
              data-testid="notifications-btn-desktop"
            >
              <Bell className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#1A2C20]" />
            </button>
          </div>

          {/* KYC Alert */}
          {kycPending && (
            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-4 flex items-start gap-4" data-testid="kyc-alert">
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

          {/* Hero Balance Card */}
          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#1A2C20] shadow-sm border border-slate-200 dark:border-white/5" data-testid="withdraw-card">
            {/* Decorative Background Element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            
            <div className="relative p-6 flex flex-col items-center text-center z-10">
              <p className="text-slate-500 dark:text-[#9cbaa6] text-sm font-medium tracking-wide uppercase mb-2">
                Available to Withdraw
              </p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-primary" data-testid="available-balance">
                  {formatCurrency(advanceLimit)}
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">
                Instant transfer to your linked account
              </p>

              {/* Fee & Arrival Info */}
              <div className="w-full grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-50 dark:bg-[#102216]/50 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-200 dark:border-white/5">
                  <span className="text-xs text-slate-500 mb-1">Fee</span>
                  <span className="font-bold">3.5% - 6%</span>
                </div>
                <div className="bg-slate-50 dark:bg-[#102216]/50 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-200 dark:border-white/5">
                  <span className="text-xs text-slate-500 mb-1">Arrives</span>
                  <span className="font-bold">Instantly</span>
                </div>
              </div>

              <Link to="/employee/advances" className="w-full">
                <Button 
                  className="w-full flex items-center justify-center gap-2 rounded-xl h-14 bg-primary text-black text-base font-bold shadow-[0_0_20px_rgba(13,242,89,0.3)] hover:shadow-[0_0_25px_rgba(13,242,89,0.5)] hover:bg-[#0be052] transition-all active:scale-[0.98]"
                  disabled={!canRequestAdvance}
                  data-testid="request-withdrawal-btn"
                >
                  <Wallet className="w-5 h-5" />
                  Request Withdrawal
                </Button>
              </Link>
            </div>
          </div>

          {/* Salary Breakdown / Progress */}
          <section data-testid="salary-breakdown">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-lg font-bold">Salary Breakdown</h3>
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                {getPayPeriod()}
              </span>
            </div>
            <div className="bg-white dark:bg-[#1A2C20] p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5">
              {/* Main Progress Bar */}
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium text-slate-500 dark:text-[#9cbaa6]">Earned so far</span>
                <span className="text-lg font-bold">{formatCurrency(earnedWages)}</span>
              </div>
              <div className="relative h-4 w-full bg-slate-100 dark:bg-[#102216] rounded-full overflow-hidden mb-4">
                {/* Earned Segment */}
                <div 
                  className="absolute top-0 left-0 h-full bg-primary transition-all duration-1000 ease-out z-20 rounded-full"
                  style={{ width: `${Math.min(earnedProgress, 100)}%` }}
                />
                {/* Withdrawn Marker */}
                <div 
                  className="absolute top-0 left-0 h-full bg-white/30 z-30 border-r border-black/20"
                  style={{ width: `${Math.min(withdrawnProgress, earnedProgress)}%` }}
                />
              </div>

              {/* Legend / Details */}
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-white/30 ring-1 ring-slate-400 dark:ring-0" />
                    <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Withdrawn</p>
                  </div>
                  <p className="text-sm font-semibold">{formatCurrency(totalAdvances)}</p>
                </div>
                <div className="flex flex-col gap-1 border-l border-slate-200 dark:border-white/10 pl-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Available</p>
                  </div>
                  <p className="text-sm font-semibold text-primary">{formatCurrency(advanceLimit)}</p>
                </div>
                <div className="flex flex-col gap-1 border-l border-slate-200 dark:border-white/10 pl-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-white/10" />
                    <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Remaining</p>
                  </div>
                  <p className="text-sm font-semibold">{formatCurrency(remainingSalary > 0 ? remainingSalary : 0)}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Stats Grid */}
          <section className="grid grid-cols-2 gap-3" data-testid="quick-stats">
            <div className="bg-white dark:bg-[#1A2C20] p-4 rounded-2xl flex flex-col justify-between h-32 shadow-sm border border-slate-200 dark:border-white/5 relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 text-slate-100 dark:text-white/5">
                <Calendar className="w-20 h-20" />
              </div>
              <div className="flex items-start justify-between relative z-10">
                <div className="p-2 bg-blue-100 dark:bg-blue-500/10 rounded-lg text-blue-500">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-sm text-slate-500 dark:text-[#9cbaa6] mb-0.5">Next Payday</p>
                <p className="text-xl font-bold">{getNextPayday()}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-[#1A2C20] p-4 rounded-2xl flex flex-col justify-between h-32 shadow-sm border border-slate-200 dark:border-white/5 relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 text-slate-100 dark:text-white/5">
                <TrendingUp className="w-20 h-20" />
              </div>
              <div className="flex items-start justify-between relative z-10">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-sm text-slate-500 dark:text-[#9cbaa6] mb-0.5">Projected Salary</p>
                <p className="text-xl font-bold">{formatCurrency(projectedSalary)}</p>
              </div>
            </div>
          </section>

          {/* Recent Activity */}
          <section data-testid="recent-activity">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-lg font-bold">Recent Activity</h3>
              <Link to="/employee/transactions" className="text-sm font-medium text-primary hover:underline">
                See All
              </Link>
            </div>
            <div className="bg-white dark:bg-[#1A2C20] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 shadow-sm">
              {stats?.recent_transactions?.length > 0 ? (
                stats.recent_transactions.slice(0, 3).map((tx, index) => (
                  <div 
                    key={tx.id}
                    className={cn(
                      "p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer",
                      index < stats.recent_transactions.slice(0, 3).length - 1 && "border-b border-slate-100 dark:border-white/5"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
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
                        <p className="text-xs text-slate-500">{formatDateTime(tx.created_at)}</p>
                      </div>
                    </div>
                    <span className={cn(
                      "text-sm font-bold",
                      tx.type === 'disbursement' ? '' : 'text-primary'
                    )}>
                      {tx.type === 'disbursement' ? '-' : '+'}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <History className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium">No transactions yet</p>
                  <p className="text-slate-400 text-sm mt-1">Your activity will appear here</p>
                </div>
              )}
            </div>
          </section>

          {/* Account Status */}
          <section data-testid="account-status" className="mb-8">
            <h3 className="text-lg font-bold mb-3 px-1">Account Status</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-4 p-4 bg-white dark:bg-[#1A2C20] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
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
                  <p className="text-slate-500 text-sm">Account</p>
                  <p className="font-medium capitalize">{employee?.status || 'Pending'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white dark:bg-[#1A2C20] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
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
                  <p className="text-slate-500 text-sm">KYC Status</p>
                  <p className="font-medium capitalize">{employee?.kyc_status || 'Pending'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white dark:bg-[#1A2C20] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-500 text-sm">Employer</p>
                  <p className="font-medium">{employee?.employer_name || 'Not assigned'}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <BottomNav active="home" />
    </div>
  );
}
