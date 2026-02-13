import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Heart, Target, Users, Globe, Award, Zap,
  Shield, Building2, TrendingUp, MapPin, Mail, Linkedin,
  ChevronRight, Star, CheckCircle2, Rocket, Eye, HandHeart
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { MarketingNav } from '../../components/layout/MarketingNav';
import { Footer } from '../../components/layout/Footer';

const stats = [
  { value: '50,000+', label: 'Active Workers', icon: Users },
  { value: '$2B+', label: 'Disbursed', icon: TrendingUp },
  { value: '4', label: 'Countries', icon: Globe },
  { value: '500+', label: 'Partner Companies', icon: Building2 },
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

const team = [
  {
    name: 'Daniel Kimani',
    role: 'CEO & Co-Founder',
    bio: 'Former fintech lead in mobile financial services. 15+ years experience building products that serve millions across Africa.',
    avatar: 'DK'
  },
  {
    name: 'Amara Okonkwo',
    role: 'CTO & Co-Founder',
    bio: 'Ex-Google engineer with expertise in building payment systems that process billions of dollars annually.',
    avatar: 'AO'
  },
  {
    name: 'Grace Wanjiru',
    role: 'Chief People Officer',
    bio: 'HR transformation expert who previously led talent initiatives at major African financial institutions.',
    avatar: 'GW'
  },
  {
    name: 'Samuel Osei',
    role: 'VP Engineering',
    bio: 'Infrastructure architect specializing in high-availability financial systems and secure payment processing.',
    avatar: 'SO'
  },
  {
    name: 'Fatima Hassan',
    role: 'VP Product',
    bio: 'Product leader passionate about financial inclusion and building technology that empowers underserved communities.',
    avatar: 'FH'
  },
  {
    name: 'Peter Njoroge',
    role: 'VP Partnerships',
    bio: 'Business development expert with deep networks across East African enterprises and financial institutions.',
    avatar: 'PN'
  },
];

const timeline = [
  { year: '2021', title: 'Founded', description: 'EaziWage launched in Nairobi with a vision to eliminate predatory payday loans across Africa.' },
  { year: '2022', title: 'Series A', description: 'Raised $5M to expand across Kenya. Reached 10,000 active users and processed our first million.' },
  { year: '2023', title: 'Regional Expansion', description: 'Launched in Uganda and Tanzania. Processed $500M in wage advances. Partnered with 200+ companies.' },
  { year: '2024', title: 'Series B', description: 'Raised $15M from top African and global investors. Expanded to Rwanda. Reached 50,000 users.' },
  { year: '2025', title: 'The Future', description: 'Building the infrastructure for on-demand pay across the entire African continent.' },
];

const investors = ['Partech Africa', 'TLcom Capital', 'Founders Factory', 'Y Combinator', 'IFC'];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <MarketingNav />
      
      {/* Hero */}
      <section className="pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full text-sm font-semibold text-primary mb-8">
              <Heart className="w-4 h-4" />
              Our Story
            </div>
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-8 leading-tight">
              Building Financial 
              <br />
              <span className="text-gradient">Freedom for Africa</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              We started EaziWage because we saw hardworking people trapped by the payday cycle — 
              forced into expensive loans just to cover emergencies. We knew there had to be a better way.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-20 bg-slate-900 dark:bg-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <p className="text-4xl sm:text-5xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Mission */}
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-3xl" />
              <div className="relative bg-slate-50 dark:bg-slate-800 rounded-3xl p-10 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Rocket className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="font-heading text-3xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
                </div>
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  To give every worker in Africa the power to access their earned wages when they need it most — 
                  not when their employer's payroll calendar allows.
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  We believe financial stress shouldn't define working life. That a nurse shouldn't have to borrow 
                  at 30% interest to pay a hospital bill. That a driver shouldn't skip meals while waiting for payday.
                </p>
              </div>
            </div>
            
            {/* Vision */}
            <div className="relative lg:mt-12">
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500/10 rounded-3xl" />
              <div className="relative bg-slate-50 dark:bg-slate-800 rounded-3xl p-10 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Eye className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="font-heading text-3xl font-bold text-slate-900 dark:text-white">Our Vision</h2>
                </div>
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  A world where every African worker has real-time access to their earnings. Where payday loans 
                  are obsolete. Where financial freedom is the default, not the exception.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-primary/10 dark:bg-primary/20 text-primary rounded-full text-sm font-medium">Zero Interest</span>
                  <span className="px-4 py-2 bg-primary/10 dark:bg-primary/20 text-primary rounded-full text-sm font-medium">Instant Access</span>
                  <span className="px-4 py-2 bg-primary/10 dark:bg-primary/20 text-primary rounded-full text-sm font-medium">No Credit Checks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full text-sm font-semibold text-primary mb-6">
              <HandHeart className="w-4 h-4" />
              Core Values
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              What We <span className="text-gradient">Stand For</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              The principles that guide every decision we make
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0 group-hover:scale-110 transition-transform">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-3">{value.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Our <span className="text-gradient">Journey</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              From a Nairobi startup to East Africa's leading EWA platform
            </p>
          </div>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-emerald-500 to-teal-500 transform md:-translate-x-1/2" />
            
            <div className="space-y-12">
              {timeline.map((item, i) => (
                <div key={i} className={`relative flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Content */}
                  <div className={`flex-1 ml-20 md:ml-0 ${i % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                      <span className="inline-block px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary text-sm font-bold rounded-full mb-3">{item.year}</span>
                      <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400">{item.description}</p>
                    </div>
                  </div>
                  
                  {/* Center dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-primary rounded-full ring-4 ring-primary/20 transform -translate-x-1/2 z-10" />
                  
                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Meet Our <span className="text-gradient">Leadership</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              A team of fintech veterans, engineers, and operators united by a common mission
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-xl">{member.avatar}</span>
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">{member.name}</h3>
                    <p className="text-primary font-medium">{member.role}</p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{member.bio}</p>
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <a href="#" className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors">
                    <Linkedin className="w-5 h-5" />
                    <span className="text-sm font-medium">Connect on LinkedIn</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investors */}
      <section className="py-20 bg-white dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 mb-10 uppercase tracking-wider">
            Backed by World-Class Investors
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8">
            {investors.map((investor) => (
              <div 
                key={investor} 
                className="text-2xl font-bold text-slate-300 dark:text-slate-600 hover:text-primary dark:hover:text-primary transition-colors duration-300 cursor-default"
              >
                {investor}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Careers CTA */}
      <section className="py-24 bg-gradient-to-br from-primary via-emerald-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[200px]" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-6">
            Join Our Mission
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            We're building the future of work in Africa. If you're passionate about financial inclusion, 
            we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/careers">
              <Button size="lg" className="h-14 px-10 rounded-2xl bg-white text-primary hover:bg-slate-100 shadow-xl">
                View Open Positions
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl border-white/30 text-white hover:bg-white/10">
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
