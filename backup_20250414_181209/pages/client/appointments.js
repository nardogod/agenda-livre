import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, MapPin, AlertCircle, Check, X } from 'lucide-react';
import ClientDashboardLayout from '../../components/layouts/ClientDashboardLayout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { appointmentService } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

// Componente de card de agendamento
const AppointmentCard = ({ appointment, onCancel }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  
  // Formatação de data e hora
  const formattedDate = format(parseISO(appointment.start_datetime), "d 'de' MMMM", { locale: ptBR });
  const formattedTime = format(parseISO(appointment.start_datetime), "HH:mm");
  const formattedEndTime = format(parseISO(appointment.end_datetime), "HH:mm");
  
  // Função para cancelar agendamento
  const handleCancel = async () => {
    if (window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
      setIsCancelling(true);
      try {
        await onCancel(appointment.id);
      } finally {
        setIsCancelling(false);
      }
    }
  };
  
  // Cálculo de status de cor com base no status
  const getStatusColor = () => {
    switch (appointment.status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending_payment':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Tradução de status
  const getStatusText = () => {
    switch (appointment.status) {
      case 'confirmed':
        return 'Confirmado';
      case 'completed':
        return 'Concluído';
      case 'pending_payment':
        return 'Aguardando pagamento';
      case 'cancelled':
        return 'Cancelado';
      case 'no_show':
        return 'Não compareceu';
      default:
        return appointment.status;
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900">{appointment.service.name}</h3>
            <p className="text-gray-500 text-sm">com {appointment.professional.user.first_name} {appointment.professional.user.last_name}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        
        <div className="mt-3 flex items-center text-sm text-gray-600">
          <Calendar size={16} className="mr-2" />
          <span>{formattedDate}</span>
        </div>
        
        <div className="mt-2 flex items-center text-sm text-gray-600">
          <Clock size={16} className="mr-2" />
          <span>{formattedTime} - {formattedEndTime}</span>
        </div>
        
        {appointment.is_home_service && (
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <MapPin size={16} className="mr-2" />
            <span>Serviço a domicílio</span>
          </div>
        )}
        
        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-purple-600 text-sm font-medium"
          >
            {isExpanded ? 'Ver menos' : 'Ver detalhes'}
          </button>
          
          {appointment.status === 'confirmed' && (
            <button
              onClick={handleCancel}
              disabled={isCancelling}
              className="text-red-600 text-sm font-medium"
            >
              {isCancelling ? 'Cancelando...' : 'Cancelar'}
            </button>
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Serviço</span>
              <span className="text-gray-800 text-sm font-medium">{appointment.service.name}</span>
            </div>
            
            {appointment.use_own_hair === false && (
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Cabelo fornecido</span>
                <span className="text-gray-800 text-sm font-medium">
                  {appointment.hair_length === 'small' ? 'Curto' : 
                   appointment.hair_length === 'medium' ? 'Médio' : 'Longo'}
                </span>
              </div>
            )}
            
            {appointment.has_allergies && (
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Alergias</span>
                <span className="text-gray-800 text-sm font-medium">Sim</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Valor pago</span>
              <span className="text-gray-800 text-sm font-medium">R$ {appointment.total_price.toFixed(2)}</span>
            </div>
            
            {appointment.notes && (
              <div className="pt-2">
                <span className="text-gray-600 text-sm block mb-1">Observações:</span>
                <p className="text-gray-800 text-sm">{appointment.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Componente principal de agendamentos
function ClientAppointments() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  
  // Buscar os agendamentos do cliente
  const { data: appointments, isLoading, error } = useQuery(
    'clientAppointments', 
    () => appointmentService.getAll()
      .then(res => res.data)
      .catch(err => {
        showToast('Erro ao carregar agendamentos', 'error');
        throw err;
      }),
    {
      staleTime: 1000 * 60 * 5, // 5 minutos
    }
  );
  
  // Mutation para cancelar agendamento
  const cancelMutation = useMutation(
    (appointmentId) => appointmentService.cancel(appointmentId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('clientAppointments');
        showToast('Agendamento cancelado com sucesso', 'success');
      },
      onError: () => {
        showToast('Erro ao cancelar agendamento', 'error');
      }
    }
  );
  
  // Filtrar os agendamentos ativos (sem cancelados ou concluídos)
  const activeAppointments = appointments?.filter(
    app => !['cancelled', 'completed', 'no_show'].includes(app.status)
  ) || [];
  
  // Renderização de estado de carregamento
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-medium text-gray-900 mb-6">Meus Agendamentos</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-2/5"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Renderização de erro
  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-medium text-gray-900 mb-6">Meus Agendamentos</h1>
        <div className="bg-red-50 p-4 rounded-xl">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Erro ao carregar agendamentos
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Ocorreu um erro ao buscar seus agendamentos. Tente novamente mais tarde.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-medium text-gray-900 mb-2">Meus Agendamentos</h1>
      <p className="text-gray-500 mb-6">Gerencie seus compromissos</p>
      
      {activeAppointments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Sem agendamentos ativos</h3>
          <p className="mt-1 text-sm text-gray-500">
            Você não possui agendamentos ativos no momento.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-purple-600 hover:bg-purple-700"
            >
              Agendar serviço
            </button>
          </div>
        </div>
      ) : (
        <div>
          {activeAppointments.map(appointment => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onCancel={(id) => cancelMutation.mutate(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Componente envolvendo a rota protegida
export default function ClientAppointmentsPage() {
  return (
    <ProtectedRoute>
      <ClientDashboardLayout>
        <ClientAppointments />
      </ClientDashboardLayout>
    </ProtectedRoute>
  );
}