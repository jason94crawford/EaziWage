import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, MapPin, Users, Calendar, Save, ArrowRight, 
  Phone, Mail, Briefcase, AlertCircle
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { employerApi, utilityApi } from '../../lib/api';
import { PAYROLL_CYCLES } from '../../lib/utils';
import { toast } from 'sonner';

export default function EmployerOnboarding() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [industries, setIndustries] = useState([]);
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    company_name: '',
    registration_number: '',
    tax_id: '',
    country: '',
    address: '',
    employee_count: '',
    industry: '',
    payroll_cycle: '',
    contact_person: '',
    contact_email: '',
    contact_phone: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [industriesRes, countriesRes] = await Promise.all([
          utilityApi.getIndustries(),
          utilityApi.getCountries()
        ]);
        setIndustries(industriesRes.data);
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
      await employerApi.create({
        ...formData,
        employee_count: parseInt(formData.employee_count)
      });
      toast.success('Company profile created successfully!');
      navigate('/employer');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create company profile');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <DashboardLayout role="employer">
      <div className="max-w-3xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold text-slate-900">Company Onboarding</h1>
          <p className="text-slate-500 mt-1">Complete your company profile to start offering EaziWage to your employees.</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6" data-testid="onboarding-error">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Company Information
              </CardTitle>
              <CardDescription>Basic details about your company</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label htmlFor="company_name">Company Name *</Label>
                <Input
                  id="company_name"
                  placeholder="Acme Corporation Ltd"
                  value={formData.company_name}
                  onChange={(e) => updateField('company_name', e.target.value)}
                  required
                  className="mt-1.5"
                  data-testid="company-name"
                />
              </div>
              <div>
                <Label htmlFor="registration_number">Registration Number *</Label>
                <Input
                  id="registration_number"
                  placeholder="PVT-12345678"
                  value={formData.registration_number}
                  onChange={(e) => updateField('registration_number', e.target.value)}
                  required
                  className="mt-1.5"
                  data-testid="registration-number"
                />
              </div>
              <div>
                <Label htmlFor="tax_id">Tax ID / PIN *</Label>
                <Input
                  id="tax_id"
                  placeholder="A123456789X"
                  value={formData.tax_id}
                  onChange={(e) => updateField('tax_id', e.target.value)}
                  required
                  className="mt-1.5"
                  data-testid="tax-id"
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
              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Select value={formData.industry} onValueChange={(v) => updateField('industry', v)}>
                  <SelectTrigger className="mt-1.5" data-testid="industry-select">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((i) => (
                      <SelectItem key={i.code} value={i.code}>{i.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="address">Business Address *</Label>
                <Input
                  id="address"
                  placeholder="123 Business Park, Nairobi"
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  required
                  className="mt-1.5"
                  data-testid="address"
                />
              </div>
            </CardContent>
          </Card>

          {/* Workforce Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Workforce Details
              </CardTitle>
              <CardDescription>Information about your employees and payroll</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employee_count">Number of Employees *</Label>
                <Input
                  id="employee_count"
                  type="number"
                  placeholder="50"
                  min="1"
                  value={formData.employee_count}
                  onChange={(e) => updateField('employee_count', e.target.value)}
                  required
                  className="mt-1.5"
                  data-testid="employee-count"
                />
              </div>
              <div>
                <Label htmlFor="payroll_cycle">Payroll Cycle *</Label>
                <Select value={formData.payroll_cycle} onValueChange={(v) => updateField('payroll_cycle', v)}>
                  <SelectTrigger className="mt-1.5" data-testid="payroll-cycle-select">
                    <SelectValue placeholder="Select cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYROLL_CYCLES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Contact Person */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                Contact Person
              </CardTitle>
              <CardDescription>Primary contact for EaziWage communications</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label htmlFor="contact_person">Full Name *</Label>
                <Input
                  id="contact_person"
                  placeholder="Jane Doe"
                  value={formData.contact_person}
                  onChange={(e) => updateField('contact_person', e.target.value)}
                  required
                  className="mt-1.5"
                  data-testid="contact-person"
                />
              </div>
              <div>
                <Label htmlFor="contact_email">Email Address *</Label>
                <Input
                  id="contact_email"
                  type="email"
                  placeholder="jane@company.com"
                  value={formData.contact_email}
                  onChange={(e) => updateField('contact_email', e.target.value)}
                  required
                  className="mt-1.5"
                  data-testid="contact-email"
                />
              </div>
              <div>
                <Label htmlFor="contact_phone">Phone Number *</Label>
                <Input
                  id="contact_phone"
                  type="tel"
                  placeholder="+254 700 000 000"
                  value={formData.contact_phone}
                  onChange={(e) => updateField('contact_phone', e.target.value)}
                  required
                  className="mt-1.5"
                  data-testid="contact-phone"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button type="submit" className="bg-primary text-white hover:bg-primary/90" disabled={loading} data-testid="submit-onboarding">
              {loading ? 'Submitting...' : 'Complete Onboarding'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
