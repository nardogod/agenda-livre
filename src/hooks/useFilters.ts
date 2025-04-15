import { useState, useCallback, useMemo } from 'react';

export const useFilters = () => {
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  
  // Calcula a quantidade de filtros ativos
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedZones.length > 0) count++;
    if (selectedCategories.length > 0) count++;
    if (selectedDistricts.length > 0) count++;
    
    // Verifica se o filtro de preço está ativo (diferente do padrão)
    if (priceRange[0] > 0 || priceRange[1] < 500) count++;
    
    return count;
  }, [selectedZones, selectedCategories, selectedDistricts, priceRange]);
  
  // Limpa todos os filtros
  const clearAllFilters = useCallback(() => {
    setSelectedZones([]);
    setSelectedCategories([]);
    setSelectedDistricts([]);
    setPriceRange([0, 500]);
  }, []);
  
  return {
    selectedZones,
    selectedCategories,
    selectedDistricts,
    priceRange,
    setSelectedZones,
    setSelectedCategories,
    setSelectedDistricts,
    setPriceRange,
    clearAllFilters,
    activeFilterCount
  };
};

export default useFilters;