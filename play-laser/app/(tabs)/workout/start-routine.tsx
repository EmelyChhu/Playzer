import { StyleSheet, ScrollView, Pressable } from 'react-native';

import { View } from '@/components/Themed';
import { PaperProvider, Text, Button, ActivityIndicator } from 'react-native-paper';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import LaserPositionCard from '@/components/LaserPositionCard';
import { Workout } from '@/types';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import React, { useState, useEffect } from 'react';
import { fetchWorkouts, removeWorkout } from "@/FirebaseConfig";
import { useLocalSearchParams } from 'expo-router';

/**
 * StartRoutineScreen Component - screen that provides information for a given workout routine
 * 
 * @returns {JSX.Element} - React component that renders the UI
 * 
 * provides "Start Workout" button that will navigate to the screen to start the workout (`(tabs)/workout/connect-start`)
 * provides the workout's duration, laser duration, duration between lasers, and a card for each laser position
 */
export default function StartRoutineScreen() {
  const colorScheme = useColorScheme();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  
  const { workoutId } = useLocalSearchParams();

  useEffect(() => {
    // const workoutId = "QTTJdK3H0jS6yLcAItvg";
    // const workoutId = "1"; // TESTING BASIC 1 PREMADE ROUTINE
    console.log("Fetching workout with ID:", workoutId);

    const loadWorkout = async () => {
      const fetchedWorkout = await fetchWorkouts(workoutId);

      // RETURNS ALL INFO ON DOCUMENT CALLED
      console.log("Fetched workout:", fetchedWorkout);

      setWorkout(fetchedWorkout);
      const workoutDuration = fetchedWorkout.laserPositions.length * (fetchedWorkout.durationBetweenLasers + fetchedWorkout.laserDuration);
      setMinutes(Math.floor(workoutDuration / 60));
      setSeconds(workoutDuration % 60);
      // console.log(workoutDuration, minutes, seconds)
    };
    loadWorkout();
  }, []);

  const handleDeleteRoutine = async () => {
    await removeWorkout(workoutId);
    router.push("/(tabs)/workout/start-custom");
  }

  if(!workout) {
    return (
      <PaperProvider>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText} variant="displayLarge">
            Loading workout...
          </Text>
          <ActivityIndicator animating={true} size={100}/>
        </View>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} variant="headlineMedium">
            {workout.name}
          </Text>
          {workout.type == "Custom" ?
            <Pressable
              onPress={() => handleDeleteRoutine(workoutId)}
              style={styles.removeButton}
            >
              <FontAwesome name="trash" size={22} color="#fa9b9b" />
            </Pressable>
          :
          null}
        </View>
        <Text variant="bodyMedium">
            {workout.description}
        </Text>
        <Button
          style={styles.button}
          mode='contained'
          onPress={() => router.push(`./connect-start?workoutId=${workoutId}`)}
        >
          <Text style={[styles.buttonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>
            Start Workout
          </Text>
        </Button>
        <Text style={styles.title} variant="titleLarge">
          Workout Details
        </Text>
        <Text variant="bodyMedium">
          <Text style={{ fontWeight: 'bold' }}>Workout Duration: </Text>
          {minutes > 0 && `${minutes} minutes `}{seconds} seconds
        </Text>
        <Text variant="bodyMedium">
          <Text style={{ fontWeight: 'bold' }}>Laser Duration: </Text>
          {workout.laserDuration} seconds
        </Text>
        <Text variant="bodyMedium">
          <Text style={{ fontWeight: 'bold' }}>Duration Between Lasers: </Text>
          {workout.durationBetweenLasers} seconds
        </Text>
        <View style={styles.scrollViewContainer}>
          <ScrollView>
            {workout.laserPositions.map((laserPosition, index) => (
              <LaserPositionCard
                key={index}
                workout={workout}
                index={index}
                laserPosition={laserPosition}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 16,
  },
  titleContainer: {
    width: '100%',
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  scrollViewContainer: {
    flex: 1,
    width: '100%',
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 32,
  },
  loadingText: {
    textAlign: 'center',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 4,
  },
  buttonText: {
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 48,
    marginVertical: 16,
    justifyContent: 'center',
  },
  removeButton: {
    marginLeft: 12,
    marginBottom: 4,
  },
});