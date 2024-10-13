import { useGetExercises, useCreateExercise } from '@/services/api/exerciseService';
import { handleApiError } from '@/utils/errorHandler';

export const useExercises = () => {
  const { data: exercises, isLoading, error } = useGetExercises();
  const createExerciseMutation = useCreateExercise();

  const createExercise = async (exerciseData: Omit<Exercise, 'id'>) => {
    try {
      await createExerciseMutation.mutateAsync(exerciseData);
    } catch (error) {
      handleApiError(error);
    }
  };

  if (error) {
    handleApiError(error);
  }

  return {
    exercises,
    isLoading,
    createExercise,
  };
};
