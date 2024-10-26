import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';

import alert from '../../patches/alert';
import { registerUser, createUserInFirestore } from '../../firebase';
import { useRouter } from 'expo-router';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const register = async () => {
    try {
      const user = await registerUser(email, password);
      await createUserInFirestore(user, { firstname: 'John', lastname: 'Doe' });
      alert('Success', 'User account created & signed in!');
      // Registration successful, user will be automatically redirected to the main app
    } catch (error) {
      alert('Error', error instanceof Error ? error.message : 'An unknown error occurred');
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
