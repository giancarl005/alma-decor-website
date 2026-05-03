import React from 'react';
import AboutUs from '../components/AboutUs';
import Portfolio from '../components/Portfolio';
import Collaborate from '../components/Collaborate';

const About: React.FC = () => {
  return (
    <div className="pt-20">
      <AboutUs />
      <Portfolio />
      <Collaborate />
    </div>
  );
};

export default About;
