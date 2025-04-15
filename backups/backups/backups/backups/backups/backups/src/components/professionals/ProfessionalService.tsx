import React from 'react';
import Link from 'next/link';
import { Clock } from 'lucide-react';

interface ProfessionalServiceProps {
  service: {
    id: number;
    name: string;
    price: number;
    duration: number;
  };
  professionalId: number;
}

export default function ProfessionalService({ service, professionalId }: ProfessionalServiceProps) {
  return (
    <div className="bg-white p-4 rounded-xl">
      <div className="flex justify-between">
        <div>
          <h3 className="font-medium">{service.name}</h3>
          <div className="flex items-center mt-1 text-gray-500 text-xs">
            <Clock size={12} className="mr-1" />
            <span>{service.duration} min</span>
          </div>
        </div>
        <div className="text-right">
          <div className="font-medium">R$ {service.price.toFixed(2)}</div>
          <Link href={`/booking/${professionalId}?service=${service.id}`}>
            <div className="text-xs text-purple-600 mt-1 cursor-pointer">Agendar</div>
          </Link>
        </div>
      </div>
    </div>
  );
}