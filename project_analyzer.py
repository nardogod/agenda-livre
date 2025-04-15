#!/usr/bin/env python3
"""
Script para analisar a estrutura do projeto Agenda Livre.
Este script vai:
1. Mapear todos os arquivos e suas dependências
2. Identificar duplicações
3. Analisar problemas de importação
4. Gerar um relatório detalhado
"""

import os
import re
import json
from collections import defaultdict
from pathlib import Path

# Configurações
PROJECT_ROOT = '.'  # Diretório atual
IGNORE_DIRS = ['.git', '.next', 'node_modules', 'coverage', '.history', 'backups', 'backup_20250414_181421', 'broken_state_20250414_183530',]
SUPPORTED_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss']

# Padrões de regex para encontrar importações
IMPORT_PATTERNS = [
    r'import\s+.*?from\s+[\'"](.+?)[\'"]',  # import X from 'path'
    r'require\([\'"](.+?)[\'"]\)',          # require('path')
    r'import\([\'"](.+?)[\'"]\)',           # import('path')
]

class ProjectAnalyzer:
    def __init__(self, root_dir):
        self.root_dir = Path(root_dir)
        self.files = []
        self.imports = {}
        self.duplications = []
        self.file_contents = {}
        self.import_errors = []
        self.files_by_name = defaultdict(list)
        self.component_files = []  # Arquivos que são componentes React
        
    def scan_directory(self):
        """Escaneia o diretório do projeto recursivamente."""
        print(f"Escaneando diretório: {self.root_dir}")
        
        for root, dirs, files in os.walk(self.root_dir):
            # Ignorar diretórios específicos
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
            
            for file in files:
                file_path = Path(root) / file
                rel_path = file_path.relative_to(self.root_dir)
                
                # Verificar se a extensão é suportada
                if file_path.suffix in SUPPORTED_EXTENSIONS:
                    self.files.append(str(rel_path))
                    
                    # Armazenar arquivos por nome para detectar duplicações
                    self.files_by_name[file].append(str(rel_path))
                    
                    # Identificar componentes React
                    if self._is_react_component(file_path):
                        self.component_files.append(str(rel_path))
        
        print(f"Total de arquivos encontrados: {len(self.files)}")
    
    def _is_react_component(self, file_path):
        """Verifica se o arquivo é um componente React."""
        suffixes = ['.jsx', '.tsx']
        if file_path.suffix in suffixes:
            return True
        
        # Também verificar arquivos .js e .ts que podem ser componentes
        if file_path.suffix in ['.js', '.ts']:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    # Verificar padrões comuns de componentes React
                    if re.search(r'(import React|from [\'"]react[\'"](;|,))', content) and \
                       (re.search(r'function\s+\w+\s*\(', content) or \
                        re.search(r'const\s+\w+\s*=\s*\(', content) or \
                        re.search(r'class\s+\w+\s+extends\s+React\.Component', content)):
                        return True
            except Exception as e:
                print(f"Erro ao ler arquivo {file_path}: {e}")
        
        return False
                    
    def analyze_imports(self):
        """Analisa as importações em cada arquivo."""
        print("Analisando importações...")
        
        for file_path in self.files:
            full_path = self.root_dir / file_path
            try:
                with open(full_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    self.file_contents[file_path] = content
                    
                    # Encontrar todas as importações
                    imports = []
                    for pattern in IMPORT_PATTERNS:
                        imports.extend(re.findall(pattern, content))
                    
                    # Armazenar importações
                    self.imports[file_path] = imports
                    
                    # Verificar importações com problemas
                    self._check_import_errors(file_path, imports)
                    
            except Exception as e:
                print(f"Erro ao analisar arquivo {file_path}: {e}")
    
    def _check_import_errors(self, file_path, imports):
        """Verifica possíveis erros nas importações."""
        for imp in imports:
            # Ignorar importações de pacotes (não começam com .)
            if not imp.startswith('.'):
                continue
                
            # Calcular o caminho completo da importação
            current_dir = Path(file_path).parent
            import_path = self._resolve_import_path(current_dir, imp)
            
            # Verificar se o arquivo importado existe
            if not self._import_file_exists(import_path):
                self.import_errors.append({
                    'file': file_path,
                    'import': imp,
                    'resolved_path': str(import_path) if import_path else None,
                    'error': 'Arquivo não encontrado'
                })
    
    def _resolve_import_path(self, current_dir, import_path):
        """Resolve o caminho completo de uma importação."""
        # Remover extensão da importação, se houver
        import_path = re.sub(r'\.(js|jsx|ts|tsx)$', '', import_path)
        
        # Caminho relativo
        if import_path.startswith('./') or import_path.startswith('../'):
            resolved = (current_dir / import_path).resolve().relative_to(self.root_dir)
            return resolved
        
        # Importações absolutas (podem ser baseadas em aliases configurados no projeto)
        return None
    
    def _import_file_exists(self, import_path):
        """Verifica se o arquivo importado existe."""
        if import_path is None:
            return True  # Não podemos verificar importações absolutas sem conhecer os aliases
        
        # Verificar diferentes extensões possíveis
        for ext in ['.js', '.jsx', '.ts', '.tsx']:
            potential_file = str(import_path) + ext
            if potential_file in self.files:
                return True
            
            # Verificar se existe como index
            potential_index = str(import_path) + '/index' + ext
            if potential_index in self.files:
                return True
        
        return False
            
    def find_duplications(self):
        """Encontra arquivos duplicados (mesmo nome em locais diferentes)."""
        print("Procurando duplicações...")
        
        for filename, paths in self.files_by_name.items():
            if len(paths) > 1:
                # Ignorar arquivos comuns como index.js que podem aparecer em múltiplos diretórios
                if filename not in ['index.js', 'index.ts', 'index.tsx']:
                    self.duplications.append({
                        'filename': filename,
                        'paths': paths
                    })
        
        print(f"Encontradas {len(self.duplications)} duplicações")
    
    def analyze_typescript_errors(self):
        """Analisa possíveis erros de TypeScript nos arquivos."""
        print("Analisando potenciais erros de TypeScript...")
        
        typescript_errors = []
        
        for file_path, content in self.file_contents.items():
            if file_path.endswith('.ts') or file_path.endswith('.tsx'):
                # Procurar por funções/componentes sem tipagem
                untypedParams = re.findall(r'function\s+\w+\s*\(([^:)]+)\)', content)
                untypedParams.extend(re.findall(r'const\s+\w+\s*=\s*\(([^:)]+)\)', content))
                
                if untypedParams:
                    typescript_errors.append({
                        'file': file_path,
                        'error': 'Parâmetros sem tipagem',
                        'details': untypedParams
                    })
                
                # Procurar por uso de 'any'
                any_usage = re.findall(r':\s*any', content)
                if any_usage:
                    typescript_errors.append({
                        'file': file_path,
                        'error': 'Uso explícito de any',
                        'count': len(any_usage)
                    })
        
        return typescript_errors
    
    def analyze_structure(self):
        """Analisa a estrutura geral do projeto."""
        structure = {
            'directories': defaultdict(int),
            'file_extensions': defaultdict(int),
            'react_components': {
                'total': len(self.component_files),
                'locations': defaultdict(int)
            }
        }
        
        # Contagem de arquivos por diretório
        for file_path in self.files:
            dir_name = str(Path(file_path).parent)
            structure['directories'][dir_name] += 1
            
            # Contagem por extensão
            ext = Path(file_path).suffix
            structure['file_extensions'][ext] += 1
        
        # Analisar localizações de componentes React
        for comp_path in self.component_files:
            dir_name = str(Path(comp_path).parent)
            structure['react_components']['locations'][dir_name] += 1
        
        return structure
        
    def generate_report(self):
        """Gera um relatório completo da análise."""
        print("Gerando relatório...")
        
        typescript_errors = self.analyze_typescript_errors()
        structure = self.analyze_structure()
        
        report = {
            'summary': {
                'total_files': len(self.files),
                'react_components': len(self.component_files),
                'duplications': len(self.duplications),
                'import_errors': len(self.import_errors),
                'typescript_error_files': len(typescript_errors)
            },
            'structure': structure,
            'duplications': self.duplications,
            'import_errors': self.import_errors,
            'typescript_errors': typescript_errors,
            'files_by_directory': structure['directories'],
            'file_extensions': structure['file_extensions']
        }
        
        # Salvar o relatório em JSON
        with open('project_analysis_report.json', 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2)
        
        # Gerar relatório em formato de texto
        self._generate_text_report(report)
        
        print("Relatório gerado: project_analysis_report.json e project_analysis_report.txt")
        return report
    
    def _generate_text_report(self, report):
        """Gera uma versão em texto do relatório."""
        with open('project_analysis_report.txt', 'w', encoding='utf-8') as f:
            f.write("=== RELATÓRIO DE ANÁLISE DO PROJETO ===\n\n")
            
            # Resumo
            f.write("== RESUMO ==\n")
            f.write(f"Total de arquivos: {report['summary']['total_files']}\n")
            f.write(f"Componentes React: {report['summary']['react_components']}\n")
            f.write(f"Duplicações: {report['summary']['duplications']}\n")
            f.write(f"Erros de importação: {report['summary']['import_errors']}\n")
            f.write(f"Arquivos com potenciais erros TypeScript: {report['summary']['typescript_error_files']}\n\n")
            
            # Estrutura
            f.write("== ESTRUTURA DO PROJETO ==\n")
            f.write("Top 10 diretórios por número de arquivos:\n")
            sorted_dirs = sorted(report['files_by_directory'].items(), key=lambda x: x[1], reverse=True)
            for dir_name, count in sorted_dirs[:10]:
                f.write(f"  {dir_name}: {count} arquivos\n")
            f.write("\n")
            
            # Extensões
            f.write("Arquivos por extensão:\n")
            for ext, count in report['file_extensions'].items():
                f.write(f"  {ext}: {count}\n")
            f.write("\n")
            
            # Componentes React
            f.write("== COMPONENTES REACT ==\n")
            f.write("Localizações de componentes React:\n")
            sorted_comp_locs = sorted(report['structure']['react_components']['locations'].items(), 
                                     key=lambda x: x[1], reverse=True)
            for dir_name, count in sorted_comp_locs:
                f.write(f"  {dir_name}: {count} componentes\n")
            f.write("\n")
            
            # Duplicações
            f.write("== DUPLICAÇÕES ==\n")
            for dup in report['duplications']:
                f.write(f"Arquivo: {dup['filename']}\n")
                f.write("  Encontrado em:\n")
                for path in dup['paths']:
                    f.write(f"    - {path}\n")
            f.write("\n")
            
            # Erros de importação
            f.write("== ERROS DE IMPORTAÇÃO ==\n")
            for err in report['import_errors']:
                f.write(f"Arquivo: {err['file']}\n")
                f.write(f"  Importação: {err['import']}\n")
                f.write(f"  Erro: {err['error']}\n")
            f.write("\n")
            
            # Erros TypeScript
            f.write("== POTENCIAIS ERROS TYPESCRIPT ==\n")
            for err in report['typescript_errors']:
                f.write(f"Arquivo: {err['file']}\n")
                f.write(f"  Erro: {err['error']}\n")
                if 'details' in err:
                    f.write(f"  Detalhes: {err['details']}\n")
                if 'count' in err:
                    f.write(f"  Ocorrências: {err['count']}\n")
            
            f.write("\n=== FIM DO RELATÓRIO ===\n")

def main():
    analyzer = ProjectAnalyzer(PROJECT_ROOT)
    analyzer.scan_directory()
    analyzer.analyze_imports()
    analyzer.find_duplications()
    report = analyzer.generate_report()
    
    print("\nResumo da análise:")
    print(f"Total de arquivos: {report['summary']['total_files']}")
    print(f"Componentes React: {report['summary']['react_components']}")
    print(f"Duplicações encontradas: {report['summary']['duplications']}")
    print(f"Erros de importação: {report['summary']['import_errors']}")
    print(f"Arquivos com potenciais erros TypeScript: {report['summary']['typescript_error_files']}")
    print("\nRelatório completo salvo em project_analysis_report.json e project_analysis_report.txt")

if __name__ == "__main__":
    main()