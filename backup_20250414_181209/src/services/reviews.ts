// src/services/reviews.ts
import api from './api';
import { Review } from '../types/professional';
import { mockReviews } from '../utils/mockData';

interface CreateReviewData {
  professionalId: string;
  serviceId: string;
  rating: number;
  comment: string;
}

export const getReviews = async (professionalId: string): Promise<Review[]> => {
  // Em ambiente de desenvolvimento, retorna dados mockados
  if (process.env.NODE_ENV === 'development') {
    return new Promise(resolve => {
      setTimeout(() => resolve(mockReviews), 500);
    });
  }
  
  const response = await api.get(`/professionals/${professionalId}/reviews/`);
  return response.data;
};

export const createReview = async (data: CreateReviewData): Promise<Review> => {
  // Em ambiente de desenvolvimento, simula a chamada
  if (process.env.NODE_ENV === 'development') {
    return new Promise(resolve => {
      const newReview: Review = {
        id: `review-${Date.now()}`,
        clientId: 'current-user',
        clientName: 'Você',
        rating: data.rating,
        comment: data.comment,
        date: new Date().toISOString(),
        serviceId: data.serviceId,
        serviceName: data.serviceId === '1' ? 'Box Braids' : 
                   data.serviceId === '2' ? 'Twist Senegalês' : 
                   data.serviceId === '3' ? 'Penteado para Festa' : 
                   'Serviço'
      };
      setTimeout(() => resolve(newReview), 500);
    });
  }
  
  const response = await api.post(`/professionals/${data.professionalId}/reviews/`, {
    service_id: data.serviceId,
    rating: data.rating,
    comment: data.comment
  });
  return response.data;
};

export const likeReview = async (reviewId: string): Promise<void> => {
  // Em ambiente de desenvolvimento, simula a chamada
  if (process.env.NODE_ENV === 'development') {
    return new Promise(resolve => {
      setTimeout(() => resolve(), 300);
    });
  }
  
  await api.post(`/reviews/${reviewId}/like/`);
};