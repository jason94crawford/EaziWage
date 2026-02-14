import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Building2, Lock, Fingerprint, Bell, Globe, HelpCircle, 
  MessageCircle, Scale, LogOut, ChevronRight, CheckCircle2, FolderOpen,
  Home, History, User, Wallet, Sun, Moon, Shield, CreditCard, Smartphone, Mail, Phone
} from 'lucide-react';
import { employeeApi } from '../../lib/api';
import { cn } from '../../lib/utils';
import { useTheme } from '../../lib/ThemeContext';

// Bottom Navigation
const BottomNav = ({ active }) => {
  const navigate = useNavigate();
  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/employee' },
    { id: 'wallet', icon: Wallet, label: 'Advance', path: '/employee/advances' },
    { id: 'history', icon: History, label: 'History', path: '/employee/transactions' },
    { id: 'profile', icon: User, label: 'Profile', path: '/employee/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto px-4 pb-2">
        <div className="glass-card rounded-2xl shadow-xl border border-slate-200/50 dark:border-white/10">
          <div className="flex items-center justify-around h-16">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => navigate(item.path)}
                className={cn("flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all",
                  active === item.id ? "text-primary" : "text-slate-400 dark:text-slate-500"
                )} data-testid={`nav-${item.id}`}>
                <item.icon className={cn("w-5 h-5", active === item.id && "scale-110")} />
                <span className="text-[10px] font-semibold">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Toggle Switch
const ToggleSwitch = ({ checked, onChange, id }) => (
  <button id={id} onClick={onChange}
    className={cn("relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300",
      checked ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
    )} data-testid={`toggle-${id}`}>
    <span className={cn("inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300",
      checked ? "translate-x-[22px]" : "translate-x-0.5"
    )} />
  </button>
);

// Settings Item
const SettingsItem = ({ icon: Icon, title, subtitle, onClick, rightContent, showChevron = true, iconBg = "bg-primary/10", iconColor = "text-primary" }) => (
  <button onClick={onClick}
    className="glass-card w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left" data-testid={`settings-${title.toLowerCase().replace(/\s+/g, '-')}`}>
    <div className={cn("flex items-center justify-center rounded-xl shrink-0 w-10 h-10", iconBg)}>
      <Icon className={cn("w-5 h-5", iconColor)} />
    </div>
    <div className="flex flex-col items-start flex-1 min-w-0">
      <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
      {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-full">{subtitle}</p>}
    </div>
    {rightContent || (showChevron && <ChevronRight className="w-5 h-5 text-slate-400" />)}
  </button>
);

// Settings Section
const SettingsSection = ({ title, children }) => (
  <div className="space-y-2">
    <h3 className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase px-1 mb-2">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

export default function SettingsPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('eaziwage_user') || '{}');
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await employeeApi.getMe();
        setEmployee(response.data);
      } catch (err) {
        console.error('Failed to fetch employee data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('eaziwage_token');
    localStorage.removeItem('eaziwage_user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 bg-grid" />
        <div className="relative w-14 h-14 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px]" />

      {/* Header */}
      <header className="relative z-10 max-w-md mx-auto px-4 py-4 flex items-center justify-between">
        <button onClick={() => navigate('/employee')} className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all" data-testid="back-btn">
          <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
        </button>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Profile & Settings</h2>
        <div className="w-11" />
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-md mx-auto px-4 pb-28 space-y-5">
        {/* Profile Card */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="text-white font-bold text-2xl">{employee?.full_name?.[0] || user?.full_name?.[0] || 'U'}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5">
                <div className="bg-primary h-3 w-3 rounded-full" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate">{employee?.full_name || user?.full_name || 'User'}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm truncate">{employee?.employer_name || 'Employee'}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold",
                  employee?.kyc_status === 'approved' ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400" : "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400"
                )}>
                  {employee?.kyc_status === 'approved' ? <><CheckCircle2 className="w-3 h-3" /> Verified</> : <><Shield className="w-3 h-3" /> Pending</>}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50 space-y-2">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600 dark:text-slate-300 truncate">{user?.email || 'Not set'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600 dark:text-slate-300">{user?.phone || employee?.mobile_money_number || 'Not set'}</span>
            </div>
          </div>
        </div>

        {/* Account Section */}
        <SettingsSection title="Account">
          <SettingsItem icon={FolderOpen} title="KYC & Documents" subtitle={employee?.kyc_status === 'approved' ? 'Verified' : 'Complete verification'}
            onClick={() => navigate('/employee/onboarding')} iconBg="bg-blue-100 dark:bg-blue-500/20" iconColor="text-blue-600 dark:text-blue-400" />
          <SettingsItem icon={Building2} title="Employment Details" subtitle={employee?.job_title || 'Not set'}
            iconBg="bg-purple-100 dark:bg-purple-500/20" iconColor="text-purple-600 dark:text-purple-400" />
        </SettingsSection>

        {/* Payment Methods */}
        <SettingsSection title="Payment Methods">
          <SettingsItem icon={Smartphone} title="Mobile Money"
            subtitle={employee?.mobile_money_provider && employee?.mobile_money_number ? `${employee.mobile_money_provider} · ${employee.mobile_money_number}` : 'Not configured'}
            rightContent={employee?.mobile_money_provider && <span className="text-[10px] bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Active</span>}
            showChevron={false} iconBg="bg-green-100 dark:bg-green-500/20" iconColor="text-green-600 dark:text-green-400" />
          <SettingsItem icon={CreditCard} title="Bank Account"
            subtitle={employee?.bank_name && employee?.bank_account ? `${employee.bank_name} · ••••${employee.bank_account?.slice(-4)}` : 'Not configured'}
            rightContent={employee?.bank_name && <span className="text-[10px] bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Active</span>}
            showChevron={false} iconBg="bg-blue-100 dark:bg-blue-500/20" iconColor="text-blue-600 dark:text-blue-400" />
        </SettingsSection>

        {/* Security */}
        <SettingsSection title="Security">
          <SettingsItem icon={Lock} title="Change Password" subtitle="Update your password"
            iconBg="bg-red-100 dark:bg-red-500/20" iconColor="text-red-600 dark:text-red-400" />
          <div className="glass-card flex items-center gap-3 px-4 py-3.5 rounded-xl">
            <div className="flex items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-500/20 shrink-0 w-10 h-10">
              <Fingerprint className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex flex-col items-start flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Biometric Login</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Face ID / Touch ID</p>
            </div>
            <ToggleSwitch id="biometric" checked={biometricEnabled} onChange={() => setBiometricEnabled(!biometricEnabled)} />
          </div>
        </SettingsSection>

        {/* Preferences */}
        <SettingsSection title="Preferences">
          <div className="glass-card flex items-center gap-3 px-4 py-3.5 rounded-xl">
            <div className="flex items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-500/20 shrink-0 w-10 h-10">
              <Bell className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="flex flex-col items-start flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Push Notifications</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Transaction alerts</p>
            </div>
            <ToggleSwitch id="notifications" checked={notificationsEnabled} onChange={() => setNotificationsEnabled(!notificationsEnabled)} />
          </div>
          <button onClick={toggleTheme} className="glass-card w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left" data-testid="theme-toggle">
            <div className="flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 shrink-0 w-10 h-10">
              {theme === 'dark' ? <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300" /> : <Sun className="w-5 h-5 text-slate-600" />}
            </div>
            <div className="flex flex-col items-start flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Appearance</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{theme} mode</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
          <SettingsItem icon={Globe} title="Language" subtitle="English (US)"
            iconBg="bg-indigo-100 dark:bg-indigo-500/20" iconColor="text-indigo-600 dark:text-indigo-400" />
        </SettingsSection>

        {/* Support */}
        <SettingsSection title="Support">
          <SettingsItem icon={HelpCircle} title="Help Center" subtitle="FAQs and guides"
            iconBg="bg-teal-100 dark:bg-teal-500/20" iconColor="text-teal-600 dark:text-teal-400" />
          <SettingsItem icon={MessageCircle} title="Contact Support" subtitle="Get help from our team"
            iconBg="bg-cyan-100 dark:bg-cyan-500/20" iconColor="text-cyan-600 dark:text-cyan-400" />
          <SettingsItem icon={Scale} title="Terms & Privacy" subtitle="Legal information"
            onClick={() => navigate('/terms')} iconBg="bg-slate-100 dark:bg-slate-700" iconColor="text-slate-600 dark:text-slate-400" />
        </SettingsSection>

        {/* Logout */}
        <div className="pt-2 pb-4">
          <button onClick={handleLogout}
            className="w-full py-4 rounded-xl border border-red-200 dark:border-red-500/20 text-red-500 font-semibold bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
            data-testid="logout-btn">
            <LogOut className="w-5 h-5" /> Log Out
          </button>
          <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 mt-4">Version 1.0.0 · EaziWage</p>
        </div>
      </main>

      <BottomNav active="profile" />
    </div>
  );
}
