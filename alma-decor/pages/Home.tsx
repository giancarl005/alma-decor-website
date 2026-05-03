import React from 'react';
import Hero from '../components/Hero';
import AboutUs from '../components/AboutUs';
import WhyChooseUs from '../components/WhyChooseUs';
import Process from '../components/Process';
import Products from '../components/Products';
import Portfolio from '../components/Portfolio';
import Collaborate from '../components/Collaborate';
import Testimonials from '../components/Testimonials';
import Showroom from '../components/Showroom';
import Contact from '../components/Contact';
import Faq from '../components/Faq';
import SectionDivider from '../components/ui/SectionDivider';

interface HomeProps {
  onLegalLinkClick: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ onLegalLinkClick }) => {
  return (
    <>
      <Hero />
      <AboutUs />
      <div className="bg-white dark:bg-gray-900"><SectionDivider /></div>
      <WhyChooseUs />
      <div className="bg-gray-50 dark:bg-gray-800"><SectionDivider /></div>
      <Process />
      <div className="bg-white dark:bg-gray-900"><SectionDivider /></div>
      <Products />
      <div className="bg-gray-50 dark:bg-gray-800"><SectionDivider /></div>
      <Portfolio />
      <div className="bg-white dark:bg-gray-900"><SectionDivider /></div>
      <Collaborate />
      <div className="bg-gray-50 dark:bg-gray-800"><SectionDivider /></div>
      <Testimonials />
      <div className="bg-gray-50 dark:bg-gray-800"><SectionDivider /></div>
      <Showroom />
      <div className="bg-gray-50 dark:bg-gray-800"><SectionDivider /></div>
      <Contact onLegalLinkClick={onLegalLinkClick} />
      <div className="bg-white dark:bg-gray-900"><SectionDivider /></div>
      <Faq />
    </>
  );
};

export default Home;
