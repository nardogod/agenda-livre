// src/types/notification.ts
export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'appointment' | 'payment' | 'review' | 'system';
    status: 'read' | 'unread';
    createdAt: string;
    data?: Record<string, any>; // Dados adicionais específicos do tipo de notificação
  }