module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          50: '#EDE9FE',
          100: '#DDD6FE',
          200: '#C4B5FD',
          300: '#A78BFA',
          400: '#8B5CF6',
          500: '#7C3AED',
          600: '#7C3AED',  // Roxo Primário
          700: '#6D28D9',  // Roxo Escuro
          800: '#5B21B6',
          900: '#4C1D95',
        },
        gray: {
          50: '#F9FAFB',   // Cinza Fundo
          100: '#F3F4F6',  // Cinza Claro
          200: '#E5E7EB',  // Cinza Médio
          300: '#D1D5DB',
          400: '#9CA3AF',  // Cinza Texto Claro
          500: '#6B7280',  // Cinza Texto
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',  // Preto Texto
          900: '#111827',
        },
      },
      borderRadius: {
        'xl': '12px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['14px', { lineHeight: '20px' }],
        'base': ['16px', { lineHeight: '24px' }],
        'lg': ['18px', { lineHeight: '28px' }],
        'xl': ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}