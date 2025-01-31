import { StyleSheet } from 'react-native';

import { View } from '@/components/Themed';
import { PaperProvider, Text, Button } from 'react-native-paper';
import NavigationButton from '@/components/NavigationButton';
import { Workout, exampleWorkouts } from '@/types';

/**
 * WorkoutStartScreen Component - workout start screen for the Playzer app
 * 
 * @returns {JSX.Element} - React component that renders the UI
 * 
 * provides "Premade" button that allows users to navigate to the Start Premade Routines page (`(tabs)/workout/start/index`)
 * provides "Custom" button that allows users to navigate to the Start Custom Routines page (TODO)
 */
export default function WorkoutStartScreen() {
  const workouts = exampleWorkouts;

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title} variant="titleLarge">Select a Workout Routine</Text>
        <View style={styles.routineButtonsContainer}>
          <NavigationButton
            size="medium"
            path="./start/start-premade"
            text="Premade"
            icon="list"
          />
          <NavigationButton
            size="medium"
            text="Custom"
            icon="edit"
          />
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
  },
  routineButtonsContainer: {
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
