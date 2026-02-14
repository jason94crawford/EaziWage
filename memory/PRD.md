# EaziWage - Earned Wage Access Platform PRD

## Original Problem Statement
Develop an earned wage access website and application for EaziWage targeting Kenya, Uganda, Tanzania and Rwanda. The platform needs:
- Website (marketing/landing)
- Employer Application
- Employee Application  
- Admin Application

Features include mobile money (M-PESA, MTN, Airtel) and bank transfer disbursements with auto-scoring for employers and employees based on KYC/Due Diligence and Risk Scoring frameworks.

## User Personas
1. **Employees**: Workers in Kenya, Uganda, Tanzania, Rwanda seeking access to earned wages before payday
2. **Employers**: SMEs to large corporations offering EWA as an employee benefit
3. **Administrators**: EaziWage staff managing verification, risk scoring, and disbursements

## Core Requirements (Static)
- JWT-based authentication with email/phone
- Unified platform with role-based access (Employee, Employer, Admin)
- Auto risk scoring using formula: Fee(%) = 3.5% + (3% × (1 - CRS/5))
- Support for 4 countries: Kenya (M-PESA), Uganda (MTN), Tanzania (M-PESA/Tigo), Rwanda (MTN)
- KYC document management
- Advance request and disbursement workflow

## What's Been Implemented

### Marketing Website (COMPLETED - Dec 2025)
All marketing pages redesigned with modern "African-fintech" aesthetic:

- Landing Page, About, How It Works, For Employers, For Employees, Pricing
- Calculator, Contact, Partners, FAQ, Blog, Privacy Policy, Terms of Service
- Legal Policy Pages (ABC, Code of Ethics, Gifts, AML & CFT, Whistleblowing)
- Dark/Light Theme Toggle, Africa Map Component, Footer scroll-to-top

### Employee Portal (REDESIGNED - Feb 2026)
- Employee Dashboard with salary breakdown and quick stats
- Request Advance Page with slider-based amount selection
- Transaction History Page with filters and export
- Settings Page with profile management
- Light/Dark Mode Toggle
- Mobile-first responsive design

### Authentication Pages (COMPLETED - Feb 2026)
- Login Page with social auth options (Google OAuth functional, Apple PLACEHOLDER)
- Registration Page with Employee/Employer toggle and company search
- Auth Callback for Google OAuth
- Multi-step Onboarding flows

### Comprehensive KYC Onboarding (NEW - Feb 2026) 
7-step employee onboarding flow with full KYC/verification:

**Step 1: Welcome**
- Personalized greeting with user's name
- Feature highlights: Secure & Private, Instant Transfers, Quick Verification

**Step 2: Terms & Privacy**
- Inline expandable Terms of Service content
- Inline expandable Privacy Policy content
- Checkbox agreement required to proceed

**Step 3: ID Verification**
- ID Type selector (National ID / Passport toggle)
- ID/Passport number input
- Date of Birth field
- Country of Nationality (shown only for Passport)
- Document upload: Front Side (required), Back Side (optional)

**Step 4: Address Verification**
- Country of Work selector (Kenya, Uganda, Tanzania, Rwanda)
- Address Line 1, Line 2
- City/Town, Postal Code
- Address Proof document upload (utility bill, bank statement, lease)

**Step 5: Tax Information**
- Tax Identification Number (TIN/PIN) input
- Tax Certificate upload (optional)
- Skip option for users without TIN

**Step 6: Employment & Salary**
- Employer selector from approved employers list
- Employee Code/ID
- Department
- Job Title
- Employment Type (Full-time, Part-time, Contract)
- Start Date
- Monthly Gross Salary
- Payslip uploads (1-2 recent payslips)

**Step 7: Payment Details**
- Mobile Money Provider selector (based on country)
- Mobile Money Number (required)
- Bank Name (optional)
- Bank Account Number (optional)
- Bank Statement upload (optional)

### Backend KYC System (NEW - Feb 2026)
- **POST /api/kyc/upload** - File upload endpoint with validation
  - Accepts: JPEG, PNG, WebP, PDF
  - Max size: 5MB
  - Storage: Local filesystem (/app/backend/uploads/kyc/)
  - Document types: id_front, id_back, address_proof, tax_certificate, payslip_1, payslip_2, bank_statement, selfie
