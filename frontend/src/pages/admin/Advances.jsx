import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Search, CheckCircle2, XCircle, Clock,
  Eye, MoreHorizontal, Wallet, ArrowUpRight
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '../../components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '../../components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { advanceApi } from '../../lib/api';
import { formatCurrency, formatDateTime, getStatusColor, cn } from '../../lib/utils';
import { toast } from 'sonner';

export default function AdminAdvances() {
  const [advances, setAdvances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdvance, setSelectedAdvance] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchAdvances = async () => {
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await advanceApi.list(params);
      setAdvances(response.data);
    } catch (err) {
      console.error('Failed to fetch advances:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvances();
  }, [statusFilter]);

  const handleApprove = async (advanceId) => {
    setActionLoading(true);
    try {
      await advanceApi.approve(advanceId);
      toast.success('Advance approved');
      fetchAdvances();
      setShowDetailDialog(false);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to approve');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDisburse = async (advanceId) => {
    setActionLoading(true);
    try {
      const response = await advanceApi.disburse(advanceId);
      toast.success(`Disbursement initiated: ${response.data.reference}`);
      fetchAdvances();
      setShowDetailDialog(false);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to disburse');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (advanceId) => {
    setActionLoading(true);
    try {
      await advanceApi.reject(advanceId, 'Rejected by admin');
      toast.success('Advance rejected');
      fetchAdvances();
      setShowDetailDialog(false);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to reject');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredAdvances = advances.filter(a => 
    a.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.employer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-amber-100 text-amber-700',
      approved: 'bg-blue-100 text-blue-700',
      disbursed: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      repaid: 'bg-slate-100 text-slate-700',
    };
    return <Badge className={cn(colors[status] || 'bg-slate-100 text-slate-700')}>{status}</Badge>;
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900">Advances</h1>
          <p className="text-slate-500 mt-1">Manage wage advance requests</p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by employee or employer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="search-advances"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {['', 'pending', 'approved', 'disbursed'].map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'outline'}
                    onClick={() => setStatusFilter(status)}
                    className={statusFilter === status ? 'bg-primary' : ''}
                    size="sm"
                  >
                    {status || 'All'}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredAdvances.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <CreditCard className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No advances found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Employer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Net Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdvances.map((advance) => (
                    <TableRow key={advance.id} data-testid={`advance-row-${advance.id}`}>
                      <TableCell className="font-medium">{advance.employee_name}</TableCell>
                      <TableCell>{advance.employer_name}</TableCell>
                      <TableCell>{formatCurrency(advance.amount)}</TableCell>
                      <TableCell className="text-slate-500">
                        {formatCurrency(advance.fee_amount)} ({advance.fee_percentage.toFixed(1)}%)
                      </TableCell>
                      <TableCell className="font-medium text-primary">
                        {formatCurrency(advance.net_amount)}
                      </TableCell>
                      <TableCell className="capitalize">{advance.disbursement_method?.replace('_', ' ')}</TableCell>
                      <TableCell>{getStatusBadge(advance.status)}</TableCell>
                      <TableCell>{formatDateTime(advance.created_at)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" data-testid={`advance-actions-${advance.id}`}>
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setSelectedAdvance(advance); setShowDetailDialog(true); }}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {advance.status === 'pending' && (
                              <>
                                <DropdownMenuItem onClick={() => handleApprove(advance.id)}>
                                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleReject(advance.id)}>
                                  <XCircle className="w-4 h-4 mr-2 text-red-600" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            {advance.status === 'approved' && (
                              <DropdownMenuItem onClick={() => handleDisburse(advance.id)}>
                                <ArrowUpRight className="w-4 h-4 mr-2 text-primary" />
                                Disburse
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Advance Details</DialogTitle>
              <DialogDescription>Review and process this advance request</DialogDescription>
            </DialogHeader>
            {selectedAdvance && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Employee</p>
                    <p className="font-medium">{selectedAdvance.employee_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Employer</p>
                    <p className="font-medium">{selectedAdvance.employer_name}</p>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Amount Requested</span>
                    <span className="font-medium">{formatCurrency(selectedAdvance.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Service Fee ({selectedAdvance.fee_percentage.toFixed(1)}%)</span>
                    <span className="font-medium">-{formatCurrency(selectedAdvance.fee_amount)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Net Amount</span>
                    <span className="font-bold text-primary">{formatCurrency(selectedAdvance.net_amount)}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Disbursement Method</p>
                    <p className="font-medium capitalize">{selectedAdvance.disbursement_method?.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Status</p>
                    {getStatusBadge(selectedAdvance.status)}
                  </div>
                </div>
                {selectedAdvance.disbursement_details && (
                  <div>
                    <p className="text-sm text-slate-500">Disbursement Details</p>
                    <p className="font-mono text-sm">
                      {selectedAdvance.disbursement_details.provider || selectedAdvance.disbursement_details.bank}: {selectedAdvance.disbursement_details.number || selectedAdvance.disbursement_details.account}
                    </p>
                  </div>
                )}
                {selectedAdvance.reason && (
                  <div>
                    <p className="text-sm text-slate-500">Reason</p>
                    <p className="text-slate-700">{selectedAdvance.reason}</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              {selectedAdvance?.status === 'pending' && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleReject(selectedAdvance.id)}
                    disabled={actionLoading}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    className="bg-primary"
                    onClick={() => handleApprove(selectedAdvance.id)}
                    disabled={actionLoading}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </>
              )}
              {selectedAdvance?.status === 'approved' && (
                <Button
                  className="bg-primary"
                  onClick={() => handleDisburse(selectedAdvance.id)}
                  disabled={actionLoading}
                >
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Disburse Now
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
