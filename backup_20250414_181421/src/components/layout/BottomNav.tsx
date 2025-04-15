import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, Search, Calendar, User } from 'lucide-react';

const BottomNav: React.FC = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  // Helper para verificar se um caminho está ativo
  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  // Ícone e texto para cada item da navegação
  const navItems = [
    {
      name: 'Início',
      icon: <Home size={24} />,
      path: '/',
    },
    {
      name: 'Explorar',
      icon: <Search size={24} />,
      path: '/professionals',
    },
    {
      name: 'Agenda',
      icon: <Calendar size={24} />,
      path: '/dashboard/client/appointments',
    },
    {
      name: 'Perfil',
      icon: <User size={24} />,
      path: '/dashboard/client',
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-light z-10">
      <div className="flex justify-around py-3">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link href={item.path} key={item.path}>
              <div className="flex flex-col items-center w-16">
                <div className={active ? 'text-primary' : 'text-gray-text'}>
                  {item.icon}
                </div>
                <span
                  className={`text-xs mt-1 ${
                    active ? 'text-primary font-medium' : 'text-gray-text'
                  }`}
                >
                  {item.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;