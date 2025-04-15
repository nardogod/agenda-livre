/**
 * Gera um array de datas a partir de hoje até o número de dias especificado
 */
export const generateDateRange = (days: number): Date[] => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      date.setHours(0, 0, 0, 0); // Resetar horas, minutos, segundos
      dates.push(date);
    }
    
    return dates;
  };
  
  /**
   * Verifica se duas datas são o mesmo dia
   */
  export const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };
  
  /**
   * Converte uma string de hora (HH:MM) para objetos Date
   */
  export const timeStringToDate = (timeString: string, date?: Date): Date => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const baseDate = date ? new Date(date) : new Date();
    
    baseDate.setHours(hours, minutes, 0, 0);
    return baseDate;
  };
  
  /**
   * Retorna o nome do dia da semana em português
   */
  export const getDayOfWeekName = (date: Date, short = false): string => {
    const days = short 
      ? ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
      : ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    
    return days[date.getDay()];
  };
  
  /**
   * Retorna o nome do mês em português
   */
  export const getMonthName = (date: Date, short = false): string => {
    const months = short
      ? ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
      : ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    return months[date.getMonth()];
  };
  
  /**
   * Calcula a duração em minutos entre duas datas
   */
  export const getDurationInMinutes = (start: Date, end: Date): number => {
    const diff = end.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60));
  };
  
  /**
   * Adiciona minutos a uma data
   */
  export const addMinutes = (date: Date, minutes: number): Date => {
    const result = new Date(date);
    result.setMinutes(result.getMinutes() + minutes);
    return result;
  };
  
  /**
   * Verifica se um horário está dentro de um intervalo
   */
  export const isTimeInRange = (
    time: Date,
    rangeStart: Date,
    rangeEnd: Date
  ): boolean => {
    const t = time.getTime();
    return t >= rangeStart.getTime() && t <= rangeEnd.getTime();
  };
  
  /**
   * Verifica se dois intervalos de tempo se sobrepõem
   */
  export const doTimeRangesOverlap = (
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date
  ): boolean => {
    return (
      (start1 <= end2 && end1 >= start2) || 
      (start2 <= end1 && end2 >= start1)
    );
  };
  
  /**
   * Gera slots de tempo com base em horário de início, fim e duração
   */
  export const generateTimeSlots = (
    startTime: string,
    endTime: string,
    date: Date,
    slotDuration: number = 15, // em minutos
    serviceDuration: number = 60 // em minutos
  ): Date[] => {
    const slots: Date[] = [];
    
    const start = timeStringToDate(startTime, date);
    const end = timeStringToDate(endTime, date);
    
    // Ajusta o final para contemplar o último slot completo
    const adjustedEnd = new Date(end.getTime() - serviceDuration * 60 * 1000);
    
    let current = new Date(start);
    
    while (current <= adjustedEnd) {
      slots.push(new Date(current));
      current = addMinutes(current, slotDuration);
    }
    
    return slots;
  };