import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-light py-6 hidden sm:block">
      <div className="container mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e descrição */}
          <div className="md:col-span-2">
            <Link href="/">
              <div className="text-xl font-medium text-primary mb-2">Agenda Livre</div>
            </Link>
            <p className="text-sm text-gray-text mb-4">
              Plataforma de agendamento online para serviços de beleza. 
              Conectamos profissionais e clientes para uma experiência simples e eficiente.
            </p>
          </div>

          {/* Links rápidos */}
          <div>
            <h3 className="font-medium text-black-text mb-3">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about">
                  <span className="text-sm text-gray-text hover:text-primary">Como Funciona</span>
                </Link>
              </li>
              <li>
                <Link href="/professionals">
                  <span className="text-sm text-gray-text hover:text-primary">Encontrar Profissionais</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/professional">
                  <span className="text-sm text-gray-text hover:text-primary">Para Profissionais</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Informações */}
          <div>
            <h3 className="font-medium text-black-text mb-3">Informações</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms">
                  <span className="text-sm text-gray-text hover:text-primary">Termos de Uso</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <span className="text-sm text-gray-text hover:text-primary">Política de Privacidade</span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="text-sm text-gray-text hover:text-primary">Contato</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-light mt-6 pt-6 text-center md:text-left">
          <p className="text-xs text-gray-text">
            © {currentYear} Agenda Livre. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;