import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Check, X, HelpCircle, Building2, Users, 
  Zap, Shield, Clock, Star, Calculator, ChevronDown
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { MarketingNav } from '../../components/layout/MarketingNav';
import { Footer } from '../../components/layout/Footer';

const plans = [
  {
    name: 'Starter',
    description: 'For small businesses getting started with EWA',
    priceRange: '5.5% - 6.5%',
    priceNote: 'per advance',
    highlight: false,
    features: [
      { text: 'Up to 50 employees', included: true },
      { text: 'Basic payroll integration', included: true },
      { text: 'M-PESA disbursement', included: true },
      { text: 'Standard support (9-5)', included: true },
      { text: 'Monthly reporting', included: true },
      { text: 'API access', included: false },
      { text: 'Custom branding', included: false },
      { text: 'Dedicated account manager', included: false },
    ],
    cta: 'Get Started',
    ctaLink: '/register?role=employer&plan=starter'
  },
  {
    name: 'Business',
    description: 'For growing companies with larger workforces',
    priceRange: '4.0% - 5.5%',
    priceNote: 'per advance',
    highlight: true,
    badge: 'Most Popular',
    features: [
      { text: 'Up to 500 employees', included: true },
      { text: 'Advanced payroll integration', included: true },
      { text: 'M-PESA + Bank transfers', included: true },
      { text: 'Priority support (24/7)', included: true },
      { text: 'Real-time reporting', included: true },
      { text: 'API access', included: true },
      { text: 'Custom branding', included: false },
      { text: 'Dedicated account manager', included: true },
    ],
    cta: 'Start Free Trial',
    ctaLink: '/register?role=employer&plan=business'
  },
  {
    name: 'Enterprise',
    description: 'For large organizations with custom needs',
    priceRange: '3.5% - 4.0%',
    priceNote: 'per advance',
    highlight: false,
    features: [
      { text: 'Unlimited employees', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'All payment methods', included: true },
      { text: 'Dedicated support team', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Full API access', included: true },
      { text: 'White-label solution', included: true },
      { text: 'Dedicated account manager', included: true },
    ],
    cta: 'Contact Sales',
    ctaLink: '/contact?subject=enterprise'
  }
];

const feeBreakdown = [
  { label: 'Base Platform Fee', value: '3.5%', description: 'Covers our operational costs and technology' },
  { label: 'Risk Assessment', value: '0% - 1.5%', description: 'Based on employee tenure and history' },
  { label: 'Processing Fee', value: '0% - 1.5%', description: 'Mobile money or bank transfer costs' },
];

const comparisons = [
  { feature: 'Interest Rate', eaziwage: '0%', loan: '30-120% APR', bank: '20-50% APR' },
  { feature: 'Approval Time', eaziwage: 'Instant', loan: '1-3 days', bank: '1-2 weeks' },
  { feature: 'Credit Check', eaziwage: 'None', loan: 'Required', bank: 'Required' },
  { feature: 'Hidden Fees', eaziwage: 'None', loan: 'Many', bank: 'Some' },
  { feature: 'Debt Created', eaziwage: 'No', loan: 'Yes', bank: 'Yes' },
  { feature: 'Impact on Credit', eaziwage: 'None', loan: 'Negative', bank: 'Negative' },
];

const faqs = [
  {
    q: 'Who pays the fees — employer or employee?',
    a: 'The employee pays a small fee on each advance. Employers pay nothing to offer EaziWage as a benefit. This keeps the service sustainable while ensuring workers always have access when they need it.'
  },
  {
    q: 'How is my fee rate determined?',
    a: 'Fee rates depend on your employer\'s plan tier and your personal risk score (based on tenure, advance history, and repayment record). The exact fee is always shown before you confirm any advance.'
  },
  {
    q: 'Are there any hidden fees or penalties?',
    a: 'Absolutely not. The fee shown when you request an advance is the only fee you\'ll ever pay. No late fees, no penalties, no hidden charges. Ever.'
  },
  {
    q: 'What happens if I take multiple advances?',
    a: 'Each advance has its own fee calculated independently. There\'s no compounding or stacking of fees. You can take multiple advances up to your available limit.'
  },
  {
    q: 'Is there a minimum or maximum advance amount?',
    a: 'Minimums vary by country (typically KES 500 / UGX 10,000). Maximum is 50% of your earned wages. These limits help ensure responsible usage.'
  },
  {
    q: 'Can employers subsidize the fees?',
    a: 'Yes! Enterprise customers can negotiate employer-subsidized fees as part of their benefits package. Contact our sales team to learn more.'
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <MarketingNav />
      
      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 bg-grid" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full text-sm font-semibold text-primary mb-8">
              <Calculator className="w-4 h-4" />
              Transparent Pricing
            </div>
            <h1 className="font-heading text-5xl sm:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Simple, Fair <span className="text-gradient">Pricing</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
              No setup fees. No monthly charges for employers. Just one transparent fee per advance 
              that employees see before they confirm.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Check className="w-5 h-5 text-primary" />
                Zero cost for employers
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Check className="w-5 h-5 text-primary" />
                No hidden fees
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Check className="w-5 h-5 text-primary" />
                No interest charges
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <div 
                key={i} 
                className={`relative rounded-3xl p-8 transition-all duration-500 ${
                  plan.highlight 
                    ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white scale-105 shadow-2xl z-10' 
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-xl'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-2 bg-gradient-to-r from-primary to-emerald-600 rounded-full text-sm font-bold text-white shadow-lg">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <div className="mb-8">
                  <h3 className={`font-heading text-2xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm ${plan.highlight ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                    {plan.description}
                  </p>
                </div>
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                      {plan.priceRange}
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${plan.highlight ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {plan.priceNote}
                  </p>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3">
                      {feature.included ? (
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.highlight ? 'bg-primary' : 'bg-primary/10 dark:bg-primary/20'}`}>
                          <Check className={`w-3 h-3 ${plan.highlight ? 'text-white' : 'text-primary'}`} />
                        </div>
                      ) : (
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.highlight ? 'bg-slate-700' : 'bg-slate-100 dark:bg-slate-700'}`}>
                          <X className={`w-3 h-3 ${plan.highlight ? 'text-slate-500' : 'text-slate-400'}`} />
                        </div>
                      )}
                      <span className={`text-sm ${
                        feature.included 
                          ? plan.highlight ? 'text-white' : 'text-slate-700 dark:text-slate-300'
                          : plan.highlight ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link to={plan.ctaLink}>
                  <Button 
                    className={`w-full h-12 rounded-xl font-medium ${
                      plan.highlight 
                        ? 'bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white' 
                        : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fee Breakdown */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-slate-900 dark:text-white mb-4">
              How Fees Are <span className="text-gradient">Calculated</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Complete transparency — here's exactly what goes into your fee
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="space-y-6">
              {feeBreakdown.map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-slate-200 dark:border-slate-700 last:border-0">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{item.label}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
                  </div>
                  <span className="text-2xl font-bold text-primary">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-slate-300 dark:border-slate-600">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white">Total Fee Range</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Depending on plan and risk profile</p>
                </div>
                <span className="text-3xl font-bold text-gradient">3.5% - 6.5%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-24 bg-slate-900 dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-white mb-4">
              EaziWage vs. Alternatives
            </h2>
            <p className="text-lg text-slate-400">
              See how we compare to payday loans and bank overdrafts
            </p>
          </div>
          <div className="bg-slate-800 rounded-3xl overflow-hidden border border-slate-700">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left p-6 text-slate-400 font-medium">Feature</th>
                    <th className="text-center p-6">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center mb-2">
                          <span className="text-white font-bold">E</span>
                        </div>
                        <span className="text-white font-bold">EaziWage</span>
                      </div>
                    </th>
                    <th className="text-center p-6 text-slate-400 font-medium">Payday Loans</th>
                    <th className="text-center p-6 text-slate-400 font-medium">Bank Overdraft</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((row, i) => (
                    <tr key={i} className="border-b border-slate-700 last:border-0">
                      <td className="p-6 text-slate-300">{row.feature}</td>
                      <td className="p-6 text-center">
                        <span className="px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-semibold">
                          {row.eaziwage}
                        </span>
                      </td>
                      <td className="p-6 text-center text-slate-400">{row.loan}</td>
                      <td className="p-6 text-center text-slate-400">{row.bank}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Preview */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-heading text-4xl font-bold text-slate-900 dark:text-white mb-6">
                Calculate Your <span className="text-gradient">Fee</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                Wondering what you'll pay? Our calculator shows you exactly what to expect 
                before you take your first advance.
              </p>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4 mb-4">
                  <Calculator className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Example Calculation</p>
                    <p className="text-sm text-slate-500">KES 5,000 advance at 5% fee</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Advance Amount</span>
                    <span className="font-semibold text-slate-900 dark:text-white">KES 5,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Fee (5%)</span>
                    <span className="font-semibold text-slate-900 dark:text-white">KES 250</span>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Total Deducted</span>
                    <span className="font-bold text-primary text-lg">KES 5,250</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-emerald-500/10 dark:from-primary/5 dark:to-emerald-500/5 rounded-3xl p-8 lg:p-12">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-700">
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white mb-6">Fee Calculator</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">Advance Amount</label>
                    <div className="flex items-center bg-slate-50 dark:bg-slate-700 rounded-xl px-4 h-12">
                      <span className="text-slate-500 mr-2">KES</span>
                      <input type="text" value="10,000" readOnly className="bg-transparent flex-1 font-semibold text-slate-900 dark:text-white outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">Fee Rate</label>
                    <div className="flex items-center bg-slate-50 dark:bg-slate-700 rounded-xl px-4 h-12">
                      <input type="text" value="4.5" readOnly className="bg-transparent flex-1 font-semibold text-slate-900 dark:text-white outline-none" />
                      <span className="text-slate-500">%</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">You Receive</span>
                      <span className="text-2xl font-bold text-primary">KES 10,000</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-slate-600 dark:text-slate-400">Fee Amount</span>
                      <span className="font-semibold text-slate-900 dark:text-white">KES 450</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Pricing <span className="text-gradient">FAQs</span>
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3 flex items-start gap-3">
                  <HelpCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  {faq.q}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed pl-9">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-primary via-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Join thousands of workers accessing their earned wages today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="h-14 px-10 rounded-2xl bg-white text-primary hover:bg-slate-100">
                Start Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl border-white/30 text-white hover:bg-white/10">
                Talk to Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
