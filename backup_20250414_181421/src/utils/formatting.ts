/**
 * Formata um valor numérico para moeda brasileira (R$)
 */
export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  /**
   * Formata um número de telefone para o padrão brasileiro
   * Ex: (11) 99999-9999
   */
  export const formatPhone = (phone: string): string => {
    // Remove todos os caracteres não numéricos
    const cleaned = phone.replace(/\D/g, '');
    
    // Verifica se tem o tamanho adequado
    if (cleaned.length !== 10 && cleaned.length !== 11) {
      return phone; // Retorna o original se não tiver um formato válido
    }
    
    // Formata conforme o padrão brasileiro
    if (cleaned.length === 11) {
      // Celular: (XX) 9XXXX-XXXX
      return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7, 11)}`;
    } else {
      // Fixo: (XX) XXXX-XXXX
      return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6, 10)}`;
    }
  };
  
  /**
   * Formata uma data para o padrão brasileiro
   * Ex: 31/12/2023
   */
  export const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('pt-BR');
  };
  
  /**
   * Formata um horário no formato de 24h
   * Ex: 14:30
   */
  export const formatTime = (time: Date | string): string => {
    const d = typeof time === 'string' ? new Date(time) : time;
    
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    
    return `${hours}:${minutes}`;
  };
  
  /**
   * Formata uma data e hora completas
   * Ex: 31/12/2023 às 14:30
   */
  export const formatDateTime = (dateTime: Date | string): string => {
    const d = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
    return `${formatDate(d)} às ${formatTime(d)}`;
  };
  
  /**
   * Trunca um texto longo e adiciona reticências
   */
  export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  /**
   * Capitaliza a primeira letra de cada palavra
   */
  export const capitalizeWords = (text: string): string => {
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };