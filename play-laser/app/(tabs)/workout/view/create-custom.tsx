import { StyleSheet, ScrollView, Pressable } from 'react-native';
import { useState, useEffect } from 'react';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from '@/components/Themed';
import { PaperProvider, Text, Button, TextInput } from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Workout, exampleWorkouts } from '@/types';
import { router } from 'expo-router';
import { LaserPositionCardProps, LaserGridProps } from '@/types';

import { addWorkout } from "@/FirebaseConfig";
import { FIREBASE_AUTH } from "@/FirebaseConfig";

export default function CreateCustomRoutineScreen() {
  const colorScheme = useColorScheme();
  const workouts = exampleWorkouts;

  const [workoutDuration, setWorkoutDuration] = useState(0);
  const [durationBetweenLasers, setDurationBetweenLasers] = useState("");
  const [laserDuration, setLaserDuration] = useState("");
  const [laserPositions, setLaserPositions] = useState<number[]>([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorLaserDuration, setErrorLaserDuration] = useState(false);
  const [errorDurationBetweenLasers, setErrorDurationBetweenLasers] = useState(false);
  const [errorMessageLasers, setErrorMessageLasers] = useState("");

  useEffect(() => {
    const workoutDuration = laserPositions.length * (Number(durationBetweenLasers) + Number(laserDuration));
    setWorkoutDuration(workoutDuration);
  }, [durationBetweenLasers, laserDuration, laserPositions]);

  useEffect(() => {
    setDurationBetweenLasers(durationBetweenLasers);
  }, [durationBetweenLasers]);

  useEffect(() => {
    setLaserDuration(laserDuration);
  }, [laserDuration]);

  const handleSaveRoutine = async () => {
    const numLaserDuration = parseFloat(laserDuration);
    const numDurationBetweenLasers = parseFloat(durationBetweenLasers);
    let convFail = false;
    setErrorMessage("");
    setErrorLaserDuration(false);
    setErrorDurationBetweenLasers(false);
    setErrorMessageLasers("");

    if (!(!isNaN(numLaserDuration) && Number.isInteger(numLaserDuration) && numLaserDuration >= 1 && numLaserDuration <= 30)) {
      convFail = true;
      setErrorMessage("Please enter an integer between 1-30.");
      setErrorLaserDuration(true);
    }
    if (!(!isNaN(numDurationBetweenLasers) && Number.isInteger(numDurationBetweenLasers) && numDurationBetweenLasers >= 1 && numDurationBetweenLasers <= 30)) {
      convFail = true;
      setErrorMessage("Please enter an integer between 1-30.");
      setErrorDurationBetweenLasers(true);
    }
    if (laserPositions.length <= 5) {
      convFail = true;
      setErrorMessageLasers("Please add at least 5 laser positions.");
    }
    if (!convFail) {
      const newCustomWorkout = {
        id: "4",
        name: "Custom 1",
        type: "Custom",
        durationBetweenLasers: {durationBetweenLasers},
        laserDuration: {laserDuration},
        numColumns: 8,
        numRows: 4,
        numPositions: 32,
        laserPositions: {laserPositions},
        creatorId: FIREBASE_AUTH.currentUser?.uid,
        description: "This is a newly created custom workout routine."
      }
      await addWorkout(newCustomWorkout);
      // navigate back to "View Custom Routines Page"
    }
  }

  useEffect(() => {
    if (durationBetweenLasers !== "" && laserDuration !== "" && laserPositions.length >= 5) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [durationBetweenLasers, laserDuration]);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title} variant="headlineMedium">Create a Routine</Text>
        <Text variant="bodyMedium">
          Input the workout settings and click on the grid to add laser positions.
        </Text>
        <Button style={styles.saveButton} mode='contained' onPress={handleSaveRoutine}>
          <Text style={[styles.buttonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>
            Save Custom Routine
          </Text>
        </Button>
        <Text style={styles.title} variant="titleLarge">Time (seconds)</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            mode="outlined"
            label="Laser"
            value={laserDuration}
            onChangeText={setLaserDuration}
            error={errorLaserDuration}
          />
          <TextInput
            style={styles.input}
            mode="outlined"
            label="Between Lasers"
            value={durationBetweenLasers}
            onChangeText={setDurationBetweenLasers}
            error={errorDurationBetweenLasers}
          />
        </View>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        <Text style={styles.title} variant="titleLarge">Add Laser Positions</Text>
        <View style={styles.laserGridInputContainer}>
          <LaserGridInput 
            numColumns={8}
            numRows={4} 
            numPositions={32}
            setLaserPositions={setLaserPositions}
            laserPositions={laserPositions}
          />
        </View>
        {errorMessageLasers ? <Text style={styles.errorText}>{errorMessageLasers}</Text> : null}
        <View style={styles.scrollViewContainer}>
          <ScrollView>
            {laserPositions.map((laserPosition, index) => (
              <LaserPositionCard
                key={index}
                workout={workouts[0]}
                index={index}
                laserPosition={laserPosition}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </PaperProvider>
  );
}

const LaserPositionCard: React.FC<LaserPositionCardProps> = ({ workout, laserPosition, index }) => {
  const colorScheme = useColorScheme();
  return (
    <View style={[styles.laserPositionCard, {backgroundColor: Colors[colorScheme ?? 'light'].button}]}>
      <LaserGrid 
        numColumns={workout.numColumns}
        numRows={workout.numRows} 
        numPositions={workout.numPositions} 
        laserPosition={laserPosition} 
      />
      <Text style={[styles.buttonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>
        Laser {index + 1}
      </Text>
    </View>
  )
}

const LaserGridInput: React.FC<LaserGridProps> = ({ numColumns, numRows, numPositions, laserPosition, setLaserPositions, laserPositions }) => {
  const colorScheme = useColorScheme();
  const laserPositionRow = laserPosition != undefined ? Math.floor((laserPosition - 1) / numColumns) : -1;
  const laserPositionColumn = laserPosition != undefined ? (laserPosition - 1) % numColumns : -1;
  
  const handleLaserPositionPress = (row: number, column: number) => {
    const newPosition = row * 8 + column + 1;
    if (setLaserPositions && laserPositions) {
      setLaserPositions([...laserPositions, newPosition]);
    }
  };

  const rows = [];
  for (let i = 0; i < numRows; i++) {
    const columns = [];
    for (let j = 0; j < numColumns; j++) {
      columns.push(
        <View key={`${i}-${j}`} style={styles.gridItem}>
          <Pressable onPress={() => handleLaserPositionPress(i, j)}>
            <FontAwesome
              name="dot-circle-o"
              size={32}
              color={Colors[colorScheme ?? 'light'].button} 
            />
          </Pressable>
        </View>
      );
    }
    rows.push(
      <View key={i} style={styles.gridRow}>
        {columns}
      </View>
    );
  }

  return (
    <View style={styles.laserGridInput}>
      {rows}
    </View>
  )
}

const LaserGrid: React.FC<LaserGridProps> = ({ numColumns, numRows, numPositions, laserPosition }) => {
  const colorScheme = useColorScheme();
  const laserPositionRow = laserPosition != undefined ? Math.floor((laserPosition - 1) / numColumns) : -1;
  const laserPositionColumn = laserPosition != undefined ? (laserPosition - 1) % numColumns : -1;

  const rows = [];
  for (let i = 0; i < numRows; i++) {
    const columns = [];
    for (let j = 0; j < numColumns; j++) {
      columns.push(
        <View key={`${i}-${j}`} style={[styles.gridItemInput, {backgroundColor: Colors[colorScheme ?? 'light'].button}]}>
          <FontAwesome
            name="dot-circle-o"
            size={9}
            color={(laserPositionRow == i && laserPositionColumn == j) ? "#422f7f" : "white"} 
          />
        </View>
      );
    }
    rows.push(
      <View key={i} style={[styles.gridRow, {backgroundColor: Colors[colorScheme ?? 'light'].button}]}>
        {columns}
      </View>
    );
  }

  return (
    <View style={[styles.laserGrid, {backgroundColor: Colors[colorScheme ?? 'light'].button}]}>
      {rows}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 16,
    paddingBottom: 0,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 4,
    marginTop: 8,
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
    marginTop: 16,
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
  laserPositionCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 16,
    marginBottom: 16,
  },
  laserGrid: {
    marginRight: 32,
  },
  laserGridInput: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  gridItem: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  gridItemInput: {
    width: 8,
    height: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  scrollViewContainer: {
    flex: 1,
    width: '100%',
    marginTop: 16,
  },
  laserGridInputContainer : {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  inputContainer: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
  },
  input: {
    width: '48%',
    // marginBottom: 5,
    // marginLeft: 12,
    marginRight: 8,
    height: 40,
  },
  label: {
    textAlign: 'left',
    width: '100%',
    marginTop: 4,
  },
  errorText: {
    color: 'pink',
    textAlign: 'left',
    width: '100%',
    marginTop: 8,
  },
});
