import { Platform } from 'react-native';
import { AuthUser, WebUploadType, MobileUploadType } from '../types/firebase';
//import Constants from 'expo-constants';

export interface FirebaseService {
  auth: {
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string, photoURL: string | null) => Promise<AuthUser>;
    signOut: () => Promise<void>;
    onAuthStateChanged: (callback: (user: AuthUser | null) => void) => () => void;
    getCurrentUser: () => AuthUser | null;
    signInWithGoogle: () => Promise<AuthUser>;
    updateProfile: (uid: string, data: { photoURL?: string | null, displayName?: string }) => Promise<void>;
  };
  firestore: {
    createUser: (uid: string, userData: any) => Promise<void>;
    getUserData: (uid: string) => Promise<any>;
    updateUser: (uid: string, userData: any) => Promise<void>;
  };
  storage: {
    uploadProfilePhoto: (uid: string, file: WebUploadType | MobileUploadType) => Promise<string>;
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