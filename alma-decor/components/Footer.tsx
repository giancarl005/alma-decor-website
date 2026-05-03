import React from 'react';
import { Link } from 'react-router-dom';
import { FacebookIcon, InstagramIcon, LinkedInIcon, TikTokIcon, MailIcon, PhoneIcon, LocationMarkerIcon } from './ui/Icon';

interface FooterProps {
  onLegalLinkClick: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onLegalLinkClick }) => {
  return (
    <footer className="bg-gray-50 dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-white/[0.03] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-8">
          {/* Brand Section */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold italic serif tracking-tighter text-gray-900 dark:text-white leading-none">
                ALMA<span className="text-brand-yellow not-italic">DECOR</span>
                <span className="text-brand-yellow not-italic">.</span>
              </h2>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs font-medium">
              Transformăm viziunea ta în realitate cu materiale premium și design de excepție. O experiență de peste 20 de ani în amenajări interioare.
            </p>
            <div className="flex gap-5 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05] flex items-center justify-center text-gray-400 hover:text-brand-yellow hover:border-brand-yellow transition-all shadow-sm group">
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05] flex items-center justify-center text-gray-400 hover:text-brand-yellow hover:border-brand-yellow transition-all shadow-sm group">
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05] flex items-center justify-center text-gray-400 hover:text-brand-yellow hover:border-brand-yellow transition-all shadow-sm group">
                <LinkedInIcon className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05] flex items-center justify-center text-gray-400 hover:text-brand-yellow hover:border-brand-yellow transition-all shadow-sm group">
                <TikTokIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8 lg:pl-12">
            <h3 className="text-gray-900 dark:text-white text-[11px] font-bold uppercase tracking-[0.3em]">Navigație</h3>
            <ul className="space-y-4">
              {[
                { name: 'Magazin', path: '/magazin' },
                { name: 'Despre Noi', path: '/despre-noi' },
                { name: 'Blog', path: '/blog' },
                { name: 'Contact', path: '/contact' }
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path}
                    className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-brand-yellow transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-brand-yellow transition-all group-hover:w-3"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-8">
            <h3 className="text-gray-900 dark:text-white text-[11px] font-bold uppercase tracking-[0.3em]">Legal</h3>
            <ul className="space-y-4">
              {['Termeni și Condiții', 'Politică Confidențialitate', 'Politică Cookie', 'ANPC'].map((item) => (
                <li key={item}>
                  <button className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-brand-yellow transition-colors flex items-center gap-2 group">
                    <span className="w-0 h-px bg-brand-yellow transition-all group-hover:w-3"></span>
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-8">
            <h3 className="text-gray-900 dark:text-white text-[11px] font-bold uppercase tracking-[0.3em]">Contact</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05] flex items-center justify-center text-gray-400 group-hover:text-brand-yellow transition-all flex-shrink-0 shadow-sm">
                  <LocationMarkerIcon className="w-5 h-5" />
                </div>
                <div className="pt-1">
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Showroom</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed font-medium italic serif">Strada 1 Decembrie 1918 13,<br/>Roșu, Ilfov, România</p>
                </div>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05] flex items-center justify-center text-gray-400 group-hover:text-brand-yellow transition-all flex-shrink-0 shadow-sm">
                  <PhoneIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Telefon</p>
                  <a href="tel:+40770612470" className="text-gray-600 dark:text-gray-300 text-sm font-semibold hover:text-brand-yellow transition-colors">+40 770 612 470</a>
                </div>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05] flex items-center justify-center text-gray-400 group-hover:text-brand-yellow transition-all flex-shrink-0 shadow-sm">
                  <MailIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Email</p>
                  <a href="mailto:Info@almadecor.ro" className="text-gray-600 dark:text-gray-300 text-sm font-semibold hover:text-brand-yellow transition-colors">Info@almadecor.ro</a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-gray-100 dark:border-white/[0.03] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 dark:text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} ALMA DECOR. TOATE DREPTURILE REZERVATE.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
