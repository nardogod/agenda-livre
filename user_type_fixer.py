#!/usr/bin/env python3
"""
Script para padronizar o tipo User no projeto Agenda Livre.

Este script específico:
1. Analisa todos os arquivos buscando referências ao tipo User
2. Determina se há mais uso de camelCase (firstName) ou snake_case (first_name)
3. Padroniza todos os arquivos para usar o estilo predominante
4. Adiciona aliases no tipo User para manter compatibilidade

Uso:
python user_type_fixer.py [--dry-run] [--target=camel|snake]

Opções:
  --dry-run        Apenas mostrar mudanças sem aplicá-las
  --target=camel   Forçar uso de camelCase (firstName, lastName)
  --target=snake   Forçar uso de snake_case (first_name, last_name)
"""

import os
import re
import argparse
import json
from pathlib import Path
import shutil

# Configurações
PROJECT_ROOT = '.'  # Diretório atual
IGNORE_DIRS = ['.git', '.next', 'node_modules', 'coverage']
BACKUP_DIR = './backups/user_type_fix'
SUPPORTED_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx']

class UserTypeFixer:
    def __init__(self, root_dir, target_style=None, dry_run=False):
        self.root_dir = Path(root_dir)
        self.target_style = target_style  # 'camel' ou 'snake' ou None (auto-detectar)
        self.dry_run = dry_run
        self.files = []
        self.file_contents = {}
        self.changes_made = []
        self.camel_case_count = 0
        self.snake_case_count = 0
        self.user_type_files = []
        
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
                    
                    # Carregar o conteúdo dos arquivos
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                            self.file_contents[str_path] = content
                            
                            # Contar ocorrências de firstName vs first_name
                            self.camel_case_count += content.count('firstName')
                            self.snake_case_count += content.count('first_name')
                            
                            # Identificar arquivos que definem o tipo User
                            if ('interface User' in content or 
                                'type User' in content or 
                                'User:' in content):
                                self.user_type_files.append(str_path)
                    except Exception as e:
                        print(f"Erro ao ler arquivo {file_path}: {e}")
        
        print(f"Total de arquivos encontrados: {len(self.files)}")
        print(f"Arquivos com definição de User: {len(self.user_type_files)}")
        print(f"Ocorrências de camelCase (firstName): {self.camel_case_count}")
        print(f"Ocorrências de snake_case (first_name): {self.snake_case_count}")
    
    def determine_target_style(self):
        """Determina qual estilo usar baseado na análise ou no parâmetro fornecido."""
        if self.target_style:
            return self.target_style
        
        # Auto-detectar baseado no uso mais comum
        return 'camel' if self.camel_case_count >= self.snake_case_count else 'snake'
    
    def _backup_file(self, file_path):
        """Cria um backup de um arquivo antes de modificá-lo."""
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
    
    def update_user_type_definitions(self):
        """Atualiza definições do tipo User para usar o estilo escolhido e incluir aliases."""
        target_style = self.determine_target_style()
        print(f"Atualizando definições do tipo User para usar {target_style}...")
        
        for type_file in self.user_type_files:
            content = self.file_contents[type_file]
            original_content = content
            
            if target_style == 'camel':
                # Converter snake_case para camelCase nas definições
                content = re.sub(r'first_name\s*:', r'firstName:', content)
                content = re.sub(r'last_name\s*:', r'lastName:', content)
                
                # Adicionar aliases para compatibilidade
                if 'firstName' in content and 'first_name?' not in content:
                    if 'type User' in content:
                        add_before = re.search(r'type User\s*=\s*\{([^}]*)', content)
                        if add_before:
                            pos = add_before.end(1)
                            content = content[:pos] + "\n  // Aliases para compatibilidade com snake_case\n  first_name?: string;\n  last_name?: string;" + content[pos:]
            else:
                # Converter camelCase para snake_case nas definições
                content = re.sub(r'firstName\s*:', r'first_name:', content)
                content = re.sub(r'lastName\s*:', r'last_name:', content)
                
                # Adicionar aliases para compatibilidade
                if 'first_name' in content and 'firstName?' not in content:
                    if 'type User' in content:
                        add_before = re.search(r'type User\s*=\s*\{([^}]*)', content)
                        if add_before:
                            pos = add_before.end(1)
                            content = content[:pos] + "\n  // Aliases para compatibilidade com camelCase\n  firstName?: string;\n  lastName?: string;" + content[pos:]
            
            if content != original_content:
                self._backup_file(type_file)
                self._save_file(type_file, content)
                self.changes_made.append({
                    'file': type_file,
                    'change': f"Atualizada definição do tipo User para usar {target_style}"
                })
                
                # Atualizar o conteúdo em memória
                self.file_contents[type_file] = content
    
    def create_user_type_if_missing(self):
        """Cria um arquivo de definição do tipo User se não existir."""
        if not self.user_type_files:
            target_style = self.determine_target_style()
            
            # Decidir onde criar o arquivo
            types_dir = self.root_dir / 'src/types'
            if not types_dir.exists():
                types_dir = self.root_dir / 'types'
                if not types_dir.exists() and not self.dry_run:
                    os.makedirs(types_dir)
            
            type_file = 'src/types/user.ts' if (self.root_dir / 'src/types').exists() else 'types/user.ts'
            print(f"Arquivo de tipo User será criado em: {type_file}")
            
            if target_style == 'camel':
                content = """/**
 * Definição de tipos para usuários
 */

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profileImage?: string;
  isProfessional?: boolean;
  
  // Aliases para compatibilidade com snake_case
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
"""
            else:
                content = """/**
 * Definição de tipos para usuários
 */

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  profile_image?: string;
  is_professional?: boolean;
  
  // Aliases para compatibilidade com camelCase
  firstName?: string;
  lastName?: string;
};

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User>, password: string) => Promise<void>;
};
"""
            
            if not self.dry_run:
                # Criar o arquivo
                self._save_file(type_file, content)
                self.changes_made.append({
                    'file': type_file,
                    'change': f"Criado arquivo de tipos User usando {target_style}"
                })
    
    def update_user_references(self):
        """Atualiza referências ao User em todo o projeto para usar o estilo escolhido."""
        target_style = self.determine_target_style()
        print(f"Atualizando referências ao User para usar {target_style}...")
        
        for file_path in self.files:
            # Pular arquivos que já são definições de tipo
            if file_path in self.user_type_files:
                continue
                
            content = self.file_contents[file_path]
            original_content = content
            
            # Encontrar referências a propriedades do User
            has_user_refs = ('user.first_name' in content or 'user.firstName' in content or 
                            'user.last_name' in content or 'user.lastName' in content)
            
            if has_user_refs:
                if target_style == 'camel':
                    # Adicionar suporte para ambos os estilos usando operador de coalescência nula
                    content = re.sub(r'(user\.)first_name', r'\1firstName || \1first_name', content)
                    content = re.sub(r'(user\.)last_name', r'\1lastName || \1last_name', content)
                else:
                    # Adicionar suporte para ambos os estilos usando operador de coalescência nula
                    content = re.sub(r'(user\.)firstName', r'\1first_name || \1firstName', content)
                    content = re.sub(r'(user\.)lastName', r'\1last_name || \1lastName', content)
            
            if content != original_content:
                self._backup_file(file_path)
                self._save_file(file_path, content)
                self.changes_made.append({
                    'file': file_path,
                    'change': f"Atualizadas referências ao User para usar {target_style} com fallbacks"
                })
    
    def run(self):
        """Executa todas as etapas de correção."""
        print(f"Iniciando correção do tipo User (modo {'simulação' if self.dry_run else 'aplicação'})...")
        
        # Criar diretório de backup
        if not self.dry_run:
            os.makedirs(BACKUP_DIR, exist_ok=True)
        
        # Determinar o estilo alvo
        target_style = self.determine_target_style()
        print(f"Estilo escolhido: {target_style}")
        
        # Criar ou atualizar definições do tipo User
        self.update_user_type_definitions()
        self.create_user_type_if_missing()
        
        # Atualizar referências ao User em todo o projeto
        self.update_user_references()
        
        # Gerar relatório
        self._generate_report()
        
        print(f"Correção concluída. {len(self.changes_made)} mudanças {'simuladas' if self.dry_run else 'aplicadas'}.")
        if not self.dry_run:
            print("Relatório salvo em user_type_fixes_report.json e user_type_fixes_report.txt")
    
    def _generate_report(self):
        """Gera um relatório das mudanças feitas ou simuladas."""
        report = {
            'summary': {
                'target_style': self.determine_target_style(),
                'camel_case_count': self.camel_case_count,
                'snake_case_count': self.snake_case_count,
                'total_changes': len(self.changes_made),
                'dry_run': self.dry_run
            },
            'changes': self.changes_made,
            'user_type_files': self.user_type_files
        }
        
        # Salvar o relatório
        if not self.dry_run:
            # Formato JSON
            with open('user_type_fixes_report.json', 'w', encoding='utf-8') as f:
                json.dump(report, f, indent=2)
            
            # Formato texto
            with open('user_type_fixes_report.txt', 'w', encoding='utf-8') as f:
                f.write("=== RELATÓRIO DE CORREÇÕES DO TIPO USER ===\n\n")
                
                f.write("== RESUMO ==\n")
                f.write(f"Estilo escolhido: {report['summary']['target_style']}\n")
                f.write(f"Ocorrências de camelCase (firstName): {report['summary']['camel_case_count']}\n")
                f.write(f"Ocorrências de snake_case (first_name): {report['summary']['snake_case_count']}\n")
                f.write(f"Total de mudanças: {report['summary']['total_changes']}\n\n")
                
                f.write("== ARQUIVOS COM DEFINIÇÃO DE USER ==\n")
                for file in self.user_type_files:
                    f.write(f"  - {file}\n")
                f.write("\n")
                
                f.write("== MUDANÇAS REALIZADAS ==\n")
                for change in self.changes_made:
                    f.write(f"Arquivo: {change['file']}\n")
                    f.write(f"  {change['change']}\n\n")
                
                f.write("=== FIM DO RELATÓRIO ===\n")
        
        return report

def main():
    parser = argparse.ArgumentParser(description='Padronizar o tipo User no projeto Agenda Livre')
    parser.add_argument('--dry-run', action='store_true', help='Apenas mostrar mudanças sem aplicá-las')
    parser.add_argument('--target', choices=['camel', 'snake'], help='Forçar uso de camelCase ou snake_case')
    
    args = parser.parse_args()
    
    fixer = UserTypeFixer(PROJECT_ROOT, target_style=args.target, dry_run=args.dry_run)
    fixer.scan_directory()
    fixer.run()

if __name__ == "__main__":
    main()