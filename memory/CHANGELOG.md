# EaziWage Changelog

## Feb 15, 2026 - Admin Portal & UI Fixes

### Employer Portal Fixes
- ✅ **Sidebar gradient icons** - Changed from solid green to `from-primary to-emerald-600`
- ✅ **User avatar gradient** - Sidebar user avatar now uses gradient background
- ✅ **Add Employee button removed** - Per user request
- ✅ **Request Review button** - Now functional with loading/success states
- ✅ **Payroll API Connection** - Default to "Auto Mode" (Manual requires admin approval)
- ✅ **Monthly EWA Deduction** - Fixed to match Dashboard totals

### New Admin Portal
- ✅ **AdminLayout.jsx** - New layout matching Employer Portal design with purple gradient
- ✅ **Dashboard.jsx** - Comprehensive admin dashboard with:
  - Platform metrics (Employers, Employees, Advances, Disbursed)
  - Monthly Performance cards
  - API Health summary
  - Alert cards for pending actions
  - Quick Actions section
- ✅ **Reconciliation.jsx** - Payment tracking with:
  - Summary cards (Disbursed, Pending Recoupment, Recouped)
  - Reference tracking system (EWA-XXXXXXXX)
  - Per-employer breakdown with expandable details
- ✅ **APIHealth.jsx** - Integration status monitor with:
  - Overall health banner
  - M-PESA, Airtel Money, Bank Transfer, Payroll Sync status
  - Latency, uptime, transaction metrics

### Backend Additions
- ✅ `/api/admin/dashboard` - Platform-wide stats
- ✅ `/api/admin/reconciliation` - Reconciliation data with reference tracking
- ✅ `/api/admin/api-health` - API integration status
- ✅ `/api/admin/review-requests` - Employer review request handling
- ✅ `/api/admin/notifications` - Admin notification aggregation
- ✅ `/api/admin/employers/{id}/status` - Activate/deactivate employers
- ✅ `/api/admin/employers/{id}/risk-score` - Override risk scores
- ✅ `/api/admin/employees/{id}/status` - Activate/deactivate employees
- ✅ `/api/admin/employees/{id}/kyc` - Approve/reject KYC
- ✅ `/api/admin/advances/{id}/flag` - Flag for fraud review

### Bugs Fixed by Testing Agent
- AdminLayout.jsx - Fixed import path for useTheme hook
- Payroll.jsx - Fixed undefined 'stats' variable reference

### Test Reports
- iteration_29.json: All 15 features verified (100% pass)

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
