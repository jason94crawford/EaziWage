import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, TrendingUp, CheckCircle2, Clock, AlertCircle,
  Building2, Wallet as WalletIcon, Home, History, User, Download,
  Filter, Smartphone, ArrowUpRight, ArrowDownLeft, Calendar
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { transactionApi, advanceApi } from '../../lib/api';
import { formatCurrency, formatDateTime, cn } from '../../lib/utils';
import { useTheme } from '../../lib/ThemeContext';

// Bottom Navigation Component
const BottomNav = ({ active }) => {
  const navigate = useNavigate();
  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/employee' },
    { id: 'wallet', icon: WalletIcon, label: 'Advance', path: '/employee/advances' },
    { id: 'history', icon: History, label: 'History', path: '/employee/transactions' },
    { id: 'profile', icon: User, label: 'Profile', path: '/employee/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200/50 dark:border-white/5 z-50 md:hidden">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-full h-full transition-all",
              active === item.id 
                ? "text-primary" 
                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            )}
            data-testid={`nav-${item.id}`}
          >
            <item.icon className={cn("w-5 h-5", active === item.id && "scale-110")} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default function EmployeeTransactions() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [advances, setAdvances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txRes, advRes] = await Promise.all([
          transactionApi.list(),
          advanceApi.list()
        ]);
        setTransactions(txRes.data);
        setAdvances(advRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Combine and sort items by date
  const allItems = [
    ...advances.map(a => ({
      id: a.id,
      type: 'advance',
      amount: a.amount,
      net_amount: a.net_amount,
      fee: a.fee_amount,
      status: a.status,
      method: a.disbursement_method,
      created_at: a.created_at,
      description: a.disbursement_method === 'mobile_money' ? 'Mobile Money' : 'Bank Transfer'
    })),
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const filteredItems = allItems.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'pending') return item.status === 'pending';
    if (filter === 'completed') return item.status === 'disbursed' || item.status === 'completed';
    if (filter === 'failed') return item.status === 'rejected';
    return true;
  });

  // Calculate stats
  const currentMonth = new Date().getMonth();
  const monthlyTotal = advances
    .filter(a => new Date(a.created_at).getMonth() === currentMonth && (a.status === 'disbursed' || a.status === 'completed'))
    .reduce((sum, a) => sum + a.amount, 0);
  
  const totalTransactions = advances.filter(a => a.status === 'disbursed' || a.status === 'completed').length;
  const pendingCount = advances.filter(a => a.status === 'pending' || a.status === 'approved').length;

  const getStatusConfig = (status) => {
    switch (status) {
      case 'disbursed':
      case 'completed':
        return {
          icon: CheckCircle2,
          label: 'Completed',
          iconBg: 'bg-green-100 dark:bg-green-500/20',
          iconColor: 'text-green-600 dark:text-green-400',
          textColor: 'text-green-600 dark:text-green-400',
          badgeBg: 'bg-green-100 dark:bg-green-500/20',
        };
      case 'pending':
        return {
          icon: Clock,
          label: 'Processing',
          iconBg: 'bg-orange-100 dark:bg-orange-500/20',
          iconColor: 'text-orange-600 dark:text-orange-400',
          textColor: 'text-orange-600 dark:text-orange-400',
          badgeBg: 'bg-orange-100 dark:bg-orange-500/20',
          showPulse: true
        };
      case 'approved':
        return {
          icon: CheckCircle2,
          label: 'Approved',
          iconBg: 'bg-blue-100 dark:bg-blue-500/20',
          iconColor: 'text-blue-600 dark:text-blue-400',
          textColor: 'text-blue-600 dark:text-blue-400',
          badgeBg: 'bg-blue-100 dark:bg-blue-500/20',
        };
      case 'rejected':
        return {
          icon: AlertCircle,
          label: 'Failed',
          iconBg: 'bg-red-100 dark:bg-red-500/10',
          iconColor: 'text-red-600 dark:text-red-400',
          textColor: 'text-red-600 dark:text-red-400',
          badgeBg: 'bg-red-100 dark:bg-red-500/20',
        };
      default:
        return {
          icon: Clock,
          label: status,
          iconBg: 'bg-slate-100 dark:bg-slate-700',
          iconColor: 'text-slate-600 dark:text-slate-400',
          textColor: 'text-slate-600 dark:text-slate-400',
          badgeBg: 'bg-slate-100 dark:bg-slate-700',
        };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filters = [
    { id: 'all', label: 'All', count: allItems.length },
    { id: 'pending', label: 'Pending', count: allItems.filter(i => i.status === 'pending' || i.status === 'approved').length },
    { id: 'completed', label: 'Completed', count: allItems.filter(i => i.status === 'disbursed' || i.status === 'completed').length },
    { id: 'failed', label: 'Failed', count: allItems.filter(i => i.status === 'rejected').length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-white pb-24 md:pb-8">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative flex flex-col min-h-screen w-full max-w-md mx-auto z-10">
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl px-4 py-4 border-b border-slate-200/50 dark:border-white/5">
          <button 
            onClick={() => navigate('/employee')}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            data-testid="back-btn"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold tracking-tight flex-1 text-center pr-10">Transaction History</h1>
        </header>

        <main className="flex flex-col gap-6 px-4 py-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50 dark:border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">This Month</p>
              <p className="text-xl font-bold" data-testid="monthly-total">{formatCurrency(monthlyTotal)}</p>
            </div>
            <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50 dark:border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-500" />
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Transactions</p>
              <p className="text-xl font-bold">{totalTransactions}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="w-full overflow-hidden">
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "flex items-center gap-2 h-10 min-w-fit shrink-0 px-4 rounded-xl transition-all",
                    filter === f.id
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-slate-200/50 dark:border-white/10 text-slate-600 dark:text-slate-300"
                  )}
                  data-testid={`filter-${f.id}`}
                >
                  <span className="text-sm font-semibold">{f.label}</span>
                  {f.count > 0 && (
                    <span className={cn(
                      "text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center",
                      filter === f.id 
                        ? "bg-white/20 text-white" 
                        : "bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300"
                    )}>
                      {f.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Transaction List */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Recent Activity
              </h3>
              <button className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline" data-testid="export-btn">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                  <History className="w-10 h-10 text-slate-400" />
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-semibold">No transactions found</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Your transaction history will appear here</p>
                <Link to="/employee/advances" className="mt-4">
                  <Button className="bg-primary text-white font-semibold">
                    Request Your First Advance
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredItems.map((item) => {
                  const config = getStatusConfig(item.status);
                  const StatusIcon = config.icon;
                  
                  return (
                    <div
                      key={item.id}
                      className="group bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50 dark:border-white/10 hover:shadow-lg transition-all"
                      data-testid={`transaction-${item.id}`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                          item.method === 'mobile_money' 
                            ? "bg-green-100 dark:bg-green-500/20" 
                            : "bg-blue-100 dark:bg-blue-500/20"
                        )}>
                          {item.method === 'mobile_money' ? (
                            <Smartphone className="w-6 h-6 text-green-600 dark:text-green-400" />
                          ) : (
                            <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        
                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-slate-900 dark:text-white">
                              Wage Advance
                            </p>
                            {config.showPulse && (
                              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                            )}
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {formatDate(item.created_at)}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                            To: {item.description}
                          </p>
                        </div>
                        
                        {/* Amount & Status */}
                        <div className="text-right shrink-0">
                          <p className={cn(
                            "text-lg font-bold mb-1",
                            item.status === 'rejected' ? "text-slate-400 line-through" : "text-slate-900 dark:text-white"
                          )}>
                            {formatCurrency(item.amount)}
                          </p>
                          <span className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold",
                            config.badgeBg, config.textColor
                          )}>
                            <StatusIcon className="w-3 h-3" />
                            {config.label}
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
      </div>

      {/* Bottom Navigation */}
      <BottomNav active="history" />

      {/* Style for hiding scrollbar */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
