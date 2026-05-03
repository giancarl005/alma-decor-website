'use client';

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
      <div className="flex justify-center border-b border-gray-100 dark:border-white/5">
        <div className="flex gap-12 sm:gap-20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => {
                setActiveTab(tab.id);
                document.getElementById(`tab-${tab.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`pb-4 text-[10px] font-bold uppercase tracking-[0.3em] transition-all relative ${
                activeTab === tab.id
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-yellow rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="max-w-none">
          {tabs.find(t => t.id === activeTab)?.content}
        </div>
      </div>
    </div>
  );
};

export default ProductTabs;
