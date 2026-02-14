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
- **Employee Dashboard** ✅ (Redesigned v3)
- **Request Advance Page** ✅
- **Transaction History** ✅
- **Profile & Settings** ✅ (with Change Password API)

### Employer Features ✅ COMPLETE
- **8-Step Comprehensive Onboarding Portal** ✅
  - Step 1: Welcome - Benefits overview
  - Step 2: Terms - Partnership Agreement
  - Step 3: Company Info - Company name, registration, country + docs
  - Step 4: Address - Physical address, tax info + docs
  - Step 5: Beneficial Ownership - Directors/shareholders
  - Step 6: Business Operations - Industry, sector, **Countries of Operation**, employees + **Employment Contract Template**
  - Step 7: Financial Info - Revenue, payroll, bank + financial docs + **Proof of Bank Account**
  - Step 8: Contact Person - Primary contact details

- **Employer Portal (Post-Onboarding)** ✅ **REDESIGNED - Feb 14, 2026**
  - **New EmployerPortalLayout** with glass-morphism sidebar
  - **Dark/Light theme toggle** across all pages
  - **Mobile responsive** with collapsible sidebar
  
  - **Dashboard** ✅ REDESIGNED
    - Animated circular progress indicator for employees
    - 4 metric cards with trend indicators (+/-%)
    - Quick Actions section (4 hover cards)
    - Company Status section
    - Risk Assessment visualization
    - Verification Alert banner
    
  - **Advances Page** ✅ REDESIGNED
    - 4 stats cards (Total Requests, Disbursed, Pending, Avg Fee Rate)
    - Search input with filter buttons (All, Pending, Approved, Disbursed, Rejected)
    - Modern advance row items with avatars
    - Export Report functionality
    - "How Advances Work" info card
    
  - **Reports Page** ✅ REDESIGNED
    - Period selector dropdown
    - 4 metric cards with trend percentages
    - Donut chart for disbursement breakdown
    - Employee breakdown with progress bars
    - Monthly summary section
    - 4 downloadable report types
    - Company risk score visualization
    
  - **Settings Page** ✅ REDESIGNED
    - Tab navigation (Company, EWA Settings, Notifications, Security)
    - Company tab: Company info, payroll cycle, contact details, verification status
    - EWA Settings tab: Max advance slider, min/max amounts, access period, cooldown
    - Notifications tab: 4 toggle switches
    - Security tab: Password change, 2FA, login activity, API access

### Admin Features (Partially Implemented)
- Admin dashboard ✅
- Employee verification (Basic) ✅
- KYC Review page (PENDING - P1)
- Risk Scoring calculator (PENDING - P2)

## API Endpoints

### Employer Onboarding
- `GET /api/employers/onboarding/sectors` - Get 19 business sectors
- `POST /api/employers/onboarding` - Create employer profile
- `PUT /api/employers/onboarding` - Update employer profile
- `POST /api/employers/onboarding/document` - Upload documents (11 types)

### Employer Portal
- `GET /api/dashboard/employer` - Dashboard stats
- `GET /api/employees` - List employees
- `GET /api/advances` - List advances
- `POST /api/payroll/upload` - Upload payroll data
- `GET /api/payroll/history` - Payroll upload history

### User
- `POST /api/users/me/change-password` - Change password ✅

## Technical Architecture

### Backend (FastAPI)
- Python 3.x with FastAPI framework
- MongoDB database
- JWT authentication
- File upload handling

### Frontend (React)
- React with React Router DOM
- TailwindCSS styling
- Shadcn/UI components
- Mobile-first responsive design
- ThemeContext for dark/light mode

### Component Architecture
```
/app/frontend/src/
├── components/
│   ├── employer/
│   │   └── EmployerLayout.jsx    # NEW - Glass-morphism sidebar layout
│   ├── employee/
│   │   └── EmployeeLayout.jsx    # Employee-specific layout
│   └── ui/                       # Shadcn components
├── pages/
│   ├── employer/
│   │   ├── Dashboard.jsx         # REDESIGNED
│   │   ├── Advances.jsx          # REDESIGNED
│   │   ├── Reports.jsx           # REDESIGNED
│   │   └── Settings.jsx          # REDESIGNED
│   └── employee/
│       └── ...
└── lib/
    └── ThemeContext.jsx          # Theme management
```

## Design System
- Primary: `#0df259` (Emerald Green)
- Gradient: `bg-gradient-to-r from-primary to-emerald-600`
- Glass-morphism: `backdrop-blur-xl` with semi-transparent backgrounds
- Dark mode: Full support via ThemeContext

## Test Credentials
- **Admin**: superadmin@eaziwage.com / Admin@12345
- **Employee**: demo.employee@eaziwage.com / Employee@123
- **Employer**: testemployer2@eaziwage.com / Employer@123

## Completed Work

### Session 1-2 - Core Platform & Employee Dashboard
- ✅ Marketing website
- ✅ JWT + Google OAuth authentication
- ✅ 7-step Employee KYC onboarding
- ✅ Complete Employee Dashboard Redesign

### Session 3 - Feb 15, 2026
- ✅ Employee Settings UI fixes (logout button, icon gradients, mobile notifications)
- ✅ Change Password API
- ✅ 8-step Employer Onboarding Portal

### Session 4 - Feb 14, 2026
- ✅ Countries of Operation multi-select in Employer Onboarding
- ✅ Employment Contract Template upload
- ✅ Proof of Bank Account upload
- ✅ Initial Employer Portal build (Dashboard, Advances, Reports, Settings)

### Session 5 - Feb 14, 2026 (Current)
- ✅ **COMPLETE EMPLOYER PORTAL REDESIGN**
  - New EmployerLayout component with glass-morphism sidebar
  - Dashboard with animated counters and trend metrics
  - Advances page with modern filters and search
  - Reports page with donut charts and analytics
  - Settings page with tabbed navigation
  - Dark/Light theme toggle across all pages
  - Mobile responsive with collapsible sidebar
  - 100% test pass rate (backend + frontend)

## Pending Tasks

### P1 - High Priority
- Dual-role user feature (Employer/Employee on same account with portal selector)
- Admin KYC Review page UI
- Risk Scoring calculator
- Contact Support modal functionality
- Help Centre & Terms content

### P2 - Medium Priority
- EWA Settings backend integration (currently frontend-only)
- Employer employee management enhancements
- Payroll integration improvements

### Future/Backlog
- Apple Login integration
- Live Mobile Money API integration
- Live Bank Transfer API integration

## Mocked Features
- Mobile Money APIs (M-PESA, Airtel Money, MTN MoMo)
- Bank Transfer APIs
- Apple Login
- Biometric Face Scan (UI present, simulated)
- EWA Settings save functionality (frontend works, backend not integrated)
- Report download functionality (buttons present, not functional)
- Change percentages in Dashboard/Reports (hardcoded placeholders)

---
Last Updated: February 14, 2026
