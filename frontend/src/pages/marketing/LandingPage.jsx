import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Check, Zap, Shield, Clock, Building2, Users, 
  CreditCard, Phone, ChevronRight, Globe, Smartphone, 
  Banknote, Lock, TrendingUp, Star, Play
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { MarketingNav } from '../../components/layout/MarketingNav';
import { Footer } from '../../components/layout/Footer';

const heroStats = [
  { value: '50K+', label: 'Active Users' },
  { value: 'KES 2B+', label: 'Disbursed' },
  { value: '<3s', label: 'Instant Transfer' },
];

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Get your money in under 3 seconds via M-PESA, MTN Mobile Money, or Airtel Money.',
    color: 'bg-amber-500'
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'Your data is protected with 256-bit encryption and full compliance with local regulations.',
    color: 'bg-blue-500'
  },
  {
    icon: Banknote,
    title: 'Zero Interest',
    description: 'Access your earned wages, not a loan. One transparent fee, no hidden charges.',
    color: 'bg-emerald-500'
  },
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'Your employer only sees aggregated data. Your personal transactions stay private.',
    color: 'bg-purple-500'
  }
];

const steps = [
  {
    num: '01',
    title: 'Employer Signs Up',
    description: 'Your company registers and connects their payroll system to EaziWage.'
  },
  {
    num: '02',
    title: 'You Join',
    description: 'Download the app, verify your identity with a quick KYC process.'
  },
  {
    num: '03',
    title: 'Track Earnings',
    description: 'Watch your earned wages grow daily as you work.'
  },
  {
    num: '04',
    title: 'Access Anytime',
    description: 'Withdraw up to 50% of earned wages instantly when you need it.'
  }
];

const testimonials = [
  {
    quote: "EaziWage saved me from expensive loan sharks. Now I can handle emergencies without stress.",
    author: "Mary Wanjiku",
    role: "Nurse, Nairobi",
    avatar: "MW"
  },
  {
    quote: "As an HR manager, this has reduced salary advance requests by 80%. Employees love it.",
    author: "David Omondi",
    role: "HR Director, Safaricom",
    avatar: "DO"
  },
  {
    quote: "The speed is incredible. I requested KES 5,000 and it was in my M-PESA in 2 seconds!",
    author: "Joseph Mugisha",
    role: "Driver, Kampala",
    avatar: "JM"
  }
];

