// create-structure.js
const fs = require('fs-extra');
const path = require('path');

// Diretório raiz do projeto
const projectRoot = process.cwd();
const targetProjectDir = path.join(projectRoot, '..');

// Estrutura de diretórios a ser criada
const directories = [
  'src/pages',
  'src/pages/auth',
  'src/pages/booking',
  'src/pages/dashboard',
  'src/pages/dashboard/client',
  'src/pages/dashboard/professional',
  'src/pages/professionals',
  'src/components/layout',
  'src/components/booking',
  'src/components/professionals',
  'src/components/ui',
  'src/contexts',
  'src/services',
  'src/types',
  'src/styles',
  'src/utils'
];

// Arquivos de componentes básicos a serem criados
const basicComponents = {
  // Páginas
  'src/pages/index.tsx': `// src/pages/index.tsx
import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import ProfessionalList from '../components/professionals/ProfessionalList';
import { getProfessionals } from '../services/professionals';

const HomePage = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfessionals = async () => {
      try {
        const data = await getProfessionals();
        setProfessionals(data);
      } catch (error) {
        console.error('Erro ao carregar profissionais:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfessionals();
  }, []);

  return (
    <MainLayout>
      <div className="p-4">
        <h1 className="text-2xl font-medium mb-6">Profissionais Disponíveis</h1>
        
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-pulse text-center">
              <div className="h-4 bg-gray-200 rounded w-32 mb-2 mx-auto"></div>
              <div className="h-2 bg-gray-200 rounded w-24 mx-auto"></div>
            </div>
          </div>
        ) : (
          <ProfessionalList professionals={professionals} />
        )}
      </div>
    </MainLayout>
  );
};

export default HomePage;
`,

  // Componentes
  'src/components/professionals/ProfessionalList.tsx': `// src/components/professionals/ProfessionalList.tsx
import React from 'react';
import ProfessionalCard from './ProfessionalCard';
import { Professional } from '../../types/professional';

interface ProfessionalListProps {
  professionals: Professional[];
}

const ProfessionalList: React.FC<ProfessionalListProps> = ({ professionals }) => {
  if (professionals.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum profissional encontrado.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {professionals.map((professional) => (
        <ProfessionalCard key={professional.id} professional={professional} />
      ))}
    </div>
  );
};

export default ProfessionalList;
`,

  'src/components/professionals/ProfessionalCard.tsx': `// src/components/professionals/ProfessionalCard.tsx
import React from 'react';
import Link from 'next/link';
import { Star, MapPin } from 'lucide-react';
import { Professional } from '../../types/professional';

interface ProfessionalCardProps {
  professional: Professional;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional }) => {
  // Traduzir zona para português
  const zoneMap = {
    'north': 'Zona Norte',
    'south': 'Zona Sul',
    'east': 'Zona Leste',
    'west': 'Zona Oeste',
    'center': 'Região Central'
  };

  const zoneName = zoneMap[professional.zone] || professional.zone;

  return (
    <Link href={'/professionals/' + professional.id}>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="h-40 w-full relative">
          <img 
            src={professional.profileImage} 
            alt={professional.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-4">
          <h3 className="font-medium text-lg">{professional.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{professional.specialty}</p>
          
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <span className="ml-1 text-sm">{professional.rating}</span>
            </div>
            
            <div className="flex items-center text-xs text-gray-500">
              <MapPin size={14} className="mr-1" />
              <span>{professional.district}, </span>
              <span className="ml-1 text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                {zoneName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProfessionalCard;
`,

  // Tipos
  'src/types/professional.ts': `// src/types/professional.ts
export interface Professional {
  id: number;
  name: string;
  specialty: string;
  profileImage: string;
  rating: number;
  zone: 'north' | 'south' | 'east' | 'west' | 'center';
  district: string;
  category: string;
  services: Service[];
}

export interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
  description?: string;
  image?: string;
  has_hair_option?: boolean;
  hair_price_small?: number;
  hair_price_medium?: number;
  hair_price_large?: number;
}

export interface Review {
  id: string;
  clientId: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  serviceId: string;
  serviceName: string;
}
`,

  'src/types/user.ts': `// src/types/user.ts
export interface User {
  id: number;
  name: string;
  email: string;
  type: 'client' | 'professional';
  phone?: string;
  specialty?: string;
  isVerified?: boolean;
}
`,

  'src/types/booking.ts': `// src/types/booking.ts
export interface Appointment {
  id: string;
  professional: {
    id: number;
    name: string;
    profileImage: string;
  };
  client: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  service: {
    id: number;
    name: string;
    price: number;
    duration: number;
  };
  start_datetime: string;
  end_datetime: string;
  use_own_hair: boolean;
  hair_length?: 'small' | 'medium' | 'large';
  is_home_service: boolean;
  address?: {
    id: string;
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
    zip_code: string;
  };
  has_allergies: boolean;
  allergies_description?: string;
  notes?: string;
  status: 'pending_payment' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  service_price: number;
  hair_price: number;
  home_service_fee: number;
  total_price: number;
  created_at: string;
  updated_at: string;
}
`,

  // Utils
  'src/utils/mockData.ts': `// src/utils/mockData.ts
import { Review } from '../types/professional';

export const mockReviews: Review[] = [
  {
    id: 'review1',
    clientId: 'client1',
    clientName: 'Amanda Silva',
    rating: 5,
    comment: 'Trabalho incrível! Fiz box braids e ficou perfeito, exatamente como eu queria. Recomendo muito!',
    date: '2025-03-10T14:30:00Z',
    serviceId: '1',
    serviceName: 'Box Braids'
  },
  {
    id: 'review2',
    clientId: 'client2',
    clientName: 'Carolina Mendes',
    rating: 4,
    comment: 'Muito profissional e atenciosa. O trabalho ficou ótimo, só achei o tempo um pouco longo.',
    date: '2025-02-28T16:45:00Z',
    serviceId: '2',
    serviceName: 'Twist Senegalês'
  },
  {
    id: 'review3',
    clientId: 'client3',
    clientName: 'Juliana Costa',
    rating: 5,
    comment: 'Super recomendo! Fiz um penteado para festa e recebi muitos elogios. Profissional muito habilidosa.',
    date: '2025-02-15T10:15:00Z',
    serviceId: '3',
    serviceName: 'Penteado para Festa'
  }
];
`
};

// Função para criar um arquivo se ele não existir
const createFileIfNotExists = (filePath, content) => {
  const fullPath = path.join(targetProjectDir, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`Criando arquivo: ${filePath}`);
    fs.ensureFileSync(fullPath);
    fs.writeFileSync(fullPath, content);
  } else {
    console.log(`Arquivo já existe: ${filePath}`);
  }
};

// Criar diretórios
console.log('Criando estrutura de diretórios...');
directories.forEach(dir => {
  const fullPath = path.join(targetProjectDir, dir);
  if (!fs.existsSync(fullPath)) {
    console.log(`Criando diretório: ${dir}`);
    fs.mkdirsSync(fullPath);
  } else {
    console.log(`Diretório já existe: ${dir}`);
  }
});

// Criar arquivos básicos
console.log('Criando arquivos básicos...');
Object.entries(basicComponents).forEach(([filePath, content]) => {
  createFileIfNotExists(filePath, content);
});

console.log('Estrutura básica criada com sucesso!');