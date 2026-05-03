import React, { useState, useEffect, useMemo } from 'react';
import { StarIcon, ChevronLeftIcon, ChevronRightIcon } from './ui/Icon';

const testimonials = [
  {
    name: 'Andreea P.',
    role: 'Proprietar Apartament',
    quote: 'Colaborarea cu Alma Decor a fost o experiență excepțională. Echipa a dat dovadă de profesionalism, creativitate și o atenție incredibilă la detalii. Au transformat apartamentul nostru într-un cămin de vis. Recomand cu încredere!',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    name: 'Mihai Ionescu',
    role: 'Arhitect Partener',
    quote: 'Lucrez cu Alma Decor de câțiva ani pe diverse proiecte și sunt mereu impresionat de calitatea produselor și de promptitudinea echipei. Sunt un partener de încredere pe care te poți baza pentru a livra excelență clienților.',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    name: 'Elena D.',
    role: 'Manager Restaurant',
    quote: 'Am apelat la Alma Decor pentru amenajarea restaurantului nostru și rezultatul a depășit toate așteptările. Au înțeles perfect conceptul și au venit cu soluții inovatoare care au creat o atmosferă unică. Feedback-ul clienților este extraordinar!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    name: 'David Popescu',
    role: 'Dezvoltator Imobiliar',
    quote: 'Calitatea materialelor de la Alma Decor este de neegalat. Am folosit parchetul și profilele decorative în cel mai recent proiect rezidențial și clienții sunt absolut încântați de finisaje. O colaborare eficientă și profesionistă.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    name: 'Laura Stan',
    role: 'Proprietar Casă',
    quote: 'Am fost complet nehotărâtă în privința draperiilor. Consultantul de la Alma Decor a avut o răbdare infinită și m-a ajutat să aleg soluția perfectă care completează întregul design. Servicii de 5 stele!',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    name: 'Bogdan Marinescu',
    role: 'Antreprenor',
    quote: 'Pentru biroul nostru nou, am vrut ceva modern și de impact. Tapetul ales de la Alma Decor a devenit piesa centrală a spațiului de recepție. Montajul a fost rapid și impecabil. Recomand cu căldură!',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
];

const Testimonials: React.FC = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);
  const [disableTransition, setDisableTransition] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const updateCardsToShow = () => {
      const newCardsToShow = window.innerWidth < 1024 ? 1 : 3;
      setCardsToShow(newCardsToShow);
    };
    updateCardsToShow();
    window.addEventListener('resize', updateCardsToShow);
    return () => window.removeEventListener('resize', updateCardsToShow);
  }, []);

  const loopedTestimonials = useMemo(() => {
    if (testimonials.length <= cardsToShow) return testimonials;
    const firstItems = testimonials.slice(0, cardsToShow);
    const lastItems = testimonials.slice(testimonials.length - cardsToShow);
    return [...lastItems, ...testimonials, ...firstItems];
  }, [cardsToShow]);

  const maxPage = testimonials.length > cardsToShow ? testimonials.length - 1 : 0;


  useEffect(() => {
    // This effect runs only when `maxPage` changes (on screen resize).
    // It clamps the current page index to ensure it's not out of bounds
    // without interfering with the navigation logic that handles the infinite loop.
    if (pageIndex > maxPage) {
      setPageIndex(maxPage);
    }
  }, [maxPage]);

  const handleTransitionEnd = () => {
    setIsNavigating(false);
    if (pageIndex === -1) {
      setDisableTransition(true);
      setPageIndex(maxPage);
    } else if (pageIndex === maxPage + 1) {
      setDisableTransition(true);
      setPageIndex(0);
    }
  };

  useEffect(() => {
    if (disableTransition) {
      const timer = setTimeout(() => {
        setDisableTransition(false);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [disableTransition]);

  const prevTestimonial = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    setPageIndex(prev => prev - 1);
  };

  const nextTestimonial = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    setPageIndex(prev => prev + 1);
  };
  
  const goToTestimonial = (index: number) => {
    if (isNavigating || index === pageIndex) return;
    setIsNavigating(true);
    setPageIndex(index);
  };

  const currentIndex = pageIndex + cardsToShow;
  
  return (
    <section id="recenzii" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-brand-dark dark:text-gray-100">Ce Spun Clienții Noștri</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Mândria noastră este satisfacția clienților. Iată câteva dintre părerile celor care ne-au ales pentru a le transforma spațiile.
          </p>
        </div>
        <div className="mt-12 relative max-w-sm lg:max-w-6xl mx-auto">
          <div className="overflow-hidden">
            <div
              className={`flex ${!disableTransition ? 'transition-transform duration-500 ease-in-out' : ''}`}
              onTransitionEnd={handleTransitionEnd}
              style={{
                width: `${(100 * loopedTestimonials.length) / cardsToShow}%`,
                transform: `translateX(-${(currentIndex * 100) / loopedTestimonials.length}%)`
              }}
            >
              {loopedTestimonials.map((testimonial, index) => (
                <div key={index} className="px-2" style={{ width: `${100 / loopedTestimonials.length}%` }}>
                  <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg flex flex-col h-full justify-between min-h-[320px]">
                    <div>
                      <div className="flex items-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} className="w-5 h-5 text-brand-yellow" />
                        ))}
                      </div>
                      <blockquote className="text-gray-600 dark:text-gray-400 italic">
                        "{testimonial.quote}"
                      </blockquote>
                    </div>
                    <div className="mt-6 flex items-center">
                      <img
                        className="h-12 w-12 rounded-full object-cover"
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        loading="lazy"
                        width="48"
                        height="48"
                      />
                      <div className="ml-4">
                        <p className="font-bold text-brand-dark dark:text-gray-100">{testimonial.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            disabled={isNavigating && !disableTransition}
            className="absolute top-1/2 -translate-y-1/2 left-0 -translate-x-4 lg:-translate-x-12 bg-white dark:bg-gray-700 p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-800 focus:ring-brand-yellow z-10 disabled:opacity-50"
            aria-label="Testimonialul Anterior"
          >
            <ChevronLeftIcon className="w-6 h-6 text-brand-dark dark:text-gray-100" />
          </button>
          <button
            onClick={nextTestimonial}
            disabled={isNavigating && !disableTransition}
            className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-4 lg:translate-x-12 bg-white dark:bg-gray-700 p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-800 focus:ring-brand-yellow z-10 disabled:opacity-50"
            aria-label="Următorul Testimonial"
          >
            <ChevronRightIcon className="w-6 h-6 text-brand-dark dark:text-gray-100" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {[...Array(testimonials.length)].map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  pageIndex === index ? 'bg-brand-yellow' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                aria-label={`Mergi la setul de testimoniale ${index + 1}`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Testimonials;
