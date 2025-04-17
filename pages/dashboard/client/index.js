import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Check, AlertCircle } from 'lucide-react';
import ClientDashboardLayout from '../../../components/layouts/ClientDashboardLayout';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import { useAuth } from '../../../hooks/useAuth';

const ClientDashboard = () => {
  const { user, isLoading } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      // Mock de dados para demonstração
      const mockAppointments = [
        {
          id: 1,
          serviceName: 'Box Braids',
          professionalName: 'Ana Oliveira',
          professionalImage: '/images/profile-placeholder.jpg',
          date: new Date('2025-04-20T14:00:00'),
          price: 250,
          status: 'confirmed'
        },
        {
          id: 2,
          serviceName: 'Penteado para Festa',
          professionalName: 'Mariana Santos',
          professionalImage: '/images/profile-placeholder.jpg',
          date: new Date('2025-04-25T10:30:00'),
          price: 150,
          status: 'pending_payment'
        }
      ];
      
      setUpcomingAppointments(mockAppointments);
      setLoading(false);
    }, 1500);
  }, []);
  
  // Formatar data
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  // Formatar hora
  const formatTime = (date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Renderizar ícone de status
  const renderStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'pending_payment':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default:
        return null;
    }
  };
  
  // Renderizar texto de status
  const renderStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="text-green-600 font-medium">Confirmado</span>;
      case 'pending_payment':
        return <span className="text-amber-600 font-medium">Aguardando pagamento</span>;
      default:
        return null;
    }
  };
  
  return (
    <ProtectedRoute userType="client">
      <ClientDashboardLayout>
        <div className="p-4 max-w-4xl mx-auto">
          <h1 className="text-2xl font-medium mb-2">Bem-vindo(a), {user?.name || 'Cliente'}</h1>
          <p className="text-gray-600 mb-6">Aqui você pode visualizar seus agendamentos e gerenciar seu perfil.</p>
          
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Próximos agendamentos</h2>
            
            {loading ? (
              <div className="animate-pulse">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm mb-4 p-5">
                    <div className="flex items-center mb-3">
                      <div className="h-12 w-12 bg-gray-200 rounded-full mr-3"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-40 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {upcomingAppointments.length > 0 ? (
                  <div className="grid gap-4">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 mr-3">
                              <img 
                                src={appointment.professionalImage} 
                                alt={appointment.professionalName} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">{appointment.serviceName}</h3>
                              <p className="text-sm text-gray-500">com {appointment.professionalName}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {renderStatusIcon(appointment.status)}
                            <span className="ml-2 text-sm">
                              {renderStatusText(appointment.status)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-between">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar size={16} className="mr-1" />
                            <span>{formatDate(appointment.date)}</span>
                            <Clock size={16} className="ml-3 mr-1" />
                            <span>{formatTime(appointment.date)}</span>
                          </div>
                          <div className="font-medium">
                            R$ {appointment.price.toFixed(2)}
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <div className="flex justify-between">
                            {appointment.status === 'pending_payment' ? (
                              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium">
                                Finalizar pagamento
                              </button>
                            ) : (
                              <button className="px-4 py-2 bg-white border border-purple-600 text-purple-600 rounded-lg text-sm font-medium">
                                Ver detalhes
                              </button>
                            )}
                            
                            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium">
                              Reagendar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar size={24} className="text-purple-600" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Sem agendamentos</h3>
                    <p className="text-gray-600 mb-4">
                      Você não possui nenhum agendamento para os próximos dias.
                    </p>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium">
                      Agendar serviço
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Serviços populares</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 1, name: 'Box Braids', image: '/api/placeholder/300/200', price: 250 },
                { id: 2, name: 'Twist Senegalês', image: '/api/placeholder/300/200', price: 290 },
                { id: 3, name: 'Lace Frontal', image: '/api/placeholder/300/200', price: 350 },
                { id: 4, name: 'Penteado para Festa', image: '/api/placeholder/300/200', price: 150 }
              ].map((service) => (
                <div key={service.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="h-40 bg-gray-100">
                    <img 
                      src={service.image} 
                      alt={service.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">{service.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-purple-600 font-medium">R$ {service.price.toFixed(2)}</p>
                      <button className="text-sm text-purple-600 font-medium">
                        Ver mais
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ClientDashboardLayout>
    </ProtectedRoute>
  );
};

export default ClientDashboard;