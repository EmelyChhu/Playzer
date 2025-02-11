import { StyleSheet, ScrollView } from 'react-native';

import { View } from '@/components/Themed';
import { PaperProvider, Text, Button } from 'react-native-paper';
import { Workout, exampleWorkouts } from '@/types';
import NavigationButton from '@/components/NavigationButton';

/**
 * StartPremadeRoutinesScreen Component - screen that displays created premade routines
 * 
 * @returns {JSX.Element} - React component that renders the UI
 * 
 * provides 3 categories of premade routines: Basic, Random, and Sport-Specific (TODO)
 * provides a button for each premade routine that users can click to start that workout (`(tabs)/workout/start/start-routine`)
 */
export default function StartPremadeRoutinesScreen() {
  // get list of workouts
  const workouts = exampleWorkouts;

  // separate workouts into each cateogry
  const basicWorkouts = workouts.filter(workout => workout.type === "Basic");
  const randomWorkouts = workouts.filter(workout => workout.type === "Random");
  const sportSpecificWorkouts = workouts.filter(workout => workout.type === "Sport-Specific");

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
        <View style={styles.routineButtonsContainer}>
          <ScrollView horizontal>
            {basicWorkouts.map((workout, index) => (
              <NavigationButton
                key={index}
                size="small"
                text={workout.name}
                path={`./start-routine?workoutId=${workout.id}`}
              />
            ))}
          </ScrollView>
        </View>
        <Text style={styles.subtitle} variant="titleLarge">
          Random
        </Text>
        <View style={styles.routineButtonsContainer}>
          <ScrollView horizontal style={styles.routineButtonsContainer}>
            {randomWorkouts.map((workout, index) => (
              <NavigationButton
                key={index}
                size="small"
                text={workout.name}
                path={`./start-routine?workoutId=${workout.id}`}
              />
            ))}
          </ScrollView>
        </View>
        <Text style={styles.subtitle} variant="titleLarge">
          Sport-Specific
        </Text>
        <View style={styles.routineButtonsContainer}>
          <ScrollView horizontal style={styles.routineButtonsContainer}>
            {sportSpecificWorkouts.map((workout, index) => (
              <NavigationButton
                key={index}
                size="small"
                text={workout.name}
                path={`./start-routine?workoutId=${workout.id}`}
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
});
