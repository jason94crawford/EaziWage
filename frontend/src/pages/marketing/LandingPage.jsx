import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Check, Zap, Shield, Clock, Building2, Users, 
  CreditCard, BarChart3, Phone, ChevronRight, Globe, 
  Smartphone, DollarSign, Lock
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { MarketingNav } from '../../components/layout/MarketingNav';
import { Footer } from '../../components/layout/Footer';

const heroImage = "https://images.unsplash.com/photo-1758519291531-e96279895745?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODl8MHwxfHNlYXJjaHwyfHxBZnJpY2FuJTIwcHJvZmVzc2lvbmFsJTIwaGFwcHklMjBzbWlsaW5nJTIwb2ZmaWNlfGVufDB8fHx8MTc3MDk3NjM5MHww&ixlib=rb-4.1.0&q=85";
const mobileImage = "https://images.unsplash.com/photo-1637094411262-3d6072496372?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzV8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwY2xvc2UlMjB1cCUyMGhhbmR8ZW58MHx8fHwxNzcwOTc2Mzk5fDA&ixlib=rb-4.1.0&q=85";
const teamImage = "https://images.unsplash.com/photo-1769740333462-9a63bfa914bc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwzfHxjb3Jwb3JhdGUlMjBtZWV0aW5nJTIwcm9vbSUyMGRpdmVyc2UlMjBwZW9wbGV8ZW58MHx8fHwxNzcwOTc2NDAxfDA&ixlib=rb-4.1.0&q=85";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-gradient-to-br from-primary-50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="stagger-children">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                DISRUPTIVE EARNED WAGE ACCESS
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                Payday in{' '}
                <span className="text-primary">Your Pocket.</span>
                <br />
                No Loans.<br />
                No Interest.
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-lg">
                Stop cash-flow stress between pay cycles. Access a portion of wages you&apos;ve already earned, 
                with employer controls and automatic settlement on payday.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-primary text-white hover:bg-primary/90 h-12 px-8" data-testid="hero-get-started">
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/employers">
                  <Button size="lg" variant="outline" className="h-12 px-8" data-testid="hero-for-employers">
                    For Employers
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white text-xs font-bold">
                    App
                  </div>
                  <span className="text-sm text-slate-500">GET IT ON App Store</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white text-xs">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/></svg>
                  </div>
                  <span className="text-sm text-slate-500">GET IT ON Google Play</span>
                </div>
              </div>
            </div>
            
            {/* Hero Visual */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium text-slate-900">Checkout</span>
                  <div className="w-8 h-8 bg-primary/10 rounded-full"></div>
                </div>
                <div className="mb-4">
                  <span className="text-xs text-slate-500 uppercase tracking-wide">PAY TO EAZIWAGE</span>
                  <p className="text-3xl font-bold text-slate-900">KES 4,500</p>
                </div>
                <div className="mb-4">
                  <span className="text-xs text-slate-500 uppercase tracking-wide">PAYMENT METHOD</span>
                  <div className="flex items-center gap-3 mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">M</div>
                    <div>
                      <p className="font-medium text-slate-900">M-PESA</p>
                      <p className="text-sm text-slate-500">STK Push</p>
                    </div>
                    <Check className="w-5 h-5 text-primary ml-auto" />
                  </div>
                </div>
                <Button className="w-full bg-primary text-white hover:bg-primary/90 h-11">
                  Pay now
                </Button>
                <div className="flex items-center gap-2 mt-4 text-sm">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="text-slate-500">PROCESSING SPEED</span>
                  <span className="font-semibold text-slate-900">&lt; 3 Seconds</span>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Financial peace fuels great performance.
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Transparent, secure, and built for your financial freedom.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: 'Instant disbursement',
                description: 'Funds available within minutes through mobile money or bank transfer.'
              },
              {
                icon: Shield,
                title: 'Bank-grade security',
                description: 'Strong encryption to keep financial data and transactions secure.'
              },
              {
                icon: Globe,
                title: 'Compliance-first',
                description: 'Designed to align with local financial and data regulations.'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg hover:border-slate-300 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                How EaziWage works
              </h2>
              <div className="space-y-8">
                {[
                  { step: '01', title: 'Your employer signs up', description: 'Company registers and integrates payroll data with EaziWage.' },
                  { step: '02', title: 'Complete your profile', description: 'Verify your identity and link your mobile money or bank account.' },
                  { step: '03', title: 'Access earned wages', description: 'Request up to 50% of wages you\'ve already earned.' },
                  { step: '04', title: 'Automatic repayment', description: 'Amount is deducted from your next paycheck. No hassle.' }
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center font-bold shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-slate-900 mb-1">{item.title}</h3>
                      <p className="text-slate-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img 
                src={mobileImage}
                alt="Mobile app usage"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Advance approved</p>
                    <p className="font-semibold text-slate-900">KES 5,000 sent</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Employers */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src={teamImage}
                alt="Team collaboration"
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                <Building2 className="w-4 h-4" />
                FOR EMPLOYERS
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                Empower your workforce. Zero cost to you.
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Offer earned wage access as a benefit at no cost. Improve employee retention, 
                reduce absenteeism, and boost productivity.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  'No cost to implement or maintain',
                  'Simple payroll integration',
                  'Full visibility and control',
                  'Dedicated account manager'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>
              <Link to="/register?role=employer">
                <Button size="lg" className="bg-primary text-white hover:bg-primary/90" data-testid="employer-cta">
                  Register as Employer
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Countries */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
              Serving East Africa
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Currently operating in Kenya, Uganda, Tanzania, and Rwanda with plans to expand across Africa.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { country: 'Kenya', flag: '🇰🇪', currency: 'KES', providers: 'M-PESA, Airtel' },
              { country: 'Uganda', flag: '🇺🇬', currency: 'UGX', providers: 'MTN, Airtel' },
              { country: 'Tanzania', flag: '🇹🇿', currency: 'TZS', providers: 'M-PESA, Tigo' },
              { country: 'Rwanda', flag: '🇷🇼', currency: 'RWF', providers: 'MTN, Airtel' }
            ].map((item, index) => (
              <div key={index} className="bg-slate-800 rounded-xl p-6 text-center">
                <span className="text-4xl mb-4 block">{item.flag}</span>
                <h3 className="font-heading text-xl font-semibold mb-2">{item.country}</h3>
                <p className="text-slate-400 text-sm mb-2">{item.currency}</p>
                <p className="text-slate-500 text-xs">{item.providers}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to start?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Launch earned wage access with confidence. Transparent fees, instant disbursement, 
            employer controls, and payday settlement—no loans.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-slate-100 h-12 px-8" data-testid="cta-get-started">
                Get started
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 h-12 px-8" data-testid="cta-schedule-demo">
                Schedule a demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
