import React from 'react';
import AccordionItem from './ui/AccordionItem';

const faqData = [
  {
    question: "Oferiți servicii de consultanță în design interior?",
    answer: "Da, oferim servicii complete de consultanță în design interior pentru a vă ajuta să alegeți cele mai potrivite produse și soluții pentru spațiul dumneavoastră.",
  },
  {
    question: "Asigurați montajul produselor achiziționate?",
    answer: "Absolut. Avem echipe de montatori profesioniști care asigură instalarea corectă și rapidă a tuturor produselor achiziționate de la noi.",
  },
  {
    question: "Pot comanda mostre de produse înainte de a lua o decizie?",
    answer: "Sigur. Vă încurajăm să comandați mostre pentru a vedea cum se potrivesc materialele și culorile în spațiul dumneavoastră. Contactați-ne pentru detalii.",
  },
  {
    question: "Care este durata de livrare a produselor?",
    answer: "Durata de livrare variază în funcție de produs și stoc. În general, produsele aflate în stoc se livrează în 2-5 zile lucrătoare.",
  },
  {
    question: "Ce garanție oferiți pentru produse și montaj?",
    answer: "Toate produsele noastre beneficiază de garanția producătorului, iar pentru serviciile de montaj oferim o garanție proprie. Detaliile specifice se găsesc pe pagina fiecărui produs.",
  },
];

const Faq: React.FC = () => {
  return (
    <section id="faq" className="pt-20 pb-36 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-brand-dark dark:text-gray-100">Întrebări Frecvente</h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqData.map((item, index) => (
            <AccordionItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
