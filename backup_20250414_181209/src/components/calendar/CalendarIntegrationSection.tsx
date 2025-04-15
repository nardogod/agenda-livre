// src/components/calendar/CalendarIntegrationSection.tsx
import React, { useState, useEffect } from 'react';
import { getCalendarIntegrations, initiateCalendarAuth, disconnectCalendar, syncCalendarEvents } from '../../services/calendar';
import { CalendarIntegrationCard } from './CalendarIntegrationCard';
import { Calendar } from 'lucide-react';

export const CalendarIntegrationSection: React.FC = () => {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const data = await getCalendarIntegrations();
      setIntegrations(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar integrações de calendário');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (provider: 'google' | 'outlook' | 'apple') => {
    try {
      const { authUrl } = await initiateCalendarAuth(provider);
      // Redirecionar para a URL de autorização
      window.location.href = authUrl;
    } catch (err) {
      setError('Erro ao iniciar conexão com calendário');
      console.error(err);
    }
  };

  const handleDisconnect = async (integrationId: string) => {
    try {
      await disconnectCalendar(integrationId);
      // Atualizar lista de integrações
      fetchIntegrations();
    } catch (err) {
      setError('Erro ao desconectar calendário');
      console.error(err);
    }
  };

  const handleSync = async (integrationId: string) => {
    try {
      await syncCalendarEvents(integrationId);
      // Atualizar lista de integrações
      fetchIntegrations();
    } catch (err) {
      setError('Erro ao sincronizar calendário');
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Integrações de Calendário</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="py-4 text-center">Carregando integrações...</div>
      ) : (
        <>
          {integrations.length > 0 ? (
            <div>
              {integrations.map((integration) => (
                <CalendarIntegrationCard
                  key={integration.id}
                  integration={integration}
                  onSync={handleSync}
                  onDisconnect={handleDisconnect}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-xl mb-4">
              <p className="text-gray-500 mb-4">Você ainda não conectou nenhum calendário.</p>
            </div>
          )}
          
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <h3 className="font-medium mb-3">Conectar um novo calendário</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => handleConnect('google')}
                className="p-3 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50"
              >
                <div className="bg-red-50 text-red-600 p-2 rounded-lg mr-2">
                  <Calendar size={18} />
                </div>
                <span>Google Calendar</span>
              </button>
              
              <button
                onClick={() => handleConnect('outlook')}
                className="p-3 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50"
              >
                <div className="bg-blue-50 text-blue-600 p-2 rounded-lg mr-2">
                  <Calendar size={18} />
                </div>
                <span>Outlook Calendar</span>
              </button>
              
              <button
                onClick={() => handleConnect('apple')}
                className="p-3 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50"
              >
                <div className="bg-gray-50 text-gray-600 p-2 rounded-lg mr-2">
                  <Calendar size={18} />
                </div>
                <span>Apple Calendar</span>
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-3">
              Ao conectar seu calendário, seus agendamentos serão sincronizados automaticamente e você poderá gerenciar sua disponibilidade de forma mais eficiente.
            </p>
          </div>
        </>
      )}
    </div>
  );
};