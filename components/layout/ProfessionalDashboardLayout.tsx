// components/layout/ProfessionalDashboardLayout.tsx
import React, { useState, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Home, 
  Calendar, 
  Scissors, 
  TrendingUp, 
  User, 
  Settings, 
  Bell, 
  LogOut, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';

interface ProfessionalDashboardLayoutProps {
  children: ReactNode;
}

const ProfessionalDashboardLayout: React.FC<ProfessionalDashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);
  
  // Verificar qual página está ativa
  const isActive = (path: string) => {
    return router.pathname === path;
  };
  
  // Menu items
  const menuItems = [
    { 
      path: '/dashboard/professional', 
      name: 'Início', 
      icon: <Home size={20} /> 
    },
    { 
      path: '/dashboard/professional/appointments', 
      name: 'Agendamentos', 
      icon: <Calendar size={20} /> 
    },
    { 
      path: '/dashboard/professional/services', 
      name: 'Serviços', 
      icon: <Scissors size={20} /> 
    },
    { 
      path: '/dashboard/professional/analytics', 
      name: 'Análises', 
      icon: <TrendingUp size={20} /> 
    },
    { 
      path: '/dashboard/professional/profile', 
      name: 'Perfil', 
      icon: <User size={20} /> 
    }
  ];
  
  // Mock para notificações
  const notifications = [
    { id: 1, text: 'Novo agendamento confirmado', read: false },
    { id: 2, text: 'Lembrete: 2 agendamentos amanhã', read: false }
  ];
  
  // Perfil do usuário mockado
  const user = {
    name: 'Ana Oliveira',
    profileImage: 'https://placehold.co/100x100',
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar para desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
          <div className="h-16 flex items-center px-6 border-b border-gray-200">
            <Link href="/" className="text-xl font-bold text-purple-600">
              Agenda Livre
            </Link>
          </div>
          
          <div className="flex flex-col flex-1 overflow-y-auto">
            {/* Perfil do usuário */}
            <div className="px-4 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <img 
                    className="h-10 w-10 rounded-full object-cover" 
                    src={user.profileImage} 
                    alt={user.name} 
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">Profissional</p>
                </div>
              </div>
            </div>
            
            {/* Menu de navegação */}
            <nav className="mt-5 px-2 space-y-1">
              {menuItems.map((item) => (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg ${
                    isActive(item.path) 
                      ? 'bg-purple-50 text-purple-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className={`mr-3 ${isActive(item.path) ? 'text-purple-600' : 'text-gray-500'}`}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              ))}
              
              {/* Menu dropdown de configurações */}
              <div className="relative">
                <button
                  onClick={() => setSettingsDropdownOpen(!settingsDropdownOpen)}
                  className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <span className="mr-3 text-gray-500">
                    <Settings size={20} />
                  </span>
                  Configurações
                  <ChevronDown size={16} className="ml-auto" />
                </button>
                
                {settingsDropdownOpen && (
                  <div className="absolute left-0 w-full mt-1 bg-white rounded-lg shadow-lg py-1">
                    <Link 
                      href="/dashboard/professional/settings/calendar" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Disponibilidade
                    </Link>
                    <Link 
                      href="/dashboard/professional/settings/notifications" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Notificações
                    </Link>
                  </div>
                )}
              </div>
            </nav>
            
            {/* Botão de sair */}
            <div className="mt-auto p-4 border-t border-gray-200">
              <button 
                onClick={() => router.push('/logout')}
                className="flex items-center px-4 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50"
              >
                <LogOut size={20} className="mr-3" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white flex items-center justify-between h-16 px-4 md:px-6">
          {/* Botão mobile menu */}
          <div className="md:hidden">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <Menu size={24} />
            </button>
          </div>
          
          {/* Logo para mobile */}
          <div className="md:hidden">
            <Link href="/" className="text-xl font-bold text-purple-600">
              Agenda Livre
            </Link>
          </div>
          
          {/* Título da página - visível apenas em desktop */}
          <div className="hidden md:block">
            <h1 className="text-lg font-medium">Dashboard</h1>
          </div>
          
          {/* Notificações e avatar do usuário */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 relative">
                <Bell size={20} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </button>
            </div>
            
            {/* Avatar - visível apenas em mobile */}
            <div className="md:hidden">
              <img 
                className="h-8 w-8 rounded-full object-cover" 
                src={user.profileImage} 
                alt={user.name} 
              />
            </div>
          </div>
        </div>
        
        {/* Sidebar mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75" 
              onClick={toggleSidebar}
            ></div>
            
            {/* Sidebar */}
            <div className="relative flex flex-col w-full max-w-xs bg-white h-full">
              <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
                <Link href="/" className="text-xl font-bold text-purple-600">
                  Agenda Livre
                </Link>
                <button 
                  onClick={toggleSidebar}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {/* Perfil do usuário */}
                <div className="px-4 py-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img 
                        className="h-10 w-10 rounded-full object-cover" 
                        src={user.profileImage} 
                        alt={user.name} 
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">Profissional</p>
                    </div>
                  </div>
                </div>
                
                {/* Menu de navegação */}
                <nav className="mt-5 px-2 space-y-1">
                  {menuItems.map((item) => (
                    <Link 
                      key={item.path} 
                      href={item.path}
                      className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg ${
                        isActive(item.path) 
                          ? 'bg-purple-50 text-purple-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={toggleSidebar}
                    >
                      <span className={`mr-3 ${isActive(item.path) ? 'text-purple-600' : 'text-gray-500'}`}>
                        {item.icon}
                      </span>
                      {item.name}
                    </Link>
                  ))}
                  
                  {/* Configurações */}
                  <div>
                    <button
                      onClick={() => setSettingsDropdownOpen(!settingsDropdownOpen)}
                      className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100"
                    >
                      <span className="mr-3 text-gray-500">
                        <Settings size={20} />
                      </span>
                      Configurações
                      <ChevronDown size={16} className="ml-auto" />
                    </button>
                    
                    {settingsDropdownOpen && (
                      <div className="mt-1 pl-10 space-y-1">
                        <Link 
                          href="/dashboard/professional/settings/calendar" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                          onClick={toggleSidebar}
                        >
                          Disponibilidade
                        </Link>
                        <Link 
                          href="/dashboard/professional/settings/notifications" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                          onClick={toggleSidebar}
                        >
                          Notificações
                        </Link>
                      </div>
                    )}
                  </div>
                </nav>
                
                {/* Botão de sair */}
                <div className="mt-6 p-4">
                  <button 
                    onClick={() => {
                      toggleSidebar();
                      router.push('/logout');
                    }}
                    className="flex items-center px-4 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <LogOut size={20} className="mr-3" />
                    Sair
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Conteúdo da página */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ProfessionalDashboardLayout;