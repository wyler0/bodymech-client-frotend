# TODO:

- Authentication for mobile (android and ios)
- - not setup nor tested
- - Firebase requires app store bundle IDs and such which won't happen until I do ios deployment on device 
- - need to update login/register calls, add certs, update types in api/types/firebase.ts

# Views

## Growth Dashboard

The growth dashboard is the homepage for the user. It displays the user's progress and goals.

## Routine Dashboard

The routine dashboard is a list of exercises that the user can select to view more information about.

### Navigation
- Implemented in `app/(tabs)/(routine dashboard)/_layout.tsx`
- Uses Stack navigation for routine dashboard and exercise details
- Custom headers:
  - Main dashboard titled "Routine Dashboard"
  - Exercise screens dynamically titled based on the specific exercise
  - Simplified back navigation (arrow only, no text)

## Chat

The app features a two-level chat system, consisting of a conversations list and individual chat screens.

### Conversations List
- Located in `app/(tabs)/(conversations)/index.tsx`
- Displays all user conversations, showing:
  - Contact name
  - Last message preview
  - Timestamp (using a custom relative time format)
  - Unread message count (if applicable)

### Individual Chat Screen
- Found in `app/(tabs)/(conversations)/chat/[id].tsx`
- Utilizes React Native Gifted Chat for the chat interface
- Supports text messages and image sharing
- Handles both existing conversations and new chat creation

### New Chat Creation
- Implemented via a popover interface (`NewChatPopover.tsx`)
- Allows user selection and initial message composition
- Seamlessly integrates with the existing chat system

### Custom Utilities
- `formatRelativeTime` function: Provides human-readable relative timestamps without external dependencies

## Profile Management

- User profile information display and management (`app/(tabs)/(profile)/index.tsx`)
- Fetches and displays user data from Firestore
- Provides logout functionality



# Architecture and Implementation

## Environment Configuration

Environment variables are configured in `app.json` under the `extra` field.

```json:app.json
     {
       "expo": {
         "extra": {
           "apiUrl": "https://api.yourapp.com",
           "useSampleData": true,
           "firebaseConfig": {
             ...
           }
         }
       }
     }
```
## Data Management

- Firestore used for storing user data and potentially chat messages
- Firebase configuration securely stored in `app.json`

## Authentication

Authentication is implemented using Firebase. Packages `firebase-react-native` and `firebase` are both used.

### Platform Compatibility
- `firebase.js`:
  - Handles platform compatibility via platform checks (iOS, android, web), ensuring that the correct Firebase configuration and authentication functions are used for each platform.
- `app.json`:
  - Added platform-specific Firebase configurations under `expo.extra.firebaseConfig`.
  - Separate configurations for web, iOS, and Android.

### Registration and Authentication Implementation

1. Root Layout (`app/_layout.tsx`):
   - Implemented a check for user authentication status using Firebase's `onAuthStateChanged`.
   - Added conditional rendering to show either the login/register screens or the main app based on authentication status.

2. Login Layout (`app/(login)/_layout.tsx`):
   - Created a stack navigator for login-related screens (login and register).

3. Registration Page (`app/(login)/register.tsx`):
   - Implemented a registration form with email and password fields.
   - Used Firebase's `createUserWithEmailAndPassword` for user registration.
   - Added error handling and display for registration failures.
   - Included navigation back to the login page.

4. Login Page (`app/(login)/index.tsx`):
   - Implemented a login form with email and password fields.
   - Used Firebase's `signInWithEmailAndPassword` for user authentication.
   - Added error handling and display for login failures.
   - Included navigation to the registration page.

5. Authentication Flow:
   - On successful login or registration, Firebase automatically updates the auth state.
   - The root layout listens for auth state changes and redirects to the main app when authenticated.

6. Error Handling:
   - Implemented basic error handling for login and registration processes.
   - Displayed user-friendly error messages on the respective screens.

7. Navigation:
   - Utilized Expo Router for navigation between login and registration screens.
   - Implemented automatic redirection to the main app upon successful authentication.

9. Typing:
   - Custom types are defined in `api/types/firebase.ts` due to mobile vs web firebase imports differing. 

These implementations create a secure and user-friendly authentication flow, integrating Firebase for user management and leveraging Expo Router for seamless navigation.

### Firebase Authentication Persistence

Firebase handles authentication persistence automatically.


## Navigation and Routing

The app uses Expo Router for navigation, providing a file-system based routing approach.

- Dynamic header titles for chat screens (`app/(tabs)/(conversations)/_layout.tsx`)
- Custom ChatHeader component for displaying avatar and name in chat headers
- TypeScript integration for route params to ensure type safety


## Patches

Patches folder contains changes made to internal packages for compatibility with all supported platforms (e.g., web, iOS, Android). 

1. Alert
   - alert.js patches the expo-router alert package to add web compatibility.
   - Usage:
     ```typescript
     import alert from '../patches/alert';
     alert('Title', 'Description');
     ```

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
           "useSampleData": true,
           "firebaseConfig": {
             ...
           }
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

