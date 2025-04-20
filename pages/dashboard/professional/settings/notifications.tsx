// pages/dashboard/professional/settings/notifications.tsx
import React, { useState } from 'react';
import ProfessionalDashboardLayout from '../../../../components/layout/ProfessionalDashboardLayout';
import { Bell, Mail, MessageSquare, Smartphone, Check, AlertCircle } from 'lucide-react';

// Interface para configuração de notificação
interface NotificationSetting {
  id: string;
  type: 'push' | 'email' | 'sms';
  event: string;
  enabled: boolean;
}

// Interface para canais de notificação
interface NotificationChannel {
  id: string;
  type: 'push' | 'email' | 'sms';
  value: string;
  verified: boolean;
  primary: boolean;
}

const ProfessionalNotificationsPage: React.FC = () => {
  // Estado para configurações de notificação
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    // Notificações de cliente
    { id: 'new_booking_push', type: 'push', event: 'new_booking', enabled: true },
    { id: 'new_booking_email', type: 'email', event: 'new_booking', enabled: true },
    { id: 'new_booking_sms', type: 'sms', event: 'new_booking', enabled: false },
    
    { id: 'booking_reminder_push', type: 'push', event: 'booking_reminder', enabled: true },
    { id: 'booking_reminder_email', type: 'email', event: 'booking_reminder', enabled: false },
    { id: 'booking_reminder_sms', type: 'sms', event: 'booking_reminder', enabled: false },
    
    { id: 'booking_cancellation_push', type: 'push', event: 'booking_cancellation', enabled: true },
    { id: 'booking_cancellation_email', type: 'email', event: 'booking_cancellation', enabled: true },
    { id: 'booking_cancellation_sms', type: 'sms', event: 'booking_cancellation', enabled: false },
    
    // Notificações da plataforma
    { id: 'platform_update_push', type: 'push', event: 'platform_update', enabled: true },
    { id: 'platform_update_email', type: 'email', event: 'platform_update', enabled: true },
    
    { id: 'promotional_push', type: 'push', event: 'promotional', enabled: false },
    { id: 'promotional_email', type: 'email', event: 'promotional', enabled: false },
  ]);
  
  // Estado para canais de notificação
  const [channels, setChannels] = useState<NotificationChannel[]>([
    { id: 'email_1', type: 'email', value: 'ana.oliveira@email.com', verified: true, primary: true },
    { id: 'phone_1', type: 'sms', value: '(11) 97777-8888', verified: true, primary: true },
    { id: 'push_1', type: 'push', value: 'Este dispositivo', verified: true, primary: true },
  ]);
  
  // Estado para formulário de adição de novo canal
  const [newChannel, setNewChannel] = useState({
    type: 'email',
    value: ''
  });
  
  // Estado para feedback de sucesso
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Alternar configuração de notificação
  const toggleNotification = (id: string) => {
    setNotifications(notifications =>
      notifications.map(notif =>
        notif.id === id
          ? { ...notif, enabled: !notif.enabled }
          : notif
      )
    );
  };
  
  // Adicionar novo canal de comunicação
  const addNotificationChannel = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newChannel.value.trim()) return;
    
    // Em uma aplicação real, aqui seria feita uma validação mais robusta
    // e um processo de verificação do novo canal
    
    const id = `${newChannel.type}_${Date.now()}`;
    const newChannelObj: NotificationChannel = {
      id,
      type: newChannel.type as 'push' | 'email' | 'sms',
      value: newChannel.value.trim(),
      verified: false,
      primary: channels.filter(ch => ch.type === newChannel.type).length === 0
    };
    
    setChannels([...channels, newChannelObj]);
    setNewChannel({ type: 'email', value: '' });
  };
  
  // Remover canal de comunicação
  const removeChannel = (id: string) => {
    if (channels.length <= 1) {
      alert('Você precisa manter pelo menos um canal de comunicação.');
      return;
    }
    
    if (channels.find(ch => ch.id === id)?.primary) {
      alert('Você não pode remover seu canal principal de comunicação.');
      return;
    }
    
    setChannels(channels.filter(ch => ch.id !== id));
  };
  
  // Definir canal como principal
  const setAsPrimary = (id: string) => {
    const channel = channels.find(ch => ch.id === id);
    if (!channel || !channel.verified) return;
    
    setChannels(channels.map(ch => 
      ch.type === channel.type
        ? { ...ch, primary: ch.id === id }
        : ch
    ));
  };
  
  // Salvar configurações
  const saveSettings = () => {
    // Aqui você faria chamadas à API para salvar as configurações
    
    // Mostrar mensagem de sucesso temporária
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };
  
  return (
    <ProfessionalDashboardLayout>
      <div className="px-4 py-6 md:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Configurações de Notificações</h1>
          <p className="text-gray-600">Gerencie como e quando deseja receber notificações</p>
        </div>
        
        {/* Canais de comunicação */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <h2 className="text-lg font-medium mb-4">Canais de Comunicação</h2>
          
          {/* Lista de canais */}
          <div className="space-y-3 mb-4">
            {channels.map(channel => (
              <div key={channel.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div className="flex items-center">
                  {channel.type === 'email' && <Mail size={16} className="text-gray-500 mr-2" />}
                  {channel.type === 'sms' && <MessageSquare size={16} className="text-gray-500 mr-2" />}
                  {channel.type === 'push' && <Bell size={16} className="text-gray-500 mr-2" />}
                  
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium">{channel.value}</span>
                      {channel.primary && (
                        <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                          Principal
                        </span>
                      )}
                    </div>
                    
                    {!channel.verified && (
                      <span className="text-xs text-orange-600 flex items-center mt-0.5">
                        <AlertCircle size={12} className="mr-1" />
                        Não verificado
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  {!channel.primary && channel.verified && (
                    <button
                      onClick={() => setAsPrimary(channel.id)}
                      className="text-xs text-purple-600 mr-3"
                    >
                      Definir como principal
                    </button>
                  )}
                  
                  {!channel.primary && (
                    <button
                      onClick={() => removeChannel(channel.id)}
                      className="text-xs text-red-600"
                    >
                      Remover
                    </button>
                  )}
                  
                  {!channel.verified && (
                    <button
                      className="text-xs text-purple-600"
                    >
                      Verificar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Formulário para adicionar novo canal */}
          <form onSubmit={addNotificationChannel} className="mt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Adicionar novo canal</h3>
            <div className="flex space-x-3">
              <select
                value={newChannel.type}
                onChange={(e) => setNewChannel({...newChannel, type: e.target.value})}
                className="p-2 bg-white border border-gray-200 rounded-lg"
              >
                <option value="email">Email</option>
                <option value="sms">SMS</option>
              </select>
              
              <input
                type={newChannel.type === 'email' ? 'email' : 'tel'}
                value={newChannel.value}
                onChange={(e) => setNewChannel({...newChannel, value: e.target.value})}
                placeholder={newChannel.type === 'email' ? 'Seu email' : 'Seu telefone'}
                className="flex-1 p-2 bg-white border border-gray-200 rounded-lg"
              />
              
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Adicionar
              </button>
            </div>
          </form>
        </div>
        
        {/* Configurações de Notificação */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <h2 className="text-lg font-medium mb-4">Preferências de Notificação</h2>
          
          <div className="space-y-6">
            {/* Notificações de Agendamentos */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">AGENDAMENTOS</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Novos agendamentos</p>
                  <div className="mt-2 grid grid-cols-3 gap-3">
                    {notifications
                      .filter(notif => notif.event === 'new_booking')
                      .map(notif => (
                        <div key={notif.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={notif.id}
                            checked={notif.enabled}
                            onChange={() => toggleNotification(notif.id)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <label htmlFor={notif.id} className="ml-2 block text-sm text-gray-700">
                            {notif.type === 'push' ? 'Push' : notif.type === 'email' ? 'Email' : 'SMS'}
                          </label>
                        </div>
                      ))
                    }
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Lembretes de agendamento</p>
                  <div className="mt-2 grid grid-cols-3 gap-3">
                    {notifications
                      .filter(notif => notif.event === 'booking_reminder')
                      .map(notif => (
                        <div key={notif.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={notif.id}
                            checked={notif.enabled}
                            onChange={() => toggleNotification(notif.id)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <label htmlFor={notif.id} className="ml-2 block text-sm text-gray-700">
                            {notif.type === 'push' ? 'Push' : notif.type === 'email' ? 'Email' : 'SMS'}
                          </label>
                        </div>
                      ))
                    }
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Cancelamentos</p>
                  <div className="mt-2 grid grid-cols-3 gap-3">
                    {notifications
                      .filter(notif => notif.event === 'booking_cancellation')
                      .map(notif => (
                        <div key={notif.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={notif.id}
                            checked={notif.enabled}
                            onChange={() => toggleNotification(notif.id)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <label htmlFor={notif.id} className="ml-2 block text-sm text-gray-700">
                            {notif.type === 'push' ? 'Push' : notif.type === 'email' ? 'Email' : 'SMS'}
                          </label>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
            
            {/* Notificações da Plataforma */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">PLATAFORMA</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Atualizações da plataforma</p>
                  <div className="mt-2 grid grid-cols-3 gap-3">
                    {notifications
                      .filter(notif => notif.event === 'platform_update')
                      .map(notif => (
                        <div key={notif.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={notif.id}
                            checked={notif.enabled}
                            onChange={() => toggleNotification(notif.id)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <label htmlFor={notif.id} className="ml-2 block text-sm text-gray-700">
                            {notif.type === 'push' ? 'Push' : 'Email'}
                          </label>
                        </div>
                      ))
                    }
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Promoções e novidades</p>
                  <div className="mt-2 grid grid-cols-3 gap-3">
                    {notifications
                      .filter(notif => notif.event === 'promotional')
                      .map(notif => (
                        <div key={notif.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={notif.id}
                            checked={notif.enabled}
                            onChange={() => toggleNotification(notif.id)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <label htmlFor={notif.id} className="ml-2 block text-sm text-gray-700">
                            {notif.type === 'push' ? 'Push' : 'Email'}
                          </label>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-start">
            <Smartphone size={16} className="text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-600">
              As notificações por SMS exigem um número de telefone verificado. Tarifas de SMS podem ser aplicadas pela sua operadora.
            </p>
          </div>
        </div>
        
        {/* Botões de ação */}
        <div className="flex justify-between items-center">
          <button
            onClick={saveSettings}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center"
          >
            <Check size={18} className="mr-2" />
            Salvar configurações
          </button>
          
          {saveSuccess && (
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
              Configurações salvas com sucesso!
            </div>
          )}
        </div>
      </div>
    </ProfessionalDashboardLayout>
  );
};

export default ProfessionalNotificationsPage;