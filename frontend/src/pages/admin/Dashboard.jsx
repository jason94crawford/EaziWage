import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, Users, CreditCard, Shield, Clock, CheckCircle2,
  AlertTriangle, TrendingUp, ArrowRight, FileText
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { dashboardApi } from '../../lib/api';
import { formatCurrency, cn } from '../../lib/utils';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboardApi.getAdminDashboard();
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of EaziWage operations</p>
        </div>

        {/* Alerts */}
        {(stats?.pending_employer_verifications > 0 || stats?.pending_employee_verifications > 0 || stats?.pending_disbursements > 0) && (
          <div className="grid sm:grid-cols-3 gap-4">
            {stats?.pending_employer_verifications > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3" data-testid="pending-employers-alert">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-amber-900">{stats.pending_employer_verifications} Employer{stats.pending_employer_verifications > 1 ? 's' : ''}</p>
                  <p className="text-sm text-amber-700">Pending verification</p>
                </div>
                <Link to="/admin/employers?status=pending" className="ml-auto">
                  <ArrowRight className="w-5 h-5 text-amber-600" />
                </Link>
              </div>
            )}
            {stats?.pending_employee_verifications > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3" data-testid="pending-kyc-alert">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-blue-900">{stats.pending_employee_verifications} KYC</p>
                  <p className="text-sm text-blue-700">Documents to review</p>
                </div>
                <Link to="/admin/kyc" className="ml-auto">
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                </Link>
              </div>
            )}
            {stats?.pending_disbursements > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3" data-testid="pending-disbursements-alert">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-900">{stats.pending_disbursements} Advance{stats.pending_disbursements > 1 ? 's' : ''}</p>
                  <p className="text-sm text-green-700">Ready to disburse</p>
                </div>
                <Link to="/admin/advances?status=approved" className="ml-auto">
                  <ArrowRight className="w-5 h-5 text-green-600" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-slate-200" data-testid="total-employers-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stats?.total_employers || 0}</p>
              <p className="text-sm text-slate-500 mt-1">Total Employers</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200" data-testid="total-employees-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stats?.total_employees || 0}</p>
              <p className="text-sm text-slate-500 mt-1">Total Employees</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200" data-testid="advances-today-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-xs text-slate-500">Today</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats?.total_advances_today || 0)}</p>
              <p className="text-sm text-slate-500 mt-1">Advances Today</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200" data-testid="pending-verifications-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {(stats?.pending_employer_verifications || 0) + (stats?.pending_employee_verifications || 0)}
              </p>
              <p className="text-sm text-slate-500 mt-1">Pending Verifications</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/admin/employers" className="block">
                <div className="p-4 border border-slate-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer" data-testid="quick-manage-employers">
                  <Building2 className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-medium text-slate-900">Manage Employers</h3>
                  <p className="text-sm text-slate-500 mt-1">View and verify employer accounts</p>
                </div>
              </Link>
              <Link to="/admin/employees" className="block">
                <div className="p-4 border border-slate-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer" data-testid="quick-manage-employees">
                  <Users className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-medium text-slate-900">Manage Employees</h3>
                  <p className="text-sm text-slate-500 mt-1">View and verify employee accounts</p>
                </div>
              </Link>
              <Link to="/admin/advances" className="block">
                <div className="p-4 border border-slate-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer" data-testid="quick-manage-advances">
                  <CreditCard className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-medium text-slate-900">Manage Advances</h3>
                  <p className="text-sm text-slate-500 mt-1">Approve and disburse advances</p>
                </div>
              </Link>
              <Link to="/admin/risk-scoring" className="block">
                <div className="p-4 border border-slate-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer" data-testid="quick-risk-scoring">
                  <Shield className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-medium text-slate-900">Risk Scoring</h3>
                  <p className="text-sm text-slate-500 mt-1">Calculate and update risk scores</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pending Employer Verifications */}
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Pending Employer Verifications</CardTitle>
              <Link to="/admin/employers?status=pending" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </CardHeader>
            <CardContent>
              {stats?.pending_employer_verifications > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center py-8 text-slate-500">
                    <p>View employers section for details</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500" />
                  <p>All employers verified</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending KYC Reviews */}
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Pending KYC Reviews</CardTitle>
              <Link to="/admin/kyc" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </CardHeader>
            <CardContent>
              {stats?.pending_employee_verifications > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center py-8 text-slate-500">
                    <p>View KYC section for details</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500" />
                  <p>All KYC documents reviewed</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
