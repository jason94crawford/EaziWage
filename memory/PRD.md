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

- ✅ **Landing Page** (/) - Hero section with phone mockup, animated stats, features, testimonials, countries, CTAs
- ✅ **Africa Map Component** - Professional animated map using react-simple-maps library showing full African continent with Kenya, Uganda, Tanzania, Rwanda highlighted in green with pulsing city markers (Nairobi, Kampala, Dar es Salaam, Kigali)
- ✅ **About Page** (/about) - Mission (To empower employees and employers...), Vision (To be Africa's most trusted workplace finance partner...), Our Story (EaziWage was born from a simple truth...), company values, founders quotes, journey timeline
- ✅ **How It Works** (/how-it-works) - 4-step process with sleek infographics, benefits, FAQ, video section
- ✅ **For Employers** (/employers) - Benefits, features, process, testimonials
- ✅ **For Employees** (/employees) - Benefits, use cases, testimonials, FAQs
- ✅ **Pricing Page** (/pricing) - Simple fee structure: 3.5%-6% + $0.80 processing, comparison table
- ✅ **Calculator Page** (/calculator) - Interactive wage access calculator with country selection
- ✅ **Contact Page** (/contact) - Contact form, 4 office locations (Kenya, Uganda, Tanzania, Rwanda), no interactive map
- ✅ **Partners Page** (/partners) - Pre-seed aspirational positioning, "Building the Partner Ecosystem" section with target partner types (Mobile Money Providers, Banking Institutions, Payroll Platforms, Enterprise Employers), no fictional partner logos
- ✅ **FAQ Page** (/faq) - Searchable FAQs with 6 categories
- ✅ **Blog Page** (/blog) - Featured CEO article by Jason Crawford "The Future of Earned Wage Access in Africa: 2026 Trends", 6 external article links from real sources (AfriDigest, WeeTracker, EBNet, Unipesa, Fintech Futures)
- ✅ **Privacy Policy** (/privacy) - Full legal content with TOC sidebar
- ✅ **Terms of Service** (/terms) - Full legal content with TOC sidebar
- ✅ **Legal Policy Pages** - ABC Policy, Code of Ethics, Gifts/Hospitality/Entertainment Policy, AML & CFT Policy, Whistleblowing Policy (all with sidebar table of contents matching Terms of Service design, official content from October 2025 documents)
- ✅ **Dark/Light Theme Toggle** - Working across all pages
- ✅ **Consistent Green Theme** - Primary color #16A34A maintained (no blue/yellow/red)
- ✅ **Navigation Updated** - About Us, How it Works, For Employers, For Employees, Pricing, Calculator
- ✅ **M-PESA → Mobile Wallet** - All references changed to generic "Mobile Wallet"
- ✅ **Clean Hero Sections** - Clear section breaks with proper backgrounds
- ✅ **Footer Legal Section** - 7 policy links (Cookie Policy and Data Policy removed), Legal & Compliance heading font size matches Product heading

### Employee Portal (REDESIGNED - Feb 2026)
All employee-facing pages redesigned with modern mobile-first design and light/dark mode:

- ✅ **Employee Dashboard** (/employee) - "Available to Withdraw" hero card, salary breakdown with progress bar, quick stats (Next Payday, Projected Salary), recent activity, account status
- ✅ **Request Advance Page** (/employee/advances) - Slider-based amount selection, quick amount chips (Ksh 50/100/200/Max), fee breakdown with percentage calculation, M-PESA destination selector, "Transfer Now" button
- ✅ **Transaction History Page** (/employee/transactions) - Monthly total display, filter chips (All/Pending/Completed/Failed), Export CSV button, transaction list with status indicators
- ✅ **Settings Page** (/employee/settings) - Profile header, Finance section (Bank Account, Salary Cycle), Compliance section (KYC & Onboarding, Audit Log), Security section (Change Password, Biometric Login), Preferences section (Notifications, Theme Toggle, Language), Support section, Logout button
- ✅ **Light/Dark Mode Toggle** - Theme persists in localStorage, consistent theming across all pages
- ✅ **Bottom Navigation (Mobile)** - Home, Wallet, History, Profile tabs
- ✅ **Sidebar Navigation (Desktop)** - Dashboard, Request Advance, Transaction History, Documents & KYC, Settings
- ✅ **Mobile/Tablet Responsive** - Tested at 414px (iPhone XR) viewport

### Authentication Pages (REDESIGNED V4 - Feb 2026)
Login and Registration pages with centered logo, social auth options, and multi-step onboarding:

- ✅ **Login Page** (/login) - Centered EaziWage logo, hero section styling (gradient-mesh, bg-grid), email/password fields, "Sign In" gradient button, social login options: Google OAuth (functional via Emergent), Apple Sign-In (PLACEHOLDER), Face ID (PLACEHOLDER), theme toggle, "Create account" link
- ✅ **Registration Page** (/register) - Centered logo, **Employee/Employer toggle** selector, dynamic form fields:
  - **Mobile Number Field** (NEW - Feb 2026): Required field with dialing code selector dropdown (Kenya +254, Tanzania +255, Uganda +256, Rwanda +250)
  - **Employee Flow**: "Find your company..." search button → Company search modal → Select company (read-only display) OR "My company isn't listed" → Employer referral form (Name, Email, Phone)
  - **Employer Flow**: Company Name input field
  - Button text: "Create Employee Account" / "Create Employer Account"
  - Google OAuth signup, Apple placeholder, terms checkbox
- ✅ **Company Search Modal** - Search by name/code, displays matching employers, "My company isn't listed — Continue without code" option
- ✅ **Employer Referral Form** - Warning "Company not on EaziWage yet", fields for Employer/Company Name, HR/Contact Email, HR/Contact Phone, "Search for company again" link
- ✅ **Auth Callback** (/auth/callback) - Handles Emergent Google OAuth redirect
- ✅ **Backend Google OAuth** - POST /api/auth/google/callback endpoint
- ✅ **Backend Public Employers** - GET /api/employers/public/approved (no auth required, for registration)

### Multi-Step Onboarding (ENHANCED - Feb 2026)
5-step onboarding flow matching auth page design:

**Employee Onboarding** (/employee/onboarding):
- ✅ **Centered Logo** (NEW) - Logo centered in header with theme toggle on right
- Step 1: **Welcome** - Personalized greeting, "Secure & Private", "Instant Transfers", "No Paperwork" badges
- Step 2: **Terms & Privacy** (ENHANCED):
  - ✅ **Inline Scrollable Content** (NEW) - "Read full terms" and "Read privacy policy" buttons expand scrollable sections below instead of navigating away
  - Checkbox agreement required
- Step 3: **Personal Info** (ENHANCED):
  - ✅ **ID Type Selector** (NEW) - Toggle between "National ID" and "Passport"
  - When "National ID" selected: Shows "National ID Number" field only
  - When "Passport" selected: Shows "Passport Number" field + **"Country of Nationality"** dropdown (full country list ~200 countries)
  - ✅ **Country of Work** (RENAMED from "Country") - Dropdown restricted to Kenya, Uganda, Tanzania, Rwanda
  - Date of Birth field
- Step 4: **Employment** - Employer selection, Employee Code, Job Title, Employment Type, Monthly Salary
- Step 5: **Payment** - Mobile Money provider/number (required), Bank account (optional)

**Employer Onboarding** (/employer/onboarding):
- Step 1: **Welcome** - "Happy Employees", "Zero Risk to You", "Easy Integration" badges
- Step 2: **Terms & Privacy** - Employer Agreement, Data Processing Agreement, checkbox required
- Step 3: **Company Info** - Company Name, Registration No., Tax ID, Country, Industry, Address
- Step 4: **Workforce** - Employee Count, Payroll Cycle
- Step 5: **Contact** - Contact Person Name, Email, Phone

Both onboarding flows feature:
- Progress indicator with step icons
- Glass-card design matching auth pages
- Gradient "Continue" buttons
- Form validation before proceeding
- Terms checkbox must be checked to proceed past Step 2

**Test Employee Account**: demo.employee@eaziwage.com / Employee@123

### Backend (FastAPI + MongoDB)
- ✅ User authentication (register, login, JWT tokens)
- ✅ Employer CRUD with verification workflow
- ✅ Employee CRUD with KYC status tracking
- ✅ Advance requests with fee calculation
- ✅ Risk scoring APIs with weighted formulas
- ✅ Payroll upload functionality
- ✅ KYC document management
- ✅ Dashboard stats endpoints
- ✅ Transaction history

### Application Dashboards (Existing - older design)
- ✅ Employee Dashboard (earned wages, advance limit, transactions)
- ✅ Employer Dashboard (employee stats, payroll stats)
- ✅ Admin Dashboard (verification stats, quick actions)
- ✅ Login/Register with role selection

### MOCKED Integrations
- ⚠️ Mobile money disbursement (M-PESA, MTN, Airtel Money) - mock implementation
- ⚠️ Bank transfer disbursement - mock implementation
- ⚠️ File storage - local storage only (not cloud)

## Test Credentials
- **Admin**: superadmin@eaziwage.com / Admin@12345
- **Employee**: demo.employee@eaziwage.com / Employee@123

## Prioritized Backlog

### P0 (Critical for Production)
- [x] ~~Registration mobile number field with dialing code selector~~ (COMPLETED - Feb 2026)
- [x] ~~Employee onboarding: Centered logo, inline Terms/Privacy, ID type selector~~ (COMPLETED - Feb 2026)
- [ ] Real mobile money API integration (M-PESA Daraja, MTN MoMo)
- [ ] Cloud file storage for KYC (AWS S3 or similar)
- [ ] Email notifications (SendGrid/Resend)

### P1 (Important)
- [ ] KYC document upload functionality (Employee /kyc page)
- [ ] Admin KYC Review page - view/approve/reject submitted documents
- [ ] Admin Risk Scoring calculator implementation
- [ ] Redesign Admin/Employer dashboards to match new employee portal aesthetic
- [ ] Password reset functionality
- [ ] Scroll-to-top on footer link clicks

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
│   └── .env (MONGO_URL, DB_NAME)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/ (MarketingNav, Footer, DashboardLayout)
│   │   │   └── ui/ (Shadcn components)
│   │   ├── lib/
│   │   │   ├── ThemeContext.jsx (Dark/Light mode provider)
│   │   │   ├── api.js
│   │   │   └── auth.js
│   │   └── pages/
│   │       ├── marketing/ (11 pages - COMPLETED)
│   │       ├── auth/ (Login, Register)
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
- `GET /api/admin/employers` - List employers
- `PUT /api/admin/employers/{id}/verify` - Verify employer
- `GET /api/admin/employees` - List employees
- `GET /api/admin/advances` - List advances
- `POST /api/employee/request-advance` - Request wage advance
- `GET /api/employee/dashboard` - Employee dashboard data
- `GET /api/employer/dashboard` - Employer dashboard data

## Test Results (Feb 2026)
- Frontend Marketing Pages: **100%** (12/12 pages passing)
- Africa Map Component: **100%** (react-simple-maps with full continent render, 4 highlighted countries, 4 city markers with pulsing animations)
- Theme Toggle: **Working**
- Navigation: **Working**
- Backend: 95% (previous test iteration)
- UI/Content Update (Feb 2026): **100%** - About page Mission/Vision/Our Story, Footer Legal & Compliance font size, Partners page pre-seed positioning
- Policy Pages Update (Feb 2026): **100%** - Cookie/Data Policy removed from footer, all 5 policy pages now have sidebar TOC matching Terms of Service
- Employee Portal Redesign (Feb 2026): **100%** - All 4 pages (Dashboard, Request Advance, Transactions, Settings) tested and passing with light/dark mode
- Auth Pages Redesign V3 (Feb 2026): **100%** - Login and Register pages match hero section (gradient-mesh, bg-grid, text-gradient, glass-card, gradient logo and button)
- Auth Pages V4 + Onboarding (Feb 2026): **100%** - 14 backend + 10 frontend tests passing. Centered logo, Employee/Employer toggle, Google OAuth (functional), Apple/FaceID (MOCKED placeholders), multi-step onboarding with terms validation

## Test Credentials
- **Admin**: superadmin@eaziwage.com / Admin@12345
- **Employee**: demo.employee@eaziwage.com / Employee@123

## Notes
- Marketing pages now have rich content, not minimalistic
- Green theme (#16A34A for marketing, #0df259 for employee portal) maintained consistently
- Dark/Light mode toggle in navigation header and employee settings
- ThemeProvider wraps entire app in index.js
- Employee portal uses mobile-first design with bottom navigation
- Dark mode colors: Background #102216, Cards #1A2C20
- Light mode colors: Background #f5f8f6, Cards white
