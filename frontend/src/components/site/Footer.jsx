import React from 'react';
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';
import { footerLinks } from '../../mock';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="text-gray-300" style={{ backgroundColor: '#1c1c1c' }}>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-14 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="bg-white p-3 rounded-md inline-block">
            <Logo />
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            TruckingOffice provides easy and affordable trucking management software and ELD
            solutions for owner operators and fleet builders.
          </p>
          <div className="flex gap-3 mt-5">
            {[Facebook, Twitter, Linkedin, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="h-9 w-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4">Product</h4>
          <ul className="space-y-2 text-sm">
            {footerLinks.product.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="hover:text-white transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            {footerLinks.company.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="hover:text-white transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" style={{ color: '#ec5a1c' }} />
              <a href="tel:+18002539647">(800) 253-9647</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" style={{ color: '#ec5a1c' }} />
              <a href="mailto:support@truckingoffice.com">support@truckingoffice.com</a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5" style={{ color: '#ec5a1c' }} />
              <span>USA</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-6 flex flex-col md:flex-row gap-3 items-center justify-between text-sm">
          <div>&copy; {new Date().getFullYear()} TruckingOffice. All rights reserved.</div>
          <div className="flex gap-5">
            {footerLinks.legal.map((l) => (
              <a key={l.label} href={l.href} className="hover:text-white">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
