// components/common/Toast.jsx
import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// Contexto para gerenciar toasts globalmente
export const ToastContext = React.createContext({
  showToast: () => {},
  hideToast: () => {}
});

// Tipos de toast
const TOAST_TYPES = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-500',
    textColor: 'text-white'
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-red-500',
    textColor: 'text-white'
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-amber-500',
    textColor: 'text-white'
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-500',
    textColor: 'text-white'
  }
};

// Hook personalizado para usar o toast
export const useToast = () => React.useContext(ToastContext);

// Componente de Toast
function Toast({ message, type = 'info', onClose, duration = 4000 }) {
  const [visible, setVisible] = useState(true);
  const toastType = TOAST_TYPES[type] || TOAST_TYPES.info;
  const Icon = toastType.icon;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Deixa a animação de fade out terminar
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  return (
    <div 
      className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center ${toastType.bgColor} ${toastType.textColor} transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{ minWidth: '280px', maxWidth: '90%' }}
    >
      <Icon size={20} className="mr-2 flex-shrink-0" />
      <span className="text-sm flex-1">{message}</span>
      <button 
        className="ml-3 p-1 hover:bg-white hover:bg-opacity-20 rounded-full" 
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}

// Provedor de Toasts
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  
  const showToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now().toString();
    setToasts(prevToasts => [...prevToasts, { id, message, type, duration }]);
    return id;
  };
  
  const hideToast = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };
  
  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
}

export default Toast;