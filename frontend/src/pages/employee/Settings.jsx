import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Building2, CalendarDays, Lock, Fingerprint,
  Bell, Globe, HelpCircle, MessageCircle, Scale, LogOut,
  ChevronRight, CheckCircle2, FolderOpen, ClipboardList,
  Home, History, User, Wallet, Sun, Moon, Shield, CreditCard,
  Smartphone, Edit3, Mail, Phone
} from 'lucide-react';
import { employeeApi } from '../../lib/api';
import { formatCurrency, cn } from '../../lib/utils';
import { useTheme } from '../../lib/ThemeContext';

// Bottom Navigation Component
const BottomNav = ({ active }) => {
  const navigate = useNavigate();
  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/employee' },
    { id: 'wallet', icon: Wallet, label: 'Advance', path: '/employee/advances' },
    { id: 'history', icon: History, label: 'History', path: '/employee/transactions' },
    { id: 'profile', icon: User, label: 'Profile', path: '/employee/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200/50 dark:border-white/5 z-50 md:hidden">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-full h-full transition-all",
              active === item.id 
                ? "text-primary" 
                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            )}
            data-testid={`nav-${item.id}`}
          >
            <item.icon className={cn("w-5 h-5", active === item.id && "scale-110")} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

// Toggle Switch Component
const ToggleSwitch = ({ checked, onChange, id }) => (
  <button
    id={id}
    onClick={onChange}
    className={cn(
      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300",
      checked ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
    )}
    data-testid={`toggle-${id}`}
  >
    <span
      className={cn(
        "inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300",
        checked ? "translate-x-[22px]" : "translate-x-0.5"
      )}
    />
  </button>
);

// Settings List Item Component
const SettingsItem = ({ icon: Icon, title, subtitle, onClick, rightContent, showChevron = true, iconBg = "bg-primary/10", iconColor = "text-primary" }) => (
  <button
    onClick={onClick}
    className="group flex items-center gap-4 bg-white/70 dark:bg-white/5 backdrop-blur-sm px-4 py-4 w-full hover:bg-white dark:hover:bg-white/10 transition-all text-left rounded-xl border border-slate-200/50 dark:border-white/10"
    data-testid={`settings-${title.toLowerCase().replace(/\s+/g, '-')}`}
  >
    <div className={cn("flex items-center justify-center rounded-xl shrink-0 w-10 h-10", iconBg)}>
      <Icon className={cn("w-5 h-5", iconColor)} />
    </div>
    <div className="flex flex-col items-start flex-1 min-w-0">
      <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
      {subtitle && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1 truncate max-w-full">
          {subtitle}
        </p>
      )}
    </div>
    {rightContent || (showChevron && <ChevronRight className="w-5 h-5 text-slate-400" />)}
  </button>
);

// Settings Section Component
const SettingsSection = ({ title, children }) => (
  <div className="space-y-2">
    <h3 className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase px-1 mb-3">{title}</h3>
    <div className="space-y-2">
      {children}
    </div>
  </div>
);

