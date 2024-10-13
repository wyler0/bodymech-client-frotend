import { Tabs } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name="(growth dashboard)"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="sprout" color={color} size={size} />
          ),
          tabBarLabel: 'Growth',
        }}
      />
      <Tabs.Screen
        name="(routine dashboard)"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="dumbbell" color={color} size={size} />
          ),
          tabBarLabel: 'Routine',
        }}
      />
      <Tabs.Screen
        name="(chat)"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="message" color={color} size={size} />
          ),
          tabBarLabel: 'Chat',
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" color={color} size={size} />
          ),
          tabBarLabel: 'Profile',
        }}
      />
    </Tabs>
  );
}
