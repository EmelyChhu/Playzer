import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from '@/components/Themed';
import { Text, Button } from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';import { useColorScheme } from '@/components/useColorScheme';

export default function WorkoutScreen() {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Start</Text>
      <Button style={styles.button} mode='contained' contentStyle={styles.buttonContainer}>
        <View style={styles.buttonContainer}>
          <FontAwesome
            name="crosshairs"
            size={25}
            color={Colors[colorScheme ?? 'light'].text}
          />
          <Text style={styles.buttonText}>Start a Workout</Text>
        </View> 
      </Button>
      <Text style={styles.title}>View Workout Routines</Text>
      <View style={styles.routineButtonsContainer}>
        <Button style={styles.routineButton} mode='contained' contentStyle={styles.routineButtonContainer}>
          <View style={styles.routineButtonContainer}>
            <FontAwesome
              name="list"
              size={25}
              color={Colors[colorScheme ?? 'light'].text}
            />
            <Text style={styles.routineButtonText}>Premade Routines</Text>
          </View> 
        </Button>
        <Button style={styles.routineButton} mode='contained' contentStyle={styles.routineButtonContainer}>
          <View style={styles.routineButtonContainer}>
            <FontAwesome
              name="edit"
              size={25}
              color={Colors[colorScheme ?? 'light'].text}
            />
            <Text style={styles.routineButtonText}>Custom Routines</Text>
          </View> 
        </Button>
      
      </View>
    </View>
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
    color: 'white',
  },
  buttonText: {
    fontSize: 16,
    marginLeft: 8,
    color: 'white',
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
    width: '100%',  // Match width to align with other elements
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Adjust spacing between routine buttons
  },
  routineButton: {
    width: '48%', // Slightly less than half to create space
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
    fontSize: 16,
    marginTop: 4,
    color: 'white',
    textAlign: 'center',
  },
});
