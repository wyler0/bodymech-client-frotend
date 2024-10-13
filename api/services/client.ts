import { getConfig } from '@/utils/config';
import { sampleData } from '@/api/sample-data';

const { apiUrl, useSampleData } = getConfig();

export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  if (useSampleData) {
    // Return sample data
    return new Promise((resolve) => {
      setTimeout(() => {
        const [resource] = endpoint.split('/').filter(Boolean);
        const data = sampleData[resource as keyof typeof sampleData];
        if (!data) {
          throw new Error(`No sample data found for endpoint: ${endpoint}`);
        }
        resolve(data as unknown as T);
      }, 500); // Simulate network delay
    });
  }

  const url = `${apiUrl}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
