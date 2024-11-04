import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged as fbOnAuthStateChanged,
  signOut as fbSignOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
} from 'firebase/firestore';
import { FirebaseService } from './index';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const webFirebaseService: FirebaseService = {
  auth: {
    signIn: async (email: string, password: string) => {
      await signInWithEmailAndPassword(auth, email, password);
    },
    signUp: async (email: string, password: string) => {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      };
    },
    signOut: () => fbSignOut(auth),
    onAuthStateChanged: (callback) => {
      return fbOnAuthStateChanged(auth, (user) => {
        callback(user ? { uid: user.uid, email: user.email } : null);
      });
    },
    getCurrentUser: () => {
      const user = auth.currentUser;
      return user ? { uid: user.uid, email: user.email } : null;
    },
    signInWithGoogle: async () => {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      auth.languageCode = 'en'; // Set language to English
      
      try {
        const result = await signInWithPopup(auth, provider);
        //https://stackoverflow.com/questions/46314056/how-to-get-just-the-first-name-when-a-user-logs-in-using-social-media-with-fireb
        const name = result.user.displayName; 
        const photoURL = result.user.photoURL;
        const providerId = result.user.providerId;
        const phoneNumber = result.user.phoneNumber;

        return {
          uid: result.user.uid,
          email: result.user.email,
        };
      } catch (error: any) {
        if (error.code === 'auth/account-exists-with-different-credential') {
          throw new Error('An account already exists with the same email address but different sign-in credentials.');
        }
        throw error;
      }
    },
  },
  firestore: {
    createUser: async (uid: string, userData: any) => {
      await setDoc(doc(db, 'users', uid), userData);
    },
    getUserData: async (uid: string) => {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      return docSnap.data();
    },
    updateUser: async (uid: string, userData: any) => {
      await setDoc(doc(db, 'users', uid), userData, { merge: true });
    },
  },
};

export default webFirebaseService; 