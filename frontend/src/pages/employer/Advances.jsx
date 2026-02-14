import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Search, Download, Clock, CheckCircle2,
  XCircle, AlertCircle, TrendingUp, Eye, Filter,
  ArrowUpRight, ChevronRight, DollarSign, Users, Zap, Calendar, Globe
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '../../components/ui/select';
import { EmployerPortalLayout } from '../../components/employer/EmployerLayout';
import { advanceApi, employerApi } from '../../lib/api';
import { formatCurrency, formatDateTime, cn } from '../../lib/utils';
import { GradientIconBox, GradientAvatar, currencies, countries } from '../../components/employer/SharedComponents';

// Metric Card with gradient icon (matches website)
const MetricCard = ({ icon: Icon, label, value, subtext, valueColor }) => (
  <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-200/50 dark:border-slate-700/30">
    <div className="flex items-start justify-between">
      <GradientIconBox icon={Icon} size="md" />
    </div>
    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-4">{label}</p>
    <p className={cn("text-2xl font-bold mt-1", valueColor || "text-slate-900 dark:text-white")}>{value}</p>
    {subtext && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtext}</p>}
  </div>
);

// Status Badge
const StatusBadge = ({ status }) => {
  const config = {
    disbursed: { bg: 'bg-emerald-100 dark:bg-emerald-500/20', text: 'text-emerald-700 dark:text-emerald-300', label: 'Disbursed' },
    approved: { bg: 'bg-blue-100 dark:bg-blue-500/20', text: 'text-blue-700 dark:text-blue-300', label: 'Approved' },
    pending: { bg: 'bg-amber-100 dark:bg-amber-500/20', text: 'text-amber-700 dark:text-amber-300', label: 'Pending' },
    rejected: { bg: 'bg-red-100 dark:bg-red-500/20', text: 'text-red-700 dark:text-red-300', label: 'Rejected' },
    repaid: { bg: 'bg-slate-100 dark:bg-slate-700/50', text: 'text-slate-700 dark:text-slate-300', label: 'Repaid' },
  };
  const { bg, text, label } = config[status] || config.pending;
  
  return (
    <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", bg, text)}>
      {label}
    </span>
  );
};

// Advance Row
const AdvanceRow = ({ advance, currency }) => (
  <div className="flex items-center gap-4 p-4 bg-white/40 dark:bg-slate-800/40 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors group">
    {/* Employee Avatar */}
    <GradientAvatar 
      initials={advance.employee_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'EM'}
      size="md"
    />
    
    {/* Employee Info */}
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-slate-900 dark:text-white truncate">{advance.employee_name}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">ID: {advance.id?.slice(0, 8)}...</p>
    </div>
    
    {/* Amount */}
    <div className="text-right hidden sm:block">
      <p className="font-bold text-slate-900 dark:text-white">{formatCurrency(advance.amount, currency)}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">Fee: {advance.fee_percentage}%</p>
    </div>
    
    {/* Net Amount */}
    <div className="text-right hidden md:block">
      <p className="font-bold text-primary">{formatCurrency(advance.net_amount, currency)}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">Net payout</p>
    </div>
    
    {/* Method */}
    <div className="hidden lg:block">
      <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700/50 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 capitalize">
        {advance.disbursement_method?.replace('_', ' ')}
      </span>
    </div>
    
    {/* Status */}
    <StatusBadge status={advance.status} />
    
    {/* Date */}
    <div className="text-right hidden xl:block">
      <p className="text-sm text-slate-600 dark:text-slate-300">{formatDateTime(advance.created_at)}</p>
    </div>
    
    {/* Action */}
    <button className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors opacity-0 group-hover:opacity-100">
      <Eye className="w-4 h-4" />
    </button>
  </div>
);

// Filter Button
const FilterButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={cn(
      "px-4 py-2 rounded-xl text-sm font-medium transition-all",
      active 
        ? "bg-gradient-to-r from-primary to-emerald-600 text-white shadow-lg shadow-primary/25"
        : "bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800"
    )}
  >
    {children}
  </button>
);

