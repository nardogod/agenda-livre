// fix-auth-context.js
const fs = require('fs');
const path = require('path');

// Caminho para os arquivos que precisamos modificar
const srcDir = path.join(__dirname, 'src');
const contextDir = path.join(srcDir, 'contexts');
const appFile = path.join(srcDir, 'pages', '_app.tsx');

// Função para garantir que o diretório existe
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Diretório criado: ${dir}`);
  }
}

// Garantir que os diretórios necessários existem
ensureDir(contextDir);
ensureDir(path.join(srcDir, 'pages'));

// Conteúdo do AuthContext simplificado (sem dependência do ToastContext)
const authContextContent = `// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

// Mockup para o serviço de autenticação
const authService = {
  login: async (credentials) => {
    // Simula uma requisição de login
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            token: 'mock-token-' + Date.now(),
            user: {
              id: 1,
              name: 'Usuário Teste',
              email: credentials.email,
              user_type: 'client'
            }
          }
        });
      }, 500);
    });
  },
  register: async (userData) => {
    // Simula uma requisição de registro
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            token: 'mock-token-' + Date.now(),
            user: {
              id: 2,
              name: userData.name,
              email: userData.email,
              user_type: userData.user_type || 'client'
            }
          }
        });
      }, 500);
    });
  },
  getProfile: async () => {
    // Simula uma requisição para obter o perfil
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            id: 1,
            name: 'Usuário Teste',
            email: 'usuario@teste.com',
            user_type: 'client'
          }
        });
      }, 300);
    });
  }
};

// Criar o contexto de autenticação
const AuthContext = createContext();

// Hook personalizado para usar o contexto
export function useAuth() {
  return useContext(AuthContext);
}

// Provider que gerencia a autenticação
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Toast simplificado para não depender do ToastContext
  const showToast = (message, type) => {
    console.log(\`[\${type}]: \${message}\`);
    // Na versão final, isto seria substituído pelo useToast()
  };

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const loadUserFromToken = async () => {
      try {
        // Na versão final do app, este código usaria localStorage
        const token = null; // localStorage.getItem('agenda_livre_token');
        if (token) {
          // Buscar perfil do usuário
          const response = await authService.getProfile();
          setUser(response.data);
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        // localStorage.removeItem('agenda_livre_token');
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
      // localStorage.setItem('agenda_livre_token', token);
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
      // localStorage.setItem('agenda_livre_token', token);
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
    // localStorage.removeItem('agenda_livre_token');
    setUser(null);
    router.push('/login');
    showToast('Você saiu da sua conta', 'info');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isProfessional: user?.user_type === 'professional',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;`;

// Conteúdo do _app.tsx atualizado (sem o ToastProvider)
const appContent = `// src/pages/_app.tsx
import { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;`;

// Escrever o conteúdo nos arquivos
try {
  // Salvar AuthContext.js
  fs.writeFileSync(path.join(contextDir, 'AuthContext.js'), authContextContent);
  console.log('✅ Arquivo src/contexts/AuthContext.js atualizado com sucesso!');

  // Salvar _app.tsx
  fs.writeFileSync(appFile, appContent);
  console.log('✅ Arquivo src/pages/_app.tsx atualizado com sucesso!');

  console.log('\n🚀 Todos os arquivos foram atualizados. Agora você pode executar o projeto com "npm run dev"');
} catch (error) {
  console.error('❌ Erro ao atualizar os arquivos:', error.message);
}