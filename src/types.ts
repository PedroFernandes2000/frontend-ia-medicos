// src/types/index.ts

// Define types for messages
export interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: 'user' | 'clinic' | 'system';
}

// Define types for conversations
export type Conversation = {
  users: {
    id: string,
    name: string,
    number: string
  }[],  
  metrics: {
    totalRecebidas: number,  
    totalEnviadas: number,
    pendentes: number,
    taxaResposta: number
  }
};

// Define service status type
export interface ServiceStatus {
  isActive: boolean;
  lastActivated: string;
  lastDeactivated: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Authentication types
export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}