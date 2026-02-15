import React from 'react';
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

// Marketing Pages
import LandingPage from "./pages/marketing/LandingPage";
import HowItWorksPage from "./pages/marketing/HowItWorksPage";
import EmployersPage from "./pages/marketing/EmployersPage";
import EmployeesPage from "./pages/marketing/EmployeesPage";
import AboutPage from "./pages/marketing/AboutPage";
import PricingPage from "./pages/marketing/PricingPage";
import ContactPage from "./pages/marketing/ContactPage";
import PartnersPage from "./pages/marketing/PartnersPage";
import FAQPage from "./pages/marketing/FAQPage";
import BlogPage from "./pages/marketing/BlogPage";
import PrivacyPolicyPage from "./pages/marketing/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/marketing/TermsOfServicePage";
import CalculatorPage from "./pages/marketing/CalculatorPage";
import LegalPolicyPage from "./pages/marketing/LegalPolicyPage";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import AuthCallback from "./pages/auth/AuthCallback";

// Employee Pages
import EmployeeDashboard from "./pages/employee/Dashboard";
import EmployeeOnboarding from "./pages/employee/Onboarding";
import RequestAdvance from "./pages/employee/RequestAdvance";
import EmployeeTransactions from "./pages/employee/Transactions";
import EmployeeKYC from "./pages/employee/KYC";
import EmployeeSettings from "./pages/employee/Settings";

// Employer Pages
import EmployerDashboard from "./pages/employer/Dashboard";
import EmployerOnboarding from "./pages/employer/Onboarding";
import EmployerEmployees from "./pages/employer/Employees";
import EmployerPayroll from "./pages/employer/Payroll";
import EmployerAdvances from "./pages/employer/Advances";
import EmployerReports from "./pages/employer/Reports";
import EmployerSettings from "./pages/employer/Settings";
import EmployerRiskInsights from "./pages/employer/RiskInsights";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminEmployers from "./pages/admin/Employers";
import AdminEmployees from "./pages/admin/Employees";
import AdminAdvances from "./pages/admin/Advances";
import AdminKYCReview from "./pages/admin/KYCReview";
import AdminRiskScoring from "./pages/admin/RiskScoring";
import AdminReconciliation from "./pages/admin/Reconciliation";
import AdminAPIHealth from "./pages/admin/APIHealth";
import FraudDetection from "./pages/admin/FraudDetection";
import ReviewManagement from "./pages/admin/ReviewManagement";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('eaziwage_user') || 'null');
  const token = localStorage.getItem('eaziwage_token');

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'employer':
        return <Navigate to="/employer" replace />;
      case 'employee':
        return <Navigate to="/employee" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};

// Placeholder pages for routes not yet implemented
const PlaceholderPage = ({ title, description }) => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
    <div className="text-center max-w-md">
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <span className="text-2xl">🚧</span>
      </div>
      <h1 className="font-heading text-2xl font-bold text-slate-900 mb-2">{title}</h1>
      <p className="text-slate-500">{description}</p>
    </div>
  </div>
);

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Marketing / Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/employers" element={<EmployersPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          
          {/* Legal Policy Routes */}
          <Route path="/data-policy" element={<LegalPolicyPage />} />
          <Route path="/abc-policy" element={<LegalPolicyPage />} />
          <Route path="/code-of-ethics" element={<LegalPolicyPage />} />
          <Route path="/gifts-policy" element={<LegalPolicyPage />} />
          <Route path="/aml-cft-policy" element={<LegalPolicyPage />} />
          <Route path="/whistleblowing-policy" element={<LegalPolicyPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Employee Routes */}
          <Route path="/employee" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeDashboard />
            </ProtectedRoute>
          } />
          <Route path="/employee/onboarding" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeOnboarding />
            </ProtectedRoute>
          } />
          <Route path="/employee/advances" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <RequestAdvance />
            </ProtectedRoute>
          } />
          <Route path="/employee/transactions" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeTransactions />
            </ProtectedRoute>
          } />
          <Route path="/employee/kyc" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeKYC />
            </ProtectedRoute>
          } />
          <Route path="/employee/profile" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeSettings />
            </ProtectedRoute>
          } />
          <Route path="/employee/settings" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeSettings />
            </ProtectedRoute>
          } />

          {/* Employer Routes */}
          <Route path="/employer" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <EmployerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/employer/onboarding" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <EmployerOnboarding />
            </ProtectedRoute>
          } />
          <Route path="/employer/employees" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <EmployerEmployees />
            </ProtectedRoute>
          } />
          <Route path="/employer/payroll" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <EmployerPayroll />
            </ProtectedRoute>
          } />
          <Route path="/employer/advances" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <EmployerAdvances />
            </ProtectedRoute>
          } />
          <Route path="/employer/reports" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <EmployerReports />
            </ProtectedRoute>
          } />
          <Route path="/employer/settings" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <EmployerSettings />
            </ProtectedRoute>
          } />
          <Route path="/employer/risk-insights" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <EmployerRiskInsights />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/employers" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminEmployers />
            </ProtectedRoute>
          } />
          <Route path="/admin/employees" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminEmployees />
            </ProtectedRoute>
          } />
          <Route path="/admin/advances" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminAdvances />
            </ProtectedRoute>
          } />
          <Route path="/admin/reconciliation" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminReconciliation />
            </ProtectedRoute>
          } />
          <Route path="/admin/kyc-review" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminKYCReview />
            </ProtectedRoute>
          } />
          <Route path="/admin/kyc" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminKYCReview />
            </ProtectedRoute>
          } />
          <Route path="/admin/risk-scoring" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminRiskScoring />
            </ProtectedRoute>
          } />
          <Route path="/admin/api-health" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminAPIHealth />
            </ProtectedRoute>
          } />
          <Route path="/admin/fraud-detection" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <FraudDetection />
            </ProtectedRoute>
          } />
          <Route path="/admin/review-management" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ReviewManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PlaceholderPage title="Settings" description="System settings" />
            </ProtectedRoute>
          } />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
