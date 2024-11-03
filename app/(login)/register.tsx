import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import alert from '../../patches/alert';
import { useRouter } from 'expo-router';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const register = async () => {
    try {
      // Validate inputs
      if (!email || !password) {
        alert('Error', 'Please fill in all fields');
        return;
      }

      // Create auth user
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      
      // Create user document in Firestore using a batch write for atomicity
      const batch = firestore().batch();
      const userRef = firestore()
        .collection('users')
        .doc(userCredential.user.uid);

      batch.set(userRef, {
        email: userCredential.user.email,
        firstname: 'John',
        lastname: 'Doe',
        createdAt: firestore.FieldValue.serverTimestamp(),
        lastLogin: firestore.FieldValue.serverTimestamp(),
      });

      await batch.commit();

      alert('Success', 'User account created & signed in!');
      // Registration successful, user will be automatically redirected to the main app
    } catch (error: unknown) {
      // Type guard to check if error is a FirebaseAuthTypes.NativeFirebaseAuthError
      if (error && typeof error === 'object' && 'code' in error) {
        const authError = error as FirebaseAuthTypes.NativeFirebaseAuthError;
        
        if (authError.code === 'auth/email-already-in-use') {
          alert('Error', 'That email address is already in use!');
        } else if (authError.code === 'auth/invalid-email') {
          alert('Error', 'That email address is invalid!');
        } else {
          alert('Error', authError.message || 'An unknown error occurred');
        }
      } else {
        alert('Error', 'An unknown error occurred');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Register" onPress={register} />
      <Button title="Back to Login" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
});
