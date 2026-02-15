import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, Users, CreditCard, Shield, Clock, CheckCircle2,
  AlertTriangle, TrendingUp, ArrowRight, FileText, Wifi, Activity,
  DollarSign, BarChart3, AlertCircle, Eye
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { AdminPortalLayout } from '../../components/admin/AdminLayout';
import { formatCurrency, cn } from '../../lib/utils';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Gradient Icon Box matching employer portal
const GradientIconBox = ({ icon: Icon, size = 'md', variant = 'purple' }) => {
  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-14 h-14'
  };
  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7'
  };
  const variants = {
    purple: 'from-purple-600 to-indigo-600',
    green: 'from-primary to-emerald-600',
    amber: 'from-amber-500 to-orange-500',
    red: 'from-red-500 to-rose-500',
    blue: 'from-blue-500 to-indigo-500'
  };
  
  return (
    <div className={cn(
      "rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg",
      sizes[size],
      variants[variant],
      variant === 'purple' && 'shadow-purple-500/25',
      variant === 'green' && 'shadow-primary/25',
      variant === 'amber' && 'shadow-amber-500/25',
      variant === 'red' && 'shadow-red-500/25',
      variant === 'blue' && 'shadow-blue-500/25'
    )}>
      <Icon className={cn("text-white", iconSizes[size])} />
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ icon, label, value, subtext, trend, trendUp, variant = 'purple' }) => (
  <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-200/50 dark:border-slate-700/30">
    <div className="flex items-start justify-between">
      <GradientIconBox icon={icon} size="md" variant={variant} />
      {trend && (
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium",
          trendUp ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                 : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300"
        )}>
          <TrendingUp className={cn("w-3 h-3", !trendUp && "rotate-180")} />
          {trend}
        </div>
      )}
    </div>
    <div className="mt-4">
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>
      {subtext && <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{subtext}</p>}
    </div>
  </div>
);

// Alert Card
const AlertCard = ({ icon: Icon, title, count, description, link, variant }) => {
  const variants = {
    amber: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200/50 dark:border-amber-700/30',
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200/50 dark:border-blue-700/30',
    red: 'bg-red-50 dark:bg-red-900/20 border-red-200/50 dark:border-red-700/30',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200/50 dark:border-purple-700/30'
  };
  const iconColors = {
    amber: 'text-amber-600',
    blue: 'text-blue-600',
    red: 'text-red-600',
    purple: 'text-purple-600'
  };

  return (
    <div className={cn("rounded-2xl p-4 flex items-center gap-4 border", variants[variant])}>
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-white/60 dark:bg-slate-800/60 shadow-sm")}>
        <Icon className={cn("w-6 h-6", iconColors[variant])} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("font-bold", iconColors[variant])}>{count} {title}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
      </div>
      <Link to={link}>
        <Button variant="ghost" size="sm" className={iconColors[variant]}>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
};

