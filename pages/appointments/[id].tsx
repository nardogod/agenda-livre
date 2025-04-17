import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, MapPin, ChevronLeft, Home, Phone, MessageSquare } from 'lucide-react';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

// Dados mockados para um agendamento específico
const getMockAppointment = (id: string) => ({
  id: Number(id),
  serviceName: 'Box Braids',
  professionalName: 'Ana Oliveira',
  professionalImage: '/api/placeholder/300/300',
  professionalPhone: '(11) 97777-8888',
  date: new Date(2025, 3, 20), // 20/04/2025
  time: '14:00',
  duration: 180, // minutos
  status: 'confirmed',
  totalPrice: 250,
  location: {
    address: 'Rua dos Pinheiros, 123',
    district: 'Pinheiros',
    zone: 'Zona Oeste'
  },
  isHomeService: false,
  address: '',
  options: {
    useOwnHair: true,
    hairLength: '',
    hasAllergies: false,
    allergiesDescription: ''
  },
  notes: 'Prefiro tranças médias, nem muito finas nem muito grossas.'
});

export default function AppointmentDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  // Em uma implementação real, buscaríamos os dados do agendamento através de uma API
  const appointment = getMockAppointment(id as string);
  
  // Formato de data para exibição
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Função para formatar a duração (de minutos para horas e minutos)
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    return hours > 0 
      ? `${hours}h${mins > 0 ? ` ${mins}min` : ''}`
      : `${mins}min`;
  };
  
  // Função para calcular o horário de término
  const calculateEndTime = (startTime: string, durationMinutes: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0);
    
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    
    return `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
  };
  
  // Status do agendamento
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'pending':
        return 'Pendente';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return '';
    }
  };
  
  // Modal de cancelamento
  const CancelModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-5">
        <h3 className="text-lg font-medium mb-3">Cancelar agendamento</h3>
        <p className="text-gray-600 mb-4">
          Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
        </p>
        <p className="text-sm text-red-600 mb-4">
          Cancelamentos com menos de 24h de antecedência estão sujeitos a cobrança de 50% do valor.
        </p>
        <div className="flex space-x-3">
          <button 
            className="flex-1 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl"
            onClick={() => setShowCancelModal(false)}
          >
            Voltar
          </button>
          <button 
            className="flex-1 py-2 bg-red-600 text-white rounded-xl"
            onClick={() => {
              // Em uma implementação real, faríamos uma chamada para a API
              alert('Agendamento cancelado com sucesso!');
              setShowCancelModal(false);
              router.push('/profile');
            }}
          >
            Confirmar cancelamento
          </button>
        </div>
      </div>
    </div>
  );
  
  return (
    <ProtectedRoute>
      <Layout title="Detalhes do Agendamento | Agenda Livre" showFooter={false}>
        <div className="bg-gray-50 min-h-screen pb-6">
          {/* Header */}
          <div className="bg-white px-5 py-4 shadow-sm">
            <div className="flex items-center">
              <Link href="/profile" className="mr-3 p-2 rounded-full hover:bg-gray-100">
                <ChevronLeft size={18} />
              </Link>
              <h1 className="text-lg font-medium">Detalhes do Agendamento</h1>
            </div>
          </div>
          
          {/* Conteúdo */}
          <div className="px-5 py-6">
            {/* Status */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">{appointment.serviceName}</h2>
              <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                {getStatusText(appointment.status)}
              </span>
            </div>
            
            {/* Informações do profissional */}
            <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                  <Image 
                    src={appointment.professionalImage} 
                    alt={appointment.professionalName} 
                    width={48} 
                    height={48} 
                    className="object-cover"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">{appointment.professionalName}</h3>
                  <Link href={`/professionals/${appointment.id}`} className="text-xs text-purple-600">
                    Ver perfil
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Data e horário */}
            <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
              <h3 className="font-medium mb-3">Data e horário</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Calendar size={18} className="text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <div className="font-medium">{formatDate(appointment.date)}</div>
                    <div className="text-sm text-gray-500">
                      {appointment.time} - {calculateEndTime(appointment.time, appointment.duration)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock size={18} className="text-gray-400 mr-3" />
                  <div className="text-gray-600">
                    Duração: {formatDuration(appointment.duration)}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Local */}
            <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
              <h3 className="font-medium mb-3">Local</h3>
              <div className="flex items-start">
                {appointment.isHomeService ? (
                  <>
                    <Home size={18} className="text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <div className="font-medium">Atendimento a domicílio</div>
                      <div className="text-sm text-gray-500">{appointment.address}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <MapPin size={18} className="text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <div className="font-medium">{appointment.location.district}, {appointment.location.zone}</div>
                      <div className="text-sm text-gray-500">{appointment.location.address}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Detalhes do serviço */}
            <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
              <h3 className="font-medium mb-3">Detalhes do serviço</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">{appointment.serviceName}</span>
                  <span>R$ {appointment.totalPrice.toFixed(2)}</span>
                </div>
                
                {appointment.options.useOwnHair && (
                  <div className="text-sm text-gray-500">
                    • Usando cabelo próprio
                  </div>
                )}
                
                {!appointment.options.useOwnHair && appointment.options.hairLength && (
                  <div className="text-sm text-gray-500">
                    • Cabelo fornecido ({appointment.options.hairLength})
                  </div>
                )}
                
                {appointment.options.hasAllergies && appointment.options.allergiesDescription && (
                  <div className="text-sm text-gray-500">
                    • Alergias: {appointment.options.allergiesDescription}
                  </div>
                )}
                
                {appointment.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Observações:</span> {appointment.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Ações */}
            <div className="mt-8 space-y-3">
              {appointment.status === 'confirmed' && (
                <button 
                  className="w-full py-3 bg-white border border-red-200 text-red-600 font-medium rounded-xl"
                  onClick={() => setShowCancelModal(true)}
                >
                  Cancelar agendamento
                </button>
              )}
              
              <a 
                href={`tel:${appointment.professionalPhone}`}
                className="flex items-center justify-center w-full py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl"
              >
                <Phone size={16} className="mr-2" />
                Ligar para o profissional
              </a>
              
              <Link href={`/chat/${appointment.id}`} className="flex items-center justify-center w-full py-3 bg-purple-600 text-white font-medium rounded-xl">
                <MessageSquare size={16} className="mr-2" />
                Enviar mensagem
              </Link>
            </div>
          </div>
          
          {/* Modal de cancelamento */}
          {showCancelModal && <CancelModal />}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}