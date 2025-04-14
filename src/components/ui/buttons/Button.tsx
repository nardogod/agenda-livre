import React from 'react';

export type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  size = 'md',
}) => {
  // Classes base para todos os botões
  const baseClasses = 'font-medium rounded-xl transition-colors';
  
  // Classes de tamanho
  const sizeClasses = {
    sm: 'py-2 px-3 text-sm',
    md: 'py-3 px-4 text-sm',
    lg: 'py-4 px-5 text-base',
  };
  
  // Classes de largura
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Classes específicas para cada variante
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'bg-white border border-gray-medium text-primary hover:bg-primary-light',
  };
  
  // Classes de estado
  const stateClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  // Combinação de todas as classes
  const buttonClasses = `
    ${baseClasses} 
    ${sizeClasses[size]} 
    ${widthClasses} 
    ${variantClasses[variant]} 
    ${stateClasses} 
    ${className}
  `;

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;