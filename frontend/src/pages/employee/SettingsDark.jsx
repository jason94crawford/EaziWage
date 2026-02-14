import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Bell, HelpCircle, MessageCircle, Scale, LogOut, ChevronRight, 
  CheckCircle2, Sun, Moon, CreditCard, Smartphone, Mail, Phone, 
  Camera, Edit2, Save, X, MapPin, FileText, User, IdCard, 
  ChevronDown, ScanFace, Eye, EyeOff, Lock, Building2, Shield
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { employeeApi, userApi } from '../../lib/api';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import { 
  EmployeeDarkLayout, 
  DarkCard, 
  DarkIconButton,
  DarkSettingsItem,
  DarkToggleSwitch,
  DarkSectionHeader,
  DarkNotificationsPanel,
  darkThemeColors 
} from '../../components/employee/EmployeeDarkLayout';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Page Header
const SettingsHeader = ({ onNotificationsClick, notificationCount }) => {
  const navigate = useNavigate();
  
  return (
    <header className="relative z-10 max-w-md mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/employee')}
          className="p-2 rounded-xl transition-colors"
          style={{ color: darkThemeColors.textSecondary }}
          data-testid="back-btn"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        
        <h1 className="text-base font-bold" style={{ color: darkThemeColors.textPrimary }}>
          Profile & Settings
        </h1>
        
        <button 
          onClick={onNotificationsClick}
          className="relative p-2 rounded-xl transition-colors"
          style={{ color: darkThemeColors.textSecondary }}
          data-testid="notifications-btn"
        >
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <span 
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ background: darkThemeColors.accent }}
            />
          )}
        </button>
      </div>
    </header>
  );
};

// Editable Field Component
const EditableField = ({ label, value, onSave, type = 'text', placeholder, icon: Icon, disabled = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) inputRef.current.focus();
  }, [isEditing]);

  const handleSave = async () => {
    if (editValue !== value) await onSave(editValue);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      {Icon && <DarkIconButton icon={Icon} variant="accent" />}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium mb-0.5" style={{ color: darkThemeColors.textMuted }}>{label}</p>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type={type}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={placeholder}
              className="flex-1 text-sm font-semibold bg-transparent border-b focus:outline-none"
              style={{ 
                color: darkThemeColors.textPrimary, 
                borderColor: darkThemeColors.accent 
              }}
            />
            <button 
              onClick={handleSave} 
              className="p-1 rounded"
              style={{ color: darkThemeColors.accent }}
            >
              <Save className="w-4 h-4" />
            </button>
            <button 
              onClick={() => { setEditValue(value || ''); setIsEditing(false); }} 
              className="p-1 rounded"
              style={{ color: darkThemeColors.textMuted }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <p className="text-sm font-semibold truncate" style={{ color: darkThemeColors.textPrimary }}>
            {value || <span style={{ color: darkThemeColors.textMuted }}>Not set</span>}
          </p>
        )}
      </div>
      {!isEditing && !disabled && (
        <button 
          onClick={() => setIsEditing(true)} 
          className="p-2 rounded-lg transition-colors"
          style={{ color: darkThemeColors.textMuted }}
        >
          <Edit2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// KYC Document Item
const KYCDocumentItem = ({ title, status, icon: Icon }) => (
  <div 
    className="flex items-center gap-3 px-4 py-3"
    style={{ borderBottom: `1px solid ${darkThemeColors.border}` }}
  >
    <DarkIconButton 
      icon={Icon} 
      variant={status === 'approved' ? 'accent' : status === 'pending' || status === 'submitted' ? 'accent' : 'muted'}
      size="sm"
      style={status === 'pending' || status === 'submitted' ? { opacity: 0.6 } : {}}
    />
    <span className="flex-1 text-sm" style={{ color: darkThemeColors.textSecondary }}>{title}</span>
    {status === 'approved' ? (
      <CheckCircle2 className="w-4 h-4" style={{ color: darkThemeColors.accent }} />
    ) : status === 'pending' || status === 'submitted' ? (
      <span 
        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
        style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}
      >
        Pending
      </span>
    ) : (
      <span 
        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
        style={{ background: darkThemeColors.border, color: darkThemeColors.textMuted }}
      >
        Not uploaded
      </span>
    )}
  </div>
);

// Change Password Modal
const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return; }
    if (newPassword.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      await userApi.changePassword({ current_password: currentPassword, new_password: newPassword });
      toast.success('Password changed successfully');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to change password');
    } finally { setLoading(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 backdrop-blur-sm" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={onClose} />
      <div 
        className="relative rounded-2xl p-6 w-full max-w-sm shadow-2xl"
        style={{ background: darkThemeColors.cardBg, border: `1px solid ${darkThemeColors.border}` }}
      >
        <h2 className="text-lg font-bold mb-4" style={{ color: darkThemeColors.textPrimary }}>Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: darkThemeColors.textMuted }}>Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full h-11 px-4 pr-10 rounded-xl bg-transparent"
                style={{ border: `1px solid ${darkThemeColors.border}`, color: darkThemeColors.textPrimary }}
                required
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: darkThemeColors.textMuted }}>
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: darkThemeColors.textMuted }}>New Password</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-11 px-4 pr-10 rounded-xl bg-transparent"
                style={{ border: `1px solid ${darkThemeColors.border}`, color: darkThemeColors.textPrimary }}
                required
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: darkThemeColors.textMuted }}>
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: darkThemeColors.textMuted }}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-transparent"
              style={{ border: `1px solid ${darkThemeColors.border}`, color: darkThemeColors.textPrimary }}
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button 
              type="button" 
              onClick={onClose} 
              className="flex-1 h-11 rounded-xl"
              style={{ background: 'transparent', border: `1px solid ${darkThemeColors.border}`, color: darkThemeColors.textSecondary }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading} 
              className="flex-1 h-11 rounded-xl"
              style={{ background: darkThemeColors.accent, color: darkThemeColors.background }}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Contact Support Modal
const ContactSupportModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const contactOptions = [
    { icon: Phone, title: 'Call Us', subtitle: '+254 700 123 456', href: 'tel:+254700123456' },
    { icon: Mail, title: 'Email Us', subtitle: 'support@eaziwage.com', href: 'mailto:support@eaziwage.com' },
    { icon: MessageCircle, title: 'WhatsApp', subtitle: '+254 700 123 456', href: 'https://wa.me/254700123456' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center px-4 pb-4">
      <div className="absolute inset-0 backdrop-blur-sm" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={onClose} />
      <div 
        className="relative rounded-2xl p-6 w-full max-w-sm shadow-2xl"
        style={{ background: darkThemeColors.cardBg, border: `1px solid ${darkThemeColors.border}` }}
      >
        <h2 className="text-lg font-bold mb-2" style={{ color: darkThemeColors.textPrimary }}>Contact Support</h2>
        <p className="text-sm mb-6" style={{ color: darkThemeColors.textSecondary }}>Our team is here to help you 24/7</p>
        
        <div className="space-y-3">
          {contactOptions.map((opt, i) => (
            <a 
              key={i}
              href={opt.href}
              target={opt.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl transition-colors"
              style={{ background: darkThemeColors.accentGlow }}
            >
              <DarkIconButton icon={opt.icon} variant="accent" />
              <div>
                <p className="font-semibold" style={{ color: darkThemeColors.textPrimary }}>{opt.title}</p>
                <p className="text-sm" style={{ color: darkThemeColors.accent }}>{opt.subtitle}</p>
              </div>
            </a>
          ))}
        </div>
        
        <p className="text-xs text-center mt-4" style={{ color: darkThemeColors.textMuted }}>Available Mon-Fri 8AM-8PM EAT</p>
        
        <Button 
          onClick={onClose} 
          className="w-full mt-4 h-11 rounded-xl"
          style={{ background: 'transparent', border: `1px solid ${darkThemeColors.border}`, color: darkThemeColors.textSecondary }}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

// Help Center Section
const HelpCenterSection = ({ isExpanded, onToggle }) => {
  const faqs = [
    { q: "How do I request a wage advance?", a: "Go to the 'Advance' tab, select your desired amount, choose your disbursement method, and tap 'Transfer'." },
    { q: "What are the fees?", a: "Our fees range from 3.5% to 6.5% depending on your employer's plan. The exact fee is shown before confirmation." },
    { q: "How much can I access?", a: "You can access up to 50% of your earned wages at any time. Your available balance updates as you earn." },
    { q: "When will my KYC be approved?", a: "KYC verification typically takes 1-2 business days. You'll receive a notification once verified." },
  ];

  return (
    <DarkCard className="overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
        <DarkIconButton icon={HelpCircle} variant="accent" />
        <div className="flex-1">
          <p className="text-sm font-semibold" style={{ color: darkThemeColors.textPrimary }}>Help Center</p>
          <p className="text-xs" style={{ color: darkThemeColors.textSecondary }}>FAQs and guides</p>
        </div>
        <ChevronDown 
          className={cn("w-5 h-5 transition-transform", isExpanded && "rotate-180")} 
          style={{ color: darkThemeColors.textMuted }}
        />
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 max-h-80 overflow-y-auto">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl p-3" style={{ background: darkThemeColors.cardBgHover }}>
              <p className="font-semibold text-sm mb-1" style={{ color: darkThemeColors.textPrimary }}>{faq.q}</p>
              <p className="text-xs leading-relaxed" style={{ color: darkThemeColors.textSecondary }}>{faq.a}</p>
            </div>
          ))}
        </div>
      )}
    </DarkCard>
  );
};

