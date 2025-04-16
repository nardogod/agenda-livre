import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b px-4 py-3 sticky top-0 z-10">
      <div className="flex justify-between items-center">
        <Link href="/">
          <h1 className="text-xl font-medium text-purple-600">Agenda Livre</h1>
        </Link>
        
        <div className="flex items-center">
          <Link href="/auth/login" className="text-sm text-gray-600 mr-4">
            Login
          </Link>
          <Link href="/auth/register" className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg">
            Cadastre-se
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;