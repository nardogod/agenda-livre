// src/hooks/useProfessional.ts
import { useState, useEffect } from 'react';
import { Professional } from '@/types/professional';
import { getProfessionalById } from '@/services/professionals';

export const useProfessional = (id: string | undefined) => {
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfessional = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await getProfessionalById(id);
        setProfessional(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
        setProfessional(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessional();
  }, [id]);

  return { professional, isLoading, error };
};