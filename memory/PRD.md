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

- ✅ **Landing Page** (/) - Hero section with phone mockup, stats, features, testimonials, countries, CTAs
- ✅ **About Page** (/about) - Company story, mission, values, team, timeline, investors
- ✅ **How It Works** (/how-it-works) - 4-step process, benefits, FAQ, video section
- ✅ **For Employers** (/employers) - Benefits, features, process, testimonials
- ✅ **Pricing Page** (/pricing) - 3-tier pricing (Starter/Business/Enterprise), fee breakdown, comparison table
- ✅ **Contact Page** (/contact) - Contact form, 4 office locations (Kenya, Uganda, Tanzania, Rwanda)
- ✅ **Partners Page** (/partners) - Partner types, current partners, integration steps
- ✅ **FAQ Page** (/faq) - Searchable FAQs with 6 categories (General, Employees, Employers, Fees, Security, Technical)
- ✅ **Blog Page** (/blog) - Featured post, article grid, categories, newsletter signup
- ✅ **Privacy Policy** (/privacy) - Full legal content with TOC sidebar
- ✅ **Terms of Service** (/terms) - Full legal content with TOC sidebar
- ✅ **Dark/Light Theme Toggle** - Working across all pages
- ✅ **Consistent Green Theme** - Primary color #16A34A maintained

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

## Prioritized Backlog

### P0 (Critical for Production)
- [ ] Real mobile money API integration (M-PESA Daraja, MTN MoMo)
- [ ] Cloud file storage for KYC (AWS S3 or similar)
- [ ] Email notifications (SendGrid/Resend)

### P1 (Important)
- [ ] KYC document upload functionality (Employee /kyc page)
- [ ] Admin KYC Review page - view/approve/reject submitted documents
- [ ] Admin Risk Scoring calculator implementation
- [ ] Redesign Admin/Employer/Employee dashboards to match new marketing aesthetic
- [ ] Employee Profile page
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

## Test Results (Dec 2025)
- Frontend Marketing Pages: **100%** (11/11 pages passing)
- Theme Toggle: **Working**
- Navigation: **Working**
- Backend: 95% (previous test iteration)

## Notes
- Marketing pages now have rich content, not minimalistic
- Green theme (#16A34A) maintained consistently
- Dark/Light mode toggle in navigation header
- ThemeProvider wraps entire app in index.js
