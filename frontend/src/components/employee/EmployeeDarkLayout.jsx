import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Wallet, History, User, X } from 'lucide-react';
import { cn } from '../../lib/utils';

// Employee Dark Theme Color Palette
export const darkThemeColors = {
  background: '#0f0f1a',
  cardBg: '#1a1a2e',
  cardBgHover: '#252540',
  accent: '#0df259',
  accentGlow: 'rgba(13, 242, 89, 0.15)',
  textPrimary: '#ffffff',
  textSecondary: '#a0a0b0',
  textMuted: '#6b6b7b',
  border: '#2e2e48',
  success: '#0df259',
  warning: '#f59e0b',
  error: '#ef4444',
};

// Dark Theme Background with subtle grid
export const EmployeeDarkBackground = () => (
  <>
    {/* Base dark gradient */}
    <div 
      className="fixed inset-0 z-0"
      style={{
        background: `linear-gradient(135deg, ${darkThemeColors.background} 0%, #0a0a14 100%)`
      }}
    />
    {/* Subtle grid pattern */}
    <div 
      className="fixed inset-0 z-0 opacity-[0.03]"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }}
    />
    {/* Accent glow spots */}
    <div 
      className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none z-0"
      style={{ background: darkThemeColors.accentGlow }}
    />
    <div 
      className="fixed bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none z-0"
      style={{ background: 'rgba(13, 242, 89, 0.08)' }}
    />
  </>
);

// Dark Bottom Navigation
export const EmployeeDarkNav = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/employee' },
    { id: 'advance', icon: Wallet, label: 'Advance', path: '/employee/advances' },
    { id: 'history', icon: History, label: 'History', path: '/employee/transactions' },
    { id: 'profile', icon: User, label: 'Profile', path: '/employee/settings' },
  ];
  
  const isActive = (path) => location.pathname === path;

  return (
    <nav className={cn("fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 safe-area-bottom", className)}>
      <div className="max-w-md mx-auto">
        <div 
          className="rounded-2xl shadow-2xl border"
          style={{
            background: darkThemeColors.cardBg,
            borderColor: darkThemeColors.border,
            boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.4)'
          }}
        >
          <div className="flex items-center justify-around h-16 px-2">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className="relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full rounded-xl transition-all duration-300"
                  data-testid={`nav-${item.id}`}
                >
                  {/* Active indicator line */}
                  {active && (
                    <div 
                      className="absolute inset-x-3 -top-px h-0.5 rounded-full"
                      style={{ background: `linear-gradient(90deg, ${darkThemeColors.accent}, #10b981)` }}
                    />
                  )}
                  
                  {/* Icon container */}
                  <div 
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300",
                      active && "scale-105"
                    )}
                    style={active ? { background: darkThemeColors.accentGlow } : {}}
                  >
                    <item.icon 
                      className="w-5 h-5 transition-all duration-300"
                      style={{ color: active ? darkThemeColors.accent : darkThemeColors.textMuted }}
                    />
                  </div>
                  
                  {/* Label */}
                  <span 
                    className="text-[10px] font-medium transition-colors"
                    style={{ color: active ? darkThemeColors.accent : darkThemeColors.textMuted }}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Main Dark Layout Wrapper
export const EmployeeDarkLayout = ({ children, className, hideNav = false }) => (
  <div 
    className={cn("min-h-screen relative overflow-x-hidden", className)}
    style={{ background: darkThemeColors.background, color: darkThemeColors.textPrimary }}
  >
    <EmployeeDarkBackground />
    <div className="relative z-10">
      {children}
    </div>
    {!hideNav && <EmployeeDarkNav />}
  </div>
);

// Dark Card Component
export const DarkCard = ({ children, className, glow = false, ...props }) => (
  <div
    className={cn(
      "rounded-2xl border transition-all duration-300",
      glow && "shadow-lg",
      className
    )}
    style={{
      background: darkThemeColors.cardBg,
      borderColor: darkThemeColors.border,
      ...(glow && { boxShadow: `0 0 30px ${darkThemeColors.accentGlow}` })
    }}
    {...props}
  >
    {children}
  </div>
);

