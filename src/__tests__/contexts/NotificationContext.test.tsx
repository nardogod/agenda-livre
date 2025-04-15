// src/__tests__/contexts/NotificationContext.test.tsx
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { NotificationProvider, useNotifications } from '../../contexts/NotificationContext';
import * as notificationService from '../../services/notification';

// Mock do serviço de notificações
jest.mock('../../services/notification', () => ({
  getNotifications: jest.fn(),
  markAsRead: jest.fn(),
  deleteNotification: jest.fn(),
}));

// Componente de teste para acessar o contexto
const TestComponent = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    deleteNotification, 
    refreshNotifications 
  } = useNotifications();

  return (
    <div>
      <div data-testid="unread-count">{unreadCount}</div>
      <button onClick={() => markAsRead('1')}>Marcar como lida</button>
      <button onClick={() => deleteNotification('1')}>Excluir</button>
      <button onClick={refreshNotifications}>Atualizar</button>
      <ul>
        {notifications.map(notification => (
          <li key={notification.id}>{notification.title} - {notification.status}</li>
        ))}
      </ul>
    </div>
  );
};

describe('NotificationContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('carrega notificações corretamente', async () => {
    // Configurar o mock
    const mockNotifications = [
      { id: '1', title: 'Notificação 1', status: 'unread' },
      { id: '2', title: 'Notificação 2', status: 'read' }
    ];
    
    (notificationService.getNotifications as jest.Mock).mockResolvedValue(mockNotifications);

    // Renderizar com o Provider
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    // Verificar se as notificações foram carregadas
    await waitFor(() => {
      expect(screen.getByText('Notificação 1 - unread')).toBeInTheDocument();
      expect(screen.getByText('Notificação 2 - read')).toBeInTheDocument();
      expect(screen.getByTestId('unread-count').textContent).toBe('1');
    });
  });

  it('marca uma notificação como lida corretamente', async () => {
    // Setup
    (notificationService.getNotifications as jest.Mock).mockResolvedValue([
      { id: '1', title: 'Test Notification', status: 'unread' }
    ]);
    
    (notificationService.markAsRead as jest.Mock).mockResolvedValue({
      id: '1',
      title: 'Test Notification',
      status: 'read'
    });

    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    // Esperar carregar as notificações
    await waitFor(() => {
      expect(screen.getByText('Test Notification - unread')).toBeInTheDocument();
    });

    // Marcar como lida
    act(() => {
      screen.getByText('Marcar como lida').click();
    });

    // Verificar se foi atualizada
    await waitFor(() => {
      expect(notificationService.markAsRead).toHaveBeenCalledWith('1');
      expect(screen.getByText('Test Notification - read')).toBeInTheDocument();
      expect(screen.getByTestId('unread-count').textContent).toBe('0');
    });
  });

  it('exclui uma notificação corretamente', async () => {
    // Setup
    (notificationService.getNotifications as jest.Mock).mockResolvedValue([
      { id: '1', title: 'Test Notification', status: 'unread' }
    ]);
    
    (notificationService.deleteNotification as jest.Mock).mockResolvedValue(true);

    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    // Esperar carregar as notificações
    await waitFor(() => {
      expect(screen.getByText('Test Notification - unread')).toBeInTheDocument();
    });

    // Excluir notificação
    act(() => {
      screen.getByText('Excluir').click();
    });

    // Verificar se foi excluída
    await waitFor(() => {
      expect(notificationService.deleteNotification).toHaveBeenCalledWith('1');
      expect(screen.queryByText('Test Notification - unread')).not.toBeInTheDocument();
      expect(screen.getByTestId('unread-count').textContent).toBe('0');
    });
  });
});