import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Database, UserCheck, Globe, Mail, Calendar } from 'lucide-react';
import { MarketingNav } from '../../components/layout/MarketingNav';
import { Footer } from '../../components/layout/Footer';

const sections = [
  {
    id: 'introduction',
    title: 'Introduction',
    icon: Shield,
    content: `EaziWage Limited ("EaziWage", "we", "us", or "our") is committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you use our earned wage access platform, mobile applications, and related services (collectively, the "Services").

By accessing or using our Services, you agree to this Privacy Policy. If you do not agree with the terms of this policy, please do not access or use our Services.`
  },
  {
    id: 'information-we-collect',
    title: 'Information We Collect',
    icon: Database,
    content: `We collect several types of information to provide and improve our Services:

**Personal Identification Information**
- Full name and contact details (email, phone number, address)
- National identification number or passport number
- Date of birth
- Employment information (employer name, job title, salary information)
- Bank account or mobile money account details

**Financial Information**
- Earned wage data received from your employer
- Transaction history within our platform
- Advance request history and repayment records

**Technical Information**
- Device information (device type, operating system, unique device identifiers)
- Log data (IP address, browser type, pages visited, time and date of access)
- Location data (with your consent)
- Cookies and similar tracking technologies

**Information from Third Parties**
- Employment verification data from your employer
- Payment processing information from mobile money providers
- Identity verification data from government databases (with your consent)`
  },
  {
    id: 'how-we-use',
    title: 'How We Use Your Information',
    icon: Eye,
    content: `We use the collected information for the following purposes:

**Service Delivery**
- To process your registration and verify your identity
- To calculate your available earned wages
- To process advance requests and disbursements
- To manage your account and provide customer support

**Service Improvement**
- To analyze usage patterns and improve our Services
- To develop new features and products
- To personalize your experience

**Security and Compliance**
- To detect and prevent fraud, unauthorized access, and other illegal activities
- To comply with legal obligations and regulatory requirements
- To enforce our Terms of Service

**Communication**
- To send service-related notifications (transaction confirmations, account updates)
- To respond to your inquiries and support requests
- To send marketing communications (with your consent)`
  },
  {
    id: 'data-sharing',
    title: 'How We Share Your Information',
    icon: UserCheck,
    content: `We may share your personal information in the following circumstances:

**With Your Employer**
We share aggregated, anonymized usage data with employers for reporting purposes. We do NOT share individual transaction details, advance amounts, or personal financial information with your employer.

**With Service Providers**
We work with trusted third-party service providers who assist us in operating our Services, including:
- Mobile Wallet providers for payment processing
- Cloud hosting providers for data storage
- Identity verification services
- Customer support platforms

**For Legal Compliance**
We may disclose your information when required by law, regulation, legal process, or governmental request, or when we believe disclosure is necessary to protect our rights, your safety, or the safety of others.

**Business Transfers**
In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction. We will notify you of any such change.

**With Your Consent**
We may share your information with other third parties when you have given us explicit consent to do so.`
  },
  {
    id: 'data-security',
    title: 'Data Security',
    icon: Lock,
    content: `We implement robust security measures to protect your personal information:

**Technical Safeguards**
- 256-bit SSL/TLS encryption for all data transmission
- AES-256 encryption for data at rest
- Secure data centers with physical access controls
- Regular security audits and penetration testing

**Operational Safeguards**
- Strict access controls limiting employee access to personal data
- Employee training on data protection and security
- Incident response procedures for potential data breaches

**User Security Features**
- Optional two-factor authentication (2FA)
- Biometric login options on mobile devices
- Automatic session timeouts
- Suspicious activity alerts

While we strive to protect your personal information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security but are committed to maintaining the highest standards.`
  },
  {
    id: 'data-retention',
    title: 'Data Retention',
    icon: Calendar,
    content: `We retain your personal information for as long as necessary to:

- Provide you with our Services
- Comply with our legal and regulatory obligations
- Resolve disputes and enforce our agreements
- Maintain adequate business records

**Retention Periods**
- Active account data: Retained while your account is active
- Transaction records: Retained for 7 years after the transaction (regulatory requirement)
- Identity verification documents: Retained for 5 years after account closure
- Marketing preferences: Retained until you withdraw consent

**Account Deletion**
You may request deletion of your account and associated data by contacting us. Some information may be retained as required by law or for legitimate business purposes.`
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    icon: UserCheck,
    content: `Depending on your location, you may have certain rights regarding your personal information:

**Access**
You have the right to request a copy of the personal information we hold about you.

**Correction**
You have the right to request that we correct any inaccurate or incomplete personal information.

**Deletion**
You have the right to request deletion of your personal information, subject to certain exceptions.

**Data Portability**
You have the right to receive your personal information in a structured, commonly used format.

**Objection**
You have the right to object to certain processing of your personal information, including direct marketing.

**Withdrawal of Consent**
Where we rely on your consent to process personal information, you have the right to withdraw that consent at any time.

To exercise any of these rights, please contact us at privacy@eaziwage.com.`
  },
  {
    id: 'international',
    title: 'International Data Transfers',
    icon: Globe,
    content: `EaziWage operates across Kenya, Uganda, Tanzania, and Rwanda. Your personal information may be transferred to and processed in countries other than your country of residence.

We ensure that such transfers comply with applicable data protection laws by implementing appropriate safeguards, including:

- Standard contractual clauses approved by relevant data protection authorities
- Data processing agreements with all third-party service providers
- Compliance with local data localization requirements where applicable

By using our Services, you consent to the transfer of your information as described in this section.`
  },
  {
    id: 'updates',
    title: 'Updates to This Policy',
    icon: Calendar,
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors.

**Notification of Changes**
We will notify you of any material changes by:
- Posting the updated policy on our website and mobile applications
- Sending an email notification to registered users
- Displaying an in-app notification

The "Last Updated" date at the top of this policy indicates when it was last revised. We encourage you to review this policy periodically.

Your continued use of our Services after any changes constitutes your acceptance of the updated Privacy Policy.`
  },
  {
    id: 'contact',
    title: 'Contact Us',
    icon: Mail,
    content: `If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

**Data Protection Officer**
Email: privacy@eaziwage.com
Phone: +254 700 000 000

**Postal Address**
EaziWage Limited
Westlands Business Park, 4th Floor
Nairobi, Kenya

**For EU/UK Residents**
If you are located in the European Union or United Kingdom and have concerns about our data practices that we have not addressed satisfactorily, you may have the right to lodge a complaint with your local data protection authority.

We aim to respond to all legitimate requests within 30 days.`
  }
];

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = React.useState('introduction');

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
              <Shield className="w-4 h-4" />
              Legal
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">
              How we collect, use, and protect your personal information.
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
            <Link to="/terms" className="px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              Terms of Service
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
