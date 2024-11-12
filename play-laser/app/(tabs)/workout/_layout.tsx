import { Stack } from 'expo-router';

export default function WorkoutStackLayout() {
  return (
    <Stack>
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
          headerShown: true,
          headerTitle: "Start a Workout",
          headerBackTitleVisible: false,
        }} 
      />
      <Stack.Screen 
        name="start-premade"
        options={{ 
          headerShown: true,
          headerTitle: "Premade Routines",
          headerBackTitleVisible: false,
        }} 
      />
      <Stack.Screen 
        name="start-routine"
        options={{ 
          headerShown: true,
          headerTitle: "Routine",
          headerBackTitleVisible: false,
        }} 
      />
    </Stack>
  );
}