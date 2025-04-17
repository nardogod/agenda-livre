import React, { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Home, Search, Calendar, User, Menu } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'Agenda Livre',
  description = 'Plataforma de agendamento para serviços de beleza',
  showHeader = true,
  showFooter = true
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {showHeader && (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0">
                <Link href="/" className="flex items-center">
                  <span className="text-xl font-bold text-purple-600">Agenda Livre</span>
                </Link>
              </div>
              
              <div className="hidden md:block">
                <div className="ml-10 flex items-center space-x-4">
                  <Link href="/search" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    Buscar
                  </Link>
                  <Link href="/categories" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    Categorias
                  </Link>
                  <Link href="/professionals" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    Profissionais
                  </Link>
                </div>
              </div>
              
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <Link href="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    Entrar
                  </Link>
                  <Link href="/register" className="ml-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
                    Cadastrar
                  </Link>
                </div>
              </div>
              
              <div className="flex md:hidden">
                <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500">
                  <Menu size={24} />
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      <main>{children}</main>

      {showFooter && (
        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
          <div className="flex justify-around py-3">
            <Link href="/" className="flex flex-col items-center w-16">
              <Home size={20} className="text-gray-400" />
              <span className="text-xs mt-1 text-gray-500">Início</span>
            </Link>
            <Link href="/search" className="flex flex-col items-center w-16">
              <Search size={20} className="text-gray-400" />
              <span className="text-xs mt-1 text-gray-500">Buscar</span>
            </Link>
            <Link href="/appointments" className="flex flex-col items-center w-16">
              <Calendar size={20} className="text-gray-400" />
              <span className="text-xs mt-1 text-gray-500">Agenda</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center w-16">
              <User size={20} className="text-gray-400" />
              <span className="text-xs mt-1 text-gray-500">Perfil</span>
            </Link>
          </div>
        </footer>
      )}
    </>
  );
};

export default Layout;