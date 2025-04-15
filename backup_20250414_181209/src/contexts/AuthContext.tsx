// src/contexts/AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import Router from 'next/router';
import { signIn, signOut, getUser, signUp } from '../services/auth';
import { User } from '../types/user';

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignUpData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  user_type: 'client' | 'professional';
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => void;
  error: string | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUserFromCookies() {
      try {
        const savedUser = getUser();
        
        if (savedUser) {
          setUser(savedUser);
        }
      } catch (error) {
        console.error('Erro ao carregar usuário dos cookies:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserFromCookies();
  }, []);

  async function handleSignIn({ email, password }: SignInCredentials) {
    try {
      setIsLoading(true);
      setError(null);
      
      const user = await signIn({ email, password });
      setUser(user);

      // Redireciona baseado no tipo de usuário
      if (user.user_type === 'professional') {
        Router.push('/dashboard/professional');
      } else {
        Router.push('/dashboard/client');
      }
    } catch (error: any) {
      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError('Erro ao fazer login. Verifique suas credenciais.');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignUp(data: SignUpData) {
    try {
      setIsLoading(true);
      setError(null);
      
      const user = await signUp(data);
      setUser(user);

      // Redireciona baseado no tipo de usuário
      if (user.user_type === 'professional') {
        Router.push('/dashboard/professional');
      } else {
        Router.push('/dashboard/client');
      }
    } catch (error: any) {
      if (error.response?.data) {
        // Formata erros do backend para exibição
        const errorMessages = Object.values(error.response.data)
          .map((messages: any) => Array.isArray(messages) ? messages.join(', ') : messages)
          .join('. ');
        
        setError(errorMessages || 'Erro ao criar conta.');
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  function handleSignOut() {
    signOut();
    setUser(null);
    Router.push('/');
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      signIn: handleSignIn,
      signUp: handleSignUp,
      signOut: handleSignOut,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
}