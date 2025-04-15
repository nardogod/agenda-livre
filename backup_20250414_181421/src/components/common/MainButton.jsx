// components/common/MainButton.jsx
import React from 'react';

export default function MainButton({ 
  children, 
  onClick, 
  disabled = false, 
  className = "", 
  type = "button",
  variant = "primary"
}) {
  const baseClasses = "py-3 px-4 rounded-xl font-medium transition-colors";
  
  const variantClasses = {
    primary: "bg-purple-600 hover:bg-purple-700 text-white disabled:bg-purple-300",
    secondary: "bg-white border border-purple-200 text-purple-600 hover:bg-purple-50 disabled:text-purple-300",
    outline: "bg-transparent border border-gray-200 text-gray-700 hover:border-purple-200 hover:text-purple-600 disabled:text-gray-300",
  };
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}