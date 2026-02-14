import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, TrendingUp, CheckCircle2, Clock, AlertCircle,
  Building2, Wallet, Home, History, User, Download, Smartphone, Calendar
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { advanceApi } from '../../lib/api';
import { formatCurrency, cn } from '../../lib/utils';

// Bottom Navigation
const BottomNav = ({ active }) => {
  const navigate = useNavigate();
  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/employee' },
    { id: 'wallet', icon: Wallet, label: 'Advance', path: '/employee/advances' },
    { id: 'history', icon: History, label: 'History', path: '/employee/transactions' },
    { id: 'profile', icon: User, label: 'Profile', path: '/employee/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto px-4 pb-2">
        <div className="glass-card rounded-2xl shadow-xl border border-slate-200/50 dark:border-white/10">
          <div className="flex items-center justify-around h-16">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => navigate(item.path)}
                className={cn("flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all",
                  active === item.id ? "text-primary" : "text-slate-400 dark:text-slate-500"
                )} data-testid={`nav-${item.id}`}>
                <item.icon className={cn("w-5 h-5", active === item.id && "scale-110")} />
                <span className="text-[10px] font-semibold">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default function EmployeeTransactions() {
  const navigate = useNavigate();
  const [advances, setAdvances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const advRes = await advanceApi.list();
        setAdvances(advRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const allItems = advances.map(a => ({
    id: a.id, type: 'advance', amount: a.amount, status: a.status, method: a.disbursement_method, created_at: a.created_at,
  })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const filteredItems = allItems.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'pending') return item.status === 'pending' || item.status === 'approved';
    if (filter === 'completed') return item.status === 'disbursed' || item.status === 'completed';
    if (filter === 'failed') return item.status === 'rejected';
    return true;
  });

  const currentMonth = new Date().getMonth();
  const monthlyTotal = advances.filter(a => new Date(a.created_at).getMonth() === currentMonth && (a.status === 'disbursed' || a.status === 'completed')).reduce((sum, a) => sum + a.amount, 0);
  const totalTransactions = advances.filter(a => a.status === 'disbursed' || a.status === 'completed').length;

  const getStatusConfig = (status) => {
    switch (status) {
      case 'disbursed': case 'completed': return { icon: CheckCircle2, label: 'Completed', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-500/20' };
      case 'pending': return { icon: Clock, label: 'Processing', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-500/20', pulse: true };
      case 'approved': return { icon: CheckCircle2, label: 'Approved', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-500/20' };
      case 'rejected': return { icon: AlertCircle, label: 'Failed', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-500/20' };
      default: return { icon: Clock, label: status, color: 'text-slate-600', bg: 'bg-slate-100' };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    if (date.toDateString() === yesterday.toDateString()) return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filters = [
    { id: 'all', label: 'All', count: allItems.length },
    { id: 'pending', label: 'Pending', count: allItems.filter(i => i.status === 'pending' || i.status === 'approved').length },
    { id: 'completed', label: 'Completed', count: allItems.filter(i => i.status === 'disbursed' || i.status === 'completed').length },
    { id: 'failed', label: 'Failed', count: allItems.filter(i => i.status === 'rejected').length },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px]" />

      {/* Header */}
      <header className="relative z-10 max-w-md mx-auto px-4 py-4 flex items-center justify-between">
        <button onClick={() => navigate('/employee')} className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all" data-testid="back-btn">
          <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Transaction History</h1>
        <div className="w-11" />
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-md mx-auto px-4 pb-28 space-y-5">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card rounded-2xl p-4">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">This Month</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white" data-testid="monthly-total">{formatCurrency(monthlyTotal)}</p>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center mb-2">
              <Calendar className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Transactions</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{totalTransactions}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {filters.map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={cn("flex items-center gap-2 h-9 min-w-fit shrink-0 px-4 rounded-xl text-sm font-semibold transition-all",
                filter === f.id ? "bg-primary text-white shadow-lg shadow-primary/30" : "glass-card text-slate-600 dark:text-slate-300"
              )} data-testid={`filter-${f.id}`}>
              {f.label}
              {f.count > 0 && <span className={cn("text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center",
                filter === f.id ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
              )}>{f.count}</span>}
            </button>
          ))}
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Recent Activity</h3>
            <button className="text-primary text-xs font-semibold flex items-center gap-1" data-testid="export-btn">
              <Download className="w-3 h-3" />Export
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
                <History className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-semibold text-sm">No transactions found</p>
              <p className="text-xs text-slate-400 mt-1">Your transaction history will appear here</p>
              <Link to="/employee/advances" className="mt-4">
                <Button className="bg-primary text-white font-semibold text-sm">Request Your First Advance</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => {
                const config = getStatusConfig(item.status);
                const StatusIcon = config.icon;
                return (
                  <div key={item.id} className="glass-card rounded-2xl p-4" data-testid={`transaction-${item.id}`}>
                    <div className="flex items-center gap-3">
                      <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                        item.method === 'mobile_money' ? "bg-green-100 dark:bg-green-500/20" : "bg-blue-100 dark:bg-blue-500/20"
                      )}>
                        {item.method === 'mobile_money' ? <Smartphone className="w-5 h-5 text-green-600 dark:text-green-400" /> : <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold text-slate-900 dark:text-white text-sm">Wage Advance</p>
                          {config.pulse && <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(item.created_at)}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={cn("text-base font-bold mb-0.5", item.status === 'rejected' ? "text-slate-400 line-through" : "text-slate-900 dark:text-white")}>{formatCurrency(item.amount)}</p>
                        <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold", config.bg, config.color)}>
                          <StatusIcon className="w-3 h-3" />{config.label}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <BottomNav active="history" />
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
}
