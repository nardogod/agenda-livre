import React, { createContext, useState, useContext, useCallback } from 'react';

// Definição do tipo de toast
const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
};

// Interface do context
const ToastContext = createContext({
  showToast: () => {},
  hideToast: () => {},
  toasts: []
});

// Provider component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  
  // Função para mostrar um toast
  const showToast = useCallback((message, type = TOAST_TYPES.INFO, duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    // Adicionar novo toast à lista
    setToasts(prevToasts => [
      ...prevToasts,
      { id, message, type, duration }
    ]);
    
    // Configurar timer para remover o toast após a duração
    setTimeout(() => {
      hideToast(id);
    }, duration);
    
    return id;
  }, []);
  
  // Função para esconder um toast específico
  const hideToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);
  
  // Componente de UI para renderizar os toasts
  const ToastContainer = () => {
    if (toasts.length === 0) return null;
    
    return (
      <div className="fixed bottom-0 right-0 p-4 z-50">
        <div className="flex flex-col space-y-2">
          {toasts.map(toast => (
            <div 
              key={toast.id}
              className={`px-4 py-3 rounded-lg shadow-lg flex items-center justify-between ${
                toast.type === TOAST_TYPES.SUCCESS ? 'bg-green-50 text-green-800 border-l-4 border-green-500' :
                toast.type === TOAST_TYPES.ERROR ? 'bg-red-50 text-red-800 border-l-4 border-red-500' :
                toast.type === TOAST_TYPES.WARNING ? 'bg-amber-50 text-amber-800 border-l-4 border-amber-500' :
                'bg-blue-50 text-blue-800 border-l-4 border-blue-500'
              }`}
            >
              <span>{toast.message}</span>
              <button 
                onClick={() => hideToast(toast.id)}
                className="ml-3 text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <ToastContext.Provider value={{ showToast, hideToast, toasts }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// Hook customizado para usar o contexto
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};

export default ToastContext;