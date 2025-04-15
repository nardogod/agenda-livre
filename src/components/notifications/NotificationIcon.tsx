// src/components/notifications/NotificationIcon.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const NotificationIcon: React.FC = () => {
  const { notifications, unreadCount, markAsRead, deleteNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha o menu quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const handleDelete = (id: string) => {
    deleteNotification(id);
  };

  const formatNotificationDate = (dateString?: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
    } catch (error) {
      return '';
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        data-testid="notification-icon"
        className="relative p-2 text-gray-500 hover:text-purple-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span 
            data-testid="notification-count"
            className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
          >
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <h3 className="font-medium">Notificações</h3>
          </div>
          
          {notifications.length === 0 ? (
            <div className="px-4 py-4 text-sm text-gray-500 text-center">
              Não há notificações
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors ${
                    notification.status === 'unread' ? 'bg-purple-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium">{notification.title}</h4>
                      {notification.message && (
                        <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                      )}
                      {notification.createdAt && (
                        <p className="text-xs text-gray-400 mt-1">
                          {formatNotificationDate(notification.createdAt)}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      {notification.status === 'unread' && (
                        <button 
                          className="text-xs text-purple-600 hover:text-purple-800"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Marcar como lida
                        </button>
                      )}
                      <button 
                        className="text-xs text-gray-400 hover:text-gray-600 ml-2"
                        onClick={() => handleDelete(notification.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};