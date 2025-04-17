import axios from 'axios';

// Em uma implementação real, este seria o endereço base da API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.agendalivre.com.br';

// Axios instance com configurações padrão
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interfaces para tipagem
export interface Professional {
  id: number;
  name: string;
  specialty: string;
  profileImage: string;
  coverImage?: string;
  bio?: string;
  rating: number;
  reviewCount: number;
  location: {
    district: string;
    zone: string;
    address?: string;
  };
  offersHomeService: boolean;
  homeServiceFee: number;
  contact?: {
    phone: string;
    email: string;
    instagram?: string;
  };
  workingHours?: {
    day: string;
    hours: string;
  }[];
  services: Service[];
  reviews?: Review[];
  hairPrices: {
    small: number;
    medium: number;
    large: number;
  };
}

export interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  duration: number;
  image?: string;
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Appointment {
  id: number;
  professionalId: number;
  professional: Professional;
  serviceId: number;
  service: Service;
  clientId: number;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  date: Date;
  time: string;
  duration: number;
  status: 'pending_payment' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  isHomeService: boolean;
  address?: string;
  useOwnHair: boolean;
  hairLength?: 'small' | 'medium' | 'large';
  hasAllergies: boolean;
  allergiesDescription?: string;
  notes?: string;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

// Serviços para cada recurso da API

// Serviço de autenticação
export const authService = {
  login: async (email: string, password: string) => {
    try {
      // Em uma implementação real, seria uma chamada à API
      // return await api.post('/auth/login', { email, password });
      
      // Mock para desenvolvimento
      if (email === 'teste@email.com' && password === 'senha123') {
        return {
          data: {
            token: 'fake-jwt-token',
            user: {
              id: 1,
              name: 'Usuário Teste',
              email: 'teste@email.com',
              phone: '(11) 99999-9999',
            },
          },
        };
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (error) {
      throw error;
    }
  },
  
  register: async (userData: any) => {
    try {
      // Em uma implementação real, seria uma chamada à API
      // return await api.post('/auth/register', userData);
      
      // Mock para desenvolvimento
      return {
        data: {
          token: 'fake-jwt-token',
          user: {
            id: 1,
            ...userData,
          },
        },
      };
    } catch (error) {
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('auth_token');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },
};

// Serviço de profissionais
export const professionalService = {
  getAll: async (filters?: any) => {
    try {
      // Em uma implementação real, seria uma chamada à API
      // return await api.get('/professionals', { params: filters });
      
      // Mock para desenvolvimento
      return {
        data: [
          {
            id: 1,
            name: 'Ana Oliveira',
            specialty: 'Especialista em Tranças e Penteados',
            profileImage: '/api/placeholder/300/300',
            rating: 4.8,
            reviewCount: 124,
            location: {
              district: 'Pinheiros',
              zone: 'Zona Oeste',
            },
            offersHomeService: true,
            services: [
              { id: 1, name: 'Box Braids', price: 250, duration: 180 },
              { id: 2, name: 'Twist Senegalês', price: 290, duration: 240 },
            ],
          },
          {
            id: 2,
            name: 'Camila Santos',
            specialty: 'Cabeleireira e Colorista',
            profileImage: '/api/placeholder/300/300',
            rating: 4.6,
            reviewCount: 89,
            location: {
              district: 'Vila Mariana',
              zone: 'Zona Sul',
            },
            offersHomeService: false,
            services: [
              { id: 3, name: 'Corte Feminino', price: 120, duration: 60 },
              { id: 4, name: 'Coloração', price: 180, duration: 120 },
            ],
          },
          {
            id: 3,
            name: 'Juliana Costa',
            specialty: 'Trancista',
            profileImage: '/api/placeholder/300/300',
            rating: 4.9,
            reviewCount: 156,
            location: {
              district: 'Tatuapé',
              zone: 'Zona Leste',
            },
            offersHomeService: true,
            services: [
              { id: 5, name: 'Box Braids', price: 280, duration: 210 },
              { id: 6, name: 'Nagô', price: 200, duration: 150 },
            ],
          },
        ],
      };
    } catch (error) {
      throw error;
    }
  },
  
  getById: async (id: number) => {
    try {
      // Em uma implementação real, seria uma chamada à API
      // return await api.get(`/professionals/${id}`);
      
      // Mock para desenvolvimento
      return {
        data: {
          id: id,
          name: 'Ana Oliveira',
          specialty: 'Especialista em Tranças e Penteados',
          bio: 'Cabeleireira com mais de 10 anos de experiência em tranças e penteados afro. Especialista em Box Braids, Twists e técnicas de proteção capilar.',
          rating: 4.8,
          reviewCount: 124,
          profileImage: '/api/placeholder/300/300',
          coverImage: '/api/placeholder/800/300',
          location: {
            district: 'Pinheiros',
            zone: 'Zona Oeste',
            address: 'Rua dos Pinheiros, 123',
          },
          offersHomeService: true,
          homeServiceFee: 50.0,
          contact: {
            phone: '(11) 99999-9999',
            email: 'ana.oliveira@email.com',
            instagram: '@ana.tranças',
          },
          workingHours: [
            { day: 'Segunda', hours: '09:00 - 18:00' },
            { day: 'Terça', hours: '09:00 - 18:00' },
            { day: 'Quarta', hours: '09:00 - 18:00' },
            { day: 'Quinta', hours: '09:00 - 18:00' },
            { day: 'Sexta', hours: '09:00 - 18:00' },
            { day: 'Sábado', hours: '09:00 - 14:00' },
            { day: 'Domingo', hours: 'Fechado' },
          ],
          services: [
            { id: 1, name: 'Box Braids', price: 250, duration: 180, description: 'Tranças finas a médias, estilo box braids tradicionais.' },
            { id: 2, name: 'Twist Senegalês', price: 290, duration: 240, description: 'Twists estilo senegalês com acabamento profissional.' },
            { id: 3, name: 'Penteado para Festa', price: 150, duration: 90, description: 'Penteados elegantes para ocasiões especiais.' },
            { id: 4, name: 'Manutenção de Tranças', price: 100, duration: 60, description: 'Retoque e manutenção de tranças existentes.' },
          ],
          reviews: [
            { id: 1, author: 'Mariana Silva', rating: 5, date: '02/04/2025', comment: 'Trabalho incrível! Minhas box braids ficaram perfeitas e duraram muito tempo.' },
            { id: 2, author: 'Juliana Costa', rating: 5, date: '25/03/2025', comment: 'Atendimento excelente, muito profissional e pontual.' },
            { id: 3, author: 'Carolina Santos', rating: 4, date: '15/03/2025', comment: 'Amei o resultado, recomendo muito! Só demorou um pouco mais que o previsto.' },
          ],
          hairPrices: {
            small: 60,
            medium: 80,
            large: 120,
          },
        },
      };
    } catch (error) {
      throw error;
    }
  },
  
  getAvailability: async (professionalId: number, date: string) => {
    try {
      // Em uma implementação real, seria uma chamada à API
      // return await api.get(`/professionals/${professionalId}/availability`, { params: { date } });
      
      // Mock para desenvolvimento
      return {
        data: ['09:00', '11:30', '14:00', '16:30'],
      };
    } catch (error) {
      throw error;
    }
  },
};

// Serviço de agendamentos
export const appointmentService = {
  create: async (appointmentData: any) => {
    try {
      // Em uma implementação real, seria uma chamada à API
      // return await api.post('/appointments', appointmentData);
      
      // Mock para desenvolvimento
      return {
        data: {
          id: Math.floor(Math.random() * 1000),
          ...appointmentData,
          status: 'pending_payment',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
    } catch (error) {
      throw error;
    }
  },
  
  getAll: async () => {
    try {
      // Em uma implementação real, seria uma chamada à API
      // return await api.get('/appointments');
      
      // Mock para desenvolvimento
      return {
        data: [
          {
            id: 1,
            serviceName: 'Box Braids',
            professionalName: 'Ana Oliveira',
            professionalImage: '/api/placeholder/300/300',
            date: new Date(2025, 3, 20),
            time: '14:00',
            status: 'confirmed',
            totalPrice: 250,
          },
          {
            id: 2,
            serviceName: 'Twist Senegalês',
            professionalName: 'Ana Oliveira',
            professionalImage: '/api/placeholder/300/300',
            date: new Date(2025, 4, 5),
            time: '10:30',
            status: 'pending',
            totalPrice: 290,
          },
        ],
      };
    } catch (error) {
      throw error;
    }
  },
  
  getById: async (id: number) => {
    try {
      // Em uma implementação real, seria uma chamada à API
      // return await api.get(`/appointments/${id}`);
      
      // Mock para desenvolvimento
      return {
        data: {
          id: id,
          serviceName: 'Box Braids',
          professionalName: 'Ana Oliveira',
          professionalImage: '/api/placeholder/300/300',
          professionalPhone: '(11) 97777-8888',
          date: new Date(2025, 3, 20),
          time: '14:00',
          duration: 180,
          status: 'confirmed',
          totalPrice: 250,
          location: {
            address: 'Rua dos Pinheiros, 123',
            district: 'Pinheiros',
            zone: 'Zona Oeste',
          },
          isHomeService: false,
          address: '',
          options: {
            useOwnHair: true,
            hairLength: '',
            hasAllergies: false,
            allergiesDescription: '',
          },
          notes: 'Prefiro tranças médias, nem muito finas nem muito grossas.',
        },
      };
    } catch (error) {
      throw error;
    }
  },
  
  cancel: async (id: number) => {
    try {
      // Em uma implementação real, seria uma chamada à API
      // return await api.patch(`/appointments/${id}/cancel`);
      
      // Mock para desenvolvimento
      return {
        data: {
          id: id,
          status: 'cancelled',
          updatedAt: new Date(),
        },
      };
    } catch (error) {
      throw error;
    }
  },
};

// Serviço de pagamentos
export const paymentService = {
  processPayment: async (appointmentId: number, paymentData: any) => {
    try {
      // Em uma implementação real, seria uma chamada à API
      // return await api.post(`/appointments/${appointmentId}/payment`, paymentData);
      
      // Mock para desenvolvimento
      return {
        data: {
          id: Math.floor(Math.random() * 1000),
          appointmentId,
          amount: paymentData.amount,
          paymentMethod: paymentData.paymentMethod,
          status: 'paid',
          createdAt: new Date(),
        },
      };
    } catch (error) {
      throw error;
    }
  },
};

export default api;