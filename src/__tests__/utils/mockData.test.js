// src/__tests__/utils/mockData.test.js
import { generateMockProfessionals, generateMockAvailableTimeSlots } from '../../utils/mockData';

describe('Funções de Mock Data', () => {
  it('gera o número correto de profissionais simulados', () => {
    const professionals = generateMockProfessionals(5);
    expect(professionals.length).toBe(5);
  });

  it('gera profissionais com todos os dados necessários', () => {
    const professionals = generateMockProfessionals(1);
    const professional = professionals[0];
    
    expect(professional.id).toBeDefined();
    expect(professional.name).toBeDefined();
    expect(professional.specialty).toBeDefined();
    expect(professional.profileImage).toBeDefined();
    expect(professional.location).toBeDefined();
    expect(professional.location.district).toBeDefined();
    expect(professional.location.zone).toBeDefined();
    expect(professional.rating).toBeDefined();
    expect(professional.reviewCount).toBeDefined();
    expect(professional.services).toBeDefined();
    expect(professional.services.minPrice).toBeDefined();
  });

  it('gera horários disponíveis para uma data', () => {
    const today = new Date();
    const slots = generateMockAvailableTimeSlots(today);
    
    expect(Array.isArray(slots)).toBe(true);
    // Verifica o formato dos horários (HH:MM)
    slots.forEach(slot => {
      expect(slot).toMatch(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/);
    });
  });
});