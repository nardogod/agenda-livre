import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, 
  Clock, 
  Star, 
  Calendar, 
  ChevronRight, 
  Phone, 
  Mail, 
  Instagram, 
  Home,
  ArrowLeft
} from 'lucide-react';

// Dados mockados para o profissional
const professionalData = {
  id: 1,
  name: "Ana Oliveira",
  specialty: "Especialista em Tranças e Penteados",
  bio: "Cabeleireira com mais de 10 anos de experiência em tranças e penteados afro. Especialista em Box Braids, Twists e técnicas de proteção capilar.",
  rating: 4.8,
  reviewCount: 124,
  profileImage: "/api/placeholder/300/300",
  coverImage: "/api/placeholder/800/300",
  location: {
    district: "Pinheiros",
    zone: "Zona Oeste",
    address: "Rua dos Pinheiros, 123"
  },
  offersHomeService: true,
  homeServiceFee: 50.0,
  contact: {
    phone: "(11) 99999-9999",
    email: "ana.oliveira@email.com",
    instagram: "@ana.tranças"
  },
  workingHours: [
    { day: "Segunda", hours: "09:00 - 18:00" },
    { day: "Terça", hours: "09:00 - 18:00" },
    { day: "Quarta", hours: "09:00 - 18:00" },
    { day: "Quinta", hours: "09:00 - 18:00" },
    { day: "Sexta", hours: "09:00 - 18:00" },
    { day: "Sábado", hours: "09:00 - 14:00" },
    { day: "Domingo", hours: "Fechado" }
  ],
  services: [
    { id: 1, name: "Box Braids", price: 250, duration: 180, image: "/api/placeholder/200/150", description: "Tranças finas a médias, estilo box braids tradicionais." },
    { id: 2, name: "Twist Senegalês", price: 290, duration: 240, image: "/api/placeholder/200/150", description: "Twists estilo senegalês com acabamento profissional." },
    { id: 3, name: "Penteado para Festa", price: 150, duration: 90, image: "/api/placeholder/200/150", description: "Penteados elegantes para ocasiões especiais." },
    { id: 4, name: "Manutenção de Tranças", price: 100, duration: 60, image: "/api/placeholder/200/150", description: "Retoque e manutenção de tranças existentes." }
  ],
  reviews: [
    { id: 1, author: "Mariana Silva", rating: 5, date: "02/04/2025", comment: "Trabalho incrível! Minhas box braids ficaram perfeitas e duraram muito tempo." },
    { id: 2, author: "Juliana Costa", rating: 5, date: "25/03/2025", comment: "Atendimento excelente, muito profissional e pontual." },
    { id: 3, author: "Carolina Santos", rating: 4, date: "15/03/2025", comment: "Amei o resultado, recomendo muito! Só demorou um pouco mais que o previsto." }
  ]
};

// Componente para o card de serviço
const ServiceCard = ({ service }: { service: any }) => (
  <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
    <div className="flex">
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-purple-100">
        <Image 
          src={service.image} 
          alt={service.name} 
          width={80} 
          height={80} 
          className="object-cover w-full h-full"
        />
      </div>
      <div className="ml-4 flex-grow">
        <h3 className="font-medium">{service.name}</h3>
        <p className="text-xs text-gray-500 mt-1">{service.description}</p>
        <div className="flex items-center mt-2 text-xs text-gray-600">
          <Clock size={12} className="mr-1" />
          <span>{service.duration} min</span>
        </div>
      </div>
      <div className="text-right">
        <div className="font-medium">R$ {service.price.toFixed(2)}</div>
        <Link href={`/booking/${professionalData.id}?service=${service.id}`} className="text-xs text-purple-600 mt-1 inline-block">
          Agendar
        </Link>
      </div>
    </div>
  </div>
);

// Componente para o card de avaliação
const ReviewCard = ({ review }: { review: any }) => (
  <div className="bg-white rounded-xl p-4 mb-3">
    <div className="flex justify-between items-start">
      <h4 className="font-medium">{review.author}</h4>
      <span className="text-xs text-gray-500">{review.date}</span>
    </div>
    <div className="flex items-center mt-1">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          size={14} 
          className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
        />
      ))}
    </div>
    <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
  </div>
);

