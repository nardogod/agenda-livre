import React from 'react';

interface ToggleOptionProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function ToggleOption({ label, value, onChange }: ToggleOptionProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl mb-3">
      <span className="font-medium">{label}</span>
      <div 
        className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer ${value ? 'bg-purple-600' : 'bg-gray-300'}`}
        onClick={() => onChange(!value)}
      >
        <div 
          className={`w-4 h-4 rounded-full bg-white transform duration-200 ${value ? 'translate-x-6' : 'translate-x-0'}`} 
        />
      </div>
    </div>
  );
}