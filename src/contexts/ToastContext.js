// src/contexts/ToastContext.js
import React, { createContext, useContext, useState } from 'react';

// Criar o contexto
const ToastContext = createContext();

// Hook personalizado para usar o contexto
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }
  return context;
};

// Componente Toast para exibir mensagens
const Toast = ({ id, message, type = 'info', onClose }) => {
  return (
    <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-xl ${
      type === 'success' ? 'bg-green-50 text-green-800' :
      type === 'error' ? 'bg-red-50 text-red-800' :
      type === 'warning' ? 'bg-amber-50 text-amber-800' :
      'bg-blue-50 text-blue-800'
    }`}>
      <div className="flex items-center justify-between">
        <p>{message}</p>
        <button 
          onClick={() => onClose(id)}
          className="ml-4 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

// Provider que gerencia os toasts
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Função para adicionar um novo toast
  const showToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);

    // Remover automaticamente após a duração especificada
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  // Remover um toast específico
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastContext;