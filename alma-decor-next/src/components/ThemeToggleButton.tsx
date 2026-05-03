'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@/components/ui/Icon';

interface ThemeToggleButtonProps {
  className?: string;
}

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full focus:outline-none transition-all duration-300 ${className || 'text-gray-900 dark:text-brand-yellow hover:bg-gray-100 dark:hover:bg-white/10'}`}
      aria-label={theme === 'light' ? 'Treci la modul întunecat' : 'Treci la modul luminos'}
    >
      {theme === 'light' ? (
        <MoonIcon className="w-6 h-6" />
      ) : (
        <SunIcon className="w-6 h-6" />
      )}
    </button>
  );
};

export default ThemeToggleButton;
