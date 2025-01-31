import { StyleSheet } from 'react-native';

import { View } from '@/components/Themed';
import { PaperProvider, Text, Button } from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import NavigationButton from '@/components/NavigationButton';
import { Workout, exampleWorkouts } from '@/types';
import { router } from 'expo-router';

/**
 * WorkoutScreen Component - workout screen for the Playzer app
 * 
 * @returns {JSX.Element} - React component that renders the UI
 * 
 * provides "Start a Workout" button that allows users to navigate to the Start a Workout page (`(tabs)/workout/start/index`)
 * provides "Premade" button that allows users to navigate to the View Premade Routines page (TODO)
 * provides "Custom" button that allows users to navigate to the View Custom Routines page (`(tabs)/workout/view/view-custom`)
 */
export default function WorkoutScreen() {
  const colorScheme = useColorScheme();
  const workouts = exampleWorkouts;

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title} variant="titleLarge">Quick Start</Text>
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
        <Text style={styles.title} variant="titleLarge">View Workout Routines</Text>
        <View style={styles.routineButtonsContainer}>
          <NavigationButton
            size="medium"
            text="Premade"
            icon="list"
          />
          <NavigationButton
            size="medium"
            path="./workout/view/"
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
});
