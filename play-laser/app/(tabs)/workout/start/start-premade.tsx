import { StyleSheet, ScrollView } from 'react-native';

import { View } from '@/components/Themed';
import { PaperProvider, Text, Button } from 'react-native-paper';
import { Workout, exampleWorkouts } from '@/types';
import NavigationButton from '@/components/NavigationButton';

export default function WorkoutScreen() {
  const workouts = exampleWorkouts;

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title} variant="headlineMedium">Routines</Text>
        <Text variant="bodyMedium">
          Looking for inspiration for your workouts? Check out these routines from our trainers.
        </Text>
        <Text style={styles.subtitle} variant="titleLarge">Basic</Text>
        <View style={styles.routineButtonsContainer}>
          <ScrollView horizontal>
            <NavigationButton
              size="small"
              path="./start-routine"
              text="Basic 1"
            />
            <NavigationButton
              size="small"
              text="Basic 2"
            />
            <NavigationButton
              size="small"
              text="Basic 3"
            />
          </ScrollView>
        </View>
        <Text style={styles.subtitle} variant="titleLarge">Random</Text>
        <View style={styles.routineButtonsContainer}>
          <ScrollView horizontal style={styles.routineButtonsContainer}>
            <NavigationButton
              size="small"
              text="Random 1"
            />
            <NavigationButton
              size="small"
              text="Random 2"
            />
            <NavigationButton
              size="small"
              text="Random 3"
            />
          </ScrollView>
        </View>
        <Text style={styles.subtitle} variant="titleLarge">Sport-Specific</Text>
        <View style={styles.routineButtonsContainer}>
          <ScrollView horizontal style={styles.routineButtonsContainer}>
            <NavigationButton
              size="small"
              text="Random 1"
              icon="soccer-ball-o"
            />
            <NavigationButton
              size="small"
              text="Random 2"
              icon="circle"
            />
            <NavigationButton
              size="small"
              text="Random 3"
              icon="soccer-ball-o"
            />
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
