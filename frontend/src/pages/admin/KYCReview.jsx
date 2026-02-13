import React, { useState, useEffect } from 'react';
import { 
  FileText, Search, CheckCircle2, XCircle, Clock, Eye, 
  Download, User, Building2, Filter
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Textarea } from '../../components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { kycApi, employeeApi } from '../../lib/api';
import { formatDateTime, DOCUMENT_TYPES, cn } from '../../lib/utils';
import { toast } from 'sonner';

export default function AdminKYCReview() {
  const [documents, setDocuments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      const [docsRes, employeesRes] = await Promise.all([
        kycApi.listDocuments({ status: filter !== 'all' ? filter : undefined }),
        employeeApi.list()
      ]);
      setDocuments(docsRes.data);
      setEmployees(employeesRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  const handleReview = async (status) => {
    if (!selectedDoc) return;
    setActionLoading(true);
    try {
      await kycApi.reviewDocument(selectedDoc.id, status, reviewNotes);
      
      // If approved, update employee KYC status
      if (status === 'approved') {
        const employee = employees.find(e => e.user_id === selectedDoc.user_id);
        if (employee) {
          await employeeApi.updateKycStatus(employee.id, 'approved');
        }
      }
      
      toast.success(`Document ${status}`);
      setShowReviewDialog(false);
      setSelectedDoc(null);
      setReviewNotes('');
      fetchData();
    } catch (err) {
      toast.error('Failed to review document');
    } finally {
      setActionLoading(false);
    }
  };

  const getDocumentLabel = (type) => {
    return DOCUMENT_TYPES.find(d => d.value === type)?.label || type;
  };

  const getEmployeeName = (userId) => {
    const employee = employees.find(e => e.user_id === userId);
    return employee ? `Employee #${employee.employee_code}` : 'Unknown';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-emerald-100 text-emerald-700">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700">Rejected</Badge>;
      default:
        return <Badge className="bg-amber-100 text-amber-700">Pending</Badge>;
    }
  };

  const stats = {
    pending: documents.filter(d => d.status === 'pending').length,
    approved: documents.filter(d => d.status === 'approved').length,
    rejected: documents.filter(d => d.status === 'rejected').length,
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900">KYC Review</h1>
          <p className="text-slate-500 mt-1">Review and approve employee verification documents</p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="border-slate-200 cursor-pointer hover:border-amber-300 transition-colors" onClick={() => setFilter('pending')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Pending Review</p>
                  <p className="text-3xl font-bold text-amber-600 mt-1">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-slate-200 cursor-pointer hover:border-emerald-300 transition-colors" onClick={() => setFilter('approved')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Approved</p>
                  <p className="text-3xl font-bold text-emerald-600 mt-1">{stats.approved}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 cursor-pointer hover:border-red-300 transition-colors" onClick={() => setFilter('rejected')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Rejected</p>
                  <p className="text-3xl font-bold text-red-600 mt-1">{stats.rejected}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
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
                  placeholder="Search by document type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="search-kyc"
                />
              </div>
              <div className="flex gap-2">
                {['all', 'pending', 'approved', 'rejected'].map((status) => (
                  <Button
                    key={status}
                    variant={filter === status ? 'default' : 'outline'}
                    onClick={() => setFilter(status)}
                    className={cn("capitalize", filter === status ? 'bg-primary' : '')}
                    size="sm"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : documents.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="font-medium">No documents found</p>
              <p className="text-sm">No KYC documents match your filter</p>
            </div>
          ) : (
            documents.map((doc) => (
              <Card 
                key={doc.id} 
                className={cn(
                  "border-slate-200 hover:shadow-lg transition-all duration-200 cursor-pointer",
                  doc.status === 'pending' && "border-l-4 border-l-amber-500"
                )}
                onClick={() => { setSelectedDoc(doc); setShowReviewDialog(true); }}
                data-testid={`kyc-doc-${doc.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      doc.status === 'pending' ? 'bg-amber-100' :
                      doc.status === 'approved' ? 'bg-emerald-100' : 'bg-red-100'
                    )}>
                      <FileText className={cn(
                        "w-6 h-6",
                        doc.status === 'pending' ? 'text-amber-600' :
                        doc.status === 'approved' ? 'text-emerald-600' : 'text-red-600'
                      )} />
                    </div>
                    {getStatusBadge(doc.status)}
                  </div>
                  
                  <h3 className="font-semibold text-slate-900 mb-1">{getDocumentLabel(doc.document_type)}</h3>
                  <p className="text-sm text-slate-500 mb-3">{getEmployeeName(doc.user_id)}</p>
                  
                  {doc.document_number && (
                    <p className="text-xs text-slate-400 font-mono mb-2">#{doc.document_number}</p>
                  )}
                  
                  <p className="text-xs text-slate-400">Uploaded {formatDateTime(doc.created_at)}</p>
                  
                  {doc.status === 'pending' && (
                    <Button className="w-full mt-4 bg-primary" size="sm">
                      Review Now
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Review Dialog */}
        <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Document</DialogTitle>
              <DialogDescription>
                Review the uploaded document and approve or reject it
              </DialogDescription>
            </DialogHeader>
            
            {selectedDoc && (
              <div className="space-y-6 py-4">
                {/* Document Preview Placeholder */}
                <div className="bg-slate-100 rounded-xl p-8 text-center">
                  <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 font-medium">{getDocumentLabel(selectedDoc.document_type)}</p>
                  <p className="text-sm text-slate-500 mt-1">Document preview would appear here</p>
                  <Button variant="outline" className="mt-4" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Original
                  </Button>
                </div>

                {/* Document Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Document Type</p>
                    <p className="font-medium">{getDocumentLabel(selectedDoc.document_type)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Document Number</p>
                    <p className="font-medium font-mono">{selectedDoc.document_number || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Uploaded</p>
                    <p className="font-medium">{formatDateTime(selectedDoc.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Status</p>
                    {getStatusBadge(selectedDoc.status)}
                  </div>
                </div>

                {/* Review Notes */}
                {selectedDoc.status === 'pending' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Review Notes (Optional)
                    </label>
                    <Textarea
                      placeholder="Add notes about this document..."
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      className="min-h-[80px]"
                      data-testid="review-notes"
                    />
                  </div>
                )}

                {selectedDoc.reviewer_notes && (
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-500 mb-1">Previous Review Notes</p>
                    <p className="text-slate-700">{selectedDoc.reviewer_notes}</p>
                  </div>
                )}
              </div>
            )}
            
            <DialogFooter>
              {selectedDoc?.status === 'pending' && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleReview('rejected')}
                    disabled={actionLoading}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    className="bg-primary"
                    onClick={() => handleReview('approved')}
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
