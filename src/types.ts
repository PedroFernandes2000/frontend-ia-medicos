// src/types/index.ts

// Define types for messages
export interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: 'user' | 'clinic' | 'system';
}

// Define types for conversations
export interface Conversation {
  id: string;
  name: string;
  reviewed: boolean;
  messages: Message[];
}

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