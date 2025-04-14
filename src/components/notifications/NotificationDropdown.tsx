// src/components/notifications/NotificationDropdown.tsx

'use client'

import React, { useState, useRef, useEffect } from 'react';
import { NotificationIcon } from './NotificationIcon';
import { NotificationList } from './NotificationList';


export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fechar o dropdown quando clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <NotificationIcon onClick={() => setIsOpen(!isOpen)} />
      {isOpen && <NotificationList onClose={() => setIsOpen(false)} />}
    </div>
  );
};