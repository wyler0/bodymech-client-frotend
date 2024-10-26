import React from 'react';
import { Stack } from 'expo-router';
import { sampleConversations } from '@/api/sample-data/conversations';
import { View, Text, Image, StyleSheet } from 'react-native';

type ChatParams = {
  id: string;
};

const ChatHeader = ({ name, avatar }: { name: string; avatar?: string }) => (
  <View style={styles.headerContainer}>
    {avatar ? (
      <Image source={{ uri: avatar }} style={styles.avatar} />
    ) : (
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarText}>{name[0]}</Text>
      </View>
    )}
    <Text style={styles.headerTitle}>{name}</Text>
  </View>
);

export default function ConversationsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Conversations",
        }}
      />
      <Stack.Screen
        name="chat/[id]"
        options={({ route }) => {
          const { id } = route.params as ChatParams;
          const conversation = sampleConversations.find(c => c.id === id);
          return {
            headerTitle: () => conversation ? (
              <ChatHeader 
                name={conversation.name} 
                avatar={conversation.avatar} 
              />
            ) : null,
            headerBackTitle: " ",
            headerBackTitleVisible: false,
          };
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  avatarPlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0084ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
