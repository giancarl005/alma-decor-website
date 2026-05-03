'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggleButton from './ThemeToggleButton';
import { XMarkIcon } from './ui/Icon';
import Search from './Search';

const Header: React.FC = () => {
  const { cartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const lastScrollY = useRef(0);
  const pathname = usePathname();
  const router = useRouter();
  const isCheckout = pathname === '/comanda';

  const isHomePage = pathname === '/';
  const isArticlePage = pathname.startsWith('/blog/') && pathname.length > 6;
  const isTransparentTop = isHomePage || isArticlePage;

  const navLinks = [
    { name: 'Acasă', path: '/', type: 'link', isHome: true },
    { name: 'Showroom', id: 'showroom', type: 'scroll' },
    { name: 'Despre Noi', path: '/despre-noi', type: 'link' },
    { name: 'Magazin', path: '/magazin', type: 'link' },
    { name: 'Blog', path: '/blog', type: 'link' },
    { name: 'Contact', path: '/contact', type: 'link' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { 
        rootMargin: "-90px 0px -40% 0px" 
      }
    );

    const sections = navLinks
      .filter(link => link.type === 'scroll')
      .map(({ id }) => document.getElementById(id!));
      
    sections.forEach(section => {
      if (section) observer.observe(section);
    });
    
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      sections.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, [pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, link: any) => {
    if (link.type === 'link') {
      setIsMenuOpen(false);
      return; 
    }

    event.preventDefault();
    if (pathname !== '/') {
      router.push('/#' + link.id);
      setIsMenuOpen(false);
      return;
    }

    const element = document.getElementById(link.id);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setIsMenuOpen(false);
    }
  };

  // Determine header appearance
  const isSolid = isScrolled || !isTransparentTop;
  
  const separatorClass = isScrolled || !isTransparentTop
    ? 'text-gray-300 dark:text-gray-700'
    : 'text-white/30';

  return (
    <>
      <header 
        className={`fixed w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg py-2' 
            : 'bg-transparent py-4'
        } ${isCheckout ? 'border-b border-gray-100 dark:border-white/5 !bg-white dark:!bg-gray-950 !py-3' : ''}`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          {isCheckout ? (
            <>
              <Link 
                href="/cos" 
                className="flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-brand-yellow transition-colors uppercase tracking-[0.2em]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Înapoi la coș</span>
              </Link>
              <div className="flex-shrink-0 absolute left-1/2 -translate-x-1/2">
                <Link href="/" className="flex items-center text-xl sm:text-2xl font-bold italic serif tracking-tighter leading-none">
                  <span className="text-gray-900 dark:text-white">ALMA</span>
                  <span className="text-brand-yellow not-italic">DECOR</span>
                  <span className="text-brand-yellow not-italic">.</span>
                </Link>
              </div>
              <div className="w-20"></div> {/* Spacer to balance */}
            </>
          ) : (
            <>
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link href="/" className="flex items-center text-xl sm:text-2xl font-bold italic serif tracking-tighter leading-none">
                  <span className={isScrolled || !isTransparentTop ? 'text-gray-900 dark:text-white' : 'text-white'}>ALMA</span>
                  <span className="text-brand-yellow not-italic">DECOR</span>
                  <span className="text-brand-yellow not-italic">.</span>
                </Link>
              </div>
              
              <div className="flex items-center space-x-1 sm:space-x-4">
              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-6">
                <nav className="flex items-center space-x-4">
                  {navLinks.map((link, index) => (
                    <React.Fragment key={link.name}>
                      {link.isHome ? (
                        <Link
                          href="/"
                          className={`hover:text-brand-yellow transition-colors duration-300 ${
                            pathname === '/' ? 'text-brand-yellow' : (isScrolled || !isTransparentTop ? 'text-gray-900 dark:text-white' : 'text-white')
                          }`}
                          aria-label="Acasă"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                            <path d="M2.25 12l8.955-8.955a1.125 1.125 0 011.59 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                          </svg>
                        </Link>
                      ) : link.type === 'link' ? (
                        <Link
                          href={link.path!}
                          className={`hover:text-brand-yellow transition-colors duration-300 font-bold text-[13px] uppercase tracking-wider cursor-pointer ${
                            pathname === link.path ? 'text-brand-yellow' : (isScrolled || !isTransparentTop ? 'text-gray-900 dark:text-white' : 'text-white')
                          }`}
                        >
                          {link.name}
                        </Link>
                      ) : (
                        <a
                          href={`#${link.id}`}
                          onClick={(e) => handleNavClick(e, link)}
                          className={`hover:text-brand-yellow transition-colors duration-300 font-bold text-[13px] uppercase tracking-wider cursor-pointer ${
                            activeSection === link.id ? 'text-brand-yellow' : (isScrolled || !isTransparentTop ? 'text-gray-900 dark:text-white' : 'text-white')
                          }`}
                        >
                          {link.name}
                        </a>
                      )}
                      {index < navLinks.length - 1 && (
                        <span className={`select-none font-light ${separatorClass}`}>/</span>
                      )}
                    </React.Fragment>
                  ))}
                </nav>
                <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-2" />
                <ThemeToggleButton className={isScrolled || !isTransparentTop ? 'text-gray-900 dark:text-white' : 'text-white'} />
              </div>

              {/* Icons visible on all devices */}
              <div className="flex items-center space-x-0.5 sm:space-x-2">
                  {/* Search Icon - Always visible */}
                  <button 
                    onClick={() => setIsSearchOpen(true)}
                    className={`p-2 transition-colors duration-300 hover:text-brand-yellow ${isScrolled || !isTransparentTop ? 'text-gray-900 dark:text-white' : 'text-white'}`}
                    aria-label="Search"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>

                  {/* Account Icon - Always visible */}
                  <Link 
                    href="/cont/login" 
                    className={`p-2 transition-colors duration-300 hover:text-brand-yellow ${isScrolled || !isTransparentTop ? 'text-gray-900 dark:text-white' : 'text-white'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </Link>

                  {/* Cart Icon - Always visible */}
                  <Link 
                    href="/cos" 
                    className={`relative p-2 transition-colors duration-300 group hover:text-brand-yellow ${isScrolled || !isTransparentTop ? 'text-gray-900 dark:text-white' : 'text-white'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    {cartCount > 0 && (
                        <span className="absolute top-1 right-1 bg-brand-yellow text-gray-900 text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-gray-900 group-hover:scale-110 transition-transform">
                        {cartCount}
                        </span>
                    )}
                  </Link>
              </div>

              {/* Desktop Contact Button */}
              <Link
                href="/contact"
                className="hidden lg:block bg-brand-yellow text-gray-900 font-bold py-2.5 px-6 rounded-lg hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all duration-300 cursor-pointer text-xs tracking-widest"
              >
                CONTACT
              </Link>

              {/* Mobile Menu Toggle */}
              <button className={`lg:hidden p-2 ml-1 ${isScrolled || !isTransparentTop ? 'text-gray-900 dark:text-white' : 'text-white'}`} onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 z-[100] transition-all duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!isMenuOpen}
        role="dialog"
      >
        <div className={`absolute inset-0 bg-black/40 dark:bg-black/90 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMenuOpen(false)}></div>
        
        <div 
          className={`absolute top-0 right-0 h-full w-full max-w-[320px] bg-white dark:bg-gray-950 shadow-2xl transition-all duration-500 ease-out flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-4">
                  <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold italic serif flex items-center tracking-tighter leading-none">
                      <span className="text-gray-900 dark:text-white uppercase">ALMA</span>
                      <span className="text-brand-yellow not-italic uppercase">DECOR</span>
                      <span className="text-brand-yellow not-italic">.</span>
                  </Link>
                  <ThemeToggleButton />
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all active:scale-90" aria-label="Close menu">
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>

            <nav className="flex-grow px-8 py-6 flex flex-col space-y-0.5 overflow-hidden">
                {navLinks.map((link, index) => (
                    <div key={link.name}>
                      {link.isHome ? (
                        <Link
                          href="/"
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                            pathname === '/' 
                            ? 'text-brand-yellow bg-brand-yellow/5' 
                            : 'text-gray-700 dark:text-gray-100 hover:text-brand-yellow'
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-3">
                            <path d="M2.25 12l8.955-8.955a1.125 1.125 0 011.59 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                          </svg>
                          Acasă
                        </Link>
                      ) : link.type === 'link' ? (
                        <Link
                          href={link.path!}
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                            pathname === link.path 
                            ? 'text-brand-yellow bg-brand-yellow/5' 
                            : 'text-gray-700 dark:text-gray-100 hover:text-brand-yellow'
                          }`}
                        >
                          {link.name}
                        </Link>
                      ) : (
                        <a
                          href={`#${link.id}`}
                          onClick={(e) => handleNavClick(e, link)}
                          className={`flex items-center px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                              activeSection === link.id 
                              ? 'text-brand-yellow bg-brand-yellow/5' 
                              : 'text-gray-600 dark:text-gray-100 hover:text-brand-yellow'
                          }`}
                        >
                          {link.name}
                        </a>
                      )}
                    </div>
                ))}
            </nav>

        </div>
      </div>
      <Search isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;
