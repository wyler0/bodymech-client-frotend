import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GrowthDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Growth Dashboard</Text>
      <Text>Welcome to your growth dashboard!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
