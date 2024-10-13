import { Stack } from 'expo-router';

export default function GrowthDashboardLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Growth Dashboard",
        }}
      />
    </Stack>
  );
}
