// Tipos para usuários

export type UserType = 'client' | 'professional';

export type Address = {
  id: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: UserType;
  addresses?: Address[];
  createdAt: string;
  updatedAt?: string;
};

// Tipo específico para o cliente (que é um usuário)
export type Client = User & {
  userType: 'client';
  favoritesProfessionals?: string[];
};

// Tipo para autenticação
export type AuthToken = {
  token: string;
  refreshToken?: string;
  expiresAt?: string;
};

export type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  token: AuthToken | null;
  loading: boolean;
  error: string | null;
};

// Tipo para o formulário de login
export type LoginCredentials = {
  email: string;
  password: string;
};

// Tipo para o formulário de registro
export type RegisterData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  userType: UserType;
};