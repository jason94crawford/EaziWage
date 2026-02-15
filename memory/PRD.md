# EaziWage - Earned Wage Access Platform PRD

## Product Overview
EaziWage is a full-stack earned wage access platform serving Kenya, Uganda, Tanzania, and Rwanda. The platform enables employees to access a portion of their earned wages before payday through mobile money and bank transfers.

## Core Features

### Authentication & User Management
- JWT-based custom authentication ✅
- Google OAuth integration (Emergent-managed) ✅
- Apple Login (MOCKED - Not implemented)
- Biometric Face ID (MOCKED - UI simulation only)
- Role-based access: Employee, Employer, Admin ✅

### Employee Features ✅ **LIGHT THEME**
- 7-Step KYC Onboarding Flow ✅
- Employee Dashboard ✅
- Request Advance Page ✅
- Transaction History ✅
- Profile & Settings ✅

### Employer Features ✅ COMPLETE
- 8-Step Comprehensive Onboarding Portal ✅
- Employer Portal (Post-Onboarding) ✅
  - Dashboard with consistent metrics ✅
  - Risk Insights Page with Request Review ✅
  - Employees Page with Pie Chart distribution ✅ **FIXED - Now using recharts**
  - Advances Page ✅
  - Reports Page with month selector ✅
  - Payroll Page with API status and EWA deduction ✅
  - Settings (read-only Company Info, Employer Code) ✅
  - Notifications Bell with dropdown ✅

### Admin Features ✅ **SIGNIFICANTLY ENHANCED (Feb 2026)**
- **Admin Dashboard** ✅
  - Platform Overview metrics
  - Alert Cards (Pending Employers, KYC Reviews, Risk Reviews)
  - Quick Actions grid
  - API Health Summary

- **Admin Employees Page** ✅ **ENHANCED WITH BULK ACTIONS**
  - Stats cards (Total, Active, Pending KYC, Suspended)
  - Search by name, ID, email, job title, employer
  - Filter buttons and KYC status dropdown
  - **BULK SELECTION** with select-all checkbox
  - **BULK ACTIONS BAR** with:
    - Bulk Activate All
    - Bulk Suspend All
    - Bulk Approve KYC
  - Employee Detail Modal with 4 tabs
  - Risk Score Override with audit trail

- **Admin Employers Page** ✅ **REDESIGNED WITH PURPLE THEME**
  - Stats cards (Total, Active, Pending, Total Employees)
  - Search by company name, email, code
  - Filter buttons (All, Active, Pending, Suspended) + Country dropdown
  - **BULK SELECTION** with checkboxes
  - **BULK ACTIONS** (Approve All, Suspend All)
  - **Employer Detail Modal** with 4 tabs:
    - Overview: Stats, Company Info, Contact Person
    - Employees: List of employer's employees
    - Advances: (Placeholder for detailed reports)
    - Actions: Approve/Suspend/Reject/Set Pending buttons

- **Fraud Detection Page** ✅ **FULLY FUNCTIONAL WITH BACKEND**
  - Stats cards (Total Rules, Active Rules, Flagged Transactions, High Risk)
  - **Detection Rules Tab**:
    - Rules persisted to MongoDB ✅
    - CRUD operations (Create, Read, Update, Delete) ✅
    - Rule toggle (enable/disable) ✅
    - 6 rules total (3 default + 3 employer manipulation)
  - **Employer Manipulation Detection** ✅ **NEW**:
    - EWA Limit Increase Detection (>60% limit)
    - Cooldown Reduction Alert (<3 days)
    - Bulk Settings Change (>3 changes/day)
  - **Flagged Transactions Tab**:
    - Real-time flagged advances from database
    - Review modal with decision dropdown
  - **Fraud Checking in Advance Creation** ✅:
    - Advances checked against enabled rules
    - Automatic flagging/blocking based on rule action

- **Risk Scoring Page** ✅ **COMPLETELY REBUILT**
  - Uses AdminPortalLayout with purple theme
  - **Risk Calculator Tab**:
    - Employer/Employee toggle tabs
    - Searchable dropdown with existing risk scores
    - Category-based scoring sliders (Legal, Financial, Operational, etc.)
    - Real-time score calculation
    - **Net Weighted Score for Employees** (40% Employer + 60% Employee)
    - Application fee calculation (3.5% + 3% × (1 - CRS/5))
    - Save risk score to database
  - **Verification Alerts Tab** ✅:
    - Bi-annual re-verification system (6 months)
    - Overdue reviews (immediate action)
    - Pending reviews (due within 60 days)
    - Click-to-review functionality

