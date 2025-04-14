import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X, User } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica de busca
    console.log('Searching for:', searchText);
  };

  return (
    <header className="bg-white border-b border-gray-light">
      <div className="container mx-auto px-5">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center">
              <span className="text-xl font-medium text-primary">Agenda Livre</span>
            </div>
          </Link>

          {/* Search - Hidden on mobile */}
          <div className="hidden md:block flex-grow max-w-md mx-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar profissionais, serviços..."
                  className="w-full py-2 pl-3 pr-10 rounded-xl border border-gray-medium focus:outline-none focus:border-primary"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-text"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/about">
              <span className="text-gray-text hover:text-black-text px-3 py-2">
                Como Funciona
              </span>
            </Link>
            <Link href="/auth/login">
              <div className="flex items-center text-primary font-medium">
                <User size={18} className="mr-1" />
                <span>Entrar</span>
              </div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-gray-light"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden py-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar profissionais, serviços..."
                className="w-full py-2 pl-3 pr-10 rounded-xl border border-gray-medium focus:outline-none focus:border-primary"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-text"
              >
                <Search size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-light">
          <div className="container mx-auto px-5 py-3">
            <nav className="space-y-3">
              <Link href="/about">
                <div className="block py-2 px-3 hover:bg-gray-light rounded-lg">
                  Como Funciona
                </div>
              </Link>
              <Link href="/auth/login">
                <div className="block py-2 px-3 hover:bg-gray-light rounded-lg">
                  Entrar / Cadastrar
                </div>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;