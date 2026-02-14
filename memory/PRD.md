# EaziWage - Earned Wage Access Platform PRD

## Product Overview
EaziWage is a full-stack earned wage access platform serving Kenya, Uganda, Tanzania, and Rwanda. The platform enables employees to access a portion of their earned wages before payday through mobile money and bank transfers.

## Core Features

### Authentication & User Management
- JWT-based custom authentication ✅
- Google OAuth integration (Emergent-managed) ✅
- Apple Login (MOCKED - Not implemented)
- Biometric Face ID (MOCKED - Not implemented)
- Role-based access: Employee, Employer, Admin ✅

### Employee Features
- **7-Step KYC Onboarding Flow** ✅
  - Step 1: Welcome
  - Step 2: Terms & Conditions
  - Step 3: ID Verification (National ID/Passport upload)
  - Step 4: Address Verification (Proof of address upload)
  - Step 5: Employment Details (Job info, payslips, **Employment Contract upload**)
  - Step 6: Payment Setup (Mobile Money & Bank Account)
  - Step 7: Review & Submit

- **Employee Dashboard** ✅ (Redesigned Feb 2026)
  - Speed Dial Counter showing available amount with animated circular progress
  - Quick stats grid (Earned Wages, Next Payday, Withdrawn, Employer)
  - Account status and KYC verification status
  - Recent activity section
  - Sidebar navigation (Desktop)
  - Bottom navigation (Mobile)

- **Request Advance Page** ✅ (Redesigned Feb 2026)
  - Circular progress amount selector
  - Amount slider with quick select buttons
  - Transaction summary with fee calculation
  - Disbursement method selector (Mobile Money / Bank)

- **Transaction History** ✅ (Redesigned Feb 2026)
  - Monthly stats cards
  - Filter pills (All, Pending, Completed, Failed)
  - Transaction list with status indicators

- **Profile & Settings** ✅ (Redesigned Feb 2026)
  - Profile card with verification badge
  - Payment methods display
  - Security settings (password, biometric toggle)
  - Preferences (notifications, theme, language)
  - Support section

### Employer Features (Partially Implemented)
- Company onboarding ✅
- Employer dashboard (Basic) ✅
- Employee management (PENDING)
- Payroll integration (PENDING)

### Admin Features (Partially Implemented)
- Admin dashboard ✅
- Employee verification (Basic) ✅
- KYC Review page (PENDING - P1)
- Risk Scoring calculator (PENDING - P2)
- Disbursement management (PENDING)

## Technical Architecture

### Backend (FastAPI)
- Python 3.x with FastAPI framework
- MongoDB database
- JWT authentication
- File upload handling for KYC documents
- Local storage at `/app/backend/uploads`

### Frontend (React)
- React with React Router DOM
- TailwindCSS styling
- Glass-morphism design system
- Shadcn/UI components
- Mobile-first responsive design

### Database Schema (MongoDB)
```javascript
// users collection
{
  email: String,
  password_hash: String,
  role: String, // 'employee', 'employer', 'admin'
  google_id: String,
  full_name: String,
  mobile_phone: String,
  kyc_status: String, // 'pending', 'submitted', 'approved', 'rejected'
  onboarding_step: Number,
  
  // KYC Documents
  id_document_front: String,
  id_document_back: String,
  address_proof: String,
  tax_certificate: String,
  payslip_1: String,
  payslip_2: String,
  bank_statement: String,
  selfie: String,
  employment_contract: String,  // Added Feb 2026
  
  // Employment Details
  job_title: String,
  employment_type: String,
  monthly_salary: Number,
  country: String,
  
  // Payment Methods
  bank_name: String,
  bank_account: String,
  mobile_money_provider: String,
  mobile_money_number: String,
  
  // Account Status
  status: String,
  risk_score: Number,
  advance_limit: Number,
  earned_wages: Number
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth initiation
- `GET /api/auth/google/callback` - Google OAuth callback

### Employee
- `GET /api/users/me` - Get current user
- `PUT /api/users/me/kyc` - Update KYC information
- `GET /api/employee/dashboard` - Dashboard stats

### KYC Document Upload
- `POST /api/kyc/upload/{doc_type}` - Upload KYC document
  - Supported types: `id_document_front`, `id_document_back`, `address_proof`, `tax_certificate`, `payslip_1`, `payslip_2`, `bank_statement`, `selfie`, `employment_contract`

### Advances
- `POST /api/advances` - Request advance
- `GET /api/advances` - List advances
- `GET /api/transactions` - List transactions

## Design System

### Color Palette
- Primary: `#0df259` (Emerald Green)
- Secondary: `#10b981`
- Dark mode backgrounds: `slate-900`, `slate-950`
- Light mode backgrounds: `slate-50`, `white`

### Glass-morphism Theme
- Backdrop blur: `backdrop-blur-xl`
- Semi-transparent backgrounds: `bg-white/70`, `bg-white/5`
- Border styling: `border-slate-200/50`, `border-white/10`
- Shadow effects: `shadow-lg`, `shadow-primary/30`

### Typography
- Headings: Bold, large sizes
- Body: Medium weights, readable sizes
- Mobile-first sizing with `sm:` and `lg:` breakpoints

## Test Credentials
- **Admin**: superadmin@eaziwage.com / Admin@12345
- **Employee**: demo.employee@eaziwage.com / Employee@123

## Completed Work (Feb 2026)

### Session 1 - Core Platform
- ✅ Marketing website (Landing, About, How It Works, etc.)
- ✅ JWT authentication system
- ✅ Google OAuth integration
- ✅ 7-step KYC onboarding flow
- ✅ Document upload endpoints
- ✅ Dynamic mobile money providers by country
- ✅ Business logic updates (mandatory fields, M-PESA text)

### Session 2 - Dashboard Redesign (Current)
- ✅ Employment Contract upload field added to onboarding
- ✅ Employee Dashboard redesigned with Speed Dial counter
- ✅ Request Advance page redesigned with circular progress
- ✅ Transactions page redesigned with filter pills
- ✅ Settings/Profile page redesigned with payment methods
- ✅ Footer scroll-to-top functionality fixed

## Pending Tasks

### P1 - High Priority
- Admin KYC Review page UI
- Risk Scoring calculator implementation

### P2 - Medium Priority
- Employer employee management pages
- Payroll integration

### Future/Backlog
- Biometric Face Scan functionality
- Apple Login integration
- Live Mobile Money API integration
- Live Bank Transfer API integration
- Push notifications
- Email notifications

## Mocked Features
- Mobile Money APIs (M-PESA, Airtel Money, MTN Mobile Money)
- Bank Transfer APIs
- Apple Login
- Face ID Login

## Third-Party Integrations
- `emergentintegrations` - Google OAuth
- `react-simple-maps` - Map visualization
- `react-tooltip` - Tooltips
- `axios` - API client

---
Last Updated: February 14, 2026
