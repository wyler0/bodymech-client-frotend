// import { Conversation } from '@/api/types/conversation';

export const sampleConversations = [
  {
    id: '1',
    name: 'AI Assistant',
    lastMessage: 'Hello! How can I help you today?',
    timestamp: new Date(2023, 5, 1, 14, 30).toISOString(),
    unreadCount: 1,
    avatar: 'https://avatars.githubusercontent.com/u/388375?s=48&v=4',
  },
  {
    id: '2',
    name: 'Workout Buddy',
    lastMessage: 'Great job on your workout!',
    timestamp: new Date(2023, 4, 31, 18, 45).toISOString(),
    unreadCount: 0,
    avatar: 'https://example.com/workout-buddy-avatar.jpg',
  },
  {
    id: '3',
    name: 'Nutrition Coach',
    lastMessage: 'Remember to log your meals',
    timestamp: new Date(2023, 4, 30, 9, 15).toISOString(),
    unreadCount: 2,
  },
  {
    id: '4',
    name: 'Sleep Tracker',
    lastMessage: 'Your sleep quality has improved!',
    timestamp: new Date(2023, 4, 29, 22, 0).toISOString(),
    unreadCount: 0,
  },
  {
    id: '5',
    name: 'Meditation Guide',
    lastMessage: 'Time for your daily meditation',
    timestamp: new Date(2023, 4, 28, 7, 0).toISOString(),
    unreadCount: 1,
  },
];
