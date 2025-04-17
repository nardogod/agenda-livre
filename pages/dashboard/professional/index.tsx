// pages/dashboard/professional/index.tsx
import React from 'react';
import ProfessionalDashboard from '../../../components/professional/Dashboard';
import ProfessionalDashboardLayout from '../../../components/layout/ProfessionalDashboardLayout';

const ProfessionalDashboardPage = () => {
  return (
    <ProfessionalDashboardLayout>
      <ProfessionalDashboard />
    </ProfessionalDashboardLayout>
  );
};

export default ProfessionalDashboardPage;