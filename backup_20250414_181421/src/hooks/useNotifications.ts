import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  message: string;
  important: boolean;
  read: boolean;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications'); // 🔁 API interna
        if (!res.ok) throw new Error(`Erro na API: ${res.status}`);
        const data: Notification[] = await res.json();

        if (isMounted) {
          setNotifications(data);
          setUnreadCount(data.filter(n => !n.read).length);
        }
      } catch (err) {
        console.error('Erro ao buscar notificações:', err);
        if (isMounted) {
          setNotifications([]);
          setUnreadCount(0);
        }
      }
    };

    fetchNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  return { notifications, unreadCount };
};
