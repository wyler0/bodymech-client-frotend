import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { getCurrentUserData, signOut } from '../../../firebase';
import { useRouter } from 'expo-router';

interface UserData {
  email: string;
  firstname: string;
  lastname: string;
  createdAt: any; // You might want to use a more specific type here
}

export default function ProfileScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const data = await getCurrentUserData();
      setUserData(data as UserData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/(login)');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {userData ? (
        <View>
          <Text style={styles.info}>Name: {userData.firstname} {userData.lastname}</Text>
          <Text style={styles.info}>Email: {userData.email}</Text>
          <Text style={styles.info}>Account created: {userData.createdAt.toDate().toLocaleDateString()}</Text>
        </View>
      ) : (
        <Text>No user data available</Text>
      )}
      <Button title="Log Out" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
});
