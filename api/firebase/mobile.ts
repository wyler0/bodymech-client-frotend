import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { FirebaseService, AuthUser } from './index';

const mobileFirebaseService: FirebaseService = {
  auth: {
    signIn: async (email: string, password: string) => {
      await auth().signInWithEmailAndPassword(email, password);
    },
    signUp: async (email: string, password: string) => {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      };
    },
    signOut: () => auth().signOut(),
    onAuthStateChanged: (callback) => {
      return auth().onAuthStateChanged((user) => {
        callback(user ? { uid: user.uid, email: user.email } : null);
      });
    },
    getCurrentUser: () => {
      const user = auth().currentUser;
      return user ? { uid: user.uid, email: user.email } : null;
    },
  },
  firestore: {
    createUser: async (uid: string, userData: any) => {
      await firestore().collection('users').doc(uid).set(userData);
    },
    getUserData: async (uid: string) => {
      const doc = await firestore().collection('users').doc(uid).get();
      return doc.data();
    },
    updateUser: async (uid: string, userData: any) => {
      await firestore().collection('users').doc(uid).set(userData, { merge: true });
    },
  },
};

export default mobileFirebaseService; 