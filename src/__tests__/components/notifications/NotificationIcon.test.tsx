// src/__tests__/components/notifications/NotificationIcon.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NotificationIcon } from '../../../components/notifications/NotificationIcon';
import { useNotifications } from '../../../contexts/NotificationContext';

// Mock do hook useNotifications
jest.mock('../../../contexts/NotificationContext', () => ({
  useNotifications: jest.fn(),
}));

describe('NotificationIcon Component', () => {
  beforeEach(() => {
    // Mock default do hook
    (useNotifications as jest.Mock).mockReturnValue({
      unreadCount: 0,
      notifications: [],
      markAsRead: jest.fn(),
      deleteNotification: jest.fn(),
    });
  });

  it('renderiza ícone de notificação', () => {
    render(<NotificationIcon />);
    
    // Verifica se o ícone está presente
    const icon = screen.getByTestId('notification-icon');
    expect(icon).toBeInTheDocument();
  });

  it('mostra contador quando há notificações não lidas', () => {
    // Mock com notificações não lidas
    (useNotifications as jest.Mock).mockReturnValue({
      unreadCount: 3,
      notifications: [
        { id: '1', title: 'Notificação 1', status: 'unread' },
        { id: '2', title: 'Notificação 2', status: 'unread' },
        { id: '3', title: 'Notificação 3', status: 'unread' },
      ],
      markAsRead: jest.fn(),
      deleteNotification: jest.fn(),
    });

    render(<NotificationIcon />);
    
    // Verifica se o contador está presente e com o valor correto
    const counter = screen.getByText('3');
    expect(counter).toBeInTheDocument();
  });

  it('não mostra contador quando não há notificações não lidas', () => {
    (useNotifications as jest.Mock).mockReturnValue({
      unreadCount: 0,
      notifications: [],
      markAsRead: jest.fn(),
      deleteNotification: jest.fn(),
    });

    render(<NotificationIcon />);
    
    // Verifica que não tem contador
    const counter = screen.queryByTestId('notification-count');
    expect(counter).not.toBeInTheDocument();
  });

  it('abre o menu de notificações ao clicar no ícone', () => {
    // Mock com uma notificação
    (useNotifications as jest.Mock).mockReturnValue({
      unreadCount: 1,
      notifications: [
        { id: '1', title: 'Notificação de teste', status: 'unread' },
      ],
      markAsRead: jest.fn(),
      deleteNotification: jest.fn(),
    });

    render(<NotificationIcon />);
    
    // Menu deve estar fechado inicialmente
    expect(screen.queryByText('Notificação de teste')).not.toBeInTheDocument();
    
    // Clica no ícone
    fireEvent.click(screen.getByTestId('notification-icon'));
    
    // Verifica se o menu abriu com a notificação
    expect(screen.getByText('Notificação de teste')).toBeInTheDocument();
  });
});