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

### Employee Features ✅
- **7-Step KYC Onboarding Flow** ✅
- **Employee Dashboard** ✅
- **Request Advance Page** ✅
- **Transaction History** ✅
- **Profile & Settings** ✅

### Employer Features ✅ COMPLETE (Feb 14, 2026)
- **8-Step Comprehensive Onboarding Portal** ✅
  
- **Employer Portal (Post-Onboarding)** ✅
  - **Dashboard** ✅
    - 60 total employees with animated circular progress
    - Real-time metrics (Total Advances, Pending, Monthly Payroll, Avg Advance)
    - Quick Actions section
    - Company Status and Risk Assessment
  
  - **Employees Page** ✅ **REDESIGNED Feb 14, 2026**
    - Auto-calculated retention metrics (80% retention rate, 58.3% KYC completion, 26.9 months avg tenure)
    - Department Distribution breakdown (10 departments)
    - Search, filters (All, Active, Pending), department dropdown
    - **Per-Employee EWA Settings** - Custom advance limits per employee
    - EWA modal with: Enable toggle, Max %, Min/Max amounts, Cooldown period
    - 60 demo employees seeded with varying data
  
  - **Payroll Page** ✅ **REDESIGNED Feb 14, 2026**
    - Monthly payroll metrics
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

### Session Summary
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

### P1 - High Priority
- Dual-role user feature (Employer/Employee on same account)
- Admin KYC Review page
- Risk Scoring calculator

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
Last Updated: February 14, 2026
