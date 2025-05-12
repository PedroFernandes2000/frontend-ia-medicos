import React from 'react';
import { Conversation, ServiceStatus } from '../types';
interface ConversationListProps {
  conversations: Conversation[];
  selected: Conversation | null;
  setSelected: (conversation: Conversation) => void;
  status: ServiceStatus;
  setStatus: (isActive: boolean) => Promise<void> | void;
  markAsReviewed?: (conversationId: string) => Promise<void> | void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selected,
  setSelected,
  status,
  setStatus,
}) => {
  const handleToggleStatus = (newStatus: boolean) => {
    setStatus(newStatus);
  };

  
  return (
    <div className="w-80 border-r">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Status do serviço</span>
            <div className="relative inline-block w-12 h-6 align-middle select-none">
              <input
                type="checkbox"
                checked={status.isActive}
                onChange={(e) => handleToggleStatus(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`toggle-label block w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${
                  status.isActive ? 'bg-green-400' : 'bg-gray-300'
                }`}
                onClick={() => handleToggleStatus(!status.isActive)}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow-md transform duration-300 ease-in-out ${
                    status.isActive ? 'translate-x-0' : 'translate-x-6'
                  }`}
                ></div>
              </div>
            </div>
          </div>

        <p className="text-xs text-gray-500">
          {status.isActive
            ? `Ativado em: ${status.lastActivated}`
            : `Desativado em: ${status.lastDeactivated}`}
        </p>
      </div>
      
      <div className="overflow-y-auto h-[calc(100vh-14rem)]">
        {conversations.length === 0 ? (
          <p className="text-center text-gray-500 p-4">Nenhuma conversa disponível</p>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selected?.id === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
              onClick={() => setSelected(conversation)}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-medium">{conversation.name}</h3>
              </div>
              <p className="text-sm text-gray-500 truncate">
                {conversation.messages?.[conversation.messages?.length - 1]?.content || "Sem mensagens"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {conversation.messages?.[conversation.messages?.length - 1]?.timestamp || ""}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;