export default function EmployerAdvances() {
  const [advances, setAdvances] = useState([]);
  const [employer, setEmployer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('KES');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

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

  // Stats calculations
  const stats = {
    total: advances.length,
    totalAmount: advances.reduce((sum, a) => sum + (a.amount || 0), 0),
    disbursed: advances.filter(a => a.status === 'disbursed').length,
    disbursedAmount: advances.filter(a => a.status === 'disbursed').reduce((sum, a) => sum + (a.amount || 0), 0),
    pending: advances.filter(a => a.status === 'pending').length,
    pendingAmount: advances.filter(a => a.status === 'pending').reduce((sum, a) => sum + (a.amount || 0), 0),
    avgFee: advances.length > 0 
      ? (advances.reduce((sum, a) => sum + (a.fee_percentage || 0), 0) / advances.length).toFixed(2)
      : 0
  };

  // Format currency helper
  const fc = (amount) => formatCurrency(amount, selectedCurrency);

  return (
    <EmployerPortalLayout employer={employer}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="advances-title">
              Employee Advances
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Track and monitor wage advance requests from your employees
            </p>
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"
            data-testid="export-advances-btn"
          >
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            icon={CreditCard}
            label="Total Requests"
            value={stats.total}
            subtext={formatCurrency(stats.totalAmount) + ' total'}
          />
          <MetricCard 
            icon={CheckCircle2}
            label="Disbursed"
            value={stats.disbursed}
            subtext={formatCurrency(stats.disbursedAmount)}
            valueColor="text-emerald-600"
          />
          <MetricCard 
            icon={Clock}
            label="Pending"
            value={stats.pending}
            subtext={formatCurrency(stats.pendingAmount)}
            valueColor="text-amber-600"
          />
          <MetricCard 
            icon={TrendingUp}
            label="Avg. Fee Rate"
            value={stats.avgFee + '%'}
            subtext="Based on risk scores"
          />
        </div>

        {/* Search & Filters */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50 dark:border-slate-700/30">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search by employee name or advance ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 rounded-xl"
                data-testid="search-advances"
              />
            </div>
            
            {/* Filter Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <FilterButton active={statusFilter === ''} onClick={() => setStatusFilter('')}>
                All
              </FilterButton>
              <FilterButton active={statusFilter === 'pending'} onClick={() => setStatusFilter('pending')}>
                Pending
              </FilterButton>
              <FilterButton active={statusFilter === 'approved'} onClick={() => setStatusFilter('approved')}>
                Approved
              </FilterButton>
              <FilterButton active={statusFilter === 'disbursed'} onClick={() => setStatusFilter('disbursed')}>
                Disbursed
              </FilterButton>
              <FilterButton active={statusFilter === 'rejected'} onClick={() => setStatusFilter('rejected')}>
                Rejected
              </FilterButton>
            </div>
          </div>
        </div>

        {/* Advances List */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/30 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : filteredAdvances.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">No advances found</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                {searchTerm || statusFilter 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Advance requests from employees will appear here'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200/50 dark:divide-slate-700/30">
              {/* Header Row */}
              <div className="hidden lg:flex items-center gap-4 px-4 py-3 bg-slate-50/50 dark:bg-slate-800/30 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <div className="w-11" /> {/* Avatar space */}
                <div className="flex-1">Employee</div>
                <div className="w-24 text-right hidden sm:block">Amount</div>
                <div className="w-24 text-right hidden md:block">Net Payout</div>
                <div className="w-24 hidden lg:block">Method</div>
                <div className="w-24">Status</div>
                <div className="w-32 text-right hidden xl:block">Date</div>
                <div className="w-10" /> {/* Action space */}
              </div>
              
              {/* Advance Rows */}
              {filteredAdvances.map((advance) => (
                <AdvanceRow key={advance.id} advance={advance} />
              ))}
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-200">How Advances Work</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-blue-800 dark:text-blue-300/80">
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-blue-500" />
                  Employees can request up to 50% of their earned wages
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-blue-500" />
                  A fee of 3.5% - 6.5% is charged based on risk scores
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-blue-500" />
                  Advances are automatically deducted from next payroll
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-blue-500" />
                  All disbursements are processed within 24 hours
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </EmployerPortalLayout>
  );
}
