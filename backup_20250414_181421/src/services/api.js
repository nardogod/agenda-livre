import axios from 'axios';
import { mockApiResponse } from '../utils/mockData';

// Flag para usar dados mockados (desabilitar quando o backend estiver pronto)
const USE_MOCK_DATA = true;

// Configuração base do Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para adicionar token em cada requisição
api.interceptors.request.use(
  (config) => {
    // No ambiente de browser
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('agenda_livre_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Trata erro de autenticação (token expirado ou inválido)
    if (response && response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('agenda_livre_token');
        // Redirecionar para login se necessário
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Função auxiliar para interceptar chamadas e usar dados mockados quando necessário
const callApi = (method, endpoint, data, config) => {
  if (USE_MOCK_DATA) {
    const params = config?.params;
    console.log(`[MOCK] ${method.toUpperCase()} ${endpoint}`, params || '');
    return mockApiResponse(endpoint, params);
  }
  
  return api[method](endpoint, data, config);
};

// Serviços de autenticação
export const authService = {
  login: (credentials) => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Simular login com credenciais básicas
          if (credentials.email === 'cliente@exemplo.com' && credentials.password === 'senha123') {
            resolve({
              data: {
                token: 'mock_jwt_token_for_client',
                user: {
                  id: 1,
                  first_name: 'Maria',
                  last_name: 'Silva',
                  email: 'cliente@exemplo.com',
                  phone: '(11) 98765-4321',
                  user_type: 'client'
                }
              }
            });
          } else if (credentials.email === 'profissional@exemplo.com' && credentials.password === 'senha123') {
            resolve({
              data: {
                token: 'mock_jwt_token_for_professional',
                user: {
                  id: 2,
                  first_name: 'Ana',
                  last_name: 'Oliveira',
                  email: 'profissional@exemplo.com',
                  phone: '(11) 91234-5678',
                  user_type: 'professional',
                  professional: {
                    id: 1,
                    profile_image: '/api/placeholder/300/300',
                    instagram: '@ana.trancinhas',
                    location: 'Moema, São Paulo'
                  }
                }
              }
            });
          } else {
            // Simular erro
            throw {
              response: {
                status: 401,
                data: {
                  message: 'Credenciais inválidas'
                }
              }
            };
          }
        }, 800);
      });
    }
    
    return api.post('/auth/login/', credentials);
  },
  register: (userData) => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              token: 'mock_jwt_token_' + userData.user_type,
              user: {
                id: 10,
                first_name: userData.first_name,
                last_name: userData.last_name,
                email: userData.email,
                phone: userData.phone,
                user_type: userData.user_type,
                ...(userData.user_type === 'professional' ? {
                  professional: {
                    id: 5,
                    profile_image: null,
                    instagram: '',
                    location: ''
                  }
                } : {})
              }
            }
          });
        }, 800);
      });
    }
    
    return api.post('/auth/register/', userData);
  },
  refreshToken: () => callApi('post', '/auth/refresh/'),
  requestPasswordReset: (email) => callApi('post', '/auth/password-reset/', { email }),
  resetPassword: (data) => callApi('post', '/auth/password-reset/confirm/', data),
  getProfile: () => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Determinar tipo de usuário com base no token salvo
          const userType = localStorage.getItem('agenda_livre_token')?.includes('professional') 
            ? 'professional' 
            : 'client';
            
          if (userType === 'professional') {
            resolve({
              data: {
                id: 2,
                first_name: 'Ana',
                last_name: 'Oliveira',
                email: 'profissional@exemplo.com',
                phone: '(11) 91234-5678',
                user_type: 'professional',
                professional: {
                  id: 1,
                  profile_image: '/api/placeholder/300/300',
                  instagram: '@ana.trancinhas',
                  location: 'Moema, São Paulo'
                }
              }
            });
          } else {
            resolve({
              data: {
                id: 1,
                first_name: 'Maria',
                last_name: 'Silva',
                email: 'cliente@exemplo.com',
                phone: '(11) 98765-4321',
                user_type: 'client',
                addresses: []
              }
            });
          }
        }, 800);
      });
    }
    
    return api.get('/profile/');
  },
  updateProfile: (data) => callApi('patch', '/profile/', data),
  becomeProfessional: (data) => callApi('post', '/profile/become-professional/', data),
};

// Serviços para profissionais
export const professionalService = {
  getAll: (params) => callApi('get', '/professionals/', null, { params }),
  getById: (id) => callApi('get', `/professionals/${id}/`),
  getReviews: (id) => callApi('get', `/professionals/${id}/reviews/`),
  getServices: (id) => callApi('get', `/professionals/${id}/services/`),
  addService: (id, serviceData) => callApi('post', `/professionals/${id}/services/`, serviceData),
  updateService: (serviceId, serviceData) => callApi('put', `/services/${serviceId}/`, serviceData),
  deleteService: (serviceId) => callApi('delete', `/services/${serviceId}/`),
  getAvailability: (id, params) => callApi('get', `/professionals/${id}/availability/`, null, { params }),
  addBlock: (id, blockData) => callApi('post', `/professionals/${id}/blocks/`, blockData),
  getSchedule: (id, params) => callApi('get', `/professionals/${id}/schedule/`, null, { params }),
};

// Serviços para agendamentos
export const appointmentService = {
  create: (appointmentData) => callApi('post', '/appointments/', appointmentData),
  getAll: (params) => callApi('get', '/appointments/', null, { params }),
  getById: (id) => callApi('get', `/appointments/${id}/`),
  cancel: (id) => callApi('patch', `/appointments/${id}/cancel/`),
  createPayment: (id, paymentData) => callApi('post', `/appointments/${id}/payment/`, paymentData),
  getPaymentStatus: (id) => callApi('get', `/appointments/${id}/payment/status/`),
};

export default api;