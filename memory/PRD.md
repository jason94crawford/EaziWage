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
- **7-Step KYC Onboarding Flow** ✅
- **Employee Dashboard** ✅
- **Request Advance Page** ✅
- **Transaction History** ✅
- **Profile & Settings** ✅

### Employer Features ✅ COMPLETE
- **8-Step Comprehensive Onboarding Portal** ✅
- **Employer Portal (Post-Onboarding)** ✅
  - Dashboard with consistent metrics ✅
  - Risk Insights Page with Request Review ✅
  - Employees Page with Pie Chart distribution ✅
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

- **Admin Employees Page** ✅ **NEW Feb 2026**
  - Stats cards (Total, Active, Pending KYC, Suspended)
  - Search by name, ID, email, job title, employer
  - Filter buttons (All Status, Active, Pending, Suspended)
  - KYC status dropdown filter
  - Employee list with details (salary, KYC, status, risk score)
  - **Employee Detail Modal** with 4 tabs:
    - Overview: Stats, Personal Info, Employment Details, Risk Assessment
    - Advances: Full advance history
    - KYC: Document status, Approve/Reject buttons
    - Actions: Activate/Suspend/Pending/Reject account buttons
  - Risk Score Override with audit trail
  - Edit employee details (job title, department, salary)

- **Reconciliation Page** ✅
- **API Health Monitor** ✅
- **Risk Scoring Calculator** ✅
- **KYC Review** ✅
- **Employers Management** ✅
- **Advances Management** ✅

## API Endpoints

### Admin Employees (NEW)
- `GET /api/admin/employees` - List all employees with employer names
- `GET /api/admin/employees/{id}` - Get employee detail with advances and stats
- `PUT /api/admin/employees/{id}` - Update employee details (job_title, department, salary)
- `PATCH /api/admin/employees/{id}/status` - Update account status
- `PATCH /api/admin/employees/{id}/kyc` - Update KYC status
- `PATCH /api/admin/employees/{id}/risk-score` - Override risk score with audit trail

### Employer Portal
- `GET /api/dashboard/employer` - Dashboard stats
- `GET /api/dashboard/employer/extended` - Extended dashboard with retention metrics
- `GET /api/employees/{id}/ewa-settings` - Get employee EWA settings
- `PUT /api/employees/{id}/ewa-settings` - Update employee EWA settings
- `POST /api/admin/review-requests` - Submit review request from employer

## Test Credentials
- **Admin**: superadmin@eaziwage.com / Admin@12345
- **Employee**: demo.employee@eaziwage.com / Employee@123
- **Employer**: testemployer2@eaziwage.com / Employer@123

## Demo Data
- 67 employees seeded across multiple employers
- Varying salaries, departments, tenures
- Mixed KYC and account statuses

## Bug Fixes (Feb 2026)
- **Payroll Data Consistency**: Fixed mismatch between Dashboard and Payroll page Monthly Payroll values. Both now use active employees only for consistent calculation.

## Pending Tasks

### P0 - Completed ✅
- ✅ Admin Employees Management Page
- ✅ Payroll data consistency fix

### P1 - High Priority
- Admin Employers Page enhancement
- Fraud Detection Rules UI
- Admin Review Management UI (for employer review requests)
- Implement functional Employer Notifications tab (full page)

### P2 - Medium Priority
- Real-time notifications via WebSocket
- Live Mobile Money API integration
- Apple Login integration
- Dual-role User Feature (Employer/Employee)

### Mocked Features
- Mobile Money APIs (M-PESA, Airtel Money, MTN MoMo)
- Bank Transfer APIs
- Apple Login
- Biometric Face Scan
- Live Payroll API (Auto Mode is simulated)

## Architecture
```
/app/
├── backend/
│   └── server.py           # FastAPI backend with all endpoints
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── admin/
│       │   │   └── AdminLayout.jsx
│       │   ├── employer/
│       │   │   └── EmployerLayout.jsx
│       │   └── ui/         # Shadcn components
│       ├── layouts/
│       ├── pages/
│       │   ├── admin/
│       │   │   ├── Dashboard.jsx
│       │   │   ├── Employees.jsx   # NEW
│       │   │   ├── Employers.jsx
│       │   │   ├── Reconciliation.jsx
│       │   │   └── APIHealth.jsx
│       │   ├── employer/
│       │   └── employee/
│       ├── lib/
│       └── App.js
├── memory/
│   └── PRD.md
└── test_reports/
```

---
Last Updated: February 2026
