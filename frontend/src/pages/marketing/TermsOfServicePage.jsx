import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Scale, Users, CreditCard, Shield, AlertTriangle, Gavel, Mail, Calendar } from 'lucide-react';
import { MarketingNav } from '../../components/layout/MarketingNav';
import { Footer } from '../../components/layout/Footer';

const sections = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    icon: FileText,
    content: `By accessing or using EaziWage's earned wage access services ("Services"), you confirm that you have read, understood, and agree to be legally bound by these Terms and Conditions ("Terms").

If you do not agree, you must not use the Services.

EaziWage reserves the right to amend these Terms at any time. Continued use constitutes acceptance of updated Terms.`
  },
  {
    id: 'eligibility',
    title: '2. Eligibility',
    icon: Users,
    content: `To use the Services, you must:
- Be at least 18 years of age
- Be a current employee of an approved EaziWage employer partner
- Have a valid bank or registered mobile money account
- Provide accurate, current, and complete information
- Not be subject to any sanctions, fraud investigations, or regulatory restrictions

EaziWage may verify your identity, employment status, payroll data, and bank/mobile account information at any time.

**Eligibility is not guaranteed and may be revoked at EaziWage's discretion.**`
  },
  {
    id: 'services',
    title: '3. Service Description',
    icon: CreditCard,
    content: `EaziWage provides earned wage access ("EWA") services enabling eligible employees to access a portion of wages already earned but not yet paid.

**EaziWage:**
- Calculates earned wages based on payroll data provided by your employer
- Determines available advance amounts using internal risk models
- Transfers approved advances to your nominated payout account

**Important:** EaziWage is not a bank and does not provide traditional credit facilities. Access to advances is discretionary and subject to risk assessment.`
  },
  {
    id: 'limits',
    title: '4. Advance Limits & Risk Assessment',
    icon: Scale,
    content: `Advance limits are determined using automated risk models and may change without notice.

**EaziWage may:**
- Reduce advance limits
- Introduce cooldown periods
- Restrict withdrawal frequency
- Adjust risk-based fees
- Temporarily suspend or permanently restrict access

**Access to advances is not guaranteed** and may vary by employer, employee risk profile, or funding availability.`
  },
  {
    id: 'fees',
    title: '5. Fees & Pricing',
    icon: CreditCard,
    content: `**5.1 Processing Fee**
A processing fee applies to each approved advance. The fee is risk-based and may vary depending on internal risk assessment models, employer profile, transaction history, funding structure, and operational costs. Current indicative processing fees range between 3.5% and 6%, but may be adjusted at EaziWage's discretion.

**5.2 Transaction / Disbursement Fee**
A separate transaction or disbursement fee may apply to cover payment rail costs (including mobile money, bank transfer, card rails, or other payout channels).

**5.3 Total Cost Transparency**
The total cost (processing fee + transaction fee, where applicable) will be clearly displayed before you confirm any advance request.

**5.4 No Interest Representation**
EaziWage does not charge interest. Fees are fixed transaction-based service fees and do not accrue over time.

**5.5 Fee Adjustments**
EaziWage reserves the right to modify fee structures, introduce new fee categories, adjust pricing bands, and apply differentiated pricing by employer or employee risk tier.

**5.6 Failed or Reversed Transactions**
If a transfer fails due to incorrect payout details provided by you, or is reversed by a bank or mobile money provider:
- Transaction fees remain payable
- Additional reprocessing fees may apply
- EaziWage may deduct associated costs from future advances

**5.8 Refunds**
Fees are non-refundable once an advance has been successfully disbursed, except where required by applicable law.`
  },
  {
    id: 'repayment',
    title: '6. Repayment Authorization',
    icon: CreditCard,
    content: `By using the Services, you:
- Authorize your employer to deduct advance amounts and applicable fees from your salary
- Authorize EaziWage to receive repayment directly from employer payroll systems
- Consent to direct debit, payroll integration, or standing instruction recovery mechanisms

**If employment terminates before repayment:**
- You remain personally liable for outstanding balances
- EaziWage may pursue recovery directly
- EaziWage may report default where legally permitted`
  },
  {
    id: 'fraud',
    title: '7. Fraud Prevention & Verification',
    icon: Shield,
    content: `EaziWage may implement fraud detection and verification measures including:
- Device fingerprinting
- SIM and mobile account verification
- Payroll anomaly detection
- Identity revalidation
- Transaction monitoring
- Behavioral analytics
- Employment status confirmation
- Employer funding verification

You agree to cooperate with verification requests.
**Failure to cooperate may result in suspension.**`
  },
  {
    id: 'suspension',
    title: '8. Suspension & Restriction Rights',
    icon: AlertTriangle,
    content: `EaziWage may, at its sole discretion, suspend, freeze, limit, or terminate access to Services immediately where:
- Fraud or suspected fraud is detected
- Payroll anomalies arise
- Employer funding failure occurs
- Risk exposure exceeds internal thresholds
- You breach these Terms
- Identity cannot be verified
- Regulatory obligations require suspension
- System misuse is detected
- Collusion with employer personnel is suspected

**Suspension may occur without prior notice.**

During suspension:
- No new advances will be issued
- Existing repayment obligations remain enforceable
- Access to account features may be restricted`
  },
  {
    id: 'reinstatement',
    title: '9. Reinstatement',
    icon: Shield,
    content: `Suspended accounts may be reinstated at EaziWage's discretion following:
- Verification of employment
- Identity revalidation
- Confirmation of payroll accuracy
- Employer funding confirmation
- Completion of internal review

**Reinstatement is not guaranteed.**`
  },
  {
    id: 'employer-default',
    title: '10. Employer Default & Liquidity Events',
    icon: AlertTriangle,
    content: `If your employer:
- Fails to remit payroll deductions
- Enters insolvency proceedings
- Delays funding
- Breaches funding agreements

EaziWage may:
- Suspend all employee access
- Freeze advances
- Accelerate recovery
- Initiate direct recovery from employees

**Employees acknowledge that employer insolvency may impact service availability.**`
  },
  {
    id: 'user-obligations',
    title: '11. User Obligations',
    icon: Users,
    content: `You agree to:
- Maintain confidentiality of login credentials
- Not share access with third parties
- Not manipulate payroll data
- Not attempt system exploitation
- Immediately notify EaziWage of unauthorized activity
- Maintain accurate bank/mobile details

**You remain responsible for all activity under your account.**`
  },
  {
    id: 'prohibited',
    title: '12. Prohibited Conduct',
    icon: AlertTriangle,
    content: `You may not:
- Provide false payroll or employment information
- Attempt to override system controls
- Use multiple accounts fraudulently
- Engage in collusion with employer administrators
- Misrepresent earned wage amounts

**Confirmed fraud may result in:**
- Permanent termination
- Civil recovery
- Criminal reporting where applicable`
  },
  {
    id: 'data',
    title: '13. Data Protection & Consent',
    icon: Shield,
    content: `You consent to:
- Collection and processing of personal data
- Payroll data access
- Employer verification checks
- Risk scoring and profiling
- Sharing data with regulators where required

All data processing complies with the applicable local Data Protection laws.`
  },
  {
    id: 'availability',
    title: '14. System Availability',
    icon: Scale,
    content: `EaziWage does not guarantee uninterrupted service.

Services may be unavailable due to:
- Maintenance
- Security updates
- Regulatory directives
- Funding limitations
- Force majeure events`
  },
  {
    id: 'liability',
    title: '15. Limitation of Liability',
    icon: AlertTriangle,
    content: `To the maximum extent permitted by law, EaziWage shall not be liable for:
- Indirect or consequential loss
- Loss arising from employer insolvency
- Delays in payroll remittance
- Data inaccuracies provided by employer
- Temporary suspension actions
- System downtime

**Total liability shall not exceed the total fees paid by the user in the preceding 3 months.**`
  },
  {
    id: 'indemnity',
    title: '16. Indemnity',
    icon: Shield,
    content: `You agree to indemnify and hold EaziWage harmless from claims arising from:
- Misrepresentation
- Fraud
- Breach of these Terms
- Unauthorized account use`
  },
  {
    id: 'termination',
    title: '17. Termination',
    icon: Gavel,
    content: `EaziWage may terminate your access at any time.

**Termination does not extinguish outstanding repayment obligations.**`
  },
  {
    id: 'regulatory',
    title: '18. Regulatory Compliance',
    icon: Scale,
    content: `EaziWage operates in accordance with applicable on-country laws including:
- Digital Credit regulations
- Employment Act
- Data Protection Act
- Consumer protection legislation`
  },
  {
    id: 'dispute',
    title: '19. Dispute Resolution',
    icon: Gavel,
    content: `Disputes shall first be resolved through internal review.

If unresolved, disputes shall be submitted to arbitration in Nairobi under Kenyan law.`
  },
  {
    id: 'governing',
    title: '20. Governing Law',
    icon: Gavel,
    content: `These Terms are governed by the laws of the Republic of Kenya.

Jurisdiction shall lie in the courts of Nairobi.`
  },
  {
    id: 'contact',
    title: '21. Contact',
    icon: Mail,
    content: `For questions about these Terms, please contact us:

**Email:** support@eaziwage.com

**Hours:** Monday - Friday, 8:00 AM - 6:00 PM EAT

**Response Time:** We aim to respond to all inquiries within 24-48 business hours.`
  },
];

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = React.useState('acceptance');

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <MarketingNav />
      
      {/* Hero */}
      <section className="pt-32 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full text-sm font-semibold text-primary mb-6">
              <FileText className="w-4 h-4" />
              Legal
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">
              The rules and guidelines governing your use of EaziWage services.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Last updated: December 1, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Table of Contents - Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="font-heading font-bold text-slate-900 dark:text-white mb-4">Contents</h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeSection === section.id
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 lg:p-12">
                {sections.map((section) => (
                  <div 
                    key={section.id} 
                    id={section.id}
                    className="mb-12 last:mb-0 scroll-mt-32"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center">
                        <section.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
                        {section.title}
                      </h2>
                    </div>
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      {section.content.split('\n\n').map((paragraph, i) => {
                        if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                          return (
                            <h3 key={i} className="text-lg font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                              {paragraph.replace(/\*\*/g, '')}
                            </h3>
                          );
                        }
                        if (paragraph.includes('**')) {
                          const parts = paragraph.split(/\*\*(.*?)\*\*/);
                          return (
                            <p key={i} className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                              {parts.map((part, j) => 
                                j % 2 === 1 ? <strong key={j} className="text-slate-900 dark:text-white">{part}</strong> : part
                              )}
                            </p>
                          );
                        }
                        if (paragraph.startsWith('- ')) {
                          const items = paragraph.split('\n').filter(line => line.startsWith('- '));
                          return (
                            <ul key={i} className="list-disc pl-6 mb-4 space-y-2">
                              {items.map((item, j) => (
                                <li key={j} className="text-slate-600 dark:text-slate-400">
                                  {item.replace('- ', '')}
                                </li>
                              ))}
                            </ul>
                          );
                        }
                        if (paragraph === paragraph.toUpperCase() && paragraph.length > 50) {
                          return (
                            <p key={i} className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4 text-sm">
                              {paragraph}
                            </p>
                          );
                        }
                        return (
                          <p key={i} className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                            {paragraph}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Related Legal Documents
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/privacy" className="px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/contact" className="px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
