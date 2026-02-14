// Shared gradient icon components for Employer Portal
// Matches the website's "Get Started" button gradient: from-primary to-emerald-600
import { cn } from '../../lib/utils';

// Gradient Icon Box - matches website button gradient
export const GradientIconBox = ({ icon: Icon, size = 'md', className }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-14 h-14',
    xl: 'w-16 h-16',
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
    xl: 'w-8 h-8',
  };

  return (
    <div className={cn(
      sizes[size],
      "bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center shadow-md shadow-primary/20",
      className
    )}>
      <Icon className={cn(iconSizes[size], "text-white")} />
    </div>
  );
};

// Gradient Avatar - for employee initials
export const GradientAvatar = ({ initials, size = 'md', className }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base',
  };

  return (
    <div className={cn(
      sizes[size],
      "bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center shadow-md shadow-primary/20",
      className
    )}>
      <span className="text-white font-bold">{initials}</span>
    </div>
  );
};

// Gradient Button - matches website CTA buttons
export const GradientButton = ({ children, className, ...props }) => (
  <button 
    className={cn(
      "bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90",
      "text-white font-semibold rounded-xl shadow-lg shadow-primary/25",
      "transition-all duration-200 hover:scale-[1.02]",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

// Currency options for multi-country support
export const currencies = [
  { code: 'KES', symbol: 'Ksh', name: 'Kenyan Shilling', country: 'Kenya' },
  { code: 'UGX', symbol: 'UGX', name: 'Ugandan Shilling', country: 'Uganda' },
  { code: 'TZS', symbol: 'TZS', name: 'Tanzanian Shilling', country: 'Tanzania' },
  { code: 'RWF', symbol: 'RWF', name: 'Rwandan Franc', country: 'Rwanda' },
];

// Country options
export const countries = [
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
];

// Format currency with symbol
export const formatCurrencyWithSymbol = (amount, currencyCode = 'KES') => {
  const currency = currencies.find(c => c.code === currencyCode) || currencies[0];
  return `${currency.symbol} ${amount?.toLocaleString() || 0}`;
};
