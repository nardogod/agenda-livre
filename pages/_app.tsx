import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { BookingProvider } from '../contexts/BookingContext';
import { AuthProvider } from '../contexts/AuthContext';
import { ToastProvider } from '../contexts/ToastContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <BookingProvider>
        <ToastProvider>
          <Component {...pageProps} />
        </ToastProvider>
      </BookingProvider>
    </AuthProvider>
  );
}

export default MyApp;