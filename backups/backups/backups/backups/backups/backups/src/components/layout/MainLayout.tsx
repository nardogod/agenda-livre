// components/layout/MainLayout.jsx
import React from 'react';
import { useRouter } from 'next/router';
import { Home, User, Calendar, Search, Settings } from 'lucide-react';

export default function MainLayout({ children }) {
  const router = useRouter();
  
  // Verificar se deve mostrar o navigation bottom
  // Não mostrar em páginas como login, registro, etc.
  const hideNavigation = [
    '/login',
    '/register',
    '/password-reset',
  ].includes(router.pathname);
  
  // Itens da navegação
  const navItems = [
    { icon: Home, label: 'Início', path: '/' },
    { icon: Search, label: 'Explorar', path: '/explore' },
    { icon: Calendar, label: 'Agenda', path: '/appointments' },
    { icon: User, label: 'Perfil', path: '/profile' },
  ];
  
  // Verificar qual item está ativo
  const isActive = (path) => {
    if (path === '/' && router.pathname === '/') return true;
    if (path !== '/' && router.pathname.startsWith(path)) return true;
    return false;
  };
  
  return (
    <div className="min-h-screen relative pb-16">
      {/* Conteúdo principal */}
      <main>{children}</main>
      
      {/* Navegação inferior */}
      {!hideNavigation && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 z-10">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button 
                key={index}
                className="flex flex-col items-center w-16"
                onClick={() => router.push(item.path)}
              >
                <Icon 
                  size={24} 
                  className={active ? 'text-purple-600' : 'text-gray-400'} 
                />
                <span 
                  className={`text-xs mt-1 ${
                    active ? 'text-purple-600' : 'text-gray-500'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}