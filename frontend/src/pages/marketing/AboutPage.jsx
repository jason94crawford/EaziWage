import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Heart, Target, Users, Globe, Award, Zap,
  Shield, Building2, TrendingUp, MapPin, Mail, Linkedin,
  ChevronRight, Star, CheckCircle2, Rocket, Eye, HandHeart,
  Quote
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { MarketingNav } from '../../components/layout/MarketingNav';
import { Footer } from '../../components/layout/Footer';

const stats = [
  { value: '50,000+', label: 'Target Workers', icon: Users },
  { value: '$2B+', label: 'Market Potential', icon: TrendingUp },
  { value: '4', label: 'Countries', icon: Globe },
  { value: '500+', label: 'Target Companies', icon: Building2 },
];

const values = [
  {
    icon: Heart,
    title: 'People First',
    description: 'Every decision we make starts with one question: How does this help workers achieve financial dignity? Our users aren\'t just customers—they\'re the reason we exist.',
  },
  {
    icon: Shield,
    title: 'Trust & Transparency',
    description: 'No hidden fees, no fine print, no surprises. We believe financial services should be clear, honest, and fair. What you see is what you get, always.',
  },
  {
    icon: Zap,
    title: 'Speed Matters',
    description: 'When you need money, you need it now. We\'ve built our entire platform around instant access because emergencies don\'t wait for business hours.',
  },
  {
    icon: Target,
    title: 'Local Focus',
    description: 'Built in Africa, for Africa. We understand the unique challenges of working life in East Africa because we live here too.',
  },
];

const founders = [
  {
    name: 'Jason C',
    role: 'Co-Founder & CEO',
    quote: "As a business owner, I witnessed the stress financial delays can bring to good people. We built EaziWage to create a bridge between effort and reward so that paydays reflect the rhythm of real life, not the limits of outdated systems.",
    avatar: 'JC',
    gradient: 'from-primary to-emerald-600'
  },
  {
    name: 'Mark K',
    role: 'Co-Founder & Lead Dev',
    quote: "Building this one was a process, but am glad we finally got to establish it. Eaziwage is here to change our perspectives on how payroll systems work. Trust is the new currency and advance payment is how it's earned.",
    avatar: 'MK',
    gradient: 'from-emerald-500 to-teal-600'
  },
  {
    name: 'Henry K',
    role: 'Co-Founder & CMO',
    quote: "At EaziWage, we're not just streamlining payments we're empowering connections, fostering trust, and driving success by making every transaction seamless, engaging, and impactful.",
    avatar: 'HK',
    gradient: 'from-teal-500 to-primary'
  },
  {
    name: 'Joel O',
    role: 'Co-Founder & Backend Dev',
    quote: "We are building more than just a payment platform we are creating a bridge of trust. One that supports growth, accelerates timelines, reduces cancellations, and brings professionalism to every transaction.",
    avatar: 'JO',
    gradient: 'from-primary to-emerald-500'
  },
];

