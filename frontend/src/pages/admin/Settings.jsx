import React, { useState, useEffect } from 'react';
import { 
  Settings, Building2, Users, Sliders, Bell, Shield, 
  Save, RefreshCw, Search, ChevronDown, ChevronRight,
  DollarSign, Percent, Clock, Calendar, AlertTriangle,
  CheckCircle2, XCircle, Edit, Eye, Lock, Unlock,
  Globe, Database, Mail, Smartphone, FileText, Scale,
  TrendingUp, Activity, Zap, Ban, UserCheck, CreditCard,
  Plus, Trash2, X, Info, HelpCircle, ArrowUpRight
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import AdminPortalLayout from '../../components/admin/AdminLayout';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Slider Component
const RangeSlider = ({ label, min, max, value, onChange, unit = '', step = 1, helpText }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <Label className="text-sm font-medium">{label}</Label>
      <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
        {value}{unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-purple-500"
    />
    <div className="flex justify-between text-xs text-slate-500">
      <span>{min}{unit}</span>
      <span>{max}{unit}</span>
    </div>
    {helpText && <p className="text-xs text-slate-500 dark:text-slate-400">{helpText}</p>}
  </div>
);

// Toggle Component
const Toggle = ({ enabled, onChange, label, description }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
    <div>
      <p className="font-medium text-slate-900 dark:text-white">{label}</p>
      {description && <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'
      }`}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
        enabled ? 'translate-x-[22px]' : 'translate-x-0.5'
      }`} />
    </button>
  </div>
);

// Section Card Component
const SectionCard = ({ title, icon: Icon, children, description }) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-purple-500/5 to-violet-500/5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
          {description && <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>}
        </div>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// Global Settings Tab
const GlobalSettingsTab = ({ settings, onUpdate }) => {
  return (
    <div className="space-y-6">
      {/* EWA Limits */}
      <SectionCard title="EWA Advance Limits" icon={Percent} description="Default limits for all employers and employees">
        <div className="grid md:grid-cols-2 gap-6">
          <RangeSlider
            label="Default Advance Percentage"
            min={10}
            max={80}
            value={settings.defaultAdvancePercent}
            onChange={(v) => onUpdate({ ...settings, defaultAdvancePercent: v })}
            unit="%"
            helpText="Maximum % of earned wages employees can access"
          />
          <RangeSlider
            label="Minimum Advance Amount"
            min={100}
            max={5000}
            value={settings.minAdvanceAmount}
            onChange={(v) => onUpdate({ ...settings, minAdvanceAmount: v })}
            unit=" KES"
            step={100}
            helpText="Minimum amount per advance request"
          />
          <RangeSlider
            label="Maximum Advance Amount"
            min={10000}
            max={500000}
            value={settings.maxAdvanceAmount}
            onChange={(v) => onUpdate({ ...settings, maxAdvanceAmount: v })}
            unit=" KES"
            step={5000}
            helpText="Maximum amount per advance request"
          />
          <RangeSlider
            label="Daily Advance Limit"
            min={1}
            max={10}
            value={settings.dailyAdvanceLimit}
            onChange={(v) => onUpdate({ ...settings, dailyAdvanceLimit: v })}
            unit=" requests"
            helpText="Maximum advances per employee per day"
          />
        </div>
      </SectionCard>

      {/* Fee Structure */}
      <SectionCard title="Fee Structure" icon={DollarSign} description="Platform-wide fee configuration">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900 dark:text-white">Processing Fee Range</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">Minimum Fee</Label>
                <div className="relative mt-1">
                  <Input
                    type="number"
                    step="0.1"
                    value={settings.minProcessingFee}
                    onChange={(e) => onUpdate({ ...settings, minProcessingFee: parseFloat(e.target.value) })}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                </div>
              </div>
              <div>
                <Label className="text-sm">Maximum Fee</Label>
                <div className="relative mt-1">
                  <Input
                    type="number"
                    step="0.1"
                    value={settings.maxProcessingFee}
                    onChange={(e) => onUpdate({ ...settings, maxProcessingFee: parseFloat(e.target.value) })}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500">Processing fee charged per advance (risk-based)</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900 dark:text-white">Transaction Fees</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">Mobile Money Fee</Label>
                <div className="relative mt-1">
                  <Input
                    type="number"
                    step="0.5"
                    value={settings.mobileFee}
                    onChange={(e) => onUpdate({ ...settings, mobileFee: parseFloat(e.target.value) })}
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">KES</span>
                </div>
              </div>
              <div>
                <Label className="text-sm">Bank Transfer Fee</Label>
                <div className="relative mt-1">
                  <Input
                    type="number"
                    step="0.5"
                    value={settings.bankFee}
                    onChange={(e) => onUpdate({ ...settings, bankFee: parseFloat(e.target.value) })}
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">KES</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Cooldown & Frequency */}
      <SectionCard title="Cooldown & Frequency" icon={Clock} description="Time-based restrictions">
        <div className="grid md:grid-cols-2 gap-6">
          <RangeSlider
            label="Default Cooldown Period"
            min={0}
            max={14}
            value={settings.defaultCooldown}
            onChange={(v) => onUpdate({ ...settings, defaultCooldown: v })}
            unit=" days"
            helpText="Wait time between advance requests"
          />
          <RangeSlider
            label="Weekly Advance Limit"
            min={1}
            max={20}
            value={settings.weeklyAdvanceLimit}
            onChange={(v) => onUpdate({ ...settings, weeklyAdvanceLimit: v })}
            unit=" requests"
            helpText="Maximum advances per employee per week"
          />
          <RangeSlider
            label="Monthly Advance Limit"
            min={1}
            max={50}
            value={settings.monthlyAdvanceLimit}
            onChange={(v) => onUpdate({ ...settings, monthlyAdvanceLimit: v })}
            unit=" requests"
            helpText="Maximum advances per employee per month"
          />
          <RangeSlider
            label="New Employee Waiting Period"
            min={0}
            max={90}
            value={settings.newEmployeeWaitDays}
            onChange={(v) => onUpdate({ ...settings, newEmployeeWaitDays: v })}
            unit=" days"
            helpText="Days before new employees can request advances"
          />
        </div>
      </SectionCard>

      {/* Platform Toggles */}
      <SectionCard title="Platform Features" icon={Settings} description="Enable or disable platform features">
        <div className="space-y-3">
          <Toggle
            label="Instant Mobile Money Transfers"
            description="Enable real-time M-Pesa/Airtel Money disbursements"
            enabled={settings.instantMobileEnabled}
            onChange={(v) => onUpdate({ ...settings, instantMobileEnabled: v })}
          />
          <Toggle
            label="Bank Transfers"
            description="Allow advances to bank accounts"
            enabled={settings.bankTransfersEnabled}
            onChange={(v) => onUpdate({ ...settings, bankTransfersEnabled: v })}
          />
          <Toggle
            label="Auto-Approval for Low Risk"
            description="Automatically approve advances for low-risk employees"
            enabled={settings.autoApprovalEnabled}
            onChange={(v) => onUpdate({ ...settings, autoApprovalEnabled: v })}
          />
          <Toggle
            label="Weekend Advances"
            description="Allow advance requests on weekends"
            enabled={settings.weekendAdvancesEnabled}
            onChange={(v) => onUpdate({ ...settings, weekendAdvancesEnabled: v })}
          />
        </div>
      </SectionCard>
    </div>
  );
};

// Employer Configuration Tab
const EmployerConfigTab = ({ employers, onSelectEmployer, selectedEmployer, employerSettings, onUpdateEmployer }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredEmployers = employers.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Employer List */}
      <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-900 dark:text-white mb-3">Select Employer</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search employers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="max-h-[500px] overflow-y-auto">
          {filteredEmployers.map((employer) => (
            <button
              key={employer.id}
              onClick={() => onSelectEmployer(employer)}
              className={`w-full p-4 text-left border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                selectedEmployer?.id === employer.id ? 'bg-purple-50 dark:bg-purple-500/10 border-l-4 border-l-purple-500' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold">
                  {employer.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 dark:text-white truncate">{employer.name}</p>
                  <p className="text-xs text-slate-500">{employer.code} • {employer.employeeCount} employees</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  employer.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                  'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                }`}>
                  {employer.status}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Employer Settings */}
      <div className="lg:col-span-2 space-y-6">
        {selectedEmployer ? (
          <>
            {/* Employer Header */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                    {selectedEmployer.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedEmployer.name}</h2>
                    <p className="text-slate-500">Code: {selectedEmployer.code} • {selectedEmployer.employeeCount} employees</p>
                  </div>
                </div>
                <span className={`px-3 py-1.5 text-sm font-semibold rounded-full ${
                  selectedEmployer.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {selectedEmployer.status.charAt(0).toUpperCase() + selectedEmployer.status.slice(1)}
                </span>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{employerSettings.advanceLimit}%</p>
                  <p className="text-xs text-slate-500">Advance Limit</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{employerSettings.cooldownDays}d</p>
                  <p className="text-xs text-slate-500">Cooldown</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{employerSettings.processingFee}%</p>
                  <p className="text-xs text-slate-500">Fee Rate</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{employerSettings.riskScore}</p>
                  <p className="text-xs text-slate-500">Risk Score</p>
                </div>
              </div>
            </div>

            {/* EWA Settings */}
            <SectionCard title="EWA Configuration" icon={Sliders} description="Custom settings for this employer">
              <div className="grid md:grid-cols-2 gap-6">
                <RangeSlider
                  label="Advance Percentage Limit"
                  min={10}
                  max={80}
                  value={employerSettings.advanceLimit}
                  onChange={(v) => onUpdateEmployer({ ...employerSettings, advanceLimit: v })}
                  unit="%"
                />
                <RangeSlider
                  label="Cooldown Period"
                  min={0}
                  max={14}
                  value={employerSettings.cooldownDays}
                  onChange={(v) => onUpdateEmployer({ ...employerSettings, cooldownDays: v })}
                  unit=" days"
                />
                <RangeSlider
                  label="Processing Fee"
                  min={2}
                  max={8}
                  step={0.5}
                  value={employerSettings.processingFee}
                  onChange={(v) => onUpdateEmployer({ ...employerSettings, processingFee: v })}
                  unit="%"
                />
                <RangeSlider
                  label="Max Monthly Advances"
                  min={1}
                  max={30}
                  value={employerSettings.maxMonthlyAdvances}
                  onChange={(v) => onUpdateEmployer({ ...employerSettings, maxMonthlyAdvances: v })}
                  unit=" requests"
                />
              </div>
            </SectionCard>

            {/* Funding & Risk */}
            <SectionCard title="Funding & Risk Settings" icon={Shield} description="Financial controls">
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Funding Model</Label>
                    <select
                      value={employerSettings.fundingModel}
                      onChange={(e) => onUpdateEmployer({ ...employerSettings, fundingModel: e.target.value })}
                      className="mt-1 w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                    >
                      <option value="prefunded">Prefunded Wallet</option>
                      <option value="debit_order">Debit Order</option>
                      <option value="invoice">Monthly Invoice</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Risk Tier</Label>
                    <select
                      value={employerSettings.riskTier}
                      onChange={(e) => onUpdateEmployer({ ...employerSettings, riskTier: e.target.value })}
                      className="mt-1 w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                    >
                      <option value="low">Low Risk</option>
                      <option value="medium">Medium Risk</option>
                      <option value="high">High Risk</option>
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Funding Buffer Required</Label>
                    <div className="relative mt-1">
                      <Input
                        type="number"
                        value={employerSettings.fundingBuffer}
                        onChange={(e) => onUpdateEmployer({ ...employerSettings, fundingBuffer: parseInt(e.target.value) })}
                        className="pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Credit Limit (KES)</Label>
                    <Input
                      type="number"
                      value={employerSettings.creditLimit}
                      onChange={(e) => onUpdateEmployer({ ...employerSettings, creditLimit: parseInt(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Toggles */}
            <SectionCard title="Feature Access" icon={Lock} description="Enable/disable features for this employer">
              <div className="space-y-3">
                <Toggle
                  label="EWA Service Active"
                  description="Master switch for EWA access"
                  enabled={employerSettings.ewaEnabled}
                  onChange={(v) => onUpdateEmployer({ ...employerSettings, ewaEnabled: v })}
                />
                <Toggle
                  label="Allow Instant Transfers"
                  description="Real-time mobile money disbursements"
                  enabled={employerSettings.instantEnabled}
                  onChange={(v) => onUpdateEmployer({ ...employerSettings, instantEnabled: v })}
                />
                <Toggle
                  label="Auto-Approve Low Risk Employees"
                  description="Skip manual review for low-risk advances"
                  enabled={employerSettings.autoApprove}
                  onChange={(v) => onUpdateEmployer({ ...employerSettings, autoApprove: v })}
                />
                <Toggle
                  label="Weekend Access"
                  description="Allow advances on weekends"
                  enabled={employerSettings.weekendAccess}
                  onChange={(v) => onUpdateEmployer({ ...employerSettings, weekendAccess: v })}
                />
              </div>
            </SectionCard>
          </>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <Building2 className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Select an Employer</h3>
            <p className="text-slate-500">Choose an employer from the list to configure their EWA settings</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Employee Configuration Tab
const EmployeeConfigTab = ({ employees, onSelectEmployee, selectedEmployee, employeeSettings, onUpdateEmployee }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Employee List */}
      <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-900 dark:text-white mb-3">Select Employee</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="max-h-[500px] overflow-y-auto">
          {filteredEmployees.map((employee) => (
            <button
              key={employee.id}
              onClick={() => onSelectEmployee(employee)}
              className={`w-full p-4 text-left border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                selectedEmployee?.id === employee.id ? 'bg-purple-50 dark:bg-purple-500/10 border-l-4 border-l-purple-500' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  {employee.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 dark:text-white truncate">{employee.name}</p>
                  <p className="text-xs text-slate-500 truncate">{employee.employer}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  employee.riskLevel === 'low' ? 'bg-emerald-100 text-emerald-700' :
                  employee.riskLevel === 'medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {employee.riskLevel}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Employee Settings */}
      <div className="lg:col-span-2 space-y-6">
        {selectedEmployee ? (
          <>
            {/* Employee Header */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {selectedEmployee.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedEmployee.name}</h2>
                    <p className="text-slate-500">{selectedEmployee.email}</p>
                    <p className="text-sm text-slate-400">{selectedEmployee.employer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1.5 text-sm font-semibold rounded-full ${
                    selectedEmployee.riskLevel === 'low' ? 'bg-emerald-100 text-emerald-700' :
                    selectedEmployee.riskLevel === 'medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {selectedEmployee.riskLevel.charAt(0).toUpperCase() + selectedEmployee.riskLevel.slice(1)} Risk
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{employeeSettings.advanceLimit}%</p>
                  <p className="text-xs text-slate-500">Limit</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{employeeSettings.riskScore}</p>
                  <p className="text-xs text-slate-500">Risk Score</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{selectedEmployee.totalAdvances}</p>
                  <p className="text-xs text-slate-500">Advances</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{selectedEmployee.repaymentRate}%</p>
                  <p className="text-xs text-slate-500">Repayment</p>
                </div>
              </div>
            </div>

            {/* Individual Settings */}
            <SectionCard title="Individual EWA Settings" icon={Sliders} description="Override default settings for this employee">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Toggle
                    label="Use Custom Settings"
                    description="Override employer defaults"
                    enabled={employeeSettings.useCustomSettings}
                    onChange={(v) => onUpdateEmployee({ ...employeeSettings, useCustomSettings: v })}
                  />
                </div>
              </div>
              {employeeSettings.useCustomSettings && (
                <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <RangeSlider
                    label="Custom Advance Limit"
                    min={10}
                    max={80}
                    value={employeeSettings.advanceLimit}
                    onChange={(v) => onUpdateEmployee({ ...employeeSettings, advanceLimit: v })}
                    unit="%"
                  />
                  <RangeSlider
                    label="Custom Cooldown"
                    min={0}
                    max={14}
                    value={employeeSettings.cooldownDays}
                    onChange={(v) => onUpdateEmployee({ ...employeeSettings, cooldownDays: v })}
                    unit=" days"
                  />
                  <RangeSlider
                    label="Max Monthly Advances"
                    min={1}
                    max={30}
                    value={employeeSettings.maxMonthlyAdvances}
                    onChange={(v) => onUpdateEmployee({ ...employeeSettings, maxMonthlyAdvances: v })}
                    unit=" requests"
                  />
                  <RangeSlider
                    label="Custom Fee Rate"
                    min={2}
                    max={8}
                    step={0.5}
                    value={employeeSettings.feeRate}
                    onChange={(v) => onUpdateEmployee({ ...employeeSettings, feeRate: v })}
                    unit="%"
                  />
                </div>
              )}
            </SectionCard>

            {/* Access & Restrictions */}
            <SectionCard title="Access & Restrictions" icon={Shield} description="Control employee access">
              <div className="space-y-3">
                <Toggle
                  label="EWA Access Enabled"
                  description="Allow this employee to request advances"
                  enabled={employeeSettings.ewaEnabled}
                  onChange={(v) => onUpdateEmployee({ ...employeeSettings, ewaEnabled: v })}
                />
                <Toggle
                  label="VIP Status"
                  description="Priority processing and higher limits"
                  enabled={employeeSettings.vipStatus}
                  onChange={(v) => onUpdateEmployee({ ...employeeSettings, vipStatus: v })}
                />
                <Toggle
                  label="Require Manual Approval"
                  description="All advances need admin approval"
                  enabled={employeeSettings.manualApproval}
                  onChange={(v) => onUpdateEmployee({ ...employeeSettings, manualApproval: v })}
                />
                <Toggle
                  label="Watchlist"
                  description="Flag for enhanced monitoring"
                  enabled={employeeSettings.onWatchlist}
                  onChange={(v) => onUpdateEmployee({ ...employeeSettings, onWatchlist: v })}
                />
              </div>
            </SectionCard>

            {/* Notes */}
            <SectionCard title="Admin Notes" icon={FileText} description="Internal notes about this employee">
              <textarea
                value={employeeSettings.adminNotes}
                onChange={(e) => onUpdateEmployee({ ...employeeSettings, adminNotes: e.target.value })}
                placeholder="Add notes about this employee..."
                className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm resize-none"
              />
            </SectionCard>
          </>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <Users className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Select an Employee</h3>
            <p className="text-slate-500">Choose an employee from the list to configure their individual settings</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Risk & Compliance Tab
const RiskComplianceTab = ({ riskSettings, onUpdate }) => {
  return (
    <div className="space-y-6">
      {/* Risk Thresholds */}
      <SectionCard title="Risk Score Thresholds" icon={TrendingUp} description="Define risk level boundaries">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900 dark:text-white">Employer Risk Bands</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Low Risk</span>
                <Input
                  type="number"
                  value={riskSettings.employerLowThreshold}
                  onChange={(e) => onUpdate({ ...riskSettings, employerLowThreshold: parseInt(e.target.value) })}
                  className="w-24 text-center"
                />
                <span className="text-sm text-slate-500">- 100</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-500/10 rounded-lg">
                <span className="text-sm font-medium text-amber-700 dark:text-amber-400">Medium Risk</span>
                <Input
                  type="number"
                  value={riskSettings.employerMediumThreshold}
                  onChange={(e) => onUpdate({ ...riskSettings, employerMediumThreshold: parseInt(e.target.value) })}
                  className="w-24 text-center"
                />
                <span className="text-sm text-slate-500">- {riskSettings.employerLowThreshold - 1}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-500/10 rounded-lg">
                <span className="text-sm font-medium text-red-700 dark:text-red-400">High Risk</span>
                <span className="text-sm text-slate-500">0</span>
                <span className="text-sm text-slate-500">- {riskSettings.employerMediumThreshold - 1}</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900 dark:text-white">Employee Risk Bands</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Low Risk</span>
                <Input
                  type="number"
                  value={riskSettings.employeeLowThreshold}
                  onChange={(e) => onUpdate({ ...riskSettings, employeeLowThreshold: parseInt(e.target.value) })}
                  className="w-24 text-center"
                />
                <span className="text-sm text-slate-500">- 100</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-500/10 rounded-lg">
                <span className="text-sm font-medium text-amber-700 dark:text-amber-400">Medium Risk</span>
                <Input
                  type="number"
                  value={riskSettings.employeeMediumThreshold}
                  onChange={(e) => onUpdate({ ...riskSettings, employeeMediumThreshold: parseInt(e.target.value) })}
                  className="w-24 text-center"
                />
                <span className="text-sm text-slate-500">- {riskSettings.employeeLowThreshold - 1}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-500/10 rounded-lg">
                <span className="text-sm font-medium text-red-700 dark:text-red-400">High Risk</span>
                <span className="text-sm text-slate-500">0</span>
                <span className="text-sm text-slate-500">- {riskSettings.employeeMediumThreshold - 1}</span>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Auto-Actions */}
      <SectionCard title="Automatic Actions" icon={Zap} description="Configure automatic risk responses">
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Auto-suspend at risk score below</Label>
              <Input
                type="number"
                value={riskSettings.autoSuspendThreshold}
                onChange={(e) => onUpdate({ ...riskSettings, autoSuspendThreshold: parseInt(e.target.value) })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Reduce limits at risk score below</Label>
              <Input
                type="number"
                value={riskSettings.reduceLimitsThreshold}
                onChange={(e) => onUpdate({ ...riskSettings, reduceLimitsThreshold: parseInt(e.target.value) })}
                className="mt-1"
              />
            </div>
          </div>
          <div className="space-y-3">
            <Toggle
              label="Auto-suspend on fraud alert"
              description="Immediately suspend when fraud detected"
              enabled={riskSettings.autoSuspendOnFraud}
              onChange={(v) => onUpdate({ ...riskSettings, autoSuspendOnFraud: v })}
            />
            <Toggle
              label="Auto-reduce limits on warning"
              description="Reduce advance limits when warnings triggered"
              enabled={riskSettings.autoReduceOnWarning}
              onChange={(v) => onUpdate({ ...riskSettings, autoReduceOnWarning: v })}
            />
            <Toggle
              label="Notify admin on high-risk activity"
              description="Send alerts for suspicious activity"
              enabled={riskSettings.notifyOnHighRisk}
              onChange={(v) => onUpdate({ ...riskSettings, notifyOnHighRisk: v })}
            />
          </div>
        </div>
      </SectionCard>

      {/* Verification Requirements */}
      <SectionCard title="Verification Requirements" icon={UserCheck} description="KYC and verification settings">
        <div className="space-y-4">
          <Toggle
            label="Require ID Verification"
            description="National ID or Passport verification required"
            enabled={riskSettings.requireIdVerification}
            onChange={(v) => onUpdate({ ...riskSettings, requireIdVerification: v })}
          />
          <Toggle
            label="Require Face ID"
            description="Biometric face verification required"
            enabled={riskSettings.requireFaceId}
            onChange={(v) => onUpdate({ ...riskSettings, requireFaceId: v })}
          />
          <Toggle
            label="Require Address Proof"
            description="Proof of address document required"
            enabled={riskSettings.requireAddressProof}
            onChange={(v) => onUpdate({ ...riskSettings, requireAddressProof: v })}
          />
          <Toggle
            label="Require Employment Contract"
            description="Employment contract upload required"
            enabled={riskSettings.requireEmploymentContract}
            onChange={(v) => onUpdate({ ...riskSettings, requireEmploymentContract: v })}
          />
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <Label className="text-sm font-medium">Re-verification Frequency</Label>
            <select
              value={riskSettings.reverificationFrequency}
              onChange={(e) => onUpdate({ ...riskSettings, reverificationFrequency: e.target.value })}
              className="mt-1 w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="biannually">Bi-annually</option>
              <option value="annually">Annually</option>
              <option value="never">Never</option>
            </select>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

// Notification Settings Tab
const NotificationSettingsTab = ({ notificationSettings, onUpdate }) => {
  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <SectionCard title="Email Notifications" icon={Mail} description="Configure email alert settings">
        <div className="space-y-3">
          <Toggle
            label="New Employer Registration"
            description="Alert when new employer signs up"
            enabled={notificationSettings.emailNewEmployer}
            onChange={(v) => onUpdate({ ...notificationSettings, emailNewEmployer: v })}
          />
          <Toggle
            label="Large Advance Requests"
            description="Alert for advances above threshold"
            enabled={notificationSettings.emailLargeAdvance}
            onChange={(v) => onUpdate({ ...notificationSettings, emailLargeAdvance: v })}
          />
          <Toggle
            label="Fraud Alerts"
            description="Immediate notification on fraud detection"
            enabled={notificationSettings.emailFraudAlert}
            onChange={(v) => onUpdate({ ...notificationSettings, emailFraudAlert: v })}
          />
          <Toggle
            label="Daily Summary Report"
            description="Daily digest of platform activity"
            enabled={notificationSettings.emailDailySummary}
            onChange={(v) => onUpdate({ ...notificationSettings, emailDailySummary: v })}
          />
          <Toggle
            label="Weekly Analytics Report"
            description="Weekly performance metrics"
            enabled={notificationSettings.emailWeeklyReport}
            onChange={(v) => onUpdate({ ...notificationSettings, emailWeeklyReport: v })}
          />
        </div>
      </SectionCard>

      {/* SMS Notifications */}
      <SectionCard title="SMS Notifications" icon={Smartphone} description="Configure SMS alert settings">
        <div className="space-y-3">
          <Toggle
            label="Critical Fraud Alerts"
            description="SMS for high-priority fraud cases"
            enabled={notificationSettings.smsFraudAlert}
            onChange={(v) => onUpdate({ ...notificationSettings, smsFraudAlert: v })}
          />
          <Toggle
            label="System Downtime Alerts"
            description="SMS when system issues detected"
            enabled={notificationSettings.smsSystemAlert}
            onChange={(v) => onUpdate({ ...notificationSettings, smsSystemAlert: v })}
          />
          <Toggle
            label="Large Transaction Alerts"
            description="SMS for transactions above threshold"
            enabled={notificationSettings.smsLargeTransaction}
            onChange={(v) => onUpdate({ ...notificationSettings, smsLargeTransaction: v })}
          />
        </div>
      </SectionCard>

      {/* Alert Thresholds */}
      <SectionCard title="Alert Thresholds" icon={AlertTriangle} description="Define when alerts are triggered">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label className="text-sm font-medium">Large Advance Threshold (KES)</Label>
            <Input
              type="number"
              value={notificationSettings.largeAdvanceThreshold}
              onChange={(e) => onUpdate({ ...notificationSettings, largeAdvanceThreshold: parseInt(e.target.value) })}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Daily Volume Alert Threshold (KES)</Label>
            <Input
              type="number"
              value={notificationSettings.dailyVolumeThreshold}
              onChange={(e) => onUpdate({ ...notificationSettings, dailyVolumeThreshold: parseInt(e.target.value) })}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Fraud Alert Email Recipients</Label>
            <Input
              type="email"
              value={notificationSettings.fraudAlertEmails}
              onChange={(e) => onUpdate({ ...notificationSettings, fraudAlertEmails: e.target.value })}
              placeholder="email1@example.com, email2@example.com"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Admin SMS Numbers</Label>
            <Input
              type="text"
              value={notificationSettings.adminSmsNumbers}
              onChange={(e) => onUpdate({ ...notificationSettings, adminSmsNumbers: e.target.value })}
              placeholder="+254700000000, +254711111111"
              className="mt-1"
            />
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

// Main Component
export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('global');
  const [hasChanges, setHasChanges] = useState(false);

  // Global Settings State
  const [globalSettings, setGlobalSettings] = useState({
    defaultAdvancePercent: 60,
    minAdvanceAmount: 500,
    maxAdvanceAmount: 100000,
    dailyAdvanceLimit: 3,
    minProcessingFee: 3.5,
    maxProcessingFee: 6.0,
    mobileFee: 50,
    bankFee: 100,
    defaultCooldown: 3,
    weeklyAdvanceLimit: 5,
    monthlyAdvanceLimit: 15,
    newEmployeeWaitDays: 30,
    instantMobileEnabled: true,
    bankTransfersEnabled: true,
    autoApprovalEnabled: true,
    weekendAdvancesEnabled: false,
  });

  // Employer State
  const [employers] = useState([
    { id: 1, name: 'Safaricom PLC', code: 'SAF001', employeeCount: 1250, status: 'active' },
    { id: 2, name: 'Kenya Airways', code: 'KQ002', employeeCount: 890, status: 'active' },
    { id: 3, name: 'Equity Bank', code: 'EQB003', employeeCount: 2100, status: 'active' },
    { id: 4, name: 'Nation Media Group', code: 'NMG004', employeeCount: 450, status: 'suspended' },
    { id: 5, name: 'KPLC', code: 'KPC005', employeeCount: 1800, status: 'active' },
  ]);
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [employerSettings, setEmployerSettings] = useState({
    advanceLimit: 60,
    cooldownDays: 3,
    processingFee: 4.5,
    maxMonthlyAdvances: 10,
    fundingModel: 'prefunded',
    riskTier: 'low',
    fundingBuffer: 20,
    creditLimit: 5000000,
    riskScore: 85,
    ewaEnabled: true,
    instantEnabled: true,
    autoApprove: true,
    weekendAccess: false,
  });

  // Employee State
  const [employees] = useState([
    { id: 1, name: 'John Kamau', email: 'john.kamau@safaricom.co.ke', employer: 'Safaricom PLC', riskLevel: 'low', totalAdvances: 12, repaymentRate: 100 },
    { id: 2, name: 'Mary Wanjiku', email: 'mary.w@kq.co.ke', employer: 'Kenya Airways', riskLevel: 'low', totalAdvances: 8, repaymentRate: 100 },
    { id: 3, name: 'Peter Ochieng', email: 'peter.o@equity.co.ke', employer: 'Equity Bank', riskLevel: 'medium', totalAdvances: 24, repaymentRate: 95 },
    { id: 4, name: 'Grace Muthoni', email: 'grace.m@nation.co.ke', employer: 'Nation Media Group', riskLevel: 'high', totalAdvances: 45, repaymentRate: 78 },
    { id: 5, name: 'David Kipchoge', email: 'david.k@kplc.co.ke', employer: 'KPLC', riskLevel: 'low', totalAdvances: 5, repaymentRate: 100 },
  ]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeSettings, setEmployeeSettings] = useState({
    useCustomSettings: false,
    advanceLimit: 60,
    cooldownDays: 3,
    maxMonthlyAdvances: 10,
    feeRate: 4.5,
    riskScore: 85,
    ewaEnabled: true,
    vipStatus: false,
    manualApproval: false,
    onWatchlist: false,
    adminNotes: '',
  });

  // Risk Settings State
  const [riskSettings, setRiskSettings] = useState({
    employerLowThreshold: 80,
    employerMediumThreshold: 60,
    employeeLowThreshold: 80,
    employeeMediumThreshold: 60,
    autoSuspendThreshold: 40,
    reduceLimitsThreshold: 60,
    autoSuspendOnFraud: true,
    autoReduceOnWarning: true,
    notifyOnHighRisk: true,
    requireIdVerification: true,
    requireFaceId: true,
    requireAddressProof: true,
    requireEmploymentContract: true,
    reverificationFrequency: 'biannually',
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNewEmployer: true,
    emailLargeAdvance: true,
    emailFraudAlert: true,
    emailDailySummary: true,
    emailWeeklyReport: true,
    smsFraudAlert: true,
    smsSystemAlert: true,
    smsLargeTransaction: false,
    largeAdvanceThreshold: 50000,
    dailyVolumeThreshold: 1000000,
    fraudAlertEmails: 'admin@eaziwage.com',
    adminSmsNumbers: '+254700000000',
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Settings saved successfully');
      setHasChanges(false);
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'global', label: 'Global Settings', icon: Globe },
    { id: 'employer', label: 'Employer Config', icon: Building2 },
    { id: 'employee', label: 'Employee Config', icon: Users },
    { id: 'risk', label: 'Risk & Compliance', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
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
                <Settings className="w-5 h-5 text-white" />
              </div>
              Admin Settings
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Configure EWA platform settings, employer rules, and compliance requirements
            </p>
          </div>
          <div className="flex items-center gap-3">
            {hasChanges && (
              <span className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                Unsaved changes
              </span>
            )}
            <Button 
              onClick={handleSaveAll}
              disabled={saving}
              className="rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 text-white"
              data-testid="save-settings-btn"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save All Settings
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-thin">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
              data-testid={`tab-${tab.id}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'global' && (
          <GlobalSettingsTab 
            settings={globalSettings} 
            onUpdate={(s) => { setGlobalSettings(s); setHasChanges(true); }} 
          />
        )}
        {activeTab === 'employer' && (
          <EmployerConfigTab
            employers={employers}
            selectedEmployer={selectedEmployer}
            onSelectEmployer={setSelectedEmployer}
            employerSettings={employerSettings}
            onUpdateEmployer={(s) => { setEmployerSettings(s); setHasChanges(true); }}
          />
        )}
        {activeTab === 'employee' && (
          <EmployeeConfigTab
            employees={employees}
            selectedEmployee={selectedEmployee}
            onSelectEmployee={setSelectedEmployee}
            employeeSettings={employeeSettings}
            onUpdateEmployee={(s) => { setEmployeeSettings(s); setHasChanges(true); }}
          />
        )}
        {activeTab === 'risk' && (
          <RiskComplianceTab
            riskSettings={riskSettings}
            onUpdate={(s) => { setRiskSettings(s); setHasChanges(true); }}
          />
        )}
        {activeTab === 'notifications' && (
          <NotificationSettingsTab
            notificationSettings={notificationSettings}
            onUpdate={(s) => { setNotificationSettings(s); setHasChanges(true); }}
          />
        )}
      </div>
    </AdminPortalLayout>
  );
}
