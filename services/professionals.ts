import { api } from './api';
import { MOCK_PROFESSIONALS } from '../utils/mockData';

// Check if we're using mock data or real API
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export const professionalService = {
  // Get all professionals with optional filters
  async getProfessionals(filters?: any) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          let filteredProfessionals = [...MOCK_PROFESSIONALS];
          
          // Apply filters if provided
          if (filters) {
            if (filters.category) {
              filteredProfessionals = filteredProfessionals.filter(pro => 
                pro.specialties.includes(filters.category)
              );
            }
            
            if (filters.zone) {
              filteredProfessionals = filteredProfessionals.filter(pro => 
                pro.zone === filters.zone
              );
            }
            
            if (filters.district) {
              filteredProfessionals = filteredProfessionals.filter(pro => 
                pro.district === filters.district
              );
            }
            
            if (filters.minPrice || filters.maxPrice) {
              filteredProfessionals = filteredProfessionals.filter(pro => {
                const minServicePrice = Math.min(...pro.services.map(s => s.price));
                
                if (filters.minPrice && filters.maxPrice) {
                  return minServicePrice >= filters.minPrice && minServicePrice <= filters.maxPrice;
                }
                
                if (filters.minPrice) {
                  return minServicePrice >= filters.minPrice;
                }
                
                if (filters.maxPrice) {
                  return minServicePrice <= filters.maxPrice;
                }
                
                return true;
              });
            }
            
            if (filters.homeService) {
              filteredProfessionals = filteredProfessionals.filter(pro => 
                pro.offers_home_service
              );
            }
            
            if (filters.search) {
              const searchTerm = filters.search.toLowerCase();
              filteredProfessionals = filteredProfessionals.filter(pro => 
                pro.name.toLowerCase().includes(searchTerm) ||
                pro.specialties.some((s: string) => s.toLowerCase().includes(searchTerm)) ||
                pro.services.some((s: any) => s.name.toLowerCase().includes(searchTerm))
              );
            }
          }
          
          resolve(filteredProfessionals);
        }, 500);
      });
    }
    
    const response = await api.get('/professionals', { params: filters });
    return response.data;
  },
  
  // Get professional by ID
  async getProfessionalById(id: string) {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const professional = MOCK_PROFESSIONALS.find(pro => pro.id === id);
          
          if (professional) {
            resolve(professional);
          } else {
            reject(new Error('Professional not found'));
          }
        }, 500);
      });
    }
    
    const response = await api.get(`/professionals/${id}`);
    return response.data;
  },
  
  // Get professional services
  async getProfessionalServices(professionalId: string) {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const professional = MOCK_PROFESSIONALS.find(pro => pro.id === professionalId);
          
          if (professional) {
            resolve(professional.services);
          } else {
            reject(new Error('Professional not found'));
          }
        }, 500);
      });
    }
    
    const response = await api.get(`/professionals/${professionalId}/services`);
    return response.data;
  },
  
  // Get professional reviews
  async getProfessionalReviews(professionalId: string) {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const professional = MOCK_PROFESSIONALS.find(pro => pro.id === professionalId);
          
          if (professional && professional.reviews) {
            resolve(professional.reviews);
          } else if (professional) {
            resolve([]);
          } else {
            reject(new Error('Professional not found'));
          }
        }, 500);
      });
    }
    
    const response = await api.get(`/professionals/${professionalId}/reviews`);
    return response.data;
  },
  
  // Get professional availability
  async getProfessionalAvailability(professionalId: string, date: string) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Mock available time slots between 9am and 6pm, every hour
          const availableTimes = [];
          const currentDate = new Date(date);
          
          // Check if it's a weekend (add fewer slots)
          const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
          
          // Start at 9am (or 10am on weekends)
          let hour = isWeekend ? 10 : 9;
          
          // End at 6pm (or 4pm on weekends)
          const endHour = isWeekend ? 16 : 18;
          
          while (hour < endHour) {
            // Don't add 1pm on weekdays (lunch hour)
            if (!(hour === 13 && !isWeekend)) {
              availableTimes.push(`${hour}:00`);
              
              // Add 30-minute slots too
              if (hour !== endHour - 1) {
                availableTimes.push(`${hour}:30`);
              }
            }
            
            hour++;
          }
          
          resolve(availableTimes);
        }, 500);
      });
    }
    
    const response = await api.get(`/professionals/${professionalId}/availability`, {
      params: { date }
    });
    return response.data;
  },
  
  // For professional users - create/update a service
  async saveService(service: any) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          // For mock purposes, just return the service with an ID
          const updatedService = {
            ...service,
            id: service.id || Math.random().toString(36).substr(2, 9)
          };
          
          resolve(updatedService);
        }, 500);
      });
    }
    
    if (service.id) {
      // Update existing service
      const response = await api.put(`/services/${service.id}`, service);
      return response.data;
    } else {
      // Create new service
      const response = await api.post('/services', service);
      return response.data;
    }
  },
  
  // For professional users - delete a service
  async deleteService(serviceId: string) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 500);
      });
    }
    
    await api.delete(`/services/${serviceId}`);
    return { success: true };
  },
  
  // For professional users - update service status (active/inactive)
  async updateServiceStatus(serviceId: string, active: boolean) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, active });
        }, 500);
      });
    }
    
    const response = await api.patch(`/services/${serviceId}`, { active });
    return response.data;
  },
  
  // For professional users - get upcoming appointments
  async getUpcomingAppointments() {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Mock appointments data
          const mockAppointments = [
            {
              id: '1',
              client: {
                id: '201',
                name: 'Mariana Silva',
                image: '/api/placeholder/100/100'
              },
              serviceName: 'Box Braids',
              date: '2025-04-17T10:00:00',
              price: 250,
              status: 'confirmed',
              isHomeService: false
            },
            {
              id: '2',
              client: {
                id: '202',
                name: 'Carolina Mendes',
                image: '/api/placeholder/100/100'
              },
              serviceName: 'Twist Senegalês',
              date: '2025-04-17T14:30:00',
              price: 290,
              status: 'confirmed',
              isHomeService: true
            },
            // More appointments...
          ];
          
          resolve(mockAppointments);
        }, 500);
      });
    }
    
    const response = await api.get('/professional/appointments');
    return response.data;
  },
  
  // For professional users - update professional profile
  async updateProfile(profileData: any) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ...profileData,
            id: '1',
            updated_at: new Date().toISOString()
          });
        }, 500);
      });
    }
    
    const response = await api.patch('/professional/profile', profileData);
    return response.data;
  }
};