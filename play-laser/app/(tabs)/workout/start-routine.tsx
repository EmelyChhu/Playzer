import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from '@/components/Themed';
import { PaperProvider, Text, Button } from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Workout, exampleWorkouts } from '@/types';
import { router } from 'expo-router';

export default function WorkoutScreen() {
  const colorScheme = useColorScheme();
  const workouts = exampleWorkouts;

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title} variant="headlineMedium">Basic 1</Text>
        <Text variant="bodyMedium">
            {workouts[0].description}
        </Text>
        <Button style={styles.button} mode='contained'>
          <Text style={[styles.buttonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>Start Workout</Text>
        </Button>
        <Text style={styles.title} variant="titleLarge">Workout Details</Text>
        <Text variant="bodyMedium">
            Workout Duration: {workouts[0].laserPositions.length * (workouts[0].durationBetweenLasers + workouts[0].laserDuration)} seconds
        </Text>
        <Text variant="bodyMedium">
            Laser Duration: {workouts[0].laserDuration} seconds
        </Text>
        <Text variant="bodyMedium">
            Duration Between Lasers: {workouts[0].durationBetweenLasers} seconds
        </Text>
        <View>
          
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
  buttonContent: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingTop: 2,  // TODO: make vertical centering automatic
  },
  routineButtonsContainer: {
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  routineButton: {
    width: '48%',
    height: 96,
    marginVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#6850ac',
  },
  routineButtonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginTop: 8,
  },
  routineButtonText: {
    fontSize: 16,
    marginTop: 4,
    textAlign: 'center',
  },
});
