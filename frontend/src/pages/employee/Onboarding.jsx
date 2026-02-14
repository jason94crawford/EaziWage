import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, MapPin, Building2, Calendar, ArrowRight, ArrowLeft,
  Phone, Briefcase, Wallet, CreditCard, Check, Sparkles,
  Shield, FileText, AlertCircle, ChevronRight
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { employeeApi, employerApi, utilityApi } from '../../lib/api';
import { EMPLOYMENT_TYPES } from '../../lib/utils';
import { toast } from 'sonner';
import { useTheme } from '../../lib/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

const STEPS = [
  { id: 'welcome', title: 'Welcome', icon: Sparkles },
  { id: 'terms', title: 'Terms & Privacy', icon: Shield },
  { id: 'personal', title: 'Personal Info', icon: User },
  { id: 'employment', title: 'Employment', icon: Briefcase },
  { id: 'payment', title: 'Payment', icon: Wallet },
];

export default function EmployeeOnboarding() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [employers, setEmployers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('eaziwage_user') || '{}');
  
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

  const handleSubmit = async () => {
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
      case 2: return formData.national_id && formData.date_of_birth && formData.country; // Personal
      case 3: return formData.employer_id && formData.employee_code && formData.job_title && formData.employment_type && formData.monthly_salary; // Employment
      case 4: return formData.mobile_money_provider && formData.mobile_money_number; // Payment
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Welcome
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Welcome to EaziWage, {user.full_name?.split(' ')[0] || 'there'}!
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-md mx-auto">
              Let's get you set up to access your earned wages instantly. This will only take a few minutes.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
              {[
                { icon: Shield, text: 'Secure & Private' },
                { icon: Wallet, text: 'Instant Transfers' },
                { icon: FileText, text: 'No Paperwork' },
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
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Terms of Service</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  By using EaziWage, you agree to our terms of service which govern your use of our earned wage access platform.
                </p>
                <Link to="/terms" target="_blank" className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1">
                  Read full terms <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Privacy Policy</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  We take your privacy seriously. Your data is encrypted and never shared without your consent.
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
                    data-testid="onboarding-terms-checkbox"
                  />
                  <Check className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100" />
                </div>
                <label htmlFor="agree-terms" className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                  I have read and agree to the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>
                </label>
              </div>
            </div>
          </div>
        );

      case 2: // Personal Info
        return (
          <div className="py-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Personal Information
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                We need some basic information for verification
              </p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="flex flex-col gap-2">
                <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                  National ID Number *
                </Label>
                <Input
                  placeholder="e.g. 12345678"
                  value={formData.national_id}
                  onChange={(e) => updateField('national_id', e.target.value)}
                  className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  data-testid="onboarding-national-id"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                  Date of Birth *
                </Label>
                <Input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => updateField('date_of_birth', e.target.value)}
                  className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  data-testid="onboarding-dob"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                  Country *
                </Label>
                <Select value={formData.country} onValueChange={(v) => updateField('country', v)}>
                  <SelectTrigger className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700" data-testid="onboarding-country">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 3: // Employment
        return (
          <div className="py-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Employment Details
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Tell us about your current employment
              </p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="flex flex-col gap-2">
                <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                  Select Employer *
                </Label>
                <Select value={formData.employer_id} onValueChange={(v) => updateField('employer_id', v)}>
                  <SelectTrigger className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700" data-testid="onboarding-employer">
                    <SelectValue placeholder="Select your employer" />
                  </SelectTrigger>
                  <SelectContent>
                    {employers.map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.company_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {employers.length === 0 && (
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    No employers available yet. Your employer needs to register first.
                  </p>
                )}
              </div>
              
              <div className="flex flex-col gap-2">
                <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                  Employee Code/ID *
                </Label>
                <Input
                  placeholder="e.g. EMP001"
                  value={formData.employee_code}
                  onChange={(e) => updateField('employee_code', e.target.value)}
                  className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  data-testid="onboarding-employee-code"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                  Job Title *
                </Label>
                <Input
                  placeholder="e.g. Software Engineer"
                  value={formData.job_title}
                  onChange={(e) => updateField('job_title', e.target.value)}
                  className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  data-testid="onboarding-job-title"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                    Employment Type *
                  </Label>
                  <Select value={formData.employment_type} onValueChange={(v) => updateField('employment_type', v)}>
                    <SelectTrigger className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700" data-testid="onboarding-employment-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {EMPLOYMENT_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                    Monthly Salary *
                  </Label>
                  <Input
                    type="number"
                    placeholder="e.g. 50000"
                    min="0"
                    value={formData.monthly_salary}
                    onChange={(e) => updateField('monthly_salary', e.target.value)}
                    className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    data-testid="onboarding-salary"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4: // Payment
        return (
          <div className="py-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Payment Details
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                How would you like to receive your advances?
              </p>
            </div>
            
            <div className="space-y-6 max-w-md mx-auto">
              {/* Mobile Money */}
              <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  Mobile Money (Recommended)
                </h3>
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                      Provider *
                    </Label>
                    <Select 
                      value={formData.mobile_money_provider} 
                      onValueChange={(v) => updateField('mobile_money_provider', v)}
                      disabled={!selectedCountry}
                    >
                      <SelectTrigger className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700" data-testid="onboarding-mobile-provider">
                        <SelectValue placeholder={selectedCountry ? "Select provider" : "Select country first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedCountry?.mobile_money?.map((p) => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                      Mobile Number *
                    </Label>
                    <Input
                      type="tel"
                      placeholder="+254 700 000 000"
                      value={formData.mobile_money_number}
                      onChange={(e) => updateField('mobile_money_number', e.target.value)}
                      className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20"
                      data-testid="onboarding-mobile-number"
                    />
                  </div>
                </div>
              </div>
              
              {/* Bank Account */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-slate-500" />
                  Bank Account (Optional)
                </h3>
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                      Bank Name
                    </Label>
                    <Input
                      placeholder="e.g. Kenya Commercial Bank"
                      value={formData.bank_name}
                      onChange={(e) => updateField('bank_name', e.target.value)}
                      className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20"
                      data-testid="onboarding-bank-name"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                      Account Number
                    </Label>
                    <Input
                      placeholder="e.g. 1234567890"
                      value={formData.bank_account}
                      onChange={(e) => updateField('bank_account', e.target.value)}
                      className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20"
                      data-testid="onboarding-bank-account"
                    />
                  </div>
                </div>
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
          <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/20 rounded-xl backdrop-blur-sm" data-testid="onboarding-error">
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
              data-testid="complete-onboarding"
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
              data-testid="next-step"
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
