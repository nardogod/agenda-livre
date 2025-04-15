// src/components/analytics/AnalyticsDashboardSimple.tsx
import React from 'react';
import { TrendingUp, TrendingDown, Calendar, Users, DollarSign, BarChart2 } from 'lucide-react';

// Versão simplificada do dashboard para testes, sem o componente Recharts
interface AnalyticsData {
  revenue: {
    total: number;
    previousPeriodTotal: number | null;
    percentChange: number | null;
  };
  appointments: {
    total: number;
    previousPeriodTotal: number | null;
    percentChange: number | null;
  };
  clients: {
    total: number;
    previousPeriodTotal: number | null;
    percentChange: number | null;
  };
  conversion: {
    rate: number;
    previousPeriodRate: number | null;
    percentChange: number | null;
  };
  chartData: Array<{
    date: string;
    revenue: number;
    appointments: number;
  }>;
}

interface AnalyticsDashboardProps {
  data: AnalyticsData;
}

// Componente de card de métrica
const MetricCard: React.FC<{
  title: string;
  value: string;
  percentChange: number | null;
  icon: React.ReactNode;
}> = ({ title, value, percentChange, icon }) => {
  const renderChange = () => {
    if (percentChange === null) return null;
    
    const isPositive = percentChange >= 0;
    const changeClass = isPositive ? 'text-green-500' : 'text-red-500';
    const TrendIcon = isPositive ? TrendingUp : TrendingDown;
    
    return (
      <div 
        className={`flex items-center ${changeClass}`}
        data-testid="growth-indicator"
      >
        <TrendIcon size={14} className="mr-1" />
        <span>{isPositive ? '+' : ''}{percentChange.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%</span>
      </div>
    );
  };
  
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-500 text-sm">{title}</span>
        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
          {icon}
        </div>
      </div>
      <div className="font-medium text-xl mb-1">{value}</div>
      {renderChange()}
    </div>
  );
};

export const AnalyticsDashboardSimple: React.FC<AnalyticsDashboardProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Análise de Desempenho</h2>
      
      {/* Grid de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Receita"
          value={formatCurrency(data.revenue.total).replace('R$', 'R$ ')}
          percentChange={data.revenue.percentChange}
          icon={<DollarSign size={18} />}
        />
        <MetricCard
          title="Agendamentos"
          value={data.appointments.total.toString()}
          percentChange={data.appointments.percentChange}
          icon={<Calendar size={18} />}
        />
        <MetricCard
          title="Clientes"
          value={data.clients.total.toString()}
          percentChange={data.clients.percentChange}
          icon={<Users size={18} />}
        />
        <MetricCard
          title="Taxa de Conversão"
          value={`${data.conversion.rate}%`}
          percentChange={data.conversion.percentChange}
          icon={<BarChart2 size={18} />}
        />
      </div>
      
      {/* Placeholder para o gráfico - não renderiza o Recharts nos testes */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="font-medium mb-4">Receita e Agendamentos</h3>
        <div className="h-64" data-testid="revenue-chart">
          <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">
            Gráfico de receita e agendamentos
          </div>
        </div>
      </div>
    </div>
  );
};