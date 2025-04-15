#!/usr/bin/env python3
"""
Script para resolver o problema de componentes duplicados no projeto Agenda Livre.
Este script:
1. Identifica componentes duplicados
2. Escolhe a melhor versão (canônica) para cada componente
3. Cria redirecionamentos nos outros locais
"""

import os
import re
import json
import shutil
from pathlib import Path

# Configurações
PROJECT_ROOT = '.'  # Diretório atual
IGNORE_DIRS = ['.git', '.next', 'node_modules', 'coverage', 'backups', '.history']
BACKUP_DIR = './backups/component_deduplication'
SUPPORTED_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx']

class ComponentDeduplicator:
    def __init__(self, root_dir, dry_run=False):
        self.root_dir = Path(root_dir)
        self.dry_run = dry_run
        self.files = []
        self.file_contents = {}
        self.changes_made = []
        self.component_files = []
        self.duplicated_components = {}
        self.canonical_components = {}
        
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
                
                # Verificar se é um arquivo relevante (componente React)
                if file_path.suffix in SUPPORTED_EXTENSIONS:
                    self.files.append(str_path)
                    
                    # Carregar o conteúdo do arquivo
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                            self.file_contents[str_path] = content
                            
                            # Verificar se é um componente React
                            if self._is_react_component(content):
                                self.component_files.append(str_path)
                    except Exception as e:
                        print(f"Erro ao ler arquivo {file_path}: {e}")
        
        print(f"Total de arquivos encontrados: {len(self.files)}")
        print(f"Componentes React encontrados: {len(self.component_files)}")
    
    def _is_react_component(self, content):
        """Verifica se o conteúdo é um componente React."""
        # Padrões comuns de componentes React
        patterns = [
            r'(import React|from [\'"]react[\'"](;|,))',  # Importa React
            r'function\s+\w+\s*\(\s*{\s*.*?\s*}\s*\)',   # Componente funcional
            r'const\s+\w+\s*=\s*\(\s*{\s*.*?\s*}\s*\)',  # Const function
            r'class\s+\w+\s+extends\s+(React\.)?Component', # Class component
            r'export\s+(default\s+)?function\s+\w+',      # Export function
            r'export\s+(default\s+)?const\s+\w+\s*=\s*\(' # Export const
        ]
        
        for pattern in patterns:
            if re.search(pattern, content, re.DOTALL):
                return True
        
        return False
    
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
        os.makedirs(full_path.parent, exist_ok=True)
        
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
    
    def find_duplicates(self):
        """Encontra componentes duplicados no projeto."""
        print("Procurando componentes duplicados...")
        
        # Agrupar componentes por nome de arquivo (sem caminho)
        grouped_files = {}
        for component_file in self.component_files:
            filename = Path(component_file).name
            if filename not in grouped_files:
                grouped_files[filename] = []
            grouped_files[filename].append(component_file)
        
        # Filtrar apenas os que têm duplicatas
        self.duplicated_components = {
            filename: paths for filename, paths in grouped_files.items() 
            if len(paths) > 1
        }
        
        print(f"Encontrados {len(self.duplicated_components)} componentes duplicados.")
        
        for filename, paths in self.duplicated_components.items():
            print(f"  {filename}:")
            for path in paths:
                print(f"    - {path}")
            print()
    
    def choose_canonical_components(self):
        """Escolhe a versão canônica para cada componente duplicado."""
        print("Escolhendo versões canônicas para componentes duplicados...")
        
        for filename, paths in self.duplicated_components.items():
            # Preferir:
            # 1. Arquivos .tsx sobre .jsx
            # 2. Arquivos em src/ sobre arquivos na raiz
            # 3. Arquivos em diretórios específicos (components) sobre outros
            
            typescript_files = [path for path in paths if path.endswith('.tsx') or path.endswith('.ts')]
            javascript_files = [path for path in paths if path.endswith('.jsx') or path.endswith('.js')]
            
            if typescript_files:
                candidates = typescript_files
            else:
                candidates = javascript_files
            
            # Preferir arquivos em src/
            src_files = [path for path in candidates if path.startswith('src/')]
            if src_files:
                candidates = src_files
            
            # Preferir arquivos em diretórios de componentes
            component_dir_files = [
                path for path in candidates 
                if 'components/' in path or 'src/components/' in path
            ]
            if component_dir_files:
                candidates = component_dir_files
            
            # Se ainda houver mais de um candidato, escolher o primeiro
            self.canonical_components[filename] = candidates[0]
            
            print(f"  {filename} => {candidates[0]} (escolhido entre {len(paths)} arquivos)")
    
    def create_redirects(self):
        """Cria redirecionamentos para as versões canônicas."""
        print("Criando redirecionamentos...")
        
        for filename, paths in self.duplicated_components.items():
            canonical_path = self.canonical_components[filename]
            
            for path in paths:
                if path != canonical_path:
                    self._create_redirect(path, canonical_path)
    
    def _create_redirect(self, redirect_path, canonical_path):
        """Cria um arquivo de redirecionamento que aponta para o componente canônico."""
        # Calcular caminho relativo para importação
        redirect_dir = Path(redirect_path).parent
        canonical_dir = Path(canonical_path).parent
        
        # Calcular caminho relativo para usar no import
        try:
            import_path = os.path.relpath(
                self.root_dir / canonical_path, 
                self.root_dir / redirect_dir
            )
            
            # Garantir formato correto para importação
            if not import_path.startswith('.'):
                import_path = './' + import_path
                
            # Remover extensão
            import_path = re.sub(r'\.(jsx|tsx|js|ts)$', '', import_path)
        except ValueError:
            # Se houver problemas com o caminho relativo, usar caminho absoluto
            import_path = '/' + canonical_path.replace('\\', '/')
            import_path = re.sub(r'\.(jsx|tsx|js|ts)$', '', import_path)
        
        # Decidir qual redirecionamento criar com base na extensão
        is_typescript = redirect_path.endswith('.ts') or redirect_path.endswith('.tsx')
        
        if is_typescript:
            redirect_content = f"""// Arquivo de redirecionamento automático
// Este componente foi consolidado como parte do processo de redução de duplicações
// Versão canônica: {canonical_path}

export * from "{import_path}";
export {{ default }} from "{import_path}";
"""
        else:
            redirect_content = f"""// Arquivo de redirecionamento automático
// Este componente foi consolidado como parte do processo de redução de duplicações
// Versão canônica: {canonical_path}

export * from "{import_path}";
export { default } from "{import_path}";
"""
        
        # Fazer backup e salvar
        self._backup_file(redirect_path)
        self._save_file(redirect_path, redirect_content)
        
        self.changes_made.append({
            'file': redirect_path,
            'change': f"Criado redirecionamento para {canonical_path}"
        })
    
    def run(self):
        """Executa todo o processo de deduplimação."""
        print(f"Iniciando processo de deduplimação (modo {'simulação' if self.dry_run else 'aplicação'})...")
        
        # Criar diretório de backup
        if not self.dry_run:
            os.makedirs(BACKUP_DIR, exist_ok=True)
        
        # Encontrar duplicatas
        self.find_duplicates()
        
        # Escolher versões canônicas
        self.choose_canonical_components()
        
        # Criar redirecionamentos
        self.create_redirects()
        
        # Gerar relatório
        self._generate_report()
        
        print(f"Processo concluído. {len(self.changes_made)} redirecionamentos {'simulados' if self.dry_run else 'criados'}.")
        if not self.dry_run:
            print("Relatório salvo em component_deduplication_report.json e component_deduplication_report.txt")
    
    def _generate_report(self):
        """Gera um relatório das mudanças feitas ou simuladas."""
        report = {
            'summary': {
                'component_files': len(self.component_files),
                'duplicated_components': len(self.duplicated_components),
                'redirects_created': len(self.changes_made),
                'dry_run': self.dry_run
            },
            'canonical_components': self.canonical_components,
            'changes': self.changes_made,
            'duplicated_components': {k: v for k, v in self.duplicated_components.items()}
        }
        
        # Salvar o relatório
        if not self.dry_run:
            # Formato JSON
            with open('component_deduplication_report.json', 'w', encoding='utf-8') as f:
                json.dump(report, f, indent=2)
            
            # Formato texto
            with open('component_deduplication_report.txt', 'w', encoding='utf-8') as f:
                f.write("=== RELATÓRIO DE DEDUPLIMAÇÃO DE COMPONENTES ===\n\n")
                
                f.write("== RESUMO ==\n")
                f.write(f"Componentes React encontrados: {report['summary']['component_files']}\n")
                f.write(f"Componentes duplicados: {report['summary']['duplicated_components']}\n")
                f.write(f"Redirecionamentos criados: {report['summary']['redirects_created']}\n\n")
                
                f.write("== COMPONENTES CANÔNICOS ==\n")
                for filename, path in self.canonical_components.items():
                    f.write(f"  {filename} => {path}\n")
                f.write("\n")
                
                f.write("== COMPONENTES DUPLICADOS ==\n")
                for filename, paths in self.duplicated_components.items():
                    f.write(f"  {filename}:\n")
                    for path in paths:
                        if path == self.canonical_components[filename]:
                            f.write(f"    - {path} (CANÔNICO)\n")
                        else:
                            f.write(f"    - {path}\n")
                    f.write("\n")
                
                f.write("== REDIRECIONAMENTOS CRIADOS ==\n")
                for change in self.changes_made:
                    f.write(f"  {change['file']} => {change['change']}\n")
                
                f.write("\n=== FIM DO RELATÓRIO ===\n")
        
        return report

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Deduplimação de componentes React do projeto Agenda Livre')
    parser.add_argument('--dry-run', action='store_true', help='Apenas mostrar mudanças sem aplicá-las')
    
    args = parser.parse_args()
    
    deduplicator = ComponentDeduplicator(PROJECT_ROOT, dry_run=args.dry_run)
    deduplicator.scan_directory()
    deduplicator.run()

if __name__ == "__main__":
    main()