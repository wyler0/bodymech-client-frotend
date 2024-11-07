import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { FirebaseService } from './index';
import { MobileUploadType, WebUploadType } from '../types/firebase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';

// Initialize Google Sign-In
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_FIREBASE_WEB_ANDROID_CLIENT_ID, // This might need to be the android client id (ios doesn thave client id for client type 3, only andorid)
});

const mobileFirebaseService: FirebaseService = {
  auth: {
    signIn: async (email: string, password: string) => {
      await auth().signInWithEmailAndPassword(email, password);
    },
    signUp: async (email: string, password: string, name: string, photoURL: string | null) => {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      
      // Update the user profile if name or photo provided
      if (name || photoURL) {
        await userCredential.user.updateProfile({
          displayName: name,
          photoURL: photoURL,
        });
      }

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
    signInWithGoogle: async () => {
      try {
        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        
        // Sign in and get user info
        const userInfo = await GoogleSignin.signIn();
        
        if (!userInfo.data?.idToken) {
          throw new Error('No ID token present');
        }

        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(userInfo.data.idToken);

        // Sign-in with credential
        const userCredential = await auth().signInWithCredential(googleCredential);

        await mobileFirebaseService.firestore.createUser(userCredential.user.uid, {
          email: userCredential.user.email,
          name: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL,
          createdAt: new Date(),
          lastLogin: new Date(),
        });
        
        return {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
        };
      } catch (error) {
        console.error('Google sign in error:', error);
        throw error;
      }
    },
    updateProfile: async (uid: string, data: { photoURL?: string | null, displayName?: string }) => {
      const user = auth().currentUser;
      if (!user) {
        throw new Error('No user is currently signed in');
      }
      await user.updateProfile(data);
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
  storage: {
    uploadProfilePhoto: async (
      uid: string, 
      file: WebUploadType | MobileUploadType
    ): Promise<string> => {
      try {
        if (!('uri' in file)) {
          throw new Error('Invalid file type for mobile upload');
        }

        // Ensure we're authenticated
        const user = auth().currentUser;
        if (!user) {
          throw new Error('User must be authenticated to upload');
        }

        // Create a simple reference without explicit bucket
        const filename = `${uid}_${Date.now()}.jpg`;
        const photoRef = storage().ref(`profile-photos/${filename}`);

        console.log('Starting upload...');
        console.log('File URI:', file.uri);
        console.log('Storage path:', photoRef.fullPath);

        // Try direct upload without task monitoring
        const snapshot = await photoRef.putFile(file.uri);
        console.log('Upload completed:', snapshot);

        // Get the download URL
        const downloadURL = await photoRef.getDownloadURL();
        console.log('Download URL:', downloadURL);

        // Update user profile
        await user.updateProfile({
          photoURL: downloadURL,
        });

        return downloadURL;
      } catch (error) {
        console.error('Error uploading profile photo:', error);
        throw error;
      }
    },
  },
};

export default mobileFirebaseService; 


// final TaskSnapshot snapshot = await reference.putFile(imageToUpload);

// final downloadUrl = await snapshot.ref.getDownloadURL();