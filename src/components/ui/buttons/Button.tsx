// src/components/ui/Button.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  // Classes base comuns para todos os botões
  const baseClasses = 'font-medium rounded-xl focus:outline-none transition-colors';
  
  // Classes específicas para cada variante
  const variantClasses = {
    primary: 'bg-purple-600 hover:bg-purple-700 text-white',
    secondary: 'bg-white border border-purple-200 text-purple-600 hover:bg-purple-50',
    outline: 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300',
    text: 'bg-transparent text-purple-600 hover:bg-purple-50'
  };
  
  // Classes específicas para cada tamanho
  const sizeClasses = {
    sm: 'py-2 px-3 text-xs',
    md: 'py-3 px-4 text-sm',
    lg: 'py-4 px-5 text-base'
  };
  
  // Classes para o estado de loading ou disabled
  const stateClasses = (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : '';
  
  // Classe para largura total
  const widthClass = fullWidth ? 'w-full' : '';
  
  // Combinação de todas as classes
  const buttonClasses = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${sizeClasses[size]} 
    ${stateClasses} 
    ${widthClass} 
    ${className}
  `.trim();
  
  return (
    <button 
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader2 size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="animate-spin mr-2" />
          {children}
        </div>
      ) : (
        <div className="flex items-center justify-center">
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </div>
      )}
    </button>
  );
};