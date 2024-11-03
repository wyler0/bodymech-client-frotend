import { Platform } from 'react-native';
//import Constants from 'expo-constants';

export interface AuthUser {
  uid: string;
  email: string | null;
}

export interface FirebaseTimestamp {
  toDate: () => Date;
  seconds: number;
  nanoseconds: number;
}

export interface UserData {
  email: string;
  firstname: string;
  lastname: string;
  createdAt: FirebaseTimestamp;
}

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

// Initialize Firebase configuration
//export const firebaseConfig = Constants.expoConfig?.extra?.firebaseConfig;
export const firebaseConfig = {
    apiKey: "AIzaSyDDoY2mB3tR2J-QbwihPJLoSH3ya9CBRrY",
    authDomain: "mech-2b0ad.firebaseapp.com",
    projectId: "mech-2b0ad",
    storageBucket: "mech-2b0ad.appspot.com",
    messagingSenderId: "396836920221",
    appId: "1:396836920221:web:ff4b5759f0dad6960fed74",
    measurementId: "G-SE4L1C13PR",
    databaseURL: "https://default.nam5.firebasedatabase.app"
}

// Platform-specific implementation will be imported
const firebaseService: FirebaseService = Platform.select({
  web: () => require('./web').default,
  default: () => {
    return require('./mobile').default;
  },
})();

export default firebaseService; 