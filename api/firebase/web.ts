import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged as fbOnAuthStateChanged,
  signOut as fbSignOut,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
} from 'firebase/firestore';
import { FirebaseService, AuthUser } from './index';
import Constants from 'expo-constants';

const firebaseConfig = {
    apiKey: "AIzaSyDDoY2mB3tR2J-QbwihPJLoSH3ya9CBRrY",
    authDomain: "mech-2b0ad.firebaseapp.com",
    projectId: "mech-2b0ad",
    storageBucket: "mech-2b0ad.appspot.com",
    messagingSenderId: "396836920221",
    appId: "1:396836920221:web:ff4b5759f0dad6960fed74",
    measurementId: "G-SE4L1C13PR",
    databaseURL: "https://default.nam5.firebasedatabase.app"
}

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