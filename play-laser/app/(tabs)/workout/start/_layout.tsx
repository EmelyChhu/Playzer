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
        name="index"
        options={{ 
          headerShown: true,
          headerTitle: "Start a Workout",
          headerBackTitle: "Back",
        }} 
      />
      <Stack.Screen 
        name="start-premade"
        options={{ 
          headerShown: true,
          headerTitle: "Premade Routines",
          headerBackTitle: "Back",
        }} 
      />
      <Stack.Screen 
        name="start-routine"
        options={{ 
          headerShown: true,
          headerTitle: "Routine",
          headerBackTitle: "Back",
        }} 
      />
    </Stack>
  );
}