import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import alert from '../../../patches/alert';
import firebaseService from '../../../api/firebase';
import { UserData } from '../../../api/types/firebase';

export default function ProfileScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = firebaseService.auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        setLoading(false);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid: string) => {
    try {
      const data = await firebaseService.firestore.getUserData(uid);
      
      if (data) {
        setUserData(data as UserData);
      } else {
        alert('Error', 'User data not found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      alert('Error', 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await firebaseService.auth.signOut();
      router.replace('/(login)');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Error', 'Failed to log out');
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
          <Text style={styles.info}>
            Account created: {userData.createdAt?.toDate().toLocaleDateString() || 'N/A'}
          </Text>
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
