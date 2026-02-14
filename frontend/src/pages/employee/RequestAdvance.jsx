import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, HelpCircle, Wallet, Info, ChevronDown,
  Home, History, User, Building2, Smartphone, CheckCircle2, Zap
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { advanceApi, employeeApi } from '../../lib/api';
import { formatCurrency, calculateFeePercentage, cn } from '../../lib/utils';
import { toast } from 'sonner';
import { useTheme } from '../../lib/ThemeContext';

// Circular Progress
const CircularProgress = ({ value, max }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-200 dark:text-slate-800" />
      <circle cx="50" cy="50" r="42" fill="none" stroke="url(#progressGrad)" strokeWidth="6" strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-500 ease-out" />
      <defs>
        <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0df259" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// Bottom Navigation
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
                  "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all",
                  active === item.id ? "text-primary" : "text-slate-400 dark:text-slate-500"
                )}
                data-testid={`nav-${item.id}`}
              >
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

export default function RequestAdvance() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showMethodSelector, setShowMethodSelector] = useState(false);
  const [amount, setAmount] = useState(100);
  const [disbursementMethod, setDisbursementMethod] = useState('mobile_money');

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await employeeApi.getMe();
        setEmployee(response.data);
        const available = Math.min(response.data?.advance_limit || 0, response.data?.earned_wages || 0);
        if (available > 0) setAmount(Math.min(100, available));
      } catch (err) {
        console.error('Failed to load employee data');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, []);

  const maxAmount = Math.min(employee?.advance_limit || 0, employee?.earned_wages || 0);
  const feePercentage = calculateFeePercentage(employee?.risk_score || 3.0);
  const feeAmount = amount * (feePercentage / 100);
  const netAmount = amount - feeAmount;
  const quickAmounts = [500, 1000, 2000, 5000];

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await advanceApi.create({ amount, disbursement_method: disbursementMethod, reason: '' });
      toast.success('Transfer initiated!');
      navigate('/employee/transactions');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const canRequest = employee?.status === 'approved' && employee?.kyc_status === 'approved';

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 bg-grid" />
        <div className="relative flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!canRequest) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px]" />
        
        <header className="relative z-10 max-w-md mx-auto px-4 py-4">
          <button onClick={() => navigate('/employee')} className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all" data-testid="back-btn">
            <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
          </button>
        </header>
        
        <div className="relative z-10 flex flex-col items-center justify-center px-4 pt-20">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-500/20 rounded-2xl flex items-center justify-center mb-6">
            <Info className="w-10 h-10 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 text-center">Account Not Verified</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8 text-center max-w-sm">Complete KYC verification before requesting advances.</p>
          <Button onClick={() => navigate('/employee/onboarding')} className="bg-gradient-to-r from-primary to-emerald-600 text-white font-bold rounded-xl" data-testid="complete-verification-btn">
            Complete Verification
          </Button>
        </div>
        <BottomNav active="wallet" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px]" />

      {/* Header */}
      <header className="relative z-10 max-w-md mx-auto px-4 py-4 flex items-center justify-between">
        <button onClick={() => navigate('/employee')} className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all" data-testid="back-btn">
          <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
        </button>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Request Advance</h2>
        <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
          <HelpCircle className="w-5 h-5 text-slate-400" />
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-md mx-auto px-4 pb-32 space-y-5">
        {/* Amount Display */}
        <div className="relative w-52 h-52 mx-auto">
          <CircularProgress value={amount} max={maxAmount} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Amount</span>
            <span className="text-3xl font-bold text-slate-900 dark:text-white" data-testid="display-amount">{formatCurrency(amount)}</span>
            <span className="text-xs text-slate-400 mt-1">of {formatCurrency(maxAmount)} available</span>
          </div>
        </div>

        {/* Slider */}
        <div className="px-2">
          <input
            type="range" min="0" max={maxAmount} value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #0df259 0%, #10b981 ${(amount / maxAmount) * 100}%, ${theme === 'dark' ? '#1e293b' : '#e2e8f0'} ${(amount / maxAmount) * 100}%, ${theme === 'dark' ? '#1e293b' : '#e2e8f0'} 100%)` }}
            data-testid="amount-slider"
          />
          <div className="flex justify-between mt-2 px-1">
            <span className="text-xs text-slate-400">KES 0</span>
            <span className="text-xs text-slate-400">{formatCurrency(maxAmount)}</span>
          </div>
        </div>

        {/* Quick Amounts */}
        <div className="flex gap-2 justify-center flex-wrap">
          {quickAmounts.filter(a => a <= maxAmount).map((amt) => (
            <button key={amt} onClick={() => setAmount(amt)}
              className={cn("px-4 py-2.5 rounded-xl text-sm font-semibold transition-all",
                amount === amt ? "bg-primary text-white shadow-lg shadow-primary/30" : "glass-card text-slate-700 dark:text-slate-300"
              )} data-testid={`quick-amount-${amt}`}
            >{formatCurrency(amt)}</button>
          ))}
          <button onClick={() => setAmount(maxAmount)}
            className={cn("px-4 py-2.5 rounded-xl text-sm font-semibold transition-all",
              amount === maxAmount ? "bg-primary text-white shadow-lg shadow-primary/30" : "glass-card text-slate-700 dark:text-slate-300"
            )} data-testid="quick-amount-max"
          >Max</button>
        </div>

        {/* Transaction Summary */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 text-sm">
            <Info className="w-4 h-4 text-primary" /> Transaction Summary
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Requested</span><span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(amount)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Fee ({feePercentage.toFixed(1)}%)</span><span className="font-semibold text-red-500">-{formatCurrency(feeAmount)}</span></div>
            <div className="h-px bg-slate-200 dark:bg-slate-700 my-2" />
            <div className="flex justify-between"><span className="font-bold text-slate-900 dark:text-white">You'll Receive</span><span className="font-bold text-xl text-primary" data-testid="net-amount">{formatCurrency(netAmount)}</span></div>
          </div>
        </div>

        {/* Disbursement Method */}
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-sm px-1">Transfer To</h3>
          <button onClick={() => setShowMethodSelector(!showMethodSelector)}
            className="w-full glass-card flex items-center justify-between p-4 rounded-xl" data-testid="disbursement-selector">
            <div className="flex items-center gap-3">
              <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", disbursementMethod === 'mobile_money' ? "bg-green-100 dark:bg-green-500/20" : "bg-blue-100 dark:bg-blue-500/20")}>
                {disbursementMethod === 'mobile_money' ? <Smartphone className="w-5 h-5 text-green-600 dark:text-green-400" /> : <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-900 dark:text-white text-sm">{disbursementMethod === 'mobile_money' ? (employee?.mobile_money_provider || 'M-PESA') : (employee?.bank_name || 'Bank')}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{disbursementMethod === 'mobile_money' ? employee?.mobile_money_number : `••••${employee?.bank_account?.slice(-4) || '••••'}`}</p>
              </div>
            </div>
            <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform", showMethodSelector && "rotate-180")} />
          </button>
          
          {showMethodSelector && (
            <div className="mt-2 glass-card rounded-xl overflow-hidden">
              <button onClick={() => { setDisbursementMethod('mobile_money'); setShowMethodSelector(false); }}
                className={cn("w-full flex items-center gap-3 p-4 border-b border-slate-200/50 dark:border-slate-700/50", disbursementMethod === 'mobile_money' && "bg-primary/5")}>
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-slate-900 dark:text-white text-sm">{employee?.mobile_money_provider || 'M-PESA'}</p>
                  <p className="text-xs text-slate-500">{employee?.mobile_money_number}</p>
                </div>
                {disbursementMethod === 'mobile_money' && <CheckCircle2 className="w-5 h-5 text-primary" />}
              </button>
              <button onClick={() => { setDisbursementMethod('bank_transfer'); setShowMethodSelector(false); }}
                className={cn("w-full flex items-center gap-3 p-4", disbursementMethod === 'bank_transfer' && "bg-primary/5")}>
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-slate-900 dark:text-white text-sm">{employee?.bank_name || 'Bank Account'}</p>
                  <p className="text-xs text-slate-500">••••{employee?.bank_account?.slice(-4)}</p>
                </div>
                {disbursementMethod === 'bank_transfer' && <CheckCircle2 className="w-5 h-5 text-primary" />}
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button onClick={handleSubmit} disabled={submitting || amount <= 0 || amount > maxAmount}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-emerald-600 text-white font-bold text-base shadow-xl shadow-primary/30 btn-glow disabled:opacity-50"
            data-testid="transfer-btn">
            {submitting ? (
              <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing...</span>
            ) : (
              <span className="flex items-center gap-2"><Zap className="w-5 h-5" />Transfer {formatCurrency(netAmount)} Now</span>
            )}
          </Button>
          <p className="text-center text-[10px] text-slate-400 mt-3">By tapping Transfer, you authorize repayment deduction from your next salary.</p>
        </div>
      </main>

      <BottomNav active="wallet" />
    </div>
  );
}
