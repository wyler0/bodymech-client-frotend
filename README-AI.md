# TODO:

- Authentication testing
  - On both mobile and web, need to confirm if credentials expire the user is logged out and redirected to the login screen automatically.
  - Security audit

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
- See [here](#user-data-structure) for more details.

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
And also in constants

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



## Data Management

- Firestore used for storing user data and potentially chat messages
- Firebase configuration securely stored in `app.json`

## Authentication

Authentication in the application is implemented using Firebase with platform-specific SDKs and a unified abstraction layer. The system handles both web and mobile platforms differently while maintaining consistent behavior.

### Platform-Specific Implementation

1. **Service Abstraction Layer**
   - Located in `api/firebase/index.ts`
   - Defines common interfaces for auth and firestore operations
   - Uses React Native's Platform.select() to automatically choose the correct implementation:
     - Web: Uses Firebase Web SDK
     - Mobile: Uses React Native Firebase SDK

2. **Web Implementation** (`api/firebase/web.ts`)
   - Uses Firebase Web SDK (`firebase/auth` and `firebase/firestore`)
   - Implements authentication using web-specific methods
   - Handles Firestore operations using web SDK's document references

3. **Mobile Implementation** (`api/firebase/mobile.ts`)
   - Uses React Native Firebase SDK (`@react-native-firebase/auth` and `@react-native-firebase/firestore`)
   - Implements native authentication methods
   - Uses native Firestore operations for better mobile performance

### Authentication Flow

1. **Initial Auth Check** (`app/index.tsx`)
   - Implements an auth state listener using `firebaseService.auth.onAuthStateChanged`
   - Shows loading state while checking authentication
   - Redirects to:
     - Growth dashboard if authenticated
     - Login screen if not authenticated

2. **Login Process**
   - Managed through `app/(login)/index.tsx`
   - Uses platform-specific Firebase authentication
   - Handles validation and error states
   - Redirects to main app on successful login

3. **Registration Process**
   - Implemented in `app/(login)/register.tsx`
   - Creates both authentication and Firestore user records
   - Uses batch writes for atomic operations
   - Stores initial user data:
     - Email
     - Default first/last name
     - Creation timestamp
     - Last login timestamp

4. **Profile Management**
   - Profile data management in `app/(tabs)/(profile)/index.tsx`
   - Fetches user data from Firestore on component mount
   - Displays user information:
     - Name (first/last)
     - Email
     - Account creation date
   - Handles logout functionality

### User Data Structure

```typescript
interface UserData {
email: string;
firstname: string;
lastname: string;
createdAt: FirebaseTimestamp;
}
```
### Firebase Service Interface
```typescript
interface FirebaseService {
auth: {
signIn: (email: string, password: string) => Promise<void>;
signUp: (email: string, password: string) => Promise<AuthUser>;
signOut: () => Promise<void>;
onAuthStateChanged: (callback: (user: AuthUser | null) => void) => () => void;
getCurrentUser: () => AuthUser | null;
};
firestore: {
createUser: (uid: string, userData: any) => Promise<void>;
getUserData: (uid: string) => Promise<any>;
updateUser: (uid: string, userData: any) => Promise<void>;
};
}
```
### Navigation Flow

1. **Login Layout** (`app/(login)/_layout.tsx`)
   - Stack navigator for authentication screens
   - Manages navigation between login and registration

2. **Protected Routes**
   - All routes under `(tabs)` are protected
   - Automatic redirection to login if authentication is lost
   - Profile section shows user data when authenticated

### Error Handling

- Comprehensive error handling for authentication operations
- Platform-specific error messages for better user experience
- Unified error presentation using custom alert system

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