- **KYC Review Page** ✅ **UPDATED TO PURPLE THEME**
  - Uses AdminPortalLayout
  - Stats cards (Pending, Approved, Rejected, Total)
  - Document cards with employee names
  - Review modal with approve/reject

- **Advances Page** ✅ **UPDATED TO PURPLE THEME**
  - Uses AdminPortalLayout
  - Stats cards (Total, Pending, Disbursed, Fees)
  - Filter buttons
  - Detail modal with approve/reject/disburse actions

- **Review Management Page** ✅ **NEW**
  - Stats cards (Total, Pending, In Review, Resolved)
  - Status filters (All, Pending, In Review, Resolved) with badge counts
  - Type filter dropdown (All Types, Risk Score, KYC Review, Dispute, General)
  - Review request cards showing:
    - Subject, Employer name, Priority badge
    - Message preview, Type tag, Employee name (if applicable)
    - Status badge, Review button
  - **Review Detail Modal**:
    - Request details (type, priority, contact email, related employee)
    - Message from employer
    - Update Status dropdown
    - Response to Employer textarea
    - Internal Notes field (admin only)
    - Submit Response button

- **Reconciliation Page** ✅ **ENHANCED**
  - Summary stats with real data
  - Transaction reference tracking (EWA-YYYYMMDDHHMMSS-XXXXXXXX format)
  - Bulk reconciliation support
  - Per-employer breakdown with recoupment rates

- **Other Admin Pages** ✅
  - API Health Monitor

## API Endpoints

### Admin Employees
- `GET /api/admin/employees` - List all employees
- `GET /api/admin/employees/{id}` - Get employee detail with advances
- `PUT /api/admin/employees/{id}` - Update employee details
- `PATCH /api/admin/employees/{id}/status` - Update account status
- `PATCH /api/admin/employees/{id}/kyc` - Update KYC status
- `PATCH /api/admin/employees/{id}/risk-score` - Override risk score (supports risk_factors, last_verified_at)
- `POST /api/admin/employees/bulk-action` - Bulk actions (activate/suspend/approve_kyc) ✅

### Admin Employers
- `GET /api/admin/employers` - List all employers
- `GET /api/admin/employers/{id}` - Get employer detail ✅
- `PATCH /api/admin/employers/{id}/status` - Update employer status
- `PATCH /api/admin/employers/{id}/settings` - Update employer settings with fraud detection ✅ **NEW**
- `PATCH /api/admin/employers/{id}/risk-score` - Override risk score (supports risk_factors, last_verified_at)
- `POST /api/admin/employers/bulk-action` - Bulk actions (approve/suspend/reject) ✅

### Admin Review Management
- `GET /api/admin/review-requests` - List review requests
- `PATCH /api/admin/review-requests/{id}` - Update request status/response ✅

### Admin Fraud Detection ✅ **NEW - FULLY FUNCTIONAL**
- `GET /api/admin/fraud-rules` - List all fraud detection rules
- `POST /api/admin/fraud-rules` - Create new fraud rule
- `PUT /api/admin/fraud-rules/{id}` - Update fraud rule
- `DELETE /api/admin/fraud-rules/{id}` - Delete fraud rule
- `PATCH /api/admin/fraud-rules/{id}/toggle` - Toggle rule enabled status
- `GET /api/admin/advances/flagged` - Get flagged advances
- `PATCH /api/admin/advances/{id}/review` - Review flagged advance

### Admin Reconciliation ✅ **ENHANCED**
- `GET /api/admin/reconciliation` - Get reconciliation data by employer
- `GET /api/admin/reconciliation/summary` - Get reconciliation summary stats
- `GET /api/admin/reconciliation/transactions` - Get transaction list for reconciliation
- `POST /api/admin/reconciliation/reconcile/{id}` - Mark transaction as reconciled
- `POST /api/admin/reconciliation/dispute/{id}` - Mark transaction as disputed
- `POST /api/admin/reconciliation/bulk-reconcile` - Bulk reconcile transactions

