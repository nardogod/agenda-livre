// src/pages/dashboard/professional/schedule.tsx

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Calendar, Clock, Plus, X, Trash } from 'lucide-react';
import { format, parseISO, startOfWeek, addDays, isSameDay, addHours, setHours, setMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import ProfessionalDashboardLayout from '../../../components/layout/ProfessionalDashboardLayout';
import { useAuth } from '../../../hooks/useAuth';
import api from '../../../services/api';
import { addScheduleBlock, removeScheduleBlock } from '../../../services/booking';

// Interface para horários de trabalho
interface WorkingHours {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

// Interface para bloqueios
interface ScheduleBlock {
  id: string;
  start_datetime: string;
  end_datetime: string;
  reason?: string;
}

// Componente de cabeçalho do dia
const DayHeader = ({ date, today }) => {
  const isToday = isSameDay(date, today);
  const dayName = format(date, 'EEEE', { locale: ptBR });
  const dayNumber = format(date, 'd');
  
  return (
    <div className={`text-center p-2 ${isToday ? 'bg-purple-50 text-purple-600' : ''}`}>
      <div className="text-xs font-medium uppercase">{dayName}</div>
      <div className={`text-lg font-semibold ${isToday ? 'text-purple-600' : ''}`}>{dayNumber}</div>
    </div>
  );
};

// Componente de hora na agenda
const TimeSlot = ({ time, appointments = [], workingHours, blocks, dayOfWeek }) => {
  // Verificar se está dentro do horário de trabalho
  const isWorkingHour = workingHours.some(wh => {
    if (wh.day_of_week !== dayOfWeek) return false;
    
    const slotTime = time;
    const startTime = wh.start_time;
    const endTime = wh.end_time;
    
    return slotTime >= startTime && slotTime < endTime;
  });
  
  // Verificar se está bloqueado
  const isBlocked = blocks.some(block => {
    const blockStart = format(parseISO(block.start_datetime), 'HH:mm');
    const blockEnd = format(parseISO(block.end_datetime), 'HH:mm');
    
    return time >= blockStart && time < blockEnd;
  });
  
  // Obter os agendamentos para este horário
  const appointmentsAtTime = appointments.filter(app => {
    const appTime = format(parseISO(app.start_datetime), 'HH:mm');
    return appTime === time;
  });
  
  return (
    <div 
      className={`h-14 border-b border-gray-100 relative ${
        isWorkingHour ? '' : 'bg-gray-50'
      } ${isBlocked ? 'bg-red-50' : ''}`}
    >
      {appointmentsAtTime.map(appointment => (
        <div 
          key={appointment.id}
          className="absolute left-0 right-0 rounded px-2 py-1 text-xs bg-purple-100 text-purple-800"
          style={{ 
            top: '2px',
            bottom: '2px',
          }}
        >
          <div className="font-medium truncate">{appointment.client.first_name} {appointment.client.last_name}</div>
          <div className="truncate">{appointment.service.name}</div>
        </div>
      ))}
    </div>
  );
};

export default function ProfessionalSchedule() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Segunda-feira
  
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockForm, setBlockForm] = useState({
    date: format(today, 'yyyy-MM-dd'),
    start_time: '09:00',
    end_time: '10:00',
    reason: ''
  });
  
  // Redirecionar se não estiver autenticado
  React.useEffect(() => {
    if (!isAuthenticated && !user) {
      router.push('/auth/login');
    } else if (user?.user_type !== 'professional') {
      router.push('/dashboard/client');
    }
  }, [isAuthenticated, user, router]);

  // Gerar dias da semana
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    return addDays(startOfCurrentWeek, i);
  });

  // Gerar horários do dia
  const dayHours = Array.from({ length: 12 }, (_, i) => {
    return format(setHours(setMinutes(today, 0), i + 8), 'HH:mm');
  });

  // Buscar horários de trabalho
  const { data: workingHoursData } = useQuery(
    'working-hours',
    async () => {
      const response = await api.get('/professionals/schedule/');
      return response.data;
    },
    {
      enabled: !!user && user.user_type === 'professional'
    }
  );

  // Buscar bloqueios
  const { data: blocksData } = useQuery(
    'schedule-blocks',
    async () => {
      const response = await api.get('/professionals/blocks/');
      return response.data;
    },
    {
      enabled: !!user && user.user_type === 'professional'
    }
  );

  // Buscar agendamentos da semana
  const { data: appointmentsData } = useQuery(
    'week-appointments',
    async () => {
      const startDate = format(weekDays[0], 'yyyy-MM-dd');
      const endDate = format(weekDays[6], 'yyyy-MM-dd');
      
      const response = await api.get('/professionals/appointments/', {
        params: { start_date: startDate, end_date: endDate }
      });
      return response.data;
    },
    {
      enabled: !!user && user.user_type === 'professional'
    }
  );

  // Mutações
  const addBlockMutation = useMutation(
    addScheduleBlock,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('schedule-blocks');
        setShowBlockModal(false);
      }
    }
  );

  const removeBlockMutation = useMutation(
    removeScheduleBlock,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('schedule-blocks');
      }
    }
  );

  // Handlers
  const handleBlockFormChange = (e) => {
    const { name, value } = e.target;
    setBlockForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddBlock = () => {
    const { date, start_time, end_time, reason } = blockForm;
    
    const startDateTime = `${date}T${start_time}:00`;
    const endDateTime = `${date}T${end_time}:00`;
    
    addBlockMutation.mutate({
      start_datetime: startDateTime,
      end_datetime: endDateTime,
      reason: reason || undefined
    });
  };

  const handleDeleteBlock = (blockId) => {
    if (window.confirm('Tem certeza que deseja remover este bloqueio?')) {
      removeBlockMutation.mutate(blockId);
    }
  };

  // Filtrar bloqueios por dia
  const getBlocksForDay = (date) => {
    if (!blocksData) return [];
    
    return blocksData.filter((block: ScheduleBlock) => {
      const blockDate = parseISO(block.start_datetime);
      return isSameDay(blockDate, date);
    });
  };

  // Filtrar agendamentos por dia
  const getAppointmentsForDay = (date) => {
    if (!appointmentsData?.results) return [];
    
    return appointmentsData.results.filter((appointment) => {
      const appointmentDate = parseISO(appointment.start_datetime);
      return isSameDay(appointmentDate, date);
    });
  };

  const workingHours = workingHoursData || [];
  const blocks = blocksData || [];

  return (
    <ProfessionalDashboardLayout title="Minha Agenda">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500">
          Gerencie sua disponibilidade e visualize seus agendamentos.
        </p>
        <button
          onClick={() => setShowBlockModal(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-xl flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Bloquear horário
        </button>
      </div>

      {/* Agenda semanal */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Horários */}
        <div className="grid grid-cols-8 border-b">
          <div className=""></div>
          {weekDays.map((day, idx) => (
            <DayHeader key={idx} date={day} today={today} />
          ))}
        </div>
        
        <div className="grid grid-cols-8">
          {/* Coluna de horários */}
          <div className="border-r border-gray-200">
            {dayHours.map((hour, idx) => (
              <div key={idx} className="h-14 flex items-center justify-center text-xs text-gray-500 border-b border-gray-100">
                {hour}
              </div>
            ))}
          </div>
          
          {/* Colunas dos dias */}
          {weekDays.map((day, dayIdx) => (
            <div key={dayIdx}>
              {dayHours.map((hour, hourIdx) => (
                <TimeSlot
                  key={hourIdx}
                  time={hour}
                  appointments={getAppointmentsForDay(day)}
                  workingHours={workingHours}
                  blocks={getBlocksForDay(day)}
                  dayOfWeek={day.getDay()}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bloqueios ativos */}
      <div className="mt-8">
        <h2 className="text-lg font-medium mb-4">Bloqueios ativos</h2>
        
        {blocks.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center">
            <p className="text-gray-500">Você não tem bloqueios ativos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blocks.map((block: ScheduleBlock) => (
              <div key={block.id} className="bg-white rounded-xl p-4 border border-red-200">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">
                      {format(parseISO(block.start_datetime), "dd 'de' MMMM", { locale: ptBR })}
                    </p>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Clock size={14} className="mr-1.5 text-gray-400" />
                      {format(parseISO(block.start_datetime), "HH:mm", { locale: ptBR })} - 
                      {format(parseISO(block.end_datetime), " HH:mm", { locale: ptBR })}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteBlock(block.id)}
                    className="text-red-500 p-1 hover:bg-red-50 rounded-full"
                  >
                    <Trash size={18} />
                  </button>
                </div>
                
                {block.reason && (
                  <p className="text-sm text-gray-500 mt-2 border-t pt-2">
                    {block.reason}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de adicionar bloqueio */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-medium">Bloquear horário</h3>
              <button
                onClick={() => setShowBlockModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data
                </label>
                <input
                  type="date"
                  name="date"
                  value={blockForm.date}
                  onChange={handleBlockFormChange}
                  className="w-full p-3 border border-gray-300 rounded-xl"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horário inicial
                  </label>
                  <input
                    type="time"
                    name="start_time"
                    value={blockForm.start_time}
                    onChange={handleBlockFormChange}
                    className="w-full p-3 border border-gray-300 rounded-xl"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horário final
                  </label>
                  <input
                    type="time"
                    name="end_time"
                    value={blockForm.end_time}
                    onChange={handleBlockFormChange}
                    className="w-full p-3 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo (opcional)
                </label>
                <textarea
                  name="reason"
                  value={blockForm.reason}
                  onChange={handleBlockFormChange}
                  className="w-full p-3 border border-gray-300 rounded-xl"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowBlockModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddBlock}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg"
                disabled={addBlockMutation.isLoading}
              >
                {addBlockMutation.isLoading ? 'Salvando...' : 'Bloquear horário'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ProfessionalDashboardLayout>
  );
}