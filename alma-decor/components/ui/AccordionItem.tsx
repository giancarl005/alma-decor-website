import React, { useState } from 'react';
import { ChevronDownIcon } from './Icon';

interface AccordionItemProps {
  question: string;
  answer: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-4 px-2"
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-semibold text-brand-dark dark:text-gray-100">{question}</h3>
        <ChevronDownIcon
          className={`w-6 h-6 text-brand-dark dark:text-gray-100 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="p-4 pt-0 text-gray-600 dark:text-gray-400">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
};

export default AccordionItem;
