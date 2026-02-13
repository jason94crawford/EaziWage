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

## What's Been Implemented (Feb 13, 2026)

### Backend (FastAPI + MongoDB)
- ✅ User authentication (register, login, JWT tokens)
- ✅ Employer CRUD with verification workflow
- ✅ Employee CRUD with KYC status tracking
- ✅ Advance requests with fee calculation
- ✅ Risk scoring APIs with weighted formulas
- ✅ Payroll upload functionality
- ✅ Dashboard stats endpoints
- ✅ Transaction history

### Frontend (React + Tailwind + Shadcn/UI)
- ✅ Marketing landing page (hero, features, how it works, countries, CTA)
- ✅ Login/Register with role selection
- ✅ Employee Dashboard (earned wages, advance limit, transactions)
- ✅ Employee Onboarding form
- ✅ Request Advance form with fee calculator
- ✅ Employer Dashboard (employee stats, payroll stats)
- ✅ Employer Onboarding form
- ✅ Admin Dashboard (verification stats, quick actions)
- ✅ Admin Employers management (list, filter, approve/reject)
- ✅ Admin Advances management (list, approve, disburse)

### MOCKED Integrations
- ⚠️ Mobile money disbursement (M-PESA, MTN, Airtel Money) - mock implementation
- ⚠️ Bank transfer disbursement - mock implementation

## Prioritized Backlog

### P0 (Critical for MVP)
- [ ] KYC document upload with file storage (currently placeholder)
- [ ] Employee Transactions page
- [ ] Employee Profile page
- [ ] Admin KYC Review page
- [ ] Admin Risk Scoring calculator page

### P1 (Important)
- [ ] Admin Employees management page
- [ ] Employer Employees management page
- [ ] Employer Payroll upload page
- [ ] Email notifications (registration, advance status)
- [ ] Password reset functionality

### P2 (Nice to Have)
- [ ] Reports and analytics dashboards
- [ ] Employer/Employee settings pages
- [ ] Marketing pages (About, Pricing, Contact)
- [ ] Admin Settings page
- [ ] Export data functionality

## Next Tasks
1. Implement KYC document upload with cloud storage integration
2. Build Admin KYC Review page for document verification
3. Build Admin Risk Scoring page with calculator
4. Build Employee Transactions history page
5. Add real mobile money API integration when ready

## Technical Notes
- Backend runs on port 8001
- Frontend runs on port 3000
- MongoDB database: test_database
- Risk scoring weights defined per KYC framework document
