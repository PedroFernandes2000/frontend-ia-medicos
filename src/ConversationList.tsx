import React from 'react';
import { Conversation, ServiceStatus } from './types.js';

interface Props {
  conversations: Conversation[];
  selected: Conversation | null;
  setSelected: (c: Conversation | null) => void;
  status: ServiceStatus;
  setStatus: (s: ServiceStatus) => void;
}

const ConversationList: React.FC<Props> = ({ conversations, selected, setSelected, status, setStatus }) => {
  const toggleService = () => {
    const now = new Date().toLocaleString('pt-BR');
    const isActive = !status.isActive;
    setStatus({
      isActive,
      lastActivated: isActive ? now : status.lastActivated,
      lastDeactivated: !isActive ? now : status.lastDeactivated,
    });
  };

  const markReviewed = () => {
    if (selected) {
      selected.reviewed = false;
      setSelected(null);
    }
  };

  return (
    <>
      {!selected ? (
        <>
          {/* Painel de Conversas */}
          <div className="w-3/5">
            <h2 className="text-blue-800 text-md font-semibold mb-4">Conversas Ativas</h2>
            <div className="space-y-3">
              {conversations.filter(conv => !conv.reviewed).map(conv => (
                <div
                  key={conv.id}
                  onClick={() => setSelected(conv)}
                  className="flex justify-between items-center p-4 rounded hover:bg-blue-50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img src={conv.avatarUrl} alt="" className="w-10 h-10 rounded-full border border-blue-300" />
                    <span className="text-blue-900">{conv.contactName}</span>
                  </div>
                  <div className="bg-blue-300 text-white text-xs px-2 py-1 rounded-full">
                    {conv.messages.length}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Painel de Serviço */}
          <div className="w-2/5">
            <div className="border border-blue-200 rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-blue-800 font-semibold">Serviço de Mensagens</h2>
                <span className={`w-3 h-3 rounded-full ${status.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
              </div>
              <button
                onClick={toggleService}
                className={`w-full py-2 rounded-full text-white text-sm ${
                  status.isActive ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 hover:bg-gray-500'
                }`}
              >
                {status.isActive ? 'Desativar' : 'Ativar'}
              </button>
              <div className="mt-4 text-xs text-gray-500">
                <p>Última ativação: {status.lastActivated}</p>
                <p>Última desativação: {status.lastDeactivated}</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full max-w-4xl mx-auto">
          <button onClick={() => setSelected(null)} className="text-blue-600 mb-4 hover:underline">
            ← Voltar para conversas
          </button>
          <h2 className="text-blue-800 font-semibold text-md mb-4">{selected.contactName}</h2>
          <div className="space-y-3 mb-4">
            {selected.messages
              .map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded max-w-lg ${
                    msg.sender === 'clinic' ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left self-end'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <span className="text-xs text-gray-500">{msg.timestamp}</span>
                </div>
              ))}
          </div>
          {!selected.reviewed && (
            <button
              onClick={markReviewed}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Marcar como Revisada
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default ConversationList;
