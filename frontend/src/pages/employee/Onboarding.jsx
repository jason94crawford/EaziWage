import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, MapPin, Building2, Calendar, Save, ArrowRight, 
  Phone, Briefcase, AlertCircle, Wallet, CreditCard
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { employeeApi, employerApi, utilityApi } from '../../lib/api';
import { COUNTRIES, EMPLOYMENT_TYPES } from '../../lib/utils';
import { toast } from 'sonner';

export default function EmployeeOnboarding() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [employers, setEmployers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    employer_id: '',
    employee_code: '',
    national_id: '',
    date_of_birth: '',
    employment_type: '',
    job_title: '',
    monthly_salary: '',
    bank_name: '',
    bank_account: '',
    mobile_money_provider: '',
    mobile_money_number: '',
    country: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employersRes, countriesRes] = await Promise.all([
          employerApi.list({ status: 'approved' }),
          utilityApi.getCountries()
        ]);
        setEmployers(employersRes.data);
        setCountries(countriesRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await employeeApi.create({
        ...formData,
        monthly_salary: parseFloat(formData.monthly_salary)
      });
      toast.success('Profile created successfully!');
      navigate('/employee');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'country') {
      const country = countries.find(c => c.code === value);
      setSelectedCountry(country);
      setFormData(prev => ({ ...prev, mobile_money_provider: '' }));
    }
  };

  return (
    <DashboardLayout role="employee">
      <div className="max-w-3xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold text-slate-900">Complete Your Profile</h1>
          <p className="text-slate-500 mt-1">Set up your employee profile to start accessing your earned wages.</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6" data-testid="onboarding-error">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Employer Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Employer
              </CardTitle>
              <CardDescription>Select your employer from the registered companies</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="employer_id">Select Employer *</Label>
                <Select value={formData.employer_id} onValueChange={(v) => updateField('employer_id', v)}>
                  <SelectTrigger className="mt-1.5" data-testid="employer-select">
                    <SelectValue placeholder="Select your employer" />
                  </SelectTrigger>
                  <SelectContent>
                    {employers.map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.company_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {employers.length === 0 && (
                  <p className="text-sm text-amber-600 mt-2">
                    No employers available. Your employer needs to register first.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>Your personal and identification details</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="national_id">National ID Number *</Label>
                <Input
                  id="national_id"
                  placeholder="12345678"
                  value={formData.national_id}
                  onChange={(e) => updateField('national_id', e.target.value)}
                  required
                  className="mt-1.5"
                  data-testid="national-id"
                />
              </div>
              <div>
                <Label htmlFor="date_of_birth">Date of Birth *</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => updateField('date_of_birth', e.target.value)}
                  required
                  className="mt-1.5"
                  data-testid="date-of-birth"
                />
              </div>
              <div>
                <Label htmlFor="country">Country *</Label>
                <Select value={formData.country} onValueChange={(v) => updateField('country', v)}>
                  <SelectTrigger className="mt-1.5" data-testid="country-select">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Employment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Employment Details
              </CardTitle>
              <CardDescription>Your employment information</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employee_code">Employee Code/ID *</Label>
                <Input
                  id="employee_code"
                  placeholder="EMP001"
                  value={formData.employee_code}
                  onChange={(e) => updateField('employee_code', e.target.value)}
                  required
                  className="mt-1.5"
                  data-testid="employee-code"
                />
              </div>
              <div>
                <Label htmlFor="job_title">Job Title *</Label>
                <Input
                  id="job_title"
                  placeholder="Software Engineer"
                  value={formData.job_title}
                  onChange={(e) => updateField('job_title', e.target.value)}
                  required
                  className="mt-1.5"
                  data-testid="job-title"
                />
              </div>
              <div>
                <Label htmlFor="employment_type">Employment Type *</Label>
                <Select value={formData.employment_type} onValueChange={(v) => updateField('employment_type', v)}>
                  <SelectTrigger className="mt-1.5" data-testid="employment-type-select">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="monthly_salary">Monthly Salary *</Label>
                <Input
                  id="monthly_salary"
                  type="number"
                  placeholder="50000"
                  min="0"
                  value={formData.monthly_salary}
                  onChange={(e) => updateField('monthly_salary', e.target.value)}
                  required
                  className="mt-1.5"
                  data-testid="monthly-salary"
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                Payment Details
              </CardTitle>
              <CardDescription>How you&apos;d like to receive your advances</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mobile Money */}
              <div className="space-y-4">
                <h4 className="font-medium text-slate-900 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Mobile Money (Recommended)
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mobile_money_provider">Provider</Label>
                    <Select 
                      value={formData.mobile_money_provider} 
                      onValueChange={(v) => updateField('mobile_money_provider', v)}
                      disabled={!selectedCountry}
                    >
                      <SelectTrigger className="mt-1.5" data-testid="mobile-provider-select">
                        <SelectValue placeholder={selectedCountry ? "Select provider" : "Select country first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedCountry?.mobile_money?.map((p) => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="mobile_money_number">Mobile Number</Label>
                    <Input
                      id="mobile_money_number"
                      type="tel"
                      placeholder="+254 700 000 000"
                      value={formData.mobile_money_number}
                      onChange={(e) => updateField('mobile_money_number', e.target.value)}
                      className="mt-1.5"
                      data-testid="mobile-number"
                    />
                  </div>
                </div>
              </div>

              {/* Bank Account */}
              <div className="space-y-4">
                <h4 className="font-medium text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Bank Account (Optional)
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bank_name">Bank Name</Label>
                    <Input
                      id="bank_name"
                      placeholder="Kenya Commercial Bank"
                      value={formData.bank_name}
                      onChange={(e) => updateField('bank_name', e.target.value)}
                      className="mt-1.5"
                      data-testid="bank-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bank_account">Account Number</Label>
                    <Input
                      id="bank_account"
                      placeholder="1234567890"
                      value={formData.bank_account}
                      onChange={(e) => updateField('bank_account', e.target.value)}
                      className="mt-1.5"
                      data-testid="bank-account"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button 
              type="submit" 
              className="bg-primary text-white hover:bg-primary/90" 
              disabled={loading || !formData.employer_id} 
              data-testid="submit-onboarding"
            >
              {loading ? 'Submitting...' : 'Complete Profile'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
