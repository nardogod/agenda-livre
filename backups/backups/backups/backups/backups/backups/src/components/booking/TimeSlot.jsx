// components/booking/TimeSlot.jsx
import React from 'react';

export default function TimeSlot({ time, selected, onSelect }) {
  return (
    <button
      className={`px-5 py-2.5 rounded-xl text-sm mr-2 mb-2 ${
        selected 
          ? "bg-purple-600 text-white" 
          : "bg-white border border-gray-200 text-gray-700 hover:border-purple-300"
      }`}
      onClick={() => onSelect(time)}
    >
      {time}
    </button>
  );
}