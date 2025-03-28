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
          headerTitle: "Workout",
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
        name="start-custom"
        options={{ 
          headerShown: true,
          headerTitle: "Custom Routines",
          headerBackTitle: "Back",
        }} 
      />
      <Stack.Screen 
        name="create-custom-1"
        options={{ 
          headerShown: true,
          headerTitle: "Create a Routine",
          headerBackTitle: "Back",
        }} 
      />
      <Stack.Screen 
        name="create-custom-2"
        options={{ 
          headerShown: true,
          headerTitle: "Create a Routine",
          headerBackTitle: "Back",
        }} 
      />
      <Stack.Screen 
        name="start-random"
        options={{ 
          headerShown: true,
          headerTitle: "Random Routine Settings",
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
      <Stack.Screen 
        name="connect-start"
        options={{ 
          headerShown: true,
          headerTitle: "Start Routine",
          headerBackTitle: "Back",
        }} 
      />
    </Stack>
  );
}
