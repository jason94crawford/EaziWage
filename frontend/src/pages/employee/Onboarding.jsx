import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, MapPin, Building2, Calendar, ArrowRight, ArrowLeft,
  Phone, Briefcase, Wallet, CreditCard, Check, Sparkles,
  Shield, FileText, AlertCircle, ChevronRight, ChevronDown, Globe,
  Upload, Camera, Home, Receipt, Landmark, X, File, Eye, ScanFace
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { employeeApi, employerApi, kycApi } from '../../lib/api';
import { EMPLOYMENT_TYPES } from '../../lib/utils';
import { toast } from 'sonner';
import { useTheme } from '../../lib/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

// Countries of Work with Mobile Money Providers (East African region only)
const COUNTRIES_OF_WORK = [
  { code: 'KE', name: 'Kenya', providers: ['M-PESA', 'Airtel Money'] },
  { code: 'UG', name: 'Uganda', providers: ['MTN MoMo', 'Airtel Money'] },
  { code: 'TZ', name: 'Tanzania', providers: ['M-PESA', 'Tigo Pesa'] },
  { code: 'RW', name: 'Rwanda', providers: ['MTN MoMo', 'Airtel Money'] },
];

// Full list of countries for nationality
const ALL_COUNTRIES = [
  { code: 'AF', name: 'Afghanistan' }, { code: 'AL', name: 'Albania' }, { code: 'DZ', name: 'Algeria' },
  { code: 'AD', name: 'Andorra' }, { code: 'AO', name: 'Angola' }, { code: 'AG', name: 'Antigua and Barbuda' },
  { code: 'AR', name: 'Argentina' }, { code: 'AM', name: 'Armenia' }, { code: 'AU', name: 'Australia' },
  { code: 'AT', name: 'Austria' }, { code: 'AZ', name: 'Azerbaijan' }, { code: 'BS', name: 'Bahamas' },
  { code: 'BH', name: 'Bahrain' }, { code: 'BD', name: 'Bangladesh' }, { code: 'BB', name: 'Barbados' },
  { code: 'BY', name: 'Belarus' }, { code: 'BE', name: 'Belgium' }, { code: 'BZ', name: 'Belize' },
  { code: 'BJ', name: 'Benin' }, { code: 'BT', name: 'Bhutan' }, { code: 'BO', name: 'Bolivia' },
  { code: 'BA', name: 'Bosnia and Herzegovina' }, { code: 'BW', name: 'Botswana' }, { code: 'BR', name: 'Brazil' },
  { code: 'BN', name: 'Brunei' }, { code: 'BG', name: 'Bulgaria' }, { code: 'BF', name: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi' }, { code: 'CV', name: 'Cabo Verde' }, { code: 'KH', name: 'Cambodia' },
  { code: 'CM', name: 'Cameroon' }, { code: 'CA', name: 'Canada' }, { code: 'CF', name: 'Central African Republic' },
  { code: 'TD', name: 'Chad' }, { code: 'CL', name: 'Chile' }, { code: 'CN', name: 'China' },
  { code: 'CO', name: 'Colombia' }, { code: 'KM', name: 'Comoros' }, { code: 'CG', name: 'Congo' },
  { code: 'CD', name: 'Congo (DRC)' }, { code: 'CR', name: 'Costa Rica' }, { code: 'CI', name: "Côte d'Ivoire" },
  { code: 'HR', name: 'Croatia' }, { code: 'CU', name: 'Cuba' }, { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czech Republic' }, { code: 'DK', name: 'Denmark' }, { code: 'DJ', name: 'Djibouti' },
  { code: 'DM', name: 'Dominica' }, { code: 'DO', name: 'Dominican Republic' }, { code: 'EC', name: 'Ecuador' },
  { code: 'EG', name: 'Egypt' }, { code: 'SV', name: 'El Salvador' }, { code: 'GQ', name: 'Equatorial Guinea' },
  { code: 'ER', name: 'Eritrea' }, { code: 'EE', name: 'Estonia' }, { code: 'SZ', name: 'Eswatini' },
  { code: 'ET', name: 'Ethiopia' }, { code: 'FJ', name: 'Fiji' }, { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' }, { code: 'GA', name: 'Gabon' }, { code: 'GM', name: 'Gambia' },
  { code: 'GE', name: 'Georgia' }, { code: 'DE', name: 'Germany' }, { code: 'GH', name: 'Ghana' },
  { code: 'GR', name: 'Greece' }, { code: 'GD', name: 'Grenada' }, { code: 'GT', name: 'Guatemala' },
  { code: 'GN', name: 'Guinea' }, { code: 'GW', name: 'Guinea-Bissau' }, { code: 'GY', name: 'Guyana' },
  { code: 'HT', name: 'Haiti' }, { code: 'HN', name: 'Honduras' }, { code: 'HU', name: 'Hungary' },
  { code: 'IS', name: 'Iceland' }, { code: 'IN', name: 'India' }, { code: 'ID', name: 'Indonesia' },
  { code: 'IR', name: 'Iran' }, { code: 'IQ', name: 'Iraq' }, { code: 'IE', name: 'Ireland' },
  { code: 'IL', name: 'Israel' }, { code: 'IT', name: 'Italy' }, { code: 'JM', name: 'Jamaica' },
  { code: 'JP', name: 'Japan' }, { code: 'JO', name: 'Jordan' }, { code: 'KZ', name: 'Kazakhstan' },
  { code: 'KE', name: 'Kenya' }, { code: 'KI', name: 'Kiribati' }, { code: 'KP', name: 'North Korea' },
  { code: 'KR', name: 'South Korea' }, { code: 'KW', name: 'Kuwait' }, { code: 'KG', name: 'Kyrgyzstan' },
  { code: 'LA', name: 'Laos' }, { code: 'LV', name: 'Latvia' }, { code: 'LB', name: 'Lebanon' },
  { code: 'LS', name: 'Lesotho' }, { code: 'LR', name: 'Liberia' }, { code: 'LY', name: 'Libya' },
  { code: 'LI', name: 'Liechtenstein' }, { code: 'LT', name: 'Lithuania' }, { code: 'LU', name: 'Luxembourg' },
  { code: 'MG', name: 'Madagascar' }, { code: 'MW', name: 'Malawi' }, { code: 'MY', name: 'Malaysia' },
  { code: 'MV', name: 'Maldives' }, { code: 'ML', name: 'Mali' }, { code: 'MT', name: 'Malta' },
  { code: 'MH', name: 'Marshall Islands' }, { code: 'MR', name: 'Mauritania' }, { code: 'MU', name: 'Mauritius' },
  { code: 'MX', name: 'Mexico' }, { code: 'FM', name: 'Micronesia' }, { code: 'MD', name: 'Moldova' },
  { code: 'MC', name: 'Monaco' }, { code: 'MN', name: 'Mongolia' }, { code: 'ME', name: 'Montenegro' },
  { code: 'MA', name: 'Morocco' }, { code: 'MZ', name: 'Mozambique' }, { code: 'MM', name: 'Myanmar' },
  { code: 'NA', name: 'Namibia' }, { code: 'NR', name: 'Nauru' }, { code: 'NP', name: 'Nepal' },
  { code: 'NL', name: 'Netherlands' }, { code: 'NZ', name: 'New Zealand' }, { code: 'NI', name: 'Nicaragua' },
  { code: 'NE', name: 'Niger' }, { code: 'NG', name: 'Nigeria' }, { code: 'MK', name: 'North Macedonia' },
  { code: 'NO', name: 'Norway' }, { code: 'OM', name: 'Oman' }, { code: 'PK', name: 'Pakistan' },
  { code: 'PW', name: 'Palau' }, { code: 'PS', name: 'Palestine' }, { code: 'PA', name: 'Panama' },
  { code: 'PG', name: 'Papua New Guinea' }, { code: 'PY', name: 'Paraguay' }, { code: 'PE', name: 'Peru' },
  { code: 'PH', name: 'Philippines' }, { code: 'PL', name: 'Poland' }, { code: 'PT', name: 'Portugal' },
  { code: 'QA', name: 'Qatar' }, { code: 'RO', name: 'Romania' }, { code: 'RU', name: 'Russia' },
  { code: 'RW', name: 'Rwanda' }, { code: 'KN', name: 'Saint Kitts and Nevis' }, { code: 'LC', name: 'Saint Lucia' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines' }, { code: 'WS', name: 'Samoa' }, { code: 'SM', name: 'San Marino' },
  { code: 'ST', name: 'Sao Tome and Principe' }, { code: 'SA', name: 'Saudi Arabia' }, { code: 'SN', name: 'Senegal' },
  { code: 'RS', name: 'Serbia' }, { code: 'SC', name: 'Seychelles' }, { code: 'SL', name: 'Sierra Leone' },
  { code: 'SG', name: 'Singapore' }, { code: 'SK', name: 'Slovakia' }, { code: 'SI', name: 'Slovenia' },
  { code: 'SB', name: 'Solomon Islands' }, { code: 'SO', name: 'Somalia' }, { code: 'ZA', name: 'South Africa' },
  { code: 'SS', name: 'South Sudan' }, { code: 'ES', name: 'Spain' }, { code: 'LK', name: 'Sri Lanka' },
  { code: 'SD', name: 'Sudan' }, { code: 'SR', name: 'Suriname' }, { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' }, { code: 'SY', name: 'Syria' }, { code: 'TW', name: 'Taiwan' },
  { code: 'TJ', name: 'Tajikistan' }, { code: 'TZ', name: 'Tanzania' }, { code: 'TH', name: 'Thailand' },
  { code: 'TL', name: 'Timor-Leste' }, { code: 'TG', name: 'Togo' }, { code: 'TO', name: 'Tonga' },
  { code: 'TT', name: 'Trinidad and Tobago' }, { code: 'TN', name: 'Tunisia' }, { code: 'TR', name: 'Turkey' },
  { code: 'TM', name: 'Turkmenistan' }, { code: 'TV', name: 'Tuvalu' }, { code: 'UG', name: 'Uganda' },
  { code: 'UA', name: 'Ukraine' }, { code: 'AE', name: 'United Arab Emirates' }, { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' }, { code: 'UY', name: 'Uruguay' }, { code: 'UZ', name: 'Uzbekistan' },
  { code: 'VU', name: 'Vanuatu' }, { code: 'VA', name: 'Vatican City' }, { code: 'VE', name: 'Venezuela' },
  { code: 'VN', name: 'Vietnam' }, { code: 'YE', name: 'Yemen' }, { code: 'ZM', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe' },
];

// Terms of Service content
const TERMS_CONTENT = `Last Updated: October 2025

1. ACCEPTANCE OF TERMS
By accessing or using EaziWage's earned wage access services ("Services"), you confirm that you have read, understood, and agree to be legally bound by these Terms and Conditions ("Terms").
If you do not agree, you must not use the Services.
EaziWage reserves the right to amend these Terms at any time. Continued use constitutes acceptance of updated Terms.

2. ELIGIBILITY
To use the Services, you must:
• Be at least 18 years of age
• Be a current employee of an approved EaziWage employer partner
• Have a valid bank or registered mobile money account
• Provide accurate, current, and complete information
• Not be subject to any sanctions, fraud investigations, or regulatory restrictions
EaziWage may verify your identity, employment status, payroll data, and bank/mobile account information at any time.
Eligibility is not guaranteed and may be revoked at EaziWage's discretion.

3. SERVICE DESCRIPTION
EaziWage provides earned wage access ("EWA") services enabling eligible employees to access a portion of wages already earned but not yet paid.
EaziWage:
• Calculates earned wages based on payroll data provided by your employer
• Determines available advance amounts using internal risk models
• Transfers approved advances to your nominated payout account
EaziWage is not a bank and does not provide traditional credit facilities.
Access to advances is discretionary and subject to risk assessment.

4. ADVANCE LIMITS & RISK ASSESSMENT
Advance limits are determined using automated risk models and may change without notice.
EaziWage may:
• Reduce advance limits
• Introduce cooldown periods
• Restrict withdrawal frequency
• Adjust risk-based fees
• Temporarily suspend or permanently restrict access
Access to advances is not guaranteed and may vary by employer, employee risk profile, or funding availability.

5. FEES & PRICING
5.1 Processing Fee
A processing fee applies to each approved advance. The fee is risk-based and may vary depending on internal risk assessment models, employer profile, transaction history, funding structure, and operational costs. Current indicative processing fees range between 3.5% and 6%, but may be adjusted at EaziWage's discretion.

5.2 Transaction / Disbursement Fee
A separate transaction or disbursement fee may apply to cover payment rail costs (including mobile money, bank transfer, card rails, or other payout channels). This fee may vary depending on:
• Selected payout method
• Transaction amount
• Banking or mobile network operator charges
• Regulatory levies or third-party processing costs
Transaction fees will be displayed prior to confirmation of each advance.

5.3 Total Cost Transparency
The total cost (processing fee + transaction fee, where applicable) will be clearly displayed before you confirm any advance request.

5.4 No Interest Representation
EaziWage does not charge interest. Fees are fixed transaction-based service fees and do not accrue over time.

5.5 Fee Adjustments
EaziWage reserves the right to:
• Modify fee structures
• Introduce new fee categories
• Adjust pricing bands
• Apply differentiated pricing by employer or employee risk tier
Any changes will be communicated via app notification, email, or updated Terms.

5.6 Failed or Reversed Transactions
If a transfer fails due to incorrect payout details provided by you, or is reversed by a bank or mobile money provider:
• Transaction fees remain payable
• Additional reprocessing fees may apply
• EaziWage may deduct associated costs from future advances or recover directly

5.7 Regulatory or Third-Party Cost Pass-Through
If regulatory, taxation, payment network, or third-party costs increase, EaziWage reserves the right to pass such costs through to users where legally permissible.

5.8 Refunds
Fees are non-refundable once an advance has been successfully disbursed, except where required by applicable law.
EaziWage reserves the right to modify fee structures at its discretion.
Fees remain payable even if access is later suspended due to breach or fraud.

6. REPAYMENT AUTHORIZATION
By using the Services, you:
• Authorize your employer to deduct advance amounts and applicable fees from your salary
• Authorize EaziWage to receive repayment directly from employer payroll systems
• Consent to direct debit, payroll integration, or standing instruction recovery mechanisms
If employment terminates before repayment:
• You remain personally liable for outstanding balances
• EaziWage may pursue recovery directly
• EaziWage may report default where legally permitted

7. FRAUD PREVENTION & VERIFICATION
EaziWage may implement fraud detection and verification measures including:
• Device fingerprinting
• SIM and mobile account verification
• Payroll anomaly detection
• Identity revalidation
• Transaction monitoring
• Behavioral analytics
• Employment status confirmation
• Employer funding verification
You agree to cooperate with verification requests.
Failure to cooperate may result in suspension.

8. SUSPENSION & RESTRICTION RIGHTS
EaziWage may, at its sole discretion, suspend, freeze, limit, or terminate access to Services immediately where:
• Fraud or suspected fraud is detected
• Payroll anomalies arise
• Employer funding failure occurs
• Risk exposure exceeds internal thresholds
• You breach these Terms
• Identity cannot be verified
• Regulatory obligations require suspension
• System misuse is detected
• Collusion with employer personnel is suspected
Suspension may occur without prior notice.
During suspension:
• No new advances will be issued
• Existing repayment obligations remain enforceable
• Access to account features may be restricted

9. REINSTATEMENT
Suspended accounts may be reinstated at EaziWage's discretion following:
• Verification of employment
• Identity revalidation
• Confirmation of payroll accuracy
• Employer funding confirmation
• Completion of internal review
Reinstatement is not guaranteed.

10. EMPLOYER DEFAULT & LIQUIDITY EVENTS
If your employer:
• Fails to remit payroll deductions
• Enters insolvency proceedings
• Delays funding
• Breaches funding agreements
EaziWage may:
• Suspend all employee access
• Freeze advances
• Accelerate recovery
• Initiate direct recovery from employees
Employees acknowledge that employer insolvency may impact service availability.

11. USER OBLIGATIONS
You agree to:
• Maintain confidentiality of login credentials
• Not share access with third parties
• Not manipulate payroll data
• Not attempt system exploitation
• Immediately notify EaziWage of unauthorized activity
• Maintain accurate bank/mobile details
You remain responsible for all activity under your account.

12. PROHIBITED CONDUCT
You may not:
• Provide false payroll or employment information
• Attempt to override system controls
• Use multiple accounts fraudulently
• Engage in collusion with employer administrators
• Misrepresent earned wage amounts
Confirmed fraud may result in:
• Permanent termination
• Civil recovery
• Criminal reporting where applicable

13. DATA PROTECTION & CONSENT
You consent to:
• Collection and processing of personal data
• Payroll data access
• Employer verification checks
• Risk scoring and profiling
• Sharing data with regulators where required
All data processing complies with the applicable local Data Protection laws.

14. SYSTEM AVAILABILITY
EaziWage does not guarantee uninterrupted service.
Services may be unavailable due to:
• Maintenance
• Security updates
• Regulatory directives
• Funding limitations
• Force majeure events

15. LIMITATION OF LIABILITY
To the maximum extent permitted by law:
EaziWage shall not be liable for:
• Indirect or consequential loss
• Loss arising from employer insolvency
• Delays in payroll remittance
• Data inaccuracies provided by employer
• Temporary suspension actions
• System downtime
Total liability shall not exceed the total fees paid by the user in the preceding 3 months.

16. INDEMNITY
You agree to indemnify and hold EaziWage harmless from claims arising from:
• Misrepresentation
• Fraud
• Breach of these Terms
• Unauthorized account use

17. TERMINATION
EaziWage may terminate your access at any time.
Termination does not extinguish outstanding repayment obligations.

18. REGULATORY COMPLIANCE
EaziWage operates in accordance with applicable on-country laws including:
• Digital Credit regulations
• Employment Act
• Data Protection Act
• Consumer protection legislation

19. DISPUTE RESOLUTION
Disputes shall first be resolved through internal review.
If unresolved, disputes shall be submitted to arbitration in Nairobi under Kenyan law.

20. GOVERNING LAW
These Terms are governed by the laws of the Republic of Kenya.
Jurisdiction shall lie in the courts of Nairobi.

21. CONTACT
support@eaziwage.com`;

// Privacy Policy content
const PRIVACY_CONTENT = `Last Updated: October 2025

1. INTRODUCTION
EaziWage ("we," "us," or "our") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.

2. INFORMATION WE COLLECT

Personal Information:
• Full name and contact details (email, phone number, address)
• National identification number or passport details
• Date of birth
• Employment information (employer, job title, salary)
• Bank account and mobile money details

Usage Information:
• Device information and IP address
• App usage patterns and preferences
• Transaction history

3. HOW WE USE YOUR INFORMATION
We use your information to:
• Verify your identity and eligibility for our services
• Process advance requests and disbursements
• Calculate risk scores and determine advance limits
• Communicate with you about your account and transactions
• Improve our services and develop new features
• Comply with legal and regulatory requirements
• Prevent fraud and ensure platform security

4. DATA SHARING
We may share your information with:
• Your employer (limited employment verification data only)
• Mobile money providers and banks for disbursements
• Regulatory authorities when required by law
• Service providers who assist in operating our platform

We DO NOT sell your personal data to third parties.

5. DATA SECURITY
We implement industry-standard security measures including:
• 256-bit SSL encryption for all data transmissions
• Secure data centers with physical access controls
• Regular security audits and penetration testing
• Employee access controls and training

6. DATA RETENTION
We retain your personal data for as long as necessary to provide our services and comply with legal obligations. Upon account closure, we retain certain data for up to 7 years as required by financial regulations.

7. YOUR RIGHTS
You have the right to:
• Access your personal data
• Correct inaccurate information
• Request deletion of your data (subject to legal requirements)
• Object to certain processing activities
• Data portability

8. COOKIES AND TRACKING
We use cookies and similar technologies to improve your experience. You can manage cookie preferences through your browser settings.

9. CHANGES TO THIS POLICY
We may update this Privacy Policy periodically. We will notify you of significant changes through the app or email.

10. CONTACT US
For privacy-related inquiries:
Email: privacy@eaziwage.com
Address: EaziWage Ltd, Westlands, Nairobi, Kenya`;

const STEPS = [
  { id: 'welcome', title: 'Welcome', icon: Sparkles },
  { id: 'terms', title: 'Terms & Privacy', icon: Shield },
  { id: 'face_id', title: 'Face ID', icon: ScanFace },
  { id: 'identity', title: 'ID Verification', icon: FileText },
  { id: 'address', title: 'Address', icon: Home },
  { id: 'tax', title: 'Tax Info', icon: Receipt },
  { id: 'employment', title: 'Employment', icon: Briefcase },
  { id: 'payment', title: 'Payment', icon: Wallet },
];

// File upload component
const FileUploader = ({ 
  label, 
  accept = "image/*,application/pdf", 
  description, 
  onUpload, 
  uploadedFile, 
  uploading,
  testId,
  required = false 
}) => {
  const fileInputRef = useRef(null);
  
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a valid image (JPEG, PNG) or PDF file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      onUpload(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium flex items-center gap-1">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        data-testid={testId}
      />
      <div 
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
          uploadedFile 
            ? 'border-primary bg-primary/5 dark:bg-primary/10' 
            : 'border-slate-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50'
        }`}
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-2 py-2">
            <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <span className="text-sm text-slate-600 dark:text-slate-400">Uploading...</span>
          </div>
        ) : uploadedFile ? (
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
              <Check className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[180px]">
                {uploadedFile.name || 'Document uploaded'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Click to replace</p>
            </div>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600 dark:text-slate-400">Click to upload</p>
            {description && (
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{description}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default function EmployeeOnboarding() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [employers, setEmployers] = useState([]);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Terms & Privacy inline display state
  const [showTermsContent, setShowTermsContent] = useState(false);
  const [showPrivacyContent, setShowPrivacyContent] = useState(false);
  
  // ID type state
  const [idType, setIdType] = useState('national_id');
  
  // File upload states
  const [uploadingFile, setUploadingFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({
    id_front: null,
    id_back: null,
    address_proof: null,
    tax_certificate: null,
    payslip_1: null,
    payslip_2: null,
    bank_statement: null,
    employment_contract: null,
    face_id: null,
  });
  
  // Face ID state
  const [faceIdCaptured, setFaceIdCaptured] = useState(false);
  const [faceIdEnabled, setFaceIdEnabled] = useState(true);
  const [capturingFaceId, setCapturingFaceId] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  
  const user = JSON.parse(localStorage.getItem('eaziwage_user') || '{}');
  
  const [formData, setFormData] = useState({
    employer_id: '',
    employee_code: '',
    national_id: '',
    id_type: 'national_id',
    nationality: '',
    date_of_birth: '',
    employment_type: '',
    job_title: '',
    monthly_salary: '',
    bank_name: '',
    bank_account: '',
    mobile_money_provider: '',
    mobile_money_number: '',
    country: '',
    // New KYC fields
    tax_id: '',
    address_line1: '',
    address_line2: '',
    city: '',
    postal_code: '',
    department: '',
    start_date: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employersRes, countriesRes] = await Promise.all([
          employerApi.list({ status: 'approved' })
        ]);
        setEmployers(employersRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
  }, []);

  const handleFileUpload = async (file, documentType) => {
    setUploadingFile(documentType);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', documentType);
      
      const response = await kycApi.uploadFile(formData);
      
      setUploadedFiles(prev => ({
        ...prev,
        [documentType]: {
          name: file.name,
          url: response.data.document_url,
          id: response.data.id
        }
      }));
      
      toast.success('Document uploaded successfully!');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to upload document');
    } finally {
      setUploadingFile(null);
    }
  };

  // Face ID capture functions
  const startFaceCapture = async () => {
    setCapturingFaceId(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      toast.error('Unable to access camera. Please allow camera permissions.');
      setCapturingFaceId(false);
    }
  };

  const stopFaceCapture = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCapturingFaceId(false);
  };

  const captureFaceId = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to blob
    canvas.toBlob(async (blob) => {
      if (blob) {
        stopFaceCapture();
        setUploadingFile('face_id');
        
        try {
          const formData = new FormData();
          formData.append('file', blob, 'face_id.jpg');
          formData.append('document_type', 'face_id');
          
          const response = await kycApi.uploadFile(formData);
          
          setUploadedFiles(prev => ({
            ...prev,
            face_id: {
              name: 'Face ID Captured',
              url: response.data.document_url,
              id: response.data.id
            }
          }));
          
          setFaceIdCaptured(true);
          toast.success('Face ID captured successfully!');
        } catch (err) {
          toast.error(err.response?.data?.detail || 'Failed to save Face ID');
        } finally {
          setUploadingFile(null);
        }
      }
    }, 'image/jpeg', 0.9);
  };

  const retakeFaceId = () => {
    setFaceIdCaptured(false);
    setUploadedFiles(prev => ({ ...prev, face_id: null }));
    startFaceCapture();
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      await employeeApi.create({
        ...formData,
        id_type: idType,
        monthly_salary: parseFloat(formData.monthly_salary),
        face_id_enabled: faceIdEnabled && faceIdCaptured
      });
      toast.success('Profile created successfully! Your documents are under review.');
      navigate('/employee');
    } catch (err) {
      let errorMessage = 'Failed to create profile';
      
      const detail = err.response?.data?.detail;
      if (detail) {
        if (typeof detail === 'string') {
          errorMessage = detail;
        } else if (Array.isArray(detail)) {
          errorMessage = detail.map(e => e.msg || e.message || JSON.stringify(e)).join(', ');
        } else if (typeof detail === 'object' && detail.msg) {
          errorMessage = detail.msg;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Reset mobile money provider when country changes
    if (field === 'country') {
      setFormData(prev => ({ ...prev, [field]: value, mobile_money_provider: '' }));
    }
  };

  const handleIdTypeChange = (type) => {
    setIdType(type);
    setFormData(prev => ({ 
      ...prev, 
      id_type: type,
      nationality: type === 'national_id' ? '' : prev.nationality 
    }));
  };

  const nextStep = () => {
    if (currentStep === 1 && !agreedToTerms) {
      setError('Please accept the Terms of Service and Privacy Policy to continue');
      return;
    }
    setError('');
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      // Track progress
      kycApi.updateKycStep(currentStep + 1).catch(() => {});
    }
  };

  const prevStep = () => {
    setError('');
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true; // Welcome
      case 1: return agreedToTerms; // Terms
      case 2: return true; // Face ID - can skip or complete
      case 3: {
        // ID Verification - need ID number, DOB, and at least front ID
        const hasIdNumber = formData.national_id;
        const hasDob = formData.date_of_birth;
        const hasIdFront = uploadedFiles.id_front;
        const hasNationality = idType === 'passport' ? formData.nationality : true;
        return hasIdNumber && hasDob && hasIdFront && hasNationality;
      }
      case 4: {
        // Address - need country, address, city, and proof of address (mandatory)
        return formData.country && formData.address_line1 && formData.city && uploadedFiles.address_proof;
      }
      case 5: {
        // Tax - TIN is optional but recommended
        return true; // Can skip
      }
      case 6: {
        // Employment - job title, type, salary, at least one payslip, and employment contract required
        return formData.job_title && formData.employment_type && formData.monthly_salary && 
               uploadedFiles.payslip_1 && uploadedFiles.employment_contract;
      }
      case 7: {
        // Payment - need mobile money AND bank account (both mandatory)
        return formData.mobile_money_provider && formData.mobile_money_number && 
               formData.bank_name && formData.bank_account && uploadedFiles.bank_statement;
      }
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Welcome
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Welcome to EaziWage, {user.full_name?.split(' ')[0] || 'there'}!
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-md mx-auto">
              Let's get you verified to access your earned wages instantly. This comprehensive KYC process takes about 5-10 minutes.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
              {[
                { icon: Shield, text: 'Secure & Private' },
                { icon: Wallet, text: 'Instant Transfers' },
                { icon: FileText, text: 'Quick Verification' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-primary/5 dark:bg-primary/10 rounded-xl text-sm">
                  <item.icon className="w-5 h-5 text-primary" />
                  <span className="text-slate-700 dark:text-slate-300">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 1: // Terms
        return (
          <div className="py-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Terms & Privacy
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Please review and accept our terms to continue
              </p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              {/* Terms of Service */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Terms of Service</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    By using EaziWage, you agree to our terms of service which govern your use of our earned wage access platform.
                  </p>
                  <button 
                    type="button"
                    onClick={() => setShowTermsContent(!showTermsContent)}
                    className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1"
                    data-testid="toggle-terms-content"
                  >
                    {showTermsContent ? 'Hide terms' : 'Read full terms'} 
                    <ChevronDown className={`w-4 h-4 transition-transform ${showTermsContent ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                {showTermsContent && (
                  <div className="border-t border-slate-200 dark:border-slate-700 p-4 max-h-48 overflow-y-auto bg-white dark:bg-slate-900/50">
                    <pre className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap font-sans leading-relaxed">
                      {TERMS_CONTENT}
                    </pre>
                  </div>
                )}
              </div>
              
              {/* Privacy Policy */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Privacy Policy</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    We take your privacy seriously. Your data is encrypted and never shared without your consent.
                  </p>
                  <button 
                    type="button"
                    onClick={() => setShowPrivacyContent(!showPrivacyContent)}
                    className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1"
                    data-testid="toggle-privacy-content"
                  >
                    {showPrivacyContent ? 'Hide privacy policy' : 'Read privacy policy'} 
                    <ChevronDown className={`w-4 h-4 transition-transform ${showPrivacyContent ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                {showPrivacyContent && (
                  <div className="border-t border-slate-200 dark:border-slate-700 p-4 max-h-48 overflow-y-auto bg-white dark:bg-slate-900/50">
                    <pre className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap font-sans leading-relaxed">
                      {PRIVACY_CONTENT}
                    </pre>
                  </div>
                )}
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-primary/5 dark:bg-primary/10 rounded-xl">
                <div className="relative flex items-center mt-0.5">
                  <input
                    type="checkbox"
                    id="agree-terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 checked:border-primary checked:bg-primary transition-all hover:border-primary"
                    data-testid="onboarding-terms-checkbox"
                  />
                  <Check className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100" />
                </div>
                <label htmlFor="agree-terms" className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                  I have read and agree to the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>
                </label>
              </div>
            </div>
          </div>
        );

      case 2: // Face ID Verification
        return (
          <div className="py-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                <ScanFace className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Face ID Verification
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Enable secure biometric login for quick access
              </p>
            </div>
            
            <div className="space-y-6 max-w-md mx-auto">
              {/* Benefits Card */}
              <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Why use Face ID?</h4>
                <ul className="space-y-2">
                  {[
                    'Quick and secure login without passwords',
                    'Enhanced security with biometric verification',
                    'Fraud prevention for your account',
                    'Seamless access to your dashboard'
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Face ID Capture Area */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700">
                {faceIdCaptured && uploadedFiles.face_id ? (
                  // Success State
                  <div className="text-center py-6">
                    <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-10 h-10 text-primary" />
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Face ID Captured!</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      Your biometric data has been securely saved.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={retakeFaceId}
                      className="rounded-xl"
                      data-testid="retake-face-id"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Retake Photo
                    </Button>
                  </div>
                ) : capturingFaceId ? (
                  // Camera Active State
                  <div className="space-y-4">
                    <div className="relative bg-black rounded-xl overflow-hidden aspect-[4/3]">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      {/* Face Guide Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-48 h-60 border-4 border-white/50 rounded-full" />
                      </div>
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={stopFaceCapture}
                        className="flex-1 rounded-xl"
                        data-testid="cancel-face-capture"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={captureFaceId}
                        disabled={uploadingFile === 'face_id'}
                        className="flex-1 rounded-xl bg-gradient-to-r from-primary to-emerald-600 text-white"
                        data-testid="capture-face-btn"
                      >
                        {uploadingFile === 'face_id' ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Camera className="w-4 h-4 mr-2" />
                            Capture
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                      Position your face within the oval guide and click Capture
                    </p>
                  </div>
                ) : (
                  // Initial State
                  <div className="text-center py-6">
                    <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ScanFace className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Set up Face ID</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      Take a photo to enable biometric login
                    </p>
                    <Button
                      type="button"
                      onClick={startFaceCapture}
                      className="rounded-xl bg-gradient-to-r from-primary to-emerald-600 text-white"
                      data-testid="start-face-capture"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Start Camera
                    </Button>
                  </div>
                )}
              </div>

              {/* Enable/Disable Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Enable Face ID Login</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Use face recognition to sign in</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFaceIdEnabled(!faceIdEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                    faceIdEnabled ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                  data-testid="face-id-toggle"
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                    faceIdEnabled ? "translate-x-[22px]" : "translate-x-0.5"
                  }`} />
                </button>
              </div>

              {/* Skip Option */}
              {!faceIdCaptured && (
                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                  You can also <button type="button" onClick={nextStep} className="text-primary font-medium hover:underline">skip this step</button> and set up Face ID later in Settings.
                </p>
              )}
            </div>
          </div>
        );

      case 3: // ID Verification (Scan ID/Passport)
        return (
          <div className="py-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-2">
                ID Verification
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Upload a clear photo of your identification document
              </p>
            </div>
            
            <div className="space-y-5 max-w-md mx-auto">
              {/* ID Type Selector */}
              <div className="flex flex-col gap-2">
                <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                  Identification Type *
                </Label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
                  <button
                    type="button"
                    onClick={() => handleIdTypeChange('national_id')}
                    className={`py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                      idType === 'national_id'
                        ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    data-testid="id-type-national"
                  >
                    National ID
                  </button>
                  <button
                    type="button"
                    onClick={() => handleIdTypeChange('passport')}
                    className={`py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                      idType === 'passport'
                        ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    data-testid="id-type-passport"
                  >
                    Passport
                  </button>
                </div>
              </div>

              {/* ID Number Field */}
              <div className="flex flex-col gap-2">
                <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                  {idType === 'passport' ? 'Passport Number *' : 'National ID Number *'}
                </Label>
                <Input
                  placeholder={idType === 'passport' ? 'e.g. AB1234567' : 'e.g. 12345678'}
                  value={formData.national_id}
                  onChange={(e) => updateField('national_id', e.target.value)}
                  className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  data-testid="onboarding-national-id"
                />
              </div>

              {/* Country of Nationality (Only for Passport) */}
              {idType === 'passport' && (
                <div className="flex flex-col gap-2">
                  <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    Country of Nationality *
                  </Label>
                  <Select value={formData.nationality} onValueChange={(v) => updateField('nationality', v)}>
                    <SelectTrigger className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700" data-testid="onboarding-nationality">
                      <SelectValue placeholder="Select your nationality" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {ALL_COUNTRIES.map((c) => (
                        <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                  Date of Birth *
                </Label>
                <Input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => updateField('date_of_birth', e.target.value)}
                  className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  data-testid="onboarding-dob"
                />
              </div>

              {/* Document Uploads */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                <h4 className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <Camera className="w-4 h-4 text-primary" />
                  Upload ID Document
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <FileUploader
                    label="Front Side"
                    description="Clear photo of front"
                    onUpload={(file) => handleFileUpload(file, 'id_front')}
                    uploadedFile={uploadedFiles.id_front}
                    uploading={uploadingFile === 'id_front'}
                    testId="upload-id-front"
                    required
                  />
                  <FileUploader
                    label="Back Side"
                    description="Clear photo of back"
                    onUpload={(file) => handleFileUpload(file, 'id_back')}
                    uploadedFile={uploadedFiles.id_back}
                    uploading={uploadingFile === 'id_back'}
                    testId="upload-id-back"
                  />
                </div>
                
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ensure all text is clearly visible and the photo is not blurry
                </p>
              </div>
            </div>
          </div>
        );

      case 4: // Address Verification
        return (
          <div className="py-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                <Home className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Address Verification
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Provide your current residential address
              </p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="flex flex-col gap-2">
                <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                  Country of Work *
                </Label>
                <Select value={formData.country} onValueChange={(v) => updateField('country', v)}>
                  <SelectTrigger className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700" data-testid="onboarding-country">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES_OF_WORK.map((c) => (
                      <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-slate-500 dark:text-slate-400 text-xs ml-1">
                  EaziWage operates in Kenya, Uganda, Tanzania, and Rwanda
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                  Address Line 1 *
                </Label>
                <Input
                  placeholder="Street address, P.O. box"
                  value={formData.address_line1}
                  onChange={(e) => updateField('address_line1', e.target.value)}
                  className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                  data-testid="onboarding-address1"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                  Address Line 2
                </Label>
                <Input
                  placeholder="Apartment, suite, building (optional)"
                  value={formData.address_line2}
                  onChange={(e) => updateField('address_line2', e.target.value)}
                  className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                  data-testid="onboarding-address2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                    City/Town *
                  </Label>
                  <Input
                    placeholder="e.g. Nairobi"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                    data-testid="onboarding-city"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                    Postal Code
                  </Label>
                  <Input
                    placeholder="e.g. 00100"
                    value={formData.postal_code}
                    onChange={(e) => updateField('postal_code', e.target.value)}
                    className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                    data-testid="onboarding-postal"
                  />
                </div>
              </div>

              {/* Address Proof Upload - Required */}
              <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20 space-y-3">
                <h4 className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Proof of Address *
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Upload a utility bill, bank statement, or lease agreement (less than 3 months old)
                </p>
                <FileUploader
                  label="Address Proof Document"
                  description="Utility bill, bank statement, or lease"
                  onUpload={(file) => handleFileUpload(file, 'address_proof')}
                  uploadedFile={uploadedFiles.address_proof}
                  uploading={uploadingFile === 'address_proof'}
                  testId="upload-address-proof"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 5: // Tax Identification
        return (
          <div className="py-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                <Receipt className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Tax Information
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Provide your tax identification number for compliance
              </p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800/30">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      <strong>Why we need this:</strong> Tax compliance is required by financial regulations in all our operating countries.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                  Tax Identification Number (TIN)
                </Label>
                <Input
                  placeholder="Enter your TIN"
                  value={formData.tax_id}
                  onChange={(e) => updateField('tax_id', e.target.value)}
                  className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                  data-testid="onboarding-tin"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                  Also known as PIN in Kenya, TIN in Tanzania, or TIN in Uganda/Rwanda
                </p>
              </div>

              {/* Tax Certificate Upload */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Tax Certificate (Optional)
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Upload your tax registration certificate or compliance certificate
                </p>
                <FileUploader
                  label="Tax Certificate"
                  description="TIN certificate or compliance document"
                  onUpload={(file) => handleFileUpload(file, 'tax_certificate')}
                  uploadedFile={uploadedFiles.tax_certificate}
                  uploading={uploadingFile === 'tax_certificate'}
                  testId="upload-tax-cert"
                />
              </div>

              <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                Don't have your TIN yet? You can <button type="button" onClick={nextStep} className="text-primary font-medium hover:underline">skip this step</button> and add it later.
              </p>
            </div>
          </div>
        );

      case 6: // Employment & Salary
        return (
          <div className="py-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Employment Details
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Tell us about your current employment
              </p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="flex flex-col gap-2">
                <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                  Job Title *
                </Label>
                <Input
                  placeholder="e.g. Software Engineer"
                  value={formData.job_title}
                  onChange={(e) => updateField('job_title', e.target.value)}
                  className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                  data-testid="onboarding-job-title"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                    Employment Type *
                  </Label>
                  <Select value={formData.employment_type} onValueChange={(v) => updateField('employment_type', v)}>
                    <SelectTrigger className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700" data-testid="onboarding-employment-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {EMPLOYMENT_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                    Start Date
                  </Label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => updateField('start_date', e.target.value)}
                    className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                    data-testid="onboarding-start-date"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                  Monthly Gross Salary *
                </Label>
                <Input
                  type="number"
                  placeholder="e.g. 50000"
                  min="0"
                  value={formData.monthly_salary}
                  onChange={(e) => updateField('monthly_salary', e.target.value)}
                  className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                  data-testid="onboarding-salary"
                />
              </div>

              {/* Payslip Uploads - Required */}
              <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20 space-y-3">
                <h4 className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Recent Payslips *
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Upload your last 1-2 payslips to verify your salary (required for verification)
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <FileUploader
                    label="Payslip 1"
                    description="Most recent"
                    onUpload={(file) => handleFileUpload(file, 'payslip_1')}
                    uploadedFile={uploadedFiles.payslip_1}
                    uploading={uploadingFile === 'payslip_1'}
                    testId="upload-payslip1"
                    required
                  />
                  <FileUploader
                    label="Payslip 2"
                    description="Previous month"
                    onUpload={(file) => handleFileUpload(file, 'payslip_2')}
                    uploadedFile={uploadedFiles.payslip_2}
                    uploading={uploadingFile === 'payslip_2'}
                    testId="upload-payslip2"
                  />
                </div>
              </div>

              {/* Employment Contract Upload - Required */}
              <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20 space-y-3">
                <h4 className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Employment Contract *
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Upload a copy of your employment contract or offer letter
                </p>
                <FileUploader
                  label="Employment Contract"
                  description="Contract or offer letter"
                  onUpload={(file) => handleFileUpload(file, 'employment_contract')}
                  uploadedFile={uploadedFiles.employment_contract}
                  uploading={uploadingFile === 'employment_contract'}
                  testId="upload-employment-contract"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 7: // Payment (Bank/Wallet Verification)
        // Get mobile money providers based on country of work selected in Address step
        const selectedWorkCountry = COUNTRIES_OF_WORK.find(c => c.code === formData.country);
        const mobileMoneyProviders = selectedWorkCountry?.providers || [];
        
        return (
          <div className="py-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Payment Details
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Where should we send your wage advances?
              </p>
            </div>
            
            <div className="space-y-6 max-w-md mx-auto">
              {/* Mobile Money - Required */}
              <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  Mobile Money *
                </h3>
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                      Provider *
                    </Label>
                    <Select 
                      value={formData.mobile_money_provider} 
                      onValueChange={(v) => updateField('mobile_money_provider', v)}
                      disabled={!formData.country}
                    >
                      <SelectTrigger className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700" data-testid="onboarding-mobile-provider">
                        <SelectValue placeholder={formData.country ? "Select provider" : "Complete Address step first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {mobileMoneyProviders.map((p) => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.country && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                        Available providers for {selectedWorkCountry?.name}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                      Mobile Number *
                    </Label>
                    <Input
                      type="tel"
                      placeholder={formData.country === 'KE' ? '+254 7XX XXX XXX' : formData.country === 'UG' ? '+256 7XX XXX XXX' : formData.country === 'TZ' ? '+255 7XX XXX XXX' : formData.country === 'RW' ? '+250 7XX XXX XXX' : '+XXX XXX XXX XXX'}
                      value={formData.mobile_money_number}
                      onChange={(e) => updateField('mobile_money_number', e.target.value)}
                      className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                      data-testid="onboarding-mobile-number"
                    />
                  </div>
                </div>
              </div>
              
              {/* Bank Account - Required */}
              <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-primary" />
                  Bank Account *
                </h3>
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                      Bank Name *
                    </Label>
                    <Input
                      placeholder="e.g. Kenya Commercial Bank"
                      value={formData.bank_name}
                      onChange={(e) => updateField('bank_name', e.target.value)}
                      className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                      data-testid="onboarding-bank-name"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">
                      Account Number *
                    </Label>
                    <Input
                      placeholder="e.g. 1234567890"
                      value={formData.bank_account}
                      onChange={(e) => updateField('bank_account', e.target.value)}
                      className="h-14 rounded-xl bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                      data-testid="onboarding-bank-account"
                    />
                  </div>

                  {/* Bank Statement Upload - Required */}
                  <FileUploader
                    label="Bank Statement *"
                    description="Last 3 months statement"
                    onUpload={(file) => handleFileUpload(file, 'bank_statement')}
                    uploadedFile={uploadedFiles.bank_statement}
                    uploading={uploadingFile === 'bank_statement'}
                    testId="upload-bank-statement"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 relative overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px]" />
      
      {/* Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center">
          <Link to="/" className="flex items-center gap-3 group" data-testid="logo-link">
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/30">
                <span className="text-white font-bold text-xl">E</span>
              </div>
            </div>
            <span className="font-heading font-bold text-2xl text-slate-900 dark:text-white">EaziWage</span>
          </Link>
          
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="absolute right-4 sm:right-6 lg:right-8 p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
            data-testid="theme-toggle"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps - Horizontal scrollable on mobile */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex items-center justify-between min-w-max px-2">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    index < currentStep
                      ? 'bg-primary text-white'
                      : index === currentStep
                      ? 'bg-gradient-to-br from-primary to-emerald-600 text-white shadow-lg shadow-primary/30'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-1 mx-1 sm:mx-2 rounded-full transition-all ${
                      index < currentStep ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                    style={{ width: '24px' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        
        <p className="text-center text-sm text-slate-600 dark:text-slate-400 mb-6">
          Step {currentStep + 1} of {STEPS.length}: <span className="font-medium text-slate-900 dark:text-white">{STEPS[currentStep].title}</span>
        </p>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/20 rounded-xl backdrop-blur-sm" data-testid="onboarding-error">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        {/* Step Content */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="h-14 px-6 rounded-2xl border-slate-200 dark:border-slate-700"
            data-testid="prev-step"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          
          {currentStep === STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !canProceed()}
              className="h-14 px-8 rounded-2xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white font-semibold shadow-xl shadow-primary/30 btn-glow"
              data-testid="complete-onboarding"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Completing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Complete Setup
                  <Check className="w-5 h-5" />
                </span>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={nextStep}
              disabled={!canProceed()}
              className="h-14 px-8 rounded-2xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white font-semibold shadow-xl shadow-primary/30 btn-glow"
              data-testid="next-step"
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
