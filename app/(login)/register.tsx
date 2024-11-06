import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Image, Platform, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import alert from '../../patches/alert';
import { useRouter } from 'expo-router';
import firebaseService from '../../api/firebase';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Error', 'Failed to pick image');
    }
  };

  const uploadPhoto = async (uid: string, uri: string): Promise<string> => {
    try {
      // Convert image URI to blob for web
      const response = await fetch(uri);
      const blob = await response.blob();
      
      // Upload to Firebase Storage
      const photoURL = await firebaseService.storage.uploadProfilePhoto(uid, blob);
      return photoURL;
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw new Error('Failed to upload profile photo');
    }
  };

  const register = async () => {
    try {
      setIsLoading(true);

      // Validate required inputs
      if (!email || !password || !name) {
        alert('Error', 'Please fill in all required fields (name, email, password)');
        return;
      }

      // First create the auth user
      const user = await firebaseService.auth.signUp(email, password, name, null);
      
      // If there's a photo, upload it
      let photoURL = null;
      if (photo) {
        photoURL = await uploadPhoto(user.uid, photo);
      }

      // Create user document in Firestore
      await firebaseService.firestore.createUser(user.uid, {
        email: user.email,
        fullName: name,
        photoURL: photoURL,
        createdAt: new Date(),
        lastLogin: new Date(),
      });

      // Update auth profile with photo URL if available
      if (photoURL) {
        await firebaseService.auth.updateProfile(user.uid, { photoURL });
      }

      alert('Success', 'User account created & signed in!');
      router.replace('/(tabs)/(growth dashboard)');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        alert('Error', 'That email address is already in use!');
      } else if (error.code === 'auth/invalid-email') {
        alert('Error', 'That email address is invalid!');
      } else {
        alert('Error', error.message || 'An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.photoContainer}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder} />
        )}
        <Button 
          title="Choose Photo (Optional)" 
          onPress={pickImage}
          disabled={isLoading}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Full Name *"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Email *"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Password *"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />
      <Text style={styles.requiredText}>* Required fields</Text>
      <Button 
        title={isLoading ? "Creating Account..." : "Register"} 
        onPress={register}
        disabled={isLoading}
      />
      <Button 
        title="Back to Login" 
        onPress={() => router.back()} 
        disabled={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e1e1e1',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  requiredText: {
    color: 'gray',
    fontSize: 12,
    marginBottom: 10,
    fontStyle: 'italic',
  },
});
