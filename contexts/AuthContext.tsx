import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authService } from '../services/api';

// Interface para o usuário
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

// Interface para o contexto de autenticação
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Criação do contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = authService.isAuthenticated();
      if (isAuth) {
        // Em uma implementação real, devemos buscar os dados do usuário da API
        // Por enquanto, vamos usar um usuário mockado
        setUser({
          id: 1,
          name: 'Usuário Teste',
          email: 'teste@email.com',
          phone: '(11) 99999-9999',
        });
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Função de login
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
      const { token, user } = response.data;
      
      // Armazenar o token
      localStorage.setItem('auth_token', token);
      
      // Definir o usuário no estado
      setUser(user);
      
      // Redirecionar para a homepage ou dashboard
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função de registro
  const register = async (userData: any) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      const { token, user } = response.data;
      
      // Armazenar o token
      localStorage.setItem('auth_token', token);
      
      // Definir o usuário no estado
      setUser(user);
      
      // Redirecionar para a homepage ou dashboard
      router.push('/');
    } catch (error) {
      console.error('Erro ao registrar:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    authService.logout();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export default AuthContext;