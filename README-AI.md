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

# Views

## Chat Implementation

- Implemented a two-level chat system with a conversations list and individual chat screens.
- Used Expo Router for navigation between screens.

### Conversations List
- Located in `app/(tabs)/(conversations)/index.tsx`
- Displays a list of all conversations
- Each item shows:
  - Contact name
  - Last message
  - Timestamp (relative time using a custom formatting function)
  - Unread message count (if any)
- Tapping an item navigates to the individual chat screen

### Custom Utilities
- Implemented a custom `formatRelativeTime` function to display relative timestamps without relying on external libraries

### Individual Chat Screen
- Located in `app/(tabs)/(conversations)/chat/[id].tsx`
- Uses React Native Gifted Chat for the chat interface
- Allows sending text messages and images
- Starts with an empty chat if no existing conversation is found or for new chats
- Loads the last message from the conversation data if an existing conversation is found

### Future Improvements
- Implement real-time message updates using WebSockets or a real-time database
- Add user authentication and link conversations to user accounts
- Implement message persistence using local storage or a backend database
- Add support for more message types (voice, video, documents)
- Implement read receipts and typing indicators

### Navigation and Routing
- Used Expo Router for navigation between screens
- Implemented dynamic header titles for chat screens in `app/(tabs)/(conversations)/_layout.tsx`
- Chat screen headers now display the avatar and name of the conversation partner
- Created a custom ChatHeader component to show avatar and name in the header
- Added proper TypeScript typing for route params to ensure type safety
- Customized the back navigation for chat screens to show only the back arrow without text

# Routine Dashboard
### Routine Dashboard Navigation
- Implemented in `app/(tabs)/(routine dashboard)/_layout.tsx`
- Uses Stack navigation for moving between routine dashboard and individual exercise details
- Customized headers:
  - Routine Dashboard shows "Routine Dashboard" as the title
  - Exercise detail views show the name of the specific exercise
  - Back navigation shows only the arrow without text
- Dynamic title setting for exercise screens based on the exercise data
- Proper TypeScript typing for route params to ensure type safety
