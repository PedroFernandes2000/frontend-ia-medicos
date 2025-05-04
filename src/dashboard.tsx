import React, { useState } from 'react';
import ConversationList from './ConversationList.js';
import { Conversation, ServiceStatus } from './types.js';

const Dashboard: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>({
    isActive: true,
    lastActivated: '14/05/2025, 09:15',
    lastDeactivated: '13/05/2025, 18:47',
  });

  let mockConversations: Conversation[] = [
    {
      id: '1',
      contactName: 'Leia Organa',
      avatarUrl: 'https://i.pinimg.com/736x/a7/82/91/a78291bd1017ea3d94a187ab00a1e70d.jpg',
      reviewed: false,
      messages: [
        { id: 'm1', content: 'Olá, doutor!', timestamp: '14/05/2025 08:45', sender: 'user' },
        { id: 'm2', content: 'Bom dia, Leia! Como posso ajudar?', timestamp: '14/05/2025 08:50', sender: 'clinic' },
      ],
    },
    {
      id: '2',
      contactName: 'Lucke Skywalker',
      avatarUrl: 'https://i.pinimg.com/736x/b5/b7/cd/b5b7cdbc47e21a2e15205f056c3aff78.jpg',
      reviewed: false,
      messages: [
        { id: 'm1', content: 'Problemas com a mensagem automática.', timestamp: '13/05/2025 16:32', sender: 'user' },
      ],
    },
    {
      id: '3',
      contactName: 'Han Solo',
      avatarUrl: 'https://i.pinimg.com/736x/17/18/1f/17181f08fba41abae0422a410c893d35.jpg',
      reviewed: false,
      messages: [
        { id: 'm1', content: 'Recebi duas notificações iguais.', timestamp: '13/05/2025 12:15', sender: 'user' },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white text-gray-800">
      {/* Top Bar */}
      <header className="flex justify-between items-center px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <h1 className="text-blue-800 text-lg font-medium">Mensagens Automáticas</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 px-8 py-6 gap-8">
        <ConversationList
          conversations={mockConversations}
          selected={selectedConversation}
          setSelected={setSelectedConversation}
          status={serviceStatus}
          setStatus={setServiceStatus}
        />
      </main>

      {/* Footer */}
      <footer className="text-sm text-gray-400 text-center py-4 border-t">
        © 2025 IAgiliza
      </footer>
    </div>
  );
};

export default Dashboard;