// Componente para as informações de horário
const WorkingHoursSection = ({ workingHours }: { workingHours: any }) => (
  <div className="mt-6">
    <h3 className="font-medium mb-3">Horário de Atendimento</h3>
    <div className="bg-white rounded-xl overflow-hidden">
      {workingHours.map((item: any, index: any) => (
        <div 
          key={index} 
          className={`flex justify-between p-3 ${
            index < workingHours.length - 1 ? 'border-b border-gray-100' : ''
          }`}
        >
          <span className="text-sm">{item.day}</span>
          <span className={`text-sm ${item.hours === 'Fechado' ? 'text-gray-400' : 'text-gray-700'}`}>
            {item.hours}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default function ProfessionalProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [activeTab, setActiveTab] = useState('services');
  
  // Em uma implementação real, carregaríamos os dados do profissional com base no ID
  // const professional = useProfessionalData(id);
  const professional = professionalData;
  
  return (
    <>
      <Head>
        <title>{professional.name} | Agenda Livre</title>
        <meta name="description" content={`${professional.specialty}. Agende serviços com ${professional.name}.`} />
      </Head>
      
      <div className="bg-gray-50 min-h-screen pb-20">
        {/* Header com foto de capa */}
        <div className="relative">
          <div className="h-40 bg-purple-100 relative overflow-hidden">
            <Image 
              src={professional.coverImage} 
              alt="" 
              layout="fill" 
              objectFit="cover" 
              priority 
            />
            <button 
              className="absolute top-4 left-4 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center"
              onClick={() => router.back()}
            >
              <ArrowLeft size={18} />
            </button>
          </div>
          
          <div className="px-5">
            <div className="flex -mt-16 mb-4">
              <div className="w-24 h-24 rounded-xl bg-white p-1 shadow-sm">
                <Image 
                  src={professional.profileImage} 
                  alt={professional.name} 
                  width={96} 
                  height={96} 
                  className="object-cover rounded-lg" 
                />
              </div>
              <div className="ml-4 pt-10">
                <h1 className="font-medium text-xl">{professional.name}</h1>
                <div className="flex items-center mt-1">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 text-sm">{professional.rating}</span>
                  <span className="ml-1 text-xs text-gray-500">
                    ({professional.reviewCount} avaliações)
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-purple-700 font-medium">{professional.specialty}</p>
            
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <MapPin size={14} className="text-gray-400 mr-1" />
              <span>
                {professional.location.district}, {professional.location.zone}
              </span>
            </div>
            
            {professional.offersHomeService && (
              <div className="mt-2 inline-flex items-center bg-purple-50 px-2 py-1 rounded-lg text-purple-700 text-xs">
                <Home size={12} className="mr-1" />
                <span>Atende a domicílio</span>
              </div>
            )}
            
            <div className="mt-4 bg-white rounded-xl p-4">
              <p className="text-sm text-gray-600">{professional.bio}</p>
            </div>
            
            {/* Botão de Agendamento Principal */}
            <div className="mt-4">
              <Link href={`/booking/${professional.id}`} className="block w-full py-3 bg-purple-600 text-white font-medium rounded-xl text-center">
                Agendar Horário
              </Link>
            </div>
          </div>
        </div>
        
        {/* Tabs de navegação */}
        <div className="mt-6 px-5">
          <div className="flex border-b border-gray-200">
            <button 
              className={`py-3 px-4 text-sm font-medium ${
                activeTab === 'services' 
                  ? 'text-purple-600 border-b-2 border-purple-600' 
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('services')}
            >
              Serviços
            </button>
            <button 
              className={`py-3 px-4 text-sm font-medium ${
                activeTab === 'reviews' 
                  ? 'text-purple-600 border-b-2 border-purple-600' 
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Avaliações
            </button>
            <button 
              className={`py-3 px-4 text-sm font-medium ${
                activeTab === 'info' 
                  ? 'text-purple-600 border-b-2 border-purple-600' 
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('info')}
            >
              Informações
            </button>
          </div>
          
          {/* Conteúdo da tab Serviços */}
          {activeTab === 'services' && (
            <div className="mt-4">
              <h2 className="text-lg font-medium mb-4">Serviços Disponíveis</h2>
              <div>
                {professional.services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </div>
          )}
          
          {/* Conteúdo da tab Avaliações */}
          {activeTab === 'reviews' && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Avaliações</h2>
                <div className="flex items-center">
                  <Star size={16} className="text-yellow-400 fill-yellow-400 mr-1" />
                  <span className="font-medium">{professional.rating}</span>
                </div>
              </div>
              
              <div>
                {professional.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
                <button className="text-purple-600 text-sm font-medium mt-2">
                  Ver todas as avaliações
                </button>
              </div>
            </div>
          )}
          
          {/* Conteúdo da tab Informações */}
          {activeTab === 'info' && (
            <div className="mt-4">
              <h2 className="text-lg font-medium mb-4">Informações de Contato</h2>
              
              <div className="bg-white rounded-xl p-4 mb-4">
                <h3 className="font-medium mb-3">Endereço</h3>
                <div className="flex items-start text-sm text-gray-600">
                  <MapPin size={16} className="text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{professional.location.address}, {professional.location.district}, {professional.location.zone}</span>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 mb-4">
                <h3 className="font-medium mb-3">Contato</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone size={16} className="text-gray-400 mr-2" />
                    <span>{professional.contact.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail size={16} className="text-gray-400 mr-2" />
                    <span>{professional.contact.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Instagram size={16} className="text-gray-400 mr-2" />
                    <span>{professional.contact.instagram}</span>
                  </div>
                </div>
              </div>
              
              {professional.offersHomeService && (
                <div className="bg-white rounded-xl p-4 mb-4">
                  <h3 className="font-medium mb-2">Atendimento a Domicílio</h3>
                  <p className="text-sm text-gray-600">
                    Este profissional oferece atendimento a domicílio com taxa adicional de 
                    <span className="font-medium"> R$ {professional.homeServiceFee.toFixed(2)}</span>.
                  </p>
                </div>
              )}
              
              <WorkingHoursSection workingHours={professional.workingHours} />
            </div>
          )}
        </div>
        
        {/* Botão fixo na parte inferior */}
        <div className="fixed bottom-0 left-0 right-0 px-5 py-4 bg-white border-t border-gray-200">
          <Link href={`/booking/${professional.id}`} className="block w-full py-3 bg-purple-600 text-white font-medium rounded-xl text-center">
            Agendar Horário
          </Link>
        </div>
      </div>
    </>
  );
}