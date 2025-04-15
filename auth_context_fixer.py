#!/usr/bin/env python3
"""
Script específico para corrigir problemas no AuthContext e useAuth do projeto Agenda Livre.

Este script:
1. Busca todos os arquivos AuthContext no projeto
2. Verifica se useAuth está sendo exportado corretamente
3. Adiciona ou corrige a implementação de useAuth
4. Corrige importações referenciando useAuth em outros arquivos
"""

import os
import re
import json
import shutil
from pathlib import Path

# Configurações
PROJECT_ROOT = '.'  # Diretório atual
IGNORE_DIRS = ['.git', '.next', 'node_modules', 'coverage']
BACKUP_DIR = './backups/auth_context_fix'
SUPPORTED_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx']

class AuthContextFixer:
    def __init__(self, root_dir, dry_run=False):
        self.root_dir = Path(root_dir)
        self.dry_run = dry_run
        self.files = []
        self.file_contents = {}
        self.changes_made = []
        self.auth_context_files = []
        self.files_importing_useauth = []
        
    def scan_directory(self):
        """Escaneia o diretório do projeto e carrega os arquivos relevantes."""
        print(f"Escaneando diretório: {self.root_dir}")
        
        for root, dirs, files in os.walk(self.root_dir):
            # Ignorar diretórios específicos
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
            
            for file in files:
                file_path = Path(root) / file
                rel_path = file_path.relative_to(self.root_dir)
                str_path = str(rel_path)
                
                # Verificar se é um arquivo relevante
                if file_path.suffix in SUPPORTED_EXTENSIONS:
                    self.files.append(str_path)
                    
                    # Identificar arquivos de autenticação
                    if 'auth' in str_path.lower() or 'context' in str_path.lower():
                        if 'authcontext' in str_path.lower() or 'useauth' in str_path.lower():
                            self.auth_context_files.append(str_path)
                    
                    # Carregar o conteúdo dos arquivos
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            self.file_contents[str_path] = f.read()
                    except Exception as e:
                        print(f"Erro ao ler arquivo {file_path}: {e}")
        
        print(f"Total de arquivos encontrados: {len(self.files)}")
        print(f"Arquivos de autenticação encontrados: {len(self.auth_context_files)}")
    
    def _backup_file(self, file_path):
        """Cria um backup de um arquivo antes de modificá-lo."""
        if self.dry_run:
            return
            
        backup_path = Path(BACKUP_DIR) / file_path
        os.makedirs(backup_path.parent, exist_ok=True)
        
        src_path = self.root_dir / file_path
        shutil.copy2(src_path, backup_path)
        
        return backup_path
    
    def _save_file(self, file_path, content):
        """Salva o conteúdo em um arquivo."""
        if self.dry_run:
            return
            
        full_path = self.root_dir / file_path
        
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
    
    def fix_auth_context(self):
        """Corrige os arquivos de AuthContext para garantir que useAuth seja exportado corretamente."""
        print("Corrigindo arquivos AuthContext...")
        
        if not self.auth_context_files:
            print("Nenhum arquivo AuthContext encontrado! Criando um novo...")
            self._create_auth_context()
            return
        
        for auth_file in self.auth_context_files:
            content = self.file_contents[auth_file]
            original_content = content
            
            # Verificar se useAuth está sendo exportado
            exports_use_auth = (
                'export function useAuth' in content or 
                'export const useAuth' in content or
                're-export' in content  # Comentário indicando re-export para compatibilidade
            )
            
            if exports_use_auth:
                print(f"  {auth_file}: useAuth já está sendo exportado")
                continue
            
            # Verificar se useAuth existe mas não está sendo exportado
            has_use_auth = re.search(r'(function|const)\s+useAuth', content) is not None
            
            if has_use_auth:
                # useAuth existe, mas precisa ser exportado
                self._backup_file(auth_file)
                
                if 'function useAuth' in content:
                    # Adicionar export à função useAuth existente
                    updated_content = re.sub(
                        r'function\s+useAuth', 
                        'export function useAuth', 
                        content
                    )
                    self._save_file(auth_file, updated_content)
                    self.changes_made.append({
                        'file': auth_file,
                        'change': 'Adicionado export à function useAuth existente'
                    })
                elif 'const useAuth' in content:
                    # Adicionar export à const useAuth existente
                    updated_content = re.sub(
                        r'const\s+useAuth', 
                        'export const useAuth', 
                        content
                    )
                    self._save_file(auth_file, updated_content)
                    self.changes_made.append({
                        'file': auth_file,
                        'change': 'Adicionado export à const useAuth existente'
                    })
            else:
                # useAuth não existe, precisa ser criado
                self._backup_file(auth_file)
                
                # Determinar se o arquivo usa TypeScript
                is_typescript = auth_file.endswith('.ts') or auth_file.endswith('.tsx')
                
                # Criar a função useAuth apropriada
                if is_typescript:
                    use_auth_function = """
/**
 * Hook para acessar o contexto de autenticação
 */
export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
"""
                else:
                    use_auth_function = """
/**
 * Hook para acessar o contexto de autenticação
 */
export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
"""
                
                # Inserir antes do export default, se existir
                if 'export default' in content:
                    pos = content.find('export default')
                    updated_content = content[:pos] + use_auth_function + '\n' + content[pos:]
                else:
                    updated_content = content + '\n' + use_auth_function
                
                self._save_file(auth_file, updated_content)
                self.changes_made.append({
                    'file': auth_file,
                    'change': 'Criada e exportada function useAuth'
                })
    
    def _create_auth_context(self):
        """Cria um novo arquivo AuthContext se não existir nenhum."""
        # Decidir onde criar o arquivo
        contexts_dir = self.root_dir / 'src/contexts'
        if not contexts_dir.exists():
            contexts_dir = self.root_dir / 'contexts'
            if not contexts_dir.exists() and not self.dry_run:
                os.makedirs(contexts_dir)
        
        auth_file = 'src/contexts/AuthContext.tsx' if (self.root_dir / 'src/contexts').exists() else 'contexts/AuthContext.tsx'
        
        # Conteúdo do novo arquivo
        content = """import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

// Definição de tipos
export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profileImage?: string;
  isProfessional?: boolean;
  
  // Aliases para compatibilidade
  first_name?: string;
  last_name?: string;
};

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User>, password: string) => Promise<void>;
};

// Criação do contexto com valor inicial
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provedor do contexto
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar se há um usuário logado no localStorage
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Função de login
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulação de login para o MVP
      // Em produção, substituir por chamada à API
      const mockUser: User = {
        id: '1',
        firstName: 'Usuário',
        lastName: 'Teste',
        email: email,
        phone: '(11) 99999-9999',
        isProfessional: false
      };
      
      // Salvar no localStorage para persistência
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      // Redirecionar para a dashboard apropriada
      router.push('/client/appointments');
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  // Função de registro
  const register = async (userData: Partial<User>, password: string) => {
    setIsLoading(true);
    try {
      // Simulação de registro para o MVP
      // Em produção, substituir por chamada à API
      const newUser: User = {
        id: '2',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        isProfessional: userData.isProfessional || false
      };
      
      // Salvar no localStorage para persistência
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      
      // Redirecionar para a dashboard apropriada
      if (newUser.isProfessional) {
        router.push('/professional/dashboard');
      } else {
        router.push('/client/appointments');
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Valor do contexto
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook para acessar o contexto de autenticação
 */
export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthProvider;
"""
        
        if not self.dry_run:
            # Criar o arquivo
            full_path = self.root_dir / auth_file
            os.makedirs(full_path.parent, exist_ok=True)
            self._save_file(auth_file, content)
            
            self.changes_made.append({
                'file': auth_file,
                'change': 'Criado novo arquivo AuthContext completo'
            })
    
    def fix_useauth_imports(self):
        """Corrige importações de useAuth que podem estar causando erros."""
        print("Corrigindo importações de useAuth...")
        
        for file_path in self.files:
            content = self.file_contents[file_path]
            
            # Verificar se o arquivo importa useAuth
            if re.search(r'import\s+[^;]*?{[^}]*?useAuth[^}]*?}\s+from', content):
                self.files_importing_useauth.append(file_path)
                
                # Verificar se a importação é de um local correto
                matches = re.findall(r'import\s+([^;]*?){([^}]*?)useAuth([^}]*?)}\s+from\s+[\'"]([^\'"]*?)[\'"]', content)
                
                for pre, use_auth, post, source in matches:
                    # Verificar se o arquivo importado existe
                    imported_path = self._resolve_import_path(file_path, source)
                    
                    if not self._is_valid_authcontext_import(imported_path):
                        # A importação está referenciando um arquivo que não é o AuthContext correto
                        self._backup_file(file_path)
                        
                        # Encontrar o AuthContext correto mais próximo
                        closest_auth = self._find_closest_auth_context(file_path)
                        
                        if closest_auth:
                            # Calcular caminho relativo
                            file_dir = Path(file_path).parent
                            rel_path = os.path.relpath(self.root_dir / closest_auth, self.root_dir / file_dir)
                            
                            # Garantir formato correto para importação
                            if not rel_path.startswith('.'):
                                rel_path = './' + rel_path
                            # Normalizar separadores (para JS/TS é comum usar '/')
                            rel_path = rel_path.replace(os.sep, '/')

                            # Escapar para uso seguro no regex
                            escaped_rel_path = re.escape(rel_path)

                            # Substituir no import statement
                            updated_content = re.sub(
                                r'(import\s+[^;]*?{\s*[^}]*?useAuth[^}]*?}\s+from\s+[\'"]).+?([\'"])',
                                r'\1' + escaped_rel_path + r'\2',
                                content
                            )
                            
                            self._save_file(file_path, updated_content)
                            self.changes_made.append({
                                'file': file_path,
                                'change': f'Corrigida importação de useAuth para {rel_path}'
                            })
    
    def _resolve_import_path(self, file_path, import_path):
        """Resolve o caminho completo de uma importação."""
        try:
            # Remover extensão da importação, se houver
            import_path = re.sub(r'\.(js|jsx|ts|tsx)$', '', import_path)
            
            # Caminho relativo
            if import_path.startswith('./') or import_path.startswith('../'):
                file_dir = Path(file_path).parent
                resolved = (file_dir / import_path).resolve().relative_to(self.root_dir)
                
                # Verificar diferentes extensões possíveis
                for ext in ['.js', '.jsx', '.ts', '.tsx']:
                    potential_file = str(resolved) + ext
                    if potential_file in self.files:
                        return potential_file
                
                # Verificar se existe como index
                for ext in ['.js', '.jsx', '.ts', '.tsx']:
                    potential_index = str(resolved) + '/index' + ext
                    if potential_index in self.files:
                        return potential_index
            
            # Importações absolutas são mais difíceis de resolver
            return None
        except Exception:
            return None
    
    def _is_valid_authcontext_import(self, imported_path):
        """Verifica se o caminho importado é um AuthContext válido."""
        if not imported_path:
            return False
        
        return imported_path in self.auth_context_files
    
    def _find_closest_auth_context(self, file_path):
        """Encontra o arquivo AuthContext mais próximo na hierarquia."""
        if not self.auth_context_files:
            return None
            
        # Preferir AuthContext no mesmo diretório ou acima
        file_dir = Path(file_path).parent
        
        for auth_file in self.auth_context_files:
            auth_dir = Path(auth_file).parent
            if str(file_dir).startswith(str(auth_dir)) or str(auth_dir).startswith(str(file_dir)):
                return auth_file
        
        # Se não encontrar nenhum próximo, retornar o primeiro
        return self.auth_context_files[0]
    
    def run(self):
        """Executa todas as correções no AuthContext."""
        print(f"Iniciando correções no AuthContext (modo {'simulação' if self.dry_run else 'aplicação'})...")
        
        # Criar diretório de backup
        if not self.dry_run:
            os.makedirs(BACKUP_DIR, exist_ok=True)
        
        # Corrigir AuthContext existentes ou criar um novo
        self.fix_auth_context()
        
        # Corrigir importações de useAuth
        self.fix_useauth_imports()
        
        # Gerar relatório
        self._generate_report()
        
        print(f"Correções concluídas. {len(self.changes_made)} mudanças {'simuladas' if self.dry_run else 'aplicadas'}.")
        if not self.dry_run:
            print("Relatório salvo em auth_context_fixes_report.json e auth_context_fixes_report.txt")
    
    def _generate_report(self):
        """Gera um relatório das mudanças feitas ou simuladas."""
        report = {
            'summary': {
                'auth_context_files': len(self.auth_context_files),
                'files_importing_useauth': len(self.files_importing_useauth),
                'total_changes': len(self.changes_made),
                'dry_run': self.dry_run
            },
            'changes': self.changes_made,
            'auth_context_files': self.auth_context_files,
            'files_importing_useauth': self.files_importing_useauth
        }
        
        # Salvar o relatório
        if not self.dry_run:
            # Formato JSON
            with open('auth_context_fixes_report.json', 'w', encoding='utf-8') as f:
                json.dump(report, f, indent=2)
            
            # Formato texto
            with open('auth_context_fixes_report.txt', 'w', encoding='utf-8') as f:
                f.write("=== RELATÓRIO DE CORREÇÕES DO AUTHCONTEXT ===\n\n")
                
                f.write("== RESUMO ==\n")
                f.write(f"Arquivos AuthContext: {report['summary']['auth_context_files']}\n")
                f.write(f"Arquivos importando useAuth: {report['summary']['files_importing_useauth']}\n")
                f.write(f"Total de mudanças: {report['summary']['total_changes']}\n\n")
                
                f.write("== ARQUIVOS AUTHCONTEXT ==\n")
                for file in self.auth_context_files:
                    f.write(f"  - {file}\n")
                f.write("\n")
                
                f.write("== ARQUIVOS IMPORTANDO USEAUTH ==\n")
                for file in self.files_importing_useauth:
                    f.write(f"  - {file}\n")
                f.write("\n")
                
                f.write("== MUDANÇAS REALIZADAS ==\n")
                for change in self.changes_made:
                    f.write(f"Arquivo: {change['file']}\n")
                    f.write(f"  {change['change']}\n\n")
                
                f.write("=== FIM DO RELATÓRIO ===\n")
        
        return report

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Corrigir problemas no AuthContext e useAuth')
    parser.add_argument('--dry-run', action='store_true', help='Apenas mostrar mudanças sem aplicá-las')
    
    args = parser.parse_args()
    
    fixer = AuthContextFixer(PROJECT_ROOT, dry_run=args.dry_run)
    fixer.scan_directory()
    fixer.run()

if __name__ == "__main__":
    main()