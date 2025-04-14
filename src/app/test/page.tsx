import React from 'react';
import { NotificationDropdown } from '../../components/notifications/NotificationDropdown';
// ou importe o componente que deseja testar

const TestPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-medium mb-6">Página de Teste</h1>
      <NotificationDropdown />
      {/* Ou outro componente que deseja testar */}
    </div>
  );
};

export default TestPage;