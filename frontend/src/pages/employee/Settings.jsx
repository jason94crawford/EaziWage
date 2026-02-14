import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, Lock, Fingerprint, Bell, Globe, HelpCircle, 
  MessageCircle, Scale, LogOut, ChevronRight, CheckCircle2, 
  FolderOpen, Sun, Moon, Shield, CreditCard, Smartphone, 
  Mail, Phone, Camera, Edit2, Save, X, MapPin, FileText,
  User, IdCard
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { employeeApi, userApi } from '../../lib/api';
import { cn } from '../../lib/utils';
import { useTheme } from '../../lib/ThemeContext';
import { toast } from 'sonner';
import { EmployeePageLayout, EmployeeHeader } from '../../components/employee/EmployeeLayout';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

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
    <span className={cn(
      "inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300",
      checked ? "translate-x-[22px]" : "translate-x-0.5"
    )} />
  </button>
);

// Editable Field Component
const EditableField = ({ label, value, onSave, type = 'text', placeholder, icon: Icon }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (editValue !== value) {
      await onSave(editValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value || '');
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      {Icon && (
        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">{label}</p>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type={type}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={placeholder}
              className="flex-1 text-sm font-semibold text-slate-900 dark:text-white bg-transparent border-b border-primary focus:outline-none"
            />
            <button onClick={handleSave} className="p-1 text-primary hover:bg-primary/10 rounded">
              <Save className="w-4 h-4" />
            </button>
            <button onClick={handleCancel} className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
            {value || <span className="text-slate-400">Not set</span>}
          </p>
        )}
      </div>
      {!isEditing && (
        <button onClick={() => setIsEditing(true)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
          <Edit2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// Settings Item Component
const SettingsItem = ({ icon: Icon, title, subtitle, onClick, rightContent, showChevron = true, iconBg = "bg-primary/10", iconColor = "text-primary" }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
    data-testid={`settings-${title.toLowerCase().replace(/\s+/g, '-')}`}
  >
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

// Section Header Component
const SectionHeader = ({ title }) => (
  <h3 className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase px-4 pt-4 pb-2">{title}</h3>
);

// KYC Document Item
const KYCDocumentItem = ({ title, status, icon: Icon }) => (
  <div className="flex items-center gap-3 px-4 py-3">
    <div className={cn(
      "w-9 h-9 rounded-lg flex items-center justify-center",
      status === 'approved' ? 'bg-primary/10' : status === 'pending' || status === 'submitted' ? 'bg-amber-100 dark:bg-amber-500/20' : 'bg-slate-100 dark:bg-slate-800'
    )}>
      <Icon className={cn(
        "w-4 h-4",
        status === 'approved' ? 'text-primary' : status === 'pending' || status === 'submitted' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'
      )} />
    </div>
    <span className="flex-1 text-sm text-slate-700 dark:text-slate-300">{title}</span>
    {status === 'approved' ? (
      <CheckCircle2 className="w-4 h-4 text-primary" />
    ) : status === 'pending' || status === 'submitted' ? (
      <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/20 px-2 py-0.5 rounded-full">Pending</span>
    ) : (
      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">Not uploaded</span>
    )}
  </div>
);

export default function SettingsPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('eaziwage_user') || '{}');
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userApi.getFullProfile();
        setProfile(response.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        // Fallback to basic employee data
        try {
          const empResponse = await employeeApi.getMe();
          setProfile({ employee: empResponse.data, ...user });
        } catch (e) {
          console.error('Failed to fetch employee data:', e);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('eaziwage_token');
    localStorage.removeItem('eaziwage_user');
    navigate('/login');
  };

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Please upload a JPEG, PNG, or WebP image');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await userApi.uploadProfilePicture(formData);
      setProfile(prev => ({ ...prev, profile_picture_url: response.data.profile_picture_url }));
      toast.success('Profile picture updated!');
    } catch (err) {
      toast.error('Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const handleUserSettingsSave = async (field, value) => {
    try {
      await userApi.updateSettings({ [field]: value });
      setProfile(prev => ({ ...prev, [field]: value }));
      toast.success('Setting updated!');
    } catch (err) {
      toast.error('Failed to update setting');
    }
  };

  const handleEmployeeSettingsSave = async (field, value) => {
    try {
      await employeeApi.updateSettings({ [field]: value });
      setProfile(prev => ({ 
        ...prev, 
        employee: { ...prev.employee, [field]: value } 
      }));
      toast.success('Setting updated!');
    } catch (err) {
      toast.error('Failed to update setting');
    }
  };

  if (loading) {
    return (
      <EmployeePageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </EmployeePageLayout>
    );
  }

  const employee = profile?.employee;
  const kycDocs = profile?.kyc_documents || [];

  // Helper to get document status
  const getDocStatus = (docType) => {
    const doc = kycDocs.find(d => d.document_type === docType);
    return doc?.status || (employee?.[docType] ? 'submitted' : null);
  };

  return (
    <EmployeePageLayout>
      <EmployeeHeader title="Profile & Settings" />

      <main className="relative z-10 max-w-md mx-auto px-4 pb-28 space-y-4">
        {/* Profile Card with Picture */}
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl border border-slate-200/50 dark:border-slate-700/30">
          {/* Header with gradient */}
          <div className="h-20 bg-gradient-to-r from-primary via-emerald-500 to-teal-500 relative">
            <div className="absolute inset-0 bg-grid opacity-20" />
          </div>
          
          {/* Profile Info */}
          <div className="px-5 pb-5 -mt-10 relative">
            {/* Avatar with upload */}
            <div className="relative inline-block">
              <div className="h-20 w-20 rounded-2xl bg-white dark:bg-slate-900 p-1 shadow-xl">
                {profile?.profile_picture_url ? (
                  <img 
                    src={`${BACKEND_URL}${profile.profile_picture_url}`} 
                    alt="Profile" 
                    className="w-full h-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {profile?.full_name?.[0] || user?.full_name?.[0] || 'U'}
                    </span>
                  </div>
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                data-testid="upload-profile-pic"
              >
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Camera className="w-4 h-4 text-white" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleProfilePictureUpload}
                className="hidden"
              />
            </div>

            {/* Name and Status */}
            <div className="mt-3">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                {profile?.full_name || user?.full_name || 'User'}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {employee?.employer_name || 'Employee'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className={cn(
                  "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold",
                  employee?.kyc_status === 'approved' 
                    ? "bg-primary/10 text-primary" 
                    : "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400"
                )}>
                  {employee?.kyc_status === 'approved' ? (
                    <><CheckCircle2 className="w-3 h-3" /> Verified</>
                  ) : (
                    <><Shield className="w-3 h-3" /> {employee?.kyc_status || 'Pending'}</>
                  )}
                </span>
                {employee?.job_title && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">• {employee.job_title}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information - Editable */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/30 overflow-hidden">
          <SectionHeader title="Personal Information" />
          <div className="divide-y divide-slate-200/50 dark:divide-slate-700/30">
            <EditableField 
              label="Full Name" 
              value={profile?.full_name} 
              onSave={(val) => handleUserSettingsSave('full_name', val)}
              icon={User}
              placeholder="Enter your full name"
            />
            <EditableField 
              label="Email" 
              value={profile?.email} 
              icon={Mail}
              type="email"
              placeholder="Enter your email"
              onSave={() => toast.info('Email cannot be changed')}
            />
            <EditableField 
              label="Phone Number" 
              value={profile?.phone} 
              onSave={(val) => handleUserSettingsSave('phone', val)}
              icon={Phone}
              placeholder="Enter phone number"
            />
          </div>
        </div>

        {/* Address Information - Editable */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/30 overflow-hidden">
          <SectionHeader title="Address" />
          <div className="divide-y divide-slate-200/50 dark:divide-slate-700/30">
            <EditableField 
              label="Address Line 1" 
              value={employee?.address_line1} 
              onSave={(val) => handleEmployeeSettingsSave('address_line1', val)}
              icon={MapPin}
              placeholder="Street address"
            />
            <EditableField 
              label="City" 
              value={employee?.city} 
              onSave={(val) => handleEmployeeSettingsSave('city', val)}
              icon={Building2}
              placeholder="City"
            />
            <EditableField 
              label="Postal Code" 
              value={employee?.postal_code} 
              onSave={(val) => handleEmployeeSettingsSave('postal_code', val)}
              icon={MapPin}
              placeholder="Postal code"
            />
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/30 overflow-hidden">
          <SectionHeader title="Payment Methods" />
          <div className="divide-y divide-slate-200/50 dark:divide-slate-700/30">
            <SettingsItem 
              icon={Smartphone} 
              title="Mobile Money"
              subtitle={employee?.mobile_money_provider && employee?.mobile_money_number 
                ? `${employee.mobile_money_provider} · ${employee.mobile_money_number}` 
                : 'Not configured'
              }
              rightContent={employee?.mobile_money_provider && (
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Active
                </span>
              )}
              showChevron={false}
              iconBg="bg-primary/10"
              iconColor="text-primary"
            />
            <SettingsItem 
              icon={CreditCard} 
              title="Bank Account"
              subtitle={employee?.bank_name && employee?.bank_account 
                ? `${employee.bank_name} · ••••${employee.bank_account?.slice(-4)}` 
                : 'Not configured'
              }
              rightContent={employee?.bank_name && (
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Active
                </span>
              )}
              showChevron={false}
              iconBg="bg-blue-100 dark:bg-blue-500/20"
              iconColor="text-blue-600 dark:text-blue-400"
            />
          </div>
        </div>

        {/* KYC Documents Summary */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/30 overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <h3 className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">KYC Documents</h3>
            <button 
              onClick={() => navigate('/employee/onboarding')}
              className="text-xs font-semibold text-primary flex items-center gap-1"
            >
              Manage <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-slate-200/50 dark:divide-slate-700/30">
            <KYCDocumentItem 
              title="National ID / Passport" 
              status={getDocStatus('id_front') || (employee?.id_document_front ? 'submitted' : null)}
              icon={IdCard}
            />
            <KYCDocumentItem 
              title="Proof of Address" 
              status={getDocStatus('address_proof') || (employee?.address_proof ? 'submitted' : null)}
              icon={MapPin}
            />
            <KYCDocumentItem 
              title="Payslips" 
              status={getDocStatus('payslip_1') || (employee?.payslip_1 ? 'submitted' : null)}
              icon={FileText}
            />
            <KYCDocumentItem 
              title="Employment Contract" 
              status={getDocStatus('employment_contract') || (employee?.employment_contract ? 'submitted' : null)}
              icon={FileText}
            />
            <KYCDocumentItem 
              title="Selfie Verification" 
              status={getDocStatus('selfie') || (employee?.selfie ? 'submitted' : null)}
              icon={Camera}
            />
          </div>
        </div>

        {/* Security */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/30 overflow-hidden">
          <SectionHeader title="Security" />
          <div className="divide-y divide-slate-200/50 dark:divide-slate-700/30">
            <SettingsItem 
              icon={Lock} 
              title="Change Password" 
              subtitle="Update your password"
              iconBg="bg-red-100 dark:bg-red-500/20"
              iconColor="text-red-600 dark:text-red-400"
            />
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-500/20 rounded-xl flex items-center justify-center">
                <Fingerprint className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Biometric Login</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Face ID / Touch ID</p>
              </div>
              <ToggleSwitch id="biometric" checked={biometricEnabled} onChange={() => setBiometricEnabled(!biometricEnabled)} />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/30 overflow-hidden">
          <SectionHeader title="Preferences" />
          <div className="divide-y divide-slate-200/50 dark:divide-slate-700/30">
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-500/20 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Push Notifications</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Transaction alerts</p>
              </div>
              <ToggleSwitch id="notifications" checked={notificationsEnabled} onChange={() => setNotificationsEnabled(!notificationsEnabled)} />
            </div>
            <button 
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              data-testid="theme-toggle"
            >
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                {theme === 'dark' ? <Moon className="w-5 h-5 text-slate-500" /> : <Sun className="w-5 h-5 text-slate-500" />}
              </div>
              <div className="flex-1">
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
          </div>
        </div>

        {/* Support */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/30 overflow-hidden">
          <SectionHeader title="Support" />
          <div className="divide-y divide-slate-200/50 dark:divide-slate-700/30">
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
              iconBg="bg-slate-100 dark:bg-slate-800"
              iconColor="text-slate-600 dark:text-slate-400"
            />
          </div>
        </div>

        {/* Logout */}
        <div className="pt-2 pb-4">
          <button 
            onClick={handleLogout}
            className="w-full py-4 rounded-xl border border-red-200 dark:border-red-500/20 text-red-500 font-semibold bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
            data-testid="logout-btn"
          >
            <LogOut className="w-5 h-5" /> Log Out
          </button>
          <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 mt-4">Version 1.0.0 · EaziWage</p>
        </div>
      </main>
    </EmployeePageLayout>
  );
}
