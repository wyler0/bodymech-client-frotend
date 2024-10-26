import React from 'react';
import { Stack } from 'expo-router';
import { sampleExercises } from '@/api/sample-data/exercises';

type ExerciseParams = {
  id: string;
};

export default function RoutineDashboardLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Routine Dashboard",
        }}
      />
      <Stack.Screen
        name="exercise/[id]"
        options={({ route }) => {
          const { id } = route.params as ExerciseParams;
          const exercise = sampleExercises.find(e => e.id === id);
          return {
            title: exercise ? exercise.name : "Exercise",
            headerBackTitle: " ",
            headerBackTitleVisible: false,
          };
        }}
      />
    </Stack>
  );
}
