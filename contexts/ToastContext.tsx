import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';

// Definição dos tipos de toast
type ToastType = 'success' | 'error' | 'info' | 'warning';

// Interface para o objeto toast
interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

// Interface para o contexto
interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => string;
  hideToast: (id: string) => void;
  toasts: Toast[];
}

// Valores padrão para o contexto
const defaultToastContext: ToastContextType = {
  showToast: () => '',
  hideToast: () => {},
  toasts: []
};

// Criação do contexto
const ToastContext = createContext<ToastContextType>(defaultToastContext);

// Props para o Provider
interface ToastProviderProps {
  children: ReactNode;
}

// Provider component
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Função para mostrar um toast
  const showToast = useCallback((message: string, type: ToastType = 'info', duration = 5000): string => {
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
  const hideToast = useCallback((id: string): void => {
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
                toast.type === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' :
                toast.type === 'error' ? 'bg-red-50 text-red-800 border-l-4 border-red-500' :
                toast.type === 'warning' ? 'bg-amber-50 text-amber-800 border-l-4 border-amber-500' :
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
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};

export default ToastContext;