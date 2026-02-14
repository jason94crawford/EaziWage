import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Shield, FileText, Scale, Gift, AlertTriangle, Bell } from 'lucide-react';
import { MarketingNav } from '../../components/layout/MarketingNav';
import { Footer } from '../../components/layout/Footer';

const policies = {
  'data-policy': {
    title: 'Data Policy',
    icon: Shield,
    lastUpdated: 'December 2025',
    content: [
      {
        heading: '1. Introduction',
        text: 'EaziWage is committed to protecting the privacy and security of your personal data. This Data Policy explains how we collect, use, store, and protect your information in compliance with the Kenya Data Protection Act, 2019, and other applicable East African data protection regulations.'
      },
      {
        heading: '2. Data Collection',
        text: 'We collect personal information necessary to provide our earned wage access services, including: identification documents for KYC verification, employment details, bank account and mobile money information, transaction history, and device information for security purposes.'
      },
      {
        heading: '3. Data Processing',
        text: 'Your data is processed solely for the purposes of: verifying your identity and employment, calculating your earned wages, processing advance requests, preventing fraud and ensuring security, and complying with legal and regulatory requirements.'
      },
      {
        heading: '4. Data Storage',
        text: 'All personal data is stored in secure, encrypted databases located in certified data centers. We retain your information only for as long as necessary to provide our services and comply with legal obligations.'
      },
      {
        heading: '5. Data Sharing',
        text: 'We do not sell your personal data. We may share information with: your employer (aggregated usage data only), mobile money providers and banks for transactions, regulatory authorities when legally required, and service providers who help us operate our platform (under strict confidentiality agreements).'
      },
      {
        heading: '6. Your Rights',
        text: 'You have the right to: access your personal data, request correction of inaccurate data, request deletion of your data (subject to legal requirements), withdraw consent at any time, and lodge a complaint with the Office of the Data Protection Commissioner.'
      },
      {
        heading: '7. Contact',
        text: 'For data-related inquiries, contact our Data Protection Officer at dpo@eaziwage.com.'
      }
    ]
  },
  'abc-policy': {
    title: 'Anti-Bribery & Corruption Policy',
    icon: Scale,
    lastUpdated: 'December 2025',
    content: [
      {
        heading: '1. Policy Statement',
        text: 'EaziWage maintains a zero-tolerance policy towards bribery and corruption in all its forms. We are committed to conducting business ethically and in compliance with all applicable anti-corruption laws, including the Bribery Act of Kenya and the UK Bribery Act.'
      },
      {
        heading: '2. Prohibited Conduct',
        text: 'All employees, partners, and agents of EaziWage are prohibited from: offering, promising, giving, or accepting bribes; making facilitation payments; giving or receiving improper gifts or hospitality; making political contributions on behalf of the company; and engaging in any form of kickback arrangements.'
      },
      {
        heading: '3. Due Diligence',
        text: 'We conduct appropriate due diligence on all business partners, agents, and third parties before entering into relationships. This includes assessing corruption risks and ensuring partners commit to our ethical standards.'
      },
      {
        heading: '4. Reporting',
        text: 'All employees and stakeholders are encouraged to report suspected violations through our confidential whistleblowing channel. Reports can be made anonymously, and we prohibit retaliation against anyone making a good-faith report.'
      },
      {
        heading: '5. Training',
        text: 'All employees receive regular training on anti-corruption compliance, including how to recognize and avoid corrupt practices.'
      },
      {
        heading: '6. Enforcement',
        text: 'Violations of this policy may result in disciplinary action, including termination of employment or business relationships, and may be reported to relevant authorities.'
      }
    ]
  },
  'code-of-ethics': {
    title: 'Code of Ethics',
    icon: FileText,
    lastUpdated: 'December 2025',
    content: [
      {
        heading: '1. Our Values',
        text: 'At EaziWage, we believe in treating every worker with dignity. Our core values are: Integrity - we do what is right, even when no one is watching; Transparency - we communicate openly and honestly; Respect - we value every individual; Excellence - we strive for the highest standards; and Impact - we measure success by the lives we improve.'
      },
      {
        heading: '2. Ethical Business Conduct',
        text: 'We conduct business honestly and fairly. We compete vigorously but ethically in the marketplace. We do not engage in unfair trade practices or make false or misleading statements about our services or competitors.'
      },
      {
        heading: '3. Conflicts of Interest',
        text: 'Employees must avoid situations where personal interests conflict with company interests. Any potential conflicts must be disclosed to management for review.'
      },
      {
        heading: '4. Confidentiality',
        text: 'We protect confidential information belonging to the company, our customers, and our partners. This obligation continues even after employment ends.'
      },
      {
        heading: '5. Fair Treatment',
        text: 'We treat all employees, customers, and partners fairly and with respect. We do not tolerate discrimination, harassment, or bullying of any kind.'
      },
      {
        heading: '6. Environmental Responsibility',
        text: 'We are committed to minimizing our environmental impact and promoting sustainable business practices.'
      },
      {
        heading: '7. Compliance',
        text: 'All employees must comply with applicable laws, regulations, and company policies. Ignorance of the law or policy is not an excuse.'
      }
    ]
  },
  'gifts-policy': {
    title: 'Gifts Policy',
    icon: Gift,
    lastUpdated: 'December 2025',
    content: [
      {
        heading: '1. Purpose',
        text: 'This policy provides guidance on the giving and receiving of gifts and hospitality to prevent improper influence on business decisions and maintain our reputation for integrity.'
      },
      {
        heading: '2. General Principles',
        text: 'Gifts and hospitality must be: reasonable in value, appropriate to the business relationship, not intended to influence business decisions, not given to government officials without prior approval, and properly recorded in company systems.'
      },
      {
        heading: '3. Acceptable Gifts',
        text: 'Generally acceptable gifts include: promotional items of nominal value, modest meals during business discussions, tickets to business-related events, and customary holiday gifts of modest value.'
      },
      {
        heading: '4. Prohibited Gifts',
        text: 'The following are never acceptable: cash or cash equivalents, gifts during contract negotiations, lavish entertainment, gifts that create a sense of obligation, and anything illegal or unethical.'
      },
      {
        heading: '5. Approval Requirements',
        text: 'Any gift or hospitality exceeding KES 10,000 in value must be pre-approved by management. All gifts to or from government officials require prior approval regardless of value.'
      },
      {
        heading: '6. Record Keeping',
        text: 'All gifts given or received must be recorded in the gift register, including the date, recipient/giver, value, and business purpose.'
      }
    ]
  },
  'aml-cft-policy': {
    title: 'AML & CFT Policy',
    icon: AlertTriangle,
    lastUpdated: 'December 2025',
    content: [
      {
        heading: '1. Introduction',
        text: 'EaziWage is committed to preventing money laundering and terrorist financing. This policy outlines our approach to Anti-Money Laundering (AML) and Combating the Financing of Terrorism (CFT) in compliance with the Proceeds of Crime and Anti-Money Laundering Act of Kenya and international standards.'
      },
      {
        heading: '2. Risk Assessment',
        text: 'We conduct regular risk assessments to identify and evaluate money laundering and terrorist financing risks. Our services are designed with appropriate controls to mitigate these risks.'
      },
      {
        heading: '3. Know Your Customer (KYC)',
        text: 'We verify the identity of all customers before providing services. This includes: collecting and verifying identification documents, understanding the nature and purpose of the business relationship, and ongoing monitoring of customer activity.'
      },
      {
        heading: '4. Transaction Monitoring',
        text: 'We monitor all transactions for suspicious activity. Our systems are designed to detect unusual patterns, large transactions, and other indicators of potential money laundering or terrorist financing.'
      },
      {
        heading: '5. Suspicious Activity Reporting',
        text: 'Any suspicious transactions or activities are reported to the Financial Reporting Centre (FRC) as required by law. Employees are trained to recognize and escalate suspicious activity.'
      },
      {
        heading: '6. Record Keeping',
        text: 'We maintain records of all customer identification information and transaction data for a minimum of seven years as required by law.'
      },
      {
        heading: '7. Training',
        text: 'All relevant employees receive regular AML/CFT training appropriate to their roles and responsibilities.'
      }
    ]
  },
  'whistleblowing-policy': {
    title: 'Whistleblowing Policy',
    icon: Bell,
    lastUpdated: 'December 2025',
    content: [
      {
        heading: '1. Purpose',
        text: 'This policy encourages and protects individuals who report suspected wrongdoing in good faith. We are committed to maintaining the highest standards of ethics and compliance.'
      },
      {
        heading: '2. What to Report',
        text: 'You should report any genuine concerns about: fraud, theft, or financial irregularities; bribery or corruption; violations of laws or regulations; health and safety violations; environmental damage; discrimination or harassment; and any other unethical conduct.'
      },
      {
        heading: '3. How to Report',
        text: 'Reports can be made through: your direct supervisor or manager, the Compliance Officer, our confidential whistleblowing hotline, or email to ethics@eaziwage.com. Anonymous reports are accepted.'
      },
      {
        heading: '4. Confidentiality',
        text: 'All reports will be treated confidentially to the extent possible. The identity of the whistleblower will only be disclosed if necessary for investigation or legal reasons.'
      },
      {
        heading: '5. Non-Retaliation',
        text: 'EaziWage prohibits any form of retaliation against individuals who make good-faith reports. Anyone who engages in retaliation will be subject to disciplinary action.'
      },
      {
        heading: '6. Investigation',
        text: 'All reports will be promptly and thoroughly investigated by appropriate personnel. Reporters will be informed of the outcome where appropriate.'
      },
      {
        heading: '7. Protection',
        text: 'Whistleblowers who report in good faith are protected under the Witness Protection Act and other applicable laws. We will take all reasonable steps to protect reporters from harm.'
      }
    ]
  }
};

export default function LegalPolicyPage() {
  const location = useLocation();
  const policyType = location.pathname.replace('/', '');
  const policy = policies[policyType];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [policyType]);

  if (!policy) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <MarketingNav />
        <div className="pt-32 pb-24 text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Policy not found</h1>
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = policy.icon;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <MarketingNav />
      
      {/* Hero */}
      <section className="pt-28 sm:pt-32 pb-12 sm:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 bg-grid" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              {policy.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
              Last updated: {policy.lastUpdated}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 lg:p-12 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="space-y-8">
              {policy.content.map((section, index) => (
                <div key={index}>
                  <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {section.heading}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                    {section.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
