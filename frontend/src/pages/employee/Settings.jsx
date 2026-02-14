import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Building2, CalendarDays, Lock, Fingerprint,
  Bell, Globe, HelpCircle, MessageCircle, Scale, LogOut,
  ChevronRight, CheckCircle2, FolderOpen, ClipboardList,
  Home, History, User, Wallet, Sun, Moon
} from 'lucide-react';
import { employeeApi } from '../../lib/api';
import { cn } from '../../lib/utils';
import { useTheme } from '../../lib/ThemeContext';

// Bottom Navigation Component
const BottomNav = ({ active }) => {
  const navigate = useNavigate();
  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/employee' },
    { id: 'wallet', icon: Wallet, label: 'Wallet', path: '/employee/advances' },
    { id: 'history', icon: History, label: 'History', path: '/employee/transactions' },
    { id: 'profile', icon: User, label: 'Profile', path: '/employee/kyc' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#15231b] border-t border-slate-200 dark:border-white/5 z-50 md:hidden">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors",
              active === item.id 
                ? "text-primary" 
                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            )}
            data-testid={`nav-${item.id}`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

// Toggle Switch Component
const ToggleSwitch = ({ checked, onChange, id }) => (
  <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300"
      style={{
        right: checked ? '0' : '24px',
        borderColor: checked ? '#0df259' : '#d1d5db'
      }}
    />
    <label
      htmlFor={id}
      className={cn(
        "toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300",
        checked ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
      )}
    />
  </div>
);

// Settings List Item Component
const SettingsItem = ({ icon: Icon, title, subtitle, onClick, rightContent, showChevron = true }) => (
  <button
    onClick={onClick}
    className="group flex items-center gap-4 bg-white dark:bg-[#152b1d]/50 px-5 py-4 w-full active:bg-slate-100 dark:active:bg-[#152b1d] transition-colors text-left"
    data-testid={`settings-${title.toLowerCase().replace(/\s+/g, '-')}`}
  >
    <div className="flex items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20 shrink-0 w-10 h-10 text-primary">
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex flex-col items-start flex-1">
      <p className="text-base font-medium leading-none text-slate-900 dark:text-white">{title}</p>
      {subtitle && (
        <p className="text-slate-500 dark:text-[#9cbaa6] text-sm mt-1.5 flex items-center gap-1">
          {subtitle}
        </p>
      )}
    </div>
    {rightContent || (showChevron && <ChevronRight className="w-5 h-5 text-slate-400" />)}
  </button>
);

// Settings Section Component
const SettingsSection = ({ title, children }) => (
  <div className="mt-8 first:mt-4">
    <h3 className="text-[#9cbaa6] text-xs font-bold tracking-wider px-6 pb-2 uppercase">{title}</h3>
    <div className="flex flex-col gap-[1px]">
      {children}
    </div>
  </div>
);

export default function SettingsPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  
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
      <div className="min-h-screen bg-[#f5f8f6] dark:bg-[#102216] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f8f6] dark:bg-[#102216] text-slate-900 dark:text-white pb-24 md:pb-8">
      {/* Mobile Container */}
      <div className="w-full max-w-md mx-auto flex flex-col min-h-screen relative shadow-2xl">
        {/* Top App Bar */}
        <header className="sticky top-0 z-50 bg-[#f5f8f6]/95 dark:bg-[#102216]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/5">
          <div className="flex items-center px-4 py-3 justify-between">
            <button 
              onClick={() => navigate('/employee')}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              data-testid="back-btn"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-bold tracking-tight flex-1 text-center pr-10">Settings</h2>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 flex flex-col pb-8">
          {/* Profile Header */}
          <div className="px-5 py-6">
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <div 
                  className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center ring-2 ring-primary/20"
                >
                  <span className="text-white font-bold text-2xl">
                    {employee?.full_name?.[0] || 'U'}
                  </span>
                </div>
                <div className="absolute bottom-0 right-0 bg-[#102216] rounded-full p-1 border border-[#152b1d]">
                  <div className="bg-primary h-3 w-3 rounded-full border-2 border-[#102216]" />
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-xl font-bold leading-tight">{employee?.full_name || 'User'}</h1>
                <p className="text-[#9cbaa6] text-sm font-medium mt-0.5">
                  {employee?.employer_name || 'Employee'} | ID: #{employee?.id?.slice(-4) || '0000'}
                </p>
                <Link 
                  to="/employee/kyc"
                  className="text-primary text-sm font-semibold mt-2 flex items-center gap-1 hover:underline"
                  data-testid="edit-profile-btn"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>

          <hr className="border-t border-slate-200 dark:border-white/5 mb-2 mx-5" />

          {/* Finance Section */}
          <SettingsSection title="Finance">
            <SettingsItem
              icon={Building2}
              title="Bank Account"
              subtitle={
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  {employee?.bank_name || 'Not set'} •••• {employee?.bank_account?.slice(-4) || '----'}
                </>
              }
            />
            <SettingsItem
              icon={CalendarDays}
              title="Salary Cycle"
              subtitle="Monthly • 25th"
            />
          </SettingsSection>

          {/* Compliance Section */}
          <SettingsSection title="Compliance">
            <SettingsItem
              icon={FolderOpen}
              title="KYC & Onboarding"
              subtitle={employee?.kyc_status === 'approved' ? 'Verified Documents' : 'Pending Verification'}
              onClick={() => navigate('/employee/kyc')}
            />
            <SettingsItem
              icon={ClipboardList}
              title="Audit Log"
              subtitle="Record of changes"
            />
          </SettingsSection>

          {/* Security Section */}
          <SettingsSection title="Security">
            <SettingsItem
              icon={Lock}
              title="Change Password"
            />
            <div className="flex items-center gap-4 bg-white dark:bg-[#152b1d]/50 px-5 py-4 w-full">
              <div className="flex items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20 shrink-0 w-10 h-10 text-primary">
                <Fingerprint className="w-5 h-5" />
              </div>
              <div className="flex flex-col items-start flex-1">
                <p className="text-base font-medium leading-none text-slate-900 dark:text-white">Biometric Login</p>
                <p className="text-[#9cbaa6] text-sm mt-1.5">FaceID / TouchID</p>
              </div>
              <ToggleSwitch
                id="biometric-toggle"
                checked={biometricEnabled}
                onChange={() => setBiometricEnabled(!biometricEnabled)}
              />
            </div>
          </SettingsSection>

          {/* Preferences Section */}
          <SettingsSection title="Preferences">
            <div className="flex items-center gap-4 bg-white dark:bg-[#152b1d]/50 px-5 py-4 w-full">
              <div className="flex items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20 shrink-0 w-10 h-10 text-primary">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex flex-col items-start flex-1">
                <p className="text-base font-medium leading-none text-slate-900 dark:text-white">Push Notifications</p>
              </div>
              <ToggleSwitch
                id="notif-toggle"
                checked={notificationsEnabled}
                onChange={() => setNotificationsEnabled(!notificationsEnabled)}
              />
            </div>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="group flex items-center gap-4 bg-white dark:bg-[#152b1d]/50 px-5 py-4 w-full active:bg-slate-100 dark:active:bg-[#152b1d] transition-colors text-left"
              data-testid="theme-toggle"
            >
              <div className="flex items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20 shrink-0 w-10 h-10 text-primary">
                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <div className="flex flex-col items-start flex-1">
                <p className="text-base font-medium leading-none text-slate-900 dark:text-white">Appearance</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#9cbaa6] text-sm capitalize">{theme} Mode</span>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </button>

            <SettingsItem
              icon={Globe}
              title="Language"
              rightContent={
                <div className="flex items-center gap-2">
                  <span className="text-[#9cbaa6] text-sm">English (US)</span>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              }
              showChevron={false}
            />
          </SettingsSection>

          {/* Support Section */}
          <SettingsSection title="Support">
            <SettingsItem
              icon={HelpCircle}
              title="Help Center"
            />
            <SettingsItem
              icon={MessageCircle}
              title="Contact Support"
            />
            <SettingsItem
              icon={Scale}
              title="Terms & Privacy"
              onClick={() => navigate('/terms')}
            />
          </SettingsSection>

          {/* Footer Actions */}
          <div className="mt-10 px-5 mb-8">
            <button
              onClick={handleLogout}
              className="w-full py-3 rounded-lg border border-red-500/30 text-red-500 font-semibold bg-red-500/5 hover:bg-red-500/10 active:scale-[0.98] transition-all"
              data-testid="logout-btn"
            >
              Log Out
            </button>
            <p className="text-center text-xs text-slate-500 mt-6">Version 1.0.0 • EaziWage</p>
          </div>
        </main>
      </div>

      {/* Bottom Navigation */}
      <BottomNav active="profile" />

      {/* Toggle Switch Styles */}
      <style>{`
        .toggle-checkbox:checked {
          right: 0;
        }
        .toggle-checkbox {
          right: 24px;
        }
      `}</style>
    </div>
  );
}
