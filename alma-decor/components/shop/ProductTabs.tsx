import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface ProductTabsProps {
  tabs: Tab[];
}

const ProductTabs: React.FC<ProductTabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs && tabs.length > 0 ? tabs[0].id : '');

  if (!tabs || tabs.length === 0) return null;

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex bg-gray-50 dark:bg-white/[0.03] p-1.5 rounded-full border border-gray-100 dark:border-white/5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-3 text-[11px] font-bold uppercase tracking-widest rounded-full transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-white dark:bg-gray-800 text-brand-yellow shadow-sm ring-1 ring-black/5' 
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-white dark:bg-white/[0.01] p-10 md:p-16 rounded-[3rem] border border-gray-50 dark:border-white/5 shadow-sm">
          <div className="max-w-none">
            {tabs.find(t => t.id === activeTab)?.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTabs;
