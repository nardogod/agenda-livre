// src/services/auth.ts
import { User } from '../types/user';

// Dados mockados para desenvolvimento
const MOCK_USERS = [
  {
    id: 1,
    name: 'Ana Cliente',
    email: 'cliente@teste.com',
    password: '123456',
    type: 'client',
    phone: '(11) 99999-9999'
  },
  {
    id: 2,
    name: 'João Profissional',
    email: 'profissional@teste.com',
    password: '123456',
    type: 'professional',
    phone: '(11) 88888-8888',
    specialty: 'Cabeleireiro',
    isVerified: true
  }
];

// Interface para retorno de autenticação
interface AuthResponse {
  user: User;
  token: string;
}

// Função para login
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  // Simular chamada à API
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Encontrar usuário pelo email
      const user = MOCK_USERS.find(
        user => user.email.toLowerCase() === email.toLowerCase() && user.password === password
      );
      
      if (user) {
        // Gerar token JWT mockado
        const token = `mock_token_${user.id}_${Date.now()}`;
        
        // Remover password do objeto de usuário
        const { password, ...userWithoutPassword } = user;
        
        resolve({
          user: userWithoutPassword as User,
          token
        });
      } else {
        reject(new Error('Credenciais inválidas'));
      }
    }, 500);
  });
};

// Função para logout
export const logout = async (): Promise<void> => {
  // Simular chamada à API
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 300);
  });
};

// Função para registro
export const register = async (userData: Partial<User>): Promise<AuthResponse> => {
  // Simular chamada à API
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Verificar se o email já está em uso
      const emailExists = MOCK_USERS.some(
        user => user.email.toLowerCase() === userData.email?.toLowerCase()
      );
      
      if (emailExists) {
        reject(new Error('Este email já está em uso'));
        return;
      }
      
      // Criar novo usuário
      const newUser = {
        id: MOCK_USERS.length + 1,
        name: userData.name || '',
        email: userData.email || '',
        password: userData.password || '',
        type: userData.type || 'client',
        phone: userData.phone || '',
        // Outros campos específicos por tipo de usuário
        ...(userData.type === 'professional' ? {
          specialty: userData.specialty || '',
          isVerified: false
        } : {})
      };
      
      // Adicionar à lista mock (em um ambiente real isso seria salvo no banco de dados)
      MOCK_USERS.push(newUser);
      
      // Gerar token JWT mockado
      const token = `mock_token_${newUser.id}_${Date.now()}`;
      
      // Remover password do objeto de usuário
      const { password, ...userWithoutPassword } = newUser;
      
      resolve({
        user: userWithoutPassword as User,
        token
      });
    }, 700);
  });
};

// Função para verificar se o token é válido
export const verifyToken = async (token: string): Promise<User | null> => {
  // Simular chamada à API
  return new Promise(resolve => {
    setTimeout(() => {
      // Verificar se o token começa com "mock_token_"
      if (token.startsWith('mock_token_')) {
        // Extrair ID do usuário do token
        const [, userId] = token.split('mock_token_')[1].split('_');
        
        // Encontrar usuário pelo ID
        const user = MOCK_USERS.find(user => user.id === parseInt(userId));
        
        if (user) {
          // Remover password do objeto de usuário
          const { password, ...userWithoutPassword } = user;
          resolve(userWithoutPassword as User);
        } else {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    }, 300);
  });
};