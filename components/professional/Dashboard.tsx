// components/professional/Dashboard.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Users, TrendingUp, Settings, Scissors, ChevronRight } from 'lucide-react';

// Layout que seria importado na página real
import ProfessionalLayut from '../layout/ProfessionalDashboardLayout';
import ProfessionalLayout from '../../components/layouts/ProfessionalDashboardLayout.js';

interface Appointment {
  id: number;
  clientName: string;
  serviceName: string;
  date: string;
  time: string;
  price: number;
  status: 'confirmed' | 'pending_payment';
}

const ProfessionalDashboard = () => {
  // Dados mockados para demonstração
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([
    {
      id: 1,
      clientName: 'Ana Silva',
      serviceName: 'Box Braids',
      date: '2025-04-20',
      time: '14:30',
      price: 250.00,
      status: 'confirmed'
    },
    {
      id: 2,
      clientName: 'Camila Oliveira',
      serviceName: 'Penteado para Festa',
      date: '2025-04-21',
      time: '10:00',
      price: 150.00,
      status: 'confirmed'
    },
    {
      id: 3,
      clientName: 'Mariana Costa',
      serviceName: 'Twist Senegalês',
      date: '2025-04-22',
      time: '15:00',
      price: 290.00,
      status: 'pending_payment'
    }
  ]);

  const stats = {
    weeklyAppointments: 8,
    monthlyEarnings: 2180.00,
    completedAppointments: 42,
    cancelledAppointments: 3,
    profileViews: 156
  };

  // Formatar data para exibição
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="px-4 py-6 md:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo de volta! Aqui está um resumo da sua agenda</p>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Agendamentos da semana</p>
              <h3 className="text-xl font-bold">{stats.weeklyAppointments}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Receita mensal</p>
              <h3 className="text-xl font-bold">R$ {stats.monthlyEarnings.toFixed(2)}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Visualizações do perfil</p>
              <h3 className="text-xl font-bold">{stats.profileViews}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Próximos agendamentos */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Próximos agendamentos</h2>
          <Link href="/dashboard/professional/appointments" className="text-purple-600 text-sm flex items-center">
            Ver todos
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="space-y-4">
          {upcomingAppointments.map(appointment => (
            <div key={appointment.id} className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{appointment.clientName}</h3>
                  <p className="text-sm text-gray-600">{appointment.serviceName}</p>
                  
                  <div className="flex items-center mt-2 space-x-4">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar size={12} className="mr-1" />
                      <span>{formatDate(appointment.date)}</span>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock size={12} className="mr-1" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="font-medium text-purple-600">R$ {appointment.price.toFixed(2)}</span>
                  
                  <div className="mt-1">
                    {appointment.status === 'confirmed' ? (
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Confirmado</span>
                    ) : (
                      <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">Aguardando pagamento</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Menu rápido */}
      <div>
        <h2 className="text-lg font-medium mb-4">Acesso rápido</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/dashboard/professional/schedule" className="bg-white p-4 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-2">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <span className="block text-sm font-medium">Agenda</span>
          </Link>
          
          <Link href="/dashboard/professional/services" className="bg-white p-4 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-2">
              <Scissors className="w-6 h-6 text-purple-600" />
            </div>
            <span className="block text-sm font-medium">Serviços</span>
          </Link>
          
          <Link href="/dashboard/professional/analytics" className="bg-white p-4 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <span className="block text-sm font-medium">Análises</span>
          </Link>
          
          <Link href="/dashboard/professional/profile" className="bg-white p-4 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-2">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <span className="block text-sm font-medium">Perfil</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;