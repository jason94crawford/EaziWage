import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Heart, Target, Users, Globe, Award, Zap,
  Shield, Building2, TrendingUp, MapPin, Mail, Linkedin,
  ChevronRight, Star, CheckCircle2
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
    description: 'Every decision we make starts with one question: How does this help workers achieve financial dignity?',
    color: 'from-primary to-emerald-600'
  },
  {
    icon: Shield,
    title: 'Trust & Transparency',
    description: 'No hidden fees, no fine print. We believe financial services should be clear, honest, and fair.',
    color: 'from-emerald-600 to-teal-600'
  },
  {
    icon: Zap,
    title: 'Speed Matters',
    description: 'When you need money, you need it now. We\'ve built our entire platform around instant access.',
    color: 'from-teal-600 to-primary'
  },
  {
    icon: Target,
    title: 'Local Focus',
    description: 'Built in Africa, for Africa. We understand the unique challenges of working life in East Africa.',
    color: 'from-primary to-emerald-500'
  },
];

const team = [
  {
    name: 'Daniel Kimani',
    role: 'CEO & Co-Founder',
    bio: 'Former fintech lead in mobile financial services. 15+ years experience across Africa.',
    avatar: 'DK'
  },
  {
    name: 'Amara Okonkwo',
    role: 'CTO & Co-Founder',
    bio: 'Ex-Google engineer. Built payment systems processing billions of dollars annually.',
    avatar: 'AO'
  },
  {
    name: 'Grace Wanjiru',
    role: 'Chief People Officer',
    bio: 'HR transformation expert. Previously led talent at Equity Bank serving 14M customers.',
    avatar: 'GW'
  },
  {
    name: 'Samuel Osei',
    role: 'VP Engineering',
    bio: 'Infrastructure architect from Flutterwave. Specialist in high-availability financial systems.',
    avatar: 'SO'
  },
  {
    name: 'Fatima Hassan',
    role: 'VP Product',
    bio: 'Product leader from Branch International. Passionate about financial inclusion.',
    avatar: 'FH'
  },
  {
    name: 'Peter Njoroge',
    role: 'VP Partnerships',
    bio: 'Business development expert with deep networks across East African enterprises.',
    avatar: 'PN'
  },
];

const timeline = [
  { year: '2021', title: 'Founded', description: 'EaziWage launched in Nairobi with a vision to eliminate payday loans' },
  { year: '2022', title: 'Series A', description: 'Raised $5M to expand across Kenya. Hit 10,000 active users.' },
  { year: '2023', title: 'Regional Expansion', description: 'Launched in Uganda and Tanzania. Processed KES 500M in advances.' },
  { year: '2024', title: 'Series B', description: 'Raised $15M. Expanded to Rwanda. Reached 50,000 users.' },
  { year: '2025', title: 'The Future', description: 'Building the infrastructure for on-demand pay across Africa.' },
];

const investors = ['Partech Africa', 'TLcom Capital', 'Founders Factory', 'Y Combinator', 'IFC'];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <MarketingNav />
      
      {/* Hero */}
      <section className="pt-32 pb-24 relative overflow-hidden bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]" />
        
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

      {/* Stats */}
      <section className="py-20 bg-slate-900 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-7 h-7 text-primary" />
                </div>
                <p className="text-4xl sm:text-5xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-heading text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                Our <span className="text-gradient">Mission</span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                To give every worker in Africa the power to access their earned wages when they need it most — 
                not when their employer's payroll calendar allows.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                We believe financial stress shouldn't define working life. That a nurse shouldn't have to borrow 
                at 30% interest to pay a hospital bill. That a driver shouldn't skip meals while waiting for payday. 
                That dignity should come standard with every paycheck.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">Zero Interest</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">Instant Access</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">No Credit Checks</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-emerald-500/20 rounded-3xl p-8 lg:p-12">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl flex items-center justify-center">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="font-heading text-xl font-bold text-slate-900 dark:text-white">Our Vision</p>
                      <p className="text-slate-500">2030 and beyond</p>
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    A world where every African worker has real-time access to their earnings. 
                    Where payday loans are obsolete. Where financial freedom is the default, not the exception.
                  </p>
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
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              What We <span className="text-gradient">Stand For</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              The principles that guide every decision we make
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className={`w-14 h-14 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white mb-3">{value.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{value.description}</p>
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
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-emerald-500 to-teal-500 transform -translate-x-1/2 hidden md:block" />
            <div className="space-y-12">
              {timeline.map((item, i) => (
                <div key={i} className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  <div className={`flex-1 ${i % 2 === 1 ? 'md:text-left' : 'md:text-right'}`}>
                    <div className={`bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 ${i % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                      <span className="text-sm font-bold text-primary">{item.year}</span>
                      <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white mt-1 mb-2">{item.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400">{item.description}</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-primary rounded-full ring-4 ring-primary/20 z-10 hidden md:block" />
                  <div className="flex-1" />
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
      <section className="py-16 bg-white dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 mb-10 uppercase tracking-wider">
            Backed by World-Class Investors
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8">
            {investors.map((investor) => (
              <div 
                key={investor} 
                className="text-2xl font-bold text-slate-300 dark:text-slate-600 hover:text-primary dark:hover:text-primary transition-colors duration-300"
              >
                {investor}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Careers CTA */}
      <section className="py-24 bg-slate-900 dark:bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[200px]" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-6">
            Join Our Mission
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            We're building the future of work in Africa. If you're passionate about financial inclusion, 
            we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/careers">
              <Button size="lg" className="h-14 px-10 rounded-2xl bg-gradient-to-r from-primary to-emerald-600 text-white">
                View Open Positions
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl border-slate-700 text-white hover:bg-slate-800">
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
