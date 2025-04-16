import React from 'react';
import Link from 'next/link';
import { Home, Search, Calendar, User } from 'lucide-react';
import { useRouter } from 'next/router';

const BottomNav: React.FC = () => {
  const router = useRouter();
  
  const isActive = (path: string) => {
    return router.pathname === path;
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
      <Link href="/" className="flex flex-col items-center py-1">
        <Home className={`h-6 w-6 ${isActive('/') ? 'text-purple-600' : 'text-gray-400'}`} />
        <span className={`text-xs mt-1 ${isActive('/') ? 'text-purple-600' : 'text-gray-500'}`}>Início</span>
      </Link>
      
      <Link href="/search" className="flex flex-col items-center py-1">
        <Search className={`h-6 w-6 ${isActive('/search') ? 'text-purple-600' : 'text-gray-400'}`} />
        <span className={`text-xs mt-1 ${isActive('/search') ? 'text-purple-600' : 'text-gray-500'}`}>Buscar</span>
      </Link>
      
      <Link href="/dashboard/client" className="flex flex-col items-center py-1">
        <Calendar className={`h-6 w-6 ${isActive('/dashboard/client') ? 'text-purple-600' : 'text-gray-400'}`} />
        <span className={`text-xs mt-1 ${isActive('/dashboard/client') ? 'text-purple-600' : 'text-gray-500'}`}>Agenda</span>
      </Link>
      
      <Link href="/client/profile" className="flex flex-col items-center py-1">
        <User className={`h-6 w-6 ${isActive('/client/profile') ? 'text-purple-600' : 'text-gray-400'}`} />
        <span className={`text-xs mt-1 ${isActive('/client/profile') ? 'text-purple-600' : 'text-gray-500'}`}>Perfil</span>
      </Link>
    </nav>
  );
};

export default BottomNav;