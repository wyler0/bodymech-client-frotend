import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { View, Text } from 'react-native';
import { initializeFirebase } from '../firebase';

export default function RootLayout() {
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  useEffect(() => {
    async function setup() {
      await initializeFirebase();
      setIsFirebaseReady(true);
    }
    setup();
  }, []);

  if (!isFirebaseReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading application...</Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(login)" options={{ headerShown: false }} />
    </Stack>
  );
}
