// pages/dashboard/professional/appointments.tsx
import React from 'react';
import ProfessionalAppointments from '../../../components/professional/Appointments';
import ProfessionalDashboardLayout from '../../../components/layout/ProfessionalDashboardLayout';

const ProfessionalAppointmentsPage = () => {
  return (
    <ProfessionalDashboardLayout>
      <ProfessionalAppointments />
    </ProfessionalDashboardLayout>
  );
};

export default ProfessionalAppointmentsPage;