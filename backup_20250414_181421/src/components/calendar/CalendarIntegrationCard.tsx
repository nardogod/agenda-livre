// src/components/calendar/CalendarIntegrationCard.tsx
import React, { useState } from 'react';
import { Calendar, RefreshCw, Trash2 } from 'lucide-react';

interface CalendarIntegrationCardProps {
  integration: {
    id: string;
    provider: 'google' | 'outlook' | 'apple';
    isConnected: boolean;
    lastSyncedAt: string | null;
  };
  onSync: (id: string) => Promise<void>;
  onDisconnect: (id: string) => Promise<void>;
}

export const CalendarIntegrationCard: React.FC<CalendarIntegrationCardProps> = ({
  integration,
  onSync,
  onDisconnect
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleSync = async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    try {
      await onSync(integration.id);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    if (isDisconnecting) return;
    
    if (window.confirm(`Tem certeza que deseja desconectar o calendário ${getProviderName(integration.provider)}?`)) {
      setIsDisconnecting(true);
      try {
        await onDisconnect(integration.id);
      } finally {
        setIsDisconnecting(false);
      }
    }
  };

  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'google': return 'Google Calendar';
      case 'outlook': return 'Outlook Calendar';
      case 'apple': return 'Apple Calendar';
      default: return provider;
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl mb-4 border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg mr-3 ${
            integration.provider === 'google' ? 'bg-red-50 text-red-600' :
            integration.provider === 'outlook' ? 'bg-blue-50 text-blue-600' :
            'bg-gray-50 text-gray-600'
          }`}>
            <Calendar size={20} />
          </div>
          <div>
            <h4 className="font-medium">{getProviderName(integration.provider)}</h4>
            <p className="text-xs text-gray-500 mt-1">
              {integration.lastSyncedAt 
                ? `Última sincronização: ${new Date(integration.lastSyncedAt).toLocaleString()}`
                : 'Nunca sincronizado'}
            </p>
          </div>
        </div>
        <div className="flex">
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className={`p-2 mr-2 rounded-lg ${
              isSyncing ? 'bg-gray-100 text-gray-400' : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
            }`}
            title="Sincronizar"
          >
            <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={handleDisconnect}
            disabled={isDisconnecting}
            className={`p-2 rounded-lg ${
              isDisconnecting ? 'bg-gray-100 text-gray-400' : 'bg-red-50 text-red-600 hover:bg-red-100'
            }`}
            title="Desconectar"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};