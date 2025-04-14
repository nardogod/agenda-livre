// src/pages/api/notifications.ts
import { NextApiRequest, NextApiResponse } from 'next';



const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  const notifications = [
    {
      id: '1',
      message: 'Nova mensagem recebida!',
      important: true,
      read: false,
    },
    {
      id: '2',
      message: 'Sua conta foi atualizada.',
      important: false,
      read: true,
    },
    {
      id: '3',
      message: 'Novo agendamento disponível.',
      important: true,
      read: false,
    },
  ];

  res.status(200).json(notifications);
};

export default handler;
