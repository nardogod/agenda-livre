// src/services/professionals.ts
import { Professional } from '../types/professional';

// Dados mockados para desenvolvimento
const MOCK_PROFESSIONALS: Professional[] = [
  {
    id: 1,
    name: 'Ana Oliveira',
    specialty: 'Especialista em Tranças e Penteados',
    profileImage: '/api/placeholder/300/300',
    rating: 4.8,
    zone: 'south',
    district: 'Moema',
    category: 'braids',
    services: [
      { id: 1, name: 'Box Braids', price: 250, duration: 180 },
      { id: 2, name: 'Twist Senegalês', price: 290, duration: 240 },
      { id: 3, name: 'Penteado para Festa', price: 150, duration: 90 },
      { id: 4, name: 'Manutenção de Tranças', price: 100, duration: 60 }
    ],
  },
  {
    id: 2,
    name: 'Carlos Santos',
    specialty: 'Barbeiro e Especialista em Cortes Modernos',
    profileImage: '/api/placeholder/300/300',
    rating: 4.7,
    zone: 'west',
    district: 'Pinheiros',
    category: 'barber',
    services: [
      { id: 5, name: 'Corte Masculino', price: 70, duration: 40 },
      { id: 6, name: 'Barba', price: 50, duration: 30 },
      { id: 7, name: 'Corte e Barba', price: 100, duration: 60 },
      { id: 8, name: 'Design de Sobrancelhas', price: 30, duration: 20 }
    ],
  },
  {
    id: 3,
    name: 'Juliana Costa',
    specialty: 'Manicure e Nail Designer',
    profileImage: '/api/placeholder/300/300',
    rating: 4.9,
    zone: 'east',
    district: 'Tatuapé',
    category: 'nails',
    services: [
      { id: 9, name: 'Manicure', price: 60, duration: 45 },
      { id: 10, name: 'Pedicure', price: 70, duration: 50 },
      { id: 11, name: 'Unhas em Gel', price: 120, duration: 90 },
      { id: 12, name: 'Unhas em Fibra', price: 140, duration: 100 }
    ],
  },
  {
    id: 4,
    name: 'Mariana Silva',
    specialty: 'Cabeleireira e Colorista',
    profileImage: '/api/placeholder/300/300',
    rating: 4.6,
    zone: 'center',
    district: 'República',
    category: 'hair',
    services: [
      { id: 13, name: 'Corte Feminino', price: 90, duration: 60 },
      { id: 14, name: 'Coloração', price: 180, duration: 120 },
      { id: 15, name: 'Hidratação', price: 100, duration: 60 },
      { id: 16, name: 'Escova', price: 80, duration: 45 }
    ],
  },
  {
    id: 5,
    name: 'Fernanda Lima',
    specialty: 'Maquiadora Profissional',
    profileImage: '/api/placeholder/300/300',
    rating: 5.0,
    zone: 'north',
    district: 'Santana',
    category: 'makeup',
    services: [
      { id: 17, name: 'Maquiagem Social', price: 150, duration: 60 },
      { id: 18, name: 'Maquiagem para Noivas', price: 350, duration: 120 },
      { id: 19, name: 'Design de Sobrancelhas', price: 70, duration: 30 },
      { id: 20, name: 'Curso de Automaquiagem', price: 200, duration: 120 }
    ],
  }
];

// Função para obter todos os profissionais
export const getProfessionals = async (): Promise<Professional[]> => {
  // Simula uma chamada API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_PROFESSIONALS);
    }, 500); // Demora de 500ms para simular latência de rede
  });
};

// Função para obter um profissional específico por ID
export const getProfessionalById = async (id: number): Promise<Professional | null> => {
  // Simula uma chamada API
  return new Promise((resolve) => {
    setTimeout(() => {
      const professional = MOCK_PROFESSIONALS.find(p => p.id === id) || null;
      resolve(professional);
    }, 300);
  });
};

// Função para filtrar profissionais
export const filterProfessionals = async (
  searchTerm: string = '',
  zone: string = '',
  category: string = '',
): Promise<Professional[]> => {
  // Simula uma chamada API com filtros
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...MOCK_PROFESSIONALS];
      
      // Filtrar por termo de busca
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(
          p => p.name.toLowerCase().includes(term) || 
               p.specialty.toLowerCase().includes(term)
        );
      }
      
      // Filtrar por zona
      if (zone) {
        filtered = filtered.filter(p => p.zone === zone);
      }
      
      // Filtrar por categoria
      if (category) {
        filtered = filtered.filter(p => p.category === category);
      }
      
      resolve(filtered);
    }, 500);
  });
};