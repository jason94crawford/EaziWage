import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Wallet, TrendingUp, Clock, ArrowRight, AlertCircle, CheckCircle2, 
  History, Calendar, Building2, Zap, ArrowUpRight, ChevronRight, 
  Bell, X, LogOut, Sun, Moon
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { dashboardApi, employeeApi } from '../../lib/api';
import { formatCurrency, cn } from '../../lib/utils';
import { 
  EmployeeDarkLayout, 
  DarkCard, 
  DarkIconButton,
  DarkNotificationsPanel,
  darkThemeColors 
} from '../../components/employee/EmployeeDarkLayout';

// Dashboard Header Component
const DashboardHeader = ({ user, employee }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  
  const notifications = [
    { type: 'success', title: 'KYC Submitted', message: 'Your documents are under review', time: '2 hours ago' },
    { type: 'info', title: 'Welcome to EaziWage', message: 'Complete your profile to get started', time: '1 day ago' },
  ];
  
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

  return (
    <>
      <header className="relative z-10 max-w-md mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/employee/settings" className="shrink-0">
              {user?.profile_picture_url ? (
                <img 
                  src={`${process.env.REACT_APP_BACKEND_URL}${user.profile_picture_url}`} 
                  alt="Profile" 
                  className="w-11 h-11 rounded-xl object-cover"
                  style={{ border: `2px solid ${darkThemeColors.accent}30` }}
                />
              ) : (
                <div 
                  className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg"
                  style={{ 
                    background: `linear-gradient(135deg, ${darkThemeColors.accent}, #10b981)`,
                    boxShadow: `0 4px 20px ${darkThemeColors.accentGlow}`
                  }}
                >
                  <span className="font-bold text-sm" style={{ color: darkThemeColors.background }}>
                    {employee?.full_name?.[0] || user?.full_name?.[0] || 'U'}
                  </span>
                </div>
              )}
            </Link>
            <div className="min-w-0">
              <p className="text-[11px] font-medium" style={{ color: darkThemeColors.textMuted }}>
                {getGreeting()}
              </p>
              <h2 className="text-base font-bold truncate" style={{ color: darkThemeColors.textPrimary }}>
                {employee?.full_name?.split(' ')[0] || user?.full_name?.split(' ')[0] || 'User'}
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowNotifications(true)}
              className="relative p-2.5 rounded-xl transition-colors"
              style={{ color: darkThemeColors.textSecondary }}
              data-testid="notifications-btn"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span 
                  className="absolute top-2 right-2 w-2 h-2 rounded-full"
                  style={{ background: darkThemeColors.accent }}
                />
              )}
            </button>
            <button 
              onClick={handleLogout}
              className="p-2.5 rounded-xl transition-colors hover:bg-red-500/10"
              style={{ color: darkThemeColors.textSecondary }}
              data-testid="logout-btn"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
      
      <DarkNotificationsPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
      />
    </>
  );
};

// Animated Speed Dial Counter Component
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
  
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const circumference = 2 * Math.PI * 44;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="relative w-44 h-44 mx-auto">
      {/* Outer glow */}
      <div 
        className="absolute inset-4 rounded-full blur-2xl"
        style={{ background: darkThemeColors.accentGlow }}
      />
      
      {/* SVG Progress Ring */}
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Background track */}
        <circle 
          cx="50" cy="50" r="44" 
          fill="none" 
          strokeWidth="5" 
          style={{ stroke: darkThemeColors.border }}
        />
        {/* Progress arc */}
        <circle 
          cx="50" cy="50" r="44" 
          fill="none" 
          stroke="url(#dialGradientDark)" 
          strokeWidth="5" 
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
        {/* Small dot markers */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x = 50 + 44 * Math.cos(angle);
          const y = 50 + 44 * Math.sin(angle);
          return (
            <circle 
              key={i}
              cx={x} cy={y} r="1.5"
              fill={(i * 30) <= (percentage * 3.6) ? darkThemeColors.accent : darkThemeColors.border}
              className="transition-colors duration-300"
            />
          );
        })}
        <defs>
          <linearGradient id="dialGradientDark" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={darkThemeColors.accent} />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-center px-4">
          <span 
            className="block text-[10px] font-semibold uppercase tracking-widest mb-1"
            style={{ color: darkThemeColors.textMuted }}
          >
            Available
          </span>
          <span 
            className="block text-2xl font-bold leading-none"
            style={{ color: darkThemeColors.textPrimary }}
            data-testid="available-amount"
          >
            {formatCurrency(displayValue)}
          </span>
        </div>
      </div>
    </div>
  );
};

// Dark Stat Card Component
const DarkStatCard = ({ icon: Icon, label, value, subtext, accentColor = darkThemeColors.accent }) => (
  <DarkCard className="p-4">
    <div 
      className="w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 shadow-lg"
      style={{ 
        background: accentColor,
        boxShadow: `0 4px 12px ${accentColor}40`
      }}
    >
      <Icon className="w-4 h-4" style={{ color: darkThemeColors.background }} />
    </div>
    <p className="text-[11px] font-medium mb-0.5" style={{ color: darkThemeColors.textMuted }}>{label}</p>
    <p className="text-base font-bold" style={{ color: darkThemeColors.textPrimary }}>{value}</p>
    {subtext && <p className="text-[10px] mt-0.5" style={{ color: darkThemeColors.textMuted }}>{subtext}</p>}
  </DarkCard>
);

export default function EmployeeDashboard() {
  const [stats, setStats] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('eaziwage_user') || '{}');

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

  const getNextPayday = () => {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const daysUntil = Math.ceil((lastDay - today) / (1000 * 60 * 60 * 24));
    return { date: lastDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), daysUntil };
  };

  if (loading) {
    return (
      <EmployeeDarkLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div 
            className="w-12 h-12 border-4 rounded-full animate-spin"
            style={{ 
              borderColor: `${darkThemeColors.accent}30`,
              borderTopColor: darkThemeColors.accent
            }}
          />
        </div>
      </EmployeeDarkLayout>
    );
  }

  if (error === 'profile_not_found') {
    return (
      <EmployeeDarkLayout>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
          <div 
            className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-lg"
            style={{ 
              background: darkThemeColors.accentGlow,
              boxShadow: `0 8px 32px ${darkThemeColors.accentGlow}`
            }}
          >
            <AlertCircle className="w-10 h-10" style={{ color: darkThemeColors.accent }} />
          </div>
          <h1 className="text-2xl font-bold mb-3 text-center" style={{ color: darkThemeColors.textPrimary }}>
            Complete Your Profile
          </h1>
          <p className="mb-8 text-center text-sm max-w-xs" style={{ color: darkThemeColors.textSecondary }}>
            Set up your employee profile to start accessing wage advances.
          </p>
          <Link to="/employee/onboarding">
            <Button 
              className="h-12 px-8 font-semibold rounded-xl shadow-lg"
              style={{ 
                background: `linear-gradient(135deg, ${darkThemeColors.accent}, #10b981)`,
                color: darkThemeColors.background,
                boxShadow: `0 8px 24px ${darkThemeColors.accentGlow}`
              }}
              data-testid="complete-profile-btn"
            >
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </EmployeeDarkLayout>
    );
  }

  const earnedWages = stats?.earned_wages || 0;
  const advanceLimit = stats?.advance_limit || 0;
  const totalAdvances = stats?.total_advances || 0;
  const kycPending = employee?.kyc_status === 'pending' || employee?.kyc_status === 'submitted';
  const canRequestAdvance = employee?.status === 'approved' && employee?.kyc_status === 'approved' && advanceLimit > 0;
  const payday = getNextPayday();

  return (
    <EmployeeDarkLayout>
      <DashboardHeader user={user} employee={employee} />

      <main className="relative z-10 max-w-md mx-auto px-4 pb-28 space-y-5">
        {/* KYC Alert Banner */}
        {kycPending && (
          <DarkCard className="p-3.5 flex items-center gap-3" data-testid="kyc-alert">
            <DarkIconButton icon={AlertCircle} variant="accent" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: darkThemeColors.textPrimary }}>
                Verification in progress
              </p>
              <p className="text-[11px]" style={{ color: darkThemeColors.textSecondary }}>
                {employee?.kyc_status === 'submitted' ? 'Usually takes 1-2 business days' : 'Complete your KYC to continue'}
              </p>
            </div>
            <Link to="/employee/onboarding">
              <ChevronRight className="w-5 h-5" style={{ color: darkThemeColors.accent }} />
            </Link>
          </DarkCard>
        )}

        {/* Main Balance Card */}
        <DarkCard className="p-6" glow data-testid="balance-card">
          <SpeedDialCounter value={advanceLimit} max={earnedWages || advanceLimit * 2 || 10000} />
          
          {/* Quick Info Row */}
          <div className="flex items-center justify-center gap-6 mt-4 mb-5">
            <div className="text-center">
              <span className="text-[10px] block" style={{ color: darkThemeColors.textMuted }}>Fee</span>
              <span className="text-sm font-bold" style={{ color: darkThemeColors.textPrimary }}>3.5% - 6%</span>
            </div>
            <div className="w-px h-8" style={{ background: darkThemeColors.border }} />
            <div className="text-center">
              <span className="text-[10px] block" style={{ color: darkThemeColors.textMuted }}>Speed</span>
              <span className="text-sm font-bold flex items-center gap-1" style={{ color: darkThemeColors.textPrimary }}>
                <Zap className="w-3 h-3" style={{ color: darkThemeColors.accent }} /> Instant
              </span>
            </div>
          </div>

          {/* Request Button */}
          <Link to="/employee/advances" className="block">
            <Button 
              className="w-full h-12 rounded-xl font-semibold text-sm shadow-lg transition-all duration-300 hover:scale-[1.02]"
              disabled={!canRequestAdvance} 
              style={{ 
                background: `linear-gradient(135deg, ${darkThemeColors.accent}, #10b981)`,
                color: darkThemeColors.background,
                boxShadow: `0 8px 24px ${darkThemeColors.accentGlow}`,
                opacity: canRequestAdvance ? 1 : 0.5
              }}
              data-testid="request-advance-btn"
            >
              <Wallet className="w-4 h-4 mr-2" /> 
              Request Advance
              <ArrowUpRight className="w-4 h-4 ml-auto" />
            </Button>
          </Link>
        </DarkCard>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3" data-testid="stats-grid">
          <DarkStatCard 
            icon={TrendingUp} 
            label="Earned This Month" 
            value={formatCurrency(earnedWages)}
            accentColor={darkThemeColors.accent}
          />
          <DarkStatCard 
            icon={Calendar} 
            label="Next Payday" 
            value={payday.date}
            subtext={`${payday.daysUntil} days away`}
            accentColor="#3b82f6"
          />
          <DarkStatCard 
            icon={Wallet} 
            label="Total Withdrawn" 
            value={formatCurrency(totalAdvances)}
            accentColor="#f59e0b"
          />
          <DarkStatCard 
            icon={Building2} 
            label="Employer" 
            value={employee?.employer_name?.split(' ')[0] || 'N/A'}
            subtext={employee?.job_title || 'Employee'}
            accentColor="#8b5cf6"
          />
        </div>

        {/* Account Status */}
        <DarkCard className="overflow-hidden" data-testid="account-status">
          <div 
            className="px-4 py-3 flex items-center justify-between"
            style={{ borderBottom: `1px solid ${darkThemeColors.border}` }}
          >
            <h3 className="text-sm font-bold" style={{ color: darkThemeColors.textPrimary }}>Account Status</h3>
            <span 
              className="text-[10px] font-semibold px-2 py-1 rounded-full"
              style={{
                background: employee?.status === 'approved' && employee?.kyc_status === 'approved' 
                  ? darkThemeColors.accentGlow 
                  : 'rgba(245, 158, 11, 0.15)',
                color: employee?.status === 'approved' && employee?.kyc_status === 'approved' 
                  ? darkThemeColors.accent 
                  : '#f59e0b'
              }}
            >
              {employee?.status === 'approved' && employee?.kyc_status === 'approved' ? 'Active' : 'Pending'}
            </span>
          </div>
          
          <div>
            {/* Account Status Item */}
            <div 
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: `1px solid ${darkThemeColors.border}` }}
            >
              <DarkIconButton 
                icon={employee?.status === 'approved' ? CheckCircle2 : Clock} 
                variant={employee?.status === 'approved' ? 'accent' : 'muted'}
              />
              <div className="flex-1">
                <p className="text-xs" style={{ color: darkThemeColors.textMuted }}>Account</p>
                <p className="text-sm font-semibold capitalize" style={{ color: darkThemeColors.textPrimary }}>
                  {employee?.status || 'Pending'}
                </p>
              </div>
            </div>
            
            {/* KYC Status Item */}
            <div className="flex items-center gap-3 px-4 py-3">
              <DarkIconButton 
                icon={employee?.kyc_status === 'approved' ? CheckCircle2 : Clock} 
                variant={employee?.kyc_status === 'approved' ? 'accent' : 'muted'}
              />
              <div className="flex-1">
                <p className="text-xs" style={{ color: darkThemeColors.textMuted }}>KYC Verification</p>
                <p className="text-sm font-semibold capitalize" style={{ color: darkThemeColors.textPrimary }}>
                  {employee?.kyc_status || 'Pending'}
                </p>
              </div>
              {employee?.kyc_status !== 'approved' && (
                <Link to="/employee/onboarding">
                  <Button 
                    size="sm" 
                    className="text-xs h-7 px-3 rounded-lg"
                    style={{ 
                      background: 'transparent', 
                      color: darkThemeColors.accent,
                      border: `1px solid ${darkThemeColors.accent}30`
                    }}
                  >
                    Complete
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </DarkCard>

        {/* Recent Activity */}
        <DarkCard className="overflow-hidden" data-testid="recent-activity">
          <div 
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: `1px solid ${darkThemeColors.border}` }}
          >
            <h3 className="text-sm font-bold" style={{ color: darkThemeColors.textPrimary }}>Recent Activity</h3>
            <Link 
              to="/employee/transactions" 
              className="text-xs font-semibold flex items-center gap-1"
              style={{ color: darkThemeColors.accent }}
            >
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          
          {stats?.recent_transactions?.length > 0 ? (
            <div>
              {stats.recent_transactions.slice(0, 3).map((tx, i) => (
                <div 
                  key={tx.id} 
                  className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: i < 2 ? `1px solid ${darkThemeColors.border}` : 'none' }}
                >
                  <div className="flex items-center gap-3">
                    <DarkIconButton 
                      icon={tx.type === 'disbursement' ? Wallet : TrendingUp}
                      variant={tx.type === 'disbursement' ? 'muted' : 'accent'}
                    />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: darkThemeColors.textPrimary }}>
                        {tx.type === 'disbursement' ? 'Withdrawal' : 'Advance Request'}
                      </p>
                      <p className="text-[10px]" style={{ color: darkThemeColors.textMuted }}>
                        {new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <span 
                    className="text-sm font-bold"
                    style={{ color: tx.type === 'disbursement' ? darkThemeColors.textSecondary : darkThemeColors.accent }}
                  >
                    {tx.type === 'disbursement' ? '-' : ''}{formatCurrency(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
                style={{ background: darkThemeColors.border }}
              >
                <History className="w-7 h-7" style={{ color: darkThemeColors.textMuted }} />
              </div>
              <p className="font-medium text-sm" style={{ color: darkThemeColors.textSecondary }}>
                No transactions yet
              </p>
              <p className="text-xs mt-1" style={{ color: darkThemeColors.textMuted }}>
                Your activity will appear here
              </p>
            </div>
          )}
        </DarkCard>
      </main>
    </EmployeeDarkLayout>
  );
}
