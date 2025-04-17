import React from 'react';
import { NextPageContext } from 'next';

interface ErrorProps {
  statusCode?: number;
}

function Error({ statusCode }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-sm max-w-md w-full text-center">
        <h1 className="text-2xl font-medium text-red-600 mb-2">
          {statusCode ? `Erro ${statusCode}` : 'Ocorreu um erro'}
        </h1>
        <p className="text-gray-600 mb-4">
          {statusCode
            ? `O servidor encontrou um problema.`
            : 'Ocorreu um erro no cliente.'}
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg"
        >
          Voltar para a página inicial
        </button>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;