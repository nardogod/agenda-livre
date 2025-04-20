// pages/dashboard/professional/analytics.tsx
import React from 'react';
import ProfessionalDashboardLayout from '../../../components/layout/ProfessionalDashboardLayout';
// Importação condicional para evitar erros se o Recharts não estiver instalado
let RechartsComponents: any = {};
try {
  // Tente importar Recharts, mas não falhe se não estiver disponível
  const recharts = require('recharts');
  RechartsComponents = {
    BarChart: recharts.BarChart,
    Bar: recharts.Bar,
    XAxis: recharts.XAxis,
    YAxis: recharts.YAxis,
    CartesianGrid: recharts.CartesianGrid,
    Tooltip: recharts.Tooltip,
    Legend: recharts.Legend,
    ResponsiveContainer: recharts.ResponsiveContainer
  };
} catch (e) {
  console.warn('Recharts não está disponível, usando versão simplificada do gráfico');
}

interface ChartDataItem {
  month: string;
  revenue: number;
  appointments: number;
}

const mockData: ChartDataItem[] = [
  { month: 'Jan', revenue: 1200, appointments: 12 },
  { month: 'Fev', revenue: 1500, appointments: 15 },
  { month: 'Mar', revenue: 1800, appointments: 18 },
  { month: 'Abr', revenue: 2180, appointments: 22 },
  { month: 'Mai', revenue: 0, appointments: 0 }, // Mês atual, sem dados completos
  { month: 'Jun', revenue: 0, appointments: 0 }, // Futuro
];

const ProfessionalAnalyticsPage: React.FC = () => {
  return (
    <ProfessionalDashboardLayout>
      <div className="px-4 py-6 md:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Estatísticas e Análises</h1>
          <p className="text-gray-600">Acompanhe o desempenho do seu negócio</p>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-gray-600 text-sm">Total de Agendamentos</p>
            <h3 className="text-2xl font-bold">67</h3>
            <p className="text-green-600 text-xs flex items-center mt-1">
              <span>+22%</span>
              <span className="ml-1">em relação ao mês anterior</span>
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-gray-600 text-sm">Receita Total</p>
            <h3 className="text-2xl font-bold">R$ 6.680,00</h3>
            <p className="text-green-600 text-xs flex items-center mt-1">
              <span>+18%</span>
              <span className="ml-1">em relação ao mês anterior</span>
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-gray-600 text-sm">Avaliação Média</p>
            <h3 className="text-2xl font-bold">4.8</h3>
            <div className="flex mt-1">
              {[1, 2, 3, 4, 5].map(star => (
                <svg 
                  key={star}
                  className={`w-4 h-4 ${star <= 4.8 ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>

        {/* Gráfico de receita */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-8">
          <h3 className="text-lg font-medium mb-4">Receita por Mês</h3>
          <div className="h-80">
            {Object.keys(RechartsComponents).length > 0 ? (
              <RechartsComponents.ResponsiveContainer width="100%" height="100%">
                <RechartsComponents.BarChart
                  data={mockData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <RechartsComponents.CartesianGrid strokeDasharray="3 3" />
                  <RechartsComponents.XAxis dataKey="month" />
                  <RechartsComponents.YAxis />
                  <RechartsComponents.Tooltip 
                    formatter={(value: number) => [`R$ ${value}`, 'Receita']}
                  />
                  <RechartsComponents.Legend />
                  <RechartsComponents.Bar dataKey="revenue" name="Receita (R$)" fill="#8B5CF6" />
                </RechartsComponents.BarChart>
              </RechartsComponents.ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-gray-500">Gráfico não disponível</p>
                  <p className="text-sm text-gray-400">Instale o Recharts para visualizar os gráficos</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Gráfico de agendamentos */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-8">
          <h3 className="text-lg font-medium mb-4">Agendamentos por Mês</h3>
          <div className="h-80">
            {Object.keys(RechartsComponents).length > 0 ? (
              <RechartsComponents.ResponsiveContainer width="100%" height="100%">
                <RechartsComponents.BarChart
                  data={mockData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <RechartsComponents.CartesianGrid strokeDasharray="3 3" />
                  <RechartsComponents.XAxis dataKey="month" />
                  <RechartsComponents.YAxis />
                  <RechartsComponents.Tooltip />
                  <RechartsComponents.Legend />
                  <RechartsComponents.Bar dataKey="appointments" name="Agendamentos" fill="#10B981" />
                </RechartsComponents.BarChart>
              </RechartsComponents.ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-gray-500">Gráfico não disponível</p>
                  <p className="text-sm text-gray-400">Instale o Recharts para visualizar os gráficos</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Serviços populares */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="text-lg font-medium mb-4">Serviços Mais Populares</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Box Braids</p>
                <p className="text-xs text-gray-500">32 agendamentos</p>
              </div>
              <p className="font-medium text-purple-600">R$ 3.200,00</p>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Twist Senegalês</p>
                <p className="text-xs text-gray-500">22 agendamentos</p>
              </div>
              <p className="font-medium text-purple-600">R$ 2.420,00</p>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Penteado para Festa</p>
                <p className="text-xs text-gray-500">13 agendamentos</p>
              </div>
              <p className="font-medium text-purple-600">R$ 1.060,00</p>
            </div>
          </div>
        </div>
      </div>
    </ProfessionalDashboardLayout>
  );
};

export default ProfessionalAnalyticsPage;