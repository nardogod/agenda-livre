// pages/dashboard/professional/settings/calendar.tsx
import React, { useState } from 'react';
import ProfessionalDashboardLayout from '../../../../components/layout/ProfessionalDashboardLayout';
import { Calendar, Check, X, ArrowRight, Smartphone } from 'lucide-react';

// Interface para conexão de calendário
interface CalendarConnection {
  id: string;
  name: string;
  type: 'google' | 'outlook' | 'apple' | 'other';
  connected: boolean;
  lastSync?: Date;
}

// Interface para configurações de notificação
interface NotificationSetting {
  id: string;
  type: 'email' | 'sms' | 'app';
  event: 'new_booking' | 'reminder' | 'cancellation';
  enabled: boolean;
}

const ProfessionalCalendarSettingsPage = () => {
  // Estado para conexões de calendários
  const [calendarConnections, setCalendarConnections] = useState<CalendarConnection[]>([
    {
      id: 'google',
      name: 'Google Calendar',
      type: 'google',
      connected: false
    },
    {
      id: 'outlook',
      name: 'Microsoft Outlook',
      type: 'outlook',
      connected: false
    },
    {
      id: 'apple',
      name: 'Apple Calendar',
      type: 'apple',
      connected: false
    }
  ]);
  
  // Estado para configurações de sincronização
  const [syncSettings, setSyncSettings] = useState({
    syncNewBookings: true,
    syncCancellations: true,
    twoWaySync: false,
    syncPeriod: '30'
  });
  
  // Estado para configurações de notificações
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: 'new_booking_email',
      type: 'email',
      event: 'new_booking',
      enabled: true
    },
    {
      id: 'new_booking_sms',
      type: 'sms',
      event: 'new_booking',
      enabled: false
    },
    {
      id: 'reminder_email',
      type: 'email',
      event: 'reminder',
      enabled: true
    },
    {
      id: 'reminder_sms',
      type: 'sms',
      event: 'reminder',
      enabled: false
    },
    {
      id: 'cancellation_email',
      type: 'email',
      event: 'cancellation',
      enabled: true
    },
    {
      id: 'cancellation_sms',
      type: 'sms',
      event: 'cancellation',
      enabled: false
    }
  ]);
  
  // Estado para mensagens de sucesso/erro
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Conectar/desconectar calendário
  const toggleCalendarConnection = (id: string) => {
    setCalendarConnections(connections => 
      connections.map(conn => 
        conn.id === id 
          ? { ...conn, connected: !conn.connected, lastSync: !conn.connected ? new Date() : undefined } 
          : conn
      )
    );
  };
  
  // Atualizar configurações de sincronização
  const handleSyncSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSyncSettings({
      ...syncSettings,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };
  
  // Atualizar configurações de notificação
  const toggleNotification = (id: string) => {
    setNotifications(notifications =>
      notifications.map(notif =>
        notif.id === id
          ? { ...notif, enabled: !notif.enabled }
          : notif
      )
    );
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
          <h1 className="text-2xl font-bold">Configurações de Calendário</h1>
          <p className="text-gray-600">Conecte seu calendário e configure suas preferências de sincronização</p>
        </div>
        
        {/* Conexões de Calendário */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <h2 className="text-lg font-medium mb-4">Calendários Conectados</h2>
          
          <div className="space-y-4">
            {calendarConnections.map(connection => (
              <div key={connection.id} className="flex justify-between items-center border-b pb-4 last:border-0">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">{connection.name}</p>
                    {connection.connected && connection.lastSync && (
                      <p className="text-xs text-gray-500">
                        Última sincronização: {connection.lastSync.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => toggleCalendarConnection(connection.id)}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    connection.connected 
                      ? 'bg-red-50 text-red-700 hover:bg-red-100' 
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {connection.connected ? 'Desconectar' : 'Conectar'}
                </button>
              </div>
            ))}
            
            {calendarConnections.every(conn => !conn.connected) && (
              <div className="bg-amber-50 p-3 rounded-lg text-sm text-amber-700">
                <p>Você ainda não conectou nenhum calendário. Conecte seu calendário preferido para sincronizar seus agendamentos.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Configurações de Sincronização */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <h2 className="text-lg font-medium mb-4">Preferências de Sincronização</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="syncNewBookings" className="text-sm text-gray-700">
                Sincronizar novos agendamentos
              </label>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  id="syncNewBookings"
                  name="syncNewBookings"
                  checked={syncSettings.syncNewBookings}
                  onChange={handleSyncSettingChange}
                  className="hidden"
                />
                <div 
                  className={`w-12 h-6 rounded-full cursor-pointer ${syncSettings.syncNewBookings ? 'bg-purple-600' : 'bg-gray-300'}`}
                  onClick={() => setSyncSettings({...syncSettings, syncNewBookings: !syncSettings.syncNewBookings})}
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
                      syncSettings.syncNewBookings ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  ></span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label htmlFor="syncCancellations" className="text-sm text-gray-700">
                Sincronizar cancelamentos
              </label>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  id="syncCancellations"
                  name="syncCancellations"
                  checked={syncSettings.syncCancellations}
                  onChange={handleSyncSettingChange}
                  className="hidden"
                />
                <div 
                  className={`w-12 h-6 rounded-full cursor-pointer ${syncSettings.syncCancellations ? 'bg-purple-600' : 'bg-gray-300'}`}
                  onClick={() => setSyncSettings({...syncSettings, syncCancellations: !syncSettings.syncCancellations})}
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
                      syncSettings.syncCancellations ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  ></span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label htmlFor="twoWaySync" className="text-sm text-gray-700">
                Sincronização bidirecional
                <span className="block text-xs text-gray-500">
                  Agendamentos criados no calendário externo serão importados
                </span>
              </label>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  id="twoWaySync"
                  name="twoWaySync"
                  checked={syncSettings.twoWaySync}
                  onChange={handleSyncSettingChange}
                  className="hidden"
                />
                <div 
                  className={`w-12 h-6 rounded-full cursor-pointer ${syncSettings.twoWaySync ? 'bg-purple-600' : 'bg-gray-300'}`}
                  onClick={() => setSyncSettings({...syncSettings, twoWaySync: !syncSettings.twoWaySync})}
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
                      syncSettings.twoWaySync ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  ></span>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="syncPeriod" className="block text-sm font-medium text-gray-700 mb-1">
                Período de sincronização
              </label>
              <select
                id="syncPeriod"
                name="syncPeriod"
                value={syncSettings.syncPeriod}
                onChange={handleSyncSettingChange}
                className="w-full p-2 bg-white border border-gray-200 rounded-lg"
              >
                <option value="7">7 dias</option>
                <option value="14">14 dias</option>
                <option value="30">30 dias</option>
                <option value="60">60 dias</option>
                <option value="90">90 dias</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Configurações de Notificação */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <h2 className="text-lg font-medium mb-4">Notificações</h2>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-500">NOVOS AGENDAMENTOS</h3>
            
            {notifications
              .filter(notif => notif.event === 'new_booking')
              .map(notif => (
                <div key={notif.id} className="flex items-center justify-between">
                  <label htmlFor={notif.id} className="text-sm text-gray-700">
                    {notif.type === 'email' ? 'Email' : notif.type === 'sms' ? 'SMS' : 'Notificação no app'}
                  </label>
                  <div className="relative inline-block w-12 align-middle select-none">
                    <input
                      type="checkbox"
                      id={notif.id}
                      checked={notif.enabled}
                      onChange={() => toggleNotification(notif.id)}
                      className="hidden"
                    />
                    <div 
                      className={`w-12 h-6 rounded-full cursor-pointer ${notif.enabled ? 'bg-purple-600' : 'bg-gray-300'}`}
                      onClick={() => toggleNotification(notif.id)}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
                          notif.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      ></span>
                    </div>
                  </div>
                </div>
              ))
            }
            
            <h3 className="text-sm font-medium text-gray-500 mt-6">LEMBRETES</h3>
            
            {notifications
              .filter(notif => notif.event === 'reminder')
              .map(notif => (
                <div key={notif.id} className="flex items-center justify-between">
                  <label htmlFor={notif.id} className="text-sm text-gray-700">
                    {notif.type === 'email' ? 'Email' : notif.type === 'sms' ? 'SMS' : 'Notificação no app'}
                  </label>
                  <div className="relative inline-block w-12 align-middle select-none">
                    <input
                      type="checkbox"
                      id={notif.id}
                      checked={notif.enabled}
                      onChange={() => toggleNotification(notif.id)}
                      className="hidden"
                    />
                    <div 
                      className={`w-12 h-6 rounded-full cursor-pointer ${notif.enabled ? 'bg-purple-600' : 'bg-gray-300'}`}
                      onClick={() => toggleNotification(notif.id)}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
                          notif.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      ></span>
                    </div>
                  </div>
                </div>
              ))
            }
            
            <h3 className="text-sm font-medium text-gray-500 mt-6">CANCELAMENTOS</h3>
            
            {notifications
              .filter(notif => notif.event === 'cancellation')
              .map(notif => (
                <div key={notif.id} className="flex items-center justify-between">
                  <label htmlFor={notif.id} className="text-sm text-gray-700">
                    {notif.type === 'email' ? 'Email' : notif.type === 'sms' ? 'SMS' : 'Notificação no app'}
                  </label>
                  <div className="relative inline-block w-12 align-middle select-none">
                    <input
                      type="checkbox"
                      id={notif.id}
                      checked={notif.enabled}
                      onChange={() => toggleNotification(notif.id)}
                      className="hidden"
                    />
                    <div 
                      className={`w-12 h-6 rounded-full cursor-pointer ${notif.enabled ? 'bg-purple-600' : 'bg-gray-300'}`}
                      onClick={() => toggleNotification(notif.id)}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
                          notif.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      ></span>
                    </div>
                  </div>
                </div>
              ))
            }
            
            <div className="mt-6 bg-gray-50 p-3 rounded-lg flex items-start">
              <Smartphone size={16} className="text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-600">
                As notificações por SMS exigem um número de telefone verificado. 
                <a href="#" className="text-purple-600 ml-1">Verifique seu número</a>
              </p>
            </div>
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

export default ProfessionalCalendarSettingsPage;