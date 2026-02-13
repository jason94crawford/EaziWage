import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, TrendingUp, Clock, ArrowRight, CreditCard, 
  Building2, Upload, BarChart3, AlertCircle, CheckCircle2
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { dashboardApi, employerApi } from '../../lib/api';
import { formatCurrency, getRiskRatingColor, getRiskRatingLabel, cn } from '../../lib/utils';

export default function EmployerDashboard() {
  const [stats, setStats] = useState(null);
  const [employer, setEmployer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, employerRes] = await Promise.all([
          dashboardApi.getEmployerDashboard(),
          employerApi.getMe()
        ]);
        setStats(statsRes.data);
        setEmployer(employerRes.data);
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
      <DashboardLayout role="employer">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error === 'profile_not_found') {
    return (
      <DashboardLayout role="employer">
        <div className="max-w-2xl mx-auto py-16 text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-10 h-10 text-amber-600" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-slate-900 mb-4">Complete Your Company Profile</h1>
          <p className="text-slate-600 mb-8">
            Set up your company profile to start offering EaziWage to your employees.
          </p>
          <Link to="/employer/onboarding">
            <Button className="bg-primary text-white hover:bg-primary/90" data-testid="complete-profile-btn">
              Complete Setup
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const isPending = employer?.status === 'pending';

  return (
    <DashboardLayout role="employer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 mt-1">{employer?.company_name}</p>
          </div>
          <Link to="/employer/payroll">
            <Button className="bg-primary text-white hover:bg-primary/90" data-testid="upload-payroll-btn">
              <Upload className="w-4 h-4 mr-2" />
              Upload Payroll
            </Button>
          </Link>
        </div>

        {/* Verification Alert */}
        {isPending && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-4" data-testid="verification-alert">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-amber-900">Verification in Progress</h3>
              <p className="text-sm text-amber-700 mt-1">
                Your company profile is being reviewed. This usually takes 1-2 business days. 
                You can start adding employees while we verify your account.
              </p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-slate-200" data-testid="total-employees-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stats?.total_employees || 0}</p>
              <p className="text-sm text-slate-500 mt-1">Total Employees</p>
              <p className="text-xs text-green-600 mt-2">{stats?.active_employees || 0} active</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200" data-testid="total-advances-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats?.total_advances_disbursed || 0)}</p>
              <p className="text-sm text-slate-500 mt-1">Total Advances</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200" data-testid="pending-advances-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stats?.pending_advances || 0}</p>
              <p className="text-sm text-slate-500 mt-1">Pending Advances</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200" data-testid="monthly-payroll-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats?.monthly_payroll || 0)}</p>
              <p className="text-sm text-slate-500 mt-1">Monthly Payroll</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Risk Score */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="border-slate-200 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link to="/employer/employees" className="block">
                  <div className="p-4 border border-slate-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer" data-testid="quick-manage-employees">
                    <Users className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-medium text-slate-900">Manage Employees</h3>
                    <p className="text-sm text-slate-500 mt-1">Add, edit, or view employee profiles</p>
                  </div>
                </Link>
                <Link to="/employer/payroll" className="block">
                  <div className="p-4 border border-slate-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer" data-testid="quick-upload-payroll">
                    <Upload className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-medium text-slate-900">Upload Payroll</h3>
                    <p className="text-sm text-slate-500 mt-1">Update employee earnings data</p>
                  </div>
                </Link>
                <Link to="/employer/advances" className="block">
                  <div className="p-4 border border-slate-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer" data-testid="quick-view-advances">
                    <CreditCard className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-medium text-slate-900">View Advances</h3>
                    <p className="text-sm text-slate-500 mt-1">Track employee wage advances</p>
                  </div>
                </Link>
                <Link to="/employer/reports" className="block">
                  <div className="p-4 border border-slate-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer" data-testid="quick-view-reports">
                    <BarChart3 className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-medium text-slate-900">Reports</h3>
                    <p className="text-sm text-slate-500 mt-1">Analytics and insights</p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Company Status */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Company Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  employer?.status === 'approved' ? 'bg-green-100' : 'bg-amber-100'
                )}>
                  {employer?.status === 'approved' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-slate-500">Verification Status</p>
                  <p className="font-medium text-slate-900 capitalize">{employer?.status || 'Pending'}</p>
                </div>
              </div>
              
              {stats?.risk_score && (
                <div>
                  <p className="text-sm text-slate-500 mb-2">Risk Score</p>
                  <div className={cn(
                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border",
                    getRiskRatingColor(employer?.risk_rating)
                  )}>
                    <span className="font-bold text-lg">{stats.risk_score.toFixed(2)}</span>
                    <span className="text-sm">{getRiskRatingLabel(employer?.risk_rating)}</span>
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm text-slate-500">Industry</p>
                <p className="font-medium text-slate-900 capitalize">{employer?.industry?.replace('_', ' ')}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Payroll Cycle</p>
                <p className="font-medium text-slate-900 capitalize">{employer?.payroll_cycle}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
