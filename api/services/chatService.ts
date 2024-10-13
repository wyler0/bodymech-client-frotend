import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/services/client';
import { ChatMessage } from '@/api/types/chat';

export const chatService = {
  getMessages: async (): Promise<ChatMessage[]> => {
    return apiClient<ChatMessage[]>('/chats');
  },

  sendMessage: async (message: string): Promise<ChatMessage> => {
    return apiClient<ChatMessage>('/chats', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },
};

export const useGetMessages = () => {
  return useQuery({ queryKey: ['messages'], queryFn: chatService.getMessages });
};

export const useSendMessage = () => {
  return useMutation({ mutationFn: chatService.sendMessage });
};
