import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, TrendingUp, CheckCircle2, Clock, AlertCircle,
  Building2, Wallet as WalletIcon, Home, History, User, Download
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
    { id: 'wallet', icon: WalletIcon, label: 'Wallet', path: '/employee/advances' },
    { id: 'history', icon: History, label: 'History', path: '/employee/transactions' },
    { id: 'profile', icon: User, label: 'Profile', path: '/employee/kyc' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#15231b] border-t border-slate-200 dark:border-white/5 z-50 md:hidden">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors",
              active === item.id 
                ? "text-primary" 
                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            )}
            data-testid={`nav-${item.id}`}
          >
            <item.icon className="w-5 h-5" />
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

  // Calculate stats for current month
  const currentMonth = new Date().getMonth();
  const monthlyTotal = advances
    .filter(a => new Date(a.created_at).getMonth() === currentMonth && (a.status === 'disbursed' || a.status === 'completed'))
    .reduce((sum, a) => sum + a.amount, 0);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'disbursed':
      case 'completed':
        return {
          icon: CheckCircle2,
          label: 'Completed',
          iconBg: 'bg-primary/20',
          iconColor: 'text-primary',
          textColor: 'text-primary',
          amountColor: 'text-primary'
        };
      case 'pending':
        return {
          icon: Clock,
          label: 'Processing',
          iconBg: 'bg-orange-100 dark:bg-orange-500/20',
          iconColor: 'text-orange-600 dark:text-orange-400',
          textColor: 'text-slate-500 dark:text-slate-400',
          amountColor: 'text-slate-900 dark:text-white',
          showPulse: true
        };
      case 'approved':
        return {
          icon: CheckCircle2,
          label: 'Approved',
          iconBg: 'bg-blue-100 dark:bg-blue-500/20',
          iconColor: 'text-blue-600 dark:text-blue-400',
          textColor: 'text-blue-500',
          amountColor: 'text-slate-900 dark:text-white'
        };
      case 'rejected':
        return {
          icon: AlertCircle,
          label: 'Failed',
          iconBg: 'bg-red-100 dark:bg-red-500/10',
          iconColor: 'text-red-600 dark:text-red-400',
          textColor: 'text-red-500 dark:text-red-400',
          amountColor: 'text-slate-400 dark:text-slate-500 line-through'
        };
      default:
        return {
          icon: Clock,
          label: status,
          iconBg: 'bg-slate-100 dark:bg-slate-700',
          iconColor: 'text-slate-600 dark:text-slate-400',
          textColor: 'text-slate-500',
          amountColor: 'text-slate-900 dark:text-white'
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
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Completed' },
    { id: 'failed', label: 'Failed' },
  ];

  return (
    <div className="min-h-screen bg-[#f5f8f6] dark:bg-[#102216] text-slate-900 dark:text-white pb-24 md:pb-8">
      <div className="relative flex flex-col min-h-screen w-full max-w-md mx-auto border-x border-slate-200 dark:border-slate-800">
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between bg-[#f5f8f6]/95 dark:bg-[#102216]/95 backdrop-blur-sm px-4 py-4">
          <button 
            onClick={() => navigate('/employee')}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            data-testid="back-btn"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold tracking-tight flex-1 text-center pr-10">Request History</h1>
        </header>

        <main className="flex flex-col gap-6 px-4 pb-8">
          {/* Summary Stats Card */}
          <section>
            <div className="flex flex-col gap-1 rounded-xl bg-white dark:bg-[#1c2e24] p-6 shadow-sm border border-slate-200 dark:border-transparent">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  Total Withdrawn ({new Date().toLocaleDateString('en-US', { month: 'short' })})
                </p>
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <p className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold mt-2" data-testid="monthly-total">
                {formatCurrency(monthlyTotal)}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Updates in real-time</p>
            </div>
          </section>

          {/* Filters */}
          <section className="w-full overflow-hidden">
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "flex h-9 min-w-[60px] shrink-0 items-center justify-center rounded-lg px-4 transition-transform active:scale-95",
                    filter === f.id
                      ? "bg-primary shadow-sm"
                      : "bg-white dark:bg-[#1c2e24] border border-slate-200 dark:border-slate-700/50"
                  )}
                  data-testid={`filter-${f.id}`}
                >
                  <span className={cn(
                    "text-sm font-medium",
                    filter === f.id ? "text-black" : "text-slate-600 dark:text-slate-300"
                  )}>
                    {f.label}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Transaction List */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Recent Activity
              </h3>
              <button className="text-primary text-sm font-medium flex items-center gap-1" data-testid="export-btn">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
                  <History className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-medium">No transactions found</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Your transaction history will appear here</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredItems.map((item) => {
                  const config = getStatusConfig(item.status);
                  const StatusIcon = config.icon;
                  
                  return (
                    <div
                      key={item.id}
                      className="group flex cursor-pointer flex-col gap-4 rounded-xl bg-white dark:bg-[#1c2e24] p-4 shadow-sm border border-slate-200 dark:border-transparent active:bg-slate-50 dark:active:bg-[#23382d] transition-colors"
                      data-testid={`transaction-${item.id}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "flex w-12 h-12 shrink-0 items-center justify-center rounded-full",
                            config.iconBg
                          )}>
                            {item.method === 'mobile_money' ? (
                              <WalletIcon className={cn("w-6 h-6", config.iconColor)} />
                            ) : (
                              <Building2 className={cn("w-6 h-6", config.iconColor)} />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <p className="text-slate-900 dark:text-white text-base font-semibold">
                              {formatDate(item.created_at)}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              {config.showPulse && (
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                              )}
                              {item.status === 'disbursed' || item.status === 'completed' ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                              ) : null}
                              <p className={cn("text-sm font-medium", config.textColor)}>
                                {config.label}
                              </p>
                            </div>
                            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 font-medium">
                              To: {item.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={cn("text-lg font-bold", config.amountColor)}>
                            +{formatCurrency(item.amount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>

        {/* Bottom padding */}
        <div className="h-8 w-full bg-transparent" />
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