const countries = [
  { name: 'Kenya', flag: '🇰🇪', providers: ['M-PESA', 'Airtel Money'], users: '25K+' },
  { name: 'Uganda', flag: '🇺🇬', providers: ['MTN MoMo', 'Airtel Money'], users: '12K+' },
  { name: 'Tanzania', flag: '🇹🇿', providers: ['M-PESA', 'Tigo Pesa'], users: '8K+' },
  { name: 'Rwanda', flag: '🇷🇼', providers: ['MTN MoMo', 'Airtel Money'], users: '5K+' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-50" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <div className="stagger">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-8">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Now serving 50,000+ workers across East Africa
              </div>
              
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] mb-6">
                Your Money.
                <br />
                <span className="text-gradient">Your Timeline.</span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-8 max-w-xl leading-relaxed">
                Access up to 50% of your earned wages instantly. No loans, no interest, no waiting for payday. 
                Just your hard-earned money when you need it.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white h-14 px-8 text-base rounded-xl shadow-glow" data-testid="hero-get-started">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base rounded-xl border-2" data-testid="hero-watch-demo">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
              
              {/* Stats */}
              <div className="flex gap-8 sm:gap-12">
                {heroStats.map((stat, i) => (
                  <div key={i}>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right - Phone mockup with UI */}
            <div className="relative hidden lg:block">
              <div className="absolute -top-10 -left-10 w-full h-full bg-primary/10 rounded-[3rem] transform rotate-6" />
              <div className="relative bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl">
                <div className="bg-white rounded-[2rem] overflow-hidden">
                  {/* Phone screen content */}
                  <div className="bg-gradient-to-b from-primary to-emerald-600 p-6 text-white">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <p className="text-sm opacity-80">Available Balance</p>
                        <p className="text-3xl font-bold">KES 12,450</p>
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <Smartphone className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Earned this month</span>
                        <span className="font-semibold">KES 24,900</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div className="bg-white rounded-full h-2 w-1/2" />
                      </div>
                      <p className="text-xs mt-2 opacity-80">50% available for advance</p>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">Quick Advance</p>
                          <p className="text-sm text-slate-500">Get funds in seconds</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">KES 5,000 Sent</p>
                          <p className="text-sm text-slate-500">To M-PESA · 2 sec ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -right-8 top-1/4 bg-white rounded-2xl shadow-xl p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Transfer Complete</p>
                    <p className="text-xs text-slate-500">1.8 seconds</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-500 mb-8">Trusted by leading companies across East Africa</p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 opacity-60">
            {['Safaricom', 'KCB Bank', 'Equity', 'MTN', 'Twiga Foods', 'Jumia'].map((company) => (
              <div key={company} className="text-xl font-bold text-slate-400 tracking-tight">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Why workers <span className="text-gradient">love</span> EaziWage
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Built for the realities of African workers. Fast, fair, and always on your side.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-8 bg-white border border-slate-200 rounded-2xl hover:border-primary/30 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Get started in <span className="text-primary">4 simple steps</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              From sign-up to your first advance in under 10 minutes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-primary/50 to-transparent" />
                )}
                <div className="text-6xl font-bold text-primary/20 mb-4">{step.num}</div>
                <h3 className="font-heading text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Employers */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-sm font-medium mb-6">
                <Building2 className="w-4 h-4" />
                For Employers
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                Empower your team.
                <br />
                <span className="text-gradient">Zero cost to you.</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Offer earned wage access as a benefit that costs you nothing. 
                Reduce turnover, boost productivity, and become an employer of choice.
              </p>
              
              <div className="space-y-4 mb-10">
                {[
                  'No integration fees or monthly costs',
                  'Simple payroll API integration',
                  'Real-time dashboard and analytics',
                  'Dedicated account manager',
                  'Compliance with local labour laws'
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Link to="/register?role=employer">
                <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white h-12 px-6 rounded-xl" data-testid="employer-cta">
                  Register Your Company
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="relative">
              <div className="bg-slate-100 rounded-3xl p-8">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-heading font-semibold text-lg">Employer Dashboard</h3>
                    <span className="text-xs text-slate-500">Live Preview</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-2xl font-bold text-slate-900">247</p>
                      <p className="text-sm text-slate-500">Active Employees</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-4">
                      <p className="text-2xl font-bold text-emerald-600">-34%</p>
                      <p className="text-sm text-slate-500">Advance Requests</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {['Verified', 'Pending KYC', 'New'].map((status, i) => (
                      <div key={i} className="flex items-center justify-between py-2">
                        <span className="text-sm text-slate-600">{status}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full" 
                              style={{ width: `${[85, 10, 5][i]}%` }} 
                            />
                          </div>
                          <span className="text-sm text-slate-900 font-medium w-12 text-right">
                            {[210, 25, 12][i]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Voices from across East Africa
            </h2>
            <p className="text-xl text-slate-600">
              Real stories from workers and employers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.author}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Countries */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Serving <span className="text-gradient">East Africa</span>
            </h2>
            <p className="text-xl text-slate-600">
              Available in 4 countries with local mobile money integration
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {countries.map((country, index) => (
              <div 
                key={index}
                className="bg-slate-50 rounded-2xl p-6 text-center hover:bg-slate-100 transition-colors duration-300"
              >
                <span className="text-5xl mb-4 block">{country.flag}</span>
                <h3 className="font-heading text-xl font-semibold text-slate-900 mb-2">{country.name}</h3>
                <p className="text-primary font-semibold mb-3">{country.users} users</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {country.providers.map((provider, i) => (
                    <span key={i} className="px-3 py-1 bg-white rounded-full text-xs text-slate-600">
                      {provider}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px]" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to take control of your earnings?
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Join thousands of workers across East Africa who have discovered financial freedom with EaziWage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white h-14 px-8 text-base rounded-xl shadow-glow" data-testid="cta-get-started">
                Start For Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base rounded-xl border-2 border-slate-700 text-white hover:bg-slate-800" data-testid="cta-contact">
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
