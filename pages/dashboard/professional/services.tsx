// pages/dashboard/professional/services.tsx
import React from 'react';
import ProfessionalServices from '../../../components/professional/Services';
import ProfessionalDashboardLayout from '../../../components/layout/ProfessionalDashboardLayout';

const ProfessionalServicesPage = () => {
  return (
    <ProfessionalDashboardLayout>
      <ProfessionalServices />
    </ProfessionalDashboardLayout>
  );
};

export default ProfessionalServicesPage;