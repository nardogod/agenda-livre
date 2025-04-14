// src/services/api.ts

import axios from 'axios';
import { parseCookies, setCookie, destroyCookie } from 'nookies';


// Constantes
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Instância do axios com configurações padrão
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token a todas as requisições
api.interceptors.request.use((config) => {
  const { 'agendalivre.token': token } = parseCookies();
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Interceptor para tratamento de erros (como token expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { 'agendalivre.token': token } = parseCookies();
    
    if (error.response?.status === 401 && token) {
      // Token expirado ou inválido
      destroyCookie(null, 'agendalivre.token');
      destroyCookie(null, 'agendalivre.user');
      
      // Redirecionar para login
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;