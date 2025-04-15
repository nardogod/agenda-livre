// src/utils/mockData.js
/**
 * Gera dados de profissionais simulados para desenvolvimento
 */
export const generateMockProfessionals = (count = 10) => {
  const zones = ['Zona Norte', 'Zona Sul', 'Zona Leste', 'Zona Oeste', 'Centro'];
  const districts = {
    'Zona Norte': ['Santana', 'Vila Maria', 'Tucuruvi', 'Mandaqui'],
    'Zona Sul': ['Moema', 'Vila Mariana', 'Brooklin', 'Jabaquara'],
    'Zona Leste': ['Tatuapé', 'Mooca', 'Penha', 'Itaquera'],
    'Zona Oeste': ['Pinheiros', 'Perdizes', 'Lapa', 'Butantã'],
    'Centro': ['República', 'Bela Vista', 'Consolação', 'Santa Cecília']
  };
  
  const specialties = [
    'Especialista em Tranças', 
    'Cabeleireira(o)', 
    'Maquiadora(or)', 
    'Manicure',
    'Esteticista',
    'Designer de Sobrancelhas'
  ];

  const result = [];

  for (let i = 0; i < count; i++) {
    const zone = zones[Math.floor(Math.random() * zones.length)];
    const district = districts[zone][Math.floor(Math.random() * districts[zone].length)];
    const specialty = specialties[Math.floor(Math.random() * specialties.length)];
    const rating = parseFloat((3 + Math.random() * 2).toFixed(1));
    const reviewCount = Math.floor(Math.random() * 100);
    const minPrice = Math.floor(50 + Math.random() * 200);

    result.push({
      id: `pro-${i}`,
      name: `Profissional ${i + 1}`,
      specialty,
      profileImage: `/api/placeholder/300/300?text=Pro${i+1}`,
      location: {
        district,
        zone
      },
      rating,
      reviewCount,
      services: {
        minPrice
      }
    });
  }

  return result;
};

/**
 * Gera horários disponíveis simulados para um determinado dia
 */
export const generateMockAvailableTimeSlots = (date) => {
  // Gera horários entre 9h e 19h, com intervalo de 30 minutos
  const slots = [];
  const today = new Date();
  
  // Se a data for hoje, só gera horários futuros
  const startHour = date.getDate() === today.getDate() ? 
    Math.max(9, today.getHours() + 1) : 9;

  for (let hour = startHour; hour < 19; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  
  // Retorna apenas alguns horários aleatoriamente (para simular indisponibilidade)
  return slots.filter(() => Math.random() > 0.3);
};