import os
import re
from pathlib import Path
from datetime import datetime

ROOT_DIR = Path(".").resolve()

def listar_auth_contexts(root_dir):
    return [
        f for f in root_dir.rglob("*AuthContext*.js")
        if "node_modules" not in str(f) and "dist" not in str(f)
    ] + [
        f for f in root_dir.rglob("*AuthContext*.tsx")
        if "node_modules" not in str(f) and "dist" not in str(f)
    ]

def authcontext_mais_recente(files):
    def extrair_timestamp(arquivo):
        match = re.search(r'_(\d{14})', arquivo.name)
        if match:
            return datetime.strptime(match.group(1), "%Y%m%d%H%M%S")
        return datetime.fromtimestamp(arquivo.stat().st_mtime)
    
    return max(files, key=extrair_timestamp)

def corrigir_importacoes_useauth(authcontext_path, root_dir):
    for file in root_dir.rglob("*.[jt]s*"):
        if file.name.startswith("AuthContext"):
            continue
        if not file.suffix in ['.js', '.jsx', '.ts', '.tsx']:
            continue
        try:
            content = file.read_text(encoding="utf-8")
        except:
            continue
        if "useAuth" not in content:
            continue

        # Construir caminho relativo novo
        novo_caminho = os.path.relpath(authcontext_path, file.parent).replace(os.sep, '/')
        if not novo_caminho.startswith('.'):
            novo_caminho = './' + novo_caminho

        # Corrigir import
        novo_conteudo = re.sub(
            r'(import\s+[^;]*?{\s*[^}]*?useAuth[^}]*?}\s+from\s+[\'"]).+?([\'"])',
            r'\1' + novo_caminho + r'\2',
            content
        )

        if novo_conteudo != content:
            file.with_suffix(file.suffix + ".bak").write_text(content, encoding="utf-8")
            file.write_text(novo_conteudo, encoding="utf-8")
            print(f"Corrigido: {file} -> {novo_caminho}")
        else:
            print(f"Sem alterações: {file}")

def main():
    print("Buscando arquivos AuthContext...")
    auth_files = listar_auth_contexts(ROOT_DIR)
    if not auth_files:
        print("Nenhum arquivo AuthContext encontrado.")
        return

    print(f"Total encontrados: {len(auth_files)}")
    mais_recente = authcontext_mais_recente(auth_files)
    print(f"AuthContext mais recente: {mais_recente}")

    corrigir_importacoes_useauth(mais_recente, ROOT_DIR)

if __name__ == "__main__":
    main()