// API Health Status Card
const APIHealthCard = ({ api }) => {
  const statusColors = {
    healthy: 'bg-emerald-500',
    degraded: 'bg-amber-500',
    down: 'bg-red-500'
  };

  return (
    <div className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl">
      <div className="flex items-center gap-3">
        <div className={cn("w-2.5 h-2.5 rounded-full", statusColors[api.status], api.status === 'healthy' && 'animate-pulse')} />
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-white">{api.name}</p>
          <p className="text-xs text-slate-500">{api.provider}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-slate-900 dark:text-white">{api.latency_ms}ms</p>
        <p className="text-xs text-slate-500">{api.uptime_percent}% uptime</p>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('eaziwage_token');
        const response = await fetch(`${API_URL}/api/admin/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
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
      <AdminPortalLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-14 h-14 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </div>
      </AdminPortalLayout>
    );
  }

  return (
    <AdminPortalLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="admin-dashboard-title">
              Dashboard Overview
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Platform-wide metrics and operations
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-white/60 dark:bg-slate-800/60">
              <BarChart3 className="w-4 h-4 mr-2" /> Reports
            </Button>
          </div>
        </div>

        {/* Alerts Section */}
        {(stats?.kyc_pending?.employers > 0 || stats?.kyc_pending?.employees > 0 || stats?.pending_reviews > 0) && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats?.kyc_pending?.employers > 0 && (
              <AlertCard 
                icon={Building2}
                title="Employers"
                count={stats.kyc_pending.employers}
                description="Pending verification"
                link="/admin/employers?status=pending"
                variant="amber"
              />
            )}
            {stats?.kyc_pending?.employees > 0 && (
              <AlertCard 
                icon={FileText}
                title="KYC Reviews"
                count={stats.kyc_pending.employees}
                description="Documents to review"
                link="/admin/kyc-review"
                variant="blue"
              />
            )}
            {stats?.pending_reviews > 0 && (
              <AlertCard 
                icon={Shield}
                title="Risk Reviews"
                count={stats.pending_reviews}
                description="Employer requests"
                link="/admin/risk-scoring"
                variant="purple"
              />
            )}
          </div>
        )}

        {/* Main Metrics Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            icon={Building2}
            label="Total Employers"
            value={stats?.employers?.total || 0}
            subtext={`${stats?.employers?.active || 0} active`}
            trend="+12%"
            trendUp={true}
            variant="purple"
          />
          <MetricCard 
            icon={Users}
            label="Total Employees"
            value={stats?.employees?.total || 0}
            subtext={`${stats?.employees?.active || 0} active`}
            trend="+18%"
            trendUp={true}
            variant="blue"
          />
          <MetricCard 
            icon={CreditCard}
            label="Total Advances"
            value={stats?.advances?.total_count || 0}
            subtext={`${stats?.advances?.pending_count || 0} pending`}
            variant="green"
          />
          <MetricCard 
            icon={DollarSign}
            label="Total Disbursed"
            value={formatCurrency(stats?.advances?.total_disbursed || 0)}
            subtext={`Fees: ${formatCurrency(stats?.advances?.total_fees || 0)}`}
            variant="amber"
          />
        </div>

        {/* Secondary Stats Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Monthly Performance */}
          <div className="lg:col-span-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/30">
            <div className="flex items-center gap-3 mb-6">
              <GradientIconBox icon={Activity} size="md" variant="purple" />
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Monthly Performance</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Current month statistics</p>
              </div>
            </div>
            
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 dark:from-purple-500/10 dark:to-indigo-500/10 rounded-xl border border-purple-200/30 dark:border-purple-700/20">
                <p className="text-sm text-slate-500 dark:text-slate-400">Disbursed This Month</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                  {formatCurrency(stats?.monthly?.disbursed || 0)}
                </p>
                <p className="text-xs text-slate-400 mt-1">{stats?.monthly?.advance_count || 0} advances</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-primary/5 to-emerald-500/5 dark:from-primary/10 dark:to-emerald-500/10 rounded-xl border border-primary/20">
                <p className="text-sm text-slate-500 dark:text-slate-400">Platform Fees</p>
                <p className="text-2xl font-bold text-primary mt-1">
                  {formatCurrency(stats?.monthly?.fees || 0)}
                </p>
                <p className="text-xs text-slate-400 mt-1">Revenue this month</p>
              </div>
              <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl">
                <p className="text-sm text-slate-500 dark:text-slate-400">Avg. Employer Risk</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {stats?.risk?.avg_employer_score?.toFixed(1) || '3.5'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {stats?.risk?.avg_employer_score >= 4 ? 'Low Risk' :
                   stats?.risk?.avg_employer_score >= 3 ? 'Medium Risk' : 'High Risk'}
                </p>
              </div>
            </div>
          </div>

          {/* API Health */}
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <GradientIconBox icon={Wifi} size="sm" variant="green" />
                <h2 className="font-bold text-slate-900 dark:text-white">API Health</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">All Systems Operational</span>
              </div>
            </div>
            
            <div className="space-y-2">
              {stats?.api_health && Object.entries(stats.api_health).map(([key, api]) => (
                <APIHealthCard key={key} api={{ ...api, name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }} />
              ))}
            </div>

            <Link to="/admin/api-health" className="inline-flex items-center gap-1 text-sm text-primary mt-4 hover:gap-2 transition-all">
              View Details <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/admin/employers?status=pending" className="group">
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-200/50 dark:border-slate-700/30 hover:border-purple-300 dark:hover:border-purple-600/30 transition-all hover:shadow-lg hover:shadow-purple-500/10">
              <div className="flex items-center gap-3">
                <GradientIconBox icon={CheckCircle2} size="sm" variant="amber" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Verify Employers</p>
                  <p className="text-xs text-slate-500">{stats?.kyc_pending?.employers || 0} pending</p>
                </div>
              </div>
            </div>
          </Link>
          <Link to="/admin/kyc-review" className="group">
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-200/50 dark:border-slate-700/30 hover:border-purple-300 dark:hover:border-purple-600/30 transition-all hover:shadow-lg hover:shadow-purple-500/10">
              <div className="flex items-center gap-3">
                <GradientIconBox icon={FileText} size="sm" variant="blue" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Review KYC</p>
                  <p className="text-xs text-slate-500">{stats?.kyc_pending?.employees || 0} documents</p>
                </div>
              </div>
            </div>
          </Link>
          <Link to="/admin/risk-scoring" className="group">
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-200/50 dark:border-slate-700/30 hover:border-purple-300 dark:hover:border-purple-600/30 transition-all hover:shadow-lg hover:shadow-purple-500/10">
              <div className="flex items-center gap-3">
                <GradientIconBox icon={Shield} size="sm" variant="purple" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Risk Scoring</p>
                  <p className="text-xs text-slate-500">Calculate & override</p>
                </div>
              </div>
            </div>
          </Link>
          <Link to="/admin/reconciliation" className="group">
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-200/50 dark:border-slate-700/30 hover:border-purple-300 dark:hover:border-purple-600/30 transition-all hover:shadow-lg hover:shadow-purple-500/10">
              <div className="flex items-center gap-3">
                <GradientIconBox icon={BarChart3} size="sm" variant="green" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Reconciliation</p>
                  <p className="text-xs text-slate-500">Payment tracking</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </AdminPortalLayout>
  );
}