// Terms & Privacy Section
const TermsPrivacySection = ({ isExpanded, onToggle }) => (
  <DarkCard className="overflow-hidden">
    <button onClick={onToggle} className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
      <DarkIconButton icon={Scale} variant="accent" />
      <div className="flex-1">
        <p className="text-sm font-semibold" style={{ color: darkThemeColors.textPrimary }}>Terms & Privacy</p>
        <p className="text-xs" style={{ color: darkThemeColors.textSecondary }}>Legal information</p>
      </div>
      <ChevronDown 
        className={cn("w-5 h-5 transition-transform", isExpanded && "rotate-180")} 
        style={{ color: darkThemeColors.textMuted }}
      />
    </button>
    
    {isExpanded && (
      <div className="px-4 pb-4 max-h-80 overflow-y-auto space-y-3">
        <div className="rounded-xl p-4" style={{ background: darkThemeColors.cardBgHover }}>
          <h4 className="font-bold text-sm mb-2" style={{ color: darkThemeColors.textPrimary }}>Terms of Service</h4>
          <p className="text-xs leading-relaxed" style={{ color: darkThemeColors.textSecondary }}>
            By using EaziWage, you agree to our terms. Service fees range from 3.5%-6.5%. 
            Advances are automatically deducted from your next salary. Must be 18+ and employed by a participating employer.
          </p>
        </div>
        <div className="rounded-xl p-4" style={{ background: darkThemeColors.cardBgHover }}>
          <h4 className="font-bold text-sm mb-2" style={{ color: darkThemeColors.textPrimary }}>Privacy Policy</h4>
          <p className="text-xs leading-relaxed" style={{ color: darkThemeColors.textSecondary }}>
            We protect your data with bank-grade encryption. We collect personal, employment, and financial info to provide services. 
            We never sell your data. Contact support@eaziwage.com for data requests.
          </p>
        </div>
      </div>
    )}
  </DarkCard>
);

