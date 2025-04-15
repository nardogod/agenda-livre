export type UserType = 'client' | 'professional';

// Base user properties that both client and professional users have
export interface BaseUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: UserType;
  createdAt?: string;
  updatedAt?: string;
}

// Additional properties for professional users
export interface ProfessionalSpecificProps {
  profileImage?: string;
  coverImage?: string;
  bio?: string;
  instagram?: string;
  location?: string;
  district?: string;
  zone?: string;
  offers_home_service?: boolean;
  home_service_fee?: number;
  rating?: number;
  reviewCount?: number;
  specialties?: string[];
  isVerified?: boolean;
}

// Address for users
export interface Address {
  id: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

// The full user type combines base and conditional properties
export type User = BaseUser & Partial<ProfessionalSpecificProps> & {
  addresses?: Address[];
};

// For authentication responses
export interface AuthResponse {
  user: User;
  token: string;
}