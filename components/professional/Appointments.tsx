// components/professional/Appointments.tsx
import React, { useState } from 'react';
import { Calendar, Clock, Search, Check, X, AlertTriangle, MoreVertical, User, Home, MapPin } from 'lucide-react';

// Tipos
interface Appointment {
  id: number;
  clientName: string;
  clientPhone: string;
  serviceName: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: 'pending_payment' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  isHomeService: boolean;
  address?: string;
  useOwnHair: boolean;
  hairLength?: 'small' | 'medium' | 'large';
}

const ProfessionalAppointments = () => {
  // Estado para filtros
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');
  
  // Estado para detalhes do agendamento
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  // Mock de agendamentos
  const appointments: Appointment[] = [
    {
      id: 1,
      clientName: 'Ana Silva',
      clientPhone: '(11) 98765-4321',
      serviceName: 'Box Braids',
      date: '2025-04-20',
      time: '14:30',
      duration: 180,
      price: 250.00,
      status: 'confirmed',
      notes: 'Primeira vez fazendo tranças, gostaria de um estilo mais leve.',
      isHomeService: false,
      useOwnHair: true
    },
    {
      id: 2,
      clientName: 'Camila Oliveira',
      clientPhone: '(11) 91234-5678',
      serviceName: 'Penteado para Festa',
      date: '2025-04-21',
      time: '10:00',
      duration: 90,
      price: 150.00,
      status: 'confirmed',
      isHomeService: true,
      address: 'Rua das Flores, 123 - Apt 45',
      useOwnHair: true
    },
    {
      id: 3,
      clientName: 'Mariana Costa',
      clientPhone: '(11) 93456-7890',
      serviceName: 'Twist Senegalês',
      date: '2025-04-19',
      time: '09:00',
      duration: 240,
      price: 290.00,
      status: 'completed',
      isHomeService: false,
      useOwnHair: false,
      hairLength: 'medium'
    },
    {
      id: 4,
      clientName: 'Juliana Santos',
      clientPhone: '(11) 95678-9012',
      serviceName: 'Box Braids',
      date: '2025-04-18',
      time: '15:30',
      duration: 180,
      price: 250.00,
      status: 'cancelled',
      notes: 'Cliente cancelou por motivos pessoais',
      isHomeService: false,
      useOwnHair: true
    },
    {
      id: 5,
      clientName: 'Luiza Fernandes',
      clientPhone: '(11) 97890-1234',
      serviceName: 'Twist Senegalês',
      date: '2025-04-22',
      time: '15:00',
      duration: 240,
      price: 290.00,
      status: 'pending_payment',
      isHomeService: false,
      useOwnHair: false,
      hairLength: 'large'
    }
  ];
  
 // Formatar data para exibição
const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };
  
  // Status em português
  const statusLabels = {
    pending_payment: 'Aguardando pagamento',
    confirmed: 'Confirmado',
    completed: 'Concluído',
    cancelled: 'Cancelado',
    no_show: 'Não compareceu'
  };
  
  // Classes de cores para os status
  const statusColors = {
    pending_payment: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-gray-100 text-gray-800',
    no_show: 'bg-red-100 text-red-800'
  };
  
  // Filtrar agendamentos
  const filteredAppointments = appointments.filter(appointment => {
    // Filtrar por status
    if (filterStatus !== 'all' && appointment.status !== filterStatus) {
      return false;
    }
    
    // Filtrar por data
    if (filterDate && appointment.date !== filterDate) {
      return false;
    }
    
    return true;
  });
  
  // Ordenar agendamentos (mais recentes primeiro)
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    // Primeiro por data
    const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateComparison !== 0) return dateComparison;
    
    // Se mesma data, ordenar por hora
    return a.time.localeCompare(b.time);
  });
  
  // Mostrar detalhes do agendamento
  const showAppointmentDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };
  
  // Fechar modal de detalhes
  const closeDetails = () => {
    setSelectedAppointment(null);
  };
  
  // Alternar status do agendamento (concluído/não compareceu)
  const updateAppointmentStatus = (id: number, status: 'completed' | 'no_show') => {
    // Em uma implementação real, aqui seria feita uma chamada à API
    console.log(`Atualizando agendamento ${id} para ${status}`);
    
    // Atualizar localmente (para a demo)
    if (selectedAppointment && selectedAppointment.id === id) {
      setSelectedAppointment({
        ...selectedAppointment,
        status
      });
    }
  };
  
  return (
    <div className="px-4 py-6 md:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Agendamentos</h1>
        <p className="text-gray-600">Gerencie seus agendamentos e acompanhe sua agenda</p>
      </div>
      
      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="md:flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-xl"
          >
            <option value="all">Todos</option>
            <option value="pending_payment">Aguardando pagamento</option>
            <option value="confirmed">Confirmados</option>
            <option value="completed">Concluídos</option>
            <option value="cancelled">Cancelados</option>
            <option value="no_show">Não compareceu</option>
          </select>
        </div>
        
        <div className="md:flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data
          </label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-xl"
          />
        </div>
        
        <div className="md:flex-1 flex items-end">
          <button
            onClick={() => {
              setFilterStatus('all');
              setFilterDate('');
            }}
            className="w-full p-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50"
          >
            Limpar filtros
          </button>
        </div>
      </div>
      
      {/* Lista de agendamentos */}
      <div className="space-y-4">
        {sortedAppointments.length === 0 ? (
          <div className="bg-white p-8 rounded-xl text-center">
            <p className="text-gray-500">Nenhum agendamento encontrado com os filtros atuais.</p>
          </div>
        ) : (
          sortedAppointments.map(appointment => (
            <div 
              key={appointment.id}
              className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => showAppointmentDetails(appointment)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{appointment.clientName}</h3>
                  <p className="text-sm text-gray-600">{appointment.serviceName}</p>
                  
                  <div className="flex items-center mt-2 space-x-4">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar size={12} className="mr-1" />
                      <span>{formatDate(appointment.date).split(',')[0]}</span>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock size={12} className="mr-1" />
                      <span>{appointment.time} ({appointment.duration} min)</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 ${statusColors[appointment.status]} text-xs rounded-full`}>
                    {statusLabels[appointment.status]}
                  </span>
                  
                  <div className="font-medium text-purple-600 mt-2">
                    R$ {appointment.price.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Modal de detalhes do agendamento */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              onClick={closeDetails}
            ></div>
            
            {/* Modal */}
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  Detalhes do Agendamento
                </h3>
                <button 
                  onClick={closeDetails}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              
              {/* Status */}
              <div className="mb-6">
                <span className={`inline-block px-3 py-1.5 ${statusColors[selectedAppointment.status]} text-sm rounded-full`}>
                  {statusLabels[selectedAppointment.status]}
                </span>
              </div>
              
              {/* Cliente */}
              <div className="mb-6">
                <h4 className="text-sm text-gray-500 mb-1">Cliente</h4>
                <div className="flex items-start">
                  <User size={16} className="text-gray-400 mt-1 mr-2" />
                  <div>
                    <p className="font-medium">{selectedAppointment.clientName}</p>
                    <p className="text-sm text-gray-600">{selectedAppointment.clientPhone}</p>
                  </div>
                </div>
              </div>
              
              {/* Serviço */}
              <div className="mb-6">
                <h4 className="text-sm text-gray-500 mb-1">Serviço</h4>
                <p className="font-medium">{selectedAppointment.serviceName}</p>
                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <Clock size={14} className="mr-1" />
                  <span>{selectedAppointment.duration} minutos</span>
                </div>
                <p className="font-medium text-purple-600 mt-2">
                  R$ {selectedAppointment.price.toFixed(2)}
                </p>
              </div>
              
              {/* Data e hora */}
              <div className="mb-6">
                <h4 className="text-sm text-gray-500 mb-1">Data e hora</h4>
                <p className="font-medium">{formatDate(selectedAppointment.date)}</p>
                <p className="text-sm text-gray-600">às {selectedAppointment.time}</p>
              </div>
              
              {/* Local */}
              <div className="mb-6">
                <h4 className="text-sm text-gray-500 mb-1">Local</h4>
                <div className="flex items-start">
                  {selectedAppointment.isHomeService ? (
                    <>
                      <Home size={16} className="text-gray-400 mt-1 mr-2" />
                      <div>
                        <p className="font-medium">Serviço a domicílio</p>
                        <p className="text-sm text-gray-600">{selectedAppointment.address}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <MapPin size={16} className="text-gray-400 mt-1 mr-2" />
                      <div>
                        <p className="font-medium">No salão</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Detalhes adicionais */}
              <div className="mb-6">
                <h4 className="text-sm text-gray-500 mb-1">Detalhes adicionais</h4>
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <p>
                    <span className="font-medium">Cabelo: </span>
                    {selectedAppointment.useOwnHair ? 'Cliente usará cabelo próprio' : 
                      `Aplicação com cabelo ${selectedAppointment.hairLength === 'small' ? 'curto' : 
                      selectedAppointment.hairLength === 'medium' ? 'médio' : 'longo'}`
                    }
                  </p>
                  
                  {selectedAppointment.notes && (
                    <p className="mt-2">
                      <span className="font-medium">Observações: </span>
                      {selectedAppointment.notes}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Ações */}
              {selectedAppointment.status === 'confirmed' && (
                <div className="flex space-x-3">
                  <button 
                    onClick={() => updateAppointmentStatus(selectedAppointment.id, 'completed')}
                    className="flex-1 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center"
                  >
                    <Check size={16} className="mr-2" />
                    Marcar como concluído
                  </button>
                  
                  <button 
                    onClick={() => updateAppointmentStatus(selectedAppointment.id, 'no_show')}
                    className="flex-1 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
                  >
                    <X size={16} className="mr-2" />
                    Não compareceu
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalAppointments;