import os
import re
from pathlib import Path

ROOT_DIR = Path(".").resolve()

def ignorar_caminho(path: Path):
    return any(p in path.parts for p in ['node_modules', 'dist', 'backups', '.history'])

def corrigir_imports_de_backup(root_dir):
    for file in root_dir.rglob("*.[jt]s*"):
        if ignorar_caminho(file):
            continue
        if not file.suffix in ['.js', '.jsx', '.ts', '.tsx']:
            continue

        try:
            content = file.read_text(encoding="utf-8")
        except:
            continue

        if "backups" not in content:
            continue

        linhas = content.splitlines()
        alterado = False

        for i, linha in enumerate(linhas):
            if "backups" in linha and re.search(r'from\s+[\'"]', linha):
                print(f"\n🔧 Corrigindo import no arquivo: {file}")
                print(f"⛔ Linha antiga: {linha.strip()}")

                # Remove tudo até o caminho consolidado, mantendo só o nome base
                novo = re.sub(r'\.\.[\\/]*backups(?:[\\/][^\'"]+)*[\'"]', "'../src", linha)
                novo = novo.replace('\\', '/')
                linhas[i] = novo
                print(f"✅ Linha nova: {linhas[i].strip()}")
                alterado = True

        if alterado:
            file.with_suffix(file.suffix + ".bak").write_text(content, encoding="utf-8")
            file.write_text('\n'.join(linhas), encoding="utf-8")
            print(f"✅ Arquivo corrigido: {file}")

def main():
    print("🔍 Procurando imports com backups em arquivos ativos...")
    corrigir_imports_de_backup(ROOT_DIR)
    print("✔️ Finalizado!")

if __name__ == "__main__":
    main()
