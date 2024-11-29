import { StyleSheet, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from '@/components/Themed';
import { PaperProvider, Text, Button } from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Workout, exampleWorkouts } from '@/types';
import { router } from 'expo-router';

export default function CreateCustomRoutineScreen() {
  const colorScheme = useColorScheme();
  const workouts = exampleWorkouts;

  const [durationBetweenLasers, setDurationBetweenLasers] = useState(0);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title} variant="headlineMedium">Create a Routine</Text>
        <Text variant="bodyMedium">
          Click on points on the grid in the order you'd like the laser positions to be and choose your workout settings.
        </Text>
        <Button>
          Hello
        </Button>
        <Button style={styles.saveButton} mode='contained'>
          <Text style={[styles.buttonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>Save Custom Routine</Text>
        </Button>
        <Text style={styles.subtitle} variant="titleLarge">Workout Settings</Text>
        
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
  buttonText: {
    fontSize: 16,
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingTop: 2,  // TODO: make vertical centering automatic
  },
  saveButton: {
    width: '100%',
    height: 48,
    marginVertical: 16,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  routineButtonsContainer: {
    height: 92,
  },
  routineButton: {
    width: 128,
    height: 80,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  routineButtonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  routineButtonText: {
    fontSize: 16,
    marginTop: 4,
    textAlign: 'center',
  },
});
