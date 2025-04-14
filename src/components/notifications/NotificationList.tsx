// src/components/notifications/NotificationList.tsx
import React from 'react';
import { Check, Trash2, X, Calendar, DollarSign, Star, Bell } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NotificationListProps {
  onClose: () => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({ onClose }) => {
  const { 
    notifications, 
    loading, 
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications();

  // Função para formatar a data relativa
  const formatRelativeTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: true,
      locale: ptBR
    });
  };

  // Função para renderizar o ícone de acordo com o tipo de notificação
  const renderNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <div className="p-2 bg-blue-100 rounded-full text-blue-600"><Calendar size={16} /></div>;
      case 'payment':
        return <div className="p-2 bg-green-100 rounded-full text-green-600"><DollarSign size={16} /></div>;
      case 'review':
        return <div className="p-2 bg-yellow-100 rounded-full text-yellow-600"><Star size={16} /></div>;
      default:
        return <div className="p-2 bg-purple-100 rounded-full text-purple-600"><Bell size={16} /></div>;
    }
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium">Notificações</h3>
        <div className="flex space-x-2">
          {notifications.some(n => n.status === 'unread') && (
            <button 
              onClick={() => markAllAsRead()}
              className="p-1 text-gray-500 hover:text-purple-600"
              title="Marcar todas como lidas"
            >
              <Check size={16} />
            </button>
          )}
          <button 
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700"
            title="Fechar"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Carregando notificações...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-600">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">Você não tem notificações.</div>
        ) : (
          <div>
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 border-b hover:bg-gray-50 ${notification.status === 'unread' ? 'bg-purple-50' : ''}`}
              >
                <div className="flex">
                  <div className="mr-3 mt-1">
                    {renderNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {formatRelativeTime(notification.createdAt)}
                      </span>
                      <div className="flex space-x-1">
                        {notification.status === 'unread' && (
                          <button 
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 text-gray-400 hover:text-purple-600"
                            title="Marcar como lida"
                          >
                            <Check size={14} />
                          </button>
                        )}
                        <button 
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};