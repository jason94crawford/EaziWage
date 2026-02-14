import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Handshake, Building2, Globe, Zap, Shield, 
  TrendingUp, Award, Check, ChevronRight, Users, Banknote,
  Phone, Mail, Star
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { MarketingNav } from '../../components/layout/MarketingNav';
import { Footer } from '../../components/layout/Footer';

const partnerTypes = [
  {
    icon: Building2,
    title: 'Employers',
    description: 'Offer EaziWage as a workplace benefit at zero cost. Boost employee satisfaction and reduce turnover.',
    benefits: ['Free implementation', 'Dedicated support', 'Custom branding available'],
    cta: 'Register as Employer',
    link: '/register?role=employer',
    color: 'from-primary to-emerald-600'
  },
  {
    icon: Banknote,
    title: 'Payroll Providers',
    description: 'Integrate EaziWage directly into your payroll platform. Add EWA to your product offering.',
    benefits: ['API integration', 'Revenue share', 'White-label options'],
    cta: 'Become a Partner',
    link: '/contact?type=payroll',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    icon: Globe,
    title: 'Financial Institutions',
    description: 'Partner with us to expand your financial inclusion initiatives and reach underserved markets.',
    benefits: ['Co-branded solutions', 'Data insights', 'Shared distribution'],
    cta: 'Explore Partnership',
    link: '/contact?type=financial',
    color: 'from-teal-500 to-primary'
  },
  {
    icon: Users,
    title: 'HR Consultants',
    description: 'Recommend EaziWage to your clients and earn referral commissions on successful implementations.',
    benefits: ['Referral commissions', 'Training & resources', 'Partner portal access'],
    cta: 'Join Referral Program',
    link: '/contact?type=referral',
    color: 'from-primary to-emerald-500'
  },
];

const currentPartners = [
  { 
    name: 'Safaricom', 
    type: 'Mobile Money', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Safaricom_Logo.svg/320px-Safaricom_Logo.svg.png',
    bgColor: 'bg-white'
  },
  { 
    name: 'KCB Bank', 
    type: 'Banking', 
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/93/KCB_Group_Logo.svg/320px-KCB_Group_Logo.svg.png',
    bgColor: 'bg-white'
  },
  { 
    name: 'Equity Bank', 
    type: 'Banking', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Equity_Bank_Logo.svg/320px-Equity_Bank_Logo.svg.png',
    bgColor: 'bg-white'
  },
  { 
    name: 'MTN', 
    type: 'Mobile Money', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/New-mtn-logo.svg/320px-New-mtn-logo.svg.png',
    bgColor: 'bg-[#FFCC00]'
  },
  { 
    name: 'Twiga Foods', 
    type: 'Employer', 
    logo: 'https://twiga.com/wp-content/uploads/2023/04/twiga-foods-logo.svg',
    bgColor: 'bg-white'
  },
  { 
    name: 'Jumia', 
    type: 'Employer', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Jumia.svg/320px-Jumia.svg.png',
    bgColor: 'bg-white'
  },
  { 
    name: 'Glovo', 
    type: 'Employer', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Glovo_app_logo.svg/320px-Glovo_app_logo.svg.png',
    bgColor: 'bg-[#FFC244]'
  },
  { 
    name: 'Bolt', 
    type: 'Employer', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Bolt_logo.svg/320px-Bolt_logo.svg.png',
    bgColor: 'bg-[#34D186]'
  },
];

const stats = [
  { value: '500+', label: 'Partner Companies' },
  { value: '50K+', label: 'Workers Served' },
  { value: 'KES 2B+', label: 'Disbursed' },
  { value: '4', label: 'Countries' },
];

const benefits = [
  {
    icon: Zap,
    title: 'Instant Integration',
    description: 'Our API-first approach means you can be live in days, not months.'
  },
  {
    icon: Shield,
    title: 'Compliant & Secure',
    description: 'Bank-grade security and full regulatory compliance across all markets.'
  },
  {
    icon: TrendingUp,
    title: 'Proven Results',
    description: 'Partners see measurable improvements in employee retention and satisfaction.'
  },
  {
    icon: Award,
    title: 'Dedicated Support',
    description: 'Every partner gets a dedicated account manager and 24/7 technical support.'
  },
];

const testimonials = [
  {
    quote: "Integrating EaziWage into our payroll platform was seamless. Our clients love having EWA as an option, and it's become a key differentiator for us.",
    author: "Sarah Okonkwo",
    role: "CEO",
    company: "PayrollPro Kenya",
    avatar: "SO"
  },
  {
    quote: "The partnership model is genuinely win-win. EaziWage's team is responsive, the technology is solid, and our employees are happier.",
    author: "James Mwangi",
    role: "HR Director",
    company: "Twiga Foods",
    avatar: "JM"
  },
];

