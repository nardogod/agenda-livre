import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Aqui verificaríamos se o usuário está autenticado
    // Por enquanto, simulamos uma verificação simples
    const checkAuth = async () => {
      // Em uma implementação real, verificaríamos a existência de tokens
      // e sua validade com uma chamada para o backend
      const token = localStorage.getItem('auth_token');
      
      // Para fins de desenvolvimento, consideramos autenticado
      // se encontrarmos qualquer token
      setIsAuthenticated(!!token);
      setIsLoading(false);
      
      // Se não estiver autenticado, redireciona para login
      if (!token) {
        router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`);
      }
    };

    checkAuth();
  }, [router]);

  // Enquanto estamos verificando, exibimos um loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Se não estiver autenticado, exibimos uma mensagem e link para login
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-5">
        <h1 className="text-xl font-bold mb-4">Acesso Restrito</h1>
        <p className="text-gray-600 mb-6 text-center">
          Você precisa estar logado para acessar esta página.
        </p>
        <Link href={`/login?redirect=${encodeURIComponent(router.asPath)}`} className="px-4 py-2 bg-purple-600 text-white rounded-xl font-medium">
            Fazer login
          </Link>
      </div>
    );
  }

  // Se estiver autenticado, renderiza o conteúdo protegido
  return <>{children}</>;
};

export default ProtectedRoute;