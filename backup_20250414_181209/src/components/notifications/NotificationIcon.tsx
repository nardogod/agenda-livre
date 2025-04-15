// src/components/notifications/NotificationIcon.tsx
import React from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';

interface NotificationIconProps {
  onClick: () => void;
}

export const NotificationIcon: React.FC<NotificationIconProps> = ({ onClick }) => {
  const { unreadCount, notifications } = useNotifications() || { unreadCount: 0, notifications: [] };

  // Garantir que notifications seja sempre um array
  const validNotifications = Array.isArray(notifications) ? notifications : [];

  // Log de erro caso notifications não seja um array
  if (!Array.isArray(notifications)) {
    console.error('Notifications data is not an array:', notifications);
  }

  // Exemplo de uso seguro de .some
  const hasImportantNotifications = validNotifications.some(notification => notification.important);

  return (
    <button 
      className="relative p-2 rounded-full hover:bg-gray-100"
      onClick={onClick}
      aria-label={`${unreadCount} notificações não lidas`}
    >
      <Bell size={20} className="text-gray-700" />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-purple-600 rounded-full">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
};