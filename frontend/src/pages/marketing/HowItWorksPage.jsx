import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Building2, Smartphone, BarChart3, Wallet, Check, 
  Clock, Shield, Zap, ChevronRight, FileText, CreditCard, Users
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { MarketingNav } from '../../components/layout/MarketingNav';
import { Footer } from '../../components/layout/Footer';

const steps = [
  {
    num: '01',
    icon: Building2,
    title: 'Employer Registration',
    description: 'Your employer signs up for EaziWage and connects their payroll system. This is completely free for employers and takes about 15 minutes.',
    details: [
      'Company verification and KYC',
      'Payroll system integration (API or manual)',
      'Employee invitation setup',
      'Customizable advance limits'
    ]
  },
  {
    num: '02',
    icon: Smartphone,
    title: 'Employee Onboarding',
    description: 'Download the EaziWage app and complete your profile. Quick KYC verification ensures your account is secure and ready to use.',
    details: [
      'Download app (iOS/Android) or use web',
      'Verify identity with National ID',
      'Link M-PESA or bank account',
      'Get approved in minutes'
    ]
  },
  {
    num: '03',
    icon: BarChart3,
    title: 'Track Earnings Daily',
    description: 'Watch your earned wages accumulate in real-time. Our dashboard shows exactly how much you\'ve earned and what\'s available for advance.',
    details: [
      'Real-time earnings tracker',
      'Daily wage calculations',
      'Clear advance limits shown',
      'Payroll sync every 24 hours'
    ]
  },
  {
    num: '04',
    icon: Wallet,
    title: 'Access Wages Instantly',
    description: 'Request an advance anytime you need it. Choose your amount, confirm the small fee, and receive funds in your M-PESA within seconds.',
    details: [
      'Access up to 50% of earned wages',
      'Instant M-PESA disbursement',
      'Transparent fee shown upfront',
      'Auto-deducted on payday'
    ]
  }
];

const benefits = [
  {
    icon: Zap,
    title: 'Lightning Speed',
    description: 'Funds arrive in under 3 seconds'
  },
  {
    icon: Shield,
    title: 'Fully Secure',
    description: '256-bit encryption protection'
  },
  {
    icon: Clock,
    title: '24/7 Available',
    description: 'Access wages anytime'
  },
  {
    icon: CreditCard,
    title: 'No Credit Check',
    description: 'Your money, no approval needed'
  }
];

const faqs = [
  {
    q: 'What documents do I need to sign up?',
    a: 'You\'ll need your National ID (or passport), a phone number registered to your name, and employment verification from your employer. The entire process takes about 5 minutes.'
  },
  {
    q: 'How is the fee calculated?',
    a: 'Our fee ranges from 3.5% to 6.5% of the advance amount, depending on your employer\'s plan. The exact fee is always shown before you confirm the transaction. There are no hidden charges.'
  },
  {
    q: 'When do I pay back the advance?',
    a: 'The advance amount plus fee is automatically deducted from your next paycheck. You don\'t need to do anything — it\'s completely automatic and hassle-free.'
  },
  {
    q: 'What if I need more than 50% of my wages?',
    a: 'The 50% limit is designed to ensure you have enough for your regular expenses. This helps maintain financial balance and prevents over-reliance on advances.'
  },
  {
    q: 'Can I use EaziWage if I\'m on contract/part-time?',
    a: 'Yes! As long as your employer is registered with EaziWage and your employment is verified, you can access earned wages regardless of your employment type.'
  }
];

export default function HowItWorksPage() {
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
              <FileText className="w-4 h-4" />
              Simple Process
            </div>
            <h1 className="font-heading text-5xl sm:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              How <span className="text-gradient">EaziWage</span> Works
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10">
              From sign-up to instant cash in your M-PESA — it's simpler than you think. 
              Follow these four steps to financial freedom.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="h-14 px-8 rounded-2xl bg-gradient-to-r from-primary to-emerald-600 text-white shadow-lg">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl dark:border-slate-700 dark:text-white">
                  Schedule Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="py-12 bg-slate-900 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {benefits.map((benefit, i) => (
              <div key={i} className="text-center">
                <benefit.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-1">{benefit.title}</h3>
                <p className="text-sm text-slate-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Detail */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-32">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`grid lg:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="text-8xl font-bold text-primary/10 dark:text-primary/5 mb-4">{step.num}</div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                      <step.icon className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="font-heading text-3xl font-bold text-slate-900 dark:text-white">{step.title}</h2>
                  </div>
                  <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                    {step.description}
                  </p>
                  <ul className="space-y-4">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-slate-700 dark:text-slate-300">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 lg:p-12 border border-slate-200 dark:border-slate-700">
                    <div className="aspect-video bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-inner">
                      <step.icon className="w-20 h-20 text-slate-300 dark:text-slate-600" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-24 bg-slate-900 dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-6">
            Watch How It Works
          </h2>
          <p className="text-slate-400 mb-10 max-w-2xl mx-auto">
            See a quick walkthrough of how EaziWage helps you access your earned wages in real-time.
          </p>
          <div className="aspect-video bg-slate-800 rounded-3xl flex items-center justify-center border border-slate-700">
            <Button size="lg" className="rounded-full w-20 h-20 bg-primary hover:bg-primary/90">
              <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Common Questions
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Everything you need to know about using EaziWage
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3">{faq.q}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-primary via-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Join thousands of workers already using EaziWage.
          </p>
          <Link to="/register">
            <Button size="lg" className="h-14 px-10 text-lg rounded-2xl bg-white text-primary hover:bg-slate-100">
              Create Free Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