// Dark Icon Button with solid accent background
export const DarkIconButton = ({ icon: Icon, size = 'md', variant = 'accent', className, ...props }) => {
  const sizes = {
    sm: 'w-9 h-9',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const variants = {
    accent: {
      background: darkThemeColors.accent,
      color: '#0f0f1a',
    },
    muted: {
      background: darkThemeColors.border,
      color: darkThemeColors.textSecondary,
    },
    ghost: {
      background: 'transparent',
      color: darkThemeColors.textSecondary,
    }
  };

  return (
    <div 
      className={cn(
        sizes[size],
        "rounded-xl flex items-center justify-center shrink-0 transition-all duration-200",
        variant === 'accent' && "shadow-lg shadow-[#0df259]/25",
        className
      )}
      style={variants[variant]}
      {...props}
    >
      <Icon className={iconSizes[size]} />
    </div>
  );
};

// Dark Section Header
export const DarkSectionHeader = ({ title, className }) => (
  <h3 
    className={cn("text-xs font-bold tracking-widest uppercase px-1 mb-3", className)}
    style={{ color: darkThemeColors.textMuted }}
  >
    {title}
  </h3>
);

// Dark Settings Item Component
export const DarkSettingsItem = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  onClick, 
  rightContent, 
  showChevron = true,
  className 
}) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors rounded-xl",
      className
    )}
    style={{ 
      color: darkThemeColors.textPrimary,
    }}
    onMouseEnter={(e) => e.currentTarget.style.background = darkThemeColors.cardBgHover}
    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    data-testid={`settings-${title.toLowerCase().replace(/\s+/g, '-')}`}
  >
    <DarkIconButton icon={Icon} variant="accent" />
    <div className="flex flex-col items-start flex-1 min-w-0">
      <p className="text-sm font-semibold">{title}</p>
      {subtitle && (
        <p className="text-xs truncate max-w-full" style={{ color: darkThemeColors.textSecondary }}>
          {subtitle}
        </p>
      )}
    </div>
    {rightContent || (showChevron && (
      <svg 
        className="w-5 h-5" 
        style={{ color: darkThemeColors.textMuted }}
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    ))}
  </button>
);

// Dark Toggle Switch
export const DarkToggleSwitch = ({ checked, onChange, id }) => (
  <button
    id={id}
    onClick={onChange}
    className={cn(
      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300"
    )}
    style={{ 
      background: checked ? darkThemeColors.accent : darkThemeColors.border 
    }}
    data-testid={`toggle-${id}`}
  >
    <span 
      className={cn(
        "inline-block h-5 w-5 transform rounded-full shadow-lg transition-transform duration-300",
        checked ? "translate-x-[22px]" : "translate-x-0.5"
      )}
      style={{ background: darkThemeColors.textPrimary }}
    />
  </button>
);

// Notifications Panel for Dark Theme
export const DarkNotificationsPanel = ({ isOpen, onClose, notifications }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center sm:justify-end">
      <div 
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: 'rgba(0,0,0,0.6)' }}
        onClick={onClose} 
      />
      <div 
        className="relative rounded-2xl shadow-2xl w-[calc(100%-2rem)] sm:w-full max-w-sm overflow-hidden mt-4 mx-4 sm:mt-16 sm:mr-4"
        style={{
          background: darkThemeColors.cardBg,
          border: `1px solid ${darkThemeColors.border}`
        }}
      >
        <div 
          className="px-4 py-3 flex items-center justify-between"
          style={{ borderBottom: `1px solid ${darkThemeColors.border}` }}
        >
          <h3 className="font-bold" style={{ color: darkThemeColors.textPrimary }}>Notifications</h3>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: darkThemeColors.textMuted }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="max-h-[60vh] sm:max-h-80 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notif, i) => (
              <div 
                key={i} 
                className="px-4 py-3 last:border-0"
                style={{ borderBottom: `1px solid ${darkThemeColors.border}` }}
              >
                <div className="flex items-start gap-3">
                  <DarkIconButton 
                    icon={notif.type === 'success' ? () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> : () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>} 
                    size="sm"
                    variant="accent"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: darkThemeColors.textPrimary }}>{notif.title}</p>
                    <p className="text-xs break-words" style={{ color: darkThemeColors.textSecondary }}>{notif.message}</p>
                    <p className="text-[10px] mt-1" style={{ color: darkThemeColors.textMuted }}>{notif.time}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ background: darkThemeColors.border }}
              >
                <svg className="w-6 h-6" style={{ color: darkThemeColors.textMuted }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <p className="text-sm" style={{ color: darkThemeColors.textSecondary }}>No notifications yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDarkLayout;
