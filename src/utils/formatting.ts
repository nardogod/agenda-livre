// src/utils/formatting.ts

/**
 * Formata um valor numérico para o formato de moeda brasileira (R$)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Formata uma data no formato brasileiro (DD/MM/YYYY)
 */
export const formatDate = (date: Date | string): string => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

/**
 * Formata um horário no formato HH:MM
 */
export const formatTime = (time: Date | string): string => {
  if (typeof time === 'string') {
    time = new Date(time);
  }
  
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(time);
};

/**
 * Formata um número de telefone (XX) XXXXX-XXXX
 */
export const formatPhone = (phone: string): string => {
  // Remove caracteres não numéricos
  const numbers = phone.replace(/\D/g, '');
  
  if (numbers.length === 11) {
    // Celular: (XX) XXXXX-XXXX
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (numbers.length === 10) {
    // Fixo: (XX) XXXX-XXXX
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone; // Retorna o original se não for possível formatar
};