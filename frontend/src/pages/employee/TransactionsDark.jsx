import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, CheckCircle2, Clock, AlertCircle,
  Building2, Wallet, History, Download, Smartphone, Calendar, ChevronRight
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { advanceApi } from '../../lib/api';
import { formatCurrency, cn } from '../../lib/utils';
import { 
  EmployeeDarkLayout, 
  DarkCard, 
  DarkIconButton,
  darkThemeColors 
} from '../../components/employee/EmployeeDarkLayout';

// Page Header
const TransactionsHeader = () => {
  const navigate = useNavigate();
  
  return (
    <header className="relative z-10 max-w-md mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/employee')}
          className="p-2 rounded-xl transition-colors"
          style={{ color: darkThemeColors.textSecondary }}
          data-testid="back-btn"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        
        <h1 className="text-base font-bold" style={{ color: darkThemeColors.textPrimary }}>
          Transactions
        </h1>
        
        <div className="w-9" /> {/* Spacer for centering */}
      </div>
    </header>
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
    id: a.id,
    type: 'advance',
    amount: a.amount,
    status: a.status,
    method: a.disbursement_method,
    created_at: a.created_at,
  })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const filteredItems = allItems.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'pending') return item.status === 'pending' || item.status === 'approved';
    if (filter === 'completed') return item.status === 'disbursed' || item.status === 'completed';
    if (filter === 'failed') return item.status === 'rejected';
    return true;
  });

  const currentMonth = new Date().getMonth();
  const monthlyTotal = advances
    .filter(a => new Date(a.created_at).getMonth() === currentMonth && (a.status === 'disbursed' || a.status === 'completed'))
    .reduce((sum, a) => sum + a.amount, 0);
  const totalTransactions = advances.filter(a => a.status === 'disbursed' || a.status === 'completed').length;

  const getStatusConfig = (status) => {
    switch (status) {
      case 'disbursed':
      case 'completed':
        return { icon: CheckCircle2, label: 'Completed', color: darkThemeColors.accent, bg: darkThemeColors.accentGlow };
      case 'pending':
        return { icon: Clock, label: 'Processing', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', pulse: true };
      case 'approved':
        return { icon: CheckCircle2, label: 'Approved', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' };
      case 'rejected':
        return { icon: AlertCircle, label: 'Failed', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' };
      default:
        return { icon: Clock, label: status, color: darkThemeColors.textMuted, bg: darkThemeColors.border };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    }
    if (date.toDateString() === yesterday.toDateString()) {
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
    <EmployeeDarkLayout>
      <TransactionsHeader />

      <main className="relative z-10 max-w-md mx-auto px-4 pb-28 space-y-5">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <DarkCard className="p-4">
            <DarkIconButton icon={TrendingUp} variant="accent" className="mb-2.5" />
            <p className="text-[11px] font-medium mb-0.5" style={{ color: darkThemeColors.textMuted }}>This Month</p>
            <p className="text-xl font-bold" style={{ color: darkThemeColors.textPrimary }} data-testid="monthly-total">
              {formatCurrency(monthlyTotal)}
            </p>
          </DarkCard>
          <DarkCard className="p-4">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 shadow-lg"
              style={{ background: '#3b82f6', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}
            >
              <Calendar className="w-4 h-4" style={{ color: darkThemeColors.background }} />
            </div>
            <p className="text-[11px] font-medium mb-0.5" style={{ color: darkThemeColors.textMuted }}>Total Transactions</p>
            <p className="text-xl font-bold" style={{ color: darkThemeColors.textPrimary }}>{totalTransactions}</p>
          </DarkCard>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="flex items-center gap-2 h-9 min-w-fit shrink-0 px-4 rounded-xl text-sm font-semibold transition-all"
              style={filter === f.id ? {
                background: `linear-gradient(135deg, ${darkThemeColors.accent}, #10b981)`,
                color: darkThemeColors.background,
                boxShadow: `0 4px 12px ${darkThemeColors.accentGlow}`
              } : {
                background: darkThemeColors.cardBg,
                color: darkThemeColors.textSecondary,
                border: `1px solid ${darkThemeColors.border}`
              }}
              data-testid={`filter-${f.id}`}
            >
              {f.label}
              {f.count > 0 && (
                <span 
                  className="text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                  style={filter === f.id ? {
                    background: 'rgba(255,255,255,0.2)',
                    color: darkThemeColors.background
                  } : {
                    background: darkThemeColors.border,
                    color: darkThemeColors.textSecondary
                  }}
                >
                  {f.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: darkThemeColors.textMuted }}>
              Recent Activity
            </h3>
            <button 
              className="text-xs font-semibold flex items-center gap-1"
              style={{ color: darkThemeColors.accent }}
              data-testid="export-btn"
            >
              <Download className="w-3 h-3" /> Export
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div 
                className="w-12 h-12 border-4 rounded-full animate-spin"
                style={{ borderColor: `${darkThemeColors.accent}30`, borderTopColor: darkThemeColors.accent }}
              />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: darkThemeColors.border }}
              >
                <History className="w-8 h-8" style={{ color: darkThemeColors.textMuted }} />
              </div>
              <p className="font-semibold text-sm" style={{ color: darkThemeColors.textSecondary }}>No transactions found</p>
              <p className="text-xs mt-1" style={{ color: darkThemeColors.textMuted }}>Your transaction history will appear here</p>
              <Link to="/employee/advances" className="mt-4">
                <Button 
                  className="font-semibold text-sm shadow-lg"
                  style={{ 
                    background: `linear-gradient(135deg, ${darkThemeColors.accent}, #10b981)`,
                    color: darkThemeColors.background,
                    boxShadow: `0 4px 16px ${darkThemeColors.accentGlow}`
                  }}
                >
                  Request Your First Advance
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => {
                const config = getStatusConfig(item.status);
                const StatusIcon = config.icon;
                return (
                  <DarkCard
                    key={item.id}
                    className="p-4"
                    data-testid={`transaction-${item.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <DarkIconButton 
                        icon={item.method === 'mobile_money' ? Smartphone : Building2}
                        variant="accent"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold text-sm" style={{ color: darkThemeColors.textPrimary }}>
                            Wage Advance
                          </p>
                          {config.pulse && (
                            <span 
                              className="w-2 h-2 rounded-full animate-pulse"
                              style={{ background: config.color }}
                            />
                          )}
                        </div>
                        <p className="text-xs" style={{ color: darkThemeColors.textMuted }}>
                          {formatDate(item.created_at)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p 
                          className={cn("text-base font-bold mb-0.5", item.status === 'rejected' && "line-through")}
                          style={{ color: item.status === 'rejected' ? darkThemeColors.textMuted : darkThemeColors.textPrimary }}
                        >
                          {formatCurrency(item.amount)}
                        </p>
                        <span 
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{ background: config.bg, color: config.color }}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {config.label}
                        </span>
                      </div>
                    </div>
                  </DarkCard>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </EmployeeDarkLayout>
  );
}
