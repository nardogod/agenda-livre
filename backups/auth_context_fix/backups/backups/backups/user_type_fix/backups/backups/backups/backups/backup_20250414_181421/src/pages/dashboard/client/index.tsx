// src/pages/dashboard/client/index.tsx

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Calendar, Clock, MapPin, AlertTriangle, Check } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import ClientDashboardLayout from '../../../components/layout/ClientDashboardLayout';
import { getAppointments, cancelAppointment } from '../../../services/booking';
import { useAuth } from '../../../../../../../../../../../../auth_context_fix/backups/auth_context_fix/backups/auth_context_fix/src/contexts/AuthContext.tsx';

export default function ClientAppointments() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  
  const queryClient = useQueryClient();

  // Redirecionar se não estiver autenticado
  React.useEffect(() => {
    if (!isAuthenticated && !user) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, user, router]);

  // Buscar agendamentos
  const { data, isLoading, error } = useQuery(
    ['appointments', 'active'],
    () => getAppointments('confirmed'),
    {
      enabled: !!user,
      refetchInterval: 30000 // Recarregar a cada 30 segundos para ver atualizações
    }
  );

  // Mutação para cancelar agendamento
  const cancelMutation = useMutation(
    (id) => cancelAppointment(id, cancelReason),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['appointments', 'active']);
        setShowCancelModal(false);
        setCancelReason('');
      }
    }
  );

  const handleCancelAppointment = () => {
    if (selectedAppointment) {
      cancelMutation.mutate(selectedAppointment.id);
    }
  };

  const openCancelModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  if (isLoading) {
    return (
      <ClientDashboardLayout title="Meus Agendamentos">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </ClientDashboardLayout>
    );
  }

  if (error) {
    return (
      <ClientDashboardLayout title="Meus Agendamentos">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Ocorreu um erro ao carregar seus agendamentos. Por favor, tente novamente.
        </div>
      </ClientDashboardLayout>
    );
  }

  const appointments = data?.results || [];

  return (
    <ClientDashboardLayout title="Meus Agendamentos">
      {appointments.length === 0 ? (
        <div className="bg-white rounded-xl p-6 text-center">
          <div className="flex flex-col items-center">
            <Calendar size={48} className="text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Você não tem agendamentos ativos</h3>
            <p className="text-gray-500 mb-4">Que tal agendar um novo serviço agora?</p>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-purple-600 text-white rounded-xl font-medium"
            >
              Encontrar profissionais
            </button>
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
                  {appointment.status === 'confirmed' ? (
                    <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full flex items-center">
                      <Check size={12} className="mr-1" />
                      Confirmado
                    </span>
                  ) : appointment.status === 'pending_payment' ? (
                    <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full flex items-center">
                      <AlertTriangle size={12} className="mr-1" />
                      Aguardando pagamento
                    </span>
                  ) : null}
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
                {appointment.is_home_service && appointment.address && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin size={16} className="mr-2 text-gray-400" />
                    <span>
                      {appointment.address.street}, {appointment.address.number}
                      {appointment.address.complement && `, ${appointment.address.complement}`} - 
                      {appointment.address.district}
                    </span>
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-1">Valor total:</span>
                  <span className="text-purple-600 font-medium">
                    R$ {appointment.total_price.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => openCancelModal(appointment)}
                  className="px-3 py-1.5 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de cancelamento */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5">
            <h3 className="text-lg font-medium mb-3">Cancelar agendamento</h3>
            <p className="text-gray-600 mb-4">
              Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo do cancelamento (opcional)
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg"
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Informe o motivo do cancelamento..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg"
              >
                Voltar
              </button>
              <button
                onClick={handleCancelAppointment}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
                disabled={cancelMutation.isLoading}
              >
                {cancelMutation.isLoading ? 'Cancelando...' : 'Confirmar cancelamento'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ClientDashboardLayout>
  );
}