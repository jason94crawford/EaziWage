import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Building2, Users, TrendingUp, Shield, Check, 
  Clock, BarChart3, Heart, Award, Zap, Target, ChevronRight
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { MarketingNav } from '../../components/layout/MarketingNav';
import { Footer } from '../../components/layout/Footer';

const benefits = [
  {
    icon: Heart,
    title: 'Boost Employee Satisfaction',
    stat: '+40%',
    description: 'Employees with access to earned wages report significantly higher job satisfaction and financial wellbeing.'
  },
  {
    icon: TrendingUp,
    title: 'Reduce Turnover',
    stat: '-25%',
    description: 'Companies using EaziWage see dramatic reductions in employee turnover and associated hiring costs.'
  },
  {
    icon: Target,
    title: 'Increase Productivity',
    stat: '+15%',
    description: 'Financial stress is a major productivity killer. EaziWage helps employees stay focused on work.'
  },
  {
    icon: Clock,
    title: 'Save HR Time',
    stat: '80%',
    description: 'Eliminate time spent processing salary advance requests. EaziWage handles everything automatically.'
  }
];

const features = [
  {
    title: 'Zero Cost Implementation',
    description: 'No setup fees, no monthly charges, no hidden costs. We only charge employees a small transparent fee on advances.'
  },
  {
    title: 'Easy Payroll Integration',
    description: 'Connect via API or upload payroll data manually. Works with any payroll system in use today.'
  },
  {
    title: 'Customizable Limits',
    description: 'Set advance limits, frequencies, and eligible employees. You maintain full control over the program.'
  },
  {
    title: 'Real-Time Dashboard',
    description: 'Monitor usage, track trends, and generate reports. Full visibility into your EWA program.'
  },
  {
    title: 'Automatic Settlement',
    description: 'Advances are automatically deducted from payroll. No manual reconciliation needed.'
  },
  {
    title: 'Dedicated Support',
    description: 'Your own account manager plus 24/7 support for you and your employees.'
  }
];

const process = [
  { title: 'Schedule Demo', description: 'See EaziWage in action and get your questions answered' },
  { title: 'Sign Agreement', description: 'Simple terms, no long-term commitment required' },
  { title: 'Integrate Payroll', description: 'Connect your payroll system (15-30 minutes)' },
  { title: 'Invite Employees', description: 'Launch the benefit to your workforce' }
];

const testimonials = [
  {
    quote: "EaziWage has transformed how we support our workforce. Salary advance requests dropped by 80%, and HR now focuses on strategic work instead of processing advance forms.",
    author: "Sarah Mwangi",
    role: "HR Director",
    company: "Safaricom PLC"
  },
  {
    quote: "Our factory workers now have dignity when emergencies strike. Employee satisfaction scores increased by 35% after implementing EaziWage.",
    author: "James Ochieng",
    role: "CEO",
    company: "Twiga Foods"
  }
];

export default function EmployersPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <MarketingNav />
      
      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 bg-grid" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full text-sm font-semibold text-primary mb-8">
                <Building2 className="w-4 h-4" />
                For Employers
              </div>
              <h1 className="font-heading text-5xl sm:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                Empower Your Team.
                <br />
                <span className="text-gradient">Zero Cost to You.</span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
                Offer earned wage access as a workplace benefit that costs you nothing. 
                Reduce turnover, boost productivity, and become an employer of choice.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link to="/register?role=employer">
                  <Button size="lg" className="h-14 px-8 rounded-2xl bg-gradient-to-r from-primary to-emerald-600 text-white shadow-lg">
                    Register Your Company
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl dark:border-slate-700 dark:text-white">
                    Schedule Demo
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Free to implement</span>
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> No commitment</span>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white">Employer Dashboard</h3>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">Live</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-6">
                    <Users className="w-8 h-8 text-primary mb-3" />
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">247</p>
                    <p className="text-sm text-slate-500">Active Employees</p>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6">
                    <TrendingUp className="w-8 h-8 text-emerald-600 mb-3" />
                    <p className="text-3xl font-bold text-emerald-600">-34%</p>
                    <p className="text-sm text-slate-500">HR Requests</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {['Verified', 'Pending KYC', 'New Joiners'].map((label, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-300">{label}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-slate-200 dark:bg-slate-600 rounded-full">
                          <div className="h-2 bg-primary rounded-full" style={{width: `${[85, 10, 5][i]}%`}} />
                        </div>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white w-8">{[210, 25, 12][i]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-slate-900 dark:text-white mb-4">
              The Business Case for <span className="text-gradient">EaziWage</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Real results from companies across East Africa
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <benefit.icon className="w-10 h-10 text-primary mb-4" />
                <p className="text-4xl font-bold text-primary mb-2">{benefit.stat}</p>
                <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white mb-3">{benefit.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              A complete earned wage access solution for your organization
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-slate-900 dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-white mb-4">
              Get Started in Days, Not Months
            </h2>
            <p className="text-lg text-slate-400">
              Our simple onboarding process gets you live quickly
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {process.map((step, i) => (
              <div key={i} className="relative text-center">
                {i < process.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                  {i + 1}
                </div>
                <h3 className="font-heading text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Trusted by Industry Leaders
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700">
                <p className="text-lg text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">"{t.quote}"</p>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{t.author}</p>
                  <p className="text-slate-500">{t.role}, {t.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-primary via-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Support Your Workforce?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Schedule a demo and see how EaziWage can transform your employee benefits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register?role=employer">
              <Button size="lg" className="h-14 px-10 rounded-2xl bg-white text-primary hover:bg-slate-100">
                Register Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl border-white/30 text-white hover:bg-white/10">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
