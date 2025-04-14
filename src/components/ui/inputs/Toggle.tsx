import React from 'react';

type ToggleProps = {
  label?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  description?: string;
  disabled?: boolean;
  className?: string;
};

export const Toggle: React.FC<ToggleProps> = ({
  label,
  value,
  onChange,
  description,
  disabled = false,
  className = '',
}) => {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!value);
    }
  };

  return (
    <div 
      className={`
        flex items-center justify-between p-4 
        bg-white rounded-xl 
        ${disabled ? 'opacity-60' : ''}
        ${className}
      `}
    >
      <div>
        {label && <span className="font-medium text-black-text">{label}</span>}
        {description && (
          <p className="text-xs text-gray-text mt-1">{description}</p>
        )}
      </div>
      
      <div 
        className={`
          w-12 h-6 rounded-full flex items-center p-1 cursor-pointer 
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          ${value ? 'bg-primary' : 'bg-gray-300'}
        `}
        onClick={handleToggle}
        role="switch"
        aria-checked={value}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleToggle();
            e.preventDefault();
          }
        }}
      >
        <div 
          className={`
            w-4 h-4 rounded-full bg-white transform duration-200 
            ${value ? 'translate-x-6' : 'translate-x-0'}
          `} 
        />
      </div>
    </div>
  );
};

export default Toggle;