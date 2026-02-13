import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, FileSpreadsheet, Download, Calendar, CheckCircle2,
  AlertCircle, Users, DollarSign, Clock, File, X, Plus
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '../../components/ui/table';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { payrollApi, employeeApi, employerApi } from '../../lib/api';
import { formatCurrency, formatDateTime, cn } from '../../lib/utils';
import { toast } from 'sonner';

export default function EmployerPayroll() {
  const [employees, setEmployees] = useState([]);
  const [employer, setEmployer] = useState(null);
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [payrollData, setPayrollData] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeesRes, employerRes, historyRes] = await Promise.all([
          employeeApi.list(),
          employerApi.getMe(),
          payrollApi.getHistory()
        ]);
        setEmployees(employeesRes.data);
        setEmployer(employerRes.data);
        setPayrollHistory(historyRes.data);
        
        // Initialize payroll data from employees
        setPayrollData(employeesRes.data.map(emp => ({
          employee_code: emp.employee_code,
          days_worked: 0,
          gross_salary: emp.monthly_salary,
          deductions: 0
        })));
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updatePayrollEntry = (index, field, value) => {
    setPayrollData(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: parseFloat(value) || 0 };
      return updated;
    });
  };

  const handleSubmitPayroll = async () => {
    const validEntries = payrollData.filter(p => p.days_worked > 0);
    if (validEntries.length === 0) {
      toast.error('Please enter days worked for at least one employee');
      return;
    }

    setUploading(true);
    try {
      await payrollApi.upload({
        month: selectedMonth,
        employees: validEntries
      });
      toast.success('Payroll uploaded successfully!');
      
      // Refresh data
      const [employeesRes, historyRes] = await Promise.all([
        employeeApi.list(),
        payrollApi.getHistory()
      ]);
      setEmployees(employeesRes.data);
      setPayrollHistory(historyRes.data);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to upload payroll');
    } finally {
      setUploading(false);
    }
  };

  const totalGrossSalary = payrollData.reduce((sum, p) => sum + (p.gross_salary || 0), 0);
  const totalDeductions = payrollData.reduce((sum, p) => sum + (p.deductions || 0), 0);
  const employeesWithData = payrollData.filter(p => p.days_worked > 0).length;

  return (
    <DashboardLayout role="employer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-slate-900">Payroll Management</h1>
            <p className="text-slate-500 mt-1">Upload monthly payroll data to update employee earned wages</p>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Template
          </Button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-4">
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Employees</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{employees.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Gross Payroll</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalGrossSalary)}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">With Data Entered</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{employeesWithData}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileSpreadsheet className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Uploads This Month</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {payrollHistory.filter(p => p.month === selectedMonth).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Upload className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Payroll Entry */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-slate-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Payroll Entry
                    </CardTitle>
                    <CardDescription>Enter days worked for each employee</CardDescription>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Payroll Month</Label>
                    <Input
                      type="month"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="w-40 mt-1"
                      data-testid="payroll-month"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : employees.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p className="font-medium">No employees registered</p>
                    <p className="text-sm">Employees need to register first</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee Code</TableHead>
                        <TableHead>Days Worked</TableHead>
                        <TableHead>Gross Salary</TableHead>
                        <TableHead>Deductions</TableHead>
                        <TableHead>Net Salary</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payrollData.map((entry, index) => (
                        <TableRow key={entry.employee_code}>
                          <TableCell className="font-medium">{entry.employee_code}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              max="31"
                              value={entry.days_worked}
                              onChange={(e) => updatePayrollEntry(index, 'days_worked', e.target.value)}
                              className="w-20"
                              data-testid={`days-${entry.employee_code}`}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              value={entry.gross_salary}
                              onChange={(e) => updatePayrollEntry(index, 'gross_salary', e.target.value)}
                              className="w-28"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              value={entry.deductions}
                              onChange={(e) => updatePayrollEntry(index, 'deductions', e.target.value)}
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell className="font-medium text-primary">
                            {formatCurrency(entry.gross_salary - entry.deductions)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                <div className="mt-6 flex justify-end">
                  <Button 
                    className="bg-primary"
                    onClick={handleSubmitPayroll}
                    disabled={uploading || employeesWithData === 0}
                    data-testid="submit-payroll"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Submit Payroll'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upload History */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Upload History</CardTitle>
              <CardDescription>Recent payroll submissions</CardDescription>
            </CardHeader>
            <CardContent>
              {payrollHistory.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Clock className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                  <p className="text-sm">No uploads yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {payrollHistory.slice(0, 10).map((record) => (
                    <div 
                      key={record.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{record.month}</p>
                          <p className="text-xs text-slate-500">
                            {record.employees?.length || 0} employees
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400">
                        {formatDateTime(record.uploaded_at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="border-slate-200 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">How Payroll Updates Work</h3>
                <ul className="mt-2 space-y-1 text-sm text-blue-800">
                  <li>• Enter the number of days each employee worked this month</li>
                  <li>• Earned wages are calculated as: (Gross Salary / 30) × Days Worked</li>
                  <li>• Employees can advance up to 50% of their earned wages</li>
                  <li>• Updates are reflected immediately in employee dashboards</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
