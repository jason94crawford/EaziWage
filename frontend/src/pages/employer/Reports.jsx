import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Download, Calendar, TrendingUp, TrendingDown,
  Users, CreditCard, DollarSign, PieChart, ArrowUpRight, ArrowDownRight,
  FileText, Filter
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '../../components/ui/select';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { dashboardApi, advanceApi, employeeApi, employerApi } from '../../lib/api';
import { formatCurrency, cn } from '../../lib/utils';

export default function EmployerReports() {
  const [stats, setStats] = useState(null);
  const [employer, setEmployer] = useState(null);
  const [advances, setAdvances] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, employerRes, advancesRes, employeesRes] = await Promise.all([
          dashboardApi.getEmployerDashboard(),
          employerApi.getMe(),
          advanceApi.list(),
          employeeApi.list()
        ]);
        setStats(statsRes.data);
        setEmployer(employerRes.data);
        setAdvances(advancesRes.data);
        setEmployees(employeesRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate reports data
  const totalDisbursed = advances
    .filter(a => a.status === 'disbursed')
    .reduce((sum, a) => sum + (a.amount || 0), 0);
  
  const totalFees = advances
    .filter(a => a.status === 'disbursed')
    .reduce((sum, a) => sum + (a.fee_amount || 0), 0);
  
  const avgAdvanceAmount = advances.length > 0
    ? totalDisbursed / advances.filter(a => a.status === 'disbursed').length || 0
    : 0;

  const advancesByMethod = {
    mobile_money: advances.filter(a => a.disbursement_method === 'mobile_money').length,
    bank_transfer: advances.filter(a => a.disbursement_method === 'bank_transfer').length
  };

  const employeeStats = {
    total: employees.length,
    active: employees.filter(e => e.status === 'approved').length,
    withAdvances: new Set(advances.map(a => a.employee_id)).size,
    utilizationRate: employees.length > 0 
      ? ((new Set(advances.map(a => a.employee_id)).size / employees.length) * 100).toFixed(1)
      : 0
  };

  const reportCards = [
    {
      title: 'Total Disbursed',
      value: formatCurrency(totalDisbursed),
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600'
    },
    {
      title: 'Total Fees Collected',
      value: formatCurrency(totalFees),
      change: '+8.2%',
      changeType: 'positive',
      icon: CreditCard,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Avg. Advance Amount',
      value: formatCurrency(avgAdvanceAmount),
      change: '-2.1%',
      changeType: 'negative',
      icon: TrendingUp,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Utilization Rate',
      value: `${employeeStats.utilizationRate}%`,
      change: '+5.3%',
      changeType: 'positive',
      icon: Users,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600'
    }
  ];

  return (
    <DashboardLayout role="employer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-slate-900" data-testid="reports-title">Reports & Analytics</h1>
            <p className="text-slate-500 mt-1">Insights into your EaziWage program performance</p>
          </div>
          <div className="flex gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40" data-testid="period-select">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this_week">This Week</SelectItem>
                <SelectItem value="this_month">This Month</SelectItem>
                <SelectItem value="last_month">Last Month</SelectItem>
                <SelectItem value="this_quarter">This Quarter</SelectItem>
                <SelectItem value="this_year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2" data-testid="download-report-btn">
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportCards.map((card, index) => (
            <Card key={index} className="border-slate-200" data-testid={`metric-card-${index}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{card.title}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{card.value}</p>
                    <div className={cn(
                      "flex items-center gap-1 mt-2 text-xs font-medium",
                      card.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'
                    )}>
                      {card.changeType === 'positive' ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {card.change} vs last period
                    </div>
                  </div>
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", card.iconBg)}>
                    <card.icon className={cn("w-6 h-6", card.iconColor)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Disbursement by Method */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" />
                Disbursement by Method
              </CardTitle>
              <CardDescription>How employees prefer to receive advances</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-primary rounded-full"></div>
                    <span className="font-medium text-slate-900">Mobile Money</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">{advancesByMethod.mobile_money}</p>
                    <p className="text-xs text-slate-500">
                      {advances.length > 0 
                        ? ((advancesByMethod.mobile_money / advances.length) * 100).toFixed(0) 
                        : 0}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-slate-900">Bank Transfer</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">{advancesByMethod.bank_transfer}</p>
                    <p className="text-xs text-slate-500">
                      {advances.length > 0 
                        ? ((advancesByMethod.bank_transfer / advances.length) * 100).toFixed(0) 
                        : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employee Breakdown */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Employee Breakdown
              </CardTitle>
              <CardDescription>Program adoption statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <span className="text-slate-600">Total Enrolled</span>
                  <span className="font-bold text-slate-900">{employeeStats.total}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <span className="text-slate-600">Active Users</span>
                  <span className="font-bold text-emerald-600">{employeeStats.active}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <span className="text-slate-600">Used Advances</span>
                  <span className="font-bold text-blue-600">{employeeStats.withAdvances}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <span className="text-slate-700 font-medium">Utilization Rate</span>
                  <span className="font-bold text-primary text-lg">{employeeStats.utilizationRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Top Requesters */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Monthly Summary */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Monthly Summary
              </CardTitle>
              <CardDescription>Key metrics for the current period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: 'Total Requests', value: advances.length, color: 'text-slate-900' },
                  { label: 'Approved', value: advances.filter(a => a.status === 'approved' || a.status === 'disbursed').length, color: 'text-emerald-600' },
                  { label: 'Pending Review', value: advances.filter(a => a.status === 'pending').length, color: 'text-amber-600' },
                  { label: 'Rejected', value: advances.filter(a => a.status === 'rejected').length, color: 'text-red-600' },
                  { label: 'Total Disbursed', value: formatCurrency(totalDisbursed), color: 'text-primary' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <span className="text-slate-600">{item.label}</span>
                    <span className={cn("font-semibold", item.color)}>{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Available Reports */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Available Reports
              </CardTitle>
              <CardDescription>Download detailed reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Advances Summary', description: 'All advance requests and their status', icon: CreditCard },
                  { name: 'Employee Report', description: 'Employee enrollment and activity', icon: Users },
                  { name: 'Financial Report', description: 'Fees, disbursements, and deductions', icon: DollarSign },
                  { name: 'Payroll Reconciliation', description: 'Monthly payroll deductions', icon: Calendar },
                ].map((report, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group"
                    data-testid={`report-${index}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <report.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{report.name}</p>
                        <p className="text-xs text-slate-500">{report.description}</p>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Company Risk Score */}
        {employer?.risk_score && (
          <Card className="border-slate-200 bg-gradient-to-r from-primary/5 to-emerald-500/5">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-slate-900">Company Risk Score</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Your company's risk assessment determines the fee rates for employee advances
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-primary">{employer.risk_score.toFixed(2)}</p>
                    <p className="text-xs text-slate-500">out of 5.0</p>
                  </div>
                  <div className={cn(
                    "px-4 py-2 rounded-lg font-semibold",
                    employer.risk_score >= 4 ? 'bg-emerald-100 text-emerald-700' :
                    employer.risk_score >= 3 ? 'bg-blue-100 text-blue-700' :
                    employer.risk_score >= 2.6 ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  )}>
                    {employer.risk_score >= 4 ? 'Low Risk' :
                     employer.risk_score >= 3 ? 'Medium Risk' :
                     employer.risk_score >= 2.6 ? 'High Risk' : 'Very High Risk'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
