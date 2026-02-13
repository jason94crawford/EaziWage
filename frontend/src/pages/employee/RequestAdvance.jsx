import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, Wallet, Building2, ArrowRight, AlertCircle, 
  Check, Smartphone, Landmark, Zap
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Textarea } from '../../components/ui/textarea';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { advanceApi, employeeApi } from '../../lib/api';
import { formatCurrency, calculateFeePercentage, cn } from '../../lib/utils';
import { toast } from 'sonner';

export default function RequestAdvance() {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    amount: '',
    disbursement_method: 'mobile_money',
    reason: '',
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await employeeApi.getMe();
        setEmployee(response.data);
      } catch (err) {
        setError('Failed to load employee data');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, []);

  const amount = parseFloat(formData.amount) || 0;
  const feePercentage = calculateFeePercentage(employee?.risk_score || 3.0);
  const feeAmount = amount * (feePercentage / 100);
  const netAmount = amount - feeAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await advanceApi.create({
        amount: parseFloat(formData.amount),
        disbursement_method: formData.disbursement_method,
        reason: formData.reason,
      });
      toast.success('Advance request submitted successfully!');
      navigate('/employee/transactions');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit advance request');
    } finally {
      setSubmitting(false);
    }
  };

  const canRequest = employee?.status === 'approved' && employee?.kyc_status === 'approved';
  const maxAmount = Math.min(employee?.advance_limit || 0, employee?.earned_wages || 0);

  if (loading) {
    return (
      <DashboardLayout role="employee">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!canRequest) {
    return (
      <DashboardLayout role="employee">
        <div className="max-w-2xl mx-auto py-16 text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-amber-600" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-slate-900 mb-4">Account Not Verified</h1>
          <p className="text-slate-600 mb-8">
            Your account needs to be verified before you can request advances. 
            Please complete your KYC verification.
          </p>
          <Button onClick={() => navigate('/employee/kyc')} className="bg-primary text-white hover:bg-primary/90">
            Complete Verification
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="employee">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold text-slate-900">Request Advance</h1>
          <p className="text-slate-500 mt-1">Access your earned wages before payday</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6" data-testid="advance-error">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-primary" />
                    Advance Amount
                  </CardTitle>
                  <CardDescription>
                    Available: {formatCurrency(maxAmount)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="amount">Amount to Advance *</Label>
                    <div className="relative mt-1.5">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">KES</span>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="5000"
                        min="100"
                        max={maxAmount}
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        required
                        className="pl-12"
                        data-testid="advance-amount"
                      />
                    </div>
                    {amount > maxAmount && (
                      <p className="text-sm text-red-500 mt-2">
                        Amount exceeds your available limit of {formatCurrency(maxAmount)}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Disbursement Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Disbursement Method
                  </CardTitle>
                  <CardDescription>How would you like to receive your advance?</CardDescription>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, disbursement_method: 'mobile_money' })}
                    className={cn(
                      "p-4 rounded-xl border-2 text-left transition-all duration-200",
                      formData.disbursement_method === 'mobile_money'
                        ? "border-primary bg-primary/5"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                    data-testid="method-mobile-money"
                  >
                    <Smartphone className={cn(
                      "w-8 h-8 mb-3",
                      formData.disbursement_method === 'mobile_money' ? "text-primary" : "text-slate-400"
                    )} />
                    <p className="font-medium text-slate-900">Mobile Money</p>
                    <p className="text-sm text-slate-500 mt-1">
                      {employee?.mobile_money_provider || 'Not set'} - {employee?.mobile_money_number || 'N/A'}
                    </p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-green-600">
                      <Zap className="w-3 h-3" />
                      Instant (Under 3 seconds)
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, disbursement_method: 'bank_transfer' })}
                    className={cn(
                      "p-4 rounded-xl border-2 text-left transition-all duration-200",
                      formData.disbursement_method === 'bank_transfer'
                        ? "border-primary bg-primary/5"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                    data-testid="method-bank-transfer"
                  >
                    <Landmark className={cn(
                      "w-8 h-8 mb-3",
                      formData.disbursement_method === 'bank_transfer' ? "text-primary" : "text-slate-400"
                    )} />
                    <p className="font-medium text-slate-900">Bank Transfer</p>
                    <p className="text-sm text-slate-500 mt-1">
                      {employee?.bank_name || 'Not set'} - {employee?.bank_account || 'N/A'}
                    </p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                      1-2 business days
                    </div>
                  </button>
                </CardContent>
              </Card>

              {/* Reason (Optional) */}
              <Card>
                <CardHeader>
                  <CardTitle>Reason (Optional)</CardTitle>
                  <CardDescription>Help us understand why you need this advance</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="e.g., Emergency medical expense, school fees..."
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="min-h-[100px]"
                    data-testid="advance-reason"
                  />
                </CardContent>
              </Card>

              <Button 
                type="submit" 
                className="w-full bg-primary text-white hover:bg-primary/90 h-12"
                disabled={submitting || amount <= 0 || amount > maxAmount}
                data-testid="submit-advance"
              >
                {submitting ? 'Submitting...' : 'Request Advance'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Advance Amount</span>
                  <span className="font-medium text-slate-900">{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Service Fee ({feePercentage.toFixed(1)}%)</span>
                  <span className="font-medium text-slate-900">-{formatCurrency(feeAmount)}</span>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-900">You Receive</span>
                    <span className="font-bold text-xl text-primary">{formatCurrency(netAmount)}</span>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 mt-4">
                  <h4 className="font-medium text-slate-900 mb-2">How it works</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      Request is reviewed instantly
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      Funds sent to your account
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      Auto-deducted on payday
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
