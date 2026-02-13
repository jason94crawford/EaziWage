import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, Phone, MapPin, Clock, Send, Building2, Users, 
  HelpCircle, MessageSquare, ChevronRight, Globe, 
  Facebook, Twitter, Linkedin, Instagram
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { MarketingNav } from '../../components/layout/MarketingNav';
import { Footer } from '../../components/layout/Footer';

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Us',
    description: 'Get a response within 24 hours',
    value: 'hello@eaziwage.com',
    href: 'mailto:hello@eaziwage.com',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    icon: Phone,
    title: 'Call Us',
    description: 'Mon-Fri from 8am to 6pm EAT',
    value: '+254 700 000 000',
    href: 'tel:+254700000000',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    icon: MessageSquare,
    title: 'Live Chat',
    description: 'Available 24/7 for quick help',
    value: 'Start a conversation',
    href: '#chat',
    color: 'from-purple-500 to-pink-600'
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    description: 'Come say hello at our office',
    value: 'Westlands, Nairobi',
    href: '#location',
    color: 'from-amber-500 to-orange-600'
  },
];

const offices = [
  {
    country: 'Kenya',
    flag: '🇰🇪',
    city: 'Nairobi',
    address: 'Westlands Business Park, 4th Floor',
    phone: '+254 700 000 000',
    email: 'kenya@eaziwage.com',
    hours: '8:00 AM - 6:00 PM EAT'
  },
  {
    country: 'Uganda',
    flag: '🇺🇬',
    city: 'Kampala',
    address: 'Nakasero Business Centre, 2nd Floor',
    phone: '+256 700 000 000',
    email: 'uganda@eaziwage.com',
    hours: '8:00 AM - 6:00 PM EAT'
  },
  {
    country: 'Tanzania',
    flag: '🇹🇿',
    city: 'Dar es Salaam',
    address: 'Msasani Peninsula, Tower A',
    phone: '+255 700 000 000',
    email: 'tanzania@eaziwage.com',
    hours: '8:00 AM - 6:00 PM EAT'
  },
  {
    country: 'Rwanda',
    flag: '🇷🇼',
    city: 'Kigali',
    address: 'Kigali Heights, 3rd Floor',
    phone: '+250 700 000 000',
    email: 'rwanda@eaziwage.com',
    hours: '8:00 AM - 6:00 PM CAT'
  },
];

const inquiryTypes = [
  { value: 'general', label: 'General Inquiry', icon: HelpCircle },
  { value: 'employer', label: 'Employer Registration', icon: Building2 },
  { value: 'support', label: 'Customer Support', icon: Users },
  { value: 'partnership', label: 'Partnership Opportunity', icon: Globe },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    type: 'general',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <MarketingNav />
      
      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 bg-grid" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full text-sm font-semibold text-primary mb-8">
              <MessageSquare className="w-4 h-4" />
              Get in Touch
            </div>
            <h1 className="font-heading text-5xl sm:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              We'd Love to <span className="text-gradient">Hear From You</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Have questions about EaziWage? Want to register your company? 
              Our team is here to help you get started.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, i) => (
              <a 
                key={i}
                href={method.href}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <method.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white mb-1">{method.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{method.description}</p>
                <span className="text-primary font-medium flex items-center gap-2">
                  {method.value}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Form */}
            <div>
              <h2 className="font-heading text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Send Us a Message
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
              
              {submitted ? (
                <div className="bg-primary/10 dark:bg-primary/20 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Thank you for reaching out. We'll be in touch soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Inquiry Type */}
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                      What can we help you with?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {inquiryTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData({...formData, type: type.value})}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                            formData.type === type.value
                              ? 'border-primary bg-primary/5 dark:bg-primary/10'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <type.icon className={`w-5 h-5 ${formData.type === type.value ? 'text-primary' : 'text-slate-400'}`} />
                          <span className={`text-sm font-medium ${formData.type === type.value ? 'text-primary' : 'text-slate-600 dark:text-slate-400'}`}>
                            {type.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Email */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Full Name *</label>
                      <Input 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="John Doe"
                        className="h-12 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Email Address *</label>
                      <Input 
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="john@company.com"
                        className="h-12 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Phone & Company */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Phone Number</label>
                      <Input 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+254 700 000 000"
                        className="h-12 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Company Name</label>
                      <Input 
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        placeholder="Acme Corporation"
                        className="h-12 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Message *</label>
                    <textarea 
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Tell us how we can help..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full h-14 rounded-xl bg-gradient-to-r from-primary to-emerald-600 text-white">
                    Send Message
                    <Send className="w-5 h-5 ml-2" />
                  </Button>
                </form>
              )}
            </div>

            {/* Additional Info */}
            <div className="space-y-8">
              {/* FAQ Shortcut */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
                <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white mb-4">
                  Frequently Asked Questions
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Find quick answers to common questions about EaziWage.
                </p>
                <Link to="/faq">
                  <Button variant="outline" className="w-full rounded-xl">
                    View FAQs
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              {/* Business Hours */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">Business Hours</h3>
                    <p className="text-sm text-slate-500">East Africa Time (EAT)</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Monday - Friday</span>
                    <span className="font-medium text-slate-900 dark:text-white">8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Saturday</span>
                    <span className="font-medium text-slate-900 dark:text-white">9:00 AM - 1:00 PM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Sunday</span>
                    <span className="font-medium text-slate-500">Closed</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    <span className="text-primary font-medium">24/7 Support</span> available via live chat for urgent issues
                  </p>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Connect With Us
                </h3>
                <div className="flex gap-3">
                  {[
                    { icon: Facebook, href: '#', label: 'Facebook' },
                    { icon: Twitter, href: '#', label: 'Twitter' },
                    { icon: Linkedin, href: '#', label: 'LinkedIn' },
                    { icon: Instagram, href: '#', label: 'Instagram' },
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      aria-label={social.label}
                      className="w-12 h-12 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary hover:shadow-lg transition-all duration-300"
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-24 bg-slate-900 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-white mb-4">
              Our <span className="text-gradient">Offices</span>
            </h2>
            <p className="text-lg text-slate-400">
              Find us across East Africa
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {offices.map((office, i) => (
              <div key={i} className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{office.flag}</span>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-white">{office.country}</h3>
                    <p className="text-sm text-slate-400">{office.city}</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <p className="text-slate-300">{office.address}</p>
                  <p className="text-slate-400">
                    <span className="text-primary">{office.phone}</span>
                  </p>
                  <p className="text-slate-400">{office.email}</p>
                  <p className="text-slate-500 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {office.hours}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section id="location" className="h-96 bg-slate-200 dark:bg-slate-800 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">Interactive Map</p>
            <p className="text-sm text-slate-400 dark:text-slate-500">Westlands Business Park, Nairobi</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
