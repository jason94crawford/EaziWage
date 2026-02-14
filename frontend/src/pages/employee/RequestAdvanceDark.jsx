import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  HelpCircle, Wallet, Info, ChevronDown, Clock,
  Building2, Smartphone, CheckCircle2, Zap, ArrowRight, ChevronRight
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { advanceApi, employeeApi } from '../../lib/api';
import { formatCurrency, calculateFeePercentage, cn } from '../../lib/utils';
import { toast } from 'sonner';
import { 
  EmployeeDarkLayout, 
  DarkCard, 
  DarkIconButton,
  darkThemeColors 
} from '../../components/employee/EmployeeDarkLayout';

// Page Header
const AdvanceHeader = () => {
  const navigate = useNavigate();
  
  return (
    <header className="relative z-10 max-w-md mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/employee')}
          className="p-2 rounded-xl transition-colors"
          style={{ color: darkThemeColors.textSecondary }}
          data-testid="back-btn"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        
        <h1 className="text-base font-bold" style={{ color: darkThemeColors.textPrimary }}>
          Request Advance
        </h1>
        
        <button 
          className="p-2 rounded-xl transition-colors"
          style={{ color: darkThemeColors.textSecondary }}
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

// Circular Progress
const CircularProgress = ({ value, max }) => {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const circumference = 2 * Math.PI * 44;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
      <circle 
        cx="50" cy="50" r="44" 
        fill="none" 
        strokeWidth="5" 
        style={{ stroke: darkThemeColors.border }}
      />
      <circle 
        cx="50" cy="50" r="44" 
        fill="none" 
        stroke="url(#progressGradReqDark)" 
        strokeWidth="5" 
        strokeLinecap="round"
        strokeDasharray={circumference} 
        strokeDashoffset={strokeDashoffset} 
        className="transition-all duration-500 ease-out" 
      />
      <defs>
        <linearGradient id="progressGradReqDark" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={darkThemeColors.accent} />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default function RequestAdvance() {
  const navigate = useNavigate();
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
      toast.success('Transfer initiated successfully!');
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
      <EmployeeDarkLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div 
            className="w-12 h-12 border-4 rounded-full animate-spin"
            style={{ borderColor: `${darkThemeColors.accent}30`, borderTopColor: darkThemeColors.accent }}
          />
        </div>
      </EmployeeDarkLayout>
    );
  }

  const kycInReview = employee?.kyc_status === 'submitted';

  if (!canRequest) {
    return (
      <EmployeeDarkLayout>
        <AdvanceHeader />
        <div className="relative z-10 flex flex-col items-center justify-center px-4 pt-20">
          {kycInReview ? (
            <>
              <DarkIconButton icon={Clock} variant="accent" size="lg" className="mb-6 w-20 h-20" />
              <h1 className="text-2xl font-bold mb-3 text-center" style={{ color: darkThemeColors.textPrimary }}>
                Verification in Progress
              </h1>
              <p className="mb-4 text-center max-w-xs text-sm" style={{ color: darkThemeColors.textSecondary }}>
                Your documents are being reviewed. This usually takes 1-2 business days.
              </p>
              <DarkCard className="p-4 max-w-xs text-center">
                <p className="text-xs" style={{ color: darkThemeColors.textSecondary }}>
                  You'll receive a notification once your account is verified and ready to use.
                </p>
              </DarkCard>
            </>
          ) : (
            <>
              <DarkIconButton icon={Info} variant="accent" size="lg" className="mb-6 w-20 h-20" />
              <h1 className="text-2xl font-bold mb-3 text-center" style={{ color: darkThemeColors.textPrimary }}>
                Complete Verification
              </h1>
              <p className="mb-8 text-center max-w-xs text-sm" style={{ color: darkThemeColors.textSecondary }}>
                Complete your KYC verification to start requesting advances.
              </p>
              <Button 
                onClick={() => navigate('/employee/onboarding')} 
                className="h-12 px-8 font-semibold rounded-xl shadow-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${darkThemeColors.accent}, #10b981)`,
                  color: darkThemeColors.background,
                  boxShadow: `0 8px 24px ${darkThemeColors.accentGlow}`
                }}
                data-testid="complete-verification-btn"
              >
                Start Verification <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </>
          )}
        </div>
      </EmployeeDarkLayout>
    );
  }

  return (
    <EmployeeDarkLayout>
      <AdvanceHeader />

      <main className="relative z-10 max-w-md mx-auto px-4 pb-32 space-y-5">
        {/* Amount Display Card */}
        <DarkCard className="p-6" glow>
          <div className="relative w-44 h-44 mx-auto">
            {/* Outer glow */}
            <div 
              className="absolute inset-4 rounded-full blur-2xl"
              style={{ background: darkThemeColors.accentGlow }}
            />
            <CircularProgress value={amount} max={maxAmount} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: darkThemeColors.textMuted }}>
                Amount
              </span>
              <span className="text-3xl font-bold" style={{ color: darkThemeColors.textPrimary }} data-testid="display-amount">
                {formatCurrency(amount)}
              </span>
              <span className="text-[11px] mt-1" style={{ color: darkThemeColors.textMuted }}>
                of {formatCurrency(maxAmount)}
              </span>
            </div>
          </div>

          {/* Slider */}
          <div className="mt-6 px-1">
            <input
              type="range" 
              min="0" 
              max={maxAmount} 
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ 
                background: `linear-gradient(to right, ${darkThemeColors.accent} 0%, #10b981 ${(amount / maxAmount) * 100}%, ${darkThemeColors.border} ${(amount / maxAmount) * 100}%, ${darkThemeColors.border} 100%)` 
              }}
              data-testid="amount-slider"
            />
            <div className="flex justify-between mt-2">
              <span className="text-[11px] font-medium" style={{ color: darkThemeColors.textMuted }}>KES 0</span>
              <span className="text-[11px] font-medium" style={{ color: darkThemeColors.textMuted }}>{formatCurrency(maxAmount)}</span>
            </div>
          </div>

          {/* Quick Amounts */}
          <div className="flex gap-2 justify-center flex-wrap mt-4">
            {quickAmounts.filter(a => a <= maxAmount).map((amt) => (
              <button 
                key={amt} 
                onClick={() => setAmount(amt)}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={amount === amt ? {
                  background: `linear-gradient(135deg, ${darkThemeColors.accent}, #10b981)`,
                  color: darkThemeColors.background,
                  boxShadow: `0 4px 12px ${darkThemeColors.accentGlow}`
                } : {
                  background: darkThemeColors.border,
                  color: darkThemeColors.textSecondary
                }}
                data-testid={`quick-amount-${amt}`}
              >
                {formatCurrency(amt)}
              </button>
            ))}
            <button 
              onClick={() => setAmount(maxAmount)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={amount === maxAmount ? {
                background: `linear-gradient(135deg, ${darkThemeColors.accent}, #10b981)`,
                color: darkThemeColors.background,
                boxShadow: `0 4px 12px ${darkThemeColors.accentGlow}`
              } : {
                background: darkThemeColors.border,
                color: darkThemeColors.textSecondary
              }}
              data-testid="quick-amount-max"
            >
              Max
            </button>
          </div>
        </DarkCard>

        {/* Transaction Summary */}
        <DarkCard className="p-5">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-sm" style={{ color: darkThemeColors.textPrimary }}>
            <Info className="w-4 h-4" style={{ color: darkThemeColors.accent }} /> Transaction Summary
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span style={{ color: darkThemeColors.textSecondary }}>Requested Amount</span>
              <span className="font-semibold" style={{ color: darkThemeColors.textPrimary }}>{formatCurrency(amount)}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: darkThemeColors.textSecondary }}>Service Fee ({feePercentage.toFixed(1)}%)</span>
              <span className="font-semibold" style={{ color: '#ef4444' }}>-{formatCurrency(feeAmount)}</span>
            </div>
            <div className="h-px" style={{ background: darkThemeColors.border }} />
            <div className="flex justify-between items-center">
              <span className="font-bold" style={{ color: darkThemeColors.textPrimary }}>You'll Receive</span>
              <span className="font-bold text-xl" style={{ color: darkThemeColors.accent }} data-testid="net-amount">
                {formatCurrency(netAmount)}
              </span>
            </div>
          </div>
        </DarkCard>

        {/* Disbursement Method */}
        <div>
          <h3 className="font-bold mb-3 text-sm px-1" style={{ color: darkThemeColors.textPrimary }}>Transfer To</h3>
          <button 
            onClick={() => setShowMethodSelector(!showMethodSelector)}
            className="w-full flex items-center justify-between p-4 rounded-2xl"
            style={{ background: darkThemeColors.cardBg, border: `1px solid ${darkThemeColors.border}` }}
            data-testid="disbursement-selector"
          >
            <div className="flex items-center gap-3">
              <DarkIconButton 
                icon={disbursementMethod === 'mobile_money' ? Smartphone : Building2}
                variant="accent"
              />
              <div className="text-left">
                <p className="font-semibold text-sm" style={{ color: darkThemeColors.textPrimary }}>
                  {disbursementMethod === 'mobile_money' ? (employee?.mobile_money_provider || 'M-PESA') : (employee?.bank_name || 'Bank Account')}
                </p>
                <p className="text-xs" style={{ color: darkThemeColors.textSecondary }}>
                  {disbursementMethod === 'mobile_money' ? employee?.mobile_money_number : `••••${employee?.bank_account?.slice(-4) || '••••'}`}
                </p>
              </div>
            </div>
            <ChevronDown 
              className={cn("w-5 h-5 transition-transform duration-200", showMethodSelector && "rotate-180")} 
              style={{ color: darkThemeColors.textMuted }}
            />
          </button>
          
          {showMethodSelector && (
            <DarkCard className="mt-2 overflow-hidden">
              <button 
                onClick={() => { setDisbursementMethod('mobile_money'); setShowMethodSelector(false); }}
                className="w-full flex items-center gap-3 p-4 transition-colors"
                style={{ 
                  borderBottom: `1px solid ${darkThemeColors.border}`,
                  background: disbursementMethod === 'mobile_money' ? darkThemeColors.accentGlow : 'transparent'
                }}
              >
                <DarkIconButton icon={Smartphone} variant="accent" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm" style={{ color: darkThemeColors.textPrimary }}>
                    {employee?.mobile_money_provider || 'M-PESA'}
                  </p>
                  <p className="text-xs" style={{ color: darkThemeColors.textSecondary }}>
                    {employee?.mobile_money_number || 'Not configured'}
                  </p>
                </div>
                {disbursementMethod === 'mobile_money' && <CheckCircle2 className="w-5 h-5" style={{ color: darkThemeColors.accent }} />}
              </button>
              <button 
                onClick={() => { setDisbursementMethod('bank_transfer'); setShowMethodSelector(false); }}
                className="w-full flex items-center gap-3 p-4 transition-colors"
                style={{ background: disbursementMethod === 'bank_transfer' ? darkThemeColors.accentGlow : 'transparent' }}
              >
                <DarkIconButton icon={Building2} variant="accent" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm" style={{ color: darkThemeColors.textPrimary }}>
                    {employee?.bank_name || 'Bank Account'}
                  </p>
                  <p className="text-xs" style={{ color: darkThemeColors.textSecondary }}>
                    ••••{employee?.bank_account?.slice(-4) || 'Not configured'}
                  </p>
                </div>
                {disbursementMethod === 'bank_transfer' && <CheckCircle2 className="w-5 h-5" style={{ color: darkThemeColors.accent }} />}
              </button>
            </DarkCard>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button 
            onClick={handleSubmit} 
            disabled={submitting || amount <= 0 || amount > maxAmount}
            className="w-full h-14 rounded-2xl font-bold text-base shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02]"
            style={{ 
              background: `linear-gradient(135deg, ${darkThemeColors.accent}, #10b981)`,
              color: darkThemeColors.background,
              boxShadow: `0 8px 32px ${darkThemeColors.accentGlow}`
            }}
            data-testid="transfer-btn"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <div 
                  className="w-5 h-5 border-2 rounded-full animate-spin"
                  style={{ borderColor: `${darkThemeColors.background}30`, borderTopColor: darkThemeColors.background }}
                />
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Transfer {formatCurrency(netAmount)} Now
              </span>
            )}
          </Button>
          <p className="text-center text-[10px] mt-3" style={{ color: darkThemeColors.textMuted }}>
            By tapping Transfer, you authorize repayment deduction from your next salary.
          </p>
        </div>
      </main>
    </EmployeeDarkLayout>
  );
}
