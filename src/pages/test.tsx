import React from 'react';
import { NotificationDropdown } from '../components/notifications/NotificationDropdown';
// ou importe o componente que deseja testar


const TestPage = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6 border-b pb-2">Página de Teste</h1>
      <div className="border border-dashed border-gray-300 p-6 rounded-xl bg-white shadow-sm">
        <NotificationDropdown />
      </div>
    </div>
  );
};


export default TestPage;