const integrationSteps = [
  { num: '01', title: 'Connect', description: 'Sign partnership agreement and get API credentials' },
  { num: '02', title: 'Integrate', description: 'Use our APIs and SDKs to connect your systems' },
  { num: '03', title: 'Test', description: 'Validate the integration in our sandbox environment' },
  { num: '04', title: 'Launch', description: 'Go live with EaziWage for your users' },
];

export default function PartnersPage() {
  const navigate = useNavigate();

  const handleNavClick = (href) => (e) => {
    e.preventDefault();
    navigate(href);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <MarketingNav />
      
      {/* Hero */}
      <section className="pt-28 sm:pt-32 pb-16 sm:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-20 right-0 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-primary/10 rounded-full blur-[150px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full text-sm font-semibold text-primary mb-6 sm:mb-8">
              <Handshake className="w-4 h-4" />
              Partner Ecosystem
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
              Grow With <span className="text-gradient">EaziWage</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 sm:mb-10">
              Join our partner ecosystem and help transform how African workers access their earnings. 
              Multiple partnership models to fit your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a href="/contact?type=partnership" onClick={handleNavClick('/contact?type=partnership')}>
                <Button size="lg" className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 rounded-2xl bg-gradient-to-r from-primary to-emerald-600 text-white shadow-lg">
                  Become a Partner
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </a>
              <a href="/register?role=employer" onClick={handleNavClick('/register?role=employer')}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 rounded-2xl border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800">
                  Register as Employer
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 sm:py-16 bg-slate-900 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-1 sm:mb-2">{stat.value}</p>
                <p className="text-sm sm:text-base text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
              Partnership <span className="text-gradient">Opportunities</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Whether you're an employer, payroll provider, or financial institution — there's a partnership model for you
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {partnerTypes.map((type, i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-500 group">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${type.color} rounded-2xl flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <type.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3">{type.title}</h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-5 sm:mb-6 leading-relaxed">{type.description}</p>
                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  {type.benefits.map((benefit, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                      <div className="w-5 h-5 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <a href={type.link} onClick={handleNavClick(type.link)}>
                  <Button className="w-full h-11 sm:h-12 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100">
                    {type.cta}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Partners with Logos */}
      <section className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
              Trusted by <span className="text-gradient">Industry Leaders</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
              Join these companies transforming financial access in East Africa
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {currentPartners.map((partner, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 text-center border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all group">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 ${partner.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 p-2 sm:p-3 overflow-hidden`}>
                  <img 
                    src={partner.logo} 
                    alt={`${partner.name} logo`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <span 
                    className="text-xl sm:text-2xl font-bold text-primary hidden items-center justify-center"
                    style={{ display: 'none' }}
                  >
                    {partner.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">{partner.name}</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{partner.type}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Partner */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-5 sm:mb-6">
                Why Partner With <span className="text-gradient">EaziWage</span>?
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-6 sm:mb-8 leading-relaxed">
                We've built the most trusted earned wage access platform in East Africa. 
                Our partners benefit from proven technology, dedicated support, and a shared mission to empower workers.
              </p>
              <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3 sm:gap-4">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white mb-1">{benefit.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-emerald-500/10 dark:from-primary/20 dark:to-emerald-500/20 rounded-3xl p-6 sm:p-8 lg:p-12">
              <div className="space-y-4 sm:space-y-6">
                {testimonials.map((t, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex gap-1 mb-3 sm:mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mb-3 sm:mb-4 italic">"{t.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-emerald-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs sm:text-sm">{t.avatar}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900 dark:text-white">{t.author}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}, {t.company}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Steps */}
      <section className="py-16 sm:py-24 bg-slate-900 dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
              Easy Integration Process
            </h2>
            <p className="text-base sm:text-lg text-slate-400">
              Get up and running with EaziWage in just a few steps
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {integrationSteps.map((step, i) => (
              <div key={i} className="relative text-center">
                {i < integrationSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4 shadow-lg shadow-primary/30">
                  {step.num}
                </div>
                <h3 className="font-heading text-base sm:text-lg font-bold text-white mb-1 sm:mb-2">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-primary via-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Ready to Partner?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/80 mb-8 sm:mb-10">
            Let's discuss how we can work together to empower African workers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a href="/contact?type=partnership" onClick={handleNavClick('/contact?type=partnership')}>
              <Button size="lg" className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 rounded-2xl bg-white text-primary hover:bg-slate-100">
                <Mail className="w-5 h-5 mr-2" />
                Contact Partnerships
              </Button>
            </a>
            <a href="/contact" onClick={handleNavClick('/contact')}>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 rounded-2xl border-white/30 text-white hover:bg-white/10">
                <Phone className="w-5 h-5 mr-2" />
                Schedule a Call
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
