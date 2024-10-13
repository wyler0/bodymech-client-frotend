import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { BaseView } from '@/components/BaseView';

import { getCurrentDate } from '@/utils/utils';
import { Exercise } from '@/api/types/exercise';

// Dummy data for exercises
const exercises = [
  { id: '1', name: 'Push-ups' },
  { id: '2', name: 'Squats' },
  { id: '3', name: 'Plank' },
];

export default function RoutineDashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <Link href={`/exercise/${item.id}`} asChild>
      <TouchableOpacity style={styles.exerciseItem}>
        <Text style={[styles.exerciseName, { color: colors.textPrimary }]}>{item.name}</Text>
      </TouchableOpacity>
    </Link>
  );

  return (
    <BaseView>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Today's Routine</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{getCurrentDate('long')}</Text>
      </View>
      <FlatList
        data={exercises as Exercise[]}
        renderItem={renderExerciseItem}
        keyExtractor={(item) => item.id}
      />
    </BaseView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  exerciseItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  exerciseName: {
    fontSize: 18,
  },
});
