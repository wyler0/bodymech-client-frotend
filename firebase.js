// Import the functions you need from the SDKs you need
import { Platform } from 'react-native';

let app, auth, firestore;

let firebaseInitialized = false;

// Initialize Firebase. Requires separate import for web and native, as firebase library and setups are different for each.
const firebaseInitializationPromise = new Promise((resolve) => {
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
  if (Platform.OS === 'web') {
    // Web Firebase import
    import('firebase/app').then((firebase) => {
      app = firebase.initializeApp(firebaseConfig);
      import('firebase/auth').then((module) => {
        auth = module.getAuth(app);
        import('firebase/firestore').then((module) => {
          firestore = module.getFirestore(app);
          firebaseInitialized = true;
          resolve();
        });
      });
    });
  } else {
    // React Native Firebase import
    Promise.all([
      import('@react-native-firebase/app'),
      import('@react-native-firebase/auth'),
      import('@react-native-firebase/firestore')
    ]).then(([appModule, authModule, firestoreModule]) => {
      if (!appModule.apps.length) {
        app = appModule.initializeApp(firebaseConfig);
      } else {
        app = appModule.app();
      }
      auth = authModule.default();
      firestore = firestoreModule.default();
      firebaseInitialized = true;
      resolve();
    });
  }
});

export const initializeFirebase = async () => {
  if (!firebaseInitialized) {
    await firebaseInitializationPromise;
  }
  return app;
};

export const getApp = () => app;
export const getAuth = () => auth;
export const getFirestore = () => {
  if (Platform.OS === 'web') {
    return firestore;
  } else {
    return firestore();
  }
};

// New function for user registration
export const registerUser = async (email, password) => {
  if (!auth) {
    throw new Error('Auth is not initialized');
  }
  try {
    let userCredential;
    if (Platform.OS === 'web') {
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
    } else {
      userCredential = await auth.createUserWithEmailAndPassword(email, password);
    }
    return userCredential.user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// New function to create user in Firestore
export const createUserInFirestore = async (user, additionalData = {}) => {
  if (!firestore) {
    throw new Error('Firestore is not initialized');
  }
  try {
    let userRef;
    if (Platform.OS === 'web') {
      const { doc, setDoc } = await import('firebase/firestore');
      userRef = doc(firestore, 'users', user.uid);
      await setDoc(userRef, {
        email: user.email,
        createdAt: new Date(),
        ...additionalData
      });
    } else {
      userRef = firestore().collection('users').doc(user.uid);
      await userRef.set({
        email: user.email,
        createdAt: new Date(),
        ...additionalData
      });
    }
  } catch (error) {
    console.error('Error creating user in Firestore:', error);
    throw error;
  }
};

// Helper function to get the current user
export const getCurrentUser = () => {
  return auth ? auth.currentUser : null;
};

// Helper function to get the current user's data
export const getCurrentUserData = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  if (Platform.OS === 'web') {
    const { doc, getDoc } = await import('firebase/firestore');
    const userDoc = await getDoc(doc(firestore, 'users', user.uid));
    return userDoc.data();
  } else {
    const userDoc = await firestore().collection('users').doc(user.uid).get();
    return userDoc.data();
  }
};

// Update the signOut function
export const signOut = async () => {
  if (auth) {
    try {
      if (Platform.OS === 'web') {
        await auth.signOut();
      } else {
        await auth().signOut();
      }
    } catch (error) {
      console.error('Error signing out: ', error);
      throw error;
    }
  }
};

// New function for user login
export const loginUser = async (email, password) => {
  if (!auth) {
    throw new Error('Auth is not initialized');
  }
  try {
    let userCredential;
    if (Platform.OS === 'web') {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      userCredential = await signInWithEmailAndPassword(auth, email, password);
    } else {
      userCredential = await auth.signInWithEmailAndPassword(email, password);
    }
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export default app;
