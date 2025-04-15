import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authService } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { showToast } = useToast();

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const loadUserFromToken = async () => {
      try {
        const token = localStorage.getItem('agenda_livre_token');
        if (token) {
          // Buscar perfil do usuário
          const response = await authService.getProfile();
          setUser(response.data);
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        localStorage.removeItem('agenda_livre_token');
      } finally {
        setLoading(false);
      }
    };

    loadUserFromToken();
  }, []);

  // Função de login
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      const { token, user } = response.data;
      
      // Salvar token e informações do usuário
      localStorage.setItem('agenda_livre_token', token);
      setUser(user);
      
      showToast('Login realizado com sucesso!', 'success');
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      const message = error.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.';
      showToast(message, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Função de registro
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      const { token, user } = response.data;
      
      // Salvar token e informações do usuário
      localStorage.setItem('agenda_livre_token', token);
      setUser(user);
      
      showToast('Cadastro realizado com sucesso!', 'success');
      return true;
    } catch (error) {
      console.error('Erro no registro:', error);
      const message = error.response?.data?.message || 'Erro ao criar conta. Verifique os dados informados.';
      showToast(message, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('agenda_livre_token');
    setUser(null);
    router.push('/login');
    showToast('Você saiu da sua conta', 'info');
  };

  // Atualizar perfil do usuário
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await authService.updateProfile(profileData);
      setUser(response.data);
      showToast('Perfil atualizado com sucesso!', 'success');
      return true;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      const message = error.response?.data?.message || 'Erro ao atualizar perfil.';
      showToast(message, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Solicitar redefinição de senha
  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      await authService.requestPasswordReset(email);
      showToast('Instruções de redefinição de senha enviadas para seu email!', 'success');
      return true;
    } catch (error) {
      console.error('Erro ao solicitar redefinição:', error);
      const message = error.response?.data?.message || 'Erro ao solicitar redefinição de senha.';
      showToast(message, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    requestPasswordReset,
    isAuthenticated: !!user,
    isProfessional: user?.user_type === 'professional',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}