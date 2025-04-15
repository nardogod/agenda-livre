// src/utils/mockData.ts
import { Review } from '../types/professional';

export const mockReviews: Review[] = [
  {
    id: 'review1',
    clientId: 'client1',
    clientName: 'Amanda Silva',
    rating: 5,
    comment: 'Trabalho incrível! Fiz box braids e ficou perfeito, exatamente como eu queria. Recomendo muito!',
    date: '2025-03-10T14:30:00Z',
    serviceId: '1',
    serviceName: 'Box Braids'
  },
  {
    id: 'review2',
    clientId: 'client2',
    clientName: 'Carolina Mendes',
    rating: 4,
    comment: 'Muito profissional e atenciosa. O trabalho ficou ótimo, só achei o tempo um pouco longo.',
    date: '2025-02-28T16:45:00Z',
    serviceId: '2',
    serviceName: 'Twist Senegalês'
  },
  {
    id: 'review3',
    clientId: 'client3',
    clientName: 'Juliana Costa',
    rating: 5,
    comment: 'Super recomendo! Fiz um penteado para festa e recebi muitos elogios. Profissional muito habilidosa.',
    date: '2025-02-15T10:15:00Z',
    serviceId: '3',
    serviceName: 'Penteado para Festa'
  }
];
