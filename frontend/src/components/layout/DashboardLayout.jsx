import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Building2, FileText, CreditCard, 
  Settings, LogOut, Shield, ChevronRight, Clock, Bell,
  Wallet, History, Upload, BarChart3, CheckCircle2
} from 'lucide-react';
import { cn, generateInitials } from '../../lib/utils';
import { logout } from '../../lib/auth';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';

const employeeLinks = [
  { href: '/employee', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/employee/advances', label: 'Request Advance', icon: Wallet },
  { href: '/employee/transactions', label: 'Transactions', icon: History },
  { href: '/employee/kyc', label: 'KYC Documents', icon: FileText },
  { href: '/employee/profile', label: 'Profile', icon: Settings },
];

const employerLinks = [
  { href: '/employer', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/employer/employees', label: 'Employees', icon: Users },
  { href: '/employer/payroll', label: 'Payroll', icon: Upload },
  { href: '/employer/advances', label: 'Advances', icon: CreditCard },
  { href: '/employer/reports', label: 'Reports', icon: BarChart3 },
  { href: '/employer/settings', label: 'Settings', icon: Settings },
];

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/employers', label: 'Employers', icon: Building2 },
  { href: '/admin/employees', label: 'Employees', icon: Users },
  { href: '/admin/advances', label: 'Advances', icon: CreditCard },
  { href: '/admin/kyc', label: 'KYC Review', icon: CheckCircle2 },
  { href: '/admin/risk-scoring', label: 'Risk Scoring', icon: Shield },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export const DashboardLayout = ({ children, role }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('eaziwage_user') || '{}');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = role === 'admin' ? adminLinks : role === 'employer' ? employerLinks : employeeLinks;
  const roleLabel = role === 'admin' ? 'Administrator' : role === 'employer' ? 'Employer Portal' : 'Employee Portal';

  return (
    <div className="min-h-screen bg-slate-50" data-testid={`${role}-dashboard`}>
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white z-40">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-800">
            <Link to="/" className="flex items-center gap-2" data-testid="sidebar-logo">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="font-heading font-bold text-xl">EaziWage</span>
            </Link>
            <p className="text-xs text-slate-400 mt-2">{roleLabel}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200",
                    isActive
                      ? "bg-primary text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  )}
                  data-testid={`nav-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-white">
                  {generateInitials(user.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.full_name}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors duration-200"
              data-testid="sidebar-logout-btn"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors duration-200" data-testid="notifications-btn">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
