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

### Employee Features ✅ **LIGHT THEME (Feb 14, 2026)**
- **7-Step KYC Onboarding Flow** ✅
- **Employee Dashboard** ✅
- **Request Advance Page** ✅
- **Transaction History** ✅
- **Profile & Settings** ✅
  - Profile picture upload - shown in header bubble

**Note:** Dark theme redesign was attempted and reverted. Employee portal uses light theme.

### Employer Features ✅ COMPLETE (Feb 15, 2026)
- **8-Step Comprehensive Onboarding Portal** ✅
  
- **Employer Portal (Post-Onboarding)** ✅ **UPDATED Feb 15, 2026**
  - **Dashboard** ✅
    - Metrics: Advances This Month, Avg Fee Rate %, Monthly Payroll, Avg Advance
    - Risk Assessment card linked to Risk Insights page
    - Removed: View Status button (when pending), Pending Advances metric
  
  - **Risk Insights Page** ✅ **NEW Feb 15, 2026**
    - Composite Risk Score with circular progress
    - Risk Rating Badge (A/B/C/D)
    - 5 Category breakdown with expandable tips
    - Fee Impact visualization
    - How to Improve section
  
  - **Employees Page** ✅ **UPDATED Feb 15, 2026**
    - Department Distribution with Pie Chart visualization
    - Employee View Modal (click View to see details)
    - Green themed date selectors
    - EWA Settings modal per employee
  
  - **Advances Page** ✅ **UPDATED Feb 15, 2026**
    - Filters: All, Approved, Disbursed, Rejected (Pending removed - advances are automated)
    - Green themed date selectors
  
  - **Reports Page** ✅ **UPDATED Feb 15, 2026**
    - Month selector for filtering by month
    - Monthly Summary: Total Requests, Disbursed, Rejected, Total Amount (Pending Review removed)
  
  - **Payroll Page** ✅ **UPDATED Feb 15, 2026**
    - Live API Connection Status card (shows Manual Mode or Connected)
    - Monthly EWA Deduction summary (principal + platform fees)
    - Manual upload only with Admin approval
  
  - **Settings Page** ✅ **UPDATED Feb 15, 2026**
    - Company Name: Read-only (contact support to change)
    - Payroll Cycle: Read-only (contact support to change)
    - Employer Code: Unique identifier shown in green box (non-editable)
    - KYC Documents section
  
  - **Notifications** ✅ **FUNCTIONAL Feb 15, 2026**
    - Bell icon dropdown with notifications
    - Shows unread count
    - Links to View All Notifications
    - File upload with drag & drop
    - Upload process steps (4 steps)
    - Payroll history
    - Integration info card
  
  - **Advances Page** ✅
    - Stats cards with totals
    - Search and filter functionality
    - Advance list with status badges
    - "How Advances Work" info card
  
  - **Reports Page** ✅
    - Period selector
    - Donut chart for disbursement breakdown
    - Employee breakdown with progress bars
    - Monthly summary
    - Downloadable reports
  
  - **Settings Page** ✅ **ENHANCED Feb 14, 2026**
    - **7 Tabs:**
      1. **Company** - Name, payroll cycle, **Business Address** (Physical, City, Postal, County, Country), Primary Contact
      2. **KYC & Documents** (NEW) - View/edit documents, bank account changes require approval
      3. **EWA Settings** - Default advance limits, access period, cooldown
      4. **Notifications** - 4 toggles with toast messages
      5. **Help Centre** (NEW) - FAQ accordion, contact info, resources
      6. **Terms & Privacy** (NEW) - Legal documents, download PDFs
      7. **Security** - Password, 2FA, Login Activity, API Access

