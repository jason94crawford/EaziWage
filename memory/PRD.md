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

- **Employee Dashboard** ✅ (Redesigned v3 - Feb 2026)
  - **SpeedDialCounter**: Animated circular progress showing available amount
  - **Stats Grid**: Earned This Month, Next Payday, Total Withdrawn, Employer
  - **Account Status**: Shows Account and KYC verification status
  - **Recent Activity**: Shows latest transactions
  - **Bottom Navigation**: Dark slate design with green gradient accents
  - Green gradient theme consistent with main website

- **Request Advance Page** ✅ (Redesigned v3 - Feb 2026)
  - Circular progress amount selector
  - Amount slider with quick select buttons
  - Transaction summary with fee calculation
  - Disbursement method selector (Mobile Money / Bank)
  - Not Verified state for pending KYC

- **Transaction History** ✅ (Redesigned v3 - Feb 2026)
  - Stats cards (This Month total, Total Transactions)
  - Filter pills (All, Pending, Completed, Failed)
  - Transaction list with status indicators
  - Export button for data export

- **Profile & Settings** ✅ (Redesigned v3 - Feb 2026)
  - **Profile Picture Upload**: Camera button to upload/change photo
  - **Editable Personal Info**: Full Name, Email, Phone with inline editing
  - **Editable Address**: Address Line 1, City, Postal Code
  - **Payment Methods**: M-PESA and Bank Account with Active badges
  - **KYC Documents Summary**: Shows status of all uploaded documents
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
- File upload handling for KYC documents and profile pictures
- Local storage at `/app/backend/uploads`

### Frontend (React)
- React with React Router DOM
- TailwindCSS styling
- Glass-morphism design system
- Shadcn/UI components
- Mobile-first responsive design
- Shared EmployeeLayout component with FloatingNav

### Database Schema (MongoDB)
```javascript
// users collection
{
  email: String,
  password_hash: String,
  role: String, // 'employee', 'employer', 'admin'
  google_id: String,
  full_name: String,
  phone: String,
  phone_country_code: String,
  profile_picture_url: String, // NEW - Profile picture path
  is_verified: Boolean,
  created_at: String
}

// employees collection
{
  user_id: String,
  employer_id: String,
  employer_name: String,
  employee_code: String,
  national_id: String,
  id_type: String,
  nationality: String,
  date_of_birth: String,
  employment_type: String,
  job_title: String,
  monthly_salary: Number,
  
  // Payment
  bank_name: String,
  bank_account: String,
  mobile_money_provider: String,
  mobile_money_number: String,
  
  // Address (NEW - Editable)
  address_line1: String,
  address_line2: String,
  city: String,
  postal_code: String,
  
  // KYC Documents
  id_document_front: String,
  id_document_back: String,
  address_proof: String,
  tax_certificate: String,
  payslip_1: String,
  payslip_2: String,
  bank_statement: String,
  selfie: String,
  employment_contract: String,
  
  // Status
  status: String,
  kyc_status: String,
  risk_score: Number,
  advance_limit: Number,
  earned_wages: Number
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google/callback` - Google OAuth callback

### User Settings (NEW)
- `GET /api/users/me/full-profile` - Get complete user profile with employee data and KYC documents
- `PUT /api/users/me/settings` - Update user settings (full_name, phone)
- `POST /api/users/me/profile-picture` - Upload profile picture

### Employee
- `GET /api/employees/me` - Get employee profile
- `PUT /api/employees/me/settings` - Update employee settings (address, payment details)
- `GET /api/employees/me/kyc-status` - Get KYC status with documents

### KYC Document Upload
- `POST /api/kyc/upload` - Upload KYC document
  - Supported types: `id_front`, `id_back`, `address_proof`, `tax_certificate`, `payslip_1`, `payslip_2`, `bank_statement`, `selfie`, `employment_contract`

### Dashboard
- `GET /api/dashboard/employee` - Employee dashboard stats

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

### Green Gradient Theme
- Gradient backgrounds: `from-primary via-emerald-500 to-teal-500`
- Gradient mesh backgrounds with subtle green glows
- Button gradients: `from-primary to-emerald-600`
- Icon backgrounds: `bg-primary/10` with `text-primary`

### Glass-morphism Theme
- Backdrop blur: `backdrop-blur-xl`
- Semi-transparent backgrounds: `bg-white/60`, `bg-slate-900/60`
- Border styling: `border-slate-200/50`, `border-slate-700/30`
- Shadow effects: `shadow-lg`, `shadow-primary/25`

### Typography
- Headings: Bold, large sizes with Plus Jakarta Sans
- Body: Inter font, medium weights, readable sizes
- Mobile-first sizing with `sm:` and `lg:` breakpoints

## Test Credentials
- **Admin**: superadmin@eaziwage.com / Admin@12345
- **Employee**: demo.employee@eaziwage.com / Employee@123

## Completed Work

### Session 1 - Core Platform
- ✅ Marketing website (Landing, About, How It Works, etc.)
- ✅ JWT authentication system
- ✅ Google OAuth integration
- ✅ 7-step KYC onboarding flow
- ✅ Document upload endpoints
- ✅ Dynamic mobile money providers by country

### Session 2 - Dashboard Redesign v3 (Feb 14, 2026)
- ✅ Employment Contract upload field added to onboarding
- ✅ **Complete Employee Dashboard Redesign**
  - SpeedDialCounter with animated circular progress
  - Fixed text overlay issue on Available Earnings
  - Green gradient theme matching main website
  - Dark slate bottom navigation
  - **Functional Notifications bell with panel**
- ✅ **Request Advance Page Redesign**
  - Circular progress amount selector
  - Quick amount buttons
  - Transaction summary with fees
  - **"Verification in Progress" state (not loop to complete verification)**
- ✅ **Transactions Page Redesign**
  - Filter pills (All, Pending, Completed, Failed)
  - Stats cards for monthly totals
- ✅ **Settings Page Complete Overhaul**
  - Profile picture upload functionality
  - Editable personal information fields
  - Editable address fields
  - Payment methods display
  - KYC Documents summary section
  - **All icons now green with white (consistent design)**
  - **Change Password modal (functional)**
  - **Biometric Face Scan modal (integrated)**
  - **Help Center - In-app expandable FAQs**
  - **Contact Support - In-app modal with phone/email/WhatsApp**
  - **Terms & Privacy - In-app scrollable content**
  - **Removed Language selection**
- ✅ **New Backend Endpoints**
  - GET /api/users/me/full-profile
  - PUT /api/users/me/settings
  - PUT /api/employees/me/settings
  - POST /api/users/me/profile-picture

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
