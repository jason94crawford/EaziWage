import React, { useState, useEffect } from 'react';
import { 
  Shield, Calculator, Building2, User, Save, RotateCcw,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Slider } from '../../components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { employerApi, employeeApi, riskScoreApi } from '../../lib/api';
import { cn, getRiskRatingColor, getRiskRatingLabel, calculateFeePercentage } from '../../lib/utils';
import { toast } from 'sonner';

const EMPLOYER_FACTORS = {
  legal_compliance: [
    { key: 'registration_status', label: 'Registration Status', weight: 0.10, description: 'Company registration validity' },
    { key: 'tax_compliance', label: 'Tax Compliance', weight: 0.07, description: 'Tax payment history' },
    { key: 'ewa_agreement', label: 'EWA Agreement', weight: 0.03, description: 'Signed EWA contract' },
  ],
  financial_health: [
    { key: 'audited_financials', label: 'Audited Financials', weight: 0.15, description: 'Financial audit status' },
    { key: 'liquidity_ratio', label: 'Liquidity Ratio', weight: 0.10, description: 'Ability to meet obligations' },
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

export default function AdminRiskScoring() {
  const [employers, setEmployers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [entityType, setEntityType] = useState('employer');
  const [scores, setScores] = useState({});
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employersRes, employeesRes] = await Promise.all([
          employerApi.list(),
          employeeApi.list()
        ]);
        setEmployers(employersRes.data);
        setEmployees(employeesRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const factors = entityType === 'employer' ? EMPLOYER_FACTORS : EMPLOYEE_FACTORS;

  const initializeScores = () => {
    const initial = {};
    Object.keys(factors).forEach(category => {
      initial[category] = {};
      factors[category].forEach(factor => {
        initial[category][factor.key] = 3; // Default to middle score
      });
    });
    setScores(initial);
    setResult(null);
  };

  useEffect(() => {
    initializeScores();
  }, [entityType]);

  const updateScore = (category, key, value) => {
    setScores(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value[0]
      }
    }));
  };

  const calculateRiskScore = async () => {
    if (!selectedEntity) {
      toast.error('Please select an entity to score');
      return;
    }

    setCalculating(true);
    try {
      let response;
      if (entityType === 'employer') {
        response = await riskScoreApi.updateEmployerScore(selectedEntity, scores);
      } else {
        response = await riskScoreApi.updateEmployeeScore(selectedEntity, scores);
      }
      
      setResult(response.data);
      toast.success('Risk score calculated successfully!');
    } catch (err) {
      toast.error('Failed to calculate risk score');
    } finally {
      setCalculating(false);
    }
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

  const getRating = (score) => {
    if (score >= 4.0) return 'A';
    if (score >= 3.0) return 'B';
    if (score >= 2.6) return 'C';
    return 'D';
  };

  const overallScore = parseFloat(getOverallScore());
  const rating = getRating(overallScore);
  const feePercentage = calculateFeePercentage(overallScore);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900">Risk Scoring Calculator</h1>
          <p className="text-slate-500 mt-1">Calculate composite risk scores for employers and employees</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Scoring Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Entity Selection */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Select Entity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs value={entityType} onValueChange={setEntityType}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="employer" className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Employer
                    </TabsTrigger>
                    <TabsTrigger value="employee" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Employee
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <Select value={selectedEntity || ''} onValueChange={setSelectedEntity}>
                  <SelectTrigger data-testid="entity-select">
                    <SelectValue placeholder={`Select ${entityType}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {entityType === 'employer' ? (
                      employers.map(e => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.company_name} ({e.status})
                        </SelectItem>
                      ))
                    ) : (
                      employees.map(e => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.employee_code} - {e.job_title}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Scoring Factors */}
            {Object.entries(factors).map(([category, categoryFactors]) => (
              <Card key={category} className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg capitalize flex items-center justify-between">
                    {category.replace('_', ' ')}
                    <span className={cn(
                      "text-sm font-normal px-3 py-1 rounded-full",
                      parseFloat(getCategoryScore(category)) >= 3.5 ? 'bg-emerald-100 text-emerald-700' :
                      parseFloat(getCategoryScore(category)) >= 2.5 ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    )}>
                      Score: {getCategoryScore(category)}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {categoryFactors.map((factor) => (
                    <div key={factor.key}>
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <Label className="font-medium">{factor.label}</Label>
                          <p className="text-xs text-slate-500">{factor.description}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-slate-900">
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
                </CardContent>
              </Card>
            ))}

            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={initializeScores}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
              <Button 
                className="flex-1 bg-primary"
                onClick={calculateRiskScore}
                disabled={calculating || !selectedEntity}
                data-testid="calculate-btn"
              >
                <Calculator className="w-4 h-4 mr-2" />
                {calculating ? 'Calculating...' : 'Calculate & Save Risk Score'}
              </Button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            <Card className="border-slate-200 sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Risk Assessment</CardTitle>
                <CardDescription>Live calculation preview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overall Score */}
                <div className="text-center p-6 bg-slate-50 rounded-xl">
                  <div className={cn(
                    "w-24 h-24 mx-auto rounded-full flex items-center justify-center text-3xl font-bold border-4",
                    getRiskRatingColor(rating)
                  )}>
                    {rating}
                  </div>
                  <p className="text-3xl font-bold text-slate-900 mt-4">{overallScore}</p>
                  <p className="text-slate-500">{getRiskRatingLabel(rating)}</p>
                </div>

                {/* Fee Calculation */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <p className="text-sm text-slate-600 mb-2">Calculated Application Fee</p>
                  <p className="text-2xl font-bold text-primary">{feePercentage.toFixed(2)}%</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Formula: 3.5% + (3% × (1 - CRS/5))
                  </p>
                </div>

                {/* Category Breakdown */}
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-3">Category Scores</p>
                  <div className="space-y-2">
                    {Object.keys(factors).map(category => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 capitalize">{category.replace('_', ' ')}</span>
                        <span className={cn(
                          "text-sm font-medium px-2 py-0.5 rounded",
                          parseFloat(getCategoryScore(category)) >= 3.5 ? 'bg-emerald-100 text-emerald-700' :
                          parseFloat(getCategoryScore(category)) >= 2.5 ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        )}>
                          {getCategoryScore(category)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Indicators */}
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm font-medium text-slate-700 mb-3">Risk Indicators</p>
                  <div className="space-y-2">
                    {overallScore >= 4.0 ? (
                      <div className="flex items-center gap-2 text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm">Low risk - Auto approve eligible</span>
                      </div>
                    ) : overallScore >= 3.0 ? (
                      <div className="flex items-center gap-2 text-amber-600">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm">Medium risk - Standard review</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm">High risk - Enhanced review required</span>
                      </div>
                    )}
                  </div>
                </div>

                {result && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <p className="font-medium text-emerald-900">Score Saved!</p>
                    <p className="text-sm text-emerald-700">CRS: {result.composite_risk_score?.toFixed(2) || overallScore}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
