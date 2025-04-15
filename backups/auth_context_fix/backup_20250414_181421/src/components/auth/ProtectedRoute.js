import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../../../../backups/auth_context_fix/backups/auth_context_fix/backups/auth_context_fix/src/contexts/AuthContext.tsx';

/**
 * Componente de rota protegida que verifica autenticação
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes a serem renderizados se autenticado
 * @param {boolean} props.professionalOnly - Se a rota é apenas para profissionais
 */
export default function ProtectedRoute({ children, professionalOnly = false }) {
  const { isAuthenticated, user?.is_professional || user?.user?.is_professional || user?.user?.is_professional || user?.user?.is_professional || user?.user?.is_professional || user?.user?.is_professional || user?.isProfessional, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se não estiver carregando e o usuário não estiver autenticado
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`);
    }
    
    // Se rota é apenas para profissionais, mas o usuário não é um profissional
    if (!isLoading && isAuthenticated && professionalOnly && !user?.is_professional || user?.user?.is_professional || user?.user?.is_professional || user?.user?.is_professional || user?.user?.is_professional || user?.user?.is_professional || user?.isProfessional) {
      router.push('/client/dashboard');
    }
  }, [isAuthenticated, user?.is_professional || user?.user?.is_professional || user?.user?.is_professional || user?.user?.is_professional || user?.user?.is_professional || user?.user?.is_professional || user?.isProfessional, isLoading, router, professionalOnly]);

  // Renderiza um estado de carregamento enquanto verifica
  if (isLoading || !isAuthenticated || (professionalOnly && !user?.is_professional || user?.user?.is_professional || user?.user?.is_professional || user?.user?.is_professional || user?.user?.is_professional || user?.user?.is_professional || user?.isProfessional)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-purple-200 mb-3"></div>
          <div className="h-4 w-24 bg-purple-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Se autenticado e com as permissões corretas, renderiza o conteúdo
  return children;
}