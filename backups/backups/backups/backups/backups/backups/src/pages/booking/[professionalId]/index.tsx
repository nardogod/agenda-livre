import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ChevronLeft, Clock, Star } from 'lucide-react';
import Layout from '../../../components/layout/Layout';

// Dados mockados
import { professionals } from '../../../utils/mockData';

// Componentes
import ServiceCard from '../../../components/booking/ServiceCard';

export default function BookingServicePage() {
  const router = useRouter();
  const { professionalId, service: preSelectedServiceId } = router.query;
  const [selectedService, setSelectedService] = useState(null);
  
  // Encontra o profissional com base no ID
  const professional = professionals.find(p => p.id === parseInt(professionalId as string));
  
  // Se houver um serviço pré-selecionado na URL, seleciona-o automaticamente
  useEffect(() => {
    if (professional && preSelectedServiceId) {
      const service = professional.services.find(s => s.id === parseInt(preSelectedServiceId as string));
      if (service) {
        setSelectedService(service);
      }
    }
  }, [professional, preSelectedServiceId]);
  
  // Se o profissional não for encontrado ou a página ainda estiver carregando
  if (!professional) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-medium ml-2">Carregando...</h1>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Continua para a próxima etapa quando um serviço é selecionado
  const continueToDateTime = () => {
    if (selectedService) {
      router.push(`/booking/${professionalId}/datetime?service=${selectedService.id}`);
    }
  };
  
  return (
    <Layout hideNav>
      <div className="bg-gray-50 min-h-screen pb-16">
        {/* Header */}
        <div className="relative">
          <div className="h-28 bg-purple-100"></div>
          
          <div className="px-5 pb-5">
            <div className="flex items-center -mt-16">
              <div className="w-16 h-16 rounded-xl bg-white p-1 shadow-sm">
                <img 
                  src={professional.profileImage} 
                  alt={professional.name} 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="ml-4 pt-2">
                <h1 className="font-medium text-lg">{professional.name}</h1>
                <div className="flex items-center mt-1">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 text-sm">{professional.rating}</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-purple-700 font-medium mt-2">{professional.specialty}</p>
          </div>
        </div>
        
        {/* Progress Steps */}
        <div className="px-5 mb-3 flex">
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className="flex-1 flex items-center">
              <div 
                className={`w-2 h-2 rounded-full ${
                  i === 0 
                    ? "bg-purple-600" 
                    : "bg-gray-300"
                }`}
              />
              {i < 4 && (
                <div className="flex-1 h-0.5 bg-gray-300" />
              )}
            </div>
          ))}
        </div>
        
        {/* Booking Content */}
        <div className="px-5">
          <div>
            <div className="flex items-center mb-6">
              <button 
                className="mr-3 p-2 rounded-full hover:bg-gray-100"
                onClick={() => router.back()}
              >
                <ChevronLeft size={18} />
              </button>
              <h2 className="text-lg font-medium">Selecione um serviço</h2>
            </div>
            
            {/* Service List */}
            <div className="space-y-3">
              {professional.services.map(service => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  selected={selectedService && selectedService.id === service.id}
                  onSelect={(service) => setSelectedService(service)}
                />
              ))}
            </div>
            
            {/* Continue Button */}
            {selectedService && (
              <button 
                className="w-full py-3 bg-purple-600 text-white font-medium rounded-xl mt-8"
                onClick={continueToDateTime}
              >
                Continuar
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}