### Design System
- **Solid Green Icons (#0df259)** with white icons throughout ✅
- Glass-morphism effects
- Dark/Light mode toggle
- Mobile responsive with collapsible sidebar
- **Contact Support Modal** - Opens from sidebar ✅

### Admin Features (Partially Implemented)
- Admin dashboard ✅
- Employee verification (Basic) ✅

## API Endpoints

### Employer Portal (NEW)
- `GET /api/dashboard/employer/extended` - Extended dashboard with retention metrics
- `GET /api/employees/{id}/ewa-settings` - Get employee EWA settings
- `PUT /api/employees/{id}/ewa-settings` - Update employee EWA settings
- `POST /api/seed/demo-employees` - Seed 60 demo employees
- `PUT /api/employers/me/address` - Update employer address
- `POST /api/employers/me/bank-change-request` - Request bank change (requires approval)

## Test Credentials
- **Admin**: superadmin@eaziwage.com / Admin@12345
- **Employee**: demo.employee@eaziwage.com / Employee@123
- **Employer**: testemployer2@eaziwage.com / Employer@123

## Demo Data
- 60 employees seeded with:
  - Varying salaries (30k-150k KES)
  - Varying tenures (1 month - 5 years)
  - 10 departments
  - Mixed KYC statuses
  - 30% have custom EWA settings
  - Advance history for approved employees

## Completed Work - Feb 14, 2026

### Session Summary - Employee Portal Redesign
1. ✅ **Complete Employee Portal Dark Theme Redesign**
   - Dashboard: Speed dial balance, stats grid, account status, recent activity
   - Settings: Profile card, personal info, payment methods, KYC docs, security, preferences, support
   - Request Advance: Amount selector, transaction summary, disbursement method selector
   - Transactions: Stats cards, filter buttons, transaction list with status badges
   
2. ✅ **New Dark Theme Design System** (`EmployeeDarkLayout.jsx`)
   - `darkThemeColors` constants for consistent styling
   - `DarkCard`, `DarkIconButton`, `DarkToggleSwitch` components
   - `EmployeeDarkNav` bottom navigation with active indicator
   - `DarkNotificationsPanel` for notifications

3. ✅ **All 4 Employee Pages Verified** - 100% test success rate

### Previous Session Summary - Employer Portal
1. ✅ **Complete Employer Portal Redesign** with solid green icons
2. ✅ **Employees Page** - Retention metrics, department breakdown, per-employee EWA settings
3. ✅ **Payroll Page** - Full redesign with upload functionality
4. ✅ **Settings Enhancements:**
   - Business Address in Company tab
   - KYC & Documents tab (view/edit documents, bank approval flow)
   - Help Centre tab (FAQ, contact info, resources)
   - Terms & Privacy tab (legal documents)
   - Functional Notifications with toasts
5. ✅ **Contact Support Modal** - From sidebar, with form
6. ✅ **60 Demo Employees** seeded with varying data
7. ✅ **All Tests Passed** - 100% backend & frontend success rate

## Pending Tasks

### P0 - Highest Priority (User Requested)
- ✅ **Risk Scoring Calculator** - COMPLETED
  - Admin Portal: Calculator with manual override ✅ (Already existed at /admin/risk-scoring)
  - Employer Portal: Risk Insights page ✅ (NEW: /employer/risk-insights)
  - Auto-calculation + manual admin override ✅
- **Employer Notifications Tab** - Currently non-functional

### P1 - High Priority
- Dual-role user feature (Employer/Employee on same account)
- Admin KYC Review page
- Employee Onboarding dark theme (still uses light/dark toggle)

### P2 - Medium Priority
- Apple Login integration
- Live Mobile Money API integration

### Mocked Features
- Mobile Money APIs (M-PESA, Airtel Money, MTN MoMo)
- Bank Transfer APIs
- Apple Login
- Biometric Face Scan
- Report download functionality
- Change percentages in Dashboard (hardcoded placeholders)

---
Last Updated: February 15, 2026

## Risk Scoring Implementation (Feb 15, 2026)
- ✅ Admin Risk Scoring Calculator at `/admin/risk-scoring`
- ✅ NEW: Employer Risk Insights page at `/employer/risk-insights`
  - Composite Risk Score display with circular progress
  - Risk Rating Badge (A/B/C/D)
  - 5 Category breakdown: Legal & Compliance (20%), Financial Health (35%), Operational (20%), Sector & Regulatory (15%), AML & Ownership (10%)
  - Expandable improvement tips per category
  - Fee Impact visualization with scenarios
  - Rating Scale explanation
  - How to Improve section
- ✅ Sidebar navigation updated with "Risk Insights" link (Shield icon)
- ✅ Backend EmployerResponse model updated to include risk_rating and risk_factors

## Architecture - Employee Dark Theme
```
/app/frontend/src/
├── components/employee/
│   ├── EmployeeDarkLayout.jsx    <- NEW: Dark theme layout & components
│   └── EmployeeLayout.jsx        <- Old layout (kept for reference)
├── pages/employee/
│   ├── Dashboard.jsx             <- Re-exports DashboardDark.jsx
│   ├── DashboardDark.jsx         <- NEW: Dark dashboard
│   ├── Settings.jsx              <- Re-exports SettingsDark.jsx
│   ├── SettingsDark.jsx          <- NEW: Dark settings
│   ├── RequestAdvance.jsx        <- Re-exports RequestAdvanceDark.jsx
│   ├── RequestAdvanceDark.jsx    <- NEW: Dark request advance
│   ├── Transactions.jsx          <- Re-exports TransactionsDark.jsx
│   ├── TransactionsDark.jsx      <- NEW: Dark transactions
│   ├── Onboarding.jsx            <- Still uses old theme (pending)
│   └── KYC.jsx                   <- Uses old DashboardLayout
```
