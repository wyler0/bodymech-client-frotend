import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { GiftedChat, IMessage, Actions } from 'react-native-gifted-chat';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { sampleConversations } from '@/api/sample-data/conversations';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    // Find the conversation in the sample data
    const conversation = sampleConversations.find(c => c.id === id);
    
    // Set initial message based on the conversation, or leave it empty if no conversation found
    if (conversation) {
      setMessages([
        {
          _id: 1,
          text: conversation.lastMessage,
          createdAt: new Date(conversation.timestamp),
          user: {
            _id: 2,
            name: conversation.name,
            avatar: 'https://avatars.githubusercontent.com/u/388375?s=48&v=4',
          },
        },
      ]);
    } else {
      setMessages([]);
    }
  }, [id]);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessages)
    );
    // Here you would typically send the message to your backend
    // and then handle the response
  }, []);

  const onPickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newMessage: IMessage = {
        _id: Math.round(Math.random() * 1000000),
        createdAt: new Date(),
        user: {
          _id: 1,
        },
        image: result.assets[0].uri,
        text: '',
      };
      onSend([newMessage]);
    }
  }, []);

  const renderActions = useCallback(() => {
    return (
      <Actions
        icon={() => (
          <TouchableOpacity onPress={onPickImage}>
            <View style={styles.imageButton}>
              <AntDesign name="plus" size={20} color="#0084ff" />
            </View>
          </TouchableOpacity>
        )}
      />
    );
  }, []);

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
        renderActions={renderActions}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#0084ff',
    marginTop: 'auto',
    marginBottom: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
