import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Star, AlertCircle } from 'lucide-react';
import ClientDashboardLayout from '../../components/layouts/ClientDashboardLayout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { useToast } from '../../contexts/ToastContext';
import { useRouter } from 'next/router';

// Componente de card de agendamento do histórico
const HistoryAppointmentCard = ({ appointment }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Formatação de data e hora
  const formattedDate = new Date(appointment.start_datetime).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  const formattedTime = new Date(appointment.start_datetime).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  
  // Cálculo de status de cor com base no status
  const getStatusColor = () => {
    switch (appointment.status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no_show':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Tradução de status
  const getStatusText = () => {
    switch (appointment.status) {
      case 'completed':
        return 'Concluído';
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
          <span>{formattedTime}</span>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-purple-600 text-sm font-medium"
          >
            {isExpanded ? 'Ver menos' : 'Ver detalhes'}
          </button>
          
          {appointment.status === 'completed' && !appointment.has_review && (
            <button
              className="text-yellow-600 text-sm font-medium flex items-center"
            >
              <Star size={14} className="mr-1" />
              Avaliar
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

// Componente principal de histórico
function ClientHistory() {
  const { showToast } = useToast();
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulação de dados para testes
    setTimeout(() => {
      try {
        // Dados mockados para teste
        const mockAppointments = [
          {
            id: 1,
            service: {
              name: 'Box Braids',
              price: 250
            },
            professional: {
              user: {
                first_name: 'Ana',
                last_name: 'Oliveira'
              }
            },
            start_datetime: '2025-04-10T14:00:00',
            end_datetime: '2025-04-10T17:00:00',
            status: 'completed',
            has_review: false,
            use_own_hair: true,
            total_price: 250,
            notes: 'Cliente pediu para fazer tranças mais finas.'
          },
          {
            id: 2,
            service: {
              name: 'Manutenção de Tranças',
              price: 100
            },
            professional: {
              user: {
                first_name: 'Ana',
                last_name: 'Oliveira'
              }
            },
            start_datetime: '2025-03-15T10:00:00',
            end_datetime: '2025-03-15T11:30:00',
            status: 'cancelled',
            has_review: false,
            use_own_hair: true,
            total_price: 100,
            notes: ''
          }
        ];
        
        setAppointments(mockAppointments);
        setIsLoading(false);
      } catch (err) {
        showToast('Erro ao carregar histórico', 'error');
        setError(err);
        setIsLoading(false);
      }
    }, 1000);
  }, [showToast]);
  
  // Renderização de estado de carregamento
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-medium text-gray-900 mb-6">Histórico</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
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
        <h1 className="text-2xl font-medium text-gray-900 mb-6">Histórico</h1>
        <div className="bg-red-50 p-4 rounded-xl">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Erro ao carregar histórico
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Ocorreu um erro ao buscar seu histórico. Tente novamente mais tarde.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-medium text-gray-900 mb-2">Histórico</h1>
      <p className="text-gray-500 mb-6">Seus agendamentos anteriores</p>
      
      {!appointments || appointments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <Clock className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Sem histórico</h3>
          <p className="mt-1 text-sm text-gray-500">
            Você ainda não possui agendamentos anteriores.
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
          {appointments.map(appointment => (
            <HistoryAppointmentCard
              key={appointment.id}
              appointment={appointment}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Componente envolvendo a rota protegida
export default function ClientHistoryPage() {
  return (
    <ProtectedRoute>
      <ClientDashboardLayout>
        <ClientHistory />
      </ClientDashboardLayout>
    </ProtectedRoute>
  );
}