import React from 'react';

interface PaymentMethodProps {
  method: {
    id: 'credit_card' | 'pix';
    name: string;
    description: string;
    icon: React.ReactNode;
  };
  selected: boolean;
  onSelect: (id: 'credit_card' | 'pix') => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ method, selected, onSelect }) => {
  return (
    <button
      className={`w-full p-4 mb-3 rounded-xl flex items-center ${
        selected ? "bg-purple-50 border-2 border-purple-600" : "bg-white border border-gray-200"
      }`}
      onClick={() => onSelect(method.id)}
      aria-pressed={selected}
      aria-label={`Selecionar ${method.name}`}
    >
      <div className={`w-5 h-5 rounded-full border ${selected ? "border-2 border-purple-600" : "border border-gray-300"} flex items-center justify-center`}>
        {selected && <div className="w-3 h-3 rounded-full bg-purple-600" />}
      </div>
      <div className="ml-3">
        <div className="font-medium">{method.name}</div>
        <div className="text-xs text-gray-500 mt-0.5">{method.description}</div>
      </div>
      {method.icon}
    </button>
  );
};

export default PaymentMethod;