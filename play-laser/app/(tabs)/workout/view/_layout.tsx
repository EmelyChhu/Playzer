import { Stack } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function WorkoutStackLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].headerBackground,
        },
        headerTintColor: Colors[colorScheme ?? 'light'].text,
      }}>
      <Stack.Screen 
        name="view-custom"
        options={{ 
          headerShown: true,
          headerTitle: "Custom Routines",
          headerBackTitle: "Back",
        }} 
      />
      <Stack.Screen 
        name="create-custom"
        options={{ 
          headerShown: true,
          headerTitle: "Create a Routine",
          headerBackTitle: "Back",
        }} 
      />
    </Stack>
  );
}