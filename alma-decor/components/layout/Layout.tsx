import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import FloatingButtons from '../FloatingButtons';
import CookieConsent from '../CookieConsent';
import TermsPage from '../legal/TermsPage';
import PrivacyPage from '../legal/PrivacyPage';
import CookiesPage from '../legal/CookiesPage';

interface LayoutProps {
  activeLegalPage: string | null;
  setActiveLegalPage: (page: string | null) => void;
}

const Layout: React.FC<LayoutProps> = ({ activeLegalPage, setActiveLegalPage }) => {
  return (
    <div className="font-sans bg-white dark:bg-gray-900">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer onLegalLinkClick={setActiveLegalPage} />
      <FloatingButtons />

      <CookieConsent onOpenPolicy={() => setActiveLegalPage('cookies')} />

      <TermsPage isOpen={activeLegalPage === 'terms'} onClose={() => setActiveLegalPage(null)} />
      <PrivacyPage isOpen={activeLegalPage === 'privacy'} onClose={() => setActiveLegalPage(null)} />
      <CookiesPage isOpen={activeLegalPage === 'cookies'} onClose={() => setActiveLegalPage(null)} />
    </div>
  );
};

export default Layout;
