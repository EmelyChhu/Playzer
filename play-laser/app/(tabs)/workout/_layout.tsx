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
          headerTitle: "Workout"
        }} 
      />
      <Stack.Screen 
        name="start"
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="view"
        options={{ 
          headerShown: false,
        }} 
      />
    </Stack>
  );
}