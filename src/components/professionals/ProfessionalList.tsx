import React from 'react';
import ProfessionalCard from './ProfessionalCard';
import { Professional } from '@/types/professional';

type ProfessionalListProps = {
  professionals: Professional[];
  className?: string;
};

const ProfessionalList: React.FC<ProfessionalListProps> = ({ 
  professionals,
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {professionals.map((professional) => (
        <ProfessionalCard
          key={professional.id}
          professional={professional}
        />
      ))}
    </div>
  );
};

export default ProfessionalList;