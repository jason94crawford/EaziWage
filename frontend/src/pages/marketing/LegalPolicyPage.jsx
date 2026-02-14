import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Shield, Scale, Gift, AlertTriangle, Bell, FileText, Gavel } from 'lucide-react';
import { MarketingNav } from '../../components/layout/MarketingNav';
import { Footer } from '../../components/layout/Footer';

// Policy data organized by policy type
const policiesData = {
  'abc-policy': {
    title: 'Anti-Bribery & Corruption Policy',
    icon: Scale,
    lastUpdated: 'October 2025',
    sections: [
      {
        id: 'policy-statement',
        title: 'Policy Statement',
        content: `EaziWage Holdings Limited (the "Firm") and its associated companies (the "Group") conduct business in an honest, ethical, and transparent manner. We adopt a zero-tolerance approach toward bribery, corruption, and facilitation payments, and we are committed to acting professionally, fairly, and with integrity in all business dealings.

We shall comply with all applicable Kenyan laws regarding bribery, corruption, and related misconduct, especially the Bribery Act, No. 47 of 2016 and the Anti-Corruption and Economic Crimes Act of 2003 (ACECA).

Any breach of this Policy will be regarded as serious misconduct and may lead to disciplinary action or referral to law enforcement.`
      },
      {
        id: 'legal-framework',
        title: 'Legal Framework in Kenya',
        content: `Under the Bribery Act, No. 47 of 2016, a "bribe" means giving or receiving an offer, promise or advantage (financial or non-financial) where one knows or believes that acceptance would constitute improper performance.

**Key offences include:**
- Offering, promising or giving a bribe (Section 5)
- Requesting, agreeing to receive, or accepting a bribe (Section 6)
- Bribing a foreign public official (Section 8)
- Failure of a private entity to prevent bribery (Sections 9 & 10)

The Act has extra-territorial reach and entities found liable may be subject to civil or criminal sanctions.`
      },
      {
        id: 'principles',
        title: 'Principles & Approach',
        content: `We adopt a risk-based approach to preventing bribery:

- **Proportionate procedures** commensurate with risk exposure
- **Top-level commitment** with visible support from senior management
- **Regular risk assessment** of bribery corruption risks
- **Due diligence** before engaging agents, contractors, third parties
- **Communication & training** provided to all personnel
- **Monitoring, review & continuous improvement** of controls

All records must be retained for at least five (5) years.`
      },
      {
        id: 'prohibited-conduct',
        title: 'Prohibited Conduct',
        content: `No employee, officer or associated person shall offer, promise, give, or authorize the giving of any financial or other advantage to any person to induce or reward improper performance.

**Facilitation payments are prohibited.**

Gifts may only be given or accepted in line with the Group's Gifts & Hospitality Policy, provided they are:
- Moderate
- Transparent
- Documented
- Not given with any expectation of undue influence

**Cash gifts are strictly prohibited.**`
      },
      {
        id: 'risk-assessment',
        title: 'Risk Assessment & Due Diligence',
        content: `The Firm will conduct a bribery risk assessment at least annually covering:

- Country risk
- Sector/industry risk
- Transaction risk
- Business partner/third-party risk
- Internal process risk

**Due diligence on third parties includes:**
- Sanctions checks
- Background and reputation checks
- Review of anti-bribery policies
- Reference checks
- Clarification of ownership and beneficial owners`
      },
      {
        id: 'reporting',
        title: 'Reporting',
        content: `Any employee or associated person who is offered a bribe or becomes aware of suspicious conduct must refuse and immediately report the matter to the Chief Executive Officer.

The Firm will not allow retaliation against any person who refuses to participate in bribery or who reports a concern in good faith.

Anonymous or confidential reporting is permitted in line with the Whistleblowing Policy.`
      },
      {
        id: 'roles',
        title: 'Roles & Responsibilities',
        content: `**Board/Senior Management:**
Approve and oversee this Policy, demonstrate visible support and leadership.

**Chief Executive Officer:**
Oversee day-to-day implementation, management, escalation decisions, and reporting.

**Employees & Associated Persons:**
Understand and comply with this Policy, participate in training, promptly report any actual or suspected bribery.`
      },
      {
        id: 'enforcement',
        title: 'Enforcement',
        content: `Violations of this policy may result in:

- Disciplinary action (including termination)
- Personal criminal liability
- Corporate fines or sanctions
- Reporting to regulatory or law enforcement agencies

Where a possible breach is detected, the Firm may self-report to relevant Kenyan authorities (e.g., EACC or DPP).`
      },
      {
        id: 'contact',
        title: 'Contact',
        content: `For inquiries regarding this policy, contact:

**Email:** info@eaziwage.com
**Phone:** +254 72 315 4900`
      }
    ]
  },
  'code-of-ethics': {
    title: 'Code of Ethics',
    icon: Gavel,
    lastUpdated: 'October 2025',
    sections: [
      {
        id: 'introduction',
        title: 'Introduction',
        content: `EaziWage Holdings Limited is committed to conducting business with the highest standards of ethics and integrity. This Code of Ethics establishes the principles and standards of conduct that all employees, officers, directors, and associated persons must follow.

Our reputation depends on the ethical behavior of every individual who represents our company.`
      },
      {
        id: 'core-values',
        title: 'Core Values',
        content: `**Integrity:**
We act honestly and ethically in all our dealings, maintaining the trust of our stakeholders.

**Transparency:**
We communicate openly and honestly with employees, employers, regulators, and partners.

**Respect:**
We treat all individuals with dignity and respect, fostering an inclusive environment.

**Accountability:**
We take responsibility for our actions and their consequences.

**Excellence:**
We strive for excellence in everything we do, continuously improving our services.`
      },
      {
        id: 'professional-conduct',
        title: 'Professional Conduct',
        content: `All employees and associates shall:

- Perform duties with competence, diligence, and professionalism
- Avoid conflicts of interest or disclose them promptly
- Protect confidential information and use it only for legitimate purposes
- Not engage in activities that could harm the company's reputation
- Comply with all applicable laws, regulations, and company policies
- Treat colleagues, clients, and partners with courtesy and respect`
      },
      {
        id: 'financial-integrity',
        title: 'Financial Integrity',
        content: `We maintain accurate and complete financial records. All employees must:

- Record transactions accurately and completely
- Never falsify any documents or records
- Report any suspected financial irregularities immediately
- Protect company assets from theft, fraud, or misuse
- Follow proper authorization procedures for all expenditures`
      },
      {
        id: 'compliance',
        title: 'Compliance with Laws',
        content: `EaziWage is committed to complying with all applicable laws and regulations, including:

- Anti-money laundering and counter-terrorism financing laws
- Data protection and privacy regulations
- Employment and labor laws
- Anti-bribery and corruption laws
- Financial services regulations

Employees must never take actions that violate any applicable law, even if instructed to do so.`
      },
      {
        id: 'reporting-violations',
        title: 'Reporting Violations',
        content: `If you become aware of any violation or potential violation of this Code, you must report it immediately to:

- Your direct supervisor (if not implicated)
- The Chief Executive Officer
- Via our confidential whistleblowing channel: whistleblow@eaziwage.com

We prohibit retaliation against anyone who reports a concern in good faith.`
      },
      {
        id: 'consequences',
        title: 'Consequences of Violations',
        content: `Violations of this Code may result in:

- Verbal or written warnings
- Suspension
- Termination of employment
- Civil or criminal prosecution where applicable

The severity of consequences will depend on the nature and extent of the violation.`
      }
    ]
  },
  'gifts-policy': {
    title: 'Gifts, Hospitality & Entertainment Policy',
    icon: Gift,
    lastUpdated: 'October 2025',
    sections: [
      {
        id: 'policy-statement',
        title: 'Policy Statement',
        content: `EaziWage Holdings Limited ("the Firm") and its associated entities (the "Group") is committed to conducting business in an honest, ethical, and transparent manner.

Offering or accepting inappropriate gifts, hospitality, or entertainment can create actual or perceived conflicts of interest and may constitute bribery or corrupt conduct under Kenyan law.

This Policy supports compliance with:
- Bribery Act of 2016
- Anti-Corruption and Economic Crimes Act of 2003 (ACECA)
- EACC Guidelines on Gifts and Conflict of Interest

The Group maintains zero tolerance for bribery, inducement, or any practice that compromises objectivity.`
      },
      {
        id: 'purpose-scope',
        title: 'Purpose & Scope',
        content: `This Policy provides clear guidance on:
- The giving, receiving, and recording of gifts and hospitality
- Preventing bribery, conflicts of interest, and reputational risk
- Supporting compliance with Kenyan law
- Promoting transparency

**Applies to:**
All employees, directors, officers, contractors, consultants, agents, suppliers, and other third parties acting on behalf of the Group.`
      },
      {
        id: 'legal-framework',
        title: 'Legal Framework',
        content: `Under the **Bribery Act of 2016** and **ACECA of 2003**, it is an offence to:

- Offer, give, solicit, or accept any advantage to induce or reward improper performance
- Provide or receive gifts with intent to influence a business decision
- Fail to prevent bribery by associated persons
- Fail to declare or record benefits received

**Breaches can result in severe criminal penalties including fines, imprisonment (up to 10 years), or both.**`
      },
      {
        id: 'principles',
        title: 'Principles of Conduct',
        content: `**Legitimacy:** Gifts must serve a genuine business purpose.

**Transparency:** Must be declared and recorded in the Gifts & Hospitality Register.

**Proportionality:** Must be modest and appropriate to the occasion.

**No Cash or Equivalents:** Cash, vouchers, or other easily transferable benefits are prohibited.

**No Reciprocation Expectation:** There must be no intention to induce favorable treatment.

**Public Official Caution:** Extra care with government officials—even small gifts can be perceived as bribery.`
      },
      {
        id: 'giving-gifts',
        title: 'Giving Gifts or Hospitality',
        content: `Employees may offer modest gifts if:
- They are made transparently, in good faith, and for legitimate business purposes
- They comply with this Policy and applicable laws
- They are not frequent or extravagant
- They are not made during active tenders, contract negotiations, or regulatory reviews

**Acceptable:**
- Token branded items of nominal value (<KES 10,000)
- Working lunches
- Public/industry events

**Prohibited:**
- Cash, vouchers
- Lavish entertainment
- Anything to influence a tender/license/regulatory outcome`
      },
      {
        id: 'receiving-gifts',
        title: 'Receiving Gifts or Hospitality',
        content: `Employees must not solicit gifts. They may accept modest gestures only if:
- The value is below KES 10,000 per instance
- It does not create obligation or conflict of interest
- It is declared within five (5) working days
- It is recorded in the Gifts & Hospitality Register

**If a gift exceeds KES 10,000 or appears inappropriate:**
- It must be politely declined or returned
- If refusal may cause offence, the gift must be surrendered to the Compliance Department for appropriate disposition`
      },
      {
        id: 'register',
        title: 'Gifts & Hospitality Register',
        content: `The Register is:
- Maintained by the Chief Executive Officer
- Must record: date, giver/recipient, description, value, purpose, and decision
- Reviewed quarterly by Senior Management and annually by Internal Audit
- Retained for five (5) years for transparency and auditability`
      },
      {
        id: 'public-officials',
        title: 'Public Officials and Government Bodies',
        content: `Gifts or hospitality to public officials are discouraged and permitted only in exceptional, pre-approved cases.

All such offers must be:
- Pre-cleared by the Chief Executive Officer
- Recorded in the Register

**Even minor benefits may be construed as attempts to improperly influence under the Bribery Act of 2016.**`
      },
      {
        id: 'violations',
        title: 'Violations',
        content: `Failure to comply may result in:
- Internal disciplinary action (up to termination)
- Reporting to authorities (EACC, DPP)
- Criminal penalties under Kenyan law
- Civil recovery or reputational sanctions`
      },
      {
        id: 'contact',
        title: 'Contact',
        content: `For inquiries:

**Email:** info@eaziwage.com
**Phone:** +254 72 315 4900`
      }
    ]
  },
  'aml-cft-policy': {
    title: 'AML & CFT Policy',
    icon: AlertTriangle,
    lastUpdated: 'October 2025',
    sections: [
      {
        id: 'policy-statement',
        title: 'Policy Statement',
        content: `EaziWage Holdings Limited ("the Firm") and its associated companies (the "Group") are fully committed to preventing the misuse of its operations, products, and services for money laundering, terrorist financing, or other financial crimes.

The Firm maintains a zero-tolerance stance against financial crime and shall comply with:
- Proceeds of Crime and Anti-Money Laundering Act (POCAMLA), No. 9 of 2009
- Proceeds of Crime and Anti-Money Laundering Regulations of 2013
- Prevention of Terrorism Act of 2012
- Guidelines issued by the Financial Reporting Centre (FRC)
- CBK Prudential Guidelines on Anti-Money Laundering (CBK/PG/08)`
      },
      {
        id: 'definitions',
        title: 'Definition of Money Laundering and Terrorism Financing',
        content: `**Money Laundering (Section 3, POCAMLA):**
The process of concealing, disguising, converting, transferring, or dealing with the proceeds of crime to make them appear legitimate.

**Terrorism Financing:**
Providing or collecting funds with the intention that they be used for terrorist acts.

**Money laundering typically involves three stages:**
1. **Placement** - introducing illicit funds
2. **Layering** - concealing origin through complex transactions
3. **Integration** - reintroducing laundered funds into the economy`
      },
      {
        id: 'cdd',
        title: 'Customer Due Diligence (CDD)',
        content: `Before establishing any business relationship, the Firm shall:

- **Identify and verify** the customer's identity using reliable documents (National ID, Passport, Certificate of Incorporation, KRA Pin Certificate)
- **Obtain information** on the purpose and intended nature of the relationship
- **Identify and verify** the beneficial owner
- **Assess** the risk profile and/or credit risk of the customer`
      },
      {
        id: 'edd',
        title: 'Enhanced Due Diligence (EDD)',
        content: `Enhanced due diligence shall be applied to:
- High-risk customers (e.g., politically exposed persons (PEPs), foreign clients, complex structures)
- High-value or unusual transactions
- Transactions involving jurisdictions with inadequate AML/CFT controls

**EDD measures may include:**
- Obtaining senior management approval
- Verifying sources of funds
- Closer ongoing monitoring`
      },
      {
        id: 'monitoring',
        title: 'Ongoing Monitoring',
        content: `- Monitor transactions to ensure consistency with the customer's profile and expected behaviour
- Scrutinize complex, unusual, or large transactions with no apparent lawful purpose
- Escalate any inconsistencies to the Chief Executive Officer for further investigation`
      },
      {
        id: 'record-keeping',
        title: 'Record Keeping',
        content: `In compliance with Regulation 25 of the POCAMLA Regulations of 2013, the Firm shall maintain:

- All CDD records and transaction documentation for at least **seven (7) years** after the end of the business relationship
- STRs, CTRs, and internal reports securely for the same duration
- Electronic or physical records that are easily retrievable and protected from unauthorized access`
      },
      {
        id: 'reporting',
        title: 'Reporting Obligations',
        content: `**Suspicious Transaction Reports:**
Employees must promptly report any suspicion of money laundering or terrorism financing to the Chief Executive Officer, who will file an STR with the FRC within prescribed timelines.

It is a criminal offence under POCAMLA to fail to report suspicious activity.

**Cash Transaction Reports:**
The Firm shall submit CTRs to the FRC for all cash transactions exceeding KES 1,000,000 or its foreign currency equivalent.

**Prohibition on Tipping-Off:**
No employee shall disclose that an STR has been made or may be made. Breach constitutes an offence under Section 48 of POCAMLA.`
      },
      {
        id: 'risk-assessment',
        title: 'Risk Assessment',
        content: `The Firm shall conduct an AML/CFT risk assessment annually considering:

- **Customer risk** - nature of customer, occupation, beneficial ownership
- **Product/service risk** - ease of misuse for laundering
- **Geographic risk** - jurisdictions with weak AML/CFT frameworks
- **Delivery channel risk** - e.g., mobile or digital payments

Greater resources and controls will be allocated to higher-risk areas.`
      },
      {
        id: 'training',
        title: 'Training and Awareness',
        content: `The Firm shall provide mandatory AML/CFT training for all employees upon joining and annually thereafter.

Specialized training shall be provided to management, compliance teams, and front-line staff.

**Training topics include:**
- Red-flag indicators
- Customer due diligence
- Recordkeeping
- Reporting procedures`
      },
      {
        id: 'penalties',
        title: 'Penalties',
        content: `Violations of POCAMLA or this Policy may result in:

- Disciplinary action (including termination)
- Personal criminal liability (fines up to KES 5 million and/or imprisonment for up to 14 years)
- Corporate fines or sanctions
- Reporting to regulatory or law enforcement agencies`
      },
      {
        id: 'contact',
        title: 'Contact',
        content: `For inquiries:

**Email:** info@eaziwage.com
**Phone:** +254 72 315 4900`
      }
    ]
  },
  'whistleblowing-policy': {
    title: 'Whistleblowing Policy',
    icon: Bell,
    lastUpdated: 'October 2025',
    sections: [
      {
        id: 'policy-statement',
        title: 'Policy Statement',
        content: `EaziWage Holdings Limited ("the Firm") and its associated entities (the "Group") is committed to the highest standards of ethics, integrity, and lawful conduct.

We encourage employees and all other "associated persons" (directors, officers, contractors, consultants, suppliers, agents, and interns) to speak up about suspected wrongdoing without fear of retaliation.

This Policy aligns with applicable Kenyan laws, including:
- Bribery Act, No. 47 of 2016
- Anti-Corruption and Economic Crimes Act of 2003 (ACECA)
- Proceeds of Crime and Anti-Money Laundering Act of 2009 (POCAMLA)
- Employment Act of 2007
- Data Protection Act, 2019`
      },
      {
        id: 'purpose-scope',
        title: 'Purpose & Scope',
        content: `**Purpose:**
Provide safe, confidential channels to raise concerns about suspected misconduct and ensure timely, fair, and compliant handling of reports.

**Concerns may relate to:**
- Bribery, corruption, fraud, theft, embezzlement or facilitation payments
- AML/CFT violations, sanctions breaches, suspicious transactions
- Breaches of law/regulation, serious policy breaches
- Data protection/privacy violations, cyber incidents
- Health & safety risks, environmental harm
- Gross negligence or concealment of wrongdoing`
      },
      {
        id: 'legal-framework',
        title: 'Legal Framework',
        content: `- **Bribery Act of 2016** – duty on private entities to have prevention procedures
- **ACECA of 2003** – establishes and empowers EACC to receive/investigate corruption complaints
- **POCAMLA of 2009** – criminalises money laundering; prohibits "tipping-off"
- **Employment Act of 2007** – protects employees from unfair dismissal/discrimination for good-faith reports
- **Data Protection Act of 2019** – requires lawful, secure handling of personal data in whistleblowing processes

*Pending: Whistleblower Protection Bill, 2023/2024*`
      },
      {
        id: 'reporting-channels',
        title: 'Reporting Channels',
        content: `Whistleblowers may choose any channel (including anonymous where feasible):

- **Internal Line Manager** (unless implicated)
- **Chief Executive Officer** (primary intake for financial crime/bribery/data issues)
- **Dedicated reporting mailbox:** whistleblow@eaziwage.com (Mr. Jason Crawford, CEO)

**External (Public-Interest/Corruption):**
- EACC official reporting channels (web, hotline, walk-in)

Whistleblowers may also report to FRC for AML matters or law enforcement as permitted by law.`
      },
      {
        id: 'confidentiality',
        title: 'Confidentiality & Data Protection',
        content: `- The Firm will protect the identity of whistleblowers and persons named in reports to the fullest extent allowed by law
- Disclosures are shared strictly on a need-to-know basis
- Anonymous reports will be assessed and investigated to the extent practicable
- All records (intake forms, evidence, investigation notes, outcomes) are classified confidential, stored securely with access logs, and handled in compliance with the Data Protection Act of 2019`
      },
      {
        id: 'non-retaliation',
        title: 'Non-Retaliation & Good-Faith Protection',
        content: `**Zero tolerance** for retaliation against any person who raises a concern in good faith or participates in an investigation — even if the concern is not substantiated.

Allegations made maliciously or with knowing falsity may result in disciplinary action.

Managers must proactively prevent detrimental treatment (workplace reprisal, blacklisting, contract penalties) and must escalate suspected retaliation immediately to Compliance/HR.`
      },
      {
        id: 'investigation',
        title: 'Investigation Process',
        content: `1. **Acknowledge receipt** (within 5 business days where contact details available)
2. **Triage** (within 10 business days): assess scope, risks, urgency, and potential conflicts; ring-fence evidence
3. **Assign investigator** or team; if senior leadership is implicated, appoint an independent investigator
4. **Investigate:** gather facts, interview relevant parties, review records/systems; maintain chain of custody
5. **Conclude** with written report (facts, analysis, findings, remediation, disciplinary/contractual action)
6. **Feedback** to whistleblower (where contactable)
7. **Escalate/Report** to authorities where required (e.g., EACC for corruption; FRC for STR/CTR)`
      },
      {
        id: 'roles',
        title: 'Roles & Responsibilities',
        content: `**Board/Senior Management:**
Set the tone; approve policy; ensure resources; receive periodic whistleblowing metrics.

**CEO:**
Overall accountability; ensures impartial investigations; authorises external reporting.

**Managers:**
Encourage speaking up; maintain confidentiality; prevent retaliation; escalate promptly.

**All Employees/Associated Persons:**
Read, understand, and comply with this Policy; report concerns promptly; cooperate with investigations.`
      },
      {
        id: 'record-keeping',
        title: 'Record-Keeping & Retention',
        content: `- Maintain whistleblowing registers, case files, evidence logs, decisions, and remediation records securely
- **Retention:** five (5) years from case closure (or longer if required by law, litigation hold, or related AML retention rules)
- Access limited to designated Compliance/Legal/HR personnel`
      },
      {
        id: 'contact',
        title: 'Contact',
        content: `**Whistleblowing Channel:** whistleblow@eaziwage.com

**General inquiries:** info@eaziwage.com or +254 72 315 4900`
      }
    ]
  }
};

