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
        <Text style={styles.title}>Quick Start</Text>
        <Button style={styles.button} mode='contained' contentStyle={styles.buttonContainer} onPress={() => router.push("./workout/start")}>
          <View style={styles.buttonContainer}>
            <FontAwesome
              name="crosshairs"
              size={25}
              color={Colors[colorScheme ?? 'light'].buttonText}
            />
            <Text style={[styles.buttonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>Start a Workout</Text>
          </View> 
        </Button>
        <Text style={styles.title}>View Workout Routines</Text>
        <View style={styles.routineButtonsContainer}>
          <Button style={styles.routineButton} mode='contained' contentStyle={styles.routineButtonContainer}>
            <View style={styles.routineButtonContainer}>
              <FontAwesome
                name="list"
                size={25}
                color={Colors[colorScheme ?? 'light'].buttonText}
              />
              <Text style={[styles.routineButtonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>Premade Routines</Text>
            </View> 
          </Button>
          <Button style={styles.routineButton} mode='contained' contentStyle={styles.routineButtonContainer} onPress={() => router.push("./workout/view/")}>
            <View style={styles.routineButtonContainer}>
              <FontAwesome
                name="edit"
                size={25}
                color={Colors[colorScheme ?? 'light'].buttonText}
              />
              <Text style={[styles.routineButtonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>Custom Routines</Text>
            </View> 
          </Button>
        
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
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
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
    alignItems: 'flex-start',
  },
  buttonContent: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingTop: 5,  // TODO: make vertical centering automatic
    marginTop: 3,
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
  },
  routineButtonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginTop: 8,
  },
  routineButtonText: {
    fontSize: 15,
    marginTop: 4,
    textAlign: 'center',
  },
});
