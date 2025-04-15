// src/types/user.ts

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  user_type: 'client' | 'professional';
  is_verified?: boolean;
  bio?: string;
  created_at: string;
}

// src/types/professional.ts

export interface Professional {
  id: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  profile_image: string;
  cover_image?: string;
  instagram?: string;
  location: string;
  zone?: string;
  district?: string;
  offers_home_service: boolean;
  home_service_fee: number;
  rating: number;
  review_count: number;
  specialties?: string[];
  bio?: string;
}

// src/types/service.ts

export interface Service {
  id: string;
  professional_id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image?: string;
  active: boolean;
  has_hair_option?: boolean;
  hair_price_small?: number;
  hair_price_medium?: number;
  hair_price_large?: number;
  category?: {
    id: string;
    name: string;
  };
}

// src/types/booking.ts

export interface Appointment {
  id: string;
  professional: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
    };
    profile_image: string;
  };
  client: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  service: {
    id: string;
    name: string;
    duration: number;
  };
  start_datetime: string;
  end_datetime: string;
  use_own_hair: boolean;
  hair_length?: 'small' | 'medium' | 'large';
  is_home_service: boolean;
  address?: {
    id: string;
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
    zip_code: string;
  };
  has_allergies: boolean;
  allergies_description?: string;
  notes?: string;
  status: 'pending_payment' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  service_price: number;
  hair_price: number;
  home_service_fee: number;
  total_price: number;
  payment?: {
    id: string;
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    payment_method: 'credit_card' | 'pix';
    created_at: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  appointment_id: string;
  client: {
    id: string;
    firstName: string;
    lastName: string;
    profile_image?: string;
  };
  professional_id: string;
  rating: number;
  comment: string;
  created_at: string;
}