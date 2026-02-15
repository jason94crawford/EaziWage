import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Building2, Smartphone, BarChart3, Wallet, Check, 
  Clock, Shield, Zap, ChevronRight, FileText, CreditCard, Users,
  UserCheck, LineChart, Send, CheckCircle2
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
      'Link Mobile Wallet or bank account',
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
    description: 'Request an advance anytime you need it. Choose your amount, confirm the small fee, and receive funds in your Mobile Wallet within seconds.',
    details: [
      'Access up to 50% of earned wages',
      'Instant Mobile Wallet disbursement',
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
    a: 'Our fee ranges from 3.5% to 6% of the advance amount plus a $0.80 processing fee. The exact fee is always shown before you confirm the transaction. There are no hidden charges.'
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

// Infographic components for each step
const StepInfographic1 = () => (
  <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
    {/* Company Building Graphic */}
    <div className="relative">
      {/* Main building */}
      <div className="w-32 sm:w-48 h-44 sm:h-64 bg-gradient-to-b from-slate-700 to-slate-800 rounded-t-lg relative">
        {/* Windows grid */}
        <div className="absolute inset-3 sm:inset-4 grid grid-cols-3 gap-1.5 sm:gap-2">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`rounded-sm ${i % 3 === 0 ? 'bg-primary/60' : 'bg-slate-600'}`} />
          ))}
        </div>
        {/* Door */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 sm:w-12 h-12 sm:h-16 bg-primary rounded-t-lg" />
      </div>
      {/* Connection lines */}
      <div className="absolute -right-10 sm:-right-16 top-1/2 flex items-center">
        <div className="w-10 sm:w-16 h-0.5 bg-gradient-to-r from-primary to-emerald-500" />
        <div className="w-8 sm:w-12 h-8 sm:h-12 bg-gradient-to-br from-primary to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
          <CheckCircle2 className="w-4 sm:w-6 h-4 sm:h-6 text-white" />
        </div>
      </div>
      {/* Floating badge */}
      <div className="absolute -top-3 sm:-top-4 -right-3 sm:-right-4 bg-primary text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
        FREE
      </div>
    </div>
  </div>
);