## Test Credentials
- **Admin**: superadmin@eaziwage.com / Admin@12345
- **Employee**: demo.employee@eaziwage.com / Employee@123
- **Employer**: testemployer2@eaziwage.com / Employer@123

## Demo Data
- 9 employers with varying statuses
- 67 employees seeded across multiple employers
- 1 review request from Test Corp Ltd
- 6 fraud detection rules (3 default + 3 employer manipulation)

## Bug Fixes (Feb 2026)
- **Payroll Data Consistency**: Fixed mismatch between Dashboard and Payroll page Monthly Payroll values
- **Department Pie Chart**: Fixed by replacing custom SVG with recharts PieChart component
- **Table Column Alignment**: Fixed misaligned columns in Admin Employers and Employees tables

## Completed in Latest Session (Feb 2026)
1. ✅ Department Distribution Pie Chart - Now using recharts library with proper rendering
2. ✅ Fraud Detection Rules CRUD - Full backend integration with MongoDB persistence
3. ✅ Fraud checking integrated into advance creation flow
4. ✅ Reconciliation system enhanced with unique transaction references (EWA-XXXXXXXX)
5. ✅ Bulk action APIs for employees and employers
6. ✅ Updated Admin pages (Advances, KYC Review, Risk Scoring) to purple AdminPortalLayout
7. ✅ Fixed Risk Scoring dropdown - now uses admin API and finds employers/employees
8. ✅ Enhanced Risk Scoring with Net Weighted Score (40% Employer + 60% Employee)
9. ✅ Bi-annual Verification Alerts system with auto-flagging
10. ✅ Employer manipulation fraud detection (EWA limit, cooldown, bulk changes)
11. ✅ Fixed table column alignment in Employers and Employees admin pages
12. ✅ All tests passed (100% backend, 100% frontend)
13. ✅ **Mobile Responsiveness Fix (Feb 2026)** - Pricing, How It Works, Calculator pages now fully responsive

## Mobile Responsiveness Updates (Feb 2026)
### PricingPage.jsx
- Responsive hero text (text-3xl sm:text-5xl lg:text-6xl)
- Stacked pricing cards on mobile (grid-cols-1 md:grid-cols-2)
- Scrollable comparison table (min-w-[600px] with overflow-x-auto)
- Employer benefits grid stacks on mobile (grid-cols-1 sm:grid-cols-2)
- Responsive FAQ items and CTA buttons

### HowItWorksPage.jsx
- Responsive infographic components with sm: breakpoints
- Scaled down phone/building/chart graphics for mobile
- Benefits bar (grid-cols-2 md:grid-cols-4)
- Step sections stack on mobile (lg:grid-cols-2)
- Video section and FAQ properly sized

### CalculatorPage.jsx  
- Country selector (grid-cols-4 on mobile instead of flex row)
- Form inputs stack on mobile (grid-cols-1 sm:grid-cols-2)
- Responsive results panel with smaller text on mobile
- Trust section icons stack vertically on mobile

## Mocked Features
- Mobile Money APIs (M-PESA, Airtel Money, MTN MoMo)
- Bank Transfer APIs
- Apple Login
- Biometric Face Scan
- Live Payroll API (Auto Mode is simulated)

## Pending Tasks

### P0 - Completed This Session
- ✅ Mobile responsiveness for Pricing, How It Works, Calculator pages

### P1 - High Priority
- Implement full Employer Notifications page (not just bell icon)

### P2 - Medium Priority
- Real-time notifications via WebSocket
- Live Mobile Money API integration
- Apple Login integration
- Dual-role User Feature (Employer/Employee)

## Architecture
```
/app/
├── backend/
│   └── server.py
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── admin/
│       │   │   └── AdminLayout.jsx
│       │   ├── employer/
│       │   └── ui/
│       ├── pages/
│       │   ├── admin/
│       │   │   ├── Dashboard.jsx
│       │   │   ├── Employees.jsx      # Enhanced with bulk actions
│       │   │   ├── Employers.jsx      # Redesigned with purple theme
│       │   │   ├── FraudDetection.jsx # NEW
│       │   │   ├── ReviewManagement.jsx # NEW
│       │   │   ├── Reconciliation.jsx
│       │   │   └── APIHealth.jsx
│       │   ├── employer/
│       │   └── employee/
│       └── App.js
├── memory/
│   └── PRD.md
└── test_reports/
```

---
Last Updated: February 15, 2026
