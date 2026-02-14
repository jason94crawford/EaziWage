import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Lock, Check, Sparkles, User, Mail, Building2, Search, X, Phone, AlertTriangle, ChevronDown } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AlertCircle, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../lib/ThemeContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Supported countries with dialing codes
const DIALING_CODES = [
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪' },
  { code: 'TZ', name: 'Tanzania', dialCode: '+255', flag: '🇹🇿' },
  { code: 'UG', name: 'Uganda', dialCode: '+256', flag: '🇺🇬' },
  { code: 'RW', name: 'Rwanda', dialCode: '+250', flag: '🇷🇼' },
];

// Create a fresh axios instance without interceptors for auth
const authAxios = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [accountType, setAccountType] = useState('employee');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [companyCode, setCompanyCode] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Mobile number state
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedDialCode, setSelectedDialCode] = useState(DIALING_CODES[0]);
  const [showDialCodeDropdown, setShowDialCodeDropdown] = useState(false);
  
  // Company search modal state
  const [showCompanySearch, setShowCompanySearch] = useState(false);
  const [companySearchQuery, setCompanySearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [employers, setEmployers] = useState([]);
  
  // No company found - employer referral state
  const [noCompanyFound, setNoCompanyFound] = useState(false);
  const [referralEmployerName, setReferralEmployerName] = useState('');
  const [referralEmployerEmail, setReferralEmployerEmail] = useState('');
  const [referralEmployerPhone, setReferralEmployerPhone] = useState('');

  // Fetch employers list on mount
  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        const response = await authAxios.get('/api/employers/public/approved');
        setEmployers(response.data || []);
      } catch (err) {
        console.error('Failed to fetch employers:', err);
      }
    };
    fetchEmployers();
  }, []);

  // Filter employers based on search query
  useEffect(() => {
    if (companySearchQuery.trim()) {
      const query = companySearchQuery.toLowerCase();
      const filtered = employers.filter(emp => 
        emp.company_name?.toLowerCase().includes(query) ||
        emp.company_code?.toLowerCase().includes(query)
      );
      setSearchResults(filtered);
    } else {
      setSearchResults(employers);
    }
  }, [companySearchQuery, employers]);

  const handleSelectCompany = (company) => {
    setSelectedCompany(company);
    setCompanyCode(company.company_code || '');
    setShowCompanySearch(false);
    setNoCompanyFound(false);
    // Clear referral fields
    setReferralEmployerName('');
    setReferralEmployerEmail('');
    setReferralEmployerPhone('');
  };

  const handleClearCompany = () => {
    setSelectedCompany(null);
    setCompanyCode('');
  };

  const handleCompanyNotFound = () => {
    setShowCompanySearch(false);
    setNoCompanyFound(true);
    setSelectedCompany(null);
    setCompanyCode('');
  };

  const handleSubmit = useCallback(async () => {
    if (!fullName || !email || !password || !mobileNumber) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate mobile number (at least 9 digits)
    const cleanedNumber = mobileNumber.replace(/\D/g, '');
    if (cleanedNumber.length < 9) {
      setError('Please enter a valid mobile number');
      return;
    }

    if (accountType === 'employer' && !companyName) {
      setError('Please enter your company name');
      return;
    }

    // For employees without company, validate referral info
    if (accountType === 'employee' && noCompanyFound) {
      if (!referralEmployerName || !referralEmployerEmail || !referralEmployerPhone) {
        setError('Please provide your employer\'s contact details so we can onboard them');
        return;
      }
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }
    
    setError('');
    setIsLoading(true);

    try {
      const fullMobileNumber = `${selectedDialCode.dialCode}${mobileNumber.replace(/\D/g, '')}`;
      const payload = { 
        full_name: fullName, 
        email, 
        phone: fullMobileNumber,
        phone_country_code: selectedDialCode.code,
        password, 
        role: accountType,
        company_code: accountType === 'employee' ? companyCode : '',
        company_name: accountType === 'employer' ? companyName : '',
        // Include referral info if no company found
        employer_referral: noCompanyFound ? {
          employer_name: referralEmployerName,
          employer_email: referralEmployerEmail,
          employer_phone: referralEmployerPhone
        } : null
      };
      
      const response = await authAxios.post('/api/auth/register', payload);
      const data = response.data;

      localStorage.setItem('eaziwage_token', data.access_token);
      localStorage.setItem('eaziwage_user', JSON.stringify(data.user));
      
      // Navigate to appropriate onboarding
      if (accountType === 'employer') {
        navigate('/employer/onboarding');
      } else {
        navigate('/employee/onboarding');
      }
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.detail || 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [fullName, email, companyCode, companyName, password, agreedToTerms, accountType, navigate, noCompanyFound, referralEmployerName, referralEmployerEmail, referralEmployerPhone, mobileNumber, selectedDialCode]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleGoogleSignup = () => {
    localStorage.setItem('eaziwage_pending_role', accountType);
    const redirectUrl = window.location.origin + '/auth/callback';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const handleAppleSignup = () => {
    setError('Apple Sign In coming soon! Please use email or Google signup.');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 relative overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/5 rounded-full blur-[200px]" />
      
      {/* Company Search Modal */}
      {showCompanySearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white">Find Your Company</h3>
                <button 
                  onClick={() => setShowCompanySearch(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search by company name or code..."
                  className="h-12 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  value={companySearchQuery}
                  onChange={(e) => setCompanySearchQuery(e.target.value)}
                  autoFocus
                  data-testid="company-search-input"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              </div>
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="p-2">
                  {searchResults.map((company) => (
                    <button
                      key={company.id}
                      onClick={() => handleSelectCompany(company)}
                      className="w-full p-3 rounded-xl hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors text-left flex items-center gap-3"
                      data-testid={`company-option-${company.company_code}`}
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{company.company_name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Code: {company.company_code}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400 mb-1">No companies found</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500">Try a different search or continue without a code</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <button
                onClick={handleCompanyNotFound}
                className="w-full py-3 text-sm font-medium text-primary hover:underline"
                data-testid="company-not-found-btn"
              >
                My company isn't listed — Continue without code
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-end">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
            data-testid="theme-toggle"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-md">
          <div className="stagger">
            {/* Centered Logo */}
            <div className="flex justify-center mb-6">
              <Link to="/" className="flex items-center gap-3 group" data-testid="logo-link">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/30">
                    <span className="text-white font-bold text-2xl">E</span>
                  </div>
                  <div className="absolute inset-0 bg-primary/30 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300 -z-10" />
                </div>
                <span className="font-heading font-bold text-2xl text-slate-900 dark:text-white">EaziWage</span>
              </Link>
            </div>

            {/* Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 dark:bg-primary/20 border border-primary/20 rounded-full text-sm font-semibold text-primary">
                <Sparkles className="w-4 h-4" />
                Join 50,000+ workers across East Africa
              </div>
            </div>
            
            {/* Headline */}
            <div className="text-center mb-10">
              <h1 className="font-heading text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-4">
                Get Started with
                <br />
                <span className="text-gradient">EaziWage</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Access your earned wages instantly. No loans, no interest.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/20 rounded-xl backdrop-blur-sm" data-testid="register-error">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            {/* Registration Form */}
            <div className="glass-card rounded-3xl p-8 shadow-xl">
              <div className="flex flex-col gap-5">
                {/* Account Type Toggle */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                    I am an
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setAccountType('employee');
                        setNoCompanyFound(false);
                      }}
                      className={`py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                        accountType === 'employee'
                          ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      data-testid="account-type-employee"
                    >
                      Employee
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountType('employer')}
                      className={`py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                        accountType === 'employer'
                          ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      data-testid="account-type-employer"
                    >
                      Employer
                    </button>
                  </div>
                </div>

                {/* Full Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="e.g. Jane Doe"
                      className="h-14 pl-4 pr-12 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onKeyPress={handleKeyPress}
                      data-testid="register-name"
                    />
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </div>
                </div>

                {/* Work Email */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                    {accountType === 'employer' ? 'Business Email' : 'Work Email'}
                  </label>
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder={accountType === 'employer' ? 'ceo@company.com' : 'name@company.com'}
                      className="h-14 pl-4 pr-12 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={handleKeyPress}
                      data-testid="register-email"
                    />
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </div>
                </div>

                {/* Mobile Number with Dialing Code */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                    {accountType === 'employer' ? 'Business Mobile Number' : 'Mobile Number'}
                  </label>
                  <div className="flex gap-2">
                    {/* Dialing Code Selector */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowDialCodeDropdown(!showDialCodeDropdown)}
                        className="h-14 px-3 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 flex items-center gap-2 transition-colors min-w-[110px]"
                        data-testid="dialing-code-selector"
                      >
                        <span className="text-lg">{selectedDialCode.flag}</span>
                        <span className="text-slate-900 dark:text-white text-sm font-medium">{selectedDialCode.dialCode}</span>
                        <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />
                      </button>
                      
                      {showDialCodeDropdown && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden">
                          {DIALING_CODES.map((country) => (
                            <button
                              key={country.code}
                              type="button"
                              onClick={() => {
                                setSelectedDialCode(country);
                                setShowDialCodeDropdown(false);
                              }}
                              className={`w-full px-3 py-2.5 flex items-center gap-2 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors text-left ${
                                selectedDialCode.code === country.code ? 'bg-primary/5 dark:bg-primary/10' : ''
                              }`}
                              data-testid={`dialing-code-${country.code}`}
                            >
                              <span className="text-lg">{country.flag}</span>
                              <span className="text-slate-900 dark:text-white text-sm">{country.name}</span>
                              <span className="text-slate-500 text-sm ml-auto">{country.dialCode}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Mobile Number Input */}
                    <div className="relative flex-1">
                      <Input
                        type="tel"
                        placeholder="700 000 000"
                        className="h-14 pl-4 pr-12 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        onKeyPress={handleKeyPress}
                        data-testid="register-mobile"
                      />
                      <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs ml-1">
                    Enter your number without the country code
                  </p>
                </div>

                {/* Company Code (Employee) or Company Name (Employer) */}
                {accountType === 'employee' ? (
                  <>
                    {/* Company Selection */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center ml-1 mr-1">
                        <label className="text-slate-700 dark:text-slate-200 text-sm font-medium">
                          Company
                        </label>
                      </div>
                      
                      {selectedCompany ? (
                        // Selected company - read-only display
                        <div className="relative">
                          <div className="h-14 pl-4 pr-12 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 flex items-center">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Building2 className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-slate-900 dark:text-white text-sm">{selectedCompany.company_name}</p>
                                <p className="text-xs text-slate-500">{selectedCompany.company_code}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={handleClearCompany}
                              className="absolute right-3 p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                              data-testid="clear-company-btn"
                            >
                              <X className="w-4 h-4 text-slate-400" />
                            </button>
                          </div>
                        </div>
                      ) : noCompanyFound ? (
                        // No company found - show referral form
                        <div className="space-y-3">
                          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Company not on EaziWage yet</p>
                                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Please provide your employer's details so we can reach out to onboard them.</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="relative">
                            <Input
                              type="text"
                              placeholder="Employer/Company Name"
                              className="h-12 pl-4 pr-10 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white placeholder:text-slate-400"
                              value={referralEmployerName}
                              onChange={(e) => setReferralEmployerName(e.target.value)}
                              data-testid="referral-employer-name"
                            />
                            <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          </div>
                          
                          <div className="relative">
                            <Input
                              type="email"
                              placeholder="HR/Contact Email"
                              className="h-12 pl-4 pr-10 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white placeholder:text-slate-400"
                              value={referralEmployerEmail}
                              onChange={(e) => setReferralEmployerEmail(e.target.value)}
                              data-testid="referral-employer-email"
                            />
                            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          </div>
                          
                          <div className="relative">
                            <Input
                              type="tel"
                              placeholder="HR/Contact Phone"
                              className="h-12 pl-4 pr-10 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white placeholder:text-slate-400"
                              value={referralEmployerPhone}
                              onChange={(e) => setReferralEmployerPhone(e.target.value)}
                              data-testid="referral-employer-phone"
                            />
                            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => {
                              setNoCompanyFound(false);
                              setShowCompanySearch(true);
                            }}
                            className="text-sm text-primary hover:underline font-medium"
                          >
                            ← Search for company again
                          </button>
                        </div>
                      ) : (
                        // No company selected - show search button
                        <button
                          type="button"
                          onClick={() => setShowCompanySearch(true)}
                          className="h-14 px-4 rounded-xl bg-white dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-600 hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-3 text-left"
                          data-testid="find-company-btn"
                        >
                          <Search className="w-5 h-5 text-primary" />
                          <span className="text-slate-600 dark:text-slate-400">Find your company...</span>
                        </button>
                      )}
                      
                      {!selectedCompany && !noCompanyFound && (
                        <p className="text-slate-500 dark:text-slate-400 text-xs ml-1">Search and select your employer from our registered companies.</p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                      Company Name
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="e.g. Acme Corporation"
                        className="h-14 pl-4 pr-12 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        data-testid="register-company-name"
                      />
                      <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                )}

                {/* Password */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a secure password"
                      className="h-14 pl-4 pr-12 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      data-testid="register-password"
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      data-testid="toggle-password"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-start gap-3 py-2">
                  <div className="relative flex items-center mt-0.5">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 checked:border-primary checked:bg-primary transition-all hover:border-primary"
                      data-testid="terms-checkbox"
                    />
                    <Check className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100" />
                  </div>
                  <label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400 leading-snug cursor-pointer select-none">
                    I agree to the{' '}
                    <Link to="/terms" className="text-primary hover:underline font-medium">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-primary hover:underline font-medium">Privacy Policy</Link>.
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full h-14 mt-2 rounded-2xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white font-semibold text-base shadow-xl shadow-primary/30 btn-glow"
                  data-testid="register-submit-btn"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Account...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {accountType === 'employee' ? 'Create Employee Account' : 'Create Employer Account'}
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>

                {/* Divider */}
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/60 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 backdrop-blur-sm rounded-full">
                      or sign up with
                    </span>
                  </div>
                </div>

                {/* Social Signup Options */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Google */}
                  <button
                    type="button"
                    onClick={handleGoogleSignup}
                    className="flex items-center justify-center gap-2 h-12 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5 transition-all text-sm font-medium text-slate-700 dark:text-slate-300"
                    data-testid="google-signup-btn"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </button>

                  {/* Apple */}
                  <button
                    type="button"
                    onClick={handleAppleSignup}
                    className="flex items-center justify-center gap-2 h-12 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5 transition-all text-sm font-medium text-slate-700 dark:text-slate-300"
                    data-testid="apple-signup-btn"
                  >
                    <svg className="w-5 h-5 text-slate-900 dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    Apple
                  </button>
                </div>

                {/* Security Note */}
                <div className="flex items-center justify-center gap-1.5 pt-2">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Bank-grade 256-bit encryption</span>
                </div>
              </div>
            </div>

            {/* Login CTA */}
            <div className="mt-8 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-primary font-semibold hover:underline"
                  data-testid="login-link"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
