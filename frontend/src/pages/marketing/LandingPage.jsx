import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Check, Zap, Shield, Clock, Building2, Users, 
  CreditCard, Phone, ChevronRight, Globe, Smartphone, 
  Banknote, Lock, TrendingUp, Star, Play, Award, Heart,
  Wallet, ArrowUpRight, Sparkles, Target, BarChart3
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { MarketingNav } from '../../components/layout/MarketingNav';
import { Footer } from '../../components/layout/Footer';
import { AnimatedCounter, AnimatedStatCard, useInView } from '../../components/AnimatedCounter';

const heroStats = [
  { value: '50K+', label: 'Active Users', icon: Users },
  { value: '$2B+', label: 'Disbursed', icon: Banknote },
  { value: '<3s', label: 'Instant Transfer', icon: Zap },
  { value: '4.9', label: 'App Rating', icon: Star },
];

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast Transfers',
    description: 'Get your money in under 3 seconds via Mobile Wallet or bank transfer. No waiting, no hassle.',
    gradient: 'from-amber-500 to-orange-600',
    stats: '< 3 seconds'
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'Your data is protected with 256-bit encryption, two-factor authentication, and full compliance with local regulations.',
    gradient: 'from-blue-500 to-indigo-600',
    stats: '256-bit encrypted'
  },
  {
    icon: Banknote,
    title: 'Zero Interest, Always',
    description: 'Access your earned wages, not a loan. One transparent fee, no hidden charges, no compounding interest.',
    gradient: 'from-emerald-500 to-teal-600',
    stats: '0% interest'
  },
  {
    icon: Lock,
    title: 'Privacy Protected',
    description: 'Your employer only sees aggregated data. Your personal transactions and financial details stay completely private.',
    gradient: 'from-purple-500 to-pink-600',
    stats: '100% private'
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Access your wages anytime, anywhere. Our platform never sleeps, so you can get funds when you need them most.',
    gradient: 'from-cyan-500 to-blue-600',
    stats: 'Always on'
  },
  {
    icon: Target,
    title: 'Smart Limits',
    description: 'Responsible access with built-in safeguards. Access up to 50% of earned wages to maintain financial balance.',
    gradient: 'from-rose-500 to-red-600',
    stats: 'Up to 50%'
  },
];

const steps = [
  {
    num: '01',
    title: 'Employer Signs Up',
    description: 'Your company registers with EaziWage and connects their payroll system through our simple API or manual upload.',
    icon: Building2
  },
  {
    num: '02',
    title: 'You Join the Platform',
    description: 'Download the app, complete a quick KYC verification with your ID and employment details. Takes just 5 minutes.',
    icon: Smartphone
  },
  {
    num: '03',
    title: 'Track Your Earnings',
    description: 'Watch your earned wages grow daily as you work. Our dashboard shows exactly how much you can access.',
    icon: BarChart3
  },
  {
    num: '04',
    title: 'Access Instantly',
    description: 'Withdraw up to 50% of your earned wages anytime. Funds hit your Mobile Wallet or bank account in seconds.',
    icon: Wallet
  }
];

const testimonials = [
  {
    quote: "EaziWage saved me from expensive loan sharks. When my daughter got sick, I accessed my wages in 2 seconds and paid the hospital bill immediately. This is a game-changer!",
    author: "Mary Wanjiku",
    role: "Nurse at Kenyatta National Hospital",
    location: "Nairobi, Kenya",
    avatar: "MW",
    rating: 5
  },
  {
    quote: "As HR Director, I've seen employee satisfaction increase by 40% since we introduced EaziWage. Salary advance requests dropped by 80%, and our team is more focused and productive.",
    author: "David Omondi",
    role: "HR Director at Safaricom",
    location: "Nairobi, Kenya",
    avatar: "DO",
    rating: 5
  },
  {
    quote: "The speed is unbelievable! I requested $50 for an emergency and it was in my Mobile Wallet before I could put my phone down. I tell all my colleagues about EaziWage.",
    author: "Joseph Mugisha",
    role: "Delivery Driver at Glovo",
    location: "Kampala, Uganda",
    avatar: "JM",
    rating: 5
  },
  {
    quote: "Being a single mother, cash flow was always stressful. Now I can access my wages when school fees are due without borrowing from anyone. EaziWage gave me dignity.",
    author: "Grace Akinyi",
    role: "Teacher at Alliance High School",
    location: "Nairobi, Kenya",
    avatar: "GA",
    rating: 5
  },
  {
    quote: "We implemented EaziWage for our 500+ factory workers. Employee retention improved by 25% in just 6 months. It's now a key part of our benefits package.",
    author: "James Mwangi",
    role: "CEO at Twiga Foods",
    location: "Nairobi, Kenya",
    avatar: "JM2",
    rating: 5
  },
  {
    quote: "I used to pay 30% interest on emergency loans. With EaziWage, I pay a small flat fee and keep my dignity. This is how financial services should work in Africa.",
    author: "Sarah Nakato",
    role: "Cashier at Nakumatt",
    location: "Kigali, Rwanda",
    avatar: "SN",
    rating: 5
  },
];

