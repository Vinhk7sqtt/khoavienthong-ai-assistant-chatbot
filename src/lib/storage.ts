
import { Conversation } from '@/types/chat';

const STORAGE_KEY = 'vienthong-conversations';

export const saveConversations = (conversations: Conversation[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
};

export const loadConversations = (): Conversation[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
};
