import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Check, X, HelpCircle, Calculator, Shield, 
  Zap, Clock, CreditCard, Banknote, Users, Building2
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { MarketingNav } from '../../components/layout/MarketingNav';
import { Footer } from '../../components/layout/Footer';

const feeStructure = [
  {
    title: '0% Interest Charges',
    description: 'Enjoy the freedom of accessing your wages without any interest. This is your money, not a loan.',
    icon: Banknote,
    highlight: true
  },
  {
    title: 'No Subscription Fees',
    description: 'Access our services without any recurring subscription or monthly fees. Pay only when you use it.',
    icon: CreditCard,
    highlight: false
  },
  {
    title: '$0.80 Processing Fee',
    description: 'A fixed processing fee per transaction covers mobile money and bank transfer costs.',
    icon: Zap,
    highlight: false
  },
  {
    title: 'No Hidden Fees',
    description: 'Complete transparency with no hidden charges. What you see is exactly what you pay.',
    icon: Shield,
    highlight: false
  },
  {
    title: '3.5% - 6% Application Fee',
    description: 'A transparent application fee based on your eligibility and the amount you access.',
    icon: Calculator,
    highlight: true
  },
  {
    title: 'No Data Fees',
    description: 'No charges for accessing your data, viewing history, or retrieving your information.',
    icon: Users,
    highlight: false
  },
];

const comparisons = [
  { feature: 'Interest Rate', eaziwage: '0%', payday: '30-120% APR', bank: '20-50% APR' },
  { feature: 'Application Fee', eaziwage: '3.5% - 6%', payday: 'Up to 15%', bank: 'Varies' },
  { feature: 'Processing Fee', eaziwage: '$0.80 fixed', payday: 'Variable', bank: '$5-25' },
  { feature: 'Hidden Fees', eaziwage: 'None', payday: 'Many', bank: 'Some' },
  { feature: 'Approval Time', eaziwage: 'Instant', payday: '1-3 days', bank: '1-2 weeks' },
  { feature: 'Credit Check', eaziwage: 'Not Required', payday: 'Required', bank: 'Required' },
  { feature: 'Creates Debt', eaziwage: 'No', payday: 'Yes', bank: 'Yes' },
  { feature: 'Available 24/7', eaziwage: 'Yes', payday: 'No', bank: 'No' },
];

const faqs = [
  {
    q: 'What fees will I pay when using EaziWage?',
    a: 'You pay a small application fee (3.5% - 6%) plus a fixed processing fee of $0.80 per transaction. That\'s it — no interest, no hidden charges, no subscription fees.'
  },
  {
    q: 'Why is there a fee range (3.5% - 6%)?',
    a: 'The exact fee depends on factors like your employment tenure, advance history, and employer plan. Longer tenure and good history typically result in lower fees.'
  },
  {
    q: 'Is the processing fee the same for all countries?',
    a: 'Yes, the processing fee is a fixed $0.80 (converted to local currency) regardless of whether you\'re in Kenya, Uganda, Tanzania, or Rwanda.'
  },
  {
    q: 'Are there any fees for employers?',
    a: 'No! EaziWage is completely free for employers. There are no setup fees, monthly charges, or per-employee costs. Employers can offer EaziWage as a benefit at zero cost.'
  },
  {
    q: 'How does this compare to a payday loan?',
    a: 'Payday loans typically charge 30-120% APR interest plus various fees. EaziWage has zero interest and much lower total costs. Plus, you\'re accessing your own earned money, not borrowing.'
  },
];

