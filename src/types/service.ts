// src/types/service.ts
export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  image?: string;
  
  // Opções adicionais
  hasHairOption?: boolean;
  hairPriceSmall?: number;
  hairPriceMedium?: number;
  hairPriceLarge?: number;
  
  categoryId?: string;
}