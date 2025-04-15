// src/pages/_app.tsx

import { ReactNode, useState } from 'react';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Toaster } from 'react-hot-toast';

import '../styles/globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import { NotificationProvider } from '../contexts/NotificationContext';

interface AppProps {
  Component: React.ComponentType & {
    getLayout?: (page: ReactNode) => ReactNode;
  };
  pageProps: any;
}

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutos
      },
    },
  }));

  // Use o layout personalizado do componente, se disponível
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <Head>
        <title>Agenda Livre | Agendamento para profissionais de beleza</title>
        <meta name="description" content="Plataforma de agendamento online para profissionais de beleza" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationProvider>
            {getLayout(<Component {...pageProps} />)}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#FFFFFF',
                  color: '#1F2937',
                  borderRadius: '0.75rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                  padding: '0.75rem 1rem',
                },
                success: {
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#ECFDF5',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#FEF2F2',
                  },
                },
              }}
            />
          </NotificationProvider>
        </AuthProvider>
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
      </QueryClientProvider>
    </>
  );
}