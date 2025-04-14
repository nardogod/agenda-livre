#!/bin/bash

# Script para corrigir a estrutura do projeto Agenda Livre
# Este script:
# 1. Move os componentes da raiz para dentro da estrutura src/
# 2. Padroniza as extensões (.jsx → .tsx)
# 3. Faz backup dos arquivos originais antes de modificá-los

echo "Iniciando correção da estrutura do projeto Agenda Livre..."

# Criando diretório de backup
BACKUP_DIR="./backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "Backups serão salvos em: $BACKUP_DIR"

# Função para mover arquivos com segurança
safe_move() {
  local source="$1"
  local dest="$2"
  
  # Verificar se o arquivo fonte existe
  if [ ! -f "$source" ]; then
    echo "AVISO: Arquivo fonte não existe: $source"
    return 1
  fi
  
  # Criar diretório de destino se não existir
  mkdir -p "$(dirname "$dest")"
  
  # Verificar se o arquivo de destino já existe
  if [ -f "$dest" ]; then
    # Comparar os arquivos
    if cmp -s "$source" "$dest"; then
      echo "Arquivo identico já existe em: $dest"
      return 0
    else
      # Backup do arquivo de destino se for diferente
      local backup_path="$BACKUP_DIR/$(dirname "$dest" | sed 's/^\.\///')"
      mkdir -p "$backup_path"
      cp "$dest" "$backup_path/$(basename "$dest").bak"
      echo "Backup criado para arquivo diferente: $dest → $backup_path/$(basename "$dest").bak"
    fi
  fi
  
  # Copiar arquivo para o destino
  cp "$source" "$dest"
  echo "Arquivo movido: $source → $dest"
  
  return 0
}

# Função para renomear .jsx para .tsx
convert_to_tsx() {
  local file="$1"
  
  if [[ "$file" == *.jsx ]]; then
    local new_file="${file%.jsx}.tsx"
    if [ ! -f "$new_file" ]; then
      cp "$file" "$new_file"
      echo "Convertido para TypeScript: $file → $new_file"
    else
      echo "Arquivo TypeScript já existe: $new_file"
    fi
  fi
}

# Mover componentes da raiz para dentro de src
echo "Movendo componentes da raiz para src/..."

# Mover componentes comuns
if [ -d "./components/common" ]; then
  for file in ./components/common/*.{jsx,js}; do
    if [ -f "$file" ]; then
      filename=$(basename "$file")
      src_path="./src/components/ui/${filename}"
      # Para MainButton, mover para src/components/ui/buttons/
      if [[ "$filename" == *"Button"* ]]; then
        src_path="./src/components/ui/buttons/${filename}"
      fi
      safe_move "$file" "$src_path"
      convert_to_tsx "$src_path"
    fi
  done
fi

# Mover componentes de layout
if [ -d "./components/layout" ]; then
  for file in ./components/layout/*.{jsx,js}; do
    if [ -f "$file" ]; then
      filename=$(basename "$file")
      src_path="./src/components/layout/${filename}"
      safe_move "$file" "$src_path"
      convert_to_tsx "$src_path"
    fi
  done
fi

# Mover componentes de profissional
if [ -d "./components/professional" ]; then
  for file in ./components/professional/*.{jsx,js}; do
    if [ -f "$file" ]; then
      filename=$(basename "$file")
      src_path="./src/components/professionals/${filename}"
      safe_move "$file" "$src_path"
      convert_to_tsx "$src_path"
    fi
  done
fi

# Mover componentes de booking
if [ -d "./components/booking" ]; then
  for file in ./components/booking/*.{jsx,js}; do
    if [ -f "$file" ]; then
      filename=$(basename "$file")
      src_path="./src/components/booking/${filename}"
      safe_move "$file" "$src_path"
      convert_to_tsx "$src_path"
    fi
  done
fi

# Mover serviços
if [ -d "./services" ]; then
  for file in ./services/*.{js,ts}; do
    if [ -f "$file" ]; then
      filename=$(basename "$file")
      # Converter extensão .js para .ts se necessário
      if [[ "$filename" == *.js ]]; then
        dst_filename="${filename%.js}.ts"
      else
        dst_filename="$filename"
      fi
      src_path="./src/services/${dst_filename}"
      safe_move "$file" "$src_path"
    fi
  done
fi

# Mover páginas
if [ -d "./pages" ] && [ -d "./src/pages" ]; then
  for file in ./pages/*.{jsx,js}; do
    if [ -f "$file" ]; then
      filename=$(basename "$file")
      # Converter extensão .js/.jsx para .tsx se necessário
      if [[ "$filename" == *.js ]]; then
        dst_filename="${filename%.js}.tsx"
      elif [[ "$filename" == *.jsx ]]; then
        dst_filename="${filename%.jsx}.tsx"
      else
        dst_filename="$filename"
      fi
      src_path="./src/pages/${dst_filename}"
      safe_move "$file" "$src_path"
    fi
  done
fi

# Mover estilos
if [ -d "./styles" ] && [ -d "./src/styles" ]; then
  for file in ./styles/*.css; do
    if [ -f "$file" ]; then
      filename=$(basename "$file")
      src_path="./src/styles/${filename}"
      safe_move "$file" "$src_path"
    fi
  done
fi

# Verificar e ajustar imports em todos os arquivos movidos
echo "Ajustando caminhos de importação..."

# Função para ajustar os caminhos de importação em um arquivo
adjust_imports() {
  local file="$1"
  
  # Verificar se o arquivo existe
  if [ ! -f "$file" ]; then
    return 1
  fi
  
  # Backup do arquivo original
  local backup_path="$BACKUP_DIR/$(dirname "$file" | sed 's/^\.\///')"
  mkdir -p "$backup_path"
  cp "$file" "$backup_path/$(basename "$file").bak"
  
  # Ajustar imports relativos que precisam ser atualizados
  sed -i.tmp \
    -e "s|from '../../../components/|from '../../components/|g" \
    -e "s|from '../../components/|from '../components/|g" \
    -e "s|from '../components/common/|from '../components/ui/|g" \
    -e "s|from '../components/professional/|from '../components/professionals/|g" \
    -e "s|from '../../services/|from '../services/|g" \
    -e "s|from '../../../services/|from '../../services/|g" \
    "$file"
  
  # Remover arquivo temporário
  rm "${file}.tmp"
  
  echo "Imports ajustados: $file"
}

# Procurar todos os arquivos TypeScript/JavaScript e ajustar imports
find ./src -type f -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" | while read file; do
  adjust_imports "$file"
done

echo "Correção da estrutura concluída!"
echo "Agora você pode:
1. Testar o projeto para garantir que tudo funciona
2. Após confirmar, remover diretórios duplicados com: 
   rm -rf ./components ./services ./pages ./styles (FAÇA ISSO APENAS DEPOIS DE TESTAR!)
3. Atualizar o tsconfig.json para usar baseUrl: './src' se necessário"