export default function SettingsPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('eaziwage_user') || '{}');
  
  // Toggle states
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="w-14 h-14 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-white pb-24 md:pb-8">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Mobile Container */}
      <div className="w-full max-w-md mx-auto flex flex-col min-h-screen relative z-10">
        {/* Top App Bar */}
        <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5">
          <div className="flex items-center px-4 py-3 justify-between">
            <button 
              onClick={() => navigate('/employee')}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              data-testid="back-btn"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-bold tracking-tight flex-1 text-center pr-10">Profile & Settings</h2>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 flex flex-col p-4 space-y-6">
          {/* Profile Card */}
          <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-white/10">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center ring-4 ring-primary/20">
                  <span className="text-white font-bold text-2xl">
                    {employee?.full_name?.[0] || user?.full_name?.[0] || 'U'}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-1 border border-slate-200 dark:border-slate-700">
                  <div className="bg-primary h-3 w-3 rounded-full" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold truncate">{employee?.full_name || user?.full_name || 'User'}</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm truncate">
                  {employee?.employer_name || 'Employee'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold",
                    employee?.kyc_status === 'approved' 
                      ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400"
                      : "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400"
                  )}>
                    {employee?.kyc_status === 'approved' ? (
                      <><CheckCircle2 className="w-3 h-3" /> Verified</>
                    ) : (
                      <><Shield className="w-3 h-3" /> Pending</>
                    )}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-white/10 space-y-2">
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
            <SettingsItem
              icon={FolderOpen}
              title="KYC & Documents"
              subtitle={employee?.kyc_status === 'approved' ? 'All documents verified' : 'Complete verification'}
              onClick={() => navigate('/employee/kyc')}
              iconBg="bg-blue-100 dark:bg-blue-500/20"
              iconColor="text-blue-600 dark:text-blue-400"
            />
            <SettingsItem
              icon={Building2}
              title="Employment Details"
              subtitle={employee?.job_title || 'Not set'}
              iconBg="bg-purple-100 dark:bg-purple-500/20"
              iconColor="text-purple-600 dark:text-purple-400"
            />
          </SettingsSection>

          {/* Payment Methods */}
          <SettingsSection title="Payment Methods">
            <SettingsItem
              icon={Smartphone}
              title="Mobile Money"
              subtitle={
                employee?.mobile_money_provider && employee?.mobile_money_number
                  ? `${employee.mobile_money_provider} · ${employee.mobile_money_number}`
                  : 'Not configured'
              }
              rightContent={
                employee?.mobile_money_provider && (
                  <span className="text-xs bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                )
              }
              showChevron={false}
              iconBg="bg-green-100 dark:bg-green-500/20"
              iconColor="text-green-600 dark:text-green-400"
            />
            <SettingsItem
              icon={CreditCard}
              title="Bank Account"
              subtitle={
                employee?.bank_name && employee?.bank_account
                  ? `${employee.bank_name} · ••••${employee.bank_account?.slice(-4)}`
                  : 'Not configured'
              }
              rightContent={
                employee?.bank_name && (
                  <span className="text-xs bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                )
              }
              showChevron={false}
              iconBg="bg-blue-100 dark:bg-blue-500/20"
              iconColor="text-blue-600 dark:text-blue-400"
            />
          </SettingsSection>

          {/* Security Section */}
          <SettingsSection title="Security">
            <SettingsItem
              icon={Lock}
              title="Change Password"
              subtitle="Update your password"
              iconBg="bg-red-100 dark:bg-red-500/20"
              iconColor="text-red-600 dark:text-red-400"
            />
            <div className="flex items-center gap-4 bg-white/70 dark:bg-white/5 backdrop-blur-sm px-4 py-4 rounded-xl border border-slate-200/50 dark:border-white/10">
              <div className="flex items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-500/20 shrink-0 w-10 h-10">
                <Fingerprint className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex flex-col items-start flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Biometric Login</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Face ID / Touch ID</p>
              </div>
              <ToggleSwitch
                id="biometric"
                checked={biometricEnabled}
                onChange={() => setBiometricEnabled(!biometricEnabled)}
              />
            </div>
          </SettingsSection>

          {/* Preferences Section */}
          <SettingsSection title="Preferences">
            <div className="flex items-center gap-4 bg-white/70 dark:bg-white/5 backdrop-blur-sm px-4 py-4 rounded-xl border border-slate-200/50 dark:border-white/10">
              <div className="flex items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-500/20 shrink-0 w-10 h-10">
                <Bell className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex flex-col items-start flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Push Notifications</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Transaction alerts & updates</p>
              </div>
              <ToggleSwitch
                id="notifications"
                checked={notificationsEnabled}
                onChange={() => setNotificationsEnabled(!notificationsEnabled)}
              />
            </div>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="group flex items-center gap-4 bg-white/70 dark:bg-white/5 backdrop-blur-sm px-4 py-4 w-full hover:bg-white dark:hover:bg-white/10 transition-all text-left rounded-xl border border-slate-200/50 dark:border-white/10"
              data-testid="theme-toggle"
            >
              <div className="flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 shrink-0 w-10 h-10">
                {theme === 'dark' ? <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300" /> : <Sun className="w-5 h-5 text-slate-600" />}
              </div>
              <div className="flex flex-col items-start flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Appearance</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{theme} mode</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>

            <SettingsItem
              icon={Globe}
              title="Language"
              subtitle="English (US)"
              iconBg="bg-indigo-100 dark:bg-indigo-500/20"
              iconColor="text-indigo-600 dark:text-indigo-400"
            />
          </SettingsSection>

          {/* Support Section */}
          <SettingsSection title="Support">
            <SettingsItem
              icon={HelpCircle}
              title="Help Center"
              subtitle="FAQs and guides"
              iconBg="bg-teal-100 dark:bg-teal-500/20"
              iconColor="text-teal-600 dark:text-teal-400"
            />
            <SettingsItem
              icon={MessageCircle}
              title="Contact Support"
              subtitle="Get help from our team"
              iconBg="bg-cyan-100 dark:bg-cyan-500/20"
              iconColor="text-cyan-600 dark:text-cyan-400"
            />
            <SettingsItem
              icon={Scale}
              title="Terms & Privacy"
              subtitle="Legal information"
              onClick={() => navigate('/terms')}
              iconBg="bg-slate-100 dark:bg-slate-700"
              iconColor="text-slate-600 dark:text-slate-400"
            />
          </SettingsSection>

          {/* Logout */}
          <div className="pt-4 pb-8">
            <button
              onClick={handleLogout}
              className="w-full py-4 rounded-xl border border-red-200 dark:border-red-500/20 text-red-500 font-semibold bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              data-testid="logout-btn"
            >
              <LogOut className="w-5 h-5" />
              Log Out
            </button>
            <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6">Version 1.0.0 · EaziWage</p>
          </div>
        </main>
      </div>

      {/* Bottom Navigation */}
      <BottomNav active="profile" />
    </div>
  );
}
