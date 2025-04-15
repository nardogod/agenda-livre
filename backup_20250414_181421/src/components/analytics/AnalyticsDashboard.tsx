// src/components/analytics/AnalyticsDashboard.tsx
// Este arquivo corresponde ao componente de dashboard analítico que criamos anteriormente
// Copie o código do componente AnalyticsDashboard para este arquivo

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';
import { Calendar, DollarSign, Users, TrendingUp, Clock, BarChart2 } from 'lucide-react';

// Componente de estatísticas principais (KPIs)
const StatsCard = ({ title, value, icon, trend, color }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-medium mt-1">{value}</h3>
          {trend && (
            <div className={`flex items-center mt-1 text-xs ${
              trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'
            }`}>
              {trend > 0 ? '↑' : trend < 0 ? '↓' : ''}
              {Math.abs(trend)}% em relação ao mês anterior
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Componente de seletor de período
const PeriodSelector = ({ period, onChange }) => {
  return (
    <div className="flex bg-white rounded-xl overflow-hidden border border-gray-200 mb-5">
      {['week', 'month', 'quarter', 'year'].map((p) => (
        <button
          key={p}
          className={`flex-1 py-3 text-sm ${
            period === p 
              ? "bg-purple-600 text-white" 
              : "text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => onChange(p)}
        >
          {p === 'week' ? 'Semana' : 
           p === 'month' ? 'Mês' : 
           p === 'quarter' ? 'Trimestre' : 'Ano'}
        </button>
      ))}
    </div>
  );
};

// Mock de dados para estatísticas
const getStatsData = (period) => {
  // Em uma aplicação real, estes dados viriam da API
  const baseStats = {
    totalAppointments: 48,
    revenue: 'R$ 5.240,00',
    newClients: 12,
    averageDuration: '2.5h'
  };
  
  // Simular diferenças entre períodos
  switch(period) {
    case 'week':
      return {
        ...baseStats,
        appointmentTrend: 5,
        revenueTrend: 8,
        clientsTrend: 12,
        durationTrend: -3
      };
    case 'month':
      return {
        ...baseStats,
        totalAppointments: 176,
        revenue: 'R$ 19.840,00',
        newClients: 38,
        appointmentTrend: 12,
        revenueTrend: 15,
        clientsTrend: 7,
        durationTrend: 0
      };
    case 'quarter':
      return {
        ...baseStats,
        totalAppointments: 532,
        revenue: 'R$ 59.520,00',
        newClients: 105,
        appointmentTrend: 8,
        revenueTrend: 11,
        clientsTrend: 3,
        durationTrend: 2
      };
    case 'year':
      return {
        ...baseStats,
        totalAppointments: 2184,
        revenue: 'R$ 238.080,00',
        newClients: 420,
        appointmentTrend: 22,
        revenueTrend: 18,
        clientsTrend: 15,
        durationTrend: 5
      };
    default:
      return baseStats;
  }
};

// Mock de dados para gráficos
const getChartData = (period) => {
  // Dados para gráfico de receita por mês/semana/etc.
  const revenueData = {
    week: [
      { name: 'Seg', value: 320 },
      { name: 'Ter', value: 480 },
      { name: 'Qua', value: 420 },
      { name: 'Qui', value: 390 },
      { name: 'Sex', value: 510 },
      { name: 'Sáb', value: 580 },
      { name: 'Dom', value: 320 }
    ],
    month: [
      { name: 'Semana 1', value: 2100 },
      { name: 'Semana 2', value: 2650 },
      { name: 'Semana 3', value: 2340 },
      { name: 'Semana 4', value: 2750 }
    ],
    quarter: [
      { name: 'Jan', value: 18650 },
      { name: 'Fev', value: 19840 },
      { name: 'Mar', value: 21030 }
    ],
    year: [
      { name: 'Jan', value: 18650 },
      { name: 'Fev', value: 19840 },
      { name: 'Mar', value: 21030 },
      { name: 'Abr', value: 19750 },
      { name: 'Mai', value: 20840 },
      { name: 'Jun', value: 21930 },
      { name: 'Jul', value: 20350 },
      { name: 'Ago', value: 19780 },
      { name: 'Set', value: 21650 },
      { name: 'Out', value: 22480 },
      { name: 'Nov', value: 21840 },
      { name: 'Dez', value: 23940 }
    ]
  };
  
  // Dados para gráfico de serviços mais populares
  const servicesData = [
    { name: 'Box Braids', value: 35 },
    { name: 'Twist Senegalês', value: 25 },
    { name: 'Tranças Nagô', value: 15 },
    { name: 'Penteado', value: 15 },
    { name: 'Outros', value: 10 }
  ];
  
  // Dados para gráfico de origem dos clientes
  const clientSourceData = [
    { name: 'Indicação', value: 40 },
    { name: 'Instagram', value: 30 },
    { name: 'Busca na plataforma', value: 20 },
    { name: 'Outros', value: 10 }
  ];
  
  return {
    revenue: revenueData[period],
    services: servicesData,
    clientSource: clientSourceData
  };
};

// Componente principal do Dashboard
const AnalyticsDashboard = () => {
  const [period, setPeriod] = useState('month');
  const [stats, setStats] = useState(getStatsData('month'));
  const [chartData, setChartData] = useState(getChartData('month'));
  
  // Atualizar dados quando o período mudar
  useEffect(() => {
    setStats(getStatsData(period));
    setChartData(getChartData(period));
  }, [period]);
  
  // Cores para gráficos de pizza
  const COLORS = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE'];
  
  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Estatísticas e Análises</h2>
      
      {/* Seletor de período */}
      <PeriodSelector period={period} onChange={setPeriod} />
      
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard 
          title="Agendamentos" 
          value={stats.totalAppointments} 
          icon={<Calendar size={24} className="text-purple-600" />}
          trend={stats.appointmentTrend}
          color="bg-purple-100"
        />
        <StatsCard 
          title="Receita" 
          value={stats.revenue}
          icon={<DollarSign size={24} className="text-green-600" />}
          trend={stats.revenueTrend}
          color="bg-green-100"
        />
        <StatsCard 
          title="Novos Clientes" 
          value={stats.newClients}
          icon={<Users size={24} className="text-blue-600" />}
          trend={stats.clientsTrend}
          color="bg-blue-100"
        />
        <StatsCard 
          title="Duração Média" 
          value={stats.averageDuration}
          icon={<Clock size={24} className="text-amber-600" />}
          trend={stats.durationTrend}
          color="bg-amber-100"
        />
      </div>
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de receita */}
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <h3 className="font-medium mb-4">Receita ({
            period === 'week' ? 'Últimos 7 dias' : 
            period === 'month' ? 'Último mês' : 
            period === 'quarter' ? 'Último trimestre' : 'Último ano'
          })</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.revenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${value}`, 'Receita']} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Gráficos em pizza */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Serviços mais populares */}
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <h3 className="font-medium mb-4">Serviços Mais Populares</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.services}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.services.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Porcentagem']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Origem dos clientes */}
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <h3 className="font-medium mb-4">Origem dos Clientes</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.clientSource}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.clientSource.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Porcentagem']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

// src/pages/dashboard/professional/analytics.tsx
// Página dedicada para análises mais detalhadas

import React from 'react';
import { ProfessionalDashboardLayout } from '../../../components/layout/ProfessionalDashboardLayout';
import AnalyticsDashboard from '../../../components/analytics/AnalyticsDashboard';
import { BarChart2, Download, Share2 } from 'lucide-react';

const ProfessionalAnalytics = () => {
  return (
    <ProfessionalDashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-full text-purple-600 mr-3">
              <BarChart2 size={24} />
            </div>
            <h1 className="text-2xl font-medium">Dashboard Analítico</h1>
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              <Download size={16} className="mr-2" />
              Exportar
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              <Share2 size={16} className="mr-2" />
              Compartilhar
            </button>
          </div>
        </div>

        {/* Dashboard de análise completo */}
        <AnalyticsDashboard />
        
        {/* Seção adicional: Tendências e projeções */}
        <div className="mt-8 bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-medium mb-4">Tendências e Projeções</h2>
          
          <div className="bg-purple-50 p-4 rounded-lg mb-6">
            <p className="text-purple-800">
              <span className="font-medium">Dica:</span> Seus serviços mais procurados são Box Braids e Twist Senegalês. 
              Considere oferecer promoções ou pacotes combinados com estes serviços para aumentar suas receitas.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-800">Projeção de Receita</h3>
                <p className="text-2xl font-medium text-purple-600 mt-2">R$ 22.500,00</p>
                <p className="text-sm text-gray-500 mt-1">Próximo mês</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-800">Taxa de Ocupação</h3>
                <p className="text-2xl font-medium text-purple-600 mt-2">78%</p>
                <p className="text-sm text-gray-500 mt-1">Média do último mês</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-800">Retenção de Clientes</h3>
                <p className="text-2xl font-medium text-purple-600 mt-2">65%</p>
                <p className="text-sm text-gray-500 mt-1">Retorno em 90 dias</p>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">Oportunidades de Crescimento</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-xs font-bold">1</span>
                  </div>
                  <p>Aumente a disponibilidade aos sábados - este é seu dia mais movimentado com maior demanda.</p>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-xs font-bold">2</span>
                  </div>
                  <p>Expanda sua presença no Instagram - 30% dos seus novos clientes vêm desta plataforma.</p>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-xs font-bold">3</span>
                  </div>
                  <p>Considere adicionar serviços complementares como tratamentos capilares - existe demanda dos seus clientes atuais.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ProfessionalDashboardLayout>
  );
};

export default ProfessionalAnalytics;

// src/pages/dashboard/professional/settings/calendar.tsx
// Página dedicada para integrações de calendário

import React from 'react';
import { ProfessionalDashboardLayout } from '../../../../components/layout/ProfessionalDashboardLayout';
import { CalendarIntegrationSection } from '../../../../components/calendar/CalendarIntegrationSection';

const CalendarSettings = () => {
  return (
    <ProfessionalDashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-medium mb-6">Integrações de Calendário</h1>
        
        <div className="mb-6 bg-blue-50 p-4 rounded-xl">
          <h2 className="font-medium text-blue-800 mb-2">Dicas para Integração de Calendário</h2>
          <ul className="text-sm text-blue-700 space-y-2">
            <li>• Conecte seu Google Calendar para sincronizar automaticamente seus agendamentos</li>
            <li>• Evite conflitos de agenda mantendo todos seus compromissos em um único calendário</li>
            <li>• Configure lembretes para receber notificações antes dos seus agendamentos</li>
            <li>• A sincronização ocorre a cada 30 minutos - alterações podem não aparecer imediatamente</li>
          </ul>
        </div>
        
        <CalendarIntegrationSection />
        
        <div className="mt-8 bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-medium mb-4">Configurações Avançadas</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">Intervalos entre agendamentos</h3>
                <p className="text-sm text-gray-500 mt-1">Adicionar tempo de preparação entre serviços</p>
              </div>
              <select className="p-2 border border-gray-300 rounded-lg bg-white">
                <option value="0">Sem intervalo</option>
                <option value="15">15 minutos</option>
                <option value="30">30 minutos</option>
                <option value="45">45 minutos</option>
                <option value="60">1 hora</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">Horário de almoço</h3>
                <p className="text-sm text-gray-500 mt-1">Bloquear horário para almoço na agenda</p>
              </div>
              <div className="flex items-center space-x-2">
                <select className="p-2 border border-gray-300 rounded-lg bg-white">
                  <option value="12:00">12:00</option>
                  <option value="12:30">12:30</option>
                  <option value="13:00">13:00</option>
                  <option value="13:30">13:30</option>
                </select>
                <span>às</span>
                <select className="p-2 border border-gray-300 rounded-lg bg-white">
                  <option value="13:00">13:00</option>
                  <option value="13:30">13:30</option>
                  <option value="14:00">14:00</option>
                  <option value="14:30">14:30</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">Exibir detalhes do cliente</h3>
                <p className="text-sm text-gray-500 mt-1">Mostrar informações do cliente no Google Calendar</p>
              </div>
              <div className="flex">
                <div className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer bg-purple-600`}>
                  <div className={`w-4 h-4 rounded-full bg-white transform duration-200 translate-x-6`} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700">
              Salvar configurações
            </button>
          </div>
        </div>
      </div>
    </ProfessionalDashboardLayout>
  );
};

export default CalendarSettings;