import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, HelpCircle, Wallet, Info, ChevronDown,
  ArrowRight, Home, History, User, Building2
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { advanceApi, employeeApi } from '../../lib/api';
import { formatCurrency, calculateFeePercentage, cn } from '../../lib/utils';
import { toast } from 'sonner';
import { useTheme } from '../../lib/ThemeContext';

// Bottom Navigation Component
const BottomNav = ({ active }) => {
  const navigate = useNavigate();
  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/employee' },
    { id: 'wallet', icon: Wallet, label: 'Wallet', path: '/employee/advances' },
    { id: 'history', icon: History, label: 'History', path: '/employee/transactions' },
    { id: 'profile', icon: User, label: 'Profile', path: '/employee/kyc' },
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
  
  const [amount, setAmount] = useState(100);
  const [disbursementMethod, setDisbursementMethod] = useState('mobile_money');

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await employeeApi.getMe();
        setEmployee(response.data);
        // Set initial amount to 25% of available
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
  const repaymentAmount = amount + feeAmount;

  const quickAmounts = [50, 100, 200];

  const handleSliderChange = (e) => {
    setAmount(parseInt(e.target.value) || 0);
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value) || 0;
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
      <div className="min-h-screen bg-[#f5f8f6] dark:bg-[#102216] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!canRequest) {
    return (
      <div className="min-h-screen bg-[#f5f8f6] dark:bg-[#102216] flex flex-col items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info className="w-10 h-10 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Account Not Verified</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Your account needs to be verified before you can request advances. 
            Please complete your KYC verification.
          </p>
          <Button 
            onClick={() => navigate('/employee/kyc')} 
            className="bg-primary hover:bg-primary/90 text-black font-bold"
            data-testid="complete-verification-btn"
          >
            Complete Verification
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f8f6] dark:bg-[#102216] text-slate-900 dark:text-white pb-24 md:pb-8">
      {/* Mobile Container */}
      <div className="relative flex flex-col min-h-screen w-full max-w-md mx-auto">
        {/* Top App Bar */}
        <header className="sticky top-0 z-20 bg-[#f5f8f6]/95 dark:bg-[#102216]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/5">
          <div className="flex items-center p-4 justify-between">
            <button 
              onClick={() => navigate('/employee')}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              data-testid="back-btn"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-bold tracking-tight">Withdraw Cash</h2>
            <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
              <HelpCircle className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 flex flex-col px-4 pt-4 pb-6">
          {/* Headline & Available Balance */}
          <div className="mt-4 mb-8 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wide mb-1">
              Available to withdraw
            </p>
            <h1 className="text-primary text-4xl font-extrabold tracking-tight" data-testid="available-balance">
              {formatCurrency(maxAmount)}
            </h1>
          </div>

          {/* Amount Input Section */}
          <div className="flex flex-col items-center justify-center space-y-6 mb-8">
            {/* Large Input */}
            <div className="relative w-full max-w-[280px]">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-bold text-slate-400 dark:text-slate-500">
                KES
              </span>
              <input
                type="number"
                value={amount}
                onChange={handleInputChange}
                className="w-full bg-transparent border-b-2 border-slate-300 dark:border-slate-600 focus:border-primary focus:outline-none text-center text-5xl font-bold text-slate-900 dark:text-white placeholder:text-slate-400 py-2 pl-16 pr-2 transition-colors"
                placeholder="0"
                max={maxAmount}
                min={0}
                data-testid="amount-input"
              />
            </div>

            {/* Slider */}
            <div className="w-full px-2">
              <input
                type="range"
                min="0"
                max={maxAmount}
                value={amount}
                onChange={handleSliderChange}
                className="w-full h-2 bg-slate-200 dark:bg-[#1b2e21] rounded-lg appearance-none cursor-pointer accent-primary"
                style={{
                  background: `linear-gradient(to right, #0df259 0%, #0df259 ${(amount / maxAmount) * 100}%, ${theme === 'dark' ? '#1b2e21' : '#e2e8f0'} ${(amount / maxAmount) * 100}%, ${theme === 'dark' ? '#1b2e21' : '#e2e8f0'} 100%)`
                }}
                data-testid="amount-slider"
              />
              <div className="flex justify-between mt-2 px-1">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">KES 0</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{formatCurrency(maxAmount)}</span>
              </div>
            </div>

            {/* Quick Select Chips */}
            <div className="flex gap-3 justify-center w-full flex-wrap">
              {quickAmounts.map((quickAmt) => (
                <button
                  key={quickAmt}
                  onClick={() => setAmount(Math.min(quickAmt, maxAmount))}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                    amount === quickAmt
                      ? "bg-primary/20 border border-primary text-primary"
                      : "border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-primary hover:bg-primary/10 hover:text-primary"
                  )}
                  data-testid={`quick-amount-${quickAmt}`}
                >
                  {formatCurrency(quickAmt)}
                </button>
              ))}
              <button
                onClick={() => setAmount(maxAmount)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  amount === maxAmount
                    ? "bg-primary/20 border border-primary text-primary"
                    : "border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-primary hover:bg-primary/10 hover:text-primary"
                )}
                data-testid="quick-amount-max"
              >
                Max
              </button>
            </div>
          </div>

          {/* Transaction Details Card */}
          <div className="bg-white dark:bg-[#1b2e21] rounded-2xl p-5 mb-6 shadow-sm border border-slate-200 dark:border-transparent">
            <h3 className="text-slate-900 dark:text-white font-semibold mb-4 text-base">Breakdown</h3>
            
            <div className="flex justify-between items-center mb-3">
              <span className="text-slate-500 dark:text-slate-400 text-sm">Requested Amount</span>
              <span className="text-slate-900 dark:text-white font-medium">{formatCurrency(amount)}</span>
            </div>
            
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center gap-1">
                <span className="text-slate-500 dark:text-slate-400 text-sm">Service Fee ({feePercentage.toFixed(1)}%)</span>
                <Info className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              </div>
              <span className="text-slate-900 dark:text-white font-medium">{formatCurrency(feeAmount)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-slate-900 dark:text-white font-bold text-base">Repayment Amount</span>
                <span className="text-xs text-slate-500 dark:text-slate-500">Deducted on Payday</span>
              </div>
              <span className="text-slate-900 dark:text-white font-bold text-lg" data-testid="repayment-amount">
                {formatCurrency(repaymentAmount)}
              </span>
            </div>
          </div>

          {/* Destination Account */}
          <div 
            className="flex items-center justify-between bg-white dark:bg-[#1b2e21] p-4 rounded-xl mb-auto shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group border border-slate-200 dark:border-transparent"
            data-testid="disbursement-selector"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-slate-600 dark:text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 dark:text-slate-400">Transferring to</span>
                <span className="text-slate-900 dark:text-white font-medium text-sm group-hover:text-primary transition-colors">
                  {employee?.mobile_money_provider || 'M-PESA'} {employee?.mobile_money_number || '•••• 4291'}
                </span>
              </div>
            </div>
            <ChevronDown className="w-5 h-5 text-slate-400 dark:text-slate-500" />
          </div>
        </main>

        {/* Sticky Footer Action */}
        <div className="sticky bottom-0 p-4 bg-[#f5f8f6] dark:bg-[#102216] border-t border-slate-200 dark:border-slate-800">
          <Button
            onClick={handleSubmit}
            disabled={submitting || amount <= 0 || amount > maxAmount}
            className="w-full bg-primary hover:bg-[#0be052] active:bg-[#09c949] text-black font-bold text-lg py-6 rounded-xl shadow-[0_0_20px_rgba(13,242,89,0.3)] hover:shadow-[0_0_30px_rgba(13,242,89,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="transfer-btn"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Transfer {formatCurrency(amount)} Now
                <ArrowRight className="w-5 h-5" />
              </span>
            )}
          </Button>
          <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-3 px-4 leading-tight">
            By tapping Transfer, you agree to the Terms of Service and authorize the repayment deduction.
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav active="wallet" />
    </div>
  );
}
