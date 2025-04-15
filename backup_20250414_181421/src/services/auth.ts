// src/services/auth.ts

import { parseCookies, setCookie, destroyCookie } from 'nookies';
import api from './api';
import { User } from '../types/user';

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

export async function signIn({ email, password }: SignInCredentials): Promise<User> {
  try {
    const response = await api.post<AuthResponse>('/auth/login/', {
      email,
      password,
    });

    const { token, user } = response.data;

    // Armazenar token e usuário nos cookies
    setCookie(undefined, 'agendalivre.token', token, {
      maxAge: 60 * 60 * 24, // 24 horas
      path: '/',
    });
    
    setCookie(undefined, 'agendalivre.user', JSON.stringify(user), {
      maxAge: 60 * 60 * 24, // 24 horas
      path: '/',
    });

    // Adicionar token no header padrão das requisições
    api.defaults.headers.Authorization = `Bearer ${token}`;

    return user;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
}

export async function signUp(userData: any): Promise<User> {
  try {
    const response = await api.post<AuthResponse>('/auth/register/', userData);
    
    const { token, user } = response.data;

    // Armazenar token e usuário nos cookies
    setCookie(undefined, 'agendalivre.token', token, {
      maxAge: 60 * 60 * 24, // 24 horas
      path: '/',
    });
    
    setCookie(undefined, 'agendalivre.user', JSON.stringify(user), {
      maxAge: 60 * 60 * 24, // 24 horas
      path: '/',
    });

    // Adicionar token no header padrão das requisições
    api.defaults.headers.Authorization = `Bearer ${token}`;

    return user;
  } catch (error) {
    console.error('Erro ao fazer cadastro:', error);
    throw error;
  }
}

export function signOut(): void {
  destroyCookie(undefined, 'agendalivre.token');
  destroyCookie(undefined, 'agendalivre.user');
  
  // Redirecionar para a página inicial
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
}

export function getUser(): User | null {
  const { 'agendalivre.user': userCookie } = parseCookies();
  
  if (userCookie) {
    return JSON.parse(userCookie);
  }
  
  return null;
}

export function getToken(): string | null {
  const { 'agendalivre.token': token } = parseCookies();
  return token || null;
}

export async function recoverPassword(email: string): Promise<void> {
  await api.post('/auth/password-reset/', { email });
}

export async function resetPassword(token: string, password: string): Promise<void> {
  await api.post('/auth/password-reset/confirm/', { token, password });
}