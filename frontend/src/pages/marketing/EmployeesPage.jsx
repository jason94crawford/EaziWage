import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Wallet, Shield, Clock, Smartphone, Check, 
  Zap, CreditCard, Bell, TrendingUp, Star, Heart, Users,
  ChevronRight, Calculator, Banknote, Lock, Target
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { MarketingNav } from '../../components/layout/MarketingNav';
import { Footer } from '../../components/layout/Footer';

const benefits = [
  {
    icon: Zap,
    title: 'Instant Access',
    description: 'Get your earned wages in under 3 seconds, directly to your Mobile Wallet or bank account.',
    stat: '<3 sec'
  },
  {
    icon: Shield,
    title: 'Zero Interest',
    description: 'This is your money, not a loan. No interest charges, ever. Just a small transparent fee.',
    stat: '0% APR'
  },
  {
    icon: Lock,
    title: 'Private & Secure',
    description: 'Your transactions are private. Your employer only sees aggregated data, never your personal advances.',
    stat: '256-bit'
  },
  {
    icon: Target,
    title: 'Up to 60% Access',
    description: 'Access up to 60% of your earned wages at any time. Smart limits to help you stay balanced.',
    stat: '60%'
  },
];

const steps = [
  {
    num: '01',
    title: 'Check Eligibility',
    description: 'Verify your employer is registered with EaziWage. If not, recommend us to your HR team!'
  },
  {
    num: '02',
    title: 'Sign Up in Minutes',
    description: 'Download the app, verify your ID, and link your Mobile Wallet or bank account. Takes under 5 minutes.'
  },
  {
    num: '03',
    title: 'Track Your Earnings',
    description: 'Watch your earned wages accumulate daily. Our dashboard shows exactly what\'s available.'
  },
  {
    num: '04',
    title: 'Access Anytime',
    description: 'Request an advance when you need it. Funds arrive instantly. Automatic payroll deduction.'
  },
];

const useCases = [
  {
    title: 'Emergency Medical Bills',
    description: 'Don\'t wait for payday when health emergencies strike. Access your wages instantly to pay for treatment.',
    icon: Heart
  },
  {
    title: 'School Fees & Education',
    description: 'Keep your children in school even when fees are due mid-month. Access wages to pay on time.',
    icon: Users
  },
  {
    title: 'Avoid Predatory Loans',
    description: 'Stop paying 30%+ interest on payday loans. Access your own money at a fraction of the cost.',
    icon: Shield
  },
  {
    title: 'Daily Expenses',
    description: 'Cover groceries, transport, and utilities without stress. Your wages, your timeline.',
    icon: Wallet
  },
];

const testimonials = [
  {
    quote: "EaziWage saved me from a loan shark when my daughter got sick. I got the money in seconds and paid the hospital immediately. No more high-interest loans for me!",
    author: "Mary Wanjiku",
    role: "Nurse",
    location: "Nairobi, Kenya"
  },
  {
    quote: "I used to borrow from friends every month before payday. Now I just access my earned wages. It's my money - why should I wait?",
    author: "Joseph Mugisha",
    role: "Delivery Driver",
    location: "Kampala, Uganda"
  },
  {
    quote: "The school sent my kids home for fees. With EaziWage, I accessed my wages and paid the same day. They were back in class the next morning.",
    author: "Grace Akinyi",
    role: "Teacher",
    location: "Nairobi, Kenya"
  },
];

const faqs = [
  {
    q: "Is EaziWage a loan?",
    a: "No! EaziWage is NOT a loan. You're accessing wages you've already earned through your work. There's no debt, no interest, and no credit check."
  },
  {
    q: "How much does it cost?",
    a: "We charge a small fee of 3.5% to 6% plus $0.80 processing fee per transaction. No hidden charges, no interest. The fee is shown before you confirm."
  },
  {
    q: "How fast do I get my money?",
    a: "Instantly! Funds are sent to your Mobile Wallet in under 3 seconds. Bank transfers may take 1-2 days."
  },
  {
    q: "What if my employer isn't registered?",
    a: "Recommend EaziWage to your HR department! It's free for employers. Once they register, you can start accessing your wages."
  },
];

export default function EmployeesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <MarketingNav />
      
      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full text-sm font-semibold text-primary mb-8">
                <Users className="w-4 h-4" />
                For Employees
              </div>
              <h1 className="font-heading text-5xl sm:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                Your Wages.
                <br />
                <span className="text-gradient">Your Timeline.</span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                Why wait for payday? Access up to 60% of your earned wages instantly. 
                No loans, no interest, no waiting. Just your hard-earned money when you need it.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/register?role=employee">
                  <Button size="lg" className="h-14 px-8 rounded-2xl bg-gradient-to-r from-primary to-emerald-600 text-white shadow-lg">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/calculator">
                  <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl dark:border-slate-700 dark:text-white">
                    <Calculator className="w-5 h-5 mr-2" />
                    Calculate Access
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> No credit check</span>
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Zero interest</span>
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Instant access</span>
              </div>
            </div>
            
            {/* Phone Mockup */}
            <div className="relative hidden lg:block">
              <div className="bg-gradient-to-br from-primary/20 to-emerald-500/20 rounded-3xl p-8">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <div className="bg-gradient-to-br from-primary to-emerald-600 p-6 text-white">
                    <p className="text-sm opacity-80 mb-1">Available to Access</p>
                    <p className="text-4xl font-bold">$287.50</p>
                    <p className="text-sm opacity-70 mt-2">of $575.00 earned this month</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white text-sm">Days Worked</p>
                          <p className="text-xs text-slate-500">This pay period</p>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-slate-900 dark:text-white">12/28</span>
                    </div>
                    <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-emerald-600 text-white">
                      Request Advance
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
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
              Why Employees <span className="text-gradient">Love EaziWage</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Financial freedom designed for working people across East Africa
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white">{benefit.title}</h3>
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg">{benefit.stat}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Get Started in <span className="text-gradient">4 Simple Steps</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              From sign-up to instant cash in under 10 minutes
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
                )}
                <div className="text-6xl font-bold text-primary/10 dark:text-primary/5 mb-4">{step.num}</div>
                <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-slate-900 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-white mb-4">
              When You <span className="text-gradient">Need It Most</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Life doesn't wait for payday. Neither should you.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {useCases.map((useCase, i) => (
              <div key={i} className="bg-slate-800 rounded-2xl p-8 border border-slate-700 hover:border-primary/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <useCase.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-white mb-2">{useCase.title}</h3>
                    <p className="text-slate-400">{useCase.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Real Stories from <span className="text-gradient">Real Workers</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">"{t.quote}"</p>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{t.author}</p>
                  <p className="text-sm text-slate-500">{t.role}</p>
                  <p className="text-xs text-primary">{t.location}</p>
                </div>
              </div>
            ))}
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
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3">{faq.q}</h3>
                <p className="text-slate-600 dark:text-slate-400">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/faq">
              <Button variant="outline" size="lg" className="rounded-xl">
                View All FAQs
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-primary via-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Access Your Earned Wages?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Join thousands of workers across East Africa who've discovered financial freedom.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register?role=employee">
              <Button size="lg" className="h-14 px-10 rounded-2xl bg-white text-primary hover:bg-slate-100">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/calculator">
              <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl border-white/30 text-white hover:bg-white/10">
                <Calculator className="w-5 h-5 mr-2" />
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
