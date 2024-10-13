## API Standardization and React Query Integration

This section outlines the approach for managing API interactions in the Expo app using React Query.

1. File Structure:
   - API Client: Handles base API configuration (api/services/client.ts)
   - API Services: One file per primary endpoint or logical group (api/services/*.ts)
   - Types: Mirror Pydantic models from the backend (api/types/*.ts)
   - React Query setup: Configure QueryClient (api/services/queryClient.ts)
   - Custom Hooks: Utilize API services and React Query (api/hooks/*.ts)
   - Error Handling: Centralized error handling utility (api/utils/errorHandler.ts)
   - Sample Data: Mock data for testing and development (api/sample-data/*.ts)

2. API Client:
   - Uses Axios (or another HTTP client) for making HTTP requests
   - Configures base URL, headers, and interceptors
   - React Query wraps these Axios calls to provide additional functionality

3. API Services:
   - Implement API calls using Axios
   - Wrap these calls with React Query hooks for data fetching and mutations
   - Separated by resource or domain (e.g., userService.ts, exerciseService.ts)
   - Located in a shared directory (api/services/)

4. Types:
   - Define TypeScript interfaces mirroring Pydantic models
   - Include interfaces for request payloads and response structures

5. React Query Integration:
   - Set up QueryClient with global configurations
   - Implement custom hooks using useQuery and useMutation
   - Handle caching, refetching, and mutations

6. Error Handling:
   - Centralized error handling in api/utils/errorHandler.ts
   - Used across API services and components

7. Sample Data:
   - Located in api/sample-data/ directory (e.g., exercises.ts)
   - Used for testing UI components and development when API is not available
   - Controlled by environment variable (EXPO_PUBLIC_USE_SAMPLE_DATA)
   - Example structure:
     ```typescript
     export const sampleExercises: Exercise[] = [
       {
         id: '1',
         name: 'Push-ups',
         description: 'A classic upper body exercise',
         muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
         difficulty: 'Beginner',
       },
       // ... more sample exercises
     ];
     ```

8. Additional Considerations:
   - Environment Configuration: Separate file for environment-specific settings
   - Authentication: Implement auth service and related hooks if required
   - Interceptors: Add for token management, etc.
   - Caching Strategies: Define consistent approaches across queries

9. Environment Configuration:
   - Use app.json and expo-constants for environment-specific configurations:
     ```json:app.json
     {
       "expo": {
         "extra": {
           "apiUrl": "https://api.yourapp.com",
           "useSampleData": true
         }
       }
     }
     ```
     Access in code: 
     ```typescript
     import Constants from 'expo-constants';
     
     const apiUrl = Constants.expoConfig?.extra?.apiUrl;
     const useSampleData = Constants.expoConfig?.extra?.useSampleData;
     ```

This structure provides a standardized approach to API interactions, leveraging React Query for efficient data management and Pydantic-based typing for consistency with the backend. The addition of sample data allows for easier development and testing of UI components when the API is not available or still in development.
