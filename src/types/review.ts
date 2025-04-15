// src/types/review.ts
export interface Review {
    id: string;
    professionalId: string;
    clientId: string;
    clientName: string;
    rating: number;
    comment: string;
    date: string;
    serviceId?: string;
    serviceName?: string;
  }