// pages/professional/[id].jsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { 
  Calendar, 
  Clock, 
  Star, 
  MapPin, 
  ChevronRight, 
  Home,
  Heart,
  Share2
} from 'lucide-react';

// Componentes
import ProfessionalService from '../../components/professional/ProfessionalService';
import ReviewCard from '../../components/professional/ReviewCard';
import MainButton from '../../components/common/MainButton';

// Mock data (será substituído pela API)
const professionalMock = {
  id: 1,
  name: "Ana Oliveira",
  specialty: "Especialista em Tranças e Penteados",
  bio: "Especialista em tranças e penteados étnicos com mais de 8 anos de experiência. Formada pela escola de beleza étnica Afro Brasil, com especialização em técnicas ancestrais e modernas. Participação em workshops internacionais de penteados afro.",
  profileImage: "/api/placeholder/300/300",
  coverImage: "/api/placeholder/800/250",
  rating: 4.8,
  reviewCount: 124,
  location: "Pinheiros, Zona Oeste",
  instagramHandle: "@ana.oliveira.braids",
  offersHomeService: true,
  homeServiceFee: 50,
  services: [
    { id: 1, name: "Box Braids", price: 250, duration: 180, image: "/api/placeholder/100/100" },
    { id: 2, name: "Twist Senegalês", price: 290, duration: 240, image: "/api/placeholder/100/100" },
    { id: 3, name: "Penteado para Festa", price: 150, duration: 90, image: "/api/placeholder/100/100" },
    { id: 4, name: "Manutenção de Tranças", price: 100, duration: 60, image: "/api/placeholder/100/100" }
  ],
  reviews: [
    { id: 1, user: "Mariana S.", date: "15/03/2025", rating: 5, comment: "Trabalho impecável! Super paciente e o resultado ficou melhor do que eu esperava." },
    { id: 2, user: "Juliana M.", date: "28/02/2025", rating: 5, comment: "Foi minha primeira vez com tranças e a Ana me deixou super à vontade. Amei o resultado e já agendei retoque." },
    { id: 3, user: "Fernanda L.", date: "10/02/2025", rating: 4, comment: "Gostei muito do trabalho, apenas achei que demorou um pouco mais do que o esperado, mas o resultado valeu a pena." }
  ],
  availability: {
    // Aqui seria a disponibilidade do profissional
  }
};

export default function ProfessionalProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [activeTab, setActiveTab] = useState('services');
  
  // Aqui seria feita a chamada à API para buscar os dados do profissional
  // useEffect(() => {
  //   if (id) {
  //     fetchProfessionalData(id).then(...)
  //   }
  // }, [id]);
  
  const professional = professionalMock; // Seria substituído pelos dados da API
  
  return (
    <>
      <Head>
        <title>{professional.name} - Agenda Livre</title>
        <meta name="description" content={`${professional.specialty} - Agende seus serviços com ${professional.name}`} />
      </Head>
      
      <div className="bg-gray-50 min-h-screen pb-20">
        {/* Cover Image */}
        <div className="w-full h-40 relative">
          <img 
            src={professional.coverImage} 
            alt="" 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 flex space-x-2">
            <button className="p-2 bg-white bg-opacity-70 backdrop-blur-sm rounded-full">
              <Share2 size={20} className="text-gray-700" />
            </button>
            <button className="p-2 bg-white bg-opacity-70 backdrop-blur-sm rounded-full">
              <Heart size={20} className="text-gray-700" />
            </button>
          </div>
        </div>
        
        {/* Professional Info */}
        <div className="px-5 -mt-16 relative">
          <div className="flex items-end mb-4">
            <div className="w-24 h-24 rounded-xl bg-white p-1 shadow-sm">
              <img 
                src={professional.profileImage} 
                alt={professional.name} 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="ml-4 pb-1">
              <h1 className="font-medium text-xl">{professional.name}</h1>
              <div className="flex items-center mt-1">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <span className="ml-1 text-sm">{professional.rating}</span>
                <span className="ml-1 text-xs text-gray-500">({professional.reviewCount} avaliações)</span>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-purple-700 font-medium mb-2">{professional.specialty}</p>
          
          <div className="flex items-center text-sm text-gray-600 mb-5">
            <MapPin size={16} className="mr-1 text-gray-500" />
            <span>{professional.location}</span>
          </div>
          
          <p className="text-sm text-gray-700 mb-5">
            {professional.bio}
          </p>
          
          {professional.offersHomeService && (
            <div className="bg-purple-50 px-4 py-3 rounded-xl mb-6 flex items-center">
              <Home size={18} className="text-purple-600 mr-2" />
              <div>
                <span className="text-sm font-medium">Atendimento a domicílio disponível</span>
                <p className="text-xs text-gray-600 mt-0.5">Taxa adicional de R$ {professional.homeServiceFee.toFixed(2)}</p>
              </div>
            </div>
          )}
          
          {/* Instagram */}
          {professional.instagramHandle && (
            <a 
              href={`https://instagram.com/${professional.instagramHandle.replace('@', '')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-xl mb-6 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span className="text-sm">{professional.instagramHandle}</span>
            </a>
          )}
          
          {/* Booking Button */}
          <MainButton 
            onClick={() => router.push(`/booking/${professional.id}`)}
            className="w-full mb-8"
          >
            Agendar horário
          </MainButton>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-5">
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
          </div>
          
          {/* Tab Content */}
          {activeTab === 'services' ? (
            <div>
              <h2 className="font-medium mb-4">Serviços oferecidos</h2>
              <div className="space-y-3">
                {professional.services.map(service => (
                  <ProfessionalService 
                    key={service.id} 
                    service={service} 
                    onSelect={() => router.push(`/booking/${professional.id}?service=${service.id}`)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-medium">Avaliações dos clientes</h2>
                <div className="flex items-center">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 font-medium">{professional.rating}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {professional.reviews.map(review => (
                  <ReviewCard key={review.id} review={review} />
                ))}
                
                <button className="w-full py-3 text-sm text-purple-600 font-medium border border-purple-200 rounded-xl hover:bg-purple-50 transition-colors">
                  Ver todas as avaliações
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}