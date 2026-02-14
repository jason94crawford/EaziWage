import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, HelpCircle, Wallet, Info, ChevronDown,
  ArrowRight, Home, History, User, Building2, Smartphone,
  CheckCircle2, Zap
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { advanceApi, employeeApi } from '../../lib/api';
import { formatCurrency, calculateFeePercentage, cn } from '../../lib/utils';
import { toast } from 'sonner';
import { useTheme } from '../../lib/ThemeContext';

// Animated Circular Progress
const CircularProgress = ({ value, max }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        className="text-slate-200 dark:text-slate-800"
      />
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="url(#progressGradient)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        className="transition-all duration-500 ease-out"
      />
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0df259" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
    </svg>
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
              "flex flex-col items-center justify-center gap-1 w-full h-full transition-all",
              active === item.id 
                ? "text-primary" 
                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            )}
            data-testid={`nav-${item.id}`}
          >
            <item.icon className={cn("w-5 h-5", active === item.id && "scale-110")} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
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
  const [error, setError] = useState('');
  const [showMethodSelector, setShowMethodSelector] = useState(false);
  
  const [amount, setAmount] = useState(100);
  const [disbursementMethod, setDisbursementMethod] = useState('mobile_money');

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await employeeApi.getMe();
        setEmployee(response.data);
        const available = Math.min(response.data?.advance_limit || 0, response.data?.earned_wages || 0);
        if (available > 0) {
          setAmount(Math.min(100, available));
        }
      } catch (err) {
        setError('Failed to load employee data');
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

  const handleSliderChange = (e) => {
    setAmount(parseInt(e.target.value) || 0);
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value.replace(/,/g, '')) || 0;
    setAmount(Math.min(value, maxAmount));
  };

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);

    try {
      await advanceApi.create({
        amount: amount,
        disbursement_method: disbursementMethod,
        reason: '',
      });
      toast.success('Transfer initiated successfully!');
      navigate('/employee/transactions');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit advance request');
      toast.error(err.response?.data?.detail || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const canRequest = employee?.status === 'approved' && employee?.kyc_status === 'approved';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!canRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex flex-col items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Info className="w-10 h-10 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Account Not Verified</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Your account needs to be verified before you can request advances. 
            Please complete your KYC verification.
          </p>
          <Button 
            onClick={() => navigate('/employee/kyc')} 
            className="bg-gradient-to-r from-primary to-emerald-600 text-white font-bold rounded-xl"
            data-testid="complete-verification-btn"
          >
            Complete Verification
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-white pb-24 md:pb-8">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Mobile Container */}
      <div className="relative flex flex-col min-h-screen w-full max-w-md mx-auto z-10">
        {/* Top App Bar */}
        <header className="sticky top-0 z-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5">
          <div className="flex items-center p-4 justify-between">
            <button 
              onClick={() => navigate('/employee')}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              data-testid="back-btn"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-bold tracking-tight">Request Advance</h2>
            <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
              <HelpCircle className="w-6 h-6 text-slate-400" />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 flex flex-col px-4 pt-6 pb-6">
          {/* Amount Display with Circular Progress */}
          <div className="relative w-56 h-56 mx-auto mb-6">
            <CircularProgress value={amount} max={maxAmount} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Amount
              </span>
              <span className="text-4xl font-bold text-slate-900 dark:text-white" data-testid="display-amount">
                {formatCurrency(amount)}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                of {formatCurrency(maxAmount)} available
              </span>
            </div>
          </div>

          {/* Amount Slider */}
          <div className="w-full px-2 mb-6">
            <input
              type="range"
              min="0"
              max={maxAmount}
              value={amount}
              onChange={handleSliderChange}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #0df259 0%, #10b981 ${(amount / maxAmount) * 100}%, ${theme === 'dark' ? '#1e293b' : '#e2e8f0'} ${(amount / maxAmount) * 100}%, ${theme === 'dark' ? '#1e293b' : '#e2e8f0'} 100%)`
              }}
              data-testid="amount-slider"
            />
            <div className="flex justify-between mt-2 px-1">
              <span className="text-xs text-slate-400 font-medium">KES 0</span>
              <span className="text-xs text-slate-400 font-medium">{formatCurrency(maxAmount)}</span>
            </div>
          </div>

          {/* Quick Select Amounts */}
          <div className="flex gap-2 justify-center flex-wrap mb-6">
            {quickAmounts.filter(a => a <= maxAmount).map((quickAmt) => (
              <button
                key={quickAmt}
                onClick={() => setAmount(quickAmt)}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-sm font-semibold transition-all",
                  amount === quickAmt
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-slate-200/50 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-primary/50"
                )}
                data-testid={`quick-amount-${quickAmt}`}
              >
                {formatCurrency(quickAmt)}
              </button>
            ))}
            <button
              onClick={() => setAmount(maxAmount)}
              className={cn(
                "px-4 py-2.5 rounded-xl text-sm font-semibold transition-all",
                amount === maxAmount
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-slate-200/50 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-primary/50"
              )}
              data-testid="quick-amount-max"
            >
              Max
            </button>
          </div>

          {/* Transaction Details Card */}
          <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-5 mb-6 border border-slate-200/50 dark:border-white/10">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              Transaction Summary
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400 text-sm">Requested Amount</span>
                <span className="font-semibold">{formatCurrency(amount)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1">
                  Service Fee ({feePercentage.toFixed(1)}%)
                </span>
                <span className="font-semibold text-red-500">-{formatCurrency(feeAmount)}</span>
              </div>
              
              <div className="h-px bg-slate-200 dark:bg-white/10 my-2" />
              
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 dark:text-white">You'll Receive</span>
                <span className="font-bold text-xl text-primary" data-testid="net-amount">
                  {formatCurrency(netAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Disbursement Method */}
          <div className="mb-auto">
            <h3 className="font-bold text-slate-900 dark:text-white mb-3 px-1">Transfer To</h3>
            
            <button 
              onClick={() => setShowMethodSelector(!showMethodSelector)}
              className="w-full flex items-center justify-between bg-white/70 dark:bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-slate-200/50 dark:border-white/10 hover:border-primary/50 transition-all group"
              data-testid="disbursement-selector"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  disbursementMethod === 'mobile_money' 
                    ? "bg-green-100 dark:bg-green-500/20" 
                    : "bg-blue-100 dark:bg-blue-500/20"
                )}>
                  {disbursementMethod === 'mobile_money' ? (
                    <Smartphone className="w-6 h-6 text-green-600 dark:text-green-400" />
                  ) : (
                    <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {disbursementMethod === 'mobile_money' 
                      ? (employee?.mobile_money_provider || 'M-PESA')
                      : (employee?.bank_name || 'Bank Transfer')}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {disbursementMethod === 'mobile_money' 
                      ? (employee?.mobile_money_number || '•••• ••••')
                      : `•••• ${employee?.bank_account?.slice(-4) || '••••'}`}
                  </p>
                </div>
              </div>
              <ChevronDown className={cn(
                "w-5 h-5 text-slate-400 transition-transform",
                showMethodSelector && "rotate-180"
              )} />
            </button>
            
            {/* Method Selector Dropdown */}
            {showMethodSelector && (
              <div className="mt-2 bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-white/10 overflow-hidden">
                <button
                  onClick={() => { setDisbursementMethod('mobile_money'); setShowMethodSelector(false); }}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-b border-slate-100 dark:border-white/5",
                    disbursementMethod === 'mobile_money' && "bg-primary/5"
                  )}
                >
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">{employee?.mobile_money_provider || 'M-PESA'}</p>
                    <p className="text-sm text-slate-500">{employee?.mobile_money_number}</p>
                  </div>
                  {disbursementMethod === 'mobile_money' && (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  )}
                </button>
                <button
                  onClick={() => { setDisbursementMethod('bank_transfer'); setShowMethodSelector(false); }}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors",
                    disbursementMethod === 'bank_transfer' && "bg-primary/5"
                  )}
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">{employee?.bank_name || 'Bank Account'}</p>
                    <p className="text-sm text-slate-500">•••• {employee?.bank_account?.slice(-4)}</p>
                  </div>
                  {disbursementMethod === 'bank_transfer' && (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  )}
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Sticky Footer Action */}
        <div className="sticky bottom-0 p-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-t border-slate-200/50 dark:border-white/5">
          <Button
            onClick={handleSubmit}
            disabled={submitting || amount <= 0 || amount > maxAmount}
            className="w-full bg-gradient-to-r from-primary to-emerald-600 hover:opacity-90 text-white font-bold text-lg py-6 rounded-xl shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            data-testid="transfer-btn"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Transfer {formatCurrency(netAmount)} Now
              </span>
            )}
          </Button>
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-3 px-4">
            By tapping Transfer, you authorize the repayment deduction from your next salary.
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav active="wallet" />
    </div>
  );
}
