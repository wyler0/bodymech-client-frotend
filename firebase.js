import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  initializeFirestore,
  CACHE_SIZE_UNLIMITED
} from 'firebase/firestore';

let app, auth, firestore;
let firebaseInitialized = false;

const initializeFirebase = async () => {
  if (firebaseInitialized) return;

  const firebaseConfig = {
    apiKey: "AIzaSyDDoY2mB3tR2J-QbwihPJLoSH3ya9CBRrY",
    authDomain: "mech-2b0ad.firebaseapp.com",
    projectId: "mech-2b0ad",
    storageBucket: "mech-2b0ad.appspot.com",
    messagingSenderId: "396836920221",
    appId: "1:396836920221:web:ff4b5759f0dad6960fed74",
    measurementId: "G-SE4L1C13PR",
    databaseURL: "https://default.nam5.firebasedatabase.app",
  };
  
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  firestore = initializeFirestore(app, {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  });
  firebaseInitialized = true;
};

export const getAuthInstance = async () => {
  if (!auth) {
    await initializeFirebase();
  }
  return auth;
};

export const getAuthInstanceSync = () => {
  if (!auth) {
    console.warn('Auth not initialized, call getAuthInstance() first');
    return null;
  }
  return auth;
};

export const registerUser = async (email, password) => {
  const authInstance = await getAuthInstance();
  try {
    const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const createUserInFirestore = async (user, additionalData = {}) => {
  if (!firestore) {
    throw new Error('Firestore is not initialized');
  }
  try {
    const userRef = doc(firestore, 'users', user.uid);
    await setDoc(userRef, {
      email: user.email,
      createdAt: new Date(),
      ...additionalData
    });
  } catch (error) {
    console.error('Error creating user in Firestore:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  const authInstance = await getAuthInstance();
  return authInstance.currentUser;
};

export const getCurrentUserData = async () => {
  const authInstance = await getAuthInstance();
  const user = authInstance.currentUser;
    
  if (!user) return null;
  
  const userDoc = await getDoc(doc(firestore, 'users', user.uid));
  return userDoc.data();
};

export const signOut = async () => {
  const authInstance = await getAuthInstance();
  try {
    await authInstance.signOut();
  } catch (error) {
    console.error('Error signing out: ', error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  const authInstance = await getAuthInstance();
  try {
    const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export default app;