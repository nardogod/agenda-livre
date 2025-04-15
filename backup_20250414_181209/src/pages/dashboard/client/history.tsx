// src/pages/dashboard/client/history.tsx

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { Calendar, Clock, Check, X, Star } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import ClientDashboardLayout from '../../../components/layout/ClientDashboardLayout';
import { getAppointments } from '../../../services/booking';
import { useAuth } from '../../../hooks/useAuth';

export default function ClientAppointmentHistory() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('completed');
  
  // Redirecionar se não estiver autenticado
  React.useEffect(() => {
    if (!isAuthenticated && !user) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, user, router]);

  // Buscar agendamentos concluídos ou cancelados
  const { data: completedData, isLoading: completedLoading } = useQuery(
    ['appointments', 'completed'],
    () => getAppointments('completed'),
    {
      enabled: !!user && activeTab === 'completed'
    }
  );

  const { data: cancelledData, isLoading: cancelledLoading } = useQuery(
    ['appointments', 'cancelled'],
    () => getAppointments('cancelled'),
    {
      enabled: !!user && activeTab === 'cancelled'
    }
  );

  const isLoading = 
    (activeTab === 'completed' && completedLoading) || 
    (activeTab === 'cancelled' && cancelledLoading);

  const appointments = activeTab === 'completed' 
    ? (completedData?.results || [])
    : (cancelledData?.results || []);

  return (
    <ClientDashboardLayout title="Histórico de Agendamentos">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('completed')}
          className={`py-3 px-4 text-sm font-medium border-b-2 ${
            activeTab === 'completed'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Concluídos
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`py-3 px-4 text-sm font-medium border-b-2 ${
            activeTab === 'cancelled'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Cancelados
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-xl p-6 text-center">
          <div className="flex flex-col items-center">
            <ClipboardList size={48} className="text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Nenhum agendamento {activeTab === 'completed' ? 'concluído' : 'cancelado'}
            </h3>
            <p className="text-gray-500">
              {activeTab === 'completed'
                ? 'Seus agendamentos concluídos aparecerão aqui.'
                : 'Seus agendamentos cancelados aparecerão aqui.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-xl overflow-hidden">
                    <img 
                      src={appointment.professional.profile_image || '/assets/placeholders/profile-placeholder.svg'} 
                      alt={`${appointment.professional.user.first_name} ${appointment.professional.user.last_name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">{appointment.professional.user.first_name} {appointment.professional.user.last_name}</h3>
                    <p className="text-sm text-gray-500">{appointment.service.name}</p>
                  </div>
                </div>
                <div className="flex">
                  {activeTab === 'completed' ? (
                    <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full flex items-center">
                      <Check size={12} className="mr-1" />
                      Concluído
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 text-xs px-2.5 py-0.5 rounded-full flex items-center">
                      <X size={12} className="mr-1" />
                      Cancelado
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={16} className="mr-2 text-gray-400" />
                  <span>
                    {format(parseISO(appointment.start_datetime), "dd 'de' MMMM', às' HH:mm", { locale: ptBR })}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock size={16} className="mr-2 text-gray-400" />
                  <span>Duração: {appointment.service.duration} minutos</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-1">Valor total:</span>
                  <span className="text-purple-600 font-medium">
                    R$ {appointment.total_price.toFixed(2)}
                  </span>
                </div>
              </div>
              
              {activeTab === 'completed' && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => router.push(`/reviews/create/${appointment.id}`)}
                    className="px-3 py-1.5 text-sm border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 flex items-center"
                  >
                    <Star size={16} className="mr-1" />
                    Avaliar serviço
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </ClientDashboardLayout>
  );
}