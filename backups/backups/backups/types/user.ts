export type UserType = 'client' | 'professional';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: UserType;
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