import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Twitter, Linkedin, Facebook, Instagram, Youtube, Mail, Phone, MapPin, 
  ArrowUpRight, Send, Globe
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

const footerLinks = {
  product: [
    { label: 'How it Works', href: '/how-it-works' },
    { label: 'For Employers', href: '/employers' },
    { label: 'For Employees', href: '/employees' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Calculator', href: '/calculator' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Partners', href: '/partners' },
    { label: 'Contact', href: '/contact' },
    { label: 'Blog', href: '/blog' },
    { label: 'FAQ', href: '/faq' },
  ],
  resources: [
    { label: 'Help Center', href: '/faq' },
    { label: 'Wage Calculator', href: '/calculator' },
    { label: 'Blog', href: '/blog' },
    { label: 'For Companies', href: '/employers' },
    { label: 'Get Started', href: '/register' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Data Policy', href: '/data-policy' },
    { label: 'ABC Policy', href: '/abc-policy' },
    { label: 'Code of Ethics', href: '/code-of-ethics' },
    { label: 'Gifts Policy', href: '/gifts-policy' },
    { label: 'AML & CFT Policy', href: '/aml-cft-policy' },
    { label: 'Whistleblowing Policy', href: '/whistleblowing-policy' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com/eaziwage', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com/company/eaziwage', label: 'LinkedIn' },
  { icon: Facebook, href: 'https://facebook.com/eaziwage', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com/eaziwage', label: 'Instagram' },
  { icon: Youtube, href: 'https://youtube.com/eaziwage', label: 'YouTube' },
];

export const Footer = () => {
  const navigate = useNavigate();

  const handleLinkClick = (href) => (e) => {
    e.preventDefault();
    navigate(href);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-slate-900 dark:bg-slate-950 text-slate-300 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid opacity-5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px]" />
      
      {/* Newsletter Section */}
      <div className="relative border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
                Stay updated with EaziWage
              </h3>
              <p className="text-slate-400 text-base sm:text-lg">
                Get the latest news, product updates, and financial tips delivered to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="h-12 sm:h-14 px-5 sm:px-6 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-xl flex-1"
              />
              <Button className="h-12 sm:h-14 px-6 sm:px-8 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 rounded-xl font-medium">
                <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="text-white font-bold text-xl sm:text-2xl">E</span>
              </div>
              <span className="font-heading font-bold text-xl sm:text-2xl text-white">EaziWage</span>
            </div>
            <p className="text-slate-400 mb-5 sm:mb-6 leading-relaxed text-sm sm:text-base">
              Empowering African workers with instant access to earned wages. 
              No loans, no interest — just financial freedom when you need it most.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((social, i) => (
                <a 
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 hover:bg-primary rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          <div>
            <h3 className="font-heading font-semibold text-white text-base sm:text-lg mb-4 sm:mb-5">Product</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href}
                    onClick={handleLinkClick(link.href)}
                    className="text-sm text-slate-400 hover:text-primary transition-colors duration-300 flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-white text-base sm:text-lg mb-4 sm:mb-5">Company</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href}
                    onClick={handleLinkClick(link.href)}
                    className="text-sm text-slate-400 hover:text-primary transition-colors duration-300 flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-white text-base sm:text-lg mb-4 sm:mb-5">Resources</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href}
                    onClick={handleLinkClick(link.href)}
                    className="text-sm text-slate-400 hover:text-primary transition-colors duration-300 flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-heading font-semibold text-white text-base sm:text-lg mb-4 sm:mb-5">Contact</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <a href="mailto:hello@eaziwage.com" className="flex items-center gap-3 text-slate-400 hover:text-primary transition-colors duration-300">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm">hello@eaziwage.com</span>
                </a>
              </li>
              <li>
                <a href="tel:+254723154900" className="flex items-center gap-3 text-slate-400 hover:text-primary transition-colors duration-300">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm">+254 72 315 4900</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm">Westlands Business Park<br />Nairobi, Kenya</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Legal Links Section */}
      <div className="relative border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col items-center gap-4">
            <h4 className="font-heading font-semibold text-white text-sm">Legal & Compliance</h4>
            <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 gap-y-2">
              {footerLinks.legal.map((link) => (
                <a 
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick(link.href)}
                  className="text-xs sm:text-sm text-slate-500 hover:text-primary transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <p className="text-xs sm:text-sm text-slate-500">
                © {new Date().getFullYear()} EaziWage. All rights reserved.
              </p>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
                <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Kenya · Uganda · Tanzania · Rwanda</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
