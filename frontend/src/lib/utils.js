import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount, currency = 'KES') {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateString) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getRiskRatingColor(rating) {
  switch (rating?.toUpperCase()) {
    case 'A':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'B':
      return 'text-amber-600 bg-amber-50 border-amber-200';
    case 'C':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'D':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-slate-600 bg-slate-50 border-slate-200';
  }
}

export function getRiskRatingLabel(rating) {
  switch (rating?.toUpperCase()) {
    case 'A':
      return 'Low Risk';
    case 'B':
      return 'Medium Risk';
    case 'C':
      return 'High Risk';
    case 'D':
      return 'Very High Risk';
    default:
      return 'Not Scored';
  }
}

export function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'approved':
    case 'completed':
    case 'disbursed':
    case 'active':
      return 'bg-green-100 text-green-700';
    case 'pending':
    case 'submitted':
      return 'bg-amber-100 text-amber-700';
    case 'rejected':
    case 'failed':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

export function truncateText(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function generateInitials(name) {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function calculateFeePercentage(crsTotal) {
  const baseFee = 3.5;
  const riskAdjustment = 3.0;
  return baseFee + (riskAdjustment * (1 - crsTotal / 5));
}

export const COUNTRIES = [
  { code: 'KE', name: 'Kenya', currency: 'KES', mobileProviders: ['M-PESA', 'Airtel Money'] },
  { code: 'UG', name: 'Uganda', currency: 'UGX', mobileProviders: ['MTN Mobile Money', 'Airtel Money'] },
  { code: 'TZ', name: 'Tanzania', currency: 'TZS', mobileProviders: ['M-PESA', 'Tigo Pesa', 'Airtel Money'] },
  { code: 'RW', name: 'Rwanda', currency: 'RWF', mobileProviders: ['MTN Mobile Money', 'Airtel Money'] },
];

export const EMPLOYMENT_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
];

export const PAYROLL_CYCLES = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'bi-weekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export const DOCUMENT_TYPES = [
  { value: 'national_id', label: 'National ID Card' },
  { value: 'passport', label: 'Passport' },
  { value: 'tax_certificate', label: 'Tax Compliance Certificate' },
  { value: 'payslip', label: 'Recent Payslip' },
  { value: 'bank_statement', label: 'Bank Statement' },
  { value: 'employment_contract', label: 'Employment Contract' },
  { value: 'utility_bill', label: 'Utility Bill (Proof of Address)' },
];
