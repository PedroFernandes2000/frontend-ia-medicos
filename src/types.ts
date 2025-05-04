export interface Message {
    id: string;
    content: string;
    timestamp: string;
    sender: 'user' | 'clinic';
  }
  
  export interface Conversation {
    id: string;
    contactName: string;
    avatarUrl: string;
    reviewed: boolean;
    messages: Message[];
  }
  
  export interface ServiceStatus {
    isActive: boolean;
    lastActivated: string;
    lastDeactivated: string;
  }
  