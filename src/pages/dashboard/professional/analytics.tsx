// src/pages/dashboard/professional/analytics.tsx
import React, { Suspense } from 'react';
import { ProfessionalDashboardLayout } from '../../../components/layout/ProfessionalDashboardLayout';

// Lazy loading do componente AnalyticsDashboard
const AnalyticsDashboard = React.lazy(() => 
  import('../../../components/analytics/AnalyticsDashboard')
);

const ProfessionalAnalytics = () => {
  return (
    <ProfessionalDashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-medium mb-6">Dashboard Analítico</h1>
        
        <Suspense fallback={<div className="py-12 text-center">Carregando dashboard...</div>}>
          <AnalyticsDashboard />
        </Suspense>
      </div>
    </ProfessionalDashboardLayout>
  );
};

export default ProfessionalAnalytics;