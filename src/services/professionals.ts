// src/services/professionals.ts

import api from './api';
import { Professional } from '../types/professional';
import { Service } from '../types/service';

interface ProfessionalsResponse {
  results: Professional[];
  count: number;
  next: string | null;
  previous: string | null;
}

interface FilterParams {
  category?: string;
  zone?: string;
  district?: string;
  price_min?: number;
  price_max?: number;
  rating?: number;
  search?: string;
  page?: number;
  services?: string;
}

export async function getProfessionals(filters: FilterParams = {}): Promise<ProfessionalsResponse> {
  try {
    const response = await api.get<ProfessionalsResponse>('/professionals/', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar profissionais:', error);
    throw error;
  }
}

export async function getProfessionalById(id: string): Promise<Professional> {
  try {
    const response = await api.get<Professional>(`/professionals/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar profissional ${id}:`, error);
    throw error;
  }
}

export async function getProfessionalServices(professionalId: string): Promise<Service[]> {
  try {
    const response = await api.get<Service[]>(`/professionals/${professionalId}/services/`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar serviços do profissional ${professionalId}:`, error);
    throw error;
  }
}

export async function getProfessionalReviews(professionalId: string): Promise<any[]> {
  try {
    const response = await api.get<any[]>(`/professionals/${professionalId}/reviews/`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar avaliações do profissional ${professionalId}:`, error);
    throw error;
  }
}

export async function getProfessionalAvailability(professionalId: string, date: string, serviceId: string): Promise<string[]> {
  try {
    const response = await api.get<string[]>(`/professionals/${professionalId}/availability/`, {
      params: { date, service_id: serviceId }
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar disponibilidade do profissional ${professionalId}:`, error);
    throw error;
  }
}

// Para o painel do profissional
export async function updateProfessionalProfile(professionalId: string, data: Partial<Professional>): Promise<Professional> {
  try {
    const response = await api.patch<Professional>(`/profile/`, data);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar perfil do profissional ${professionalId}:`, error);
    throw error;
  }
}

export async function createService(data: Omit<Service, 'id'>): Promise<Service> {
  try {
    const response = await api.post<Service>(`/services/`, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    throw error;
  }
}

export async function updateService(serviceId: string, data: Partial<Service>): Promise<Service> {
  try {
    const response = await api.patch<Service>(`/services/${serviceId}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar serviço ${serviceId}:`, error);
    throw error;
  }
}

export async function deleteService(serviceId: string): Promise<void> {
  try {
    await api.delete(`/services/${serviceId}/`);
  } catch (error) {
    console.error(`Erro ao deletar serviço ${serviceId}:`, error);
    throw error;
  }
}