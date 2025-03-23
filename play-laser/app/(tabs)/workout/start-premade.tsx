import { StyleSheet, ScrollView } from 'react-native';

import { View } from '@/components/Themed';
import { PaperProvider, Text, Button, ActivityIndicator } from 'react-native-paper';
import { Workout, exampleWorkouts } from '@/types';
import NavigationButton from '@/components/NavigationButton';
import { getWorkoutTypeDocs } from "@/FirebaseConfig";
import React, { useState, useEffect } from 'react';

/**
 * StartPremadeRoutinesScreen Component - screen that displays created premade routines
 * 
 * @returns {JSX.Element} - React component that renders the UI
 * 
 * provides 3 categories of premade routines: Basic, Random, and Sport-Specific
 * provides a button for each premade routine that users can click to start that workout (`(tabs)/workout/start-routine`)
 */
export default function StartPremadeRoutinesScreen() {
  const [basicWorkouts, setBasicWorkouts] = useState<string[][]>();
  const [randomWorkouts, setRandomWorkouts] = useState<string[][]>();
  const [sportSpecificWorkouts, setSportSpecificWorkouts] = useState<string[][]>();

  useEffect(() => {
      const loadWorkouts = async () => {
        // RETURNS ARRAY OF ALL WORKOUTS [[type, name, doc id], ...] 
        // const workouts = getWorkoutDocuments();

        // RETURNS ARRAY BY WORKOUT TYPE [[name, doc id], ...]
        const fetchedBasicWorkouts = await getWorkoutTypeDocs("Basic");
        const fetchedRandomWorkouts = await getWorkoutTypeDocs("Random");
        const fetchedSportSpecificWorkouts = await getWorkoutTypeDocs("Sport-Specific");

        setBasicWorkouts(fetchedBasicWorkouts);
        setRandomWorkouts(fetchedRandomWorkouts);
        setSportSpecificWorkouts(fetchedSportSpecificWorkouts);
      };
      loadWorkouts();
    }, []);

  if(!basicWorkouts || !randomWorkouts || !sportSpecificWorkouts) {
    return (
      <PaperProvider>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText} variant="displayLarge">
            Loading workouts...
          </Text>
          <ActivityIndicator animating={true} size={100}/>
        </View>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title} variant="headlineMedium">
          Routines
        </Text>
        <Text variant="bodyMedium">
          Looking for inspiration for your workouts? Check out these routines from our trainers.
        </Text>
        <Text style={styles.subtitle} variant="titleLarge">
          Basic
        </Text>
        <Text variant="bodyMedium">
          Accuracy (Predictable Patterns)
        </Text>
        <View style={styles.routineButtonsContainer}>
          <ScrollView horizontal>
            {basicWorkouts.map((workout, index) => (
              <NavigationButton
                key={index}
                size="small"
                text={workout[0]}
                path={`./start-routine?workoutId=${workout[1]}`}
              />
            ))}
          </ScrollView>
        </View>
        <Text style={styles.subtitle} variant="titleLarge">
          Random
        </Text>
        <Text variant="bodyMedium">
          Reaction Time (Random Patterns)
        </Text>
        <View style={styles.routineButtonsContainer}>
          <ScrollView horizontal style={styles.routineButtonsContainer}>
            {randomWorkouts.map((workout, index) => (
              <NavigationButton
                key={index}
                size="small"
                text={workout[0]}
                path={`./start-routine?workoutId=${workout[1]}`}
              />
            ))}
          </ScrollView>
        </View>
        <Text style={styles.subtitle} variant="titleLarge">
          Sport-Specific
        </Text>
        <Text variant="bodyMedium">
          Relevant (Common Patterns in Each Sport)
        </Text>
        <View style={styles.routineButtonsContainer}>
          <ScrollView horizontal style={styles.routineButtonsContainer}>
            {sportSpecificWorkouts.map((workout, index) => (
              <NavigationButton
                key={index}
                size="small"
                text={workout[0]}
                path={`./start-routine?workoutId=${workout[1]}`}
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
  title: {
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 4,
  },
  subtitle: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  routineButtonsContainer: {
    height: 92,
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
});
