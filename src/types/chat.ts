export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
  attachment?: {
    name: string;
    type: string;
    size: number;
  };
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number;
}
