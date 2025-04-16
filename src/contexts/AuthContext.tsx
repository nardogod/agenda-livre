import React, { createContext, useState, useEffect } from 'react';

// Tipos para o contexto de autenticação
interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  type: 'client' | 'professional';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: any) => Promise<boolean>;
  updateProfile: (data: any) => Promise<boolean>;
}

// Criar o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Verificar autenticação ao montar o componente
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar se há token no localStorage
        const token = localStorage.getItem('auth_token');
        
        if (token) {
          // Simular chamada à API para validar o token e obter dados do usuário
          // Em uma implementação real, faríamos uma chamada API
          
          // Mock para demonstração
          setTimeout(() => {
            // Usuário mockado para testes
            setUser({
              id: 1,
              name: 'Usuário Teste',
              email: 'usuario@teste.com',
              phone: '(11) 98765-4321',
              address: 'Rua Exemplo, 123',
              type: 'client'
            });
            
            setIsLoading(false);
          }, 1000);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setUser(null);
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Função de login
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simular chamada à API
      // Em uma implementação real, faríamos uma chamada API
      
      return new Promise((resolve) => {
        setTimeout(() => {
          // Validação básica para demonstração
          if (email && password) {
            // Usuário mockado para testes
            const mockUser = {
              id: 1,
              name: 'Usuário Teste',
              email,
              phone: '(11) 98765-4321',
              address: 'Rua Exemplo, 123',
              type: 'client'
            };
            
            // Salvar token no localStorage
            localStorage.setItem('auth_token', 'mock_token_123');
            
            setUser(mockUser);
            setIsLoading(false);
            resolve(true);
          } else {
            setUser(null);
            setIsLoading(false);
            resolve(false);
          }
        }, 1000);
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setUser(null);
      setIsLoading(false);
      return false;
    }
  };
  
  // Função de logout
  const logout = () => {
    // Remover token do localStorage
    localStorage.removeItem('auth_token');
    setUser(null);
  };
  
  // Função de registro
  const register = async (userData: any): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simular chamada à API
      // Em uma implementação real, faríamos uma chamada API
      
      return new Promise((resolve) => {
        setTimeout(() => {
          // Salvar token no localStorage
          localStorage.setItem('auth_token', 'mock_token_123');
          
          // Usuário mockado com dados do registro
          const newUser = {
            id: 1,
            ...userData,
            type: userData.type || 'client'
          };
          
          setUser(newUser);
          setIsLoading(false);
          resolve(true);
        }, 1000);
      });
    } catch (error) {
      console.error('Erro ao registrar:', error);
      setIsLoading(false);
      return false;
    }
  };
  
  // Função para atualizar perfil
  const updateProfile = async (data: any): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simular chamada à API
      // Em uma implementação real, faríamos uma chamada API
      
      return new Promise((resolve) => {
        setTimeout(() => {
          // Atualizar dados do usuário
          if (user) {
            const updatedUser = {
              ...user,
              ...data
            };
            
            setUser(updatedUser);
          }
          
          setIsLoading(false);
          resolve(true);
        }, 1000);
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setIsLoading(false);
      return false;
    }
  };
  
  // Disponibilizar o contexto
  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
    updateProfile
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;