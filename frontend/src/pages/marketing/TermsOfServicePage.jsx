import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Scale, Users, CreditCard, Shield, AlertTriangle, Gavel, Mail, Calendar } from 'lucide-react';
import { MarketingNav } from '../../components/layout/MarketingNav';
import { Footer } from '../../components/layout/Footer';

const sections = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    icon: FileText,
    content: `Welcome to EaziWage. These Terms of Service ("Terms") govern your access to and use of the EaziWage platform, mobile applications, website, and related services (collectively, the "Services") provided by EaziWage Limited ("EaziWage", "we", "us", or "our").

By creating an account, accessing, or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use our Services.

These Terms constitute a legally binding agreement between you and EaziWage. Please read them carefully.

**Eligibility**
To use our Services, you must:
- Be at least 18 years of age
- Be legally capable of entering into binding contracts
- Be employed by an employer registered with EaziWage
- Be a resident of Kenya, Uganda, Tanzania, or Rwanda
- Not be prohibited from using the Services under applicable law`
  },
  {
    id: 'services',
    title: 'Description of Services',
    icon: CreditCard,
    content: `EaziWage provides an Earned Wage Access (EWA) platform that allows eligible employees to access a portion of their earned but unpaid wages before their regular payday.

**What EaziWage Is**
- A platform to access wages you have already earned through your employment
- A service that provides instant disbursement to your mobile money or bank account
- A tool to help manage cash flow between paydays

**What EaziWage Is Not**
- EaziWage is NOT a loan product
- EaziWage does NOT charge interest
- EaziWage does NOT create debt obligations
- EaziWage does NOT perform credit checks

**Service Availability**
- Services are available 24 hours a day, 7 days a week, subject to maintenance periods
- We do not guarantee uninterrupted or error-free service
- Features may vary by country and employer

**Advance Limits**
- You may access up to 50% of your earned wages, subject to employer policies
- Minimum and maximum advance amounts may apply
- Limits may be adjusted based on your usage history and risk profile`
  },
  {
    id: 'account',
    title: 'Your Account',
    icon: Users,
    content: `**Registration**
To use our Services, you must create an account by providing accurate, complete, and current information. You agree to update your information promptly if it changes.

**Account Security**
You are responsible for:
- Maintaining the confidentiality of your account credentials
- All activities that occur under your account
- Notifying us immediately of any unauthorized access or security breach
- Using a strong password and enabling two-factor authentication when available

**Account Verification**
We may require you to verify your identity and employment status. This may include:
- Government-issued identification
- Employment verification from your employer
- Mobile money or bank account verification
- Biometric verification

**Account Suspension or Termination**
We may suspend or terminate your account if you:
- Violate these Terms
- Provide false or misleading information
- Engage in fraudulent or suspicious activity
- Fail to repay advances through payroll deduction
- Are no longer employed by a registered employer`
  },
  {
    id: 'fees',
    title: 'Fees and Payment',
    icon: CreditCard,
    content: `**Fee Structure**
EaziWage charges a fee for each wage advance. Our fee ranges from 3.5% to 6.5% of the advance amount, depending on:
- Your employer's plan tier (Starter, Business, or Enterprise)
- Your personal risk profile based on usage history
- The amount of the advance

**Fee Disclosure**
The exact fee for each advance is displayed before you confirm the transaction. By confirming the advance, you agree to pay the displayed fee.

**No Hidden Fees**
EaziWage does not charge:
- Late payment fees
- Interest charges
- Monthly subscription fees
- Account maintenance fees
- Early access fees

**Repayment**
- Advance amounts plus fees are automatically deducted from your next paycheck
- You authorize your employer to deduct the total amount from your wages
- If your wages are insufficient to cover the full deduction, the remaining balance may be deducted from subsequent paychecks

**Payment Processing**
- Advances are disbursed via M-PESA, MTN Mobile Money, Airtel Money, or bank transfer
- Disbursement is typically instant for mobile money (under 3 seconds)
- Bank transfers may take 1-2 business days
- We are not responsible for delays caused by third-party payment providers`
  },
  {
    id: 'user-conduct',
    title: 'User Conduct',
    icon: Scale,
    content: `You agree not to:

**Prohibited Activities**
- Use the Services for any illegal purpose or in violation of any laws
- Provide false, inaccurate, or misleading information
- Impersonate another person or entity
- Attempt to gain unauthorized access to our systems or other users' accounts
- Use automated means (bots, scripts) to access the Services without our permission
- Interfere with or disrupt the Services or servers
- Circumvent any security measures or access controls
- Use the Services to harass, abuse, or harm others
- Engage in any activity that could damage, disable, or impair the Services

**Fraud Prevention**
Any attempt to defraud EaziWage, employers, or other users will result in:
- Immediate account termination
- Reporting to law enforcement authorities
- Civil action to recover damages
- Notification to your employer

**Compliance with Employer Policies**
Your use of EaziWage may be subject to additional policies set by your employer. You agree to comply with any such policies communicated to you.`
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    icon: Shield,
    content: `**EaziWage Property**
All content, features, and functionality of the Services, including but not limited to:
- The EaziWage name, logo, and branding
- Software, code, and technology
- Text, graphics, images, and design
- User interface and user experience

are owned by EaziWage or our licensors and are protected by international copyright, trademark, patent, and other intellectual property laws.

**License to Use**
We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Services for your personal, non-commercial use, subject to these Terms.

**Restrictions**
You may not:
- Copy, modify, or distribute any content from the Services
- Reverse engineer, decompile, or disassemble any software
- Remove any copyright or proprietary notices
- Use our trademarks without prior written permission
- Create derivative works based on the Services

**User Content**
Any content you submit to the Services (such as support requests or feedback) may be used by EaziWage for any purpose. You represent that you have the right to submit such content.`
  },
  {
    id: 'disclaimers',
    title: 'Disclaimers and Limitations',
    icon: AlertTriangle,
    content: `**Disclaimer of Warranties**
THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, EAZIWAGE DISCLAIMS ALL WARRANTIES, INCLUDING:
- MERCHANTABILITY
- FITNESS FOR A PARTICULAR PURPOSE
- NON-INFRINGEMENT
- ACCURACY OR COMPLETENESS OF INFORMATION
- UNINTERRUPTED OR ERROR-FREE SERVICE

**Limitation of Liability**
TO THE MAXIMUM EXTENT PERMITTED BY LAW, EAZIWAGE SHALL NOT BE LIABLE FOR:
- ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES
- LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES
- DAMAGES ARISING FROM YOUR USE OR INABILITY TO USE THE SERVICES
- DAMAGES CAUSED BY THIRD-PARTY SERVICES OR PAYMENT PROVIDERS

Our total liability for any claims arising under these Terms shall not exceed the total fees you paid to EaziWage in the twelve (12) months preceding the claim.

**Third-Party Services**
The Services may integrate with third-party services (mobile money providers, banks, etc.). We are not responsible for the availability, accuracy, or reliability of such services.`
  },
  {
    id: 'indemnification',
    title: 'Indemnification',
    icon: Shield,
    content: `You agree to indemnify, defend, and hold harmless EaziWage, its affiliates, officers, directors, employees, agents, and licensors from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to:

- Your use of the Services
- Your violation of these Terms
- Your violation of any rights of another party
- Your violation of any applicable law or regulation
- Any content you submit through the Services
- Any false or misleading information you provide

This indemnification obligation will survive termination of your account and these Terms.`
  },
  {
    id: 'dispute-resolution',
    title: 'Dispute Resolution',
    icon: Gavel,
    content: `**Governing Law**
These Terms shall be governed by and construed in accordance with the laws of the Republic of Kenya, without regard to its conflict of law provisions.

**Informal Resolution**
Before filing any formal dispute, you agree to first contact us at legal@eaziwage.com to attempt to resolve the dispute informally. Most disputes can be resolved through good-faith discussion.

**Arbitration**
Any dispute that cannot be resolved informally shall be submitted to binding arbitration in Nairobi, Kenya, in accordance with the rules of the Nairobi Centre for International Arbitration (NCIA). The arbitrator's decision shall be final and binding.

**Class Action Waiver**
You agree to resolve disputes with EaziWage on an individual basis only. You waive any right to bring or participate in a class action, collective action, or representative action.

**Time Limit**
Any claim arising from these Terms must be filed within one (1) year after the cause of action arises, or such claim shall be permanently barred.`
  },
  {
    id: 'changes',
    title: 'Changes to Terms',
    icon: Calendar,
    content: `We may modify these Terms at any time. When we make changes, we will:

- Post the updated Terms on our website and mobile applications
- Update the "Last Updated" date at the top of these Terms
- Notify you via email or in-app notification of material changes

**Your Acceptance**
Your continued use of the Services after any changes constitutes your acceptance of the new Terms. If you do not agree to the modified Terms, you must stop using the Services and close your account.

**No Waiver**
Our failure to enforce any provision of these Terms shall not constitute a waiver of that provision or any other provision.

**Severability**
If any provision of these Terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.`
  },
  {
    id: 'contact',
    title: 'Contact Information',
    icon: Mail,
    content: `If you have any questions about these Terms, please contact us:

**Legal Department**
Email: legal@eaziwage.com
Phone: +254 700 000 000

**Postal Address**
EaziWage Limited
Westlands Business Park, 4th Floor
Nairobi, Kenya

**For General Inquiries**
Email: hello@eaziwage.com
Website: www.eaziwage.com

We aim to respond to all inquiries within 5 business days.`
  }
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
        <div className="absolute inset-0 gradient-mesh opacity-50" />
        <div className="absolute inset-0 bg-grid opacity-50" />
        
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
            <Link to="/cookies" className="px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              Cookie Policy
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
