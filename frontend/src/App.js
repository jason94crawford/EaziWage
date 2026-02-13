import React from 'react';
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

// Marketing Pages
import LandingPage from "./pages/marketing/LandingPage";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Employee Pages
import EmployeeDashboard from "./pages/employee/Dashboard";
import EmployeeOnboarding from "./pages/employee/Onboarding";
import RequestAdvance from "./pages/employee/RequestAdvance";
import EmployeeTransactions from "./pages/employee/Transactions";
import EmployeeKYC from "./pages/employee/KYC";

// Employer Pages
import EmployerDashboard from "./pages/employer/Dashboard";
import EmployerOnboarding from "./pages/employer/Onboarding";
import EmployerEmployees from "./pages/employer/Employees";
import EmployerPayroll from "./pages/employer/Payroll";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminEmployers from "./pages/admin/Employers";
import AdminAdvances from "./pages/admin/Advances";
import AdminKYCReview from "./pages/admin/KYCReview";
import AdminRiskScoring from "./pages/admin/RiskScoring";

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
          <Route path="/how-it-works" element={<PlaceholderPage title="How it Works" description="Step-by-step guide to using EaziWage" />} />
          <Route path="/employers" element={<PlaceholderPage title="For Employers" description="Learn how EaziWage benefits your company" />} />
          <Route path="/pricing" element={<PlaceholderPage title="Pricing" description="Transparent fee structure" />} />
          <Route path="/about" element={<PlaceholderPage title="About Us" description="Our mission to empower African workers" />} />
          <Route path="/contact" element={<PlaceholderPage title="Contact Us" description="Get in touch with our team" />} />
          <Route path="/partners" element={<PlaceholderPage title="Partners" description="Join our partner ecosystem" />} />
          <Route path="/privacy" element={<PlaceholderPage title="Privacy Policy" description="How we protect your data" />} />
          <Route path="/terms" element={<PlaceholderPage title="Terms of Service" description="Terms and conditions" />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

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
              <PlaceholderPage title="Profile" description="Manage your profile settings" />
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
              <PlaceholderPage title="Advances" description="View employee wage advances" />
            </ProtectedRoute>
          } />
          <Route path="/employer/reports" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <PlaceholderPage title="Reports" description="Analytics and reporting" />
            </ProtectedRoute>
          } />
          <Route path="/employer/settings" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <PlaceholderPage title="Settings" description="Company settings" />
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
              <PlaceholderPage title="Employees" description="Manage all employees" />
            </ProtectedRoute>
          } />
          <Route path="/admin/advances" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminAdvances />
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
