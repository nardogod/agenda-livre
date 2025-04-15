import { api } from './api';
import { User } from '../types/user';

// Mock data for development without backend
const MOCK_TOKEN = 'mock-jwt-token';
const MOCK_USERS = [
  {
    id: '1',
    name: 'Cliente Teste',
    email: 'client@example.com',
    phone: '11999999999',
    userType: 'client',
  },
  {
    id: '2',
    name: 'Profissional Teste',
    email: 'pro@example.com',
    phone: '11888888888',
    userType: 'professional',
    bio: 'Especialista em tranças',
    location: 'Pinheiros, Zona Oeste',
    rating: 4.8,
    reviewCount: 25,
    specialties: ['Tranças', 'Penteados'],
    offers_home_service: true,
  }
];

// Use mock data for development
const USE_MOCK = true;

export const authService = {
  async login(email: string, password: string) {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const user = MOCK_USERS.find(user => user.email === email);
          
          if (user && password === 'senha123') {
            resolve({
              user,
              token: MOCK_TOKEN
            });
          } else {
            reject(new Error('Email ou senha inválidos'));
          }
        }, 500);
      });
    }
    
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async register(userData: any) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newId = (MOCK_USERS.length + 1).toString();
          const newUser = {
            id: newId,
            ...userData,
          };
          
          resolve({
            user: newUser as User,
            token: MOCK_TOKEN
          });
        }, 500);
      });
    }
    
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async getCurrentUser() {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const token = localStorage.getItem('auth_token');
          
          if (token === MOCK_TOKEN) {
            resolve(MOCK_USERS[0]);
          } else {
            reject(new Error('Token inválido ou expirado'));
          }
        }, 500);
      });
    }
    
    const response = await api.get('/auth/me');
    return response.data;
  },

  async updateProfile(userData: Partial<User>) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ...MOCK_USERS[0],
            ...userData
          });
        }, 500);
      });
    }
    
    const response = await api.patch('/auth/profile', userData);
    return response.data;
  }
};