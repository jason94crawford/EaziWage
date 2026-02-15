# EaziWage Changelog

## Feb 15, 2026 - Risk Scoring & UI Verification

### New Features
- **Employer Risk Insights Page** (`/employer/risk-insights`)
  - Composite Risk Score display with animated circular progress
  - Risk Rating Badge (A: Low, B: Medium, C: High, D: Very High)
  - 5 Category breakdown with expandable improvement tips:
    - Legal & Compliance (20% weight)
    - Financial Health (35% weight)
    - Operational Dynamics (20% weight)
    - Sector & Regulatory (15% weight)
    - AML & Ownership (10% weight)
  - Fee Impact visualization showing potential savings
  - Rating Scale explanation with current position indicator
  - How to Improve section with 3 actionable steps
  - About Risk Scoring info banner
  
### UI/UX Fixes Verified
- Employer Portal gradient icons (`bg-gradient-to-br from-primary to-emerald-600`)
- Date range selectors on Employees and Advances pages
- Country filters (Kenya, Uganda, Tanzania, Rwanda)
- Currency selectors (KES, UGX, TZS, RWF)
- Department Distribution grid layout fix

### Backend Updates
- EmployerResponse model extended with `risk_rating` and `risk_factors` fields

### Test Reports
- iteration_26.json: Employer Portal UI (100% pass)
- iteration_27.json: Risk Insights Page (100% pass)

---

## Feb 14, 2026 - Employee Portal Revert & Employer Portal Fixes

### Reverted
- Employee Portal dark theme redesign (reverted to original light theme)

### Fixed
- Employer Portal icon backgrounds changed from solid green to gradient
- Added date/country/currency filters to Employees and Advances pages
- Fixed Department Distribution overlapping layout

---

## Previous Sessions
- Employer Portal complete with 8-step onboarding
- Employee Portal with 7-step KYC flow
- Admin Portal with Risk Scoring Calculator
- JWT + Google OAuth authentication
- 60 demo employees seeded with varying data