const countries = [
  { name: 'Kenya', flag: '🇰🇪', providers: ['Mobile Wallet', 'Airtel Money'], users: '25,000+', currency: 'KES' },
  { name: 'Uganda', flag: '🇺🇬', providers: ['MTN MoMo', 'Airtel Money'], users: '12,000+', currency: 'UGX' },
  { name: 'Tanzania', flag: '🇹🇿', providers: ['M-PESA', 'Tigo Pesa'], users: '8,000+', currency: 'TZS' },
  { name: 'Rwanda', flag: '🇷🇼', providers: ['MTN MoMo', 'Airtel Money'], users: '5,000+', currency: 'RWF' },
];

const partners = ['Safaricom', 'KCB Bank', 'Equity Bank', 'MTN', 'Twiga Foods', 'Jumia', 'Glovo', 'Bolt'];

const faqs = [
  {
    q: "Is EaziWage a loan?",
    a: "No! EaziWage is NOT a loan. You're accessing wages you've already earned but haven't been paid yet. There's no interest, no debt, and no credit check required."
  },
  {
    q: "How fast will I receive my money?",
    a: "Instantly! Once approved, funds are sent to your M-PESA or mobile money account in under 3 seconds. Bank transfers may take 1-2 business days."
  },
  {
    q: "What are the fees?",
    a: "We charge a small, transparent fee ranging from 3.5% to 6.5% depending on your employer's plan. No hidden charges, no interest, no penalties."
  },
  {
    q: "How much can I access?",
    a: "You can access up to 50% of your earned wages at any time. This limit helps ensure responsible usage while giving you financial flexibility."
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500">
      <MarketingNav />
      
      {/* Hero Section */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-20 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <div className="stagger">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 dark:bg-primary/20 border border-primary/20 rounded-full text-sm font-semibold text-primary mb-8">
                <Sparkles className="w-4 h-4" />
                Now serving 50,000+ workers across East Africa
              </div>
              
              <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-[1.1] mb-8">
                Your Money.
                <br />
                <span className="text-gradient">Your Timeline.</span>
              </h1>
              
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-xl leading-relaxed">
                Access up to 50% of your earned wages instantly. No loans, no interest, no waiting for payday. 
                Just your hard-earned money when you need it most.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-14">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base rounded-2xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white shadow-xl shadow-primary/30 btn-glow" data-testid="hero-get-started">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base rounded-2xl border-2 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800" data-testid="hero-watch-demo">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {heroStats.map((stat, i) => (
                  <div key={i} className="text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                      <stat.icon className="w-5 h-5 text-primary" />
                      <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right - Phone mockup */}
            <div className="relative hidden lg:block">
              <div className="absolute -top-10 -left-10 w-full h-full bg-gradient-to-br from-primary/20 to-emerald-500/20 rounded-[3rem] transform rotate-6 blur-sm" />
              <div className="relative bg-slate-900 rounded-[2.5rem] p-4 shadow-2xl shadow-slate-900/50 glow-primary">
                <div className="bg-white dark:bg-slate-800 rounded-[2rem] overflow-hidden">
                  {/* Phone screen */}
                  <div className="bg-gradient-to-br from-primary via-emerald-500 to-teal-600 p-8 text-white">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <p className="text-sm opacity-80 mb-1">Available Balance</p>
                        <p className="text-4xl font-bold">KES 12,450</p>
                      </div>
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <Wallet className="w-7 h-7" />
                      </div>
                    </div>
                    <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5">
                      <div className="flex justify-between text-sm mb-3">
                        <span className="opacity-80">Earned this month</span>
                        <span className="font-bold">KES 24,900</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-3">
                        <div className="bg-white rounded-full h-3 w-1/2 shadow-lg" />
                      </div>
                      <p className="text-xs mt-3 opacity-70">50% available for advance</p>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4 bg-slate-50 dark:bg-slate-900">
                    <div className="flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">Quick Advance</p>
                          <p className="text-sm text-slate-500">Get funds in seconds</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                    
                    <div className="flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                          <Check className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">KES 5,000 Sent</p>
                          <p className="text-sm text-slate-500">To M-PESA · 2 sec ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating card */}
              <div className="absolute -right-8 top-1/3 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-5 animate-float border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                    <Check className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Transfer Complete</p>
                    <p className="text-sm text-slate-500">1.8 seconds</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 mb-10 uppercase tracking-wider">
            Trusted by leading companies across East Africa
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
            {partners.map((company) => (
              <div 
                key={company} 
                className="text-2xl font-bold text-slate-300 dark:text-slate-600 hover:text-primary dark:hover:text-primary transition-colors duration-300 cursor-pointer"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 lg:py-32 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full text-sm font-semibold text-primary mb-6">
              <Award className="w-4 h-4" />
              Why Choose EaziWage
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Built for <span className="text-gradient">African Workers</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Fast, fair, and always on your side. Experience financial services designed for the realities of working life in East Africa.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="feature-card group from-primary to-emerald-600">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white">{feature.title}</h3>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {feature.stats}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 lg:py-32 bg-slate-900 dark:bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[200px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-semibold text-primary mb-6">
              <Sparkles className="w-4 h-4" />
              Simple Process
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Get started in <span className="text-gradient">4 steps</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              From sign-up to your first advance in under 10 minutes. It's that simple.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-6xl font-bold text-primary/20 mb-4">{step.num}</div>
                  <h3 className="font-heading text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <section className="py-20 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-5" />
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-emerald-500/20 rounded-full blur-[150px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
              Connecting Africa to <span className="text-gradient">Fair & Timely Pay</span>
            </h2>
            <p className="text-slate-400 text-lg">Real numbers, real impact</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatedStatCard value="50000" label="Targeted Customers" icon={Users} suffix="+" />
            <AnimatedStatCard value="500" label="Targeted Companies" icon={Building2} suffix="+" />
            <AnimatedStatCard value="2" label="Annual Advances (USD)" icon={Banknote} prefix="$" suffix="B+" />
            <AnimatedStatCard value="4" label="Countries" icon={Globe} suffix="" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 lg:py-32 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full text-sm font-semibold text-primary mb-6">
              <Heart className="w-4 h-4" />
              Customer Stories
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Voices from <span className="text-gradient">East Africa</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Real stories from workers and employers who've discovered financial freedom with EaziWage.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border border-slate-100 dark:border-slate-700 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-8 leading-relaxed text-lg">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">{testimonial.avatar.slice(0,2)}</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{testimonial.author}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                    <p className="text-xs text-primary">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Countries */}
      <section className="py-24 lg:py-32 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full text-sm font-semibold text-primary mb-6">
              <Globe className="w-4 h-4" />
              Coverage
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Serving <span className="text-gradient">East Africa</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Available across 4 countries with seamless local mobile money integration.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {countries.map((country, index) => (
              <div key={index} className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-slate-100 dark:border-slate-700">
                <span className="text-6xl mb-6 block">{country.flag}</span>
                <h3 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-2">{country.name}</h3>
                <p className="text-primary font-bold text-lg mb-4">{country.users} users</p>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {country.providers.map((provider, i) => (
                    <span key={i} className="px-4 py-2 bg-white dark:bg-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                      {provider}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-slate-500">Currency: {country.currency}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-24 lg:py-32 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3">{faq.q}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
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

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-br from-primary via-emerald-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-white/10 rounded-full blur-[200px]" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8">
            Ready to take control of your earnings?
          </h2>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Join 50,000+ workers across East Africa who've discovered financial freedom with EaziWage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-lg rounded-2xl bg-white text-primary hover:bg-slate-100 shadow-xl btn-glow" data-testid="cta-get-started">
                Start For Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 text-lg rounded-2xl border-2 border-white/30 text-white hover:bg-white/10" data-testid="cta-contact">
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
