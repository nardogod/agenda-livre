import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

// Contexto para o gerenciamento de notificações toast
const ToastContext = createContext();

// Componente individual de toast
const Toast = ({ id, message, type, onClose }) => {
  useEffect(() => {
    // Fechar automaticamente após 5 segundos
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  // Definição de estilos com base no tipo
  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: <CheckCircle className="h-5 w-5 text-green-500" aria-hidden="true" />,
          text: 'text-green-800'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />,
          text: 'text-red-800'
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: <Info className="h-5 w-5 text-blue-500" aria-hidden="true" />,
          text: 'text-blue-800'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          icon: <Info className="h-5 w-5 text-gray-500" aria-hidden="true" />,
          text: 'text-gray-800'
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div className={`${styles.bg} p-4 rounded-lg shadow-md border ${styles.border} mb-2`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {styles.icon}
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${styles.text}`}>{message}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={() => onClose(id)}
          >
            <span className="sr-only">Fechar</span>
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Provider component
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Adicionar um novo toast
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
    return id;
  }, []);

  // Remover um toast específico
  const hideToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const value = { showToast, hideToast };

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Container de toasts fixo no canto inferior direito */}
      <div className="fixed bottom-0 right-0 p-6 w-full max-w-sm z-50 pointer-events-none">
        <div className="flex flex-col pointer-events-auto">
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              id={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={hideToast}
            />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

// Hook para usar o contexto
export function useToast() {
  return useContext(ToastContext);
}