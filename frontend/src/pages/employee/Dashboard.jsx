import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Wallet, TrendingUp, Clock, ArrowRight, CreditCard, 
  AlertCircle, CheckCircle2, History, FileText, Bell,
  Home, User, ArrowUpRight, Calendar, Building2, ChevronRight
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { dashboardApi, employeeApi } from '../../lib/api';
import { formatCurrency, formatDateTime, cn } from '../../lib/utils';

// Bottom Navigation Component
const BottomNav = ({ active }) => {
  const navigate = useNavigate();
  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/employee/dashboard' },
    { id: 'wallet', icon: Wallet, label: 'Wallet', path: '/employee/advances' },
    { id: 'history', icon: History, label: 'History', path: '/employee/transactions' },
    { id: 'profile', icon: User, label: 'Profile', path: '/employee/kyc' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 px-4 py-3 z-50 md:hidden">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-colors",
              active === item.id ? "text-primary" : "text-slate-500 hover:text-slate-300"
            )}
            data-testid={`nav-${item.id}`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Sidebar Navigation for Desktop
const Sidebar = ({ active, employee }) => {
  const navigate = useNavigate();
  const navItems = [
    { id: 'home', icon: Home, label: 'Dashboard', path: '/employee/dashboard' },
    { id: 'wallet', icon: CreditCard, label: 'Request Advance', path: '/employee/advances' },
    { id: 'history', icon: History, label: 'Transaction History', path: '/employee/transactions' },
    { id: 'kyc', icon: FileText, label: 'Documents & KYC', path: '/employee/kyc' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 min-h-screen fixed left-0 top-0 border-r border-slate-800">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <span className="font-heading font-bold text-xl text-white">EaziWage</span>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-emerald-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">{employee?.full_name?.[0] || 'U'}</span>
          </div>
          <div>
            <p className="font-medium text-white">{employee?.full_name || 'User'}</p>
            <p className="text-sm text-slate-400">{employee?.employer_name || 'Employee'}</p>
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
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
            data-testid={`sidebar-${item.id}`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
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
  const location = useLocation();

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error === 'profile_not_found') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-amber-500" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-white mb-4">Complete Your Profile</h1>
          <p className="text-slate-400 mb-8">
            You need to complete your employee profile before you can access the dashboard and request advances.
          </p>
          <Link to="/employee/onboarding">
            <Button className="bg-primary text-white hover:bg-primary/90 px-8 py-3" data-testid="complete-profile-btn">
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

  const kycPending = employee?.kyc_status === 'pending' || employee?.kyc_status === 'submitted';
  const canRequestAdvance = employee?.status === 'approved' && employee?.kyc_status === 'approved' && earnedWages > 0;

  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar active="home" employee={employee} />
      
      {/* Main Content */}
      <main className="md:ml-64 pb-24 md:pb-8">
        {/* Mobile Header */}
        <header className="md:hidden bg-slate-900 px-4 py-4 sticky top-0 z-40 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-emerald-600 rounded-full flex items-center justify-center ring-2 ring-primary/30">
                <span className="text-white font-bold">{employee?.full_name?.[0] || 'U'}</span>
              </div>
              <div>
                <p className="text-slate-400 text-sm">{getGreeting()},</p>
                <p className="font-semibold text-white">{employee?.full_name?.split(' ')[0] || 'User'}</p>
              </div>
            </div>
            <button className="relative p-2" data-testid="notifications-btn">
              <Bell className="w-6 h-6 text-slate-400" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900" />
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 space-y-6">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between">
            <div>
              <p className="text-slate-400">{getGreeting()},</p>
              <h1 className="font-heading text-3xl font-bold text-white">{employee?.full_name || 'User'}</h1>
            </div>
            <button className="relative p-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors" data-testid="notifications-btn-desktop">
              <Bell className="w-6 h-6 text-slate-400" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-800" />
            </button>
          </div>

          {/* KYC Alert */}
          {kycPending && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-4" data-testid="kyc-alert">
              <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-amber-200">Complete your verification</h3>
                <p className="text-sm text-amber-300/80 mt-1">
                  {employee?.kyc_status === 'submitted' 
                    ? 'Your documents are under review. This usually takes 1-2 business days.'
                    : 'Upload your KYC documents to start accessing wage advances.'}
                </p>
              </div>
              {employee?.kyc_status === 'pending' && (
                <Link to="/employee/kyc">
                  <Button size="sm" className="bg-amber-500 text-slate-900 hover:bg-amber-400">
                    Upload
                  </Button>
                </Link>
              )}
            </div>
          )}

          {/* Available to Withdraw - Hero Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 border border-slate-700/50 relative overflow-hidden" data-testid="withdraw-card">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
            
            <div className="relative">
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Available to Withdraw</p>
              <p className="text-4xl md:text-5xl font-bold text-primary mt-2 mb-1">{formatCurrency(advanceLimit)}</p>
              <p className="text-slate-500 text-sm">Instant transfer to your linked account</p>

              {/* Fee & Arrival Info */}
              <div className="flex gap-4 mt-6">
                <div className="flex-1 bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                  <p className="text-slate-500 text-xs uppercase">Fee</p>
                  <p className="text-white font-semibold mt-1">3.5% - 6%</p>
                </div>
                <div className="flex-1 bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                  <p className="text-slate-500 text-xs uppercase">Arrives</p>
                  <p className="text-white font-semibold mt-1">Instantly</p>
                </div>
              </div>

              {/* Request Button */}
              <Link to="/employee/advances" className="block mt-6">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-2xl text-lg font-semibold shadow-lg shadow-primary/25"
                  disabled={!canRequestAdvance}
                  data-testid="request-withdrawal-btn"
                >
                  <Wallet className="w-5 h-5 mr-3" />
                  Request Withdrawal
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Salary Breakdown */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800" data-testid="salary-breakdown">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Salary Breakdown</h2>
              <span className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full font-medium">
                {new Date().toLocaleDateString('en-US', { month: 'short' })} 1 - {getNextPayday()}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Earned so far</span>
                <span className="text-2xl font-bold text-white">{formatCurrency(earnedWages)}</span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(earnedProgress, 100)}%` }}
                />
              </div>
            </div>

            {/* Breakdown Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="w-2 h-2 bg-slate-600 rounded-full" />
                  <span className="text-slate-500 text-xs uppercase">Withdrawn</span>
                </div>
                <p className="text-white font-semibold">{formatCurrency(totalAdvances)}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-slate-500 text-xs uppercase">Available</span>
                </div>
                <p className="text-primary font-semibold">{formatCurrency(advanceLimit)}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="w-2 h-2 bg-slate-600 rounded-full" />
                  <span className="text-slate-500 text-xs uppercase">Remaining</span>
                </div>
                <p className="text-white font-semibold">{formatCurrency(remainingSalary > 0 ? remainingSalary : 0)}</p>
              </div>
            </div>
          </div>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 relative overflow-hidden" data-testid="next-payday-card">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full blur-2xl" />
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-3">
                <Calendar className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-slate-500 text-sm">Next Payday</p>
              <p className="text-xl font-bold text-white mt-1">{getNextPayday()}</p>
            </div>
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 relative overflow-hidden" data-testid="projected-salary-card">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-2xl" />
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <p className="text-slate-500 text-sm">Projected Salary</p>
              <p className="text-xl font-bold text-white mt-1">{formatCurrency(projectedSalary)}</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800" data-testid="recent-activity">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Recent Activity</h2>
              <Link to="/employee/transactions" className="text-primary text-sm hover:underline">
                See All
              </Link>
            </div>

            {stats?.recent_transactions?.length > 0 ? (
              <div className="space-y-3">
                {stats.recent_transactions.slice(0, 4).map((tx) => (
                  <div 
                    key={tx.id} 
                    className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/30"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        tx.type === 'disbursement' ? 'bg-red-500/20' : 'bg-green-500/20'
                      )}>
                        {tx.type === 'disbursement' ? (
                          <ArrowUpRight className="w-5 h-5 text-red-400" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white capitalize">
                          {tx.type === 'disbursement' ? 'Early Withdrawal' : tx.type.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-slate-500">{formatDateTime(tx.created_at)}</p>
                      </div>
                    </div>
                    <p className={cn(
                      "font-semibold",
                      tx.type === 'disbursement' ? 'text-white' : 'text-green-400'
                    )}>
                      {tx.type === 'disbursement' ? '-' : '+'}{formatCurrency(tx.amount)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <History className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-slate-400 font-medium">No transactions yet</p>
                <p className="text-slate-600 text-sm mt-1">Your activity will appear here</p>
              </div>
            )}
          </div>

          {/* Account Status */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800" data-testid="account-status">
            <h2 className="font-semibold text-white mb-4">Account Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/30">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  employee?.status === 'approved' ? 'bg-green-500/20' : 'bg-amber-500/20'
                )}>
                  {employee?.status === 'approved' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-400" />
                  )}
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Account</p>
                  <p className="font-medium text-white capitalize">{employee?.status || 'Pending'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/30">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  employee?.kyc_status === 'approved' ? 'bg-green-500/20' : 'bg-amber-500/20'
                )}>
                  {employee?.kyc_status === 'approved' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-400" />
                  )}
                </div>
                <div>
                  <p className="text-slate-500 text-sm">KYC Status</p>
                  <p className="font-medium text-white capitalize">{employee?.kyc_status || 'Pending'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/30">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Employer</p>
                  <p className="font-medium text-white">{employee?.employer_name || 'Not assigned'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <BottomNav active="home" />
    </div>
  );
}
