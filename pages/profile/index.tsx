import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Clock, ChevronRight, LogOut, Settings, User } from 'lucide-react';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

// Interface para o tipo de agendamento
interface Appointment {
  id: number;
  serviceName: string;
  professionalName: string;
  professionalImage: string;
  date: Date;
  time: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  totalPrice: number;
}

// Dados mockados de agendamentos
const mockAppointments: Appointment[] = [
  {
    id: 1,
    serviceName: 'Box Braids',
    professionalName: 'Ana Oliveira',
    professionalImage: '/api/placeholder/300/300',
    date: new Date(2025, 3, 20), // 20/04/2025
    time: '14:00',
    status: 'confirmed',
    totalPrice: 250,
  },
  {
    id: 2,
    serviceName: 'Twist Senegalês',
    professionalName: 'Ana Oliveira',
    professionalImage: '/api/placeholder/300/300',
    date: new Date(2025, 4, 5), // 05/05/2025
    time: '10:30',
    status: 'pending',
    totalPrice: 290,
  },
  {
    id: 3,
    serviceName: 'Penteado para Festa',
    professionalName: 'Camila Santos',
    professionalImage: '/api/placeholder/300/300',
    date: new Date(2025, 3, 10), // 10/04/2025 (passado)
    time: '16:00',
    status: 'completed',
    totalPrice: 150,
  },
  {
    id: 4,
    serviceName: 'Manutenção de Tranças',
    professionalName: 'Juliana Costa',
    professionalImage: '/api/placeholder/300/300',
    date: new Date(2025, 3, 8), // 08/04/2025 (passado)
    time: '09:00',
    status: 'cancelled',
    totalPrice: 100,
  },
];

// Componente de card de agendamento
const AppointmentCard: React.FC<{ appointment: Appointment }> = ({ appointment }) => {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: Appointment['status']): string => {
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

  const getStatusText = (status: Appointment['status']): string => {
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

  return (
    <Link href={`/appointments/${appointment.id}`} className="block bg-white rounded-xl shadow-sm mb-4">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">{appointment.serviceName}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
            {getStatusText(appointment.status)}
          </span>
        </div>

        <div className="flex items-center mb-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
            <Image
              src={appointment.professionalImage}
              alt={appointment.professionalName}
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
          <span className="ml-2 text-sm text-gray-600">{appointment.professionalName}</span>
        </div>

        <div className="flex text-sm text-gray-500">
          <div className="flex items-center mr-4">
            <Calendar size={14} className="mr-1 text-gray-400" />
            <span>{formatDate(appointment.date)}</span>
          </div>
          <div className="flex items-center">
            <Clock size={14} className="mr-1 text-gray-400" />
            <span>{appointment.time}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 p-3 flex justify-between items-center">
        <span className="text-sm font-medium">R$ {appointment.totalPrice.toFixed(2)}</span>
        <ChevronRight size={16} className="text-gray-400" />
      </div>
    </Link>
  );
};

export default function ClientProfile() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [userData, setUserData] = useState({
    name: 'Mariana Silva',
    email: 'mariana.silva@email.com',
    phone: '(11) 99999-9999',
  });

  const currentDate = new Date();

  const upcomingAppointments = mockAppointments.filter(
    (appointment) =>
      (appointment.status === 'confirmed' || appointment.status === 'pending') &&
      appointment.date >= currentDate
  );

  const pastAppointments = mockAppointments.filter(
    (appointment) =>
      appointment.date < currentDate ||
      appointment.status === 'completed' ||
      appointment.status === 'cancelled'
  );

  return (
    <ProtectedRoute>
      <Layout title="Meu Perfil | Agenda Livre">
        <div className="bg-gray-50 min-h-screen pb-20">
          {/* Header */}
          <div className="bg-purple-600 px-5 pt-8 pb-16">
            <h1 className="text-2xl font-bold text-white">Meu Perfil</h1>
          </div>

          {/* Card de perfil */}
          <div className="px-5 -mt-10 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                  <User size={24} className="text-purple-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-medium">{userData.name}</h2>
                  <p className="text-sm text-gray-500">{userData.email}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link href="/profile/edit" className="flex items-center justify-between py-2 text-gray-600">
                  <span className="flex items-center">
                    <Settings size={16} className="mr-3" />
                    <span>Editar perfil</span>
                  </span>
                  <ChevronRight size={16} />
                </Link>
                <button
                  className="w-full flex items-center justify-between py-2 text-red-500"
                  onClick={() => {
                    localStorage.removeItem('auth_token');
                    window.location.href = '/login';
                  }}
                >
                  <span className="flex items-center">
                    <LogOut size={16} className="mr-3" />
                    <span>Sair</span>
                  </span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs de agendamentos */}
          <div className="px-5">
            <div className="flex border-b border-gray-200 mb-4">
              <button
                className={`py-3 flex-1 text-sm font-medium ${
                  activeTab === 'upcoming'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('upcoming')}
              >
                Próximos
              </button>
              <button
                className={`py-3 flex-1 text-sm font-medium ${
                  activeTab === 'past'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('past')}
              >
                Histórico
              </button>
            </div>

            {/* Lista de agendamentos */}
            <div>
              {activeTab === 'upcoming' ? (
                upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                      <Calendar size={24} className="text-gray-400" />
                    </div>
                    <h3 className="mt-4 font-medium">Sem agendamentos</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Você não tem agendamentos próximos
                    </p>
                    <Link
                      href="/professionals"
                      className="mt-4 inline-block text-sm text-purple-600 font-medium"
                    >
                      Buscar profissionais
                    </Link>
                  </div>
                )
              ) : pastAppointments.length > 0 ? (
                pastAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <Calendar size={24} className="text-gray-400" />
                  </div>
                  <h3 className="mt-4 font-medium">Sem histórico</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Você ainda não realizou nenhum agendamento
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}