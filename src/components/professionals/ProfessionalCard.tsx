// src/components/professionals/ProfessionalCard.tsx
import React from 'react';
import { Star, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export type Professional = {
  id: string;
  name: string;
  specialty: string;
  profileImage: string;
  location: {
    district: string;
    zone: string;
  };
  rating?: number; // Tornando rating opcional
  reviewCount?: number; // Tornando reviewCount opcional
  services?: {
    minPrice: number;
  };
};

interface ProfessionalCardProps {
  professional: Professional;
}

export const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional }) => {
  const { 
    id, 
    name, 
    specialty, 
    profileImage, 
    location, 
    rating = 0, // Fornecendo valor padrão
    reviewCount = 0, // Fornecendo valor padrão
    services 
  } = professional;

  return (
    <Link href={`/professionals/${id}`} className="block">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow transition-shadow">
        <div className="relative h-40 w-full">
          <Image 
            src={profileImage || '/assets/images/profile-placeholder.svg'} 
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="p-4">
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{specialty}</p>
          
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center text-gray-500 text-xs">
              <MapPin size={12} className="mr-1" />
              <span>{location?.district || 'Localização'}</span>
              {location?.zone && (
                <span className="ml-1 bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded text-xs">
                  {location.zone}
                </span>
              )}
            </div>
            
            <div className="flex items-center">
              <Star size={16} className="text-yellow-400" style={{ fill: 'rgb(250 204 21)' }} />
              <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
              <span className="text-xs text-gray-text-light ml-1">({reviewCount})</span>
            </div>
          </div>
          
          {services?.minPrice && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="text-sm">
                <span className="text-gray-500">A partir de </span>
                <span className="font-medium text-purple-600">
                  R$ {services.minPrice.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};