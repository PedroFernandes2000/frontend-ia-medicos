import axios, { AxiosInstance } from 'axios';
import { Cookies } from 'react-cookie';
import { Conversation } from '../types';


const backend_url = "http://localhost:3000";

class MessageService {
  private api: AxiosInstance;
  
  constructor() {
    const cookies = new Cookies();
    const token = cookies.get('accessToken');
    
    if (!token) {
      console.error('Authentication token not found');
    }
    
    this.api = axios.create({
      baseURL: `${backend_url}/api`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
   
    this.api.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
         
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }
  
 
  async getAllMessages(): Promise<Conversation[]> {
    try {
      const response = await this.api.get('/webhooks/getAllMessages');
      return response.data;
    } catch (error) {
      console.error('Error fetching all messages:', error);
      throw error;
    }
  }
  
  async getMessageById(id: string): Promise<Conversation> {
    try {
      const response = await this.api.post(`/webhooks/getMessage/${id}`);
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error(`Error fetching message ${id}:`, error);
      throw error;
    }
  }
  
  async getSystemStatus(): Promise<{ active: boolean }> {
    try {
      const response = await this.api.get('/webhooks/systemStatus');
      return response.data;
    } catch (error) {
      console.error('Error fetching system status:', error);
      throw error;
    }
  }
  
  async markAsReviewed(id: string): Promise<Conversation> {
    try {
      const response = await this.api.patch(`/webhooks/markAsReviewed/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error marking conversation ${id} as reviewed:`, error);
      throw error;
    }
  }
  
 
  async updateServiceStatus(isActive: boolean) {
    try {
      const response = await this.api.post('/webhooks/system', { "state":isActive });
      return response.data;
    } catch (error) {
      console.error('Error updating service status:', error);
      throw error;
    }
  }
}

const messageService = new MessageService();
export default messageService;