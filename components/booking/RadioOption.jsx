// components/booking/RadioOption.jsx
import React from 'react';

export default function RadioOption({ options, selected, onChange }) {
  return (
    <div className="flex bg-white rounded-xl mb-3 overflow-hidden">
      {options.map((option, idx) => (
        <button
          key={idx}
          className={`flex-1 py-3 text-sm ${
            selected === option.value 
              ? "bg-purple-600 text-white" 
              : "text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}