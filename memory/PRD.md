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

### Employer Features ✅ NEW
- **8-Step Comprehensive Onboarding Portal** ✅ (Built Feb 15, 2026)
  - Step 1: Welcome - Benefits overview, optional docs note
  - Step 2: Terms - Partnership Agreement with checkbox validation
  - Step 3: Company Info - Company name, registration, country + optional docs
  - Step 4: Address - Physical address, tax info + optional docs
  - Step 5: Beneficial Ownership - Directors/shareholders (optional, can skip)
  - Step 6: Business Operations - Industry, sector, employees + permit doc
  - Step 7: Financial Info - Revenue, payroll, bank + financial docs
  - Step 8: Contact Person - Primary contact details
  
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

### Employer Onboarding (NEW)
- `GET /api/employers/onboarding/sectors` - Get 19 business sectors
- `POST /api/employers/onboarding` - Create employer profile with all data
- `PUT /api/employers/onboarding` - Update employer profile
- `PATCH /api/employers/onboarding/step` - Update onboarding step progress
- `POST /api/employers/onboarding/document` - Upload employer documents

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
  - Backend endpoints for sectors, profile creation, document upload
  - Frontend with step navigation, terms validation, dynamic beneficial owners
  - All documents marked optional with skip functionality

## Pending Tasks

### P1 - High Priority
- Admin KYC Review page UI
- Risk Scoring calculator

### P2 - Medium Priority
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
Last Updated: February 15, 2026
