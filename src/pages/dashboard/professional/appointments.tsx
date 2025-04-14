// src/pages/dashboard/professional/appointments.tsx

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Calendar, Clock, CheckCircle, XCircle, AlertTriangle, Filter, ChevronDown } from 'lucide-react';
import { format, parseISO, startOfToday, addDays, subDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import ProfessionalDashboardLayout from '../../../components/layout/ProfessionalDashboardLayout';
import { useAuth } from '../../../hooks/useAuth';
import { getProfessionalAppointments, updateAppointmentStatus } from '../../../services/booking';
import { Appointment } from '../../../types/booking';

// Componente de dia do calendário
const CalendarDay = ({ date, selectedDate, onSelect, hasAppointments }) => {
  const isToday = isSameDay(date, new Date());
  const isSelected = selectedDate && isSameDay(date, selectedDate);
  
  return (
    <button
      onClick={() => onSelect(date)}
      className={`flex flex-col items-center py-2 px-1 rounded-lg relative ${
        isSelected
          ? 'bg-purple-600 text-white'
          : isToday
          ? 'bg-purple-50 text-purple-600'
          : 'hover:bg-gray-50 text-gray-700'
      }`}
    >
      <span className="text-xs font-medium">{format(date, 'EEE', { locale: ptBR }).toUpperCase()}</span>
      <span className={`text-lg font-semibold ${isSelected ? 'text-white' : ''}`}>{format(date, 'd')}</span>
      {hasAppointments && (
        <div 
          className={`w-1.5 h-1.5 rounded-full mt-1 ${
            isSelected ? 'bg-white' : 'bg-purple-600'
          }`}
        />
      )}
    </button>
  );
};

export default function ProfessionalAppointments() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const today = startOfToday();
  const [selectedDate, setSelectedDate] = useState(today);
  const [calendarStartDate, setCalendarStartDate] = useState(today);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Redirecionar se não estiver autenticado
  React.useEffect(() => {
    if (!isAuthenticated && !user) {
      router.push('/auth/login');
    } else if (user?.user_type !== 'professional') {
      router.push('/dashboard/client');
    }
  }, [isAuthenticated, user, router]);

  // Gerar datas do calendário (7 dias)
  const calendarDates = Array.from({ length: 7 }, (_, i) => {
    return addDays(calendarStartDate, i);
  });

  // Navegar pelo calendário
  const navigateCalendar = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCalendarStartDate(subDays(calendarStartDate, 7));
    } else {
      setCalendarStartDate(addDays(calendarStartDate, 7));
    }
  };

  // Buscar agendamentos
  const { data: appointmentsData, isLoading } = useQuery(
    ['professional-appointments', format(selectedDate, 'yyyy-MM-dd')],
    () => getProfessionalAppointments(undefined, format(selectedDate, 'yyyy-MM-dd')),
    {
      enabled: !!user && user.user_type === 'professional'
    }
  );

  // Buscar agendamentos para todos os dias do calendário
  const { data: calendarAppointmentsData } = useQuery(
    ['calendar-appointments', format(calendarStartDate, 'yyyy-MM-dd')],
    async () => {
      const promises = calendarDates.map(date => {
        return getProfessionalAppointments(undefined, format(date, 'yyyy-MM-dd'))
          .then(response => ({ date, count: response.results.length }))
          .catch(() => ({ date, count: 0 }));
      });
      return Promise.all(promises);
    },
    {
      enabled: !!user && user.user_type === 'professional'
    }
  );

  // Mutação para atualizar status
  const updateStatusMutation = useMutation(
    ({ id, status }: { id: string; status: 'confirmed' | 'completed' | 'cancelled' | 'no_show' }) => 
      updateAppointmentStatus(id, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['professional-appointments', format(selectedDate, 'yyyy-MM-dd')]);
      }
    }
  );

  // Filtrar agendamentos por status
  const filterAppointments = (appointments: Appointment[]) => {
    if (statusFilter === 'all') {
      return appointments;
    }
    return appointments.filter(appointment => appointment.status === statusFilter);
  };

  // Verificar se uma data tem agendamentos
  const hasAppointments = (date: Date) => {
    if (!calendarAppointmentsData) return false;
    const dayData = calendarAppointmentsData.find(d => isSameDay(d.date, date));
    return dayData ? dayData.count > 0 : false;
  };

  // Obter a cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no_show':
        return 'bg-gray-100 text-gray-800';
      case 'pending_payment':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Obter o ícone do status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={16} className="mr-1 text-green-500" />;
      case 'completed':
        return <CheckCircle size={16} className="mr-1 text-blue-500" />;
      case 'cancelled':
        return <XCircle size={16} className="mr-1 text-red-500" />;
      case 'no_show':
        return <XCircle size={16} className="mr-1 text-gray-500" />;
      case 'pending_payment':
        return <AlertTriangle size={16} className="mr-1 text-amber-500" />;
      default:
        return null;
    }
  };

  // Obter o texto do status
  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      case 'no_show':
        return 'Não compareceu';
      case 'pending_payment':
        return 'Aguardando pagamento';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <ProfessionalDashboardLayout title="Agendamentos">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </ProfessionalDashboardLayout>
    );
  }

  const appointments = appointmentsData?.results || [];
  const filteredAppointments = filterAppointments(appointments);

  return (
    <ProfessionalDashboardLayout title="Agendamentos">
      {/* Calendário */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigateCalendar('prev')}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronDown size={20} className="transform rotate-90 text-gray-600" />
          </button>
          
          <div className="text-sm font-medium">
            {format(calendarStartDate, "MMMM 'de' yyyy", { locale: ptBR })}
          </div>
          
          <button
            onClick={() => navigateCalendar('next')}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronDown size={20} className="transform -rotate-90 text-gray-600" />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {calendarDates.map((date) => (
            <CalendarDay
              key={date.toString()}
              date={date}
              selectedDate={selectedDate}
              onSelect={setSelectedDate}
              hasAppointments={hasAppointments(date)}
            />
          ))}
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center text-sm font-medium text-gray-700"
        >
          <Filter size={16} className="mr-2 text-gray-500" />
          Filtrar por status
          <ChevronDown size={16} className={`ml-2 transform transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
        </button>
        
        {showFilters && (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                statusFilter === 'all'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter('confirmed')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                statusFilter === 'confirmed'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              Confirmados
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                statusFilter === 'completed'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              Concluídos
            </button>
            <button
              onClick={() => setStatusFilter('cancelled')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                statusFilter === 'cancelled'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              Cancelados
            </button>
            <button
              onClick={() => setStatusFilter('pending_payment')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                statusFilter === 'pending_payment'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              Aguardando pagamento
            </button>
            <button
              onClick={() => setStatusFilter('no_show')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                statusFilter === 'no_show'
                  ? 'bg-gray-400 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              Não compareceu
            </button>
          </div>
        )}
      </div>

      {/* Agendamentos do dia */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-medium">
            Agendamentos para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
          </h2>
        </div>
        
        {filteredAppointments.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">
              {statusFilter === 'all'
                ? 'Nenhum agendamento para esta data'
                : `Nenhum agendamento "${getStatusText(statusFilter)}" para esta data`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      <span className="text-gray-500 font-medium">
                        {appointment.client.first_name.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">{appointment.client.first_name} {appointment.client.last_name}</h3>
                      <div className="flex items-center text-xs text-gray-500 mt-0.5">
                        <Clock size={12} className="mr-1" />
                        {format(parseISO(appointment.start_datetime), "HH:mm", { locale: ptBR })} - 
                        {format(parseISO(appointment.end_datetime), " HH:mm", { locale: ptBR })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center ${getStatusColor(appointment.status)}`}>
                      {getStatusIcon(appointment.status)}
                      {getStatusText(appointment.status)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <p className="text-sm font-medium">{appointment.service.name}</p>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Duração:</span> {appointment.service.duration} minutos
                    </div>
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Valor:</span> R$ {appointment.total_price.toFixed(2)}
                    </div>
                    {appointment.is_home_service && (
                      <div className="text-xs text-gray-500 col-span-2">
                        <span className="font-medium">Serviço a domicílio:</span> Sim
                      </div>
                    )}
                    {appointment.use_own_hair === false && (
                      <div className="text-xs text-gray-500 col-span-2">
                        <span className="font-medium">Cabelo:</span> {
                          appointment.hair_length === 'small' ? 'Curto' :
                          appointment.hair_length === 'medium' ? 'Médio' : 'Longo'
                        }
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end space-x-2">
                  {appointment.status === 'confirmed' && (
                    <>
                      <button
                        onClick={() => updateStatusMutation.mutate({ id: appointment.id, status: 'completed' })}
                        className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg"
                      >
                        Marcar como concluído
                      </button>
                      <button
                        onClick={() => updateStatusMutation.mutate({ id: appointment.id, status: 'no_show' })}
                        className="px-3 py-1.5 text-xs border border-gray-300 text-gray-700 rounded-lg"
                      >
                        Não compareceu
                      </button>
                    </>
                  )}
                  {appointment.status === 'pending_payment' && (
                    <span className="text-xs text-amber-600">
                      Aguardando confirmação de pagamento
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProfessionalDashboardLayout>
  );
}