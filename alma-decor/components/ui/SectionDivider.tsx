import React from 'react';

const SectionDivider: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-6">
      <div className="relative flex items-center">
        <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
        <span className="flex-shrink mx-4">
          <div className="inline-flex items-center space-x-2">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></span>
            <span className="h-2 w-2 rounded-full bg-brand-yellow"></span>
            <span className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></span>
          </div>
        </span>
        <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
      </div>
    </div>
  );
};

export default SectionDivider;
