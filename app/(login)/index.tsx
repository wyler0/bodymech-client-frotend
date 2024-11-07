import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import alert from '../../patches/alert';
import { useRouter } from 'expo-router';
import firebaseService from '../../api/firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const createUserDataIfNeeded = async (user: { uid: string, email: string | null }) => {
    try {
      const existingData = await firebaseService.firestore.getUserData(user.uid);
      
      if (!existingData) {
        await firebaseService.firestore.createUser(user.uid, {
          email: user.email,
          firstname: user, // Default name
          lastname: '',
          createdAt: new Date(),
          lastLogin: new Date(),
        });
      } else {
        // Update last login
        await firebaseService.firestore.updateUser(user.uid, {
          lastLogin: new Date(),
        });
      }
    } catch (error) {
      console.error('Error handling user data:', error);
      // Don't throw - we still want to proceed with navigation
    }
  };

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        alert('Error', 'Please enter both email and password');
        return;
      }
      
      await firebaseService.auth.signIn(email, password);
      const currentUser = firebaseService.auth.getCurrentUser();
      
      if (currentUser) {
        await createUserDataIfNeeded(currentUser);
      }
      router.replace('/(tabs)/(growth dashboard)');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login Failed', 'Invalid email or password. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const user = await firebaseService.auth.signInWithGoogle();
      await createUserDataIfNeeded(user);
      router.replace('/(tabs)/(growth dashboard)');
    } catch (error) {
      console.error('Google login error:', error);
      alert('Login Failed', 'Google sign-in failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
      <Button title="Login" onPress={handleLogin} />
      <TouchableOpacity 
        style={styles.googleButton}
        onPress={handleGoogleLogin}
      >
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>
      <Button title="Register" onPress={() => router.push('/register')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  googleButton: {
    backgroundColor: '#4285F4',
    padding: 12,
    borderRadius: 4,
    marginVertical: 8,
  },
  googleButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
