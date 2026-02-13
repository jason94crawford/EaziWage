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

## What's Been Implemented (Feb 13, 2026) - COMPLETE REDESIGN

### UI/UX Redesign
- ✅ Modern fintech aesthetic (dark mode + African-inspired + premium)
- ✅ New landing page with phone mockup, stats, testimonials, country sections
- ✅ Refreshed dashboard layouts with improved sidebar navigation
- ✅ Plus Jakarta Sans / Inter typography
- ✅ Green primary color (#16A34A) with refined palette

### Backend (FastAPI + MongoDB)
- ✅ User authentication (register, login, JWT tokens)
- ✅ Employer CRUD with verification workflow
- ✅ Employee CRUD with KYC status tracking
- ✅ Advance requests with fee calculation
- ✅ Risk scoring APIs with weighted formulas (5 categories)
- ✅ Payroll upload functionality
- ✅ KYC document management
- ✅ Dashboard stats endpoints
- ✅ Transaction history

### Frontend (React + Tailwind + Shadcn/UI)
- ✅ Marketing landing page (redesigned hero, features, how it works, testimonials, countries, CTA)
- ✅ Login/Register with role selection
- ✅ Employee Dashboard (earned wages, advance limit, transactions)
- ✅ Employee Onboarding form
- ✅ Employee KYC Document Upload page (local storage)
- ✅ Employee Transactions page
- ✅ Request Advance form with fee calculator
- ✅ Employer Dashboard (employee stats, payroll stats)
- ✅ Employer Onboarding form
- ✅ Employer Employees Management page
- ✅ Employer Payroll Upload page
- ✅ Admin Dashboard (verification stats, quick actions)
- ✅ Admin Employers management (list, filter, approve/reject)
- ✅ Admin Advances management (list, approve, disburse)
- ✅ Admin KYC Review page
- ✅ Admin Risk Scoring Calculator (5 categories, weighted scoring)

### MOCKED Integrations
- ⚠️ Mobile money disbursement (M-PESA, MTN, Airtel Money) - mock implementation
- ⚠️ Bank transfer disbursement - mock implementation
- ⚠️ File storage - local storage only (not cloud)

## Test Credentials
- Admin: superadmin@eaziwage.com / Admin@12345

## Prioritized Backlog

### P0 (Critical for Production)
- [ ] Real mobile money API integration (M-PESA Daraja, MTN MoMo)
- [ ] Cloud file storage for KYC (AWS S3 or similar)
- [ ] Email notifications (SendGrid/Resend)

### P1 (Important)
- [ ] Employee Profile page
- [ ] Employer Reports/Analytics page
- [ ] Admin Employees management page
- [ ] Password reset functionality
- [ ] SMS notifications (Twilio/Africa's Talking)

### P2 (Nice to Have)
- [ ] Marketing pages (About, Pricing, Contact)
- [ ] Admin/Employer Settings pages
- [ ] Export data functionality
- [ ] Mobile app (React Native)

## Technical Notes
- Backend: FastAPI on port 8001
- Frontend: React on port 3000
- Database: MongoDB (test_database)
- Risk scoring weights defined per KYC framework document
- Fee formula: Fee(%) = 3.5% + (3% × (1 - CRS/5))

## Test Results
- Backend: 95% (20/21 tests passed)
- Frontend: 95% (all key pages working)
- Overall: 95%