const employers = [
  { title: 'Zero Setup Cost', description: 'No implementation fees whatsoever' },
  { title: 'No Monthly Fees', description: 'Free to offer as an employee benefit' },
  { title: 'No Per-Employee Cost', description: 'Unlimited employees at no cost' },
  { title: 'Free Support', description: 'Dedicated account manager included' },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <MarketingNav />
      
      {/* Hero */}
      <section className="pt-24 sm:pt-32 pb-16 sm:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-20 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary/10 rounded-full blur-[150px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full text-xs sm:text-sm font-semibold text-primary mb-6 sm:mb-8">
              <Calculator className="w-4 h-4" />
              Transparent Pricing
            </div>
            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
              Fast. Fair. <span className="text-gradient">Fully Transparent.</span>
            </h1>
            <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
              It's not a loan, it's freedom — the freedom to live, plan, and dream without waiting for payday. 
              Simple, honest pricing with no hidden surprises.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 text-sm">
              <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                Zero interest, always
              </div>
              <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                No hidden fees
              </div>
              <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                Free for employers
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Pricing Card */}
      <section className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="bg-gradient-to-r from-primary via-emerald-600 to-teal-600 p-5 sm:p-8 text-white text-center">
              <h2 className="font-heading text-xl sm:text-3xl font-bold mb-1 sm:mb-2">Employee Fee Structure</h2>
              <p className="opacity-80 text-sm sm:text-base">Transparent pricing for wage access</p>
            </div>
            <div className="p-5 sm:p-8 lg:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
                <div className="bg-slate-50 dark:bg-slate-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-1 sm:mb-2">Application Fee</p>
                  <p className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-1 sm:mb-2">3.5% - 6%</p>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">per advance amount</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-1 sm:mb-2">Processing Fee</p>
                  <p className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-1 sm:mb-2">$0.80</p>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">fixed per transaction</p>
                </div>
              </div>
              
              <div className="bg-primary/5 dark:bg-primary/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="w-8 sm:w-10 h-8 sm:h-10 bg-primary rounded-lg sm:rounded-xl flex items-center justify-center">
                    <Calculator className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                  </div>
                  <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900 dark:text-white">Example Calculation</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-sm">
                  <div className="flex sm:block justify-between items-center sm:text-left">
                    <p className="text-slate-500 dark:text-slate-400">Advance Amount</p>
                    <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">$100.00</p>
                  </div>
                  <div className="flex sm:block justify-between items-center sm:text-left">
                    <div>
                      <p className="text-slate-500 dark:text-slate-400">Total Fee (at 4.5%)</p>
                      <p className="text-xs text-slate-400 sm:hidden">($4.50 + $0.80)</p>
                    </div>
                    <div className="text-right sm:text-left">
                      <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">$5.30</p>
                      <p className="text-xs text-slate-400 hidden sm:block">($4.50 + $0.80)</p>
                    </div>
                  </div>
                  <div className="flex sm:block justify-between items-center sm:text-left">
                    <div>
                      <p className="text-slate-500 dark:text-slate-400">You Receive</p>
                      <p className="text-xs text-slate-400 sm:hidden">(fee from payroll)</p>
                    </div>
                    <div className="text-right sm:text-left">
                      <p className="text-lg sm:text-xl font-bold text-primary">$100.00</p>
                      <p className="text-xs text-slate-400 hidden sm:block">(fee deducted from payroll)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Link to="/calculator">
                  <Button size="lg" className="h-12 sm:h-14 px-5 sm:px-8 rounded-xl sm:rounded-2xl bg-gradient-to-r from-primary to-emerald-600 text-white text-sm sm:text-base">
                    <Calculator className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                    Calculate Your Access
                    <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fee Breakdown */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
              What's <span className="text-gradient">Included</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
              Complete transparency — know exactly what you're paying for
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {feeStructure.map((item, i) => (
              <div 
                key={i} 
                className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border transition-all duration-300 hover:shadow-lg ${
                  item.highlight 
                    ? 'bg-primary/5 dark:bg-primary/10 border-primary/30' 
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 ${
                  item.highlight ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'
                }`}>
                  <item.icon className={`w-5 sm:w-6 h-5 sm:h-6 ${item.highlight ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`} />
                </div>
                <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1 sm:mb-2">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Employer Section */}
      <section className="py-16 sm:py-24 bg-slate-900 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary/20 rounded-full text-xs sm:text-sm font-semibold text-primary mb-4 sm:mb-6">
                <Building2 className="w-4 h-4" />
                For Employers
              </div>
              <h2 className="font-heading text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
                100% Free for <span className="text-gradient">Employers</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-400 mb-6 sm:mb-8">
                Offer EaziWage as a workplace benefit at absolutely no cost. No setup fees, no monthly charges, 
                no per-employee costs. It's completely free for your organization.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {employers.map((item, i) => (
                  <div key={i} className="bg-slate-800 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-700">
                    <div className="w-7 sm:w-8 h-7 sm:h-8 bg-primary/20 rounded-lg flex items-center justify-center mb-2 sm:mb-3">
                      <Check className="w-3 sm:w-4 h-3 sm:h-4 text-primary" />
                    </div>
                    <h3 className="font-semibold text-white text-sm sm:text-base mb-1">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-400">{item.description}</p>
                  </div>
                ))}
              </div>
              <Link to="/employers">
                <Button size="lg" className="h-12 sm:h-14 px-6 sm:px-8 rounded-xl sm:rounded-2xl bg-white text-primary hover:bg-slate-100 text-sm sm:text-base w-full sm:w-auto">
                  Learn More for Employers
                  <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="bg-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-700 mt-4 lg:mt-0">
              <h3 className="font-heading text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Why It's Free</h3>
              <p className="text-slate-400 text-sm sm:text-base mb-4 sm:mb-6">
                Our business model charges a small fee to employees when they access their wages. 
                This means employers can offer EaziWage as a valuable benefit without any budget impact.
              </p>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 sm:w-6 h-5 sm:h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-primary" />
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm">Improve employee satisfaction at zero cost</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 sm:w-6 h-5 sm:h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-primary" />
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm">Reduce HR time on salary advance requests</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 sm:w-6 h-5 sm:h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-primary" />
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm">Attract and retain top talent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
              EaziWage vs <span className="text-gradient">Alternatives</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
              See how we compare to payday loans and bank overdrafts
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-700">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                    <th className="text-left p-3 sm:p-6 text-slate-600 dark:text-slate-400 font-medium text-xs sm:text-sm">Feature</th>
                    <th className="text-center p-3 sm:p-6">
                      <div className="flex flex-col items-center">
                        <div className="w-8 sm:w-12 h-8 sm:h-12 bg-gradient-to-br from-primary to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-1 sm:mb-2">
                          <span className="text-white font-bold text-xs sm:text-base">E</span>
                        </div>
                        <span className="text-slate-900 dark:text-white font-bold text-xs sm:text-sm">EaziWage</span>
                      </div>
                    </th>
                    <th className="text-center p-3 sm:p-6 text-slate-600 dark:text-slate-400 font-medium text-xs sm:text-sm">Payday Loans</th>
                    <th className="text-center p-3 sm:p-6 text-slate-600 dark:text-slate-400 font-medium text-xs sm:text-sm">Bank Overdraft</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((row, i) => (
                    <tr key={i} className="border-b border-slate-200 dark:border-slate-700 last:border-0">
                      <td className="p-3 sm:p-6 text-slate-700 dark:text-slate-300 font-medium text-xs sm:text-sm">{row.feature}</td>
                      <td className="p-3 sm:p-6 text-center">
                        <span className="px-2 sm:px-4 py-1 sm:py-2 bg-primary/10 dark:bg-primary/20 text-primary rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap">
                          {row.eaziwage}
                        </span>
                      </td>
                      <td className="p-3 sm:p-6 text-center text-slate-500 dark:text-slate-400 text-xs sm:text-sm">{row.payday}</td>
                      <td className="p-3 sm:p-6 text-center text-slate-500 dark:text-slate-400 text-xs sm:text-sm">{row.bank}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
              Pricing <span className="text-gradient">FAQs</span>
            </h2>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-sm sm:text-lg text-slate-900 dark:text-white mb-2 sm:mb-3 flex items-start gap-2 sm:gap-3">
                  <HelpCircle className="w-5 sm:w-6 h-5 sm:h-6 text-primary flex-shrink-0 mt-0.5" />
                  {faq.q}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed pl-7 sm:pl-9 text-xs sm:text-base">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-primary via-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-base sm:text-xl text-white/80 mb-8 sm:mb-10">
            Access your earned wages with transparent, fair pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="h-12 sm:h-14 px-8 sm:px-10 rounded-xl sm:rounded-2xl bg-white text-primary hover:bg-slate-100 w-full sm:w-auto">
                Start Free
                <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/calculator">
              <Button size="lg" variant="outline" className="h-12 sm:h-14 px-8 sm:px-10 rounded-xl sm:rounded-2xl border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
                <Calculator className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                Calculate Access
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
