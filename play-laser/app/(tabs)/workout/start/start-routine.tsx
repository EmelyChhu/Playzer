import { StyleSheet, ScrollView } from 'react-native';

import { View } from '@/components/Themed';
import { PaperProvider, Text, Button, ActivityIndicator } from 'react-native-paper';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import LaserPositionCard from '@/components/LaserPositionCard';
import { Workout } from '@/types';
import { router } from 'expo-router';

import React, { useState, useEffect } from 'react';
import { fetchWorkouts } from "@/FirebaseConfig";


export default function WorkoutScreen() {
  const colorScheme = useColorScheme();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const workoutId = "1"; // TESTING BASIC 1 PREMADE ROUTINE
    // console.log("Fetching workout with ID:", workoutId);

    const loadWorkout = async () => {
      const fetchedWorkout = await fetchWorkouts(workoutId);
      // console.log("Fetched workout:", fetchedWorkout);
      setWorkout(fetchedWorkout);
      setMinutes(Math.floor(workoutDuration / 60));
      setSeconds(workoutDuration % 60);
    };
    loadWorkout();
  }, []);

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

  const workoutDuration = workout.laserPositions.length * (workout.durationBetweenLasers + workout.laserDuration);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title} variant="headlineMedium">
          {workout.name}
        </Text>
        <Text variant="bodyMedium">
            {workout.description}
        </Text>
        <Button
          style={styles.button}
          mode='contained'
          onPress={() => router.push("./connect-start")}
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
          {minutes > 0 && `${minutes} minutes`} {seconds} seconds
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
    // marginLeft: 8,
  },
  button: {
    width: '100%',
    height: 48,
    marginVertical: 16,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
