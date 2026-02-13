import React, { useState, useEffect } from 'react';
import { 
  History, Search, Download, Filter, ArrowUpRight, ArrowDownLeft,
  Clock, CheckCircle2, XCircle, CreditCard
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { transactionApi, advanceApi } from '../../lib/api';
import { formatCurrency, formatDateTime, cn } from '../../lib/utils';

export default function EmployeeTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [advances, setAdvances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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

  // Combine transactions and advances for display
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
      description: `Wage advance to ${a.disbursement_method?.replace('_', ' ')}`
    })),
    ...transactions.filter(t => t.type === 'disbursement').map(t => ({
      id: t.id,
      type: 'disbursement',
      amount: t.amount,
      status: t.status,
      created_at: t.created_at,
      description: 'Funds received'
    }))
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const filteredItems = allItems.filter(item => {
    if (filter !== 'all' && item.status !== filter) return false;
    if (searchTerm && !item.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'disbursed':
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'pending':
      case 'approved':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'disbursed':
      case 'completed':
        return 'bg-emerald-100 text-emerald-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'approved':
        return 'bg-blue-100 text-blue-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const stats = {
    totalAdvances: advances.length,
    totalDisbursed: advances.filter(a => a.status === 'disbursed').reduce((sum, a) => sum + a.amount, 0),
    pending: advances.filter(a => a.status === 'pending').length,
    totalFees: advances.filter(a => a.status === 'disbursed').reduce((sum, a) => sum + a.fee_amount, 0)
  };

  return (
    <DashboardLayout role="employee">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-slate-900">Transactions</h1>
            <p className="text-slate-500 mt-1">Track your advance requests and disbursements</p>
          </div>
          <Button variant="outline" className="flex items-center gap-2" data-testid="export-btn">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-4">
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Advances</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalAdvances}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Disbursed</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(stats.totalDisbursed)}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <ArrowUpRight className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Pending</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Fees</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(stats.totalFees)}</p>
                </div>
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                  <History className="w-6 h-6 text-slate-600" />
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
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="search-transactions"
                />
              </div>
              <div className="flex gap-2">
                {['all', 'pending', 'approved', 'disbursed', 'rejected'].map((status) => (
                  <Button
                    key={status}
                    variant={filter === status ? 'default' : 'outline'}
                    onClick={() => setFilter(status)}
                    className={cn(
                      "capitalize",
                      filter === status ? 'bg-primary' : ''
                    )}
                    size="sm"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction List */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <History className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="font-medium">No transactions found</p>
                <p className="text-sm">Your transaction history will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredItems.map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors duration-200"
                    data-testid={`transaction-${item.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        item.type === 'advance' ? 'bg-blue-100' : 'bg-emerald-100'
                      )}>
                        {item.type === 'advance' ? (
                          <ArrowUpRight className="w-6 h-6 text-blue-600" />
                        ) : (
                          <ArrowDownLeft className="w-6 h-6 text-emerald-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{item.description}</p>
                        <p className="text-sm text-slate-500">{formatDateTime(item.created_at)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        {item.type === 'advance' ? formatCurrency(item.amount) : `+${formatCurrency(item.amount)}`}
                      </p>
                      {item.fee && (
                        <p className="text-xs text-slate-500">Fee: {formatCurrency(item.fee)}</p>
                      )}
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-1",
                        getStatusColor(item.status)
                      )}>
                        {getStatusIcon(item.status)}
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
