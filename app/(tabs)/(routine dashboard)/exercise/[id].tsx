import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { BaseView } from '@/components/BaseView';
import { ThemedText } from '@/components/ThemedText';

export default function ExerciseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <BaseView>
      <View style={styles.container}>
        <ThemedText style={styles.title}>Exercise {id}</ThemedText>
        <ThemedText>Exercise details will be displayed here.</ThemedText>
        {/* TODO: Add exercise details and interactive components */}
      </View>
    </BaseView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
