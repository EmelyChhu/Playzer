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
    </Stack>
  );
}