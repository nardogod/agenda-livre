import { useState, useEffect } from 'react';
import { Professional } from '@/types/professional';

// Mock data para desenvolvimento
import { professionals as mockProfessionals } from '@/utils/mockData';

type FilterParams = {
  zones?: string[];
  categories?: string[];
  districts?: string[];
  minPrice?: number;
  maxPrice?: number;
  query?: string;
};

export const useProfessionals = (filters: FilterParams = {}) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [featuredProfessionals, setFeaturedProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProfessionals = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulando uma chamada de API com delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filtrar os profissionais mock com base nos filtros
        const filtered = mockProfessionals.filter(professional => {
          // Filtro por zonas
          if (filters.zones && filters.zones.length > 0) {
            if (!professional.zone || !filters.zones.includes(professional.zone)) {
              return false;
            }
          }
          
          // Filtro por categorias
          if (filters.categories && filters.categories.length > 0) {
            const professionalCategories = professional.categories || [];
            if (!filters.categories.some(cat => professionalCategories.includes(cat))) {
              return false;
            }
          }
          
          // Filtro por distritos
          if (filters.districts && filters.districts.length > 0) {
            if (!professional.district || !filters.districts.includes(professional.district)) {
              return false;
            }
          }
          
          // Filtro por preço
          if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            const minPrice = Math.min(...(professional.services?.map(s => s.price) || [Infinity]));
            
            if (filters.minPrice !== undefined && minPrice < filters.minPrice) {
              return false;
            }
            
            if (filters.maxPrice !== undefined && minPrice > filters.maxPrice) {
              return false;
            }
          }
          
          // Filtro por query de busca
          if (filters.query && filters.query.trim() !== '') {
            const query = filters.query.toLowerCase();
            const nameMatch = professional.name.toLowerCase().includes(query);
            const specialtyMatch = professional.specialty?.toLowerCase().includes(query);
            const servicesMatch = professional.services?.some(s => 
              s.name.toLowerCase().includes(query)
            );
            
            if (!nameMatch && !specialtyMatch && !servicesMatch) {
              return false;
            }
          }
          
          return true;
        });
        
        setProfessionals(filtered);
        
        // Define profissionais em destaque (com melhores avaliações)
        const featured = [...mockProfessionals]
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 6);
        
        setFeaturedProfessionals(featured);
      } catch (err) {
        console.error('Erro ao buscar profissionais:', err);
        setError('Ocorreu um erro ao buscar os profissionais. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfessionals();
  }, [
    filters.zones, 
    filters.categories, 
    filters.districts, 
    filters.minPrice, 
    filters.maxPrice,
    filters.query
  ]);
  
  return {
    professionals,
    featuredProfessionals,
    isLoading,
    error
  };
};

export default useProfessionals;