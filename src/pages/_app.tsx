import "../styles/globals.css";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import MainLayout from "../components/layout/MainLayout";
import { ToastProvider } from "../components/common/Toast";

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 5 * 60 * 1000,
      },
    },
  }));

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

export default MyApp;