const timeline = [
  { year: '2025', title: 'Founded', description: 'EaziWage was founded with a vision to eliminate predatory payday loans across Africa and empower workers with financial freedom.' },
  { year: 'Jan 2026', title: 'MVP Developed', description: 'Completed our minimum viable product with core wage access functionality and mobile money integration.' },
  { year: 'Feb 2026', title: 'Alpha Testing', description: 'Launched alpha testing with select employers and employees to validate our product-market fit.' },
  { year: 'Apr 2026', title: 'Product Launch', description: 'Official product launch in Kenya, bringing earned wage access to workers across the country.' },
  { year: 'May 2026', title: 'Seed Raise', description: 'Raised $1M seed round to accelerate growth, expand our team, and scale operations across East Africa.' },
  { year: '2027', title: 'Expansion & The Future', description: 'Regional expansion across Uganda, Tanzania, and Rwanda. Building the infrastructure for on-demand pay across Africa.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <MarketingNav />
      
      {/* Hero */}
      <section className="pt-28 sm:pt-32 pb-16 sm:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-20 right-0 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-emerald-500/10 rounded-full blur-[150px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full text-sm font-semibold text-primary mb-6 sm:mb-8">
              <Heart className="w-4 h-4" />
              Our Story
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 sm:mb-8 leading-tight">
              Building Financial 
              <br />
              <span className="text-gradient">Freedom for Africa</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              We started EaziWage because we saw hardworking people trapped by the payday cycle — 
              forced into expensive loans just to cover emergencies. We knew there had to be a better way.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 sm:py-20 bg-slate-900 dark:bg-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-16">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-primary/20 transition-colors">
                  <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-1 sm:mb-2">{stat.value}</p>
                <p className="text-sm sm:text-base text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Mission */}
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-16 sm:w-24 h-16 sm:h-24 bg-primary/10 rounded-3xl" />
              <div className="relative bg-slate-50 dark:bg-slate-800 rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Rocket className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
                </div>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-4 sm:mb-6">
                  To give every worker in Africa the power to access their earned wages when they need it most — 
                  not when their employer's payroll calendar allows.
                </p>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                  We believe financial stress shouldn't define working life. That a nurse shouldn't have to borrow 
                  at 30% interest to pay a hospital bill. That a driver shouldn't skip meals while waiting for payday.
                </p>
              </div>
            </div>
            
            {/* Vision */}
            <div className="relative lg:mt-12">
              <div className="absolute -bottom-4 -right-4 w-16 sm:w-24 h-16 sm:h-24 bg-emerald-500/10 rounded-3xl" />
              <div className="relative bg-slate-50 dark:bg-slate-800 rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Eye className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Our Vision</h2>
                </div>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-4 sm:mb-6">
                  A world where every African worker has real-time access to their earnings. Where payday loans 
                  are obsolete. Where financial freedom is the default, not the exception.
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 dark:bg-primary/20 text-primary rounded-full text-xs sm:text-sm font-medium">Zero Interest</span>
                  <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 dark:bg-primary/20 text-primary rounded-full text-xs sm:text-sm font-medium">Instant Access</span>
                  <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 dark:bg-primary/20 text-primary rounded-full text-xs sm:text-sm font-medium">No Credit Checks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full text-sm font-semibold text-primary mb-4 sm:mb-6">
              <HandHeart className="w-4 h-4" />
              Core Values
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
              What We <span className="text-gradient">Stand For</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              The principles that guide every decision we make
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {values.map((value, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group">
                <div className="flex items-start gap-4 sm:gap-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0 group-hover:scale-110 transition-transform">
                    <value.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3">{value.title}</h3>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
              Our <span className="text-gradient">Journey</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
              From idea to East Africa's emerging EWA platform
            </p>
          </div>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 sm:left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-emerald-500 to-teal-500 transform md:-translate-x-1/2" />
            
            <div className="space-y-8 sm:space-y-12">
              {timeline.map((item, i) => (
                <div key={i} className={`relative flex items-center gap-4 sm:gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Content */}
                  <div className={`flex-1 ml-14 sm:ml-20 md:ml-0 ${i % 2 === 0 ? 'md:pr-12 lg:md:pr-16 md:text-right' : 'md:pl-12 lg:md:pl-16'}`}>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                      <span className="inline-block px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary text-xs sm:text-sm font-bold rounded-full mb-2 sm:mb-3">{item.year}</span>
                      <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-1 sm:mb-2">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
                    </div>
                  </div>
                  
                  {/* Center dot */}
                  <div className="absolute left-6 sm:left-8 md:left-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-primary rounded-full ring-4 ring-primary/20 transform -translate-x-1/2 z-10" />
                  
                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
              Meet the <span className="text-gradient">Founders</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              The team behind EaziWage's mission to transform financial access in Africa
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {founders.map((founder, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group relative">
                {/* Quote icon */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                  <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-primary/20" />
                </div>
                
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${founder.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-white font-bold text-lg sm:text-xl">{founder.avatar}</span>
                  </div>
                  <div>
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{founder.name}</h3>
                    <p className="text-primary font-medium text-sm sm:text-base">{founder.role}</p>
                  </div>
                </div>
                
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  "{founder.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Careers CTA */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-primary via-emerald-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute top-0 right-0 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-white/10 rounded-full blur-[200px]" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Join Our Mission
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/80 mb-8 sm:mb-10 max-w-2xl mx-auto">
            We're building the future of work in Africa. If you're passionate about financial inclusion, 
            we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 rounded-2xl bg-white text-primary hover:bg-slate-100 shadow-xl">
                Get In Touch
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 rounded-2xl border-white/30 text-white hover:bg-white/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
