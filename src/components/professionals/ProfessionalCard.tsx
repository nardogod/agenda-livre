import React from 'react';
import { Star, MapPin } from 'lucide-react';
import Link from 'next/link';

type ProfessionalCardProps = {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  location: {
    district: string;
    zone: string;
  };
  imageUrl: string;
  className?: string;
};

export const ProfessionalCard: React.FC<ProfessionalCardProps> = ({
  id,
  name,
  specialty,
  rating,
  reviewCount,
  location,
  imageUrl,
  className = '',
}) => {
  return (
    <Link href={`/professionals/${id}`}>
      <div 
        className={`
          bg-white 
          rounded-xl 
          overflow-hidden 
          hover:shadow-sm 
          transition-shadow 
          cursor-pointer
          ${className}
        `}
      >
        {/* Imagem */}
        <div className="h-48 overflow-hidden">
          <img 
            src={imageUrl || '/api/placeholder/400/300'} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Conteúdo */}
        <div className="p-4">
          <h3 className="font-medium text-black-text">{name}</h3>
          
          <p className="text-sm text-gray-text mt-1">{specialty}</p>
          
          <div className="flex items-center mt-2">
            <div className="flex items-center">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
              <span className="text-xs text-gray-text-light ml-1">({reviewCount})</span>
            </div>
          </div>
          
          <div className="flex items-start mt-3">
            <MapPin size={16} className="text-gray-text-light mt-0.5" />
            <div className="ml-1">
              <span className="text-sm text-gray-text">{location.district}, </span>
              <span className="text-xs text-gray-text-light py-0.5 px-1 bg-gray-light rounded-md">
                {location.zone}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProfessionalCard;