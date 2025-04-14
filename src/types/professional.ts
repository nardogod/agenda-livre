// Tipos para profissionais
export type Location = {
    district: string;
    zone: string;
    address?: string;
    city?: string;
    state?: string;
  };
  
  export type Service = {
    id: string;
    name: string;
    description?: string;
    price: number;
    duration: number; // em minutos
    image?: string;
    hasHairOption?: boolean;
    hairPriceSmall?: number;
    hairPriceMedium?: number;
    hairPriceLarge?: number;
    category?: string;
  };
  
  export type Review = {
    id: string;
    clientId: string;
    clientName: string;
    rating: number;
    comment: string;
    date: string;
    serviceId?: string;
    serviceName?: string;
  };
  
  export type Schedule = {
    dayOfWeek: number; // 0-6 (domingo-sábado)
    startTime: string; // formato: "HH:MM"
    endTime: string; // formato: "HH:MM"
  };
  
  export type ScheduleBlock = {
    id: string;
    startDatetime: Date;
    endDatetime: Date;
    reason?: string;
  };
  
  export type Professional = {
    id: string;
    name: string;
    specialty: string;
    bio?: string;
    profileImage: string;
    coverImage?: string;
    rating: number;
    reviewCount: number;
    location: Location;
    instagram?: string;
    offersHomeService: boolean;
    homeServiceFee?: number;
    services?: Service[];
    schedule?: Schedule[];
    reviews?: Review[];
    isVerified: boolean;
  };
  
  // Tipo para filtros de profissionais
  export type ProfessionalFilters = {
    zones?: string[];
    districts?: string[];
    categories?: string[];
    priceRange?: { min?: number; max?: number };
    rating?: number;
    homeService?: boolean;
    searchTerm?: string;
  };