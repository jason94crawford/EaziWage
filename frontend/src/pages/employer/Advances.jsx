import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Search, Filter, Download, Clock, CheckCircle2,
  XCircle, AlertCircle, DollarSign, TrendingUp, Calendar, Eye
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { advanceApi, employerApi } from '../../lib/api';
import { formatCurrency, formatDateTime, cn } from '../../lib/utils';

export default function EmployerAdvances() {
  const [advances, setAdvances] = useState([]);
  const [employer, setEmployer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [advancesRes, employerRes] = await Promise.all([
          advanceApi.list(),
          employerApi.getMe()
        ]);
        setAdvances(advancesRes.data);
        setEmployer(employerRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredAdvances = advances.filter(a => {
    if (statusFilter && a.status !== statusFilter) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        a.employee_name?.toLowerCase().includes(search) ||
        a.id?.toLowerCase().includes(search)
      );
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'disbursed':
        return <Badge className="bg-emerald-100 text-emerald-700">Disbursed</Badge>;
      case 'approved':
        return <Badge className="bg-blue-100 text-blue-700">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-700">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700">Rejected</Badge>;
      case 'repaid':
        return <Badge className="bg-slate-100 text-slate-700">Repaid</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700">{status}</Badge>;
    }
  };

  const stats = {
    total: advances.length,
    totalAmount: advances.reduce((sum, a) => sum + (a.amount || 0), 0),
    disbursed: advances.filter(a => a.status === 'disbursed').length,
    disbursedAmount: advances
      .filter(a => a.status === 'disbursed')
      .reduce((sum, a) => sum + (a.amount || 0), 0),
    pending: advances.filter(a => a.status === 'pending').length,
    pendingAmount: advances
      .filter(a => a.status === 'pending')
      .reduce((sum, a) => sum + (a.amount || 0), 0),
    avgFee: advances.length > 0 
      ? (advances.reduce((sum, a) => sum + (a.fee_percentage || 0), 0) / advances.length).toFixed(2)
      : 0
  };

  return (
    <DashboardLayout role="employer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-slate-900" data-testid="advances-title">Employee Advances</h1>
            <p className="text-slate-500 mt-1">Track and monitor wage advance requests from your employees</p>
          </div>
          <Button variant="outline" className="flex items-center gap-2" data-testid="export-advances-btn">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-slate-200" data-testid="total-requests-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Requests</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
                  <p className="text-xs text-slate-400 mt-1">{formatCurrency(stats.totalAmount)} total</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-slate-200" data-testid="disbursed-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Disbursed</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.disbursed}</p>
                  <p className="text-xs text-emerald-600 mt-1">{formatCurrency(stats.disbursedAmount)}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200" data-testid="pending-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Pending</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p>
                  <p className="text-xs text-amber-600 mt-1">{formatCurrency(stats.pendingAmount)}</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200" data-testid="avg-fee-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Avg. Fee Rate</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats.avgFee}%</p>
                  <p className="text-xs text-slate-400 mt-1">Based on risk scores</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by employee name or advance ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="search-advances"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {['', 'pending', 'approved', 'disbursed', 'rejected'].map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'outline'}
                    onClick={() => setStatusFilter(status)}
                    className={cn(statusFilter === status ? 'bg-primary' : '')}
                    size="sm"
                    data-testid={`filter-${status || 'all'}`}
                  >
                    {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'All'}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advances Table */}
        <Card className="border-slate-200">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredAdvances.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <CreditCard className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="font-medium">No advances found</p>
                <p className="text-sm mt-1">Advance requests from employees will appear here</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Net Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdvances.map((advance) => (
                    <TableRow key={advance.id} data-testid={`advance-row-${advance.id}`}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-primary font-semibold text-sm">
                              {advance.employee_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'EM'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{advance.employee_name}</p>
                            <p className="text-xs text-slate-500">{advance.id?.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-slate-900">{formatCurrency(advance.amount)}</TableCell>
                      <TableCell>
                        <span className="text-slate-600">{advance.fee_percentage}%</span>
                        <span className="text-xs text-slate-400 block">{formatCurrency(advance.fee_amount)}</span>
                      </TableCell>
                      <TableCell className="font-medium text-primary">{formatCurrency(advance.net_amount)}</TableCell>
                      <TableCell>
                        <span className="capitalize text-sm">{advance.disbursement_method?.replace('_', ' ')}</span>
                      </TableCell>
                      <TableCell>{getStatusBadge(advance.status)}</TableCell>
                      <TableCell className="text-sm text-slate-500">{formatDateTime(advance.created_at)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" data-testid={`view-advance-${advance.id}`}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border-slate-200 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">How Advances Work</h3>
                <ul className="mt-2 space-y-1 text-sm text-blue-800">
                  <li>Employees can request up to 50% of their earned wages</li>
                  <li>A fee of 3.5% - 6.5% is charged based on risk scores</li>
                  <li>Advances are automatically deducted from next payroll</li>
                  <li>All disbursements are processed within 24 hours</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
