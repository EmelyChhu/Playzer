import { StyleSheet, ScrollView } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from '@/components/Themed';
import { PaperProvider, Text, Button } from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Workout, exampleWorkouts } from '@/types';
import { router } from 'expo-router';

export default function ViewCustomRoutinesScreen() {
  const colorScheme = useColorScheme();
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
          <Button style={styles.routineButton} mode='contained' contentStyle={styles.routineButtonContainer}>
            <View style={styles.routineButtonContainer}>
              <FontAwesome
                name="plus"
                size={20}
                color={Colors[colorScheme ?? 'light'].buttonText}
              />
              <Text style={[styles.routineButtonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>Create</Text>
            </View> 
          </Button>
        </View>
        <Text style={styles.subtitle} variant="titleLarge">Created</Text>
        <View style={styles.routineButtonsContainer}>
          <ScrollView horizontal style={styles.routineButtonsContainer}>
            <Button style={styles.routineButton} mode='contained' contentStyle={styles.routineButtonContainer}>
              <View style={styles.routineButtonContainer}>
                <Text style={[styles.routineButtonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>Custom 1</Text>
              </View> 
            </Button>
            <Button style={styles.routineButton} mode='contained' contentStyle={styles.routineButtonContainer}>
              <View style={styles.routineButtonContainer}>
                <Text style={[styles.routineButtonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>Custom 2</Text>
              </View> 
            </Button>
            <Button style={styles.routineButton} mode='contained' contentStyle={styles.routineButtonContainer}>
              <View style={styles.routineButtonContainer}>
                <Text style={[styles.routineButtonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>Custom 3</Text>
              </View> 
            </Button>
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
  buttonText: {
    fontSize: 16,
    marginLeft: 8,
  },
  button: {
    width: '100%',
    height: 20,
    marginVertical: 16,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'flex-start',
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
