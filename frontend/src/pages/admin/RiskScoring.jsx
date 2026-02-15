import React, { useState, useEffect } from 'react';
import { 
  Shield, Calculator, Building2, User, Save, RotateCcw, RefreshCw,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Search,
  Calendar, Clock, Bell, ChevronRight, Eye
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Slider } from '../../components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { AdminPortalLayout } from '../../components/admin/AdminLayout';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Employer scoring factors
const EMPLOYER_FACTORS = {
  legal_compliance: [
    { key: 'registration_status', label: 'Registration Status', weight: 0.10, description: 'Company registration validity' },
    { key: 'tax_compliance', label: 'Tax Compliance', weight: 0.07, description: 'Tax payment history' },
    { key: 'ewa_agreement', label: 'EWA Agreement', weight: 0.03, description: 'Signed EWA contract' },
  ],
  financial_health: [
    { key: 'audited_financials', label: 'Audited Financials', weight: 0.15, description: 'Financial audit status' },
    { key: 'liquidity_ratio', label: 'Liquidity Ratio', weight: 0.10, description: 'Ability to meet obligations (external)' },
    { key: 'payroll_sustainability', label: 'Payroll Sustainability', weight: 0.10, description: 'Payroll funding history' },
  ],
  operational: [
    { key: 'employee_count', label: 'Employee Count', weight: 0.05, description: 'Workforce size stability' },
    { key: 'churn_rate', label: 'Churn Rate', weight: 0.05, description: 'Employee turnover' },
    { key: 'payroll_integration', label: 'Payroll Integration', weight: 0.10, description: 'System integration level' },
  ],
  sector_exposure: [
    { key: 'industry_risk', label: 'Industry Risk', weight: 0.10, description: 'Sector-specific risks' },
    { key: 'regulatory_exposure', label: 'Regulatory Exposure', weight: 0.05, description: 'Regulatory compliance risk' },
  ],
  aml_transparency: [
    { key: 'beneficial_ownership', label: 'Beneficial Ownership', weight: 0.05, description: 'Ownership transparency' },
    { key: 'pep_screening', label: 'PEP Screening', weight: 0.05, description: 'Political exposure screening' },
  ],
};

const EMPLOYEE_FACTORS = {
  legal_compliance: [
    { key: 'verification_status', label: 'ID Verification', weight: 0.15, description: 'Identity document verification' },
    { key: 'tax_compliance', label: 'Tax Compliance', weight: 0.10, description: 'Tax ID verification' },
    { key: 'consent_data_rights', label: 'Consent & Rights', weight: 0.10, description: 'Data consent obtained' },
  ],
  financial_health: [
    { key: 'account_verification', label: 'Account Verification', weight: 0.45, description: 'Bank/mobile money verified' },
  ],
  operational: [
    { key: 'employment_status', label: 'Employment Status', weight: 0.075, description: 'Active employment' },
    { key: 'employment_contract', label: 'Employment Contract', weight: 0.075, description: 'Contract on file' },
    { key: 'recent_payslips', label: 'Recent Payslips', weight: 0.025, description: 'Payslip verification' },
    { key: 'bank_statements', label: 'Bank Statements', weight: 0.025, description: 'Statement verification' },
  ],
};

// Gradient Icon Box
const GradientIconBox = ({ icon: Icon, size = 'md', variant = 'purple' }) => {
  const sizes = { sm: 'w-10 h-10', md: 'w-12 h-12', lg: 'w-14 h-14' };
  const iconSizes = { sm: 'w-5 h-5', md: 'w-6 h-6', lg: 'w-7 h-7' };
  const variants = {
    purple: 'from-purple-600 to-indigo-600',
    green: 'from-emerald-500 to-green-600',
    amber: 'from-amber-500 to-orange-500',
    red: 'from-red-500 to-rose-500',
    blue: 'from-blue-500 to-cyan-500'
  };
  
  return (
    <div className={cn(
      "rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg",
      sizes[size], variants[variant]
    )}>
      <Icon className={cn("text-white", iconSizes[size])} />
    </div>
  );
};

