import React, { forwardRef } from 'react';

export type InputProps = {
  label?: string;
  placeholder?: string;
  type?: string;
  error?: string;
  className?: string;
  fullWidth?: boolean;
  id?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      placeholder,
      type = 'text',
      error,
      className = '',
      fullWidth = true,
      id,
      name,
      required = false,
      disabled = false,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    // Classes base para o input
    const inputClasses = `
      p-3 
      bg-white 
      border 
      rounded-xl 
      focus:border-primary 
      focus:ring-1 
      focus:ring-primary 
      focus:outline-none
      ${error ? 'border-error' : 'border-gray-medium'}
      ${disabled ? 'bg-gray-light cursor-not-allowed text-gray-text-light' : ''}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `;

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label 
            htmlFor={id} 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        
        <input
          ref={ref}
          type={type}
          id={id}
          name={name}
          className={inputClasses}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={onChange}
          required={required}
          {...props}
        />
        
        {error && (
          <p className="mt-1 text-xs text-error">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;