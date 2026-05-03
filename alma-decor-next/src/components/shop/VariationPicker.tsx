'use client';

import React from 'react';

interface Variation {
  id: number;
  name: string;
  type: 'color' | 'size' | 'material';
  value: string; // Hex for color, label for others
}

interface VariationPickerProps {
  label: string;
  variations: Variation[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const VariationPicker: React.FC<VariationPickerProps> = ({ label, variations, selectedId, onSelect }) => {
  if (!variations || variations.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold text-gray-400 dark:text-white/40 uppercase tracking-[0.2em]">{label}</span>
        {selectedId && (
          <span className="text-[10px] text-brand-yellow font-black uppercase tracking-widest">
            {variations.find(v => v.id === selectedId)?.name}
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-4">
        {variations.map((v) => (
          <button
            key={v.id}
            onClick={() => onSelect(v.id)}
            className={`group relative flex items-center justify-center transition-all duration-300 ${
              v.type === 'color' 
                ? 'w-8 h-8 rounded-full border-2' 
                : 'px-5 py-2.5 rounded-xl border text-[11px] font-bold uppercase tracking-wider'
            } ${
              selectedId === v.id 
                ? 'border-brand-yellow ring-4 ring-brand-yellow/10' 
                : 'border-gray-100 dark:border-white/5 hover:border-brand-yellow/50'
            }`}
            title={v.name}
          >
            {v.type === 'color' ? (
              <span 
                className="w-full h-full rounded-full border border-black/5" 
                style={{ backgroundColor: v.value }}
              />
            ) : (
              <span className={selectedId === v.id ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                {v.name}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VariationPicker;
