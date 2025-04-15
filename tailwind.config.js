/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores primárias
        primary: {
          DEFAULT: '#8B5CF6', // Roxo Primário
          dark: '#7C3AED',    // Roxo Escuro
          light: '#EDE9FE',   // Roxo Claro
        },
        // Cores neutras
        'gray': {
          50: '#F9FAFB',      // Cinza Fundo
          100: '#F3F4F6',     // Cinza Claro
          200: '#E5E7EB',     // Cinza Médio
          300: '#D1D5DB',
          400: '#9CA3AF',     // Cinza Texto Claro
          500: '#6B7280',     // Cinza Texto
          800: '#1F2937',     // Preto Texto
        },
        // Cores de estados
        success: {
          DEFAULT: '#10B981', // Verde
          light: '#ECFDF5',
        },
        warning: {
          DEFAULT: '#F59E0B', // Âmbar
          light: '#FFFBEB',
        },
        error: {
          DEFAULT: '#EF4444', // Vermelho
          light: '#FEF2F2',
        },
        info: {
          DEFAULT: '#3B82F6', // Azul
          light: '#EFF6FF',
        },
      },
      borderRadius: {
        'xl': '12px',
      },
      fontFamily: {
        sans: [
          'Inter',
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}