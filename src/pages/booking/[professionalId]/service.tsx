// src/pages/booking/[professionalId]/service.tsx
import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useBooking } from '../../../contexts/BookingContext';
import ServiceCard from '../../../components/booking/ServiceCard';
import MainLayout from '../../../components/layout/MainLayout';

// Este é um alias para o arquivo index.tsx no mesmo diretório
// Mantido para compatibilidade se houver links existentes

const ServicePage = () => {
  const router = useRouter();
  const { professionalId } = router.query;
  
  // Redirecionar para o arquivo canônico
  React.useEffect(() => {
    if (professionalId) {
      router.replace(`/booking/${professionalId}`);
    }
  }, [professionalId, router]);
  
  return (
    <MainLayout>
      <div className="p-4">
        <p>Redirecionando...</p>
      </div>
    </MainLayout>
  );
};

export default ServicePage;