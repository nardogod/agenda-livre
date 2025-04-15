// src/types/professional.ts

export interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
  description?: string;
  image?: string;
}

export interface Professional {
  id: number;
  name: string;
  specialty: string;
  profileImage: string;
  coverImage?: string;
  rating: number;
  zone: 'north' | 'south' | 'east' | 'west' | 'center';
  district: string;
  category: 'hair' | 'braids' | 'makeup' | 'nails' | 'barber';
  services: Service[];
  bio?: string;
  instagram?: string;
  location?: string;
  offersHomeService?: boolean;
  homeServiceFee?: number;
  reviewCount?: number;
}

export interface Review {
  id: number;
  professionalId: number;
  userId: number;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  date: string;
  service?: string;
}

export interface AvailableTime {
  date: string;
  times: string[];
}