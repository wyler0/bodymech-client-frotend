import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged as fbOnAuthStateChanged,
  signOut as fbSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { FirebaseService } from './index';
import { WebUploadType, MobileUploadType } from '../types/firebase';

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
const storage = getStorage(app);

const webFirebaseService: FirebaseService = {
  auth: {
    signIn: async (email: string, password: string) => {
      await signInWithEmailAndPassword(auth, email, password);
    },
    signUp: async (email: string, password: string, name: string, photoURL: string | null) => {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name,
          photoURL: photoURL,
        });
      }

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
      auth.languageCode = 'en';
      
      try {
        const result = await signInWithPopup(auth, provider);
        const name = result.user.displayName || '';
        const photoURL = result.user.photoURL;
        
        await webFirebaseService.firestore.createUser(result.user.uid, {
          email: result.user.email,
          name: name,
          photoURL: photoURL,
          createdAt: new Date(),
          lastLogin: new Date(),
        });

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
    updateProfile: async (uid: string, data: { photoURL?: string | null, displayName?: string }) => {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user is currently signed in');
      }
      await updateProfile(user, data);
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
  storage: {
    uploadProfilePhoto: async (
      uid: string, 
      file: WebUploadType | MobileUploadType
    ): Promise<string> => {
      if (!('type' in file)) {
        throw new Error('Invalid file type for web upload');
      }

      const photoRef = storageRef(storage, `profile-photos/${uid}`);
      await uploadBytes(photoRef, file);
      const downloadURL = await getDownloadURL(photoRef);
      return downloadURL;
    },
  },
};

export default webFirebaseService; 