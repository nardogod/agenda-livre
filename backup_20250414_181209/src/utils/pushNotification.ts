// src/utils/pushNotification.ts

// Verificar se o navegador suporta notificações push
export const isPushNotificationSupported = () => {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  };
  
  // Solicitar permissão para enviar notificações push
  export const requestNotificationPermission = async () => {
    if (!isPushNotificationSupported()) {
      return { granted: false, reason: 'not-supported' };
    }
  
    try {
      const permission = await Notification.requestPermission();
      return { granted: permission === 'granted', reason: permission };
    } catch (error) {
      console.error('Erro ao solicitar permissão para notificações:', error);
      return { granted: false, reason: 'error' };
    }
  };
  
  // Registrar o service worker
  export const registerServiceWorker = async () => {
    if (!isPushNotificationSupported()) {
      return null;
    }
  
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      return registration;
    } catch (error) {
      console.error('Erro ao registrar service worker:', error);
      return null;
    }
  };
  
  // Obter o subscription do push
  export const getNotificationSubscription = async () => {
    if (!isPushNotificationSupported()) {
      return null;
    }
  
    try {
      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();
  
      // Se não existir uma subscription, criar uma nova
      if (!subscription) {
        // Aqui você precisaria ter as chaves VAPID do seu servidor
        // Este é apenas um exemplo e não funcionará sem as chaves reais
        const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_KEY;
        
        if (!publicVapidKey) {
          console.error('Chave VAPID pública não encontrada');
          return null;
        }
  
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        });
      }
  
      return subscription;
    } catch (error) {
      console.error('Erro ao obter subscription de push:', error);
      return null;
    }
  };
  
  // Função auxiliar para converter Base64 para Uint8Array (necessário para applicationServerKey)
  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }