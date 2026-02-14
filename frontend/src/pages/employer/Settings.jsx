import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, Building2, Users, CreditCard, Bell,
  Shield, Globe, Clock, Save, AlertCircle, CheckCircle2, Info,
  Percent, Calendar, Wallet, Lock, Eye, EyeOff, Mail, Phone
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Slider } from '../../components/ui/slider';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { employerApi } from '../../lib/api';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

export default function EmployerSettings() {
  const [employer, setEmployer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('company');
  
  // Settings state
  const [settings, setSettings] = useState({
    // EWA Settings
    maxAdvancePercentage: 50,
    minAdvanceAmount: 500,
    maxAdvanceAmount: 50000,
    advanceAccessDays: [1, 25], // Day of month range when advances are allowed
    cooldownPeriod: 7, // Days between advances
    
    // Notifications
    emailNotifications: true,
    advanceAlerts: true,
    payrollReminders: true,
    weeklyReports: false,
    
    // Company Info (from employer profile)
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
      // In a real app, this would save to the backend
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
      <DashboardLayout role="employer">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="employer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-slate-900" data-testid="settings-title">Settings</h1>
            <p className="text-slate-500 mt-1">Manage your company settings and EWA program configuration</p>
          </div>
          <Button 
            className="bg-primary flex items-center gap-2" 
            onClick={handleSave}
            disabled={saving}
            data-testid="save-settings-btn"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap",
                activeTab === tab.id ? 'bg-primary' : ''
              )}
              data-testid={`tab-${tab.id}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Company Tab */}
        {activeTab === 'company' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Company Information
                </CardTitle>
                <CardDescription>Update your company details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input
                    value={settings.companyName}
                    onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
                    placeholder="Your company name"
                    data-testid="company-name-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Payroll Cycle</Label>
                  <Select 
                    value={settings.payrollCycle} 
                    onValueChange={(v) => setSettings(prev => ({ ...prev, payrollCycle: v }))}
                  >
                    <SelectTrigger data-testid="payroll-cycle-select">
                      <SelectValue placeholder="Select cycle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Primary Contact
                </CardTitle>
                <CardDescription>Who should we contact about EWA matters?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Contact Person</Label>
                  <Input
                    value={settings.contactPerson}
                    onChange={(e) => setSettings(prev => ({ ...prev, contactPerson: e.target.value }))}
                    placeholder="Full name"
                    data-testid="contact-person-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="email@company.com"
                    data-testid="contact-email-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    value={settings.contactPhone}
                    onChange={(e) => setSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
                    placeholder="+254 700 000 000"
                    data-testid="contact-phone-input"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 lg:col-span-2">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                    employer?.status === 'approved' ? 'bg-emerald-100' : 'bg-amber-100'
                  )}>
                    {employer?.status === 'approved' ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <Clock className="w-6 h-6 text-amber-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Verification Status: {employer?.status?.charAt(0).toUpperCase() + employer?.status?.slice(1)}</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {employer?.status === 'approved' 
                        ? 'Your company is fully verified and can access all EaziWage features.'
                        : 'Your company verification is in progress. Some features may be limited until approval.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* EWA Settings Tab */}
        {activeTab === 'ewa' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Percent className="w-5 h-5 text-primary" />
                  Advance Limits
                </CardTitle>
                <CardDescription>Control how much employees can advance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Maximum Advance Percentage</Label>
                    <span className="text-lg font-bold text-primary">{settings.maxAdvancePercentage}%</span>
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
                  <p className="text-xs text-slate-500">
                    Employees can advance up to {settings.maxAdvancePercentage}% of their earned wages
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Minimum Amount (KES)</Label>
                    <Input
                      type="number"
                      value={settings.minAdvanceAmount}
                      onChange={(e) => setSettings(prev => ({ ...prev, minAdvanceAmount: parseInt(e.target.value) || 0 }))}
                      data-testid="min-advance-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Maximum Amount (KES)</Label>
                    <Input
                      type="number"
                      value={settings.maxAdvanceAmount}
                      onChange={(e) => setSettings(prev => ({ ...prev, maxAdvanceAmount: parseInt(e.target.value) || 0 }))}
                      data-testid="max-advance-input"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Access Period
                </CardTitle>
                <CardDescription>When can employees request advances?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Advance Access Window</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-xs text-slate-500">From Day</span>
                      <Select 
                        value={settings.advanceAccessDays[0].toString()}
                        onValueChange={(v) => setSettings(prev => ({ 
                          ...prev, 
                          advanceAccessDays: [parseInt(v), prev.advanceAccessDays[1]] 
                        }))}
                      >
                        <SelectTrigger data-testid="access-from-select">
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
                      <span className="text-xs text-slate-500">To Day</span>
                      <Select 
                        value={settings.advanceAccessDays[1].toString()}
                        onValueChange={(v) => setSettings(prev => ({ 
                          ...prev, 
                          advanceAccessDays: [prev.advanceAccessDays[0], parseInt(v)] 
                        }))}
                      >
                        <SelectTrigger data-testid="access-to-select">
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
                  <p className="text-xs text-slate-500">
                    Employees can request advances from day {settings.advanceAccessDays[0]} to {settings.advanceAccessDays[1]} of each month
                  </p>
                </div>

                <div className="space-y-4">
                  <Label>Cooldown Period (Days)</Label>
                  <Input
                    type="number"
                    value={settings.cooldownPeriod}
                    onChange={(e) => setSettings(prev => ({ ...prev, cooldownPeriod: parseInt(e.target.value) || 0 }))}
                    min={0}
                    max={30}
                    data-testid="cooldown-input"
                  />
                  <p className="text-xs text-slate-500">
                    Minimum {settings.cooldownPeriod} days between advance requests per employee
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 lg:col-span-2 bg-amber-50 border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Info className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900">EWA Configuration Note</h3>
                    <p className="text-sm text-amber-800 mt-1">
                      Changes to advance limits and access periods will apply to all employees. 
                      Existing pending advance requests will not be affected. 
                      Contact support if you need custom configurations for specific employee groups.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose what updates you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { 
                  key: 'emailNotifications', 
                  label: 'Email Notifications', 
                  description: 'Receive important updates via email',
                  icon: Mail
                },
                { 
                  key: 'advanceAlerts', 
                  label: 'Advance Alerts', 
                  description: 'Get notified when employees request advances',
                  icon: CreditCard
                },
                { 
                  key: 'payrollReminders', 
                  label: 'Payroll Reminders', 
                  description: 'Reminders to upload monthly payroll data',
                  icon: Calendar
                },
                { 
                  key: 'weeklyReports', 
                  label: 'Weekly Reports', 
                  description: 'Receive weekly summary reports via email',
                  icon: BarChart3
                },
              ].map((item) => (
                <div 
                  key={item.key} 
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{item.label}</p>
                      <p className="text-sm text-slate-500">{item.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings[item.key]}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, [item.key]: checked }))}
                    data-testid={`toggle-${item.key}`}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  Password
                </CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input type="password" placeholder="Enter current password" data-testid="current-password" />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" placeholder="Enter new password" data-testid="new-password" />
                </div>
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input type="password" placeholder="Confirm new password" data-testid="confirm-password" />
                </div>
                <Button className="w-full bg-primary" data-testid="update-password-btn">
                  Update Password
                </Button>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Security Settings
                </CardTitle>
                <CardDescription>Additional security options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                    <p className="text-sm text-slate-500">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" size="sm" data-testid="enable-2fa-btn">
                    Enable
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-900">Login Activity</p>
                    <p className="text-sm text-slate-500">View recent login attempts</p>
                  </div>
                  <Button variant="outline" size="sm" data-testid="view-activity-btn">
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-900">API Access</p>
                    <p className="text-sm text-slate-500">Manage API keys for integrations</p>
                  </div>
                  <Button variant="outline" size="sm" data-testid="manage-api-btn">
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// Import BarChart3 that was missing
import { BarChart3 } from 'lucide-react';
