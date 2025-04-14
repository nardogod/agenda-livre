#!/bin/bash

# Script para criar a estrutura de pastas e arquivos do projeto Agenda Livre
# Este script verifica se os arquivos já existem antes de criá-los

echo "Criando estrutura de pastas e arquivos para o projeto Agenda Livre..."

# Função para criar diretório se não existir
create_dir() {
  if [ ! -d "$1" ]; then
    mkdir -p "$1"
    echo "Diretório criado: $1"
  else
    echo "Diretório já existe: $1"
  fi
}

# Função para criar arquivo se não existir
create_file() {
  if [ ! -f "$1" ]; then
    touch "$1"
    echo "Arquivo criado: $1"
  else
    echo "Arquivo já existe: $1"
  fi
}

# Função para criar arquivo com conteúdo se não existir
create_file_with_content() {
  if [ ! -f "$1" ]; then
    echo "$2" > "$1"
    echo "Arquivo criado com conteúdo: $1"
  else
    echo "Arquivo já existe: $1"
  fi
}

# Criar estrutura de diretórios
create_dir "pages"
create_dir "components/common"
create_dir "components/layout"
create_dir "components/professional"
create_dir "components/booking"
create_dir "services"
create_dir "styles"
create_dir "public/assets/icons"
create_dir "public/assets/images"
create_dir "public/assets/placeholders"

# Criar arquivos de páginas
create_file "pages/_app.js"
create_file "pages/index.jsx"
create_file "pages/professional/[id].jsx"
create_file "pages/booking/[id].jsx"

# Criar arquivos de componentes comuns
create_file "components/common/MainButton.jsx"
create_file "components/common/Toast.jsx"

# Criar arquivos de componentes de layout
create_file "components/layout/MainLayout.jsx"

# Criar arquivos de componentes de profissional
create_file "components/professional/ProfessionalService.jsx"
create_file "components/professional/ReviewCard.jsx"

# Criar arquivos de componentes de agendamento
create_file "components/booking/ServiceCard.jsx"
create_file "components/booking/TimeSlot.jsx"
create_file "components/booking/ToggleOption.jsx"
create_file "components/booking/RadioOption.jsx"
create_file "components/booking/PaymentMethod.jsx"

# Criar arquivos de serviços
create_file "services/api.js"

# Criar arquivos de estilos
create_file "styles/globals.css"

# Adicionar conteúdo básico ao _app.js
create_file_with_content "pages/_app.js" "// pages/_app.js
import '../styles/globals.css';
import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import MainLayout from '../components/layout/MainLayout';
import { ToastProvider } from '../components/common/Toast';

function MyApp({ Component, pageProps }) {
  // Criar cliente do React Query
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutos
      },
    },
  }));

  // Verificar se o componente define seu próprio layout
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <MainLayout>
          {getLayout(<Component {...pageProps} />)}
        </MainLayout>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default MyApp;"

# Adicionar conteúdo básico ao package.json se não existir
if [ ! -f "package.json" ]; then
  echo '{
  "name": "agenda-livre",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^12.3.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.1.3",
    "lucide-react": "^0.100.0",
    "react-hook-form": "^7.37.0",
    "yup": "^0.32.11",
    "@hookform/resolvers": "^2.9.10",
    "react-query": "^3.39.2"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.12",
    "postcss": "^8.4.18",
    "tailwindcss": "^3.2.1",
    "eslint": "^8.25.0",
    "eslint-config-next": "^12.3.1"
  }
}' > package.json
  echo "package.json criado"
else
  echo "package.json já existe"
fi

# Adicionar conteúdo básico ao tailwind.config.js
if [ ! -f "tailwind.config.js" ]; then
  echo 'module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "purple-600": "#8B5CF6",
        "purple-700": "#7C3AED",
        "purple-100": "#EDE9FE",
        "purple-50": "#F5F3FF",
        "gray-50": "#F9FAFB",
        "gray-100": "#F3F4F6",
        "gray-200": "#E5E7EB",
        "gray-400": "#9CA3AF",
        "gray-500": "#6B7280",
        "gray-700": "#374151",
        "gray-800": "#1F2937",
        "green-500": "#10B981",
        "green-50": "#ECFDF5",
        "amber-500": "#F59E0B",
        "amber-50": "#FFFBEB",
        "red-500": "#EF4444",
        "red-50": "#FEF2F2",
        "blue-500": "#3B82F6",
        "blue-50": "#EFF6FF",
      },
      borderRadius: {
        "xl": "12px",
      }
    },
  },
  plugins: [],
}' > tailwind.config.js
  echo "tailwind.config.js criado"
else
  echo "tailwind.config.js já existe"
fi

# Adicionar conteúdo básico ao postcss.config.js
if [ ! -f "postcss.config.js" ]; then
  echo 'module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}' > postcss.config.js
  echo "postcss.config.js criado"
else
  echo "postcss.config.js já existe"
fi

# Adicionar conteúdo básico ao globals.css
if [ ! -f "styles/globals.css" ]; then
  echo '@tailwind base;
@tailwind components;
@tailwind utilities;

html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
    Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
}

* {
  box-sizing: border-box;
}' > styles/globals.css
  echo "styles/globals.css criado"
else
  echo "styles/globals.css já existe"
fi

# Criar arquivo next.config.js se não existir
if [ ! -f "next.config.js" ]; then
  echo 'module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["localhost"],
  },
}' > next.config.js
  echo "next.config.js criado"
else
  echo "next.config.js já existe"
fi

echo "Estrutura criada com sucesso!"
echo "Para instalar as dependências, execute: npm install"
echo "Para iniciar o servidor de desenvolvimento, execute: npm run dev"