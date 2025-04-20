// pages/dashboard/professional/schedule.tsx
import React, { useState } from 'react';
import ProfessionalDashboardLayout from '../../../components/layout/ProfessionalDashboardLayout';
import { Calendar, Clock, Plus, X, Check, AlertCircle, Home } from 'lucide-react';

// Interface para os eventos do calendário
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  client: string;
  service: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  isHomeService: boolean;
}

// Interface para os bloqueios de agenda
interface ScheduleBlock {
  id: string;
  start: Date;
  end: Date;
  reason: string;
}

// Interface para horários de trabalho
interface WorkingHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  active: boolean;
  start: string;
  end: string;
}

const ProfessionalSchedulePage = () => {
  // Estado para data atual do calendário
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'week' | 'day'>('week');
  
  // Estado para modal de bloqueio de agenda
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [blockFormData, setBlockFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    reason: ''
  });
  
  // Estado para modal de horários de trabalho
  const [hoursModalOpen, setHoursModalOpen] = useState(false);
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([
    { day: 'monday', active: true, start: '09:00', end: '18:00' },
    { day: 'tuesday', active: true, start: '09:00', end: '18:00' },
    { day: 'wednesday', active: true, start: '09:00', end: '18:00' },
    { day: 'thursday', active: true, start: '09:00', end: '18:00' },
    { day: 'friday', active: true, start: '09:00', end: '18:00' },
    { day: 'saturday', active: true, start: '09:00', end: '14:00' },
    { day: 'sunday', active: false, start: '09:00', end: '18:00' }
  ]);
  
  // Dados mockados de agendamentos
  const [appointments] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Box Braids',
      start: new Date(2025, 3, 17, 10, 0),
      end: new Date(2025, 3, 17, 13, 0),
      client: 'Mariana Silva',
      service: 'Box Braids',
      status: 'confirmed',
      isHomeService: false
    },
    {
      id: '2',
      title: 'Twist Senegalês',
      start: new Date(2025, 3, 17, 14, 30),
      end: new Date(2025, 3, 17, 18, 30),
      client: 'Carolina Mendes',
      service: 'Twist Senegalês',
      status: 'confirmed',
      isHomeService: true
    },
    {
      id: '3',
      title: 'Penteado para Festa',
      start: new Date(2025, 3, 18, 11, 0),
      end: new Date(2025, 3, 18, 12, 30),
      client: 'Juliana Santos',
      service: 'Penteado para Festa',
      status: 'pending',
      isHomeService: false
    }
  ]);
  
  // Dados mockados de bloqueios
  const [blocks] = useState<ScheduleBlock[]>([
    {
      id: 'b1',
      start: new Date(2025, 3, 19, 9, 0),
      end: new Date(2025, 3, 19, 13, 0),
      reason: 'Compromisso pessoal'
    }
  ]);
  
  // Manipular mudanças no formulário de bloqueio
  const handleBlockFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBlockFormData({
      ...blockFormData,
      [name]: value
    });
  };
  
  // Adicionar bloqueio
  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aqui você faria a chamada à API para adicionar o bloqueio
    // Para este exemplo, apenas fechamos o modal
    setBlockModalOpen(false);
    setBlockFormData({
      date: '',
      startTime: '',
      endTime: '',
      reason: ''
    });
  };
  
  // Manipular mudanças nos horários de trabalho
  const handleWorkingHoursChange = (dayIndex: number, field: keyof WorkingHours, value: string | boolean) => {
    const updatedHours = [...workingHours];
    updatedHours[dayIndex] = {
      ...updatedHours[dayIndex],
      [field]: field === 'active' ? !updatedHours[dayIndex].active : value
    };
    
    setWorkingHours(updatedHours);
  };
  
  // Salvar horários de trabalho
  const handleSaveWorkingHours = () => {
    // Aqui você faria a chamada à API para salvar os horários
    setHoursModalOpen(false);
  };

  // Função auxiliar para formatar data
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: 'numeric',
      month: 'long'
    });
  };

  // Função auxiliar para formatar hora
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // Obter dias da semana para visualização semanal
  const getWeekDays = () => {
    const days = [];
    const day = new Date(currentDate);
    day.setDate(day.getDate() - day.getDay()); // Começar no domingo

    for (let i = 0; i < 7; i++) {
      days.push(new Date(day));
      day.setDate(day.getDate() + 1);
    }

    return days;
  };
  
  // Verificar se um evento está no dia especificado
  const isEventInDay = (event: CalendarEvent, date: Date) => {
    return event.start.getDate() === date.getDate() &&
            event.start.getMonth() === date.getMonth() &&
            event.start.getFullYear() === date.getFullYear();
  };

  // Verificar se um bloco está no dia especificado
  const isBlockInDay = (block: ScheduleBlock, date: Date) => {
    return block.start.getDate() === date.getDate() &&
            block.start.getMonth() === date.getMonth() &&
            block.start.getFullYear() === date.getFullYear();
  };

  // Estilizar evento baseado no status
  const getEventClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 border-green-500 text-green-800';
      case 'pending':
        return 'bg-amber-100 border-amber-500 text-amber-800';
      case 'completed':
        return 'bg-blue-100 border-blue-500 text-blue-800';
      case 'cancelled':
        return 'bg-gray-100 border-gray-500 text-gray-800';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  // Converter dias da semana em português
  const getDayName = (day: string) => {
    const days = {
      monday: 'Segunda-feira',
      tuesday: 'Terça-feira',
      wednesday: 'Quarta-feira',
      thursday: 'Quinta-feira',
      friday: 'Sexta-feira',
      saturday: 'Sábado',
      sunday: 'Domingo'
    };
    return days[day as keyof typeof days];
  };

  // Renderizar a visualização semanal do calendário
  const renderWeekView = () => {
    const weekDays = getWeekDays();
    
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Cabeçalho com dias da semana */}
        <div className="grid grid-cols-7 border-b">
          {weekDays.map((day, index) => (
            <div 
              key={index} 
              className={`p-2 text-center border-r last:border-r-0 ${
                day.getDate() === new Date().getDate() ? 'bg-purple-50 font-medium' : ''
              }`}
            >
              <div className="text-xs text-gray-500">{day.toLocaleDateString('pt-BR', { weekday: 'short' })}</div>
              <div className="text-sm">{day.getDate()}</div>
            </div>
          ))}
        </div>
        
        {/* Grade de eventos */}
        <div className="grid grid-cols-7 min-h-[500px]">
          {weekDays.map((day, dayIndex) => (
            <div key={dayIndex} className="border-r last:border-r-0 relative">
              {/* Eventos do dia */}
              <div className="p-1">
                {appointments.filter(event => isEventInDay(event, day)).map(event => (
                  <div 
                    key={event.id}
                    className={`p-1 my-1 text-xs rounded border-l-2 ${getEventClass(event.status)}`}
                  >
                    <div className="font-medium">{formatTime(event.start)} - {event.title}</div>
                    <div>{event.client}</div>
                    {event.isHomeService && (
                      <div className="flex items-center mt-1 text-xs">
                        <Home size={10} className="mr-1" />
                        <span>A domicílio</span>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Bloqueios do dia */}
                {blocks.filter(block => isBlockInDay(block, day)).map(block => (
                  <div 
                    key={block.id}
                    className="p-1 my-1 text-xs rounded border-l-2 bg-red-100 border-red-500 text-red-800"
                  >
                    <div className="font-medium">Bloqueado: {formatTime(block.start)} - {formatTime(block.end)}</div>
                    <div>{block.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <ProfessionalDashboardLayout>
      <div className="px-4 py-6 md:px-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Minha Agenda</h1>
            <p className="text-gray-600">Gerencie seus horários e agendamentos</p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setBlockModalOpen(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <Plus size={16} className="mr-2" />
              Bloquear horário
            </button>
            
            <button
              onClick={() => setHoursModalOpen(true)}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <Clock size={16} className="mr-2" />
              Horários de trabalho
            </button>
          </div>
        </div>
        
        {/* Controles do calendário */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Calendar size={20} className="text-purple-600 mr-2" />
            <h2 className="text-lg font-medium">
              {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </h2>
          </div>
          
          <div className="flex space-x-2">
            <button 
              className={`px-3 py-1 rounded-lg text-sm ${currentView === 'week' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}
              onClick={() => setCurrentView('week')}
            >
              Semana
            </button>
            <button 
              className={`px-3 py-1 rounded-lg text-sm ${currentView === 'day' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}
              onClick={() => setCurrentView('day')}
            >
              Dia
            </button>
          </div>
        </div>
        
        {/* Visualização do calendário */}
        <div className="mb-6">
          {currentView === 'week' && renderWeekView()}
          {currentView === 'day' && (
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="text-base font-medium mb-3">
                {formatDate(currentDate)}
              </h3>
              
              {/* Implementação da visualização diária aqui */}
              <p className="text-gray-500 text-sm">Visualização diária em desenvolvimento</p>
            </div>
          )}
        </div>
        
        {/* Próximos agendamentos */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-base font-medium mb-3">Próximos agendamentos</h3>
          
          <div className="space-y-3">
            {appointments
              .filter(appt => appt.start >= new Date())
              .sort((a, b) => a.start.getTime() - b.start.getTime())
              .slice(0, 3)
              .map(appt => (
                <div key={appt.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{appt.service}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(appt.start)} às {formatTime(appt.start)}
                    </p>
                    <p className="text-xs">{appt.client}</p>
                  </div>
                  <div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getEventClass(appt.status)}`}>
                      {appt.status === 'confirmed' ? 'Confirmado' : 
                        appt.status === 'pending' ? 'Pendente' : 
                        appt.status === 'completed' ? 'Concluído' : 'Cancelado'}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      
      {/* Modal para bloqueio de horário */}
      {blockModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              onClick={() => setBlockModalOpen(false)}
            ></div>
            
            {/* Modal */}
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  Bloquear horário
                </h3>
                <button 
                  onClick={() => setBlockModalOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              
              <form onSubmit={handleAddBlock} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data
                  </label>
                  <input 
                    type="date" 
                    name="date"
                    value={blockFormData.date}
                    onChange={handleBlockFormChange}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                    required
                  />
                </div>
                
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Horário inicial
                    </label>
                    <input 
                      type="time" 
                      name="startTime"
                      value={blockFormData.startTime}
                      onChange={handleBlockFormChange}
                      className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                      required
                    />
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Horário final
                    </label>
                    <input 
                      type="time" 
                      name="endTime"
                      value={blockFormData.endTime}
                      onChange={handleBlockFormChange}
                      className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Motivo (opcional)
                  </label>
                  <input 
                    type="text" 
                    name="reason"
                    value={blockFormData.reason}
                    onChange={handleBlockFormChange}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                    placeholder="Ex: Compromisso pessoal"
                  />
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setBlockModalOpen(false)}
                    className="mr-3 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Bloquear
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal para horários de trabalho */}
      {hoursModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              onClick={() => setHoursModalOpen(false)}
            ></div>
            
            {/* Modal */}
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  Horários de trabalho
                </h3>
                <button 
                  onClick={() => setHoursModalOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="bg-amber-50 p-3 rounded-lg flex">
                  <AlertCircle size={16} className="text-amber-500 mr-2 flex-shrink-0" />
                  <p className="text-xs text-amber-700">
                    Configure seus horários de trabalho para cada dia da semana. 
                    Os agendamentos só poderão ser feitos dentro desses horários.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {workingHours.map((hours, index) => (
                  <div key={index} className="flex items-start">
                    <input
                      type="checkbox"
                      id={`day-${hours.day}`}
                      checked={hours.active}
                      onChange={() => handleWorkingHoursChange(index, 'active', !hours.active)}
                      className="h-4 w-4 mt-1 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <div className="ml-2 flex-1">
                      <label htmlFor={`day-${hours.day}`} className="block text-sm font-medium text-gray-700">
                        {getDayName(hours.day)}
                      </label>
                      
                      {hours.active && (
                        <div className="flex items-center space-x-3 mt-2">
                          <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">
                              Início
                            </label>
                            <input 
                              type="time" 
                              value={hours.start}
                              onChange={(e) => handleWorkingHoursChange(index, 'start', e.target.value)}
                              className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm"
                              required
                            />
                          </div>
                          
                          <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">
                              Fim
                            </label>
                            <input 
                              type="time" 
                              value={hours.end}
                              onChange={(e) => handleWorkingHoursChange(index, 'end', e.target.value)}
                              className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm"
                              required
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setHoursModalOpen(false)}
                  className="mr-3 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveWorkingHours}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                >
                  <Check size={16} className="mr-2" />
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProfessionalDashboardLayout>
  );
};

export default ProfessionalSchedulePage;