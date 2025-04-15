import React from 'react';
import { useQuery } from 'react-query';
import { format, parseISO, startOfDay, isToday, isYesterday, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { User, Calendar, DollarSign, TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react';
import ProfessionalDashboardLayout from '../../components/layouts/ProfessionalDashboardLayout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { appointmentService } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

// Componente de card para estatísticas
const StatCard = ({ title, value, icon: Icon, trend, color = 'purple' }) => {
  const colorClasses = {
    purple: { light: 'bg-purple-100', text: 'text-purple-800', icon: 'text-purple-500' },
    green: { light: 'bg-green-100', text: 'text-green-800', icon: 'text-green-500' },
    blue: { light: 'bg-blue-100', text: 'text-blue-800', icon: 'text-blue-500' },
    amber: { light: 'bg-amber-100', text: 'text-amber-800', icon: 'text-amber-500' },
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-500 text-sm mb-1">{title}</h3>
          <p className="text-2xl font-medium text-gray-800">{value}</p>
          
          {trend && (
            <p className={`text-xs mt-2 flex items-center ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp size={14} className={`mr-1 ${trend.positive ? '' : 'transform rotate-180'}`} />
              {trend.value} {trend.text || (trend.positive ? 'aumento' : 'queda')}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color].light}`}>
          <Icon size={20} className={colorClasses[color].icon} />
        </div>
      </div>
    </div>
  );
};

// Componente de card para agendamento próximo
const UpcomingAppointmentCard = ({ appointment }) => {
  // Formatação de data e hora
  const formattedDate = format(parseISO(appointment.start_datetime), "EEEE, d 'de' MMMM", { locale: ptBR });
  const formattedTime = format(parseISO(appointment.start_datetime), "HH:mm");
  const formattedEndTime = format(parseISO(appointment.end_datetime), "HH:mm");
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">{appointment.service.name}</h3>
          <p className="text-gray-500 text-sm">com {appointment.client.first_name} {appointment.client.last_name}</p>
        </div>
        <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
          {isToday(parseISO(appointment.start_datetime)) ? 'Hoje' : formattedDate}
        </div>
      </div>
      
      <div className="mt-3 flex items-center text-sm text-gray-600">
        <Clock size={16} className="mr-2" />
        <span>{formattedTime} - {formattedEndTime}</span>
      </div>
      
      <div className="mt-3 flex justify-between items-center">
        <div className="flex">
          <button className="text-purple-600 text-sm font-medium mr-4">
            Ver detalhes
          </button>
          {appointment.status === 'confirmed' && (
            <button className="text-green-600 text-sm font-medium flex items-center">
              <CheckCircle size={14} className="mr-1" />
              Completar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

function ProfessionalDashboard() {
  const { showToast } = useToast();
  const today = new Date();
  
  // Buscar estatísticas
  const { data: stats, isLoading: statsLoading } = useQuery(
    'professionalStats',
    () => {
      // Esta função seria substituída por uma chamada de API real
      return Promise.resolve({
        totalClients: 42,
        monthlyRevenue: 8750.0,
        completedAppointments: 38,
        cancelRate: 3.5,
      });
    },
    {
      staleTime: 1000 * 60 * 15, // 15 minutos
    }
  );
  
  // Buscar agendamentos para hoje e próximos
  const { data: upcomingAppointments, isLoading: appointmentsLoading } = useQuery(
    'upcomingAppointments',
    () => appointmentService.getAll({ 
      status: 'confirmed', 
      start_after: startOfDay(today).toISOString(),
      limit: 5,
      sort: 'start_datetime'
    })
      .then(res => res.data)
      .catch(err => {
        showToast('Erro ao carregar agendamentos', 'error');
        throw err;
      }),
    {
      staleTime: 1000 * 60 * 5, // 5 minutos
    }
  );
  
  // Buscar os agendamentos do mês atual para o gráfico
  const { data: monthlyAppointments, isLoading: monthlyLoading } = useQuery(
    'monthlyAppointments',
    () => appointmentService.getAll({ 
      start_after: startOfMonth(today).toISOString(),
      end_before: endOfMonth(today).toISOString(),
    })
      .then(res => res.data)
      .catch(err => {
        showToast('Erro ao carregar dados mensais', 'error');
        throw err;
      }),
    {
      staleTime: 1000 * 60 * 30, // 30 minutos
    }
  );
  
  // Renderização de estado de carregamento
  if (statsLoading || appointmentsLoading || monthlyLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-medium text-gray-900 mb-6">Painel</h1>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl p-5 h-28">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2 bg-white rounded-xl p-5 h-64">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
              <div className="h-44 bg-gray-100 rounded"></div>
            </div>
            
            <div className="bg-white rounded-xl p-5 h-64">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-5"></div>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-12 bg-gray-100 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-medium text-gray-900 mb-2">Painel</h1>
      <p className="text-gray-500 mb-6">Acompanhe seus resultados</p>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard 
          title="Clientes Totais" 
          value={stats.totalClients}
          icon={User}
          trend={{ positive: true, value: '15%', text: 'mais que mês passado' }}
        />
        
        <StatCard 
          title="Receita do Mês" 
          value={`R$ ${stats.monthlyRevenue.toFixed(2)}`}
          icon={DollarSign}
          trend={{ positive: true, value: '8.5%' }}
          color="green"
        />
        
        <StatCard 
          title="Atend. Concluídos" 
          value={stats.completedAppointments}
          icon={CheckCircle}
          color="blue"
        />
        
        <StatCard 
          title="Taxa de Cancelamento" 
          value={`${stats.cancelRate}%`}
          icon={XCircle}
          trend={{ positive: false, value: '0.5%' }}
          color="amber"
        />
      </div>
      
      {/* Charts and Upcoming Appointments */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Receita Mensal</h2>
          <div className="relative h-64">
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <p>O gráfico será renderizado aqui</p>
              <p className="text-sm text-gray-400">Dados reais serão utilizados na integração</p>
            </div>
          </div>
        </div>
        
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Próximos Atendimentos</h2>
          
          {upcomingAppointments && upcomingAppointments.length > 0 ? (
            <div className="space-y-3">
              {upcomingAppointments.slice(0, 3).map(appointment => (
                <UpcomingAppointmentCard key={appointment.id} appointment={appointment} />
              ))}
              
              {upcomingAppointments.length > 3 && (
                <button
                  className="w-full text-center py-2 text-sm text-purple-600 font-medium"
                >
                  Ver todos ({upcomingAppointments.length})
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-10">
              <Calendar className="mx-auto h-10 w-10 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Sem agendamentos</h3>
              <p className="mt-1 text-sm text-gray-500">
                Nenhum agendamento para os próximos dias.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente envolvendo a rota protegida
export default function ProfessionalDashboardPage() {
  return (
    <ProtectedRoute professionalOnly>
      <ProfessionalDashboardLayout>
        <ProfessionalDashboard />
      </ProfessionalDashboardLayout>
    </ProtectedRoute>
  );
}