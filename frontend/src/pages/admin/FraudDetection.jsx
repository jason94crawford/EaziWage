import React, { useState, useEffect } from 'react';
import { 
  Shield, AlertTriangle, TrendingUp, Users, Activity, 
  Search, Filter, CheckCircle2, XCircle, Clock, Eye,
  ChevronRight, ChevronDown, AlertCircle, Zap, Ban, Settings,
  RefreshCw, Download, FileText, Database, Lock, Smartphone,
  CreditCard, Globe, MapPin, Building2, UserX, Scale,
  BarChart3, PieChart, LineChart, Briefcase, DollarSign,
  ShieldAlert, ShieldCheck, ShieldOff, UserCheck, ArrowUpRight,
  Plus, Edit, Trash2, Save, X
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { adminApi } from '../../lib/api';
import { toast } from 'sonner';
import AdminPortalLayout from '../../components/admin/AdminLayout';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Risk Level Badge Component
const RiskBadge = ({ level }) => {
  const config = {
    low: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400', icon: ShieldCheck },
    moderate: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400', icon: Shield },
    elevated: { color: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400', icon: ShieldAlert },
    high: { color: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400', icon: ShieldOff },
  };
  const { color, icon: Icon } = config[level] || config.moderate;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${color}`}>
      <Icon className="w-3.5 h-3.5" />
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const config = {
    normal: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400', label: 'Normal' },
    monitored: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400', label: 'Monitored' },
    suspended: { color: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400', label: 'Suspended' },
    pending_review: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400', label: 'Pending Review' },
  };
  const { color, label } = config[status] || config.normal;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${color}`}>
      {label}
    </span>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, title, value, subtitle, trend, color = 'primary' }) => {
  const colorClasses = {
    primary: 'from-purple-500 to-violet-600',
    emerald: 'from-emerald-500 to-green-600',
    amber: 'from-amber-500 to-orange-600',
    red: 'from-red-500 to-rose-600',
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className={`text-xs font-semibold flex items-center gap-1 ${trend > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
            <ArrowUpRight className={`w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{value}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>}
    </div>
  );
};

// Risk Taxonomy Section
const RiskTaxonomySection = () => {
  const riskCategories = [
    { 
      name: 'Payroll Manipulation', 
      description: 'Altered salary data, ghost employees, or falsified records',
      icon: FileText,
      severity: 'high',
      indicators: ['Sudden salary changes >40%', 'New employees with high advances', 'Bulk payroll modifications']
    },
    { 
      name: 'Employer Insolvency', 
      description: 'Employer fails to remit payroll deductions',
      icon: Building2,
      severity: 'high',
      indicators: ['Debit order failures', 'Funding buffer below threshold', 'Bank rejection signals']
    },
    { 
      name: 'Identity & Account Fraud', 
      description: 'SIM swap, device spoofing, stolen credentials',
      icon: UserX,
      severity: 'elevated',
      indicators: ['SIM swap + withdrawal request', 'Device fingerprint changes', 'Multiple accounts per device']
    },
    { 
      name: 'Collusion Fraud', 
      description: 'HR + employee coordination to inflate wages',
      icon: Users,
      severity: 'elevated',
      indicators: ['Cluster salary increases', 'Same payout accounts', 'Unusual approval patterns']
    },
    { 
      name: 'Internal Operational Fraud', 
      description: 'Admin override abuse or unauthorized access',
      icon: Lock,
      severity: 'moderate',
      indicators: ['Unusual admin activity', 'Override without 2FA', 'After-hours access']
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Scale className="w-5 h-5 text-purple-500" />
          Risk Taxonomy
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Primary risk categories monitored by the fraud prevention system
        </p>
      </div>
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {riskCategories.map((category, i) => (
          <div key={i} className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                category.severity === 'high' ? 'bg-red-100 dark:bg-red-500/20' :
                category.severity === 'elevated' ? 'bg-orange-100 dark:bg-orange-500/20' :
                'bg-amber-100 dark:bg-amber-500/20'
              }`}>
                <category.icon className={`w-5 h-5 ${
                  category.severity === 'high' ? 'text-red-600 dark:text-red-400' :
                  category.severity === 'elevated' ? 'text-orange-600 dark:text-orange-400' :
                  'text-amber-600 dark:text-amber-400'
                }`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-slate-900 dark:text-white">{category.name}</h4>
                  <RiskBadge level={category.severity} />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{category.description}</p>
                <div className="flex flex-wrap gap-2">
                  {category.indicators.map((indicator, j) => (
                    <span key={j} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-lg">
                      {indicator}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Risk Scoring Engine Section
const RiskScoringSection = () => {
  const employerFactors = [
    { factor: 'Payroll consistency (3-month trend)', weight: 25 },
    { factor: 'Payment history reliability', weight: 25 },
    { factor: 'Funding buffer adequacy', weight: 20 },
    { factor: 'Staff volatility', weight: 15 },
    { factor: 'Dispute & anomaly frequency', weight: 15 },
  ];

  const employeeFactors = [
    { factor: 'Salary variance vs baseline', weight: 30 },
    { factor: 'Advance frequency', weight: 20 },
    { factor: 'Device consistency', weight: 15 },
    { factor: 'Bank/Mobile number changes', weight: 15 },
    { factor: 'Employer risk linkage', weight: 20 },
  ];

  const riskBands = [
    { range: '80-100', level: 'Low', action: 'Full limits', color: 'emerald' },
    { range: '60-79', level: 'Moderate', action: 'Reduced multiplier', color: 'amber' },
    { range: '40-59', level: 'Elevated', action: 'Limit reductions + monitoring', color: 'orange' },
    { range: '<40', level: 'High', action: 'Temporary suspension', color: 'red' },
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Employer Risk Score */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-purple-500/10 to-violet-500/10">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-500" />
            Employer Risk Score (ERS)
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {employerFactors.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-300">{item.factor}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full" style={{ width: `${item.weight}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white w-10 text-right">{item.weight}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Employee Risk Score */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-emerald-500/10 to-green-500/10">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-500" />
            Employee Risk Score (eRS)
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {employeeFactors.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-300">{item.factor}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full" style={{ width: `${item.weight}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white w-10 text-right">{item.weight}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Bands */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Risk Score Bands & Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {riskBands.map((band, i) => (
              <div key={i} className={`p-4 rounded-xl border-2 ${
                band.color === 'emerald' ? 'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10' :
                band.color === 'amber' ? 'border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10' :
                band.color === 'orange' ? 'border-orange-200 dark:border-orange-500/30 bg-orange-50 dark:bg-orange-500/10' :
                'border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10'
              }`}>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{band.range}</p>
                <p className={`text-sm font-semibold mb-2 ${
                  band.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                  band.color === 'amber' ? 'text-amber-600 dark:text-amber-400' :
                  band.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                  'text-red-600 dark:text-red-400'
                }`}>{band.level} Risk</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">{band.action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Suspension Triggers Section
const SuspensionTriggersSection = () => {
  const [activeTab, setActiveTab] = useState('immediate');
  
  const immediateTriggers = {
    employer: [
      'Debit order failure',
      'Funding buffer < required threshold',
      'Payroll file structural anomaly >25%',
      'Mass salary inflation cluster',
      'Employer insolvency signal',
    ],
    employee: [
      'SIM swap + withdrawal request',
      'Device fingerprint change + bank change',
      'Salary increase >40% MoM',
      'Multiple employees linked to one payout account',
      'Accrued wage exceeds payroll record',
    ],
  };

  const softControls = [
    { control: 'Advance cap reduction', action: '60% → 35%', icon: TrendingUp },
    { control: 'Withdrawal cooldown', action: 'Introduce waiting periods', icon: Clock },
    { control: 'Manual review queue', action: 'Activate for flagged accounts', icon: Eye },
    { control: 'Limit freeze', action: 'Cap at current level', icon: Ban },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Automatic Suspension Triggers
        </h3>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('immediate')}
          className={`flex-1 px-6 py-3 text-sm font-semibold transition-colors ${
            activeTab === 'immediate' 
              ? 'text-red-600 dark:text-red-400 border-b-2 border-red-500' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          Immediate Suspension (Hard Stops)
        </button>
        <button
          onClick={() => setActiveTab('soft')}
          className={`flex-1 px-6 py-3 text-sm font-semibold transition-colors ${
            activeTab === 'soft' 
              ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-500' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          Soft Risk Controls
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'immediate' ? (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Employer Triggers */}
            <div className="bg-red-50 dark:bg-red-500/10 rounded-xl p-4 border border-red-200 dark:border-red-500/30">
              <h4 className="font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Employer-Level Triggers
              </h4>
              <ul className="space-y-2">
                {immediateTriggers.employer.map((trigger, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-red-600 dark:text-red-300">
                    <XCircle className="w-4 h-4 flex-shrink-0" />
                    {trigger}
                  </li>
                ))}
              </ul>
            </div>

            {/* Employee Triggers */}
            <div className="bg-red-50 dark:bg-red-500/10 rounded-xl p-4 border border-red-200 dark:border-red-500/30">
              <h4 className="font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Employee-Level Triggers
              </h4>
              <ul className="space-y-2">
                {immediateTriggers.employee.map((trigger, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-red-600 dark:text-red-300">
                    <XCircle className="w-4 h-4 flex-shrink-0" />
                    {trigger}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {softControls.map((item, i) => (
              <div key={i} className="bg-amber-50 dark:bg-amber-500/10 rounded-xl p-4 border border-amber-200 dark:border-amber-500/30">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-500/20 rounded-lg flex items-center justify-center mb-3">
                  <item.icon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{item.control}</h4>
                <p className="text-sm text-amber-600 dark:text-amber-400">{item.action}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Payroll Integrity Controls Section
const PayrollIntegritySection = () => {
  const controls = [
    {
      title: 'Locked Payroll Snapshots',
      description: 'Payroll freeze once uploaded with version tracking and delta analysis vs prior months',
      icon: Lock,
      status: 'active'
    },
    {
      title: 'Hash Fingerprinting',
      description: 'Generate payroll checksum and flag unauthorized file edits automatically',
      icon: Fingerprint,
      status: 'active'
    },
    {
      title: 'Cooling-Off Period',
      description: 'New employees eligible only after 1 completed payroll cycle',
      icon: Clock,
      status: 'active'
    },
    {
      title: 'Dual Payroll Approval',
      description: 'HR upload requires Finance confirmation - no single-point authority',
      icon: UserCheck,
      status: 'active'
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" />
          Payroll Integrity Controls
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Prevent payroll manipulation and ensure data integrity
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 p-6">
        {controls.map((control, i) => (
          <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <control.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-slate-900 dark:text-white">{control.title}</h4>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                  Active
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{control.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Behavioral Analytics Section
const BehavioralAnalyticsSection = () => {
  const analyticsPatterns = [
    { pattern: 'Time-of-day patterns', description: 'Unusual withdrawal timing', status: 'monitoring' },
    { pattern: 'Cluster withdrawals', description: 'Entire workforce draws at once', status: 'alert' },
    { pattern: 'Device duplication', description: 'Same device across multiple employees', status: 'monitoring' },
    { pattern: 'Geo anomalies', description: 'Location inconsistencies', status: 'monitoring' },
    { pattern: 'IP consistency', description: 'Multiple accounts from same IP', status: 'alert' },
    { pattern: 'Velocity attacks', description: 'Rapid successive requests', status: 'monitoring' },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-violet-500" />
          Behavioral Analytics Layer
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Machine-based anomaly detection monitoring patterns in real-time
        </p>
      </div>
      <div className="p-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyticsPatterns.map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <div className={`w-2 h-2 rounded-full ${
                item.status === 'alert' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.pattern}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-violet-50 dark:bg-violet-500/10 rounded-xl border border-violet-200 dark:border-violet-500/30">
          <p className="text-sm text-violet-700 dark:text-violet-300">
            <strong>Auto-escalation:</strong> Flags automatically escalate into reduced limits → temporary freeze → review queue
          </p>
        </div>
      </div>
    </div>
  );
};

// Suspension Process Section
const SuspensionProcessSection = () => {
  const steps = [
    { step: 1, title: 'Trigger Event', description: 'System automatically flags account based on trigger rules', icon: AlertCircle, color: 'red' },
    { step: 2, title: 'Immediate Action', description: 'Advances suspended, exposure frozen, notification sent to employer admin', icon: Ban, color: 'red' },
    { step: 3, title: 'Investigation (48-72h)', description: 'Risk team reviews payroll documentation, bank confirmation, employee verification', icon: Search, color: 'amber' },
    { step: 4, title: 'Outcome', description: 'False positive: Reinstate | Minor breach: Reduced limits | Confirmed fraud: Permanent restriction', icon: CheckCircle2, color: 'emerald' },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-indigo-500" />
          Temporary Suspension Process
        </h3>
      </div>
      <div className="p-6">
        <div className="relative">
          {steps.map((item, i) => (
            <div key={i} className="flex gap-4 mb-6 last:mb-0">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  item.color === 'red' ? 'bg-red-100 dark:bg-red-500/20' :
                  item.color === 'amber' ? 'bg-amber-100 dark:bg-amber-500/20' :
                  'bg-emerald-100 dark:bg-emerald-500/20'
                }`}>
                  <item.icon className={`w-5 h-5 ${
                    item.color === 'red' ? 'text-red-600 dark:text-red-400' :
                    item.color === 'amber' ? 'text-amber-600 dark:text-amber-400' :
                    'text-emerald-600 dark:text-emerald-400'
                  }`} />
                </div>
                {i < steps.length - 1 && (
                  <div className="w-0.5 h-full bg-slate-200 dark:bg-slate-700 mt-2" />
                )}
              </div>
              <div className="flex-1 pb-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-slate-400">Step {item.step}</span>
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{item.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Active Fraud Alerts Component
const ActiveFraudAlerts = ({ alerts, onReview }) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        Active Fraud Alerts
      </h3>
      <span className="text-xs bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 px-2.5 py-1 rounded-full font-semibold">
        {alerts.length} Pending
      </span>
    </div>
    <div className="divide-y divide-slate-200 dark:divide-slate-700 max-h-96 overflow-y-auto">
      {alerts.length === 0 ? (
        <div className="p-8 text-center">
          <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-400">No active fraud alerts</p>
        </div>
      ) : (
        alerts.map((alert, i) => (
          <div key={i} className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  alert.severity === 'high' ? 'bg-red-100 dark:bg-red-500/20' :
                  alert.severity === 'medium' ? 'bg-amber-100 dark:bg-amber-500/20' :
                  'bg-blue-100 dark:bg-blue-500/20'
                }`}>
                  <AlertTriangle className={`w-5 h-5 ${
                    alert.severity === 'high' ? 'text-red-600 dark:text-red-400' :
                    alert.severity === 'medium' ? 'text-amber-600 dark:text-amber-400' :
                    'text-blue-600 dark:text-blue-400'
                  }`} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{alert.title}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{alert.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-slate-400">{alert.entity}</span>
                    <span className="text-xs text-slate-400">{alert.timestamp}</span>
                  </div>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="rounded-lg"
                onClick={() => onReview(alert)}
              >
                Review
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

// KPIs Section
const KPIsSection = () => {
  const kpis = [
    { label: 'Fraud Loss Ratio', value: '0.12%', target: '<0.5%', status: 'good' },
    { label: 'Recovery Ratio', value: '94%', target: '>90%', status: 'good' },
    { label: 'Suspension Rate', value: '2.3%', target: '<5%', status: 'good' },
    { label: 'False Positive Rate', value: '8%', target: '<15%', status: 'good' },
    { label: 'Avg Investigation Time', value: '18h', target: '<48h', status: 'good' },
    { label: 'Advance Utilization', value: '67%', target: '60-80%', status: 'good' },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-500" />
          Fraud Prevention KPIs
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Key metrics for investors and governance oversight</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{kpi.label}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{kpi.value}</p>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-slate-500 dark:text-slate-400">Target: {kpi.target}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Manual Fraud Rules Section
const ManualRulesSection = ({ rules, onToggle, onEdit, onDelete, onCreate }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    type: 'amount_threshold',
    threshold: '',
    severity: 'medium',
    enabled: true
  });

  const ruleTypes = [
    { value: 'amount_threshold', label: 'Amount Threshold', icon: DollarSign },
    { value: 'frequency', label: 'Frequency Limit', icon: Clock },
    { value: 'velocity', label: 'Velocity Check', icon: Zap },
    { value: 'pattern', label: 'Pattern Detection', icon: Activity },
    { value: 'employer_manipulation', label: 'Employer Manipulation', icon: Building2 },
  ];

  const handleCreate = () => {
    if (!newRule.name || !newRule.threshold) {
      toast.error('Please fill in all required fields');
      return;
    }
    onCreate(newRule);
    setNewRule({ name: '', description: '', type: 'amount_threshold', threshold: '', severity: 'medium', enabled: true });
    setShowCreateModal(false);
  };

  const handleUpdate = () => {
    if (!editingRule.name || !editingRule.threshold) {
      toast.error('Please fill in all required fields');
      return;
    }
    onEdit(editingRule);
    setEditingRule(null);
  };

  const TypeIcon = ({ type }) => {
    const iconConfig = ruleTypes.find(t => t.value === type);
    const Icon = iconConfig?.icon || AlertTriangle;
    return <Icon className="w-5 h-5" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Manual Fraud Rules</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Create and manage custom fraud detection rules</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 text-white"
          data-testid="create-rule-btn"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Rule
        </Button>
      </div>

      {/* Rules List */}
      <div className="grid gap-4">
        {rules.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center">
            <Shield className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-600 dark:text-slate-400">No custom rules created yet</p>
            <p className="text-sm text-slate-500 mt-1">Click "Create Rule" to add your first fraud detection rule</p>
          </div>
        ) : (
          rules.map((rule) => (
            <div 
              key={rule.id}
              className={`bg-white dark:bg-slate-800 rounded-2xl border p-5 transition-all ${
                rule.enabled 
                  ? 'border-emerald-200 dark:border-emerald-500/30' 
                  : 'border-slate-200 dark:border-slate-700 opacity-60'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  rule.enabled ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'bg-slate-100 dark:bg-slate-700'
                }`}>
                  <TypeIcon type={rule.type} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-slate-900 dark:text-white">{rule.name}</h4>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      rule.severity === 'high' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300' :
                      rule.severity === 'medium' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300' :
                      'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300'
                    }`}>
                      {rule.severity.charAt(0).toUpperCase() + rule.severity.slice(1)} Risk
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{rule.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>Type: <strong className="text-slate-700 dark:text-slate-300">{ruleTypes.find(t => t.value === rule.type)?.label}</strong></span>
                    <span>Threshold: <strong className="text-slate-700 dark:text-slate-300">{rule.threshold}</strong></span>
                    <span>Triggered: <strong className="text-slate-700 dark:text-slate-300">{rule.trigger_count || 0}x</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggle(rule.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      rule.enabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                    data-testid={`toggle-rule-${rule.id}`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                      rule.enabled ? 'translate-x-[22px]' : 'translate-x-0.5'
                    }`} />
                  </button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setEditingRule(rule)}
                    data-testid={`edit-rule-${rule.id}`}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onDelete(rule.id)}
                    className="text-red-500 hover:text-red-600"
                    data-testid={`delete-rule-${rule.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New Rule</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Rule Name *</Label>
                <Input
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  placeholder="e.g., High Amount Detection"
                  className="mt-1"
                  data-testid="rule-name-input"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <Input
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  placeholder="Describe what this rule detects"
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Rule Type</Label>
                  <select
                    value={newRule.type}
                    onChange={(e) => setNewRule({ ...newRule, type: e.target.value })}
                    className="mt-1 w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  >
                    {ruleTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Severity</Label>
                  <select
                    value={newRule.severity}
                    onChange={(e) => setNewRule({ ...newRule, severity: e.target.value })}
                    className="mt-1 w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Threshold *</Label>
                <Input
                  value={newRule.threshold}
                  onChange={(e) => setNewRule({ ...newRule, threshold: e.target.value })}
                  placeholder="e.g., >50000 or >3 per day"
                  className="mt-1"
                  data-testid="rule-threshold-input"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowCreateModal(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button 
                onClick={handleCreate} 
                className="rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 text-white"
                data-testid="save-rule-btn"
              >
                <Save className="w-4 h-4 mr-2" />
                Create Rule
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingRule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Edit Rule</h3>
              <Button variant="ghost" size="sm" onClick={() => setEditingRule(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Rule Name *</Label>
                <Input
                  value={editingRule.name}
                  onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <Input
                  value={editingRule.description}
                  onChange={(e) => setEditingRule({ ...editingRule, description: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Rule Type</Label>
                  <select
                    value={editingRule.type}
                    onChange={(e) => setEditingRule({ ...editingRule, type: e.target.value })}
                    className="mt-1 w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  >
                    {ruleTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Severity</Label>
                  <select
                    value={editingRule.severity}
                    onChange={(e) => setEditingRule({ ...editingRule, severity: e.target.value })}
                    className="mt-1 w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Threshold *</Label>
                <Input
                  value={editingRule.threshold}
                  onChange={(e) => setEditingRule({ ...editingRule, threshold: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setEditingRule(null)} className="rounded-xl">
                Cancel
              </Button>
              <Button 
                onClick={handleUpdate} 
                className="rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Update Rule
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Fingerprint icon component (since lucide might not have it)
const Fingerprint = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4" />
    <path d="M5 19.5C5.5 18 6 15 6 12c0-.7.12-1.37.34-2" />
    <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
    <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
    <path d="M8.65 22c.21-.66.45-1.32.57-2" />
    <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
    <path d="M2 16h.01" />
    <path d="M21.8 16c.2-2 .131-5.354 0-6" />
    <path d="M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 1.17-.02 2" />
  </svg>
);

// Main Component
export default function FraudDetection() {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [stats, setStats] = useState({
    activeAlerts: 3,
    suspendedAccounts: 12,
    riskScore: 87,
    fraudRate: 0.12
  });
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: 'Salary Variance Detected',
      description: 'Employee salary increased by 45% compared to 3-month average',
      entity: 'John Doe - ABC Corp',
      severity: 'high',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      title: 'Device Change + Bank Update',
      description: 'New device registered with simultaneous bank account change',
      entity: 'Jane Smith - XYZ Ltd',
      severity: 'medium',
      timestamp: '5 hours ago'
    },
    {
      id: 3,
      title: 'Cluster Withdrawal Pattern',
      description: '15 employees requested advances within 10-minute window',
      entity: 'Tech Solutions Inc',
      severity: 'medium',
      timestamp: '1 day ago'
    },
  ]);

  // Manual fraud rules state
  const [rules, setRules] = useState([
    {
      id: 1,
      name: 'High Amount Advance',
      description: 'Flag advances exceeding threshold amount',
      type: 'amount_threshold',
      threshold: '>50000 KES',
      severity: 'high',
      enabled: true,
      trigger_count: 12
    },
    {
      id: 2,
      name: 'Rapid Advance Frequency',
      description: 'Multiple advance requests in short period',
      type: 'frequency',
      threshold: '>3 per week',
      severity: 'medium',
      enabled: true,
      trigger_count: 8
    },
    {
      id: 3,
      name: 'Salary Inflation Detection',
      description: 'Salary increase >40% month-over-month',
      type: 'employer_manipulation',
      threshold: '>40% MoM',
      severity: 'high',
      enabled: true,
      trigger_count: 3
    },
    {
      id: 4,
      name: 'EWA Limit Increase Alert',
      description: 'Employer increased EWA limit beyond 60%',
      type: 'employer_manipulation',
      threshold: '>60% limit',
      severity: 'high',
      enabled: true,
      trigger_count: 1
    },
    {
      id: 5,
      name: 'Cooldown Reduction Alert',
      description: 'Employer reduced advance cooldown below 3 days',
      type: 'employer_manipulation',
      threshold: '<3 days',
      severity: 'medium',
      enabled: false,
      trigger_count: 0
    },
  ]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleReviewAlert = (alert) => {
    toast.info(`Opening review for: ${alert.title}`);
  };

  // Manual rules handlers
  const handleToggleRule = (ruleId) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
    toast.success('Rule status updated');
  };

  const handleCreateRule = (newRule) => {
    const rule = {
      ...newRule,
      id: Date.now(),
      trigger_count: 0
    };
    setRules([...rules, rule]);
    toast.success('Rule created successfully');
  };

  const handleEditRule = (updatedRule) => {
    setRules(rules.map(rule => 
      rule.id === updatedRule.id ? updatedRule : rule
    ));
    toast.success('Rule updated successfully');
  };

  const handleDeleteRule = (ruleId) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      setRules(rules.filter(rule => rule.id !== ruleId));
      toast.success('Rule deleted successfully');
    }
  };

  const sections = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'rules', label: 'Manual Rules', icon: Settings },
    { id: 'taxonomy', label: 'Risk Taxonomy', icon: Scale },
    { id: 'scoring', label: 'Risk Scoring', icon: TrendingUp },
    { id: 'triggers', label: 'Suspension Triggers', icon: AlertTriangle },
    { id: 'payroll', label: 'Payroll Controls', icon: FileText },
    { id: 'analytics', label: 'Behavioral Analytics', icon: Activity },
    { id: 'process', label: 'Suspension Process', icon: RefreshCw },
    { id: 'kpis', label: 'KPIs', icon: PieChart },
  ];

  if (loading) {
    return (
      <AdminPortalLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </div>
      </AdminPortalLayout>
    );
  }

  return (
    <AdminPortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              Fraud Prevention & Risk Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Comprehensive fraud detection, risk scoring, and suspension framework
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl" data-testid="download-report-btn">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button className="rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 text-white" data-testid="refresh-data-btn">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-thin">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeSection === section.id
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
              data-testid={`section-${section.id}`}
            >
              <section.icon className="w-4 h-4" />
              {section.label}
            </button>
          ))}
        </div>

        {/* Content based on active section */}
        {activeSection === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                icon={AlertTriangle} 
                title="Active Alerts" 
                value={stats.activeAlerts}
                subtitle="Requires attention"
                color="red"
              />
              <StatCard 
                icon={Ban} 
                title="Suspended Accounts" 
                value={stats.suspendedAccounts}
                subtitle="Under review"
                color="amber"
              />
              <StatCard 
                icon={Shield} 
                title="System Risk Score" 
                value={stats.riskScore}
                subtitle="Low risk"
                color="emerald"
              />
              <StatCard 
                icon={TrendingUp} 
                title="Fraud Loss Ratio" 
                value={`${stats.fraudRate}%`}
                subtitle="Below threshold"
                color="primary"
              />
            </div>

            {/* Active Alerts */}
            <ActiveFraudAlerts alerts={alerts} onReview={handleReviewAlert} />

            {/* Quick Access */}
            <div className="grid lg:grid-cols-2 gap-6">
              <KPIsSection />
              <SuspensionProcessSection />
            </div>
          </div>
        )}

        {activeSection === 'taxonomy' && <RiskTaxonomySection />}
        {activeSection === 'scoring' && <RiskScoringSection />}
        {activeSection === 'triggers' && <SuspensionTriggersSection />}
        {activeSection === 'payroll' && <PayrollIntegritySection />}
        {activeSection === 'analytics' && <BehavioralAnalyticsSection />}
        {activeSection === 'process' && <SuspensionProcessSection />}
        {activeSection === 'kpis' && <KPIsSection />}
      </div>
    </AdminPortalLayout>
  );
}