- **GET /api/employees/me/kyc-status** - Comprehensive KYC status with uploaded documents
- **PATCH /api/employees/me/kyc-step** - Track onboarding progress
- **GET /api/kyc/files/{filename}** - Serve uploaded KYC files securely

### Backend (FastAPI + MongoDB)
- User authentication (register, login, JWT tokens)
- Employer CRUD with verification workflow
- Employee CRUD with KYC status tracking
- Advance requests with fee calculation
- Risk scoring APIs with weighted formulas
- Payroll upload functionality
- KYC document management
- Dashboard stats endpoints
- Transaction history

### Application Dashboards (Existing)
- Employee Dashboard (earned wages, advance limit, transactions)
- Employer Dashboard (employee stats, payroll stats)
- Admin Dashboard (verification stats, quick actions)

### MOCKED Integrations
- Mobile money disbursement (M-PESA, MTN, Airtel Money) - mock implementation
- Bank transfer disbursement - mock implementation
- Apple Login - placeholder
- Biometric Face Scan - placeholder

## Test Credentials
- **Admin**: superadmin@eaziwage.com / Admin@12345
- **Employee**: demo.employee@eaziwage.com / Employee@123
- **Test Onboarding User**: test.onboard.29147@eaziwage.com / TestPass@123

## Prioritized Backlog

### P0 (Critical for Production)
- [x] ~~Comprehensive KYC onboarding flow~~ (COMPLETED - Feb 2026)
- [x] ~~Backend file upload for KYC documents~~ (COMPLETED - Feb 2026)
- [x] ~~Footer scroll-to-top on link click~~ (COMPLETED - Feb 2026)
- [ ] Real mobile money API integration (M-PESA Daraja, MTN MoMo)
- [ ] Cloud file storage for KYC (AWS S3 or similar)
- [ ] Email notifications (SendGrid/Resend)

### P1 (Important)
- [ ] Admin KYC Review page - view/approve/reject submitted documents
- [ ] Admin Risk Scoring calculator implementation
- [ ] Redesign Admin/Employer dashboards to match employee portal aesthetic
- [ ] Password reset functionality

### P2 (Nice to Have)
- [ ] Employer Reports/Analytics page
- [ ] Admin Employees management page
- [ ] SMS notifications (Twilio/Africa's Talking)
- [ ] Admin/Employer Settings pages
- [ ] Export data functionality
- [ ] Mobile app (React Native)

## Technical Architecture
```
/app/
├── backend/
│   ├── server.py (FastAPI application)
│   ├── requirements.txt
│   ├── .env (MONGO_URL, DB_NAME)
│   └── uploads/
│       └── kyc/ (KYC document storage)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/ (MarketingNav, Footer, DashboardLayout)
│   │   │   └── ui/ (Shadcn components)
│   │   ├── lib/
│   │   │   ├── ThemeContext.jsx (Dark/Light mode provider)
│   │   │   ├── api.js (API client with kycApi)
│   │   │   └── auth.js
│   │   └── pages/
│   │       ├── marketing/ (11 pages)
│   │       ├── auth/ (Login, Register, AuthCallback)
│   │       ├── admin/ (Dashboard, Employers, Advances, KYC, RiskScoring)
│   │       ├── employer/ (Dashboard, Employees, Payroll, Onboarding)
│   │       └── employee/ (Dashboard, KYC, Transactions, Advances, Onboarding)
│   ├── tailwind.config.js (darkMode: "class")
│   └── .env (REACT_APP_BACKEND_URL)
└── memory/
    └── PRD.md
```

## Key API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google/callback` - Google OAuth callback
- `POST /api/kyc/upload` - Upload KYC document file
- `GET /api/employees/me/kyc-status` - Get comprehensive KYC status
- `PATCH /api/employees/me/kyc-step` - Update onboarding progress
- `GET /api/employers/public/approved` - List approved employers (public)

## Test Results (Feb 2026)
- Backend KYC Upload: **93%** (13/14 tests passed)
- Frontend KYC Onboarding: **100%** (All 7 steps verified)
- Footer scroll-to-top: **Working**

## Notes
- KYC documents stored locally in /app/backend/uploads/kyc/
- File upload validates type (JPEG/PNG/WebP/PDF) and size (max 5MB)
- 7-step onboarding tracks progress with kyc_step field
- Green theme (#16A34A) maintained consistently
- Glass-morphism design pattern throughout
