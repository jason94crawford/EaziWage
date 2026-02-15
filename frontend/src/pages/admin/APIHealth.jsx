import React, { useState, useEffect } from 'react';
import { 
  Wifi, Activity, CheckCircle2, AlertTriangle, XCircle, RefreshCw,
  Clock, TrendingUp, Server, Database, CreditCard, Smartphone
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { AdminPortalLayout } from '../../components/admin/AdminLayout';
import { cn } from '../../lib/utils';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Gradient Icon Box
const GradientIconBox = ({ icon: Icon, size = 'md', variant = 'purple' }) => {
  const sizes = { sm: 'w-10 h-10', md: 'w-12 h-12', lg: 'w-14 h-14' };
  const iconSizes = { sm: 'w-5 h-5', md: 'w-6 h-6', lg: 'w-7 h-7' };
  const variants = {
    purple: 'from-purple-600 to-indigo-600 shadow-purple-500/25',
    green: 'from-primary to-emerald-600 shadow-primary/25',
    amber: 'from-amber-500 to-orange-500 shadow-amber-500/25',
    red: 'from-red-500 to-rose-500 shadow-red-500/25'
  };
  
  return (
    <div className={cn("rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg", sizes[size], variants[variant])}>
      <Icon className={cn("text-white", iconSizes[size])} />
    </div>
  );
};

// Status Indicator
const StatusIndicator = ({ status }) => {
  const statusConfig = {
    healthy: { color: 'bg-emerald-500', label: 'Healthy', icon: CheckCircle2 },
    degraded: { color: 'bg-amber-500', label: 'Degraded', icon: AlertTriangle },
    down: { color: 'bg-red-500', label: 'Down', icon: XCircle }
  };
  const config = statusConfig[status] || statusConfig.healthy;
  const Icon = config.icon;

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
      status === 'healthy' && "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
      status === 'degraded' && "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300",
      status === 'down' && "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300"
    )}>
      <div className={cn("w-2 h-2 rounded-full", config.color, status === 'healthy' && "animate-pulse")} />
      {config.label}
    </div>
  );
};

// API Card
const APICard = ({ api, icon: Icon }) => {
  return (
    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/30">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <GradientIconBox icon={Icon} size="md" variant={api.status === 'healthy' ? 'green' : api.status === 'degraded' ? 'amber' : 'red'} />
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">{api.name}</h3>
            <p className="text-sm text-slate-500">{api.provider}</p>
          </div>
        </div>
        <StatusIndicator status={api.status} />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl text-center">
          <p className="text-xs text-slate-500">Latency</p>
          <p className={cn(
            "text-lg font-bold",
            api.latency_ms < 150 ? "text-emerald-600" : api.latency_ms < 300 ? "text-amber-600" : "text-red-600"
          )}>
            {api.latency_ms}ms
          </p>
        </div>
        <div className="p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl text-center">
          <p className="text-xs text-slate-500">Uptime</p>
          <p className={cn(
            "text-lg font-bold",
            api.uptime_percent >= 99.5 ? "text-emerald-600" : api.uptime_percent >= 98 ? "text-amber-600" : "text-red-600"
          )}>
            {api.uptime_percent}%
          </p>
        </div>
        <div className="p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl text-center">
          <p className="text-xs text-slate-500">Today</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            {api.transactions_today || api.syncs_today || 0}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500">Last checked</span>
        <span className="text-slate-700 dark:text-slate-300">
          {new Date(api.last_check).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

// Overall Health Banner
const OverallHealthBanner = ({ status, integrations }) => {
  const healthyCount = integrations.filter(i => i.status === 'healthy').length;
  const totalCount = integrations.length;
  
  return (
    <div className={cn(
      "rounded-2xl p-6 border",
      status === 'healthy' && "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200/50 dark:border-emerald-700/30",
      status === 'degraded' && "bg-amber-50 dark:bg-amber-900/20 border-amber-200/50 dark:border-amber-700/30",
      status === 'down' && "bg-red-50 dark:bg-red-900/20 border-red-200/50 dark:border-red-700/30"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center",
            status === 'healthy' && "bg-emerald-100 dark:bg-emerald-500/20",
            status === 'degraded' && "bg-amber-100 dark:bg-amber-500/20",
            status === 'down' && "bg-red-100 dark:bg-red-500/20"
          )}>
            {status === 'healthy' && <CheckCircle2 className="w-8 h-8 text-emerald-600" />}
            {status === 'degraded' && <AlertTriangle className="w-8 h-8 text-amber-600" />}
            {status === 'down' && <XCircle className="w-8 h-8 text-red-600" />}
          </div>
          <div>
            <h2 className={cn(
              "text-2xl font-bold",
              status === 'healthy' && "text-emerald-900 dark:text-emerald-100",
              status === 'degraded' && "text-amber-900 dark:text-amber-100",
              status === 'down' && "text-red-900 dark:text-red-100"
            )}>
              {status === 'healthy' && 'All Systems Operational'}
              {status === 'degraded' && 'Some Systems Degraded'}
              {status === 'down' && 'System Outage Detected'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              {healthyCount} of {totalCount} integrations are healthy
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-600">{healthyCount}</p>
            <p className="text-xs text-slate-500">Healthy</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-amber-600">
              {integrations.filter(i => i.status === 'degraded').length}
            </p>
            <p className="text-xs text-slate-500">Degraded</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600">
              {integrations.filter(i => i.status === 'down').length}
            </p>
            <p className="text-xs text-slate-500">Down</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdminAPIHealth() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('eaziwage_token');
      const response = await fetch(`${API_URL}/api/admin/api-health`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (err) {
      console.error('Failed to fetch API health:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Map API names to icons
  const getIcon = (name) => {
    if (name.toLowerCase().includes('mpesa') || name.toLowerCase().includes('mobile')) return Smartphone;
    if (name.toLowerCase().includes('airtel')) return Smartphone;
    if (name.toLowerCase().includes('bank')) return CreditCard;
    if (name.toLowerCase().includes('payroll')) return Server;
    return Activity;
  };

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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">API Health Monitor</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Real-time status of all integrated services
            </p>
          </div>
          <Button 
            variant="outline" 
            className="bg-white/60 dark:bg-slate-800/60"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", refreshing && "animate-spin")} /> 
            {refreshing ? 'Refreshing...' : 'Refresh Status'}
          </Button>
        </div>

        {/* Overall Health Banner */}
        <OverallHealthBanner 
          status={data?.overall_status || 'healthy'}
          integrations={data?.integrations || []}
        />

        {/* API Cards Grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          {data?.integrations?.map((api, index) => (
            <APICard 
              key={index}
              api={api}
              icon={getIcon(api.name)}
            />
          ))}
        </div>

        {/* Last Updated */}
        <div className="text-center text-sm text-slate-500 dark:text-slate-400">
          Last updated: {new Date(data?.last_updated).toLocaleString()}
        </div>
      </div>
    </AdminPortalLayout>
  );
}
