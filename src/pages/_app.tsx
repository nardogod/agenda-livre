// src/pages/_app.tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { BookingProvider } from '../contexts/BookingContext';
import { AuthProvider } from '../contexts/AuthContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <BookingProvider>
        <Component {...pageProps} />
      </BookingProvider>
    </AuthProvider>
  );
}

export default MyApp;