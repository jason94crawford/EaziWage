import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Building2, Search, Filter, CheckCircle2, XCircle, Clock,
  Eye, Shield, MoreHorizontal
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
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
import { employerApi } from '../../lib/api';
import { formatDate, getStatusColor, getRiskRatingColor, cn } from '../../lib/utils';
import { toast } from 'sonner';

export default function AdminEmployers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const statusFilter = searchParams.get('status') || '';

  const fetchEmployers = async () => {
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await employerApi.list(params);
      setEmployers(response.data);
    } catch (err) {
      console.error('Failed to fetch employers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployers();
  }, [statusFilter]);

  const handleStatusUpdate = async (employerId, newStatus) => {
    setActionLoading(true);
    try {
      await employerApi.updateStatus(employerId, newStatus);
      toast.success(`Employer ${newStatus}`);
      fetchEmployers();
      setShowDetailDialog(false);
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredEmployers = employers.filter(e => 
    e.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.contact_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-amber-100 text-amber-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return <Badge className={cn(colors[status] || 'bg-slate-100 text-slate-700')}>{status}</Badge>;
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-slate-900">Employers</h1>
            <p className="text-slate-500 mt-1">Manage employer registrations and verifications</p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search employers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="search-employers"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === '' ? 'default' : 'outline'}
                  onClick={() => setSearchParams({})}
                  className={statusFilter === '' ? 'bg-primary' : ''}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === 'pending' ? 'default' : 'outline'}
                  onClick={() => setSearchParams({ status: 'pending' })}
                  className={statusFilter === 'pending' ? 'bg-primary' : ''}
                >
                  Pending
                </Button>
                <Button
                  variant={statusFilter === 'approved' ? 'default' : 'outline'}
                  onClick={() => setSearchParams({ status: 'approved' })}
                  className={statusFilter === 'approved' ? 'bg-primary' : ''}
                >
                  Approved
                </Button>
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
            ) : filteredEmployers.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Building2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No employers found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployers.map((employer) => (
                    <TableRow key={employer.id} data-testid={`employer-row-${employer.id}`}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-900">{employer.company_name}</p>
                          <p className="text-sm text-slate-500">{employer.contact_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{employer.country}</TableCell>
                      <TableCell className="capitalize">{employer.industry?.replace('_', ' ')}</TableCell>
                      <TableCell>{employer.employee_count}</TableCell>
                      <TableCell>{getStatusBadge(employer.status)}</TableCell>
                      <TableCell>
                        {employer.risk_score ? (
                          <span className={cn(
                            "px-2 py-1 rounded text-sm font-medium",
                            getRiskRatingColor(employer.risk_rating)
                          )}>
                            {employer.risk_score.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(employer.created_at)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" data-testid={`employer-actions-${employer.id}`}>
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setSelectedEmployer(employer); setShowDetailDialog(true); }}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {employer.status === 'pending' && (
                              <>
                                <DropdownMenuItem onClick={() => handleStatusUpdate(employer.id, 'approved')}>
                                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusUpdate(employer.id, 'rejected')}>
                                  <XCircle className="w-4 h-4 mr-2 text-red-600" />
                                  Reject
                                </DropdownMenuItem>
                              </>
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedEmployer?.company_name}</DialogTitle>
              <DialogDescription>Employer Details</DialogDescription>
            </DialogHeader>
            {selectedEmployer && (
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <p className="text-sm text-slate-500">Registration Number</p>
                  <p className="font-medium">{selectedEmployer.registration_number}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Tax ID</p>
                  <p className="font-medium">{selectedEmployer.tax_id}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Country</p>
                  <p className="font-medium">{selectedEmployer.country}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Industry</p>
                  <p className="font-medium capitalize">{selectedEmployer.industry?.replace('_', ' ')}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-slate-500">Address</p>
                  <p className="font-medium">{selectedEmployer.address}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Employee Count</p>
                  <p className="font-medium">{selectedEmployer.employee_count}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Payroll Cycle</p>
                  <p className="font-medium capitalize">{selectedEmployer.payroll_cycle}</p>
                </div>
                <div className="col-span-2 border-t pt-4">
                  <p className="text-sm text-slate-500 mb-2">Contact Person</p>
                  <p className="font-medium">{selectedEmployer.contact_person}</p>
                  <p className="text-sm text-slate-600">{selectedEmployer.contact_email}</p>
                  <p className="text-sm text-slate-600">{selectedEmployer.contact_phone}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              {selectedEmployer?.status === 'pending' && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleStatusUpdate(selectedEmployer.id, 'rejected')}
                    disabled={actionLoading}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    className="bg-primary"
                    onClick={() => handleStatusUpdate(selectedEmployer.id, 'approved')}
                    disabled={actionLoading}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
