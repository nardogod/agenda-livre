import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType?: 'client' | 'professional' | 'any';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  userType = 'any' 
}) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      // Redirecionar para login se não estiver autenticado
      router.replace('/auth/login?redirect=' + router.asPath);
    } else if (!isLoading && user && userType !== 'any') {
      // Verificar se o tipo de usuário é o permitido
      if (
        (userType === 'client' && user.type !== 'client') || 
        (userType === 'professional' && user.type !== 'professional')
      ) {
        router.replace('/');
      }
    }
  }, [user, isLoading, router, userType]);

  // Mostrar nada enquanto carrega ou verifica autenticação
  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-center">
        <div className="h-8 bg-gray-200 rounded w-32 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
      </div>
    </div>;
  }

  // Se o usuário estiver autenticado e for do tipo correto, renderizar o conteúdo
  return <>{children}</>;
};

export default ProtectedRoute;