import { StyleSheet, ScrollView } from 'react-native';

import NavigationButton from '@/components/NavigationButton';
import { View } from '@/components/Themed';
import { PaperProvider, Text, Button, ActivityIndicator } from 'react-native-paper';
import { Workout, exampleWorkouts } from '@/types';
import { getWorkoutTypeDocs } from "@/FirebaseConfig";
import React, { useState, useEffect } from 'react';

/**
 * StartCustomRoutinesScreen Component - screen that displays created custom routines and the option to create a new routine
 * 
 * @returns {JSX.Element} - React component that renders the UI
 * 
 * provides a button for each custom routine that users can click to start that workout (`(tabs)/workout/start/start-routine`)
 */
export default function ViewCustomRoutinesScreen() {
  const [customWorkouts, setCustomWorkouts] = useState<string[][]>();
  
  useEffect(() => {
      const loadWorkouts = async () => {
        // RETURNS ARRAY OF ALL WORKOUTS [[type, name, doc id], ...] 
        // const workouts = getWorkoutDocuments();

        // RETURNS ARRAY BY WORKOUT TYPE [[name, doc id], ...]
        const fetchedCustomWorkouts = await getWorkoutTypeDocs("Custom");
        setCustomWorkouts(fetchedCustomWorkouts);
      };
      loadWorkouts();
    }, []);

  if(!customWorkouts) {
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
          View routines you've created or create your own.
        </Text>
        <Text style={styles.subtitle} variant="titleLarge">
          Created
        </Text>
        <View style={styles.routineButtonsContainer}>
          {customWorkouts.length == 0 ?
            <Text style={styles.emptyStateText} variant="bodyLarge">
              You haven't created a custom workout yet! Create a workout to see it here.
            </Text>
            :
            <ScrollView horizontal style={styles.routineButtonsContainer}>
              {customWorkouts.map((workout, index) => (
                <NavigationButton
                  key={index}
                  size="small"
                  text={workout[0]}
                  path={`./start-routine?workoutId=${workout[1]}`}
                />
              ))}
            </ScrollView>
          }
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
  emptyStateText: {
    marginTop: 4,
  }
});
