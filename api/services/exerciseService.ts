import { apiClient } from './client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Exercise } from '@/api/types/exercise';
import { sampleExercises } from '@/api/sample-data/exercises';
import { getConfig } from '@/utils/config';

const { useSampleData } = getConfig();

export const exerciseService = {
  getExercises: async (): Promise<Exercise[]> => {
    return apiClient<Exercise[]>('/exercises');
  },

  getExerciseById: async (id: string): Promise<Exercise> => {
    if (useSampleData) {
      const exercise = sampleExercises.find(ex => ex.id === id);
      if (!exercise) throw new Error('Exercise not found');
      return exercise;
    }
    return apiClient<Exercise>(`/exercises/${id}`);
  },

  createExercise: async (exercise: Omit<Exercise, 'id'>): Promise<Exercise> => {
    if (useSampleData) {
      const newExercise = { ...exercise, id: String(sampleExercises.length + 1) };
      sampleExercises.push(newExercise);
      return newExercise;
    }
    return apiClient<Exercise>('/exercises', {
      method: 'POST',
      body: JSON.stringify(exercise),
    });
  },

  getExercisesToday: async (): Promise<Exercise[]> => {
    if (useSampleData) {
      // For sample data, return a random subset of exercises
      return sampleExercises.sort(() => 0.5 - Math.random()).slice(0, 3);
    }
    return apiClient<Exercise[]>('/exercises/today');
  },

  updateExercise: async (id: string, exercise: Partial<Exercise>): Promise<Exercise> => {
    if (useSampleData) {
      const index = sampleExercises.findIndex(ex => ex.id === id);
      if (index === -1) throw new Error('Exercise not found');
      sampleExercises[index] = { ...sampleExercises[index], ...exercise };
      return sampleExercises[index];
    }
    return apiClient<Exercise>(`/exercises/${id}`, {
      method: 'PUT',
      body: JSON.stringify(exercise),
    });
  },

  deleteExercise: async (id: string): Promise<void> => {
    if (useSampleData) {
      const index = sampleExercises.findIndex(ex => ex.id === id);
      if (index === -1) throw new Error('Exercise not found');
      sampleExercises.splice(index, 1);
      return;
    }
    await apiClient(`/exercises/${id}`, { method: 'DELETE' });
  },
};

export const useGetExercises = () => {
  return useQuery({ queryKey: ['exercises'], queryFn: exerciseService.getExercises });
};

export const useGetExerciseById = (id: string) => {
  return useQuery({ queryKey: ['exercise', id], queryFn: () => exerciseService.getExerciseById(id) });
};

export const useCreateExercise = () => {
  return useMutation({ mutationFn: exerciseService.createExercise });
};

export const useGetExercisesToday = () => {
  return useQuery({ queryKey: ['exercises', 'today'], queryFn: exerciseService.getExercisesToday });
};

export const useUpdateExercise = () => {
  return useMutation({ mutationFn: ({ id, exercise }: { id: string; exercise: Partial<Exercise> }) => exerciseService.updateExercise(id, exercise) });
};

export const useDeleteExercise = () => {
  return useMutation({ mutationFn: exerciseService.deleteExercise });
};