export default function LegalPolicyPage() {
  const location = useLocation();
  const path = location.pathname.replace('/', '');
  const policy = policiesData[path];
  const [activeSection, setActiveSection] = React.useState(policy?.sections[0]?.id || '');

  React.useEffect(() => {
    if (policy?.sections[0]?.id) {
      setActiveSection(policy.sections[0].id);
    }
  }, [path, policy]);

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!policy) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <MarketingNav />
        <div className="pt-32 pb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Policy Not Found</h1>
          <p className="mt-4 text-slate-600 dark:text-slate-400">The requested policy page does not exist.</p>
          <Link to="/" className="mt-8 inline-block text-primary hover:underline">Return Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const IconComponent = policy.icon;

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
              <IconComponent className="w-4 h-4" />
              Legal
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              {policy.title}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">
              EaziWage's commitment to ethical business practices and regulatory compliance.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Last updated: {policy.lastUpdated}
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
                  {policy.sections.map((section) => (
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
                {policy.sections.map((section, index) => (
                  <div 
                    key={section.id} 
                    id={section.id}
                    className="mb-12 last:mb-0 scroll-mt-32"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center">
                        <span className="text-primary font-bold">{index + 1}</span>
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
                        if (/^\d+\./.test(paragraph)) {
                          const items = paragraph.split('\n').filter(line => /^\d+\./.test(line));
                          return (
                            <ol key={i} className="list-decimal pl-6 mb-4 space-y-2">
                              {items.map((item, j) => (
                                <li key={j} className="text-slate-600 dark:text-slate-400">
                                  {item.replace(/^\d+\.\s*/, '')}
                                </li>
                              ))}
                            </ol>
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
