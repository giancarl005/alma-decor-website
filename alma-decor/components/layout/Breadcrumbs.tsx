import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="hidden md:flex mb-8 animate-in fade-in slide-in-from-left-4 duration-700" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link to="/" className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-brand-yellow transition-colors">
            Acasă
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index}>
            <div className="flex items-center">
              <svg className="w-2.5 h-2.5 text-gray-300 mx-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg>
              {item.active ? (
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900 dark:text-white truncate max-w-[150px] md:max-w-none">
                  {item.label}
                </span>
              ) : (
                <Link 
                  to={item.path || '#'} 
                  className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-brand-yellow transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
