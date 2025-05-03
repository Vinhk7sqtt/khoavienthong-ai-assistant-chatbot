
import { Conversation } from '@/types/chat';

const STORAGE_KEY = 'vienthong-conversations';

export const saveConversations = (conversations: Conversation[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
};

export const loadConversations = (): Conversation[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const deleteConversation = (id: string): Conversation[] => {
  const conversations = loadConversations();
  const updatedConversations = conversations.filter(conv => conv.id !== id);
  saveConversations(updatedConversations);
  return updatedConversations;
};

export const toggleFavorite = (id: string): Conversation[] => {
  const conversations = loadConversations();
  const updatedConversations = conversations.map(conv => {
    if (conv.id === id) {
      return { ...conv, favorite: !conv.favorite };
    }
    return conv;
  });
  saveConversations(updatedConversations);
  return updatedConversations;
};
