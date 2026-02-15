# EaziWage Changelog

## Feb 15, 2026 - Comprehensive Employer Portal Updates

### Dashboard Changes
- ✅ Replaced "Total Advances" with "Advances This Month"
- ✅ Replaced "Pending Advances" with "Avg. Fee Rate (%)"
- ✅ Risk Assessment "View Details" now links to /employer/risk-insights
- ✅ Removed "View Status" button when verification pending

### Risk Insights Page (NEW)
- ✅ Composite Risk Score with circular progress
- ✅ Risk Rating Badge (A/B/C/D)
- ✅ 5 Category breakdown with expandable improvement tips
- ✅ Fee Impact visualization with scenarios
- ✅ Added to sidebar navigation with Shield icon

### Employees Page Updates
- ✅ Department Distribution now shows Pie Chart visualization
- ✅ View button opens Employee View Modal with full details
- ✅ Date selectors themed green (not blue)
- ✅ More spacing between metric cards and Department Distribution

### Advances Page Updates
- ✅ Removed "Pending" filter (advances are automated)
- ✅ Date selectors themed green
- ✅ Fixed duplicate filter button bug

### Reports Page Updates
- ✅ Removed "Pending Review" from Monthly Summary
- ✅ Added month selector (input type="month") for filtering

### Settings Page Updates
- ✅ Company Name is now read-only
- ✅ Payroll Cycle is now read-only (not dropdown)
- ✅ Added Employer Code display in green highlighted box

### Payroll Page Updates
- ✅ Added "Payroll API Connection" status card
- ✅ Added "Monthly EWA Deduction" summary (principal + fees)
- ✅ Manual uploads only (API requires Admin approval)

### Notifications
- ✅ Bell icon now shows functional dropdown
- ✅ Shows unread notification count
- ✅ Sample notifications with types (advance, system, employee)
- ✅ "View All Notifications" link

### Test Reports
- iteration_26.json: Previous UI fixes (gradient icons, filters)
- iteration_27.json: Risk Insights page
- iteration_28.json: Comprehensive UI/UX updates (100% pass)

### MOCKED Features
- Notifications data (hardcoded samples)
- API connection status (employer.payroll_api_connected)

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
