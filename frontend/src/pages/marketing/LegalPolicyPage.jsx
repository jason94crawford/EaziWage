import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Shield, FileText, Scale, Gift, AlertTriangle, Bell } from 'lucide-react';
import { MarketingNav } from '../../components/layout/MarketingNav';
import { Footer } from '../../components/layout/Footer';

const policies = {
  'data-policy': {
    title: 'Data Privacy & Protection Policy',
    icon: Shield,
    lastUpdated: 'October 2025',
    content: [
      {
        heading: '1. Purpose and Scope',
        text: 'This Policy sets out how EaziWage Holdings Limited ("EaziWage", the "Firm", "we/us/our") and its associated entities (the "Group") collects, uses, discloses, transfers, stores, and protects personal data when providing earned-wage access and related services. It applies to employees/end-users, employer clients/HR & payroll admins, prospective users, our own staff, and vendors and other "associated persons". We are a data controller when we determine the purpose and means of processing (e.g., onboarding, KYC, credit/disbursement rails). We will register with the Office of the Data Protection Commissioner (ODPC) as required under the Data Protection Act No. 24 of 2019.'
      },
      {
        heading: '2. Legal & Regulatory Framework',
        text: 'We comply with: Data Protection Act of 2019 (No. 24 of 2019), Data Protection (General) Regulations of 2021, Data Protection (Registration of Data Controllers and Data Processors) Regulations of 2021, and ODPC Guidance including DPIA guidance and data-sharing code drafts. Where applicable, sectoral obligations (e.g., CBK rules via regulated partners) and AML/CFT obligations will also apply.'
      },
      {
        heading: '3. What Data We Collect',
        text: 'A. Identification & contact: Full name, national ID/passport no., KRA PIN (where relevant), mobile number, email, address. B. Employment & payroll: Employer name, staff ID, department, employment status, salary band, net/gross pay, pay cycle, leave/attendance. C. Financial/payment: Employee bank or mobile-money details, employer funding/settlement accounts, transaction identifiers, timestamps, amounts, fees. D. Technical & app usage: Device identifiers, IP, app telemetry, cookies/SDK events. E. Verification/KYC artifacts: Documents/photos strictly for verification. F. Support & comms: Tickets, call recordings (where lawful), consents, preferences. G. Special categories (sensitive personal data): We minimise collection of any sensitive data and apply heightened safeguards when unavoidable.'
      },
      {
        heading: '4. Lawful Bases for Processing',
        text: 'We rely on: Contract performance – to provide the EWA service; Legal obligation – to meet financial-crime, tax, employment, or data-protection obligations; Legitimate interests – to run, secure, and improve our platform; Consent – for specific optional features (e.g., marketing, certain analytics, or where consent is required for cross-border transfers of sensitive personal data).'
      },
      {
        heading: '5. Purpose Limitation & Data Minimisation',
        text: 'We collect only what is necessary for: verifying identity and employment; calculating earned-wage eligibility; disbursing funds; reconciliation, settlement, audit, and AML; customer support; product improvement & security; and legal and regulatory compliance. We do not use data for unrelated purposes without a compatible lawful basis.'
      },
      {
        heading: '6. Data Subject Rights',
        text: 'Under Kenyan law, you have the right to: be informed, access, rectify/correct, object/restrict, data portability (where technically feasible), and erasure (subject to legal/contractual limits). Requests are handled within statutory timelines.'
      },
      {
        heading: '7. Data Sharing & Processors',
        text: 'We may share data strictly on a need-to-know basis with: Payment partners and banks/investors for pay-outs and settlement; Employers (limited reports necessary to operate EWA); Regulated financial-crime partners (e.g., sanctions screening/KYC); Vendors/IT processors (hosting, SMS/OTP, support tools) under written DPAs; Authorities/regulators when required by law. We prohibit "onward sharing" by third parties without our written authorisation.'
      },
      {
        heading: '8. International (Cross-Border) Transfers',
        text: 'Personal data may be transferred outside Kenya only under the DPA and General Regulations, including: Adequacy or appropriate safeguards (e.g., SCCs/BCRs) demonstrated to ODPC; Necessity exceptions defined in law; and Consent for transfers of sensitive personal data where required.'
      },
      {
        heading: '9. Security Safeguards',
        text: 'We implement technical and organisational measures proportionate to risk, including: encryption in transit/at rest; network segmentation; device attestation; secrets management; role-based access and least privilege; secure SDLC; vendor security due diligence; continuous monitoring; and incident response with evidenced runbooks.'
      },
      {
        heading: '10. Breach Notification',
        text: 'If a personal-data breach occurs, we will assess impact and notify the ODPC within 72 hours of becoming aware where the breach meets notification thresholds, and notify affected data subjects without undue delay.'
      },
      {
        heading: '11. Contact',
        text: 'Data Protection Officer/Privacy Office: EaziWage Holdings Limited. Email: privacy@eaziwage.com. If you believe your data has been mishandled, contact us first. You may also complain to the Office of the Data Protection Commissioner (ODPC).'
      }
    ]
  },
  'abc-policy': {
    title: 'Anti-Bribery & Corruption Policy',
    icon: Scale,
    lastUpdated: 'October 2025',
    content: [
      {
        heading: '1. Policy Statement',
        text: 'EaziWage Holdings Limited (the "Firm") and its associated companies (the "Group") conduct business in an honest, ethical, and transparent manner. We adopt a zero-tolerance approach toward bribery, corruption, and facilitation payments, and we are committed to acting professionally, fairly, and with integrity in all business dealings. We shall comply with all applicable Kenyan laws regarding bribery, corruption, and related misconduct, especially the Bribery Act, No. 47 of 2016 and the Anti-Corruption and Economic Crimes Act of 2003 (ACECA). Any breach of this Policy will be regarded as serious misconduct and may lead to disciplinary action or referral to law enforcement.'
      },
      {
        heading: '2. Legal Framework in Kenya',
        text: 'Under the Bribery Act, No. 47 of 2016, a "bribe" means giving or receiving an offer, promise or advantage (financial or non-financial) where one knows or believes that acceptance would constitute improper performance. Key offences include: Offering, promising or giving a bribe (Section 5); Requesting, agreeing to receive, or accepting a bribe (Section 6); Bribing a foreign public official (Section 8); Failure of a private entity to prevent bribery (Sections 9 & 10). The Act has extra-territorial reach and entities found liable may be subject to civil or criminal sanctions.'
      },
      {
        heading: '3. Principles & Approach',
        text: 'We adopt a risk-based approach to preventing bribery: Proportionate procedures commensurate with risk exposure; Top-level commitment with visible support from senior management; Regular risk assessment of bribery corruption risks; Due diligence before engaging agents, contractors, third parties; Communication & training provided to all personnel; Monitoring, review & continuous improvement of controls. All records must be retained for at least five (5) years.'
      },
      {
        heading: '4. Prohibited Conduct',
        text: 'No employee, officer or associated person shall offer, promise, give, or authorize the giving of any financial or other advantage to any person to induce or reward improper performance. Facilitation payments are prohibited. Gifts may only be given or accepted in line with the Group\'s Gifts & Hospitality Policy, provided they are moderate, transparent, documented, and not given with any expectation of undue influence. Cash gifts are strictly prohibited.'
      },
      {
        heading: '5. Risk Assessment & Due Diligence',
        text: 'The Firm will conduct a bribery risk assessment at least annually covering: Country risk, Sector/industry risk, Transaction risk, Business partner/third-party risk, and Internal process risk. Due diligence on third parties includes sanctions checks, background and reputation checks, review of anti-bribery policies, reference checks, and clarification of ownership and beneficial owners.'
      },
      {
        heading: '6. Reporting',
        text: 'Any employee or associated person who is offered a bribe or becomes aware of suspicious conduct must refuse and immediately report the matter to the Chief Executive Officer. The Firm will not allow retaliation against any person who refuses to participate in bribery or who reports a concern in good faith. Anonymous or confidential reporting is permitted in line with the Whistleblowing Policy.'
      },
      {
        heading: '7. Roles & Responsibilities',
        text: 'Board/Senior Management: Approve and oversee this Policy, demonstrate visible support and leadership. Chief Executive Officer: Oversee day-to-day implementation, management, escalation decisions, and reporting. Employees & Associated Persons: Understand and comply with this Policy, participate in training, promptly report any actual or suspected bribery.'
      },
      {
        heading: '8. Enforcement',
        text: 'Violations of this policy may result in disciplinary action (including termination), personal criminal liability, corporate fines or sanctions, and reporting to regulatory or law enforcement agencies. Where a possible breach is detected, the Firm may self-report to relevant Kenyan authorities (e.g., EACC or DPP).'
      },
      {
        heading: '9. Contact',
        text: 'For inquiries regarding this policy, contact: info@eaziwage.com or +254 72 315 4900.'
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
