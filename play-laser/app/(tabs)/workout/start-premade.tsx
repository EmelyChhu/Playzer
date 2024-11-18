import { StyleSheet, ScrollView } from 'react-native';

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
        <Text style={styles.title} variant="headlineMedium">Routines</Text>
        <Text variant="bodyMedium">
          Looking for inspiration for your workouts? Check out these routines from our trainers.
        </Text>
        <Text style={styles.subtitle} variant="titleLarge">Basic</Text>
        <View style={styles.routineButtonsContainer}>
          <ScrollView horizontal>
            <Button style={styles.routineButton} mode='contained' contentStyle={styles.routineButtonContainer} onPress={() => router.push("./start-routine")}>
                <View style={styles.routineButtonContainer}>
                <Text style={[styles.routineButtonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>Basic 1</Text>
                </View> 
            </Button>
            <Button style={styles.routineButton} mode='contained' contentStyle={styles.routineButtonContainer}>
                <View style={styles.routineButtonContainer}>
                <Text style={[styles.routineButtonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>Basic 2</Text>
                </View> 
            </Button>
            <Button style={styles.routineButton} mode='contained' contentStyle={styles.routineButtonContainer}>
                <View style={styles.routineButtonContainer}>
                <Text style={[styles.routineButtonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>Basic 3</Text>
                </View> 
            </Button>
          </ScrollView>
        </View>
        <Text style={styles.subtitle} variant="titleLarge">Random</Text>
        <View style={styles.routineButtonsContainer}>
          <ScrollView horizontal style={styles.routineButtonsContainer}>
            <Button style={styles.routineButton} mode='contained' contentStyle={styles.routineButtonContainer}>
              <View style={styles.routineButtonContainer}>
                <Text style={[styles.routineButtonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>Random 1</Text>
              </View> 
            </Button>
            <Button style={styles.routineButton} mode='contained' contentStyle={styles.routineButtonContainer}>
              <View style={styles.routineButtonContainer}>
                <Text style={[styles.routineButtonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>Random 2</Text>
              </View> 
            </Button>
            <Button style={styles.routineButton} mode='contained' contentStyle={styles.routineButtonContainer}>
              <View style={styles.routineButtonContainer}>
                <Text style={[styles.routineButtonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>Random 3</Text>
              </View> 
            </Button>
          </ScrollView>
        </View>
        <Text style={styles.subtitle} variant="titleLarge">Sport-Specific</Text>
        <View style={styles.routineButtonsContainer}>
          <ScrollView horizontal style={styles.routineButtonsContainer}>
            <Button style={styles.routineButton} mode='contained' contentStyle={styles.routineButtonContainer}>
              <View style={styles.routineButtonContainer}>
                <FontAwesome
                  name="soccer-ball-o"
                  size={25}
                  color={Colors[colorScheme ?? 'light'].buttonText}
                />
                <Text style={[styles.routineButtonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>Football</Text>
              </View> 
            </Button>
            <Button style={styles.routineButton} mode='contained' contentStyle={styles.routineButtonContainer}>
              <View style={styles.routineButtonContainer}>
                <FontAwesome
                  name="circle"
                  size={25}
                  color={Colors[colorScheme ?? 'light'].buttonText}
                />
                <Text style={[styles.routineButtonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>Tennis</Text>
              </View> 
            </Button>
            <Button style={styles.routineButton} mode='contained' contentStyle={styles.routineButtonContainer}>
              <View style={styles.routineButtonContainer}>
                <FontAwesome
                  name="soccer-ball-o"
                  size={25}
                  color={Colors[colorScheme ?? 'light'].buttonText}
                />
                <Text style={[styles.routineButtonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>Soccer</Text>
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
    height: 92,
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
