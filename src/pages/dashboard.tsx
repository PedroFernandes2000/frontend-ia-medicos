import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ConversationList from '../components/ConversationList';
import { Conversation, ServiceStatus } from '../types';
import messageService from '../services/MessagesServices';

const Dashboard: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  

  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>({
    isActive: false,
    lastActivated: '',
    lastDeactivated: '',
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
     
        const statusData = await messageService.getSystemStatus();
        
       
        const now = new Date();
        const formattedDate = now.toLocaleDateString('pt-BR') + ', ' + 
          now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
    
        setServiceStatus({
          isActive: statusData.active,
          lastActivated: statusData.active ? formattedDate : '',
          lastDeactivated: !statusData.active ? formattedDate : '',
        });
        
        // Buscar conversas
        const data = await messageService.getAllMessages();
        setConversations(data);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching initial data:', err);
        
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          navigate('/login');
          return;
        }
        
        setError('Falha ao carregar dados. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [navigate]);

  useEffect(() => {
    const fetchConversationDetails = async (id: string) => {
      if (!id) return;
      
      try {
        const data = await messageService.getMessageById(id);
        
        setSelectedConversation(data);
        
        setConversations(prevConversations => 
          prevConversations.map(conv => 
            conv.id === id ? data : conv
          )
        );
      } catch (err) {
        console.error(`Error fetching conversation ${id} details:`, err);
        setError(`Falha ao carregar detalhes da conversa. Por favor, tente novamente.`);
      }
    };

    if (selectedConversation?.id) {
      fetchConversationDetails(selectedConversation.id);
    }
  }, [selectedConversation?.id]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleServiceStatusChange = async (isActive: boolean) => {
    try {
      await messageService.updateServiceStatus(isActive);
      
      const now = new Date();
      const formattedDate = now.toLocaleDateString('pt-BR') + ', ' + 
        now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      
      setServiceStatus({
        isActive,
        lastActivated: isActive ? formattedDate : serviceStatus.lastActivated,
        lastDeactivated: !isActive ? formattedDate : serviceStatus.lastDeactivated,
      });
    } catch (err) {
      console.error('Error updating service status:', err);
      setError('Falha ao atualizar status do serviço. Por favor, tente novamente.');
    }
  };

  const handleMarkAsReviewed = async (conversationId: string) => {
    try {
      const updatedConversation = await messageService.markAsReviewed(conversationId);
      
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === conversationId ? updatedConversation : conv
        )
      );
      
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(updatedConversation);
      }
    } catch (err) {
      console.error(`Error marking conversation ${conversationId} as reviewed:`, err);
      setError('Falha ao marcar conversa como revisada. Por favor, tente novamente.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white text-gray-800">
 
      <header className="flex justify-between items-center px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <h1 className="text-blue-800 text-lg font-medium">Mensagens Automáticas</h1>
        </div>
      </header>

      <main className="flex flex-1 px-8 py-6 gap-8">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 text-blue-800 hover:underline"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        ) : (
          <ConversationList
            conversations={conversations}
            selected={selectedConversation}
            setSelected={handleSelectConversation}
            status={serviceStatus}
            setStatus={handleServiceStatusChange}
            markAsReviewed={handleMarkAsReviewed}
          />
        )}
      </main>

      
      <footer className="text-sm text-gray-400 text-center py-4 border-t">
        © 2025 IAgiliza
      </footer>
    </div>
  );
};

export default Dashboard;