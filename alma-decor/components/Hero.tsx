import React from 'react';
import { StarIcon, MouseIcon } from './ui/Icon';

const Hero: React.FC = () => {
  const handleScrollToSection = (event: React.MouseEvent, targetId: string) => {
    event.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 90; // Adjust this value to match your fixed header's height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const heroStyle = {
    backgroundImage: `url('https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1920&auto=format,compress&fit=crop')`
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center text-white bg-cover bg-center pt-24 pb-20"
      style={heroStyle}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold max-w-4xl mx-auto leading-tight">
          ÎȚI DOREȘTI ELEMENTE DE DESIGN PENTRU ORICE STIL?
        </h1>
        <p className="mt-6 md:mt-8 text-xl md:text-2xl font-bold max-w-3xl mx-auto">
          Transformăm spațiile tale în locuri de vis, cu soluții personalizate pentru interior și exterior.
        </p>
        <div className="mt-6 md:mt-8 flex flex-col items-center space-y-5">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-6 h-6 text-brand-yellow" />)}
          </div>
          <p className="font-semibold text-lg">Peste 200 de clienți au ales serviciile noastre</p>
          <div className="flex items-center justify-center -space-x-5">
            <img className="inline-block h-14 w-14 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format,compress&fit=crop&w=56&h=56&q=80" alt="Client" />
            <img className="inline-block h-14 w-14 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format,compress&fit=crop&w=56&h=56&q=80" alt="Client" />
            <img className="inline-block h-14 w-14 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format,compress&fit=crop&w=56&h=56&q=80" alt="Client" />
            <img className="inline-block h-14 w-14 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format,compress&fit=crop&w=56&h=56&q=80" alt="Client" />
            <img className="inline-block h-14 w-14 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format,compress&fit=crop&w=56&h=56&q=80" alt="Client" />
            <img className="inline-block h-14 w-14 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format,compress&fit=crop&w=56&h=56&q=80" alt="Client" />
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-800 bg-opacity-70 ring-2 ring-white">
                <span className="text-base font-medium text-white">200+</span>
            </div>
          </div>
        </div>
        <div className="mt-8 md:mt-12">
          <a
            href="#contact"
            onClick={(e) => handleScrollToSection(e, 'contact')}
            className="inline-block bg-brand-yellow text-gray-900 font-bold py-3 px-6 md:py-4 md:px-8 rounded-lg text-base md:text-lg hover:bg-brand-yellow-dark transition-all duration-300 transform hover:scale-105"
          >
            SOLICITĂ CONSULTANȚĂ GRATUITĂ
          </a>
        </div>
      </div>
      <button
        onClick={(e) => handleScrollToSection(e, 'despre-noi')}
        aria-label="Derulează la secțiunea următoare"
        className="absolute z-20 bottom-8 left-1/2 -translate-x-1/2"
      >
        <MouseIcon className="h-12 w-8 text-white" />
      </button>
    </section>
  );
};

export default Hero;