const StepInfographic2 = () => (
  <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
    {/* Phone with verification flow */}
    <div className="relative">
      {/* Phone frame */}
      <div className="w-28 sm:w-40 h-52 sm:h-72 bg-slate-800 rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 shadow-2xl">
        <div className="w-full h-full bg-slate-900 rounded-xl sm:rounded-2xl overflow-hidden">
          {/* Screen content */}
          <div className="p-3 sm:p-4 space-y-2 sm:space-y-4">
            {/* Status bar */}
            <div className="flex justify-between text-[8px] sm:text-xs text-slate-500">
              <span>9:41</span>
              <div className="flex gap-1">
                <div className="w-3 sm:w-4 h-1.5 sm:h-2 bg-primary rounded-sm" />
              </div>
            </div>
            {/* Profile circle */}
            <div className="w-10 sm:w-16 h-10 sm:h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-full mx-auto flex items-center justify-center">
              <UserCheck className="w-5 sm:w-8 h-5 sm:h-8 text-white" />
            </div>
            {/* Progress steps */}
            <div className="space-y-1.5 sm:space-y-2">
              {['ID Verified', 'Phone Linked', 'Wallet Connected'].map((step, i) => (
                <div key={i} className="flex items-center gap-1.5 sm:gap-2 bg-slate-800 rounded-md sm:rounded-lg p-1.5 sm:p-2">
                  <div className="w-4 sm:w-5 h-4 sm:h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-2 sm:w-3 h-2 sm:h-3 text-white" />
                  </div>
                  <span className="text-[9px] sm:text-xs text-slate-300">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* ID Card floating */}
      <div className="absolute -left-6 sm:-left-12 top-1/4 w-14 sm:w-20 h-10 sm:h-14 bg-gradient-to-br from-emerald-500 to-primary rounded-md sm:rounded-lg shadow-lg p-1.5 sm:p-2 transform -rotate-12">
        <div className="w-full h-full border border-white/20 rounded flex items-center justify-center">
          <span className="text-white text-[10px] sm:text-xs font-bold">ID</span>
        </div>
      </div>
    </div>
  </div>
);

const StepInfographic3 = () => (
  <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
    {/* Dashboard/Chart visualization */}
    <div className="relative w-full max-w-[200px] sm:max-w-[256px]">
      {/* Main card */}
      <div className="bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <span className="text-slate-400 text-[10px] sm:text-sm">Earned This Month</span>
          <LineChart className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
        </div>
        {/* Amount */}
        <div className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">$1,245.00</div>
        <div className="text-xs sm:text-sm text-primary mb-4 sm:mb-6">+$89.50 today</div>
        {/* Mini chart */}
        <div className="flex items-end gap-0.5 sm:gap-1 h-14 sm:h-20">
          {[40, 55, 45, 60, 50, 70, 65, 80, 75, 90, 85, 95].map((h, i) => (
            <div 
              key={i} 
              className="flex-1 bg-gradient-to-t from-primary to-emerald-500 rounded-t-sm opacity-80"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        {/* Progress bar */}
        <div className="mt-4 sm:mt-6">
          <div className="flex justify-between text-[10px] sm:text-xs text-slate-400 mb-1.5 sm:mb-2">
            <span>Available</span>
            <span>60%</span>
          </div>
          <div className="h-1.5 sm:h-2 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full w-3/5 bg-gradient-to-r from-primary to-emerald-500 rounded-full" />
          </div>
        </div>
      </div>
      {/* Floating notification */}
      <div className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 bg-primary text-white text-[9px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full flex items-center gap-1 shadow-lg">
        <Zap className="w-2 sm:w-3 h-2 sm:h-3" />
        Live
      </div>
    </div>
  </div>
);

const StepInfographic4 = () => (
  <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8 overflow-hidden">
    {/* Money transfer visualization */}
    <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
      {/* From - App */}
      <div className="w-24 sm:w-32 h-36 sm:h-48 bg-slate-800 rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-xl">
        <div className="w-full h-full bg-slate-900 rounded-lg sm:rounded-xl p-2 sm:p-3">
          <div className="text-center">
            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-primary to-emerald-600 rounded-lg sm:rounded-xl mx-auto mb-1.5 sm:mb-2 flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm">E</span>
            </div>
            <div className="text-[10px] sm:text-xs text-slate-400 mb-1 sm:mb-2">Send</div>
            <div className="text-base sm:text-lg font-bold text-white">$500</div>
          </div>
        </div>
      </div>
      
      {/* Transfer animation line */}
      <div className="relative rotate-90 sm:rotate-0">
        <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-primary via-emerald-400 to-primary rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-primary to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <Send className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
          </div>
        </div>
        {/* Speed indicator */}
        <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs text-primary font-bold whitespace-nowrap">
          &lt;3 seconds
        </div>
      </div>
      
      {/* To - Wallet */}
      <div className="w-24 sm:w-32 h-36 sm:h-48 bg-gradient-to-br from-primary to-emerald-600 rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-xl">
        <div className="w-full h-full bg-white/10 backdrop-blur rounded-lg sm:rounded-xl p-2 sm:p-3">
          <div className="text-center">
            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-white rounded-lg sm:rounded-xl mx-auto mb-1.5 sm:mb-2 flex items-center justify-center">
              <Wallet className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
            </div>
            <div className="text-[10px] sm:text-xs text-white/70 mb-1 sm:mb-2">Received</div>
            <div className="text-base sm:text-lg font-bold text-white">$500</div>
            <div className="mt-1 sm:mt-2 text-[9px] sm:text-xs text-white/60">Mobile Wallet</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const infographics = [StepInfographic1, StepInfographic2, StepInfographic3, StepInfographic4];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <MarketingNav />
      
      {/* Hero */}
      <section className="pt-24 sm:pt-32 pb-16 sm:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-20 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-emerald-500/10 rounded-full blur-[150px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full text-xs sm:text-sm font-semibold text-primary mb-6 sm:mb-8">
              <FileText className="w-4 h-4" />
              Simple Process
            </div>
            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
              How <span className="text-gradient">EaziWage</span> Works
            </h1>
            <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 sm:mb-10 px-2">
              From sign-up to instant cash in your Mobile Wallet — it's simpler than you think. 
              Follow these four steps to financial freedom.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
              <Link to="/register">
                <Button size="lg" className="h-12 sm:h-14 px-6 sm:px-8 rounded-xl sm:rounded-2xl bg-gradient-to-r from-primary to-emerald-600 text-white shadow-lg shadow-primary/20 w-full sm:w-auto text-sm sm:text-base">
                  Get Started Free
                  <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="h-12 sm:h-14 px-6 sm:px-8 rounded-xl sm:rounded-2xl border-slate-300 dark:border-slate-700 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 w-full sm:w-auto text-sm sm:text-base">
                  Schedule Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="py-10 sm:py-16 bg-slate-900 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {benefits.map((benefit, i) => (
              <div key={i} className="text-center">
                <div className="w-10 sm:w-14 h-10 sm:h-14 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-4">
                  <benefit.icon className="w-5 sm:w-7 h-5 sm:h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-white text-sm sm:text-base mb-0.5 sm:mb-1">{benefit.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Detail with Infographics */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16 sm:space-y-32">
            {steps.map((step, index) => {
              const Infographic = infographics[index];
              return (
                <div 
                  key={index} 
                  className={`grid lg:grid-cols-2 gap-8 sm:gap-16 items-center`}
                >
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="text-5xl sm:text-8xl font-bold text-primary/10 dark:text-primary/5 mb-2 sm:mb-4">{step.num}</div>
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="w-10 sm:w-14 h-10 sm:h-14 bg-gradient-to-br from-primary to-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                        <step.icon className="w-5 sm:w-7 h-5 sm:h-7 text-white" />
                      </div>
                      <h2 className="font-heading text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">{step.title}</h2>
                    </div>
                    <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 mb-5 sm:mb-8 leading-relaxed">
                      {step.description}
                    </p>
                    <ul className="space-y-2 sm:space-y-4">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-center gap-2 sm:gap-3">
                          <div className="w-5 sm:w-6 h-5 sm:h-6 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 sm:w-4 h-3 sm:h-4 text-primary" />
                          </div>
                          <span className="text-slate-700 dark:text-slate-300 text-sm sm:text-base">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div className="bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl sm:rounded-3xl min-h-[280px] sm:min-h-[400px] border border-slate-200 dark:border-slate-700 overflow-hidden">
                      <Infographic />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
            Watch How It Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-8 sm:mb-10 max-w-2xl mx-auto">
            See a quick walkthrough of how EaziWage helps you access your earned wages in real-time.
          </p>
          <div className="aspect-video bg-slate-200 dark:bg-slate-800 rounded-2xl sm:rounded-3xl flex items-center justify-center border border-slate-300 dark:border-slate-700">
            <Button size="lg" className="rounded-full w-14 sm:w-20 h-14 sm:h-20 bg-gradient-to-br from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 shadow-lg shadow-primary/30">
              <svg className="w-6 sm:w-8 h-6 sm:h-8 ml-0.5 sm:ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
              Common Questions
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
              Everything you need to know about using EaziWage
            </p>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-sm sm:text-lg text-slate-900 dark:text-white mb-2 sm:mb-3">{faq.q}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs sm:text-base">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-primary via-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Ready to get started?
          </h2>
          <p className="text-base sm:text-xl text-white/80 mb-8 sm:mb-10">
            Join thousands of workers already using EaziWage.
          </p>
          <Link to="/register">
            <Button size="lg" className="h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg rounded-xl sm:rounded-2xl bg-white text-primary hover:bg-slate-100 shadow-lg w-full sm:w-auto">
              Create Free Account
              <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
