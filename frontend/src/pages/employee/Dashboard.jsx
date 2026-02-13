import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wallet, TrendingUp, Clock, ArrowRight, CreditCard, 
  AlertCircle, CheckCircle2, History, FileText
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { dashboardApi, employeeApi } from '../../lib/api';
import { formatCurrency, formatDateTime, getStatusColor, cn } from '../../lib/utils';

export default function EmployeeDashboard() {
  const [stats, setStats] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return (
      <DashboardLayout role="employee">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error === 'profile_not_found') {
    return (
      <DashboardLayout role="employee">
        <div className="max-w-2xl mx-auto py-16 text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-amber-600" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-slate-900 mb-4">Complete Your Profile</h1>
          <p className="text-slate-600 mb-8">
            You need to complete your employee profile before you can access the dashboard and request advances.
          </p>
          <Link to="/employee/onboarding">
            <Button className="bg-primary text-white hover:bg-primary/90" data-testid="complete-profile-btn">
              Complete Profile
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const advancePercentage = stats ? (stats.earned_wages > 0 ? (stats.advance_limit / stats.earned_wages) * 100 : 0) : 0;
  const kycPending = employee?.kyc_status === 'pending' || employee?.kyc_status === 'submitted';
  const canRequestAdvance = employee?.status === 'approved' && employee?.kyc_status === 'approved' && stats?.earned_wages > 0;

  return (
    <DashboardLayout role="employee">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 mt-1">Welcome back! Here&apos;s your financial overview.</p>
          </div>
          <Link to="/employee/advances">
            <Button 
              className="bg-primary text-white hover:bg-primary/90" 
              disabled={!canRequestAdvance}
              data-testid="request-advance-btn"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Request Advance
            </Button>
          </Link>
        </div>

        {/* KYC Alert */}
        {kycPending && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-4" data-testid="kyc-alert">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-amber-900">Complete your verification</h3>
              <p className="text-sm text-amber-700 mt-1">
                {employee?.kyc_status === 'submitted' 
                  ? 'Your documents are under review. This usually takes 1-2 business days.'
                  : 'Upload your KYC documents to start accessing wage advances.'}
              </p>
            </div>
            {employee?.kyc_status === 'pending' && (
              <Link to="/employee/kyc">
                <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                  Upload Documents
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-slate-200" data-testid="earned-wages-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs text-slate-500">This month</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats?.earned_wages || 0)}</p>
              <p className="text-sm text-slate-500 mt-1">Earned Wages</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200" data-testid="advance-limit-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-xs text-green-600 font-medium">50% of earned</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats?.advance_limit || 0)}</p>
              <p className="text-sm text-slate-500 mt-1">Available to Advance</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200" data-testid="total-advances-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats?.total_advances || 0)}</p>
              <p className="text-sm text-slate-500 mt-1">Total Advances</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200" data-testid="pending-repayment-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats?.pending_repayment || 0)}</p>
              <p className="text-sm text-slate-500 mt-1">Pending Repayment</p>
            </CardContent>
          </Card>
        </div>

        {/* Advance Limit Progress */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Advance Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Available</span>
                <span className="font-medium text-slate-900">{formatCurrency(stats?.advance_limit || 0)} of {formatCurrency(stats?.earned_wages || 0)}</span>
              </div>
              <Progress value={advancePercentage} className="h-3" />
              <p className="text-xs text-slate-500">
                You can access up to 50% of your earned wages before payday.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Recent Transactions */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/employee/advances" className="block">
                <Button variant="outline" className="w-full justify-start" data-testid="quick-request-advance">
                  <CreditCard className="w-4 h-4 mr-3" />
                  Request Advance
                </Button>
              </Link>
              <Link to="/employee/transactions" className="block">
                <Button variant="outline" className="w-full justify-start" data-testid="quick-view-transactions">
                  <History className="w-4 h-4 mr-3" />
                  View Transactions
                </Button>
              </Link>
              <Link to="/employee/kyc" className="block">
                <Button variant="outline" className="w-full justify-start" data-testid="quick-upload-documents">
                  <FileText className="w-4 h-4 mr-3" />
                  Upload Documents
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="border-slate-200 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Transactions</CardTitle>
              <Link to="/employee/transactions" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </CardHeader>
            <CardContent>
              {stats?.recent_transactions?.length > 0 ? (
                <div className="space-y-4">
                  {stats.recent_transactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          tx.type === 'disbursement' ? 'bg-green-100' : 'bg-blue-100'
                        )}>
                          {tx.type === 'disbursement' ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <Clock className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 capitalize">{tx.type.replace('_', ' ')}</p>
                          <p className="text-xs text-slate-500">{formatDateTime(tx.created_at)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          "font-semibold",
                          tx.type === 'disbursement' ? 'text-green-600' : 'text-slate-900'
                        )}>
                          {tx.type === 'disbursement' ? '+' : ''}{formatCurrency(tx.amount)}
                        </p>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          getStatusColor(tx.status)
                        )}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <History className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>No transactions yet</p>
                  <p className="text-sm">Your transaction history will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Account Status */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Account Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  employee?.status === 'approved' ? 'bg-green-100' : 'bg-amber-100'
                )}>
                  {employee?.status === 'approved' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-slate-500">Account Status</p>
                  <p className="font-medium text-slate-900 capitalize">{employee?.status || 'Pending'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  employee?.kyc_status === 'approved' ? 'bg-green-100' : 'bg-amber-100'
                )}>
                  {employee?.kyc_status === 'approved' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-slate-500">KYC Status</p>
                  <p className="font-medium text-slate-900 capitalize">{employee?.kyc_status || 'Pending'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Employer</p>
                  <p className="font-medium text-slate-900">{employee?.employer_name || 'Not assigned'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
