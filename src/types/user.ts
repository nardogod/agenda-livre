// src/types/user.ts

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  type: 'client' | 'professional';
  phone: string;
  
  // Campos específicos para profissionais
  specialty?: string;
  isVerified?: boolean;
  bio?: string;
  services?: any[];
  
  // Campos específicos para clientes
  addresses?: Address[];
}

export interface Address {
  id: number;
  userId: number;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phone: string;
  type: 'client' | 'professional';
  specialty?: string;
}