// Biometric Scan Modal (UI only)
const BiometricScanModal = ({ isOpen, onClose, onSuccess }) => {
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanComplete(true);
      setTimeout(() => { onSuccess(); onClose(); setScanComplete(false); }, 1500);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 backdrop-blur-sm" style={{ background: 'rgba(0,0,0,0.8)' }} onClick={onClose} />
      <div 
        className="relative rounded-2xl p-6 w-full max-w-sm shadow-2xl"
        style={{ background: darkThemeColors.cardBg, border: `1px solid ${darkThemeColors.border}` }}
      >
        <h2 className="text-lg font-bold mb-2 text-center" style={{ color: darkThemeColors.textPrimary }}>Face Verification</h2>
        <p className="text-sm mb-4 text-center" style={{ color: darkThemeColors.textSecondary }}>Position your face within the circle</p>
        
        <div className="relative mx-auto w-48 h-48 mb-4">
          <div 
            className="w-full h-full rounded-full flex items-center justify-center"
            style={{ 
              background: darkThemeColors.cardBgHover,
              border: `4px solid ${scanning ? darkThemeColors.accent : scanComplete ? darkThemeColors.accent : darkThemeColors.border}`
            }}
          >
            {scanComplete ? (
              <CheckCircle2 className="w-20 h-20" style={{ color: darkThemeColors.accent }} />
            ) : (
              <ScanFace className="w-16 h-16" style={{ color: darkThemeColors.textMuted }} />
            )}
          </div>
        </div>
        
        <p className="text-xs text-center mb-4" style={{ color: darkThemeColors.textMuted }}>
          {scanning ? 'Scanning...' : scanComplete ? 'Verification successful!' : 'Make sure your face is well-lit'}
        </p>
        
        {!scanComplete && (
          <div className="flex gap-3">
            <Button 
              onClick={onClose} 
              className="flex-1 h-11 rounded-xl"
              style={{ background: 'transparent', border: `1px solid ${darkThemeColors.border}`, color: darkThemeColors.textSecondary }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleScan} 
              disabled={scanning}
              className="flex-1 h-11 rounded-xl"
              style={{ background: darkThemeColors.accent, color: darkThemeColors.background }}
            >
              {scanning ? 'Scanning...' : 'Start Scan'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function SettingsPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('eaziwage_user') || '{}');
  
  // Modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Expandable sections
  const [helpExpanded, setHelpExpanded] = useState(false);
  const [termsExpanded, setTermsExpanded] = useState(false);
  
  // Settings states
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const notifications = [
    { type: 'success', title: 'KYC Submitted', message: 'Your documents are under review', time: '2 hours ago' },
    { type: 'info', title: 'Welcome to EaziWage', message: 'Complete your profile to start', time: '1 day ago' },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userApi.getFullProfile();
        setProfile(response.data);
      } catch (err) {
        try {
          const empResponse = await employeeApi.getMe();
          setProfile({ employee: empResponse.data, ...user });
        } catch (e) { console.error('Failed to fetch profile:', e); }
      } finally { setLoading(false); }
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
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Please upload a JPEG, PNG, or WebP image'); return;
    }
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be less than 2MB'); return; }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await userApi.uploadProfilePicture(formData);
      setProfile(prev => ({ ...prev, profile_picture_url: response.data.profile_picture_url }));
      toast.success('Profile picture updated!');
    } catch (err) { toast.error('Failed to upload profile picture'); }
    finally { setUploading(false); }
  };

  const handleUserSettingsSave = async (field, value) => {
    try {
      await userApi.updateSettings({ [field]: value });
      setProfile(prev => ({ ...prev, [field]: value }));
      toast.success('Setting updated!');
    } catch (err) { toast.error('Failed to update setting'); }
  };

  const handleEmployeeSettingsSave = async (field, value) => {
    try {
      await employeeApi.updateSettings({ [field]: value });
      setProfile(prev => ({ ...prev, employee: { ...prev.employee, [field]: value } }));
      toast.success('Setting updated!');
    } catch (err) { toast.error('Failed to update setting'); }
  };

  if (loading) {
    return (
      <EmployeeDarkLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div 
            className="w-12 h-12 border-4 rounded-full animate-spin"
            style={{ borderColor: `${darkThemeColors.accent}30`, borderTopColor: darkThemeColors.accent }}
          />
        </div>
      </EmployeeDarkLayout>
    );
  }

  const employee = profile?.employee;
  const kycDocs = profile?.kyc_documents || [];
  const getDocStatus = (docType) => {
    const doc = kycDocs.find(d => d.document_type === docType);
    return doc?.status || (employee?.[docType] ? 'submitted' : null);
  };

  return (
    <EmployeeDarkLayout>
      <SettingsHeader 
        onNotificationsClick={() => setShowNotifications(true)}
        notificationCount={notifications.length}
      />

      <main className="relative z-10 max-w-md mx-auto px-4 pb-28 space-y-4">
        {/* Profile Card */}
        <DarkCard className="overflow-hidden">
          <div 
            className="h-20 relative"
            style={{ background: `linear-gradient(135deg, ${darkThemeColors.accent}, #10b981)` }}
          >
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />
          </div>
          
          <div className="px-5 pb-5 -mt-10 relative">
            <div className="relative inline-block">
              <div 
                className="h-20 w-20 rounded-2xl p-1 shadow-xl"
                style={{ background: darkThemeColors.cardBg }}
              >
                {profile?.profile_picture_url ? (
                  <img 
                    src={`${BACKEND_URL}${profile.profile_picture_url}`} 
                    alt="Profile" 
                    className="w-full h-full rounded-xl object-cover"
                  />
                ) : (
                  <div 
                    className="w-full h-full rounded-xl flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${darkThemeColors.accent}, #10b981)` }}
                  >
                    <span className="font-bold text-2xl" style={{ color: darkThemeColors.background }}>
                      {profile?.full_name?.[0] || user?.full_name?.[0] || 'U'}
                    </span>
                  </div>
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg transition-opacity disabled:opacity-50"
                style={{ background: darkThemeColors.accent }}
                data-testid="upload-profile-pic"
              >
                {uploading ? (
                  <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: `${darkThemeColors.background}30`, borderTopColor: darkThemeColors.background }} />
                ) : (
                  <Camera className="w-4 h-4" style={{ color: darkThemeColors.background }} />
                )}
              </button>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleProfilePictureUpload} className="hidden" />
            </div>

            <div className="mt-3">
              <h1 className="text-xl font-bold" style={{ color: darkThemeColors.textPrimary }}>
                {profile?.full_name || user?.full_name || 'User'}
              </h1>
              <p className="text-sm" style={{ color: darkThemeColors.textSecondary }}>
                {employee?.employer_name || 'Employee'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span 
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: employee?.kyc_status === 'approved' ? darkThemeColors.accentGlow : 'rgba(245, 158, 11, 0.15)',
                    color: employee?.kyc_status === 'approved' ? darkThemeColors.accent : '#f59e0b'
                  }}
                >
                  {employee?.kyc_status === 'approved' ? (
                    <><CheckCircle2 className="w-3 h-3" /> Verified</>
                  ) : (
                    <><Shield className="w-3 h-3" /> {employee?.kyc_status || 'Pending'}</>
                  )}
                </span>
                {employee?.job_title && (
                  <span className="text-xs" style={{ color: darkThemeColors.textMuted }}>• {employee.job_title}</span>
                )}
              </div>
            </div>
          </div>
        </DarkCard>

        {/* Personal Information */}
        <DarkCard>
          <DarkSectionHeader title="Personal Information" className="px-4 pt-4" />
          <div style={{ borderTop: `1px solid ${darkThemeColors.border}` }}>
            <EditableField label="Full Name" value={profile?.full_name} onSave={(val) => handleUserSettingsSave('full_name', val)} icon={User} />
            <div style={{ borderTop: `1px solid ${darkThemeColors.border}` }}>
              <EditableField label="Email" value={profile?.email} icon={Mail} disabled onSave={() => {}} />
            </div>
            <div style={{ borderTop: `1px solid ${darkThemeColors.border}` }}>
              <EditableField label="Phone Number" value={profile?.phone} onSave={(val) => handleUserSettingsSave('phone', val)} icon={Phone} />
            </div>
          </div>
        </DarkCard>

        {/* Payment Methods */}
        <DarkCard>
          <DarkSectionHeader title="Payment Methods" className="px-4 pt-4" />
          <div style={{ borderTop: `1px solid ${darkThemeColors.border}` }}>
            <DarkSettingsItem 
              icon={Smartphone} 
              title="Mobile Money"
              subtitle={employee?.mobile_money_provider && employee?.mobile_money_number 
                ? `${employee.mobile_money_provider} · ${employee.mobile_money_number}` 
                : 'Not configured'}
              rightContent={employee?.mobile_money_provider && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1"
                  style={{ background: darkThemeColors.accentGlow, color: darkThemeColors.accent }}>
                  <CheckCircle2 className="w-3 h-3" /> Active
                </span>
              )}
              showChevron={false}
            />
            <div style={{ borderTop: `1px solid ${darkThemeColors.border}` }}>
              <DarkSettingsItem 
                icon={CreditCard} 
                title="Bank Account"
                subtitle={employee?.bank_name && employee?.bank_account 
                  ? `${employee.bank_name} · ••••${employee.bank_account?.slice(-4)}` 
                  : 'Not configured'}
                rightContent={employee?.bank_name && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1"
                    style={{ background: darkThemeColors.accentGlow, color: darkThemeColors.accent }}>
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                )}
                showChevron={false}
              />
            </div>
          </div>
        </DarkCard>

        {/* KYC Documents */}
        <DarkCard>
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <DarkSectionHeader title="KYC Documents" className="mb-0" />
            <Link to="/employee/onboarding" className="text-xs font-semibold flex items-center gap-1" style={{ color: darkThemeColors.accent }}>
              Manage <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div style={{ borderTop: `1px solid ${darkThemeColors.border}` }}>
            <KYCDocumentItem title="National ID / Passport" status={getDocStatus('id_front') || (employee?.id_document_front ? 'submitted' : null)} icon={IdCard} />
            <KYCDocumentItem title="Proof of Address" status={getDocStatus('address_proof') || (employee?.address_proof ? 'submitted' : null)} icon={MapPin} />
            <KYCDocumentItem title="Payslips" status={getDocStatus('payslip_1') || (employee?.payslip_1 ? 'submitted' : null)} icon={FileText} />
            <KYCDocumentItem title="Employment Contract" status={getDocStatus('employment_contract') || (employee?.employment_contract ? 'submitted' : null)} icon={FileText} />
            <KYCDocumentItem title="Selfie Verification" status={getDocStatus('selfie') || (employee?.selfie ? 'submitted' : null)} icon={Camera} />
          </div>
        </DarkCard>

        {/* Security */}
        <DarkCard>
          <DarkSectionHeader title="Security" className="px-4 pt-4" />
          <div style={{ borderTop: `1px solid ${darkThemeColors.border}` }}>
            <DarkSettingsItem icon={Lock} title="Change Password" subtitle="Update your password" onClick={() => setShowPasswordModal(true)} />
            <div style={{ borderTop: `1px solid ${darkThemeColors.border}` }} className="flex items-center gap-3 px-4 py-3.5">
              <DarkIconButton icon={ScanFace} variant="accent" />
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: darkThemeColors.textPrimary }}>Face ID / Biometric</p>
                <p className="text-xs" style={{ color: darkThemeColors.textSecondary }}>Quick & secure login</p>
              </div>
              <DarkToggleSwitch 
                id="biometric" 
                checked={biometricEnabled} 
                onChange={() => biometricEnabled ? setBiometricEnabled(false) : setShowBiometricModal(true)} 
              />
            </div>
          </div>
        </DarkCard>

        {/* Preferences */}
        <DarkCard>
          <DarkSectionHeader title="Preferences" className="px-4 pt-4" />
          <div style={{ borderTop: `1px solid ${darkThemeColors.border}` }}>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <DarkIconButton icon={Bell} variant="accent" />
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: darkThemeColors.textPrimary }}>Push Notifications</p>
                <p className="text-xs" style={{ color: darkThemeColors.textSecondary }}>Transaction alerts</p>
              </div>
              <DarkToggleSwitch id="notifications" checked={notificationsEnabled} onChange={() => setNotificationsEnabled(!notificationsEnabled)} />
            </div>
          </div>
        </DarkCard>

        {/* Support Section */}
        <div className="space-y-3">
          <DarkSectionHeader title="Support" />
          <HelpCenterSection isExpanded={helpExpanded} onToggle={() => setHelpExpanded(!helpExpanded)} />
          <DarkCard>
            <DarkSettingsItem icon={MessageCircle} title="Contact Support" subtitle="Get help from our team" onClick={() => setShowSupportModal(true)} />
          </DarkCard>
          <TermsPrivacySection isExpanded={termsExpanded} onToggle={() => setTermsExpanded(!termsExpanded)} />
        </div>

        {/* Logout */}
        <div className="pt-2 pb-4">
          <button 
            onClick={handleLogout}
            className="w-full py-4 rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-2"
            style={{ 
              background: `linear-gradient(135deg, ${darkThemeColors.accent}, #10b981)`,
              color: darkThemeColors.background,
              boxShadow: `0 8px 24px ${darkThemeColors.accentGlow}`
            }}
            data-testid="logout-btn"
          >
            <LogOut className="w-5 h-5" /> Log Out
          </button>
          <p className="text-center text-[10px] mt-4" style={{ color: darkThemeColors.textMuted }}>Version 1.0.0 · EaziWage</p>
        </div>
      </main>

      {/* Modals */}
      <ChangePasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
      <ContactSupportModal isOpen={showSupportModal} onClose={() => setShowSupportModal(false)} />
      <BiometricScanModal isOpen={showBiometricModal} onClose={() => setShowBiometricModal(false)} onSuccess={() => { setBiometricEnabled(true); toast.success('Face ID enabled'); }} />
      <DarkNotificationsPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} notifications={notifications} />
    </EmployeeDarkLayout>
  );
}
