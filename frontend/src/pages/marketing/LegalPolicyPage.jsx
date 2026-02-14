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
    title: 'Gifts, Hospitality & Entertainment Policy',
    icon: Gift,
    lastUpdated: 'October 2025',
    content: [
      {
        heading: '1. Policy Statement',
        text: 'EaziWage Holdings Limited ("the Firm") and its associated entities (the "Group") is committed to conducting business in an honest, ethical, and transparent manner. Offering or accepting inappropriate gifts, hospitality, or entertainment can create actual or perceived conflicts of interest and may constitute bribery or corrupt conduct under Kenyan law. This Policy supports compliance with the Bribery Act of 2016, Anti-Corruption and Economic Crimes Act of 2003 (ACECA), and EACC Guidelines on Gifts and Conflict of Interest. The Group maintains zero tolerance for bribery, inducement, or any practice that compromises objectivity.'
      },
      {
        heading: '2. Purpose & Scope',
        text: 'This Policy provides clear guidance on the giving, receiving, and recording of gifts and hospitality; prevents bribery, conflicts of interest, and reputational risk; supports compliance with Kenyan law; and promotes transparency. It applies to all employees, directors, officers, contractors, consultants, agents, suppliers, and other third parties acting on behalf of the Group.'
      },
      {
        heading: '3. Legal Framework',
        text: 'Under the Bribery Act of 2016 and ACECA of 2003, it is an offence to: Offer, give, solicit, or accept any advantage to induce or reward improper performance; Provide or receive gifts with intent to influence a business decision; Fail to prevent bribery by associated persons; Fail to declare or record benefits received. Breaches can result in severe criminal penalties including fines, imprisonment (up to 10 years), or both.'
      },
      {
        heading: '4. Principles of Conduct',
        text: 'Legitimacy: Gifts must serve a genuine business purpose. Transparency: Must be declared and recorded in the Gifts & Hospitality Register. Proportionality: Must be modest and appropriate to the occasion. No Cash or Equivalents: Cash, vouchers, or other easily transferable benefits are prohibited. No Reciprocation Expectation: There must be no intention to induce favorable treatment. Public Official Caution: Extra care with government officials—even small gifts can be perceived as bribery.'
      },
      {
        heading: '5. Giving Gifts or Hospitality',
        text: 'Employees may offer modest gifts if: They are made transparently, in good faith, and for legitimate business purposes; They comply with this Policy and applicable laws; They are not frequent or extravagant; They are not made during active tenders, contract negotiations, or regulatory reviews. Acceptable: Token branded items of nominal value (<KES 10,000), working lunches, public/industry events. Prohibited: Cash, vouchers, lavish entertainment, anything to influence a tender/license/regulatory outcome.'
      },
      {
        heading: '6. Receiving Gifts or Hospitality',
        text: 'Employees must not solicit gifts. They may accept modest gestures only if: The value is below KES 10,000 per instance; It does not create obligation or conflict of interest; It is declared within five (5) working days; It is recorded in the Gifts & Hospitality Register. If a gift exceeds KES 10,000 or appears inappropriate: It must be politely declined or returned; If refusal may cause offence, the gift must be surrendered to the Compliance Department for appropriate disposition.'
      },
      {
        heading: '7. Gifts & Hospitality Register',
        text: 'Maintained by the Chief Executive Officer; Must record: date, giver/recipient, description, value, purpose, and decision; Reviewed quarterly by Senior Management and annually by Internal Audit; Retained for five (5) years for transparency and auditability.'
      },
      {
        heading: '8. Public Officials and Government Bodies',
        text: 'Gifts or hospitality to public officials are discouraged and permitted only in exceptional, pre-approved cases. All such offers must be pre-cleared by the Chief Executive Officer and recorded in the Register. Even minor benefits may be construed as attempts to improperly influence under the Bribery Act of 2016.'
      },
      {
        heading: '9. Violations',
        text: 'Failure to comply may result in: Internal disciplinary action (up to termination); Reporting to authorities (EACC, DPP); Criminal penalties under Kenyan law; Civil recovery or reputational sanctions.'
      },
      {
        heading: '10. Contact',
        text: 'For inquiries: info@eaziwage.com or +254 72 315 4900.'
      }
    ]
  },
  'aml-cft-policy': {
    title: 'AML & CFT Policy',
    icon: AlertTriangle,
    lastUpdated: 'October 2025',
    content: [
      {
        heading: '1. Policy Statement',
        text: 'EaziWage Holdings Limited ("the Firm") and its associated companies (the "Group") are fully committed to preventing the misuse of its operations, products, and services for money laundering, terrorist financing, or other financial crimes. The Firm maintains a zero-tolerance stance against financial crime and shall comply with: Proceeds of Crime and Anti-Money Laundering Act (POCAMLA), No. 9 of 2009; Proceeds of Crime and Anti-Money Laundering Regulations of 2013; Prevention of Terrorism Act of 2012; Guidelines issued by the Financial Reporting Centre (FRC); and CBK Prudential Guidelines on Anti-Money Laundering (CBK/PG/08).'
      },
      {
        heading: '2. Definition of Money Laundering and Terrorism Financing',
        text: 'Money Laundering (Section 3, POCAMLA): the process of concealing, disguising, converting, transferring, or dealing with the proceeds of crime to make them appear legitimate. Terrorism Financing: providing or collecting funds with the intention that they be used for terrorist acts. Money laundering typically involves three stages: Placement (introducing illicit funds), Layering (concealing origin through complex transactions), and Integration (reintroducing laundered funds into the economy).'
      },
      {
        heading: '3. Customer Due Diligence (CDD)',
        text: 'Before establishing any business relationship, the Firm shall: Identify and verify the customer\'s identity using reliable documents (National ID, Passport, Certificate of Incorporation, KRA Pin Certificate); Obtain information on the purpose and intended nature of the relationship; Identify and verify the beneficial owner; Assess the risk profile and/or credit risk of the customer.'
      },
      {
        heading: '4. Enhanced Due Diligence (EDD)',
        text: 'Enhanced due diligence shall be applied to: High-risk customers (e.g., politically exposed persons (PEPs), foreign clients, complex structures); High-value or unusual transactions; Transactions involving jurisdictions with inadequate AML/CFT controls. EDD measures may include obtaining senior management approval, verifying sources of funds, and closer ongoing monitoring.'
      },
      {
        heading: '5. Ongoing Monitoring',
        text: 'Monitor transactions to ensure consistency with the customer\'s profile and expected behaviour. Scrutinize complex, unusual, or large transactions with no apparent lawful purpose. Escalate any inconsistencies to the Chief Executive Officer for further investigation.'
      },
      {
        heading: '6. Record Keeping',
        text: 'In compliance with Regulation 25 of the POCAMLA Regulations of 2013, the Firm shall maintain: All CDD records and transaction documentation for at least seven (7) years after the end of the business relationship; STRs, CTRs, and internal reports securely for the same duration; Electronic or physical records that are easily retrievable and protected from unauthorized access.'
      },
      {
        heading: '7. Reporting Obligations',
        text: 'Suspicious Transaction Reports: Employees must promptly report any suspicion of money laundering or terrorism financing to the Chief Executive Officer, who will file an STR with the FRC within prescribed timelines. It is a criminal offence under POCAMLA to fail to report suspicious activity. Cash Transaction Reports: The Firm shall submit CTRs to the FRC for all cash transactions exceeding KES 1,000,000 or its foreign currency equivalent. Prohibition on Tipping-Off: No employee shall disclose that an STR has been made or may be made. Breach constitutes an offence under Section 48 of POCAMLA.'
      },
      {
        heading: '8. Risk Assessment',
        text: 'The Firm shall conduct an AML/CFT risk assessment annually considering: Customer risk (nature of customer, occupation, beneficial ownership); Product/service risk (ease of misuse for laundering); Geographic risk (jurisdictions with weak AML/CFT frameworks); Delivery channel risk (e.g., mobile or digital payments). Greater resources and controls will be allocated to higher-risk areas.'
      },
      {
        heading: '9. Training and Awareness',
        text: 'The Firm shall provide mandatory AML/CFT training for all employees upon joining and annually thereafter. Specialized training shall be provided to management, compliance teams, and front-line staff. Training topics include red-flag indicators, customer due diligence, recordkeeping, and reporting procedures.'
      },
      {
        heading: '10. Penalties',
        text: 'Violations of POCAMLA or this Policy may result in: Disciplinary action (including termination); Personal criminal liability (fines up to KES 5 million and/or imprisonment for up to 14 years); Corporate fines or sanctions; Reporting to regulatory or law enforcement agencies.'
      },
      {
        heading: '11. Contact',
        text: 'For inquiries: info@eaziwage.com or +254 72 315 4900.'
      }
    ]
  },
  'whistleblowing-policy': {
    title: 'Whistleblowing Policy',
    icon: Bell,
    lastUpdated: 'October 2025',
    content: [
      {
        heading: '1. Policy Statement',
        text: 'EaziWage Holdings Limited ("the Firm") and its associated entities (the "Group") is committed to the highest standards of ethics, integrity, and lawful conduct. We encourage employees and all other "associated persons" (directors, officers, contractors, consultants, suppliers, agents, and interns) to speak up about suspected wrongdoing without fear of retaliation. This Policy aligns with applicable Kenyan laws, including the Bribery Act, No. 47 of 2016, Anti-Corruption and Economic Crimes Act of 2003 (ACECA), Proceeds of Crime and Anti-Money Laundering Act of 2009 (POCAMLA), the Employment Act of 2007, and the Data Protection Act, 2019.'
      },
      {
        heading: '2. Purpose & Scope',
        text: 'Purpose: Provide safe, confidential channels to raise concerns about suspected misconduct and ensure timely, fair, and compliant handling of reports. Concerns may relate to: Bribery, corruption, fraud, theft, embezzlement or facilitation payments; AML/CFT violations, sanctions breaches, suspicious transactions; Breaches of law/regulation, serious policy breaches; Data protection/privacy violations, cyber incidents; Health & safety risks, environmental harm; Gross negligence or concealment of wrongdoing.'
      },
      {
        heading: '3. Legal Framework',
        text: 'Bribery Act of 2016 – duty on private entities to have prevention procedures. ACECA of 2003 – establishes and empowers EACC to receive/investigate corruption complaints. POCAMLA of 2009 – criminalises money laundering; prohibits "tipping-off". Employment Act of 2007 – protects employees from unfair dismissal/discrimination for good-faith reports. Data Protection Act of 2019 – requires lawful, secure handling of personal data in whistleblowing processes. Pending: Whistleblower Protection Bill, 2023/2024.'
      },
      {
        heading: '4. Reporting Channels',
        text: 'Whistleblowers may choose any channel (including anonymous where feasible): Internal Line Manager (unless implicated); Chief Executive Officer (primary intake for financial crime/bribery/data issues); Dedicated reporting mailbox: whistleblow@eaziwage.com (Mr. Jason Crawford, CEO). External (Public-Interest/Corruption): EACC official reporting channels (web, hotline, walk-in). Whistleblowers may also report to FRC for AML matters or law enforcement as permitted by law.'
      },
      {
        heading: '5. Confidentiality & Data Protection',
        text: 'The Firm will protect the identity of whistleblowers and persons named in reports to the fullest extent allowed by law. Disclosures are shared strictly on a need-to-know basis. Anonymous reports will be assessed and investigated to the extent practicable. All records (intake forms, evidence, investigation notes, outcomes) are classified confidential, stored securely with access logs, and handled in compliance with the Data Protection Act of 2019.'
      },
      {
        heading: '6. Non-Retaliation & Good-Faith Protection',
        text: 'Zero tolerance for retaliation against any person who raises a concern in good faith or participates in an investigation — even if the concern is not substantiated. Allegations made maliciously or with knowing falsity may result in disciplinary action. Managers must proactively prevent detrimental treatment (workplace reprisal, blacklisting, contract penalties) and must escalate suspected retaliation immediately to Compliance/HR.'
      },
      {
        heading: '7. Investigation Process',
        text: 'Acknowledge receipt (within 5 business days where contact details available). Triage (within 10 business days): assess scope, risks, urgency, and potential conflicts; ring-fence evidence. Assign investigator or team; if senior leadership is implicated, appoint an independent investigator. Investigate: gather facts, interview relevant parties, review records/systems; maintain chain of custody. Conclude with written report (facts, analysis, findings, remediation, disciplinary/contractual action). Feedback to whistleblower (where contactable). Escalate/Report to authorities where required (e.g., EACC for corruption; FRC for STR/CTR).'
      },
      {
        heading: '8. Roles & Responsibilities',
        text: 'Board/Senior Management: Set the tone; approve policy; ensure resources; receive periodic whistleblowing metrics. CEO: Overall accountability; ensures impartial investigations; authorises external reporting. Managers: Encourage speaking up; maintain confidentiality; prevent retaliation; escalate promptly. All Employees/Associated Persons: Read, understand, and comply with this Policy; report concerns promptly; cooperate with investigations.'
      },
      {
        heading: '9. Record-Keeping & Retention',
        text: 'Maintain whistleblowing registers, case files, evidence logs, decisions, and remediation records securely. Retention: five (5) years from case closure (or longer if required by law, litigation hold, or related AML retention rules). Access limited to designated Compliance/Legal/HR personnel.'
      },
      {
        heading: '10. Contact',
        text: 'Whistleblowing Channel: whistleblow@eaziwage.com. General inquiries: info@eaziwage.com or +254 72 315 4900.'
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
