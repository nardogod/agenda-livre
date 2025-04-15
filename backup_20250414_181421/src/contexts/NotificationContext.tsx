// src/contexts/NotificationContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '../services/notification';
import { Notification } from '../types/notification';
import { useAuth } from '../hooks/useAuth';

interface NotificationContextData {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationContext = createContext({} as NotificationContextData);

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  // Calcular notificações não lidas
  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  // Carregar notificações quando o usuário estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  // Função para buscar notificações
  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar notificações:', err);
      setError('Não foi possível carregar as notificações');
    } finally {
      setLoading(false);
    }
  };

  // Marcar notificação como lida
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, status: 'read' } 
          : notification
      ));
    } catch (err) {
      console.error('Erro ao marcar notificação como lida:', err);
      setError('Não foi possível marcar a notificação como lida');
    }
  };

  // Marcar todas as notificações como lidas
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(notifications.map(notification => ({ ...notification, status: 'read' })));
    } catch (err) {
      console.error('Erro ao marcar todas notificações como lidas:', err);
      setError('Não foi possível marcar as notificações como lidas');
    }
  };

  // Excluir notificação
  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId);
      setNotifications(notifications.filter(notification => notification.id !== notificationId));
    } catch (err) {
      console.error('Erro ao excluir notificação:', err);
      setError('Não foi possível excluir a notificação');
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      error,
      markAsRead: handleMarkAsRead,
      markAllAsRead: handleMarkAllAsRead,
      deleteNotification: handleDeleteNotification,
      refreshNotifications: fetchNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
}