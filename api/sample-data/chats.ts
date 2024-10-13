import { ChatMessage } from '@/api/types/chat';

export const sampleChats: ChatMessage[] = [
  {
    id: '1',
    content: 'Hello, how can I help you with your workout today?',
    sender: 'AI',
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    content: "I'd like to focus on upper body exercises.",
    sender: 'User',
    timestamp: new Date().toISOString(),
  },
  // Add more sample chat messages as needed
];
