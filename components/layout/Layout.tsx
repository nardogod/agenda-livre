// src/components/layout/MainLayout.tsx
import React from 'react';
import { Home, Calendar, User, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const router = useRouter();
  
  // Verifica qual rota está ativa
  const isActive = (path: string) => {
    return router.pathname === path;
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Conteúdo principal */}
      <main className="max-w-4xl mx-auto">{children}</main>
      
      {/* Navegação inferior */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3">
        <Link href="/" passHref>
          <span className={`flex flex-col items-center w-16 ${
            isActive('/') ? 'text-purple-600' : 'text-gray-400'
          }`}>
            <Home size={24} />
            <span className="text-xs mt-1">Início</span>
          </span>
        </Link>
        
        <Link href="/search" passHref>
          <span className={`flex flex-col items-center w-16 ${
            isActive('/search') ? 'text-purple-600' : 'text-gray-400'
          }`}>
            <Search size={24} />
            <span className="text-xs mt-1">Buscar</span>
          </span>
        </Link>
        
        <Link href="/appointments" passHref>
          <span className={`flex flex-col items-center w-16 ${
            isActive('/appointments') ? 'text-purple-600' : 'text-gray-400'
          }`}>
            <Calendar size={24} />
            <span className="text-xs mt-1">Agenda</span>
          </span>
        </Link>
        
        <Link href="/profile" passHref>
          <span className={`flex flex-col items-center w-16 ${
            isActive('/profile') ? 'text-purple-600' : 'text-gray-400'
          }`}>
            <User size={24} />
            <span className="text-xs mt-1">Perfil</span>
          </span>
        </Link>
      </div>
    </div>
  );
};

export default MainLayout;