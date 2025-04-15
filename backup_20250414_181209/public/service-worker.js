// Service Worker para gerenciar notificações push
// Este arquivo deve ser colocado na pasta public do projeto Next.js

// Evento de instalação do service worker
self.addEventListener('install', (event) => {
    console.log('Service Worker instalado com sucesso');
  });
  
  // Evento de ativação
  self.addEventListener('activate', (event) => {
    console.log('Service Worker ativado com sucesso');
  });
  
  // Evento de notificação push
  self.addEventListener('push', (event) => {
    if (!event.data) return;
  
    try {
      const data = event.data.json();
      const { title, message, icon, badge, data: notificationData } = data;
  
      const options = {
        body: message,
        icon: icon || '/assets/icons/notification-icon.png',
        badge: badge || '/assets/icons/notification-badge.png',
        data: notificationData || {},
        vibrate: [100, 50, 100],
        actions: [
          {
            action: 'open',
            title: 'Abrir'
          },
          {
            action: 'close',
            title: 'Fechar'
          }
        ]
      };
  
      event.waitUntil(
        self.registration.showNotification(title, options)
      );
    } catch (error) {
      console.error('Erro ao processar notificação push:', error);
    }
  });
  
  // Evento de clique na notificação
  self.addEventListener('notificationclick', (event) => {
    const notification = event.notification;
    const action = event.action;
    const data = notification.data;
  
    notification.close();
  
    if (action === 'close') return;
  
    // Se o usuário clicou na notificação ou no botão "Abrir"
    if (action === 'open' || action === '') {
      // Abrir a URL específica baseada nos dados da notificação
      const urlToOpen = data.url || '/';
  
      event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
          // Verificar se já existe uma janela aberta com essa URL
          for (const client of clientList) {
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus();
            }
          }
          // Se não houver janela aberta, abrir uma nova
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
      );
    }
  });