import { useContext } from 'react';
import { useRouter } from 'next/router';
import AuthContext from '../contexts/AuthContext';

// Hook personalizado para acessar e utilizar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  const router = useRouter();
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  // Função para redirecionar após login baseado no tipo de usuário
  const redirectAfterLogin = (userType: string) => {
    if (userType === 'professional') {
      router.push('/dashboard/professional');
    } else {
      router.push('/dashboard/client');
    }
  };
  
  // Função para redirecionar para login com página de retorno
  const redirectToLogin = (returnUrl?: string) => {
    const url = returnUrl 
      ? `/auth/login?redirect=${encodeURIComponent(returnUrl)}` 
      : '/auth/login';
    
    router.push(url);
  };
  
  return {
    ...context,
    redirectAfterLogin,
    redirectToLogin
  };
};

export default useAuth;