import { Platform } from 'react-native';
import { AuthUser } from '../types/firebase';
//import Constants from 'expo-constants';

export interface FirebaseService {
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

// Platform-specific implementation will be imported
const firebaseService: FirebaseService = Platform.select({
  web: () => require('./web').default,
  default: () => {
    return require('./mobile').default;
  },
})();

export default firebaseService; 