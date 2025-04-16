// pages/_app.js
import '../styles/globals.css';
import { BookingProvider } from '../src/contexts/BookingContext';
import { AuthProvider } from '../src/contexts/AuthContext';
import { ToastProvider } from '../contexts/ToastContext';

function MyApp({ Component, pageProps }) {
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