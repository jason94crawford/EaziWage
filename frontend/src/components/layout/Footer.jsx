import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Facebook, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="font-heading font-bold text-xl text-white">EaziWage</span>
            </div>
            <p className="text-sm text-slate-400 mb-6">
              Disruptive earned wage access for employees across East Africa. 
              No loans. No interest. Just your money, when you need it.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link to="/how-it-works" className="text-slate-400 hover:text-white transition-colors duration-200">How it Works</Link></li>
              <li><Link to="/employers" className="text-slate-400 hover:text-white transition-colors duration-200">For Employers</Link></li>
              <li><Link to="/pricing" className="text-slate-400 hover:text-white transition-colors duration-200">Pricing</Link></li>
              <li><Link to="/resources" className="text-slate-400 hover:text-white transition-colors duration-200">Resources</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/company" className="text-slate-400 hover:text-white transition-colors duration-200">About Us</Link></li>
              <li><Link to="/careers" className="text-slate-400 hover:text-white transition-colors duration-200">Careers</Link></li>
              <li><Link to="/partners" className="text-slate-400 hover:text-white transition-colors duration-200">Partners</Link></li>
              <li><Link to="/contact" className="text-slate-400 hover:text-white transition-colors duration-200">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:support@eaziwage.com" className="text-slate-400 hover:text-white transition-colors duration-200">
                  support@eaziwage.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>+254 700 000 000</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-1" />
                <span>Nairobi, Kenya</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} EaziWage. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="text-slate-500 hover:text-white transition-colors duration-200">Privacy Policy</Link>
            <Link to="/terms" className="text-slate-500 hover:text-white transition-colors duration-200">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
