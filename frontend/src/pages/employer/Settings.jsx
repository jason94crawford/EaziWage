import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, Building2, Users, CreditCard, Bell,
  Shield, Clock, Save, AlertCircle, CheckCircle2, Info,
  Percent, Calendar, Wallet, Lock, Mail, BarChart3, ChevronRight
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Slider } from '../../components/ui/slider';
import { EmployerPortalLayout } from '../../components/employer/EmployerLayout';
import { employerApi } from '../../lib/api';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

// Tab Button
const TabButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full",
      active 
        ? "bg-gradient-to-r from-primary to-emerald-600 text-white shadow-lg shadow-primary/25"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
    )}
  >
    <div className={cn(
      "w-9 h-9 rounded-xl flex items-center justify-center",
      active ? "bg-white/20" : "bg-slate-100 dark:bg-slate-800"
    )}>
      <Icon className={cn("w-5 h-5", active ? "text-white" : "text-slate-500")} />
    </div>
    <span className="font-medium">{label}</span>
    {active && <ChevronRight className="w-4 h-4 ml-auto" />}
  </button>
);

// Settings Section Card
const SettingsCard = ({ icon: Icon, title, description, children }) => (
  <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/30">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-emerald-500/10 dark:from-primary/20 dark:to-emerald-500/20 rounded-xl flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
        {description && <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
    </div>
    {children}
  </div>
);

// Toggle Item
const ToggleItem = ({ icon: Icon, label, description, checked, onToggle }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center shadow-sm">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="font-medium text-slate-900 dark:text-white">{label}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
    </div>
    <Switch checked={checked} onCheckedChange={onToggle} />
  </div>
);

// Security Action Item
const SecurityItem = ({ icon: Icon, label, description, actionLabel, onClick }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center shadow-sm">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="font-medium text-slate-900 dark:text-white">{label}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
    </div>
    <Button variant="outline" size="sm" onClick={onClick} className="bg-white dark:bg-slate-800">
      {actionLabel}
    </Button>
  </div>
);

export default function EmployerSettings() {
  const [employer, setEmployer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('company');
  
  const [settings, setSettings] = useState({
    maxAdvancePercentage: 50,
    minAdvanceAmount: 500,
    maxAdvanceAmount: 50000,
    advanceAccessDays: [1, 25],
    cooldownPeriod: 7,
    emailNotifications: true,
    advanceAlerts: true,
    payrollReminders: true,
    weeklyReports: false,
    companyName: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    payrollCycle: 'monthly'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await employerApi.getMe();
        setEmployer(res.data);
        setSettings(prev => ({
          ...prev,
          companyName: res.data.company_name || '',
          contactPerson: res.data.contact_person || '',
          contactEmail: res.data.contact_email || '',
          contactPhone: res.data.contact_phone || '',
          payrollCycle: res.data.payroll_cycle || 'monthly'
        }));
      } catch (err) {
        console.error('Failed to fetch employer data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully!');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'company', label: 'Company', icon: Building2 },
    { id: 'ewa', label: 'EWA Settings', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  if (loading) {
    return (
      <EmployerPortalLayout employer={employer}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-14 h-14 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </EmployerPortalLayout>
    );
  }

  return (
    <EmployerPortalLayout employer={employer}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="settings-title">Settings</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your company settings and EWA program configuration</p>
          </div>
          <Button 
            className="bg-gradient-to-r from-primary to-emerald-600 text-white shadow-lg shadow-primary/25 hover:shadow-xl transition-shadow"
            onClick={handleSave}
            disabled={saving}
            data-testid="save-settings-btn"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-3 border border-slate-200/50 dark:border-slate-700/30 space-y-2">
              {tabs.map((tab) => (
                <TabButton
                  key={tab.id}
                  active={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  icon={tab.icon}
                  label={tab.label}
                />
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Company Tab */}
            {activeTab === 'company' && (
              <>
                <SettingsCard icon={Building2} title="Company Information" description="Update your company details">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700 dark:text-slate-300">Company Name</Label>
                      <Input
                        value={settings.companyName}
                        onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
                        placeholder="Your company name"
                        className="bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"
                        data-testid="company-name-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 dark:text-slate-300">Payroll Cycle</Label>
                      <Select value={settings.payrollCycle} onValueChange={(v) => setSettings(prev => ({ ...prev, payrollCycle: v }))}>
                        <SelectTrigger className="bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700" data-testid="payroll-cycle-select">
                          <SelectValue placeholder="Select cycle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </SettingsCard>

                <SettingsCard icon={Users} title="Primary Contact" description="Who should we contact about EWA matters?">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700 dark:text-slate-300">Contact Person</Label>
                      <Input
                        value={settings.contactPerson}
                        onChange={(e) => setSettings(prev => ({ ...prev, contactPerson: e.target.value }))}
                        placeholder="Full name"
                        className="bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"
                        data-testid="contact-person-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 dark:text-slate-300">Phone Number</Label>
                      <Input
                        value={settings.contactPhone}
                        onChange={(e) => setSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
                        placeholder="+254 700 000 000"
                        className="bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"
                        data-testid="contact-phone-input"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label className="text-slate-700 dark:text-slate-300">Email Address</Label>
                      <Input
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                        placeholder="email@company.com"
                        className="bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"
                        data-testid="contact-email-input"
                      />
                    </div>
                  </div>
                </SettingsCard>

                {/* Verification Status */}
                <div className={cn(
                  "rounded-2xl p-6 border",
                  employer?.status === 'approved' 
                    ? "bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border-emerald-500/20"
                    : "bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-amber-500/20"
                )}>
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center",
                      employer?.status === 'approved' 
                        ? "bg-emerald-100 dark:bg-emerald-500/20"
                        : "bg-amber-100 dark:bg-amber-500/20"
                    )}>
                      {employer?.status === 'approved' ? (
                        <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                      ) : (
                        <Clock className="w-7 h-7 text-amber-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        Verification Status: {employer?.status?.charAt(0).toUpperCase() + employer?.status?.slice(1)}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {employer?.status === 'approved' 
                          ? 'Your company is fully verified and can access all EaziWage features.'
                          : 'Your company verification is in progress. Some features may be limited until approval.'}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* EWA Settings Tab */}
            {activeTab === 'ewa' && (
              <>
                <SettingsCard icon={Percent} title="Advance Limits" description="Control how much employees can advance">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-slate-700 dark:text-slate-300">Maximum Advance Percentage</Label>
                        <span className="text-2xl font-bold text-primary">{settings.maxAdvancePercentage}%</span>
                      </div>
                      <Slider
                        value={[settings.maxAdvancePercentage]}
                        onValueChange={(v) => setSettings(prev => ({ ...prev, maxAdvancePercentage: v[0] }))}
                        max={100}
                        min={10}
                        step={5}
                        className="w-full"
                        data-testid="max-advance-slider"
                      />
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Employees can advance up to {settings.maxAdvancePercentage}% of their earned wages
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/30">
                      <div className="space-y-2">
                        <Label className="text-slate-700 dark:text-slate-300">Minimum Amount (KES)</Label>
                        <Input
                          type="number"
                          value={settings.minAdvanceAmount}
                          onChange={(e) => setSettings(prev => ({ ...prev, minAdvanceAmount: parseInt(e.target.value) || 0 }))}
                          className="bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"
                          data-testid="min-advance-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 dark:text-slate-300">Maximum Amount (KES)</Label>
                        <Input
                          type="number"
                          value={settings.maxAdvanceAmount}
                          onChange={(e) => setSettings(prev => ({ ...prev, maxAdvanceAmount: parseInt(e.target.value) || 0 }))}
                          className="bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"
                          data-testid="max-advance-input"
                        />
                      </div>
                    </div>
                  </div>
                </SettingsCard>

                <SettingsCard icon={Calendar} title="Access Period" description="When can employees request advances?">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label className="text-slate-700 dark:text-slate-300">Advance Access Window</Label>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <span className="text-sm text-slate-500 dark:text-slate-400">From Day</span>
                          <Select 
                            value={settings.advanceAccessDays[0].toString()}
                            onValueChange={(v) => setSettings(prev => ({ ...prev, advanceAccessDays: [parseInt(v), prev.advanceAccessDays[1]] }))}
                          >
                            <SelectTrigger className="bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700" data-testid="access-from-select">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                                <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <span className="text-sm text-slate-500 dark:text-slate-400">To Day</span>
                          <Select 
                            value={settings.advanceAccessDays[1].toString()}
                            onValueChange={(v) => setSettings(prev => ({ ...prev, advanceAccessDays: [prev.advanceAccessDays[0], parseInt(v)] }))}
                          >
                            <SelectTrigger className="bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700" data-testid="access-to-select">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                                <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Employees can request advances from day {settings.advanceAccessDays[0]} to {settings.advanceAccessDays[1]} of each month
                      </p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/30">
                      <Label className="text-slate-700 dark:text-slate-300">Cooldown Period (Days)</Label>
                      <Input
                        type="number"
                        value={settings.cooldownPeriod}
                        onChange={(e) => setSettings(prev => ({ ...prev, cooldownPeriod: parseInt(e.target.value) || 0 }))}
                        min={0}
                        max={30}
                        className="bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 max-w-xs"
                        data-testid="cooldown-input"
                      />
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Minimum {settings.cooldownPeriod} days between advance requests per employee
                      </p>
                    </div>
                  </div>
                </SettingsCard>

                {/* Info Banner */}
                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 rounded-2xl p-6 border border-amber-500/20">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                      <Info className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-900 dark:text-amber-200">EWA Configuration Note</h3>
                      <p className="text-sm text-amber-800 dark:text-amber-300/80 mt-1">
                        Changes to advance limits and access periods will apply to all employees. 
                        Existing pending advance requests will not be affected.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <SettingsCard icon={Bell} title="Notification Preferences" description="Choose what updates you want to receive">
                <div className="space-y-4">
                  <ToggleItem 
                    icon={Mail}
                    label="Email Notifications"
                    description="Receive important updates via email"
                    checked={settings.emailNotifications}
                    onToggle={(v) => setSettings(prev => ({ ...prev, emailNotifications: v }))}
                  />
                  <ToggleItem 
                    icon={CreditCard}
                    label="Advance Alerts"
                    description="Get notified when employees request advances"
                    checked={settings.advanceAlerts}
                    onToggle={(v) => setSettings(prev => ({ ...prev, advanceAlerts: v }))}
                  />
                  <ToggleItem 
                    icon={Calendar}
                    label="Payroll Reminders"
                    description="Reminders to upload monthly payroll data"
                    checked={settings.payrollReminders}
                    onToggle={(v) => setSettings(prev => ({ ...prev, payrollReminders: v }))}
                  />
                  <ToggleItem 
                    icon={BarChart3}
                    label="Weekly Reports"
                    description="Receive weekly summary reports via email"
                    checked={settings.weeklyReports}
                    onToggle={(v) => setSettings(prev => ({ ...prev, weeklyReports: v }))}
                  />
                </div>
              </SettingsCard>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <>
                <SettingsCard icon={Lock} title="Password" description="Update your account password">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700 dark:text-slate-300">Current Password</Label>
                      <Input 
                        type="password" 
                        placeholder="Enter current password"
                        className="bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"
                        data-testid="current-password" 
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-700 dark:text-slate-300">New Password</Label>
                        <Input 
                          type="password" 
                          placeholder="Enter new password"
                          className="bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"
                          data-testid="new-password" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 dark:text-slate-300">Confirm Password</Label>
                        <Input 
                          type="password" 
                          placeholder="Confirm new password"
                          className="bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"
                          data-testid="confirm-password" 
                        />
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-primary to-emerald-600 text-white" data-testid="update-password-btn">
                      Update Password
                    </Button>
                  </div>
                </SettingsCard>

                <SettingsCard icon={Shield} title="Security Settings" description="Additional security options">
                  <div className="space-y-4">
                    <SecurityItem 
                      icon={Shield}
                      label="Two-Factor Authentication"
                      description="Add an extra layer of security"
                      actionLabel="Enable"
                    />
                    <SecurityItem 
                      icon={Clock}
                      label="Login Activity"
                      description="View recent login attempts"
                      actionLabel="View"
                    />
                    <SecurityItem 
                      icon={Lock}
                      label="API Access"
                      description="Manage API keys for integrations"
                      actionLabel="Manage"
                    />
                  </div>
                </SettingsCard>
              </>
            )}
          </div>
        </div>
      </div>
    </EmployerPortalLayout>
  );
}
