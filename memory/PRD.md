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

### Employee Features
- **7-Step KYC Onboarding Flow** ✅
- **Employee Dashboard** ✅ (Redesigned v3)
- **Request Advance Page** ✅
- **Transaction History** ✅
- **Profile & Settings** ✅ (with Change Password API)

### Employer Features ✅ UPDATED
- **8-Step Comprehensive Onboarding Portal** ✅ (Updated Feb 14, 2026)
  - Step 1: Welcome - Benefits overview, optional docs note
  - Step 2: Terms - Partnership Agreement with checkbox validation
  - Step 3: Company Info - Company name, registration, country + optional docs
  - Step 4: Address - Physical address, tax info + optional docs
  - Step 5: Beneficial Ownership - Directors/shareholders (optional, can skip)
  - Step 6: Business Operations - Industry, sector, **Countries of Operation (multi-select)**, employees + permit doc + **Employment Contract Template**
  - Step 7: Financial Info - Revenue, payroll, bank + financial docs + **Proof of Bank Account**
  - Step 8: Contact Person - Primary contact details

- **New P0 Features (Feb 14, 2026):**
  - ✅ **Countries of Operation** - Multi-select for Kenya, Uganda, Tanzania, Rwanda (Required field)
  - ✅ **Employment Contract Template** - File upload in Step 6
  - ✅ **Proof of Bank Account** - File upload in Step 7
  
- **Document Types (All Optional - Can Skip):**
  - Certificate of Incorporation
  - Business Registration
  - Tax Compliance Certificate
  - KRA PIN Certificate
  - CR12 / Company Directors Document
  - Business Permit / License
  - Audited Financials
  - Bank Statement
  - Proof of Address
  - Proof of Bank Account (NEW)
  - Employment Contract Template (NEW)

- **Business Sectors (19 options):**
  - Primary: Agriculture & Farming, Mining & Quarrying
  - Secondary: Manufacturing, Construction, Utilities
  - Tertiary: Wholesale & Retail, Hospitality, Transport, ICT, Financial Services, Real Estate, Professional Services, Education, Healthcare, Media & Entertainment, NGO, Government, Security Services
  - Other

### Admin Features (Partially Implemented)
- Admin dashboard ✅
- Employee verification (Basic) ✅
- KYC Review page (PENDING - P1)
- Risk Scoring calculator (PENDING - P2)

## API Endpoints

### Employer Onboarding
- `GET /api/employers/onboarding/sectors` - Get 19 business sectors
- `POST /api/employers/onboarding` - Create employer profile with all data (includes countries_of_operation)
- `PUT /api/employers/onboarding` - Update employer profile
- `PATCH /api/employers/onboarding/step` - Update onboarding step progress
- `POST /api/employers/onboarding/document` - Upload employer documents (11 types supported)

### User Settings
- `POST /api/users/me/change-password` - Change user password ✅

## Technical Architecture

### Backend (FastAPI)
- Python 3.x with FastAPI framework
- MongoDB database
- JWT authentication
- File upload handling for KYC and employer documents
- Local storage at `/app/backend/uploads` and `/app/backend/uploads/employer_docs`

### Frontend (React)
- React with React Router DOM
- TailwindCSS styling
- Shadcn/UI components
- Mobile-first responsive design

## Design System
- Primary: `#0df259` (Emerald Green)
- Gradient: `bg-gradient-to-r from-primary to-emerald-600`
- Glass-morphism: `backdrop-blur-xl` with semi-transparent backgrounds

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
- ✅ **P0 Fix #1**: Logout button changed from red to green gradient
- ✅ **P0 Fix #2**: All settings icons use gradient matching "Get Started" button
- ✅ **P0 Fix #3**: Mobile notifications panel - responsive and properly positioned
- ✅ **P1 Fix**: Change Password API endpoint implemented
- ✅ **P0 Feature**: Complete 8-step Employer Onboarding Portal

### Session 4 - Feb 14, 2026
- ✅ **P0 Feature**: Countries of Operation multi-select (Kenya, Uganda, Tanzania, Rwanda)
- ✅ **P0 Feature**: Employment Contract Template upload in Business Operations step
- ✅ **P0 Feature**: Proof of Bank Account upload in Financial Info step
- ✅ **Bug Verification**: Audited Financials upload confirmed working (was reported as bug)

## Pending Tasks

### P1 - High Priority
- Build entire Employer Portal application post-onboarding:
  - Dashboard with API health status (mock)
  - Employees page (view, enable/disable EWA)
  - Advances page
  - Reports page
  - Settings page (adjust employee limits, set advance access periods)
  - Notifications section
  - View employee and employer risk scores
- Dual-role user feature (Employer/Employee on same account with portal selector)
- Admin KYC Review page UI
- Risk Scoring calculator

### P2 - Medium Priority
- Contact Support modal functionality
- Help Centre content
- Terms & Privacy content
- Employer employee management pages
- Payroll integration

### Future/Backlog
- Apple Login integration
- Live Mobile Money API integration
- Live Bank Transfer API integration

## Mocked Features
- Mobile Money APIs (M-PESA, Airtel Money, MTN MoMo)
- Bank Transfer APIs
- Apple Login
- Biometric Face Scan (UI present, simulated)

---
Last Updated: February 14, 2026
