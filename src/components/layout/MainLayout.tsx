// src/components/layout/MainLayout.tsx
import React from 'react';
import Link from 'next/link';
import { Home, User, Calendar, Search } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

const Header = () => {
  return (
    <header className="bg-purple-600 text-white py-4 px-5">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Agenda Livre
        </Link>
        <nav className="flex space-x-4">
          <Link href="/search" className="hover:text-purple-200">
            <Search size={20} />
          </Link>
          <Link href="/client/profile" className="hover:text-purple-200">
            <User size={20} />
          </Link>
        </nav>
      </div>
    </header>
  );
};

const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3">
      <Link href="/" className="flex flex-col items-center w-16">
        <Home className="w-6 h-6 text-purple-600" />
        <span className="text-xs mt-1 text-purple-600">Início</span>
      </Link>
      
      <Link href="/professionals" className="flex flex-col items-center w-16">
        <Search className="w-6 h-6 text-gray-400" />
        <span className="text-xs mt-1 text-gray-500">Explorar</span>
      </Link>
      
      <Link href="/client/appointments" className="flex flex-col items-center w-16">
        <Calendar className="w-6 h-6 text-gray-400" />
        <span className="text-xs mt-1 text-gray-500">Agenda</span>
      </Link>
      
      <Link href="/client/profile" className="flex flex-col items-center w-16">
        <User className="w-6 h-6 text-gray-400" />
        <span className="text-xs mt-1 text-gray-500">Perfil</span>
      </Link>
    </div>
  );
};

const MainLayout: React.FC<MainLayoutProps> = ({ children, hideNav }) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      <main>
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
};

export default MainLayout;