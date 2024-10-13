import { Stack } from 'expo-router';

export default function RoutineDashboardLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Routine Dashboard",
        }}
      />
    </Stack>
  );
}
