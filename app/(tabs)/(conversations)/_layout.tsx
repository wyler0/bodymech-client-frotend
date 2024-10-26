import React from 'react';
import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { sampleConversations } from '@/api/sample-data/conversations';

type ChatParams = {
  id: string;
};

export default function ConversationsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={() => ({
          title: "Conversations",
        })}
      />
      <Stack.Screen
        name="chat/[id]"
        options={({ route }) => {
          const { id } = route.params as ChatParams;
          const conversation = sampleConversations.find(c => c.id === id);
          return {
            title: conversation ? conversation.name : "Chat",
            headerBackTitle: " ",
            headerBackTitleVisible: false,
          };
        }}
      />
      <Stack.Screen
        name="NewChatPopover"
        options={{
          presentation: 'modal',
          title: 'New Chat',
        }}
      />
    </Stack>
  );
}
