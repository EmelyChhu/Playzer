import { StyleSheet, ScrollView } from 'react-native';

import { View } from '@/components/Themed';
import { PaperProvider, Text, Button, ActivityIndicator } from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Workout, exampleWorkouts } from '@/types';
import { router } from 'expo-router';
import { LaserPositionCardProps, LaserGridProps } from '@/types';

import React, { useState, useEffect } from 'react';
import { fetchWorkouts } from "@/FirebaseConfig";


export default function WorkoutScreen() {
  const colorScheme = useColorScheme();
  // const workouts: Workout[] = exampleWorkouts;
  const [workout, setWorkout] = useState<Workout | null>(null);
  // console.log(workout);

  useEffect(() => {
    const workoutId = "1"; // TESTING BASIC 1 PREMADE ROUTINE
    // console.log("Fetching workout with ID:", workoutId);

    const loadWorkout = async () => {
      const fetchedWorkout = await fetchWorkouts(workoutId);
      // console.log("Fetched workout:", fetchedWorkout);
      setWorkout(fetchedWorkout);
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
        <Text style={styles.title} variant="headlineMedium">{workout.name}</Text>
        <Text variant="bodyMedium">
            {workout.description}
        </Text>
        <Button style={styles.button} mode='contained' onPress={() => router.push("./connect-start")}>
          <Text style={[styles.buttonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>Start Workout</Text>
        </Button>
        <Text style={styles.title} variant="titleLarge">Workout Details</Text>
        <Text variant="bodyMedium">
          <Text style={{ fontWeight: 'bold' }}>Workout Duration: </Text>
          {Math.floor(workoutDuration / 60)} minutes {workoutDuration % 60} seconds
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
                laserPosition={index}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </PaperProvider>
  );
}

const LaserPositionCard: React.FC<LaserPositionCardProps> = ({ workout, laserPosition }) => {
  const colorScheme = useColorScheme();

  return (
    <View style={[styles.laserPositionCard, {backgroundColor: Colors[colorScheme ?? 'light'].button}]}>
      <LaserGrid 
        numColumns={workout.numColumns}
        numRows={workout.numRows} 
        numPositions={workout.numPositions} 
        laserPosition={workout.laserPositions[laserPosition]} 
      />
      <Text style={[styles.buttonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>
        Laser {laserPosition + 1}
      </Text>
    </View>
  )
}

const LaserGrid: React.FC<LaserGridProps> = ({ numColumns, numRows, numPositions, laserPosition }) => {
  const colorScheme = useColorScheme();
  const laserPositionRow = laserPosition != undefined ? Math.floor((laserPosition - 1) / numColumns) : -1;
  const laserPositionColumn = laserPosition != undefined ? (laserPosition - 1) % numColumns : -1;

  const rows = [];
  for (let i = 0; i < numRows; i++) {
    const columns = [];
    for (let j = 0; j < numColumns; j++) {
      columns.push(
        <View key={`${i}-${j}`} style={[styles.gridItem, {backgroundColor: Colors[colorScheme ?? 'light'].button}]}>
          <FontAwesome
            name="dot-circle-o"
            size={9}
            color={(laserPositionRow == i && laserPositionColumn == j) ? "#422f7f" : "white"} 
          />
        </View>
      );
    }
    rows.push(
      <View key={i} style={[styles.gridRow, {backgroundColor: Colors[colorScheme ?? 'light'].button}]}>
        {columns}
      </View>
    );
  }

  return (
    <View style={[styles.laserGrid, {backgroundColor: Colors[colorScheme ?? 'light'].button}]}>
      {rows}
    </View>
  )
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
    marginLeft: 8,
  },
  button: {
    width: '100%',
    height: 48,
    marginVertical: 16,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  laserPositionCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 16,
    marginBottom: 16,
  },
  laserGrid: {
    marginRight: 32,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  gridItem: {
    width: 8,
    height: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
});
