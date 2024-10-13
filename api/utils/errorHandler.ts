import { AxiosError } from 'axios';

export const handleApiError = (error: unknown) => {
  if (error instanceof AxiosError) {
    console.error('API Error:', error.response?.data || error.message);
  } else {
    console.error('Unexpected error:', error);
  }
};
