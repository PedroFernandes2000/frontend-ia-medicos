import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Conversation, ServiceStatus } from '../types';
import messageService from '../services/MessagesServices';
import {MessageSquare, Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StatusComponent } from '../components/StatusComponent';

const mockChartData = [
  { name: 'Jan', recebidas: 40, enviadas: 35 },
  { name: 'Fev', recebidas: 45, enviadas: 42 },
  { name: 'Mar', recebidas: 60, enviadas: 58 },
  { name: 'Abr', recebidas: 90, enviadas: 85 },
  { name: 'Mai', recebidas: 75, enviadas: 72 },
];

const Dashboard: React.FC = () => {
  const [conversationData, setConversationData] = useState<{
    metrics: Conversation['metrics']
  }>({
    metrics: {
      totalRecebidas: 0,
      totalEnviadas: 0,
      taxaResposta: 0,
      pendentes: 0
    }
  });
  
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
  
        const data = await messageService.getAllMessages();
        setConversationData(data);
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

  interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
  }

  const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => (
    <div className={`bg-white rounded-lg shadow-md p-4 flex flex-col ${color}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-gray-600 font-medium">{title}</h3>
        <div className={`p-2 rounded-full ${color.replace('border-l-4', 'bg-opacity-10')}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50 text-gray-800">
      <header className="flex justify-between items-center px-6 py-4 bg-white border-b shadow-sm">
        <div className="flex items-center gap-2">
          <h1 className="text-blue-800 text-lg font-medium">Mensagens Automáticas</h1>
        </div>
      </header>

      <main className="flex flex-1 p-6 gap-6">
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
          <div className="flex w-full flex-col lg:flex-row gap-6">            
            
            <div className="lg:w-full flex flex-col gap-6">
            <div>
              <span className='text-gray-600 font-medium'>Status do Serviço </span>
                <StatusComponent
                  status={serviceStatus}
                  setStatus={handleServiceStatusChange}
                />
            </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard 
                  title="Mensagens Recebidas" 
                  value={conversationData.metrics.totalRecebidas} 
                  icon={<MessageSquare className="text-blue-600" size={20} />}
                  color="border-l-4 border-blue-500"
                />
                <StatsCard 
                  title="Mensagens Enviadas" 
                  value={conversationData.metrics.totalEnviadas} 
                  icon={<Send className="text-green-600" size={20} />}
                  color="border-l-4 border-green-500"
                />
                <StatsCard 
                  title="Taxa de Resposta" 
                  value={`${conversationData.metrics.taxaResposta}%`} 
                  icon={<CheckCircle className="text-indigo-600" size={20} />}
                  color="border-l-4 border-indigo-500"
                />
                <StatsCard 
                  title="Pendentes de Revisão" 
                  value={conversationData.metrics.pendentes} 
                  icon={<AlertTriangle className="text-amber-600" size={20} />}
                  color="border-l-4 border-amber-500"
                />
              </div>
              
             
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-700">Histórico de Mensagens</h2>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm text-gray-600">Recebidas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm text-gray-600">Enviadas</span>
                    </div>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={mockChartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="recebidas" fill="#3B82F6" />
                      <Bar dataKey="enviadas" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="text-sm text-gray-400 text-center py-4 border-t bg-white">
        © 2025 IAgiliza
      </footer>
    </div>
  );
};

export default Dashboard;