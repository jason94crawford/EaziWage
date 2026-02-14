import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Building2, MapPin, Users, ArrowRight, ArrowLeft,
  Phone, Mail, Briefcase, AlertCircle, Check, Sparkles,
  Shield, FileText, ChevronRight
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { employerApi, utilityApi } from '../../lib/api';
import { PAYROLL_CYCLES } from '../../lib/utils';
import { toast } from 'sonner';
import { useTheme } from '../../lib/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const STEPS = [
  { id: 'welcome', title: 'Welcome', icon: Sparkles },
  { id: 'terms', title: 'Terms & Privacy', icon: Shield },
  { id: 'company', title: 'Company Info', icon: Building2 },
  { id: 'workforce', title: 'Workforce', icon: Users },
  { id: 'contact', title: 'Contact', icon: Phone },
];

export default function EmployerOnboarding() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [industries, setIndustries] = useState([]);
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('eaziwage_user') || '{}');
  
  const [formData, setFormData] = useState({
    company_name: '',
    registration_number: '',
    tax_id: '',
    country: '',
    address: '',
    employee_count: '',
    industry: '',
    payroll_cycle: '',
    contact_person: user.full_name || '',
    contact_email: user.email || '',
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

  const handleSubmit = async () => {
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

  const nextStep = () => {
    if (currentStep === 1 && !agreedToTerms) {
      setError('Please accept the Terms of Service and Privacy Policy to continue');
      return;
    }
    setError('');
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setError('');
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true; // Welcome
      case 1: return agreedToTerms; // Terms
      case 2: return formData.company_name && formData.registration_number && formData.tax_id && formData.country && formData.industry && formData.address; // Company
      case 3: return formData.employee_count && formData.payroll_cycle; // Workforce
      case 4: return formData.contact_person && formData.contact_email && formData.contact_phone; // Contact
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Welcome
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Welcome to EaziWage, {user.full_name?.split(' ')[0] || 'there'}!
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-md mx-auto">
              Let's set up your company to offer earned wage access to your employees. This will only take a few minutes.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
              {[
                { icon: Users, text: 'Happy Employees' },
                { icon: Shield, text: 'Zero Risk to You' },
                { icon: FileText, text: 'Easy Integration' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-primary/5 dark:bg-primary/10 rounded-xl text-sm">
                  <item.icon className="w-5 h-5 text-primary" />
                  <span className="text-slate-700 dark:text-slate-300">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 1: // Terms
        return (
          <div className="py-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Terms & Privacy
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Please review and accept our terms to continue
              </p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Employer Agreement</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  By partnering with EaziWage, you agree to our employer terms which outline the responsibilities and benefits of offering earned wage access.
                </p>
                <Link to="/terms" target="_blank" className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1">
                  Read full terms <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Data Processing Agreement</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  We handle employee data with the highest security standards. Your employees' privacy is our priority.
                </p>
                <Link to="/privacy" target="_blank" className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1">
                  Read privacy policy <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-primary/5 dark:bg-primary/10 rounded-xl">
                <div className="relative flex items-center mt-0.5">
                  <input
                    type="checkbox"
                    id="agree-terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 checked:border-primary checked:bg-primary transition-all hover:border-primary"
                    data-testid="employer-terms-checkbox"
                  />
                  <Check className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100" />
                </div>
                <label htmlFor="agree-terms" className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                  I have read and agree to the <strong>Employer Agreement</strong> and <strong>Data Processing Agreement</strong>
                </label>
              </div>
            </div>
          </div>
        );

      case 2: // Company Info
        return (
          <div className="py-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Company Information
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Basic details about your company
              </p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="flex flex-col gap-2">
                <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                  Company Name *
                </Label>
                <Input
                  placeholder="e.g. Acme Corporation Ltd"
                  value={formData.company_name}
                  onChange={(e) => updateField('company_name', e.target.value)}
                  className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  data-testid="employer-company-name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                    Registration No. *
                  </Label>
                  <Input
                    placeholder="PVT-12345678"
                    value={formData.registration_number}
                    onChange={(e) => updateField('registration_number', e.target.value)}
                    className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    data-testid="employer-reg-number"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                    Tax ID / PIN *
                  </Label>
                  <Input
                    placeholder="A123456789X"
                    value={formData.tax_id}
                    onChange={(e) => updateField('tax_id', e.target.value)}
                    className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    data-testid="employer-tax-id"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                    Country *
                  </Label>
                  <Select value={formData.country} onValueChange={(v) => updateField('country', v)}>
                    <SelectTrigger className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700" data-testid="employer-country">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                    Industry *
                  </Label>
                  <Select value={formData.industry} onValueChange={(v) => updateField('industry', v)}>
                    <SelectTrigger className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700" data-testid="employer-industry">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((i) => (
                        <SelectItem key={i.code} value={i.code}>{i.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                  Business Address *
                </Label>
                <Input
                  placeholder="e.g. 123 Business Park, Nairobi"
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  data-testid="employer-address"
                />
              </div>
            </div>
          </div>
        );

      case 3: // Workforce
        return (
          <div className="py-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Workforce Details
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Tell us about your employees and payroll
              </p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="flex flex-col gap-2">
                <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                  Number of Employees *
                </Label>
                <Input
                  type="number"
                  placeholder="e.g. 50"
                  min="1"
                  value={formData.employee_count}
                  onChange={(e) => updateField('employee_count', e.target.value)}
                  className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  data-testid="employer-employee-count"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                  Payroll Cycle *
                </Label>
                <Select value={formData.payroll_cycle} onValueChange={(v) => updateField('payroll_cycle', v)}>
                  <SelectTrigger className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700" data-testid="employer-payroll-cycle">
                    <SelectValue placeholder="Select payroll cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYROLL_CYCLES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <strong>Note:</strong> After onboarding, you'll be able to upload your payroll data and manage employee access to earned wages.
                </p>
              </div>
            </div>
          </div>
        );

      case 4: // Contact
        return (
          <div className="py-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Contact Person
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Primary contact for EaziWage communications
              </p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="flex flex-col gap-2">
                <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                  Full Name *
                </Label>
                <Input
                  placeholder="e.g. Jane Doe"
                  value={formData.contact_person}
                  onChange={(e) => updateField('contact_person', e.target.value)}
                  className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  data-testid="employer-contact-name"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                  Email Address *
                </Label>
                <Input
                  type="email"
                  placeholder="e.g. jane@company.com"
                  value={formData.contact_email}
                  onChange={(e) => updateField('contact_email', e.target.value)}
                  className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  data-testid="employer-contact-email"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                  Phone Number *
                </Label>
                <Input
                  type="tel"
                  placeholder="+254 700 000 000"
                  value={formData.contact_phone}
                  onChange={(e) => updateField('contact_phone', e.target.value)}
                  className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  data-testid="employer-contact-phone"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 relative overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px]" />
      
      {/* Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group" data-testid="logo-link">
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/30">
                <span className="text-white font-bold text-xl">E</span>
              </div>
            </div>
            <span className="font-heading font-bold text-2xl text-slate-900 dark:text-white">EaziWage</span>
          </Link>
          
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    index < currentStep
                      ? 'bg-primary text-white'
                      : index === currentStep
                      ? 'bg-gradient-to-br from-primary to-emerald-600 text-white shadow-lg shadow-primary/30'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-full h-1 mx-2 rounded-full transition-all ${
                      index < currentStep ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                    style={{ width: '40px' }}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            Step {currentStep + 1} of {STEPS.length}: <span className="font-medium text-slate-900 dark:text-white">{STEPS[currentStep].title}</span>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/20 rounded-xl backdrop-blur-sm" data-testid="employer-onboarding-error">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        {/* Step Content */}
        <div className="glass-card rounded-3xl p-8 shadow-xl mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="h-14 px-6 rounded-2xl border-slate-200 dark:border-slate-700"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          
          {currentStep === STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !canProceed()}
              className="h-14 px-8 rounded-2xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white font-semibold shadow-xl shadow-primary/30 btn-glow"
              data-testid="complete-employer-onboarding"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Completing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Complete Setup
                  <Check className="w-5 h-5" />
                </span>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={nextStep}
              disabled={!canProceed()}
              className="h-14 px-8 rounded-2xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white font-semibold shadow-xl shadow-primary/30 btn-glow"
              data-testid="employer-next-step"
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
