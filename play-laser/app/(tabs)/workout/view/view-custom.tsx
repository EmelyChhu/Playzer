import { StyleSheet, ScrollView } from 'react-native';

import NavigationButton from '@/components/NavigationButton';
import { View } from '@/components/Themed';
import { PaperProvider, Text, Button } from 'react-native-paper';
import { Workout, exampleWorkouts } from '@/types';

export default function ViewCustomRoutinesScreen() {
  const workouts = exampleWorkouts;

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title} variant="headlineMedium">Routines</Text>
        <Text variant="bodyMedium">
          View routines you've created or create your own.
        </Text>
        <Text style={styles.subtitle} variant="titleLarge">New</Text>
        <View style={styles.routineButtonsContainer}>
          <NavigationButton
            size="small"
            path="./create-custom"
            text="Create"
            icon="plus"
          />
        </View>
        <Text style={styles.subtitle} variant="titleLarge">Created</Text>
        <View style={styles.routineButtonsContainer}>
          <ScrollView horizontal style={styles.routineButtonsContainer}>
            <NavigationButton
              size="small"
              text="Custom 1"
            />
            <NavigationButton
              size="small"
              text="Custom 2"
            />
            <NavigationButton
              size="small"
              text="Custom 3"
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
