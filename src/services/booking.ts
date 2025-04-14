// src/services/booking.ts

import api from './api';
import { Appointment } from '../types/booking';

interface AppointmentsResponse {
  results: Appointment[];
  count: number;
}

export interface CreateAppointmentData {
  professional_id: string;
  service_id: string;
  start_datetime: string;
  use_own_hair: boolean;
  hair_length?: 'small' | 'medium' | 'large';
  is_home_service: boolean;
  address_id?: string;
  has_allergies: boolean;
  allergies_description?: string;
  notes?: string;
}

export async function createAppointment(data: CreateAppointmentData): Promise<Appointment> {
  try {
    const response = await api.post<Appointment>('/appointments/', data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    throw error;
  }
}

export async function getAppointments(status?: string, page = 1): Promise<AppointmentsResponse> {
  try {
    const params = { page, status };
    const response = await api.get<AppointmentsResponse>('/appointments/', { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    throw error;
  }
}

export async function getAppointmentById(id: string): Promise<Appointment> {
  try {
    const response = await api.get<Appointment>(`/appointments/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar agendamento ${id}:`, error);
    throw error;
  }
}

export async function cancelAppointment(id: string, reason?: string): Promise<Appointment> {
  try {
    const response = await api.patch<Appointment>(`/appointments/${id}/cancel/`, { reason });
    return response.data;
  } catch (error) {
    console.error(`Erro ao cancelar agendamento ${id}:`, error);
    throw error;
  }
}

// Para o painel do profissional
export async function getProfessionalAppointments(status?: string, date?: string): Promise<AppointmentsResponse> {
  try {
    const params = { status, date };
    const response = await api.get<AppointmentsResponse>('/professionals/appointments/', { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar agendamentos do profissional:', error);
    throw error;
  }
}

export async function updateAppointmentStatus(
  id: string, 
  status: 'confirmed' | 'completed' | 'cancelled' | 'no_show'
): Promise<Appointment> {
  try {
    const response = await api.patch<Appointment>(`/appointments/${id}/`, { status });
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar status do agendamento ${id}:`, error);
    throw error;
  }
}

export async function addScheduleBlock(
  start_datetime: string,
  end_datetime: string,
  reason?: string
): Promise<any> {
  try {
    const response = await api.post('/professionals/blocks/', {
      start_datetime,
      end_datetime,
      reason
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar bloqueio de agenda:', error);
    throw error;
  }
}

export async function removeScheduleBlock(blockId: string): Promise<void> {
  try {
    await api.delete(`/professionals/blocks/${blockId}/`);
  } catch (error) {
    console.error(`Erro ao remover bloqueio de agenda ${blockId}:`, error);
    throw error;
  }
}