// Metric Card
const MetricCard = ({ icon, label, value, subtext, variant = 'purple' }) => (
  <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-200/50 dark:border-slate-700/30">
    <div className="flex items-start justify-between">
      <GradientIconBox icon={icon} size="md" variant={variant} />
    </div>
    <div className="mt-4">
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>
      {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
    </div>
  </div>
);

// Risk Rating Badge
const RiskRatingBadge = ({ score, showScore = true }) => {
  const getRating = (s) => {
    if (s >= 4.0) return { rating: 'A', label: 'Low Risk', color: 'emerald' };
    if (s >= 3.0) return { rating: 'B', label: 'Medium Risk', color: 'amber' };
    if (s >= 2.6) return { rating: 'C', label: 'High Risk', color: 'orange' };
    return { rating: 'D', label: 'Very High Risk', color: 'red' };
  };
  
  const { rating, label, color } = getRating(score);
  const colors = {
    emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
    orange: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300',
    red: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
  };
  
  return (
    <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", colors[color])}>
      {showScore ? `${score?.toFixed(1)} - ${label}` : `${rating} - ${label}`}
    </span>
  );
};

// Verification Alert Card
const VerificationAlertCard = ({ item, type, onReview }) => {
  const daysOverdue = item.days_until_review < 0 ? Math.abs(item.days_until_review) : 0;
  const isDue = item.days_until_review <= 30;
  
  return (
    <div className={cn(
      "flex items-center gap-4 p-4 rounded-xl border",
      daysOverdue > 0 
        ? "bg-red-50/50 dark:bg-red-500/5 border-red-200 dark:border-red-500/30" 
        : isDue 
          ? "bg-amber-50/50 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/30"
          : "bg-white/40 dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-700/30"
    )}>
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
        daysOverdue > 0 ? "bg-red-100 dark:bg-red-500/20" :
        isDue ? "bg-amber-100 dark:bg-amber-500/20" : "bg-slate-100 dark:bg-slate-500/20"
      )}>
        {type === 'employer' ? (
          <Building2 className={cn("w-5 h-5", daysOverdue > 0 ? "text-red-600" : isDue ? "text-amber-600" : "text-slate-600")} />
        ) : (
          <User className={cn("w-5 h-5", daysOverdue > 0 ? "text-red-600" : isDue ? "text-amber-600" : "text-slate-600")} />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-900 dark:text-white truncate">
          {type === 'employer' ? item.company_name : item.full_name}
        </p>
        <div className="flex items-center gap-2 text-sm">
          <RiskRatingBadge score={item.risk_score || 3} />
          {item.last_verified_at && (
            <span className="text-slate-500 text-xs">
              Last verified: {new Date(item.last_verified_at).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      
      <div className="text-right">
        {daysOverdue > 0 ? (
          <span className="text-sm font-semibold text-red-600">{daysOverdue} days overdue</span>
        ) : isDue ? (
          <span className="text-sm font-semibold text-amber-600">Due in {item.days_until_review} days</span>
        ) : (
          <span className="text-sm text-slate-500">{item.days_until_review} days</span>
        )}
      </div>
      
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => onReview(item, type)}
        className="shrink-0"
      >
        <Eye className="w-4 h-4 mr-1" /> Review
      </Button>
    </div>
  );
};

export default function AdminRiskScoring() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [employers, setEmployers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [entityType, setEntityType] = useState('employer');
  const [scores, setScores] = useState({});
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [verificationAlerts, setVerificationAlerts] = useState({ employers: [], employees: [] });

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('eaziwage_token');
      
      const [employersRes, employeesRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/employers`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/api/admin/employees`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      if (employersRes.ok) {
        const data = await employersRes.json();
        setEmployers(data);
        
        // Calculate verification alerts
        const now = new Date();
        const alertEmployers = data.map(e => {
          const lastVerified = e.last_verified_at ? new Date(e.last_verified_at) : new Date(e.created_at);
          const nextDue = new Date(lastVerified);
          nextDue.setMonth(nextDue.getMonth() + 6); // Bi-annual = 6 months
          const daysUntil = Math.ceil((nextDue - now) / (1000 * 60 * 60 * 24));
          return { ...e, days_until_review: daysUntil, next_verification_due: nextDue.toISOString() };
        }).filter(e => e.days_until_review <= 60).sort((a, b) => a.days_until_review - b.days_until_review);
        
        setVerificationAlerts(prev => ({ ...prev, employers: alertEmployers }));
      }
      
      if (employeesRes.ok) {
        const data = await employeesRes.json();
        setEmployees(data);
        
        // Calculate verification alerts for employees
        const now = new Date();
        const alertEmployees = data.map(e => {
          const lastVerified = e.last_verified_at ? new Date(e.last_verified_at) : new Date(e.created_at);
          const nextDue = new Date(lastVerified);
          nextDue.setMonth(nextDue.getMonth() + 6);
          const daysUntil = Math.ceil((nextDue - now) / (1000 * 60 * 60 * 24));
          return { ...e, days_until_review: daysUntil };
        }).filter(e => e.days_until_review <= 60).sort((a, b) => a.days_until_review - b.days_until_review);
        
        setVerificationAlerts(prev => ({ ...prev, employees: alertEmployees }));
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const factors = entityType === 'employer' ? EMPLOYER_FACTORS : EMPLOYEE_FACTORS;

  const initializeScores = (entity = null) => {
    const initial = {};
    Object.keys(factors).forEach(category => {
      initial[category] = {};
      factors[category].forEach(factor => {
        // Use existing scores if available
        initial[category][factor.key] = entity?.risk_factors?.[factor.key] || 3;
      });
    });
    setScores(initial);
    setResult(null);
  };

  useEffect(() => {
    initializeScores(selectedEntity);
  }, [entityType, selectedEntity]);

  const updateScore = (category, key, value) => {
    setScores(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value[0]
      }
    }));
  };

  const getCategoryScore = (category) => {
    if (!scores[category]) return 0;
    const categoryFactors = factors[category];
    let totalWeight = 0;
    let weightedSum = 0;
    
    categoryFactors.forEach(factor => {
      const score = scores[category][factor.key] || 0;
      weightedSum += score * factor.weight;
      totalWeight += factor.weight;
    });
    
    return totalWeight > 0 ? (weightedSum / totalWeight).toFixed(2) : 0;
  };

  const getOverallScore = () => {
    let totalWeightedScore = 0;
    let totalWeight = 0;
    
    Object.keys(factors).forEach(category => {
      factors[category].forEach(factor => {
        const score = scores[category]?.[factor.key] || 0;
        totalWeightedScore += score * factor.weight;
        totalWeight += factor.weight;
      });
    });
    
    return totalWeight > 0 ? (totalWeightedScore / totalWeight).toFixed(2) : 0;
  };

  // Calculate net weighted score for employee (employer weight 40%, employee 60%)
  const getNetWeightedScore = () => {
    if (entityType !== 'employee' || !selectedEntity) return null;
    
    const employeeScore = parseFloat(getOverallScore());
    const employer = employers.find(e => e.id === selectedEntity.employer_id);
    const employerScore = employer?.risk_score || 3;
    
    // Net weighted: 40% employer + 60% employee
    const netScore = (employerScore * 0.4) + (employeeScore * 0.6);
    return netScore.toFixed(2);
  };

  const calculateFeePercentage = (score) => {
    // Formula: 3.5% + (3% × (1 - CRS/5))
    return 3.5 + (3 * (1 - score / 5));
  };

  const calculateRiskScore = async () => {
    if (!selectedEntity) {
      toast.error('Please select an entity to score');
      return;
    }

    setCalculating(true);
    try {
      const token = localStorage.getItem('eaziwage_token');
      const overallScore = parseFloat(getOverallScore());
      const netScore = entityType === 'employee' ? parseFloat(getNetWeightedScore()) : overallScore;
      
      const endpoint = entityType === 'employer' 
        ? `${API_URL}/api/admin/employers/${selectedEntity.id}/risk-score`
        : `${API_URL}/api/admin/employees/${selectedEntity.id}/risk-score`;
      
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          risk_score: netScore,
          risk_factors: scores,
          last_verified_at: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setResult({ composite_risk_score: netScore, ...data });
        toast.success('Risk score calculated and saved!');
        fetchData(); // Refresh data
      } else {
        toast.error('Failed to save risk score');
      }
    } catch (err) {
      toast.error('Failed to calculate risk score');
    } finally {
      setCalculating(false);
    }
  };

  // Filter entities for dropdown
  const filteredEntities = (entityType === 'employer' ? employers : employees).filter(e => {
    if (!searchTerm) return true;
    const name = entityType === 'employer' ? e.company_name : e.full_name;
    return name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const overallScore = parseFloat(getOverallScore());
  const netWeightedScore = getNetWeightedScore();
  const displayScore = entityType === 'employee' && netWeightedScore ? parseFloat(netWeightedScore) : overallScore;
  const feePercentage = calculateFeePercentage(displayScore);

  // Stats
  const stats = {
    totalEmployers: employers.length,
    totalEmployees: employees.length,
    overdueReviews: verificationAlerts.employers.filter(e => e.days_until_review < 0).length + 
                     verificationAlerts.employees.filter(e => e.days_until_review < 0).length,
    pendingReviews: verificationAlerts.employers.filter(e => e.days_until_review >= 0 && e.days_until_review <= 30).length +
                    verificationAlerts.employees.filter(e => e.days_until_review >= 0 && e.days_until_review <= 30).length,
  };

  return (
    <AdminPortalLayout>
      <div className="max-w-7xl mx-auto space-y-6" data-testid="admin-risk-scoring-page">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Risk Scoring</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Calculate composite risk scores and manage bi-annual reviews
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-white/60 dark:bg-slate-800/60" onClick={fetchData}>
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard icon={Building2} label="Total Employers" value={stats.totalEmployers} variant="purple" />
          <MetricCard icon={User} label="Total Employees" value={stats.totalEmployees} variant="blue" />
          <MetricCard icon={AlertTriangle} label="Overdue Reviews" value={stats.overdueReviews} variant="red" subtext="Immediate action needed" />
          <MetricCard icon={Clock} label="Pending Reviews" value={stats.pendingReviews} variant="amber" subtext="Due within 30 days" />
        </div>

        {/* Tabs */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/30 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b border-slate-200/50 dark:border-slate-700/30 px-4">
              <TabsList className="bg-transparent h-14">
                <TabsTrigger 
                  value="calculator" 
                  className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-500/20 dark:data-[state=active]:text-purple-300"
                >
                  <Calculator className="w-4 h-4 mr-2" /> Risk Calculator
                </TabsTrigger>
                <TabsTrigger 
                  value="alerts"
                  className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-500/20 dark:data-[state=active]:text-purple-300"
                >
                  <Bell className="w-4 h-4 mr-2" /> Verification Alerts
                  {(stats.overdueReviews + stats.pendingReviews) > 0 && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                      {stats.overdueReviews + stats.pendingReviews}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="calculator" className="p-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Scoring Form */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Entity Selection */}
                  <div className="bg-slate-50/50 dark:bg-slate-800/30 rounded-xl p-5 space-y-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Shield className="w-5 h-5 text-purple-600" /> Select Entity
                    </h3>
                    
                    <Tabs value={entityType} onValueChange={(v) => { setEntityType(v); setSelectedEntity(null); setSearchTerm(''); }}>
                      <TabsList className="grid w-full grid-cols-2 bg-white/60 dark:bg-slate-800/60">
                        <TabsTrigger value="employer" className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                          <Building2 className="w-4 h-4" /> Employer
                        </TabsTrigger>
                        <TabsTrigger value="employee" className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                          <User className="w-4 h-4" /> Employee
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>

                    {/* Search and Select */}
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          placeholder={`Search ${entityType}s...`}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-white/60 dark:bg-slate-800/60"
                          data-testid="entity-search"
                        />
                      </div>
                      
                      <div className="max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-xl bg-white/60 dark:bg-slate-800/60">
                        {loading ? (
                          <div className="p-4 text-center text-slate-500">Loading...</div>
                        ) : filteredEntities.length === 0 ? (
                          <div className="p-4 text-center text-slate-500">No {entityType}s found</div>
                        ) : (
                          filteredEntities.map(entity => (
                            <button
                              key={entity.id}
                              onClick={() => setSelectedEntity(entity)}
                              className={cn(
                                "w-full flex items-center gap-3 p-3 text-left hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors",
                                selectedEntity?.id === entity.id && "bg-purple-50 dark:bg-purple-500/10"
                              )}
                              data-testid={`entity-${entity.id}`}
                            >
                              <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center",
                                selectedEntity?.id === entity.id ? "bg-purple-500 text-white" : "bg-slate-200 dark:bg-slate-700"
                              )}>
                                {entityType === 'employer' ? <Building2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-900 dark:text-white truncate">
                                  {entityType === 'employer' ? entity.company_name : entity.full_name}
                                </p>
                                <p className="text-xs text-slate-500 truncate">
                                  {entityType === 'employer' ? entity.contact_email : entity.employee_code}
                                </p>
                              </div>
                              {entity.risk_score && (
                                <RiskRatingBadge score={entity.risk_score} />
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Scoring Factors */}
                  {selectedEntity && Object.entries(factors).map(([category, categoryFactors]) => (
                    <div key={category} className="bg-slate-50/50 dark:bg-slate-800/30 rounded-xl p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-900 dark:text-white capitalize">
                          {category.replace(/_/g, ' ')}
                        </h3>
                        <span className={cn(
                          "text-sm font-medium px-3 py-1 rounded-full",
                          parseFloat(getCategoryScore(category)) >= 3.5 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' :
                          parseFloat(getCategoryScore(category)) >= 2.5 ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300' :
                          'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300'
                        )}>
                          Score: {getCategoryScore(category)}
                        </span>
                      </div>
                      
                      <div className="space-y-5">
                        {categoryFactors.map((factor) => (
                          <div key={factor.key}>
                            <div className="flex justify-between items-center mb-2">
                              <div>
                                <Label className="font-medium text-slate-900 dark:text-white">{factor.label}</Label>
                                <p className="text-xs text-slate-500">{factor.description}</p>
                              </div>
                              <div className="text-right">
                                <span className="text-lg font-bold text-slate-900 dark:text-white">
                                  {scores[category]?.[factor.key] || 3}
                                </span>
                                <span className="text-xs text-slate-500 ml-1">/ 5</span>
                                <p className="text-xs text-slate-400">Weight: {(factor.weight * 100).toFixed(0)}%</p>
                              </div>
                            </div>
                            <Slider
                              value={[scores[category]?.[factor.key] || 3]}
                              onValueChange={(value) => updateScore(category, factor.key, value)}
                              min={1}
                              max={5}
                              step={1}
                              className="w-full"
                              data-testid={`slider-${factor.key}`}
                            />
                            <div className="flex justify-between text-xs text-slate-400 mt-1">
                              <span>Very High Risk</span>
                              <span>Low Risk</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {selectedEntity && (
                    <div className="flex gap-4">
                      <Button 
                        variant="outline" 
                        onClick={() => initializeScores()}
                        className="flex items-center gap-2 bg-white/60 dark:bg-slate-800/60"
                      >
                        <RotateCcw className="w-4 h-4" /> Reset
                      </Button>
                      <Button 
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                        onClick={calculateRiskScore}
                        disabled={calculating}
                        data-testid="calculate-btn"
                      >
                        <Calculator className="w-4 h-4 mr-2" />
                        {calculating ? 'Calculating...' : 'Calculate & Save Risk Score'}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Results Panel */}
                <div className="space-y-6">
                  <div className="bg-slate-50/50 dark:bg-slate-800/30 rounded-xl p-5 sticky top-24">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Risk Assessment</h3>
                    
                    {/* Overall Score */}
                    <div className="text-center p-6 bg-white/60 dark:bg-slate-800/60 rounded-xl mb-4">
                      <div className={cn(
                        "w-24 h-24 mx-auto rounded-full flex items-center justify-center text-3xl font-bold border-4",
                        displayScore >= 4.0 ? "border-emerald-500 text-emerald-600" :
                        displayScore >= 3.0 ? "border-amber-500 text-amber-600" :
                        displayScore >= 2.6 ? "border-orange-500 text-orange-600" :
                        "border-red-500 text-red-600"
                      )}>
                        {displayScore >= 4.0 ? 'A' : displayScore >= 3.0 ? 'B' : displayScore >= 2.6 ? 'C' : 'D'}
                      </div>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white mt-4">{displayScore.toFixed(2)}</p>
                      <RiskRatingBadge score={displayScore} showScore={false} />
                    </div>

                    {/* Net Weighted Score for Employees */}
                    {entityType === 'employee' && selectedEntity && (
                      <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 rounded-xl p-4 mb-4">
                        <p className="text-sm text-purple-700 dark:text-purple-300 font-medium mb-2">Net Weighted Score</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Employer (40%)</span>
                          <span className="font-medium">{(employers.find(e => e.id === selectedEntity.employer_id)?.risk_score || 3).toFixed(1)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Employee (60%)</span>
                          <span className="font-medium">{overallScore.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm border-t border-purple-200 dark:border-purple-500/30 mt-2 pt-2">
                          <span className="font-semibold text-purple-700 dark:text-purple-300">Net Score</span>
                          <span className="font-bold text-purple-700 dark:text-purple-300">{netWeightedScore}</span>
                        </div>
                      </div>
                    )}

                    {/* Fee Calculation */}
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-500/10 dark:to-indigo-500/10 border border-purple-200 dark:border-purple-500/30 rounded-xl p-4 mb-4">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Calculated Application Fee</p>
                      <p className="text-2xl font-bold text-purple-600">{feePercentage.toFixed(2)}%</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Formula: 3.5% + (3% × (1 - CRS/5))
                      </p>
                    </div>

                    {/* Category Breakdown */}
                    {selectedEntity && (
                      <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Category Scores</p>
                        <div className="space-y-2">
                          {Object.keys(factors).map(category => (
                            <div key={category} className="flex items-center justify-between">
                              <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">{category.replace(/_/g, ' ')}</span>
                              <span className={cn(
                                "text-sm font-medium px-2 py-0.5 rounded",
                                parseFloat(getCategoryScore(category)) >= 3.5 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' :
                                parseFloat(getCategoryScore(category)) >= 2.5 ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300' :
                                'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300'
                              )}>
                                {getCategoryScore(category)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {result && (
                      <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-4 text-center mt-4">
                        <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                        <p className="font-medium text-emerald-900 dark:text-emerald-300">Score Saved!</p>
                        <p className="text-sm text-emerald-700 dark:text-emerald-400">CRS: {result.composite_risk_score?.toFixed(2) || displayScore.toFixed(2)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="alerts" className="p-6 space-y-6">
              {/* Overdue Reviews */}
              {(verificationAlerts.employers.filter(e => e.days_until_review < 0).length > 0 ||
                verificationAlerts.employees.filter(e => e.days_until_review < 0).length > 0) && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-red-600 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> Overdue Reviews
                  </h3>
                  <div className="space-y-2">
                    {verificationAlerts.employers.filter(e => e.days_until_review < 0).map(emp => (
                      <VerificationAlertCard 
                        key={emp.id} 
                        item={emp} 
                        type="employer" 
                        onReview={(item) => { setSelectedEntity(item); setEntityType('employer'); setActiveTab('calculator'); }}
                      />
                    ))}
                    {verificationAlerts.employees.filter(e => e.days_until_review < 0).map(emp => (
                      <VerificationAlertCard 
                        key={emp.id} 
                        item={emp} 
                        type="employee" 
                        onReview={(item) => { setSelectedEntity(item); setEntityType('employee'); setActiveTab('calculator'); }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming Reviews */}
              {(verificationAlerts.employers.filter(e => e.days_until_review >= 0).length > 0 ||
                verificationAlerts.employees.filter(e => e.days_until_review >= 0).length > 0) && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-amber-600 flex items-center gap-2">
                    <Clock className="w-5 h-5" /> Upcoming Reviews (Next 60 days)
                  </h3>
                  <div className="space-y-2">
                    {verificationAlerts.employers.filter(e => e.days_until_review >= 0).map(emp => (
                      <VerificationAlertCard 
                        key={emp.id} 
                        item={emp} 
                        type="employer" 
                        onReview={(item) => { setSelectedEntity(item); setEntityType('employer'); setActiveTab('calculator'); }}
                      />
                    ))}
                    {verificationAlerts.employees.filter(e => e.days_until_review >= 0).map(emp => (
                      <VerificationAlertCard 
                        key={emp.id} 
                        item={emp} 
                        type="employee" 
                        onReview={(item) => { setSelectedEntity(item); setEntityType('employee'); setActiveTab('calculator'); }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {verificationAlerts.employers.length === 0 && verificationAlerts.employees.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">All caught up!</h3>
                  <p className="text-sm text-slate-500 mt-1">No verification reviews due in the next 60 days</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminPortalLayout>
  );
}
