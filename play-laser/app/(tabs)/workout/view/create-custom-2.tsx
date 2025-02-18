import { StyleSheet, ScrollView, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from "@react-navigation/native";

import LaserPositionCard from '@/components/LaserPositionCard';
import { View } from '@/components/Themed';
import { PaperProvider, Text, Button, TextInput } from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Workout, exampleWorkouts } from '@/types';
import { router } from 'expo-router';
import { LaserPositionCardProps, LaserGridProps } from '@/types';
import { useLocalSearchParams } from 'expo-router';

import { addWorkout } from "@/FirebaseConfig";
import { FIREBASE_AUTH } from "@/FirebaseConfig";

/**
 * CreateCustomRoutine2Screen Component - screen that provides the second page for users to create and save a new custom routine
 * 
 * @returns {JSX.Element} - React component that renders the UI
 * 
 * provides "Save Custom Routine" button that verifies whether the user input is valid and saves the new workout routine if it is
 * provides "Laser" text input box that allows users to enter the duration of each laser
 * provides "Between Lasers" text input box that allows users to enter the duration between each laser
 * provides a grid of dots that the user can click to add laser positions
 */
export default function CreateCustomRoutine2Screen() {
  const colorScheme = useColorScheme();
  const workouts = exampleWorkouts;

  const { name, description } = useLocalSearchParams();

  const [workoutDuration, setWorkoutDuration] = useState(0);
  const [durationBetweenLasers, setDurationBetweenLasers] = useState("");
  const [laserDuration, setLaserDuration] = useState("");
  const [laserPositions, setLaserPositions] = useState<number[]>([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorLaserDuration, setErrorLaserDuration] = useState(false);
  const [errorDurationBetweenLasers, setErrorDurationBetweenLasers] = useState(false);
  const [errorMessageLasers, setErrorMessageLasers] = useState("");
  const [buttonText, setButtonText] = useState("Save Custom Routine");
  const [isSaved, setIsSaved] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setButtonText("Save Custom Routine");
      setIsSaved(false);
      // setButtonDisabled(false);
    }, [])
  );

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

  const handleNavigateBack = () => {
    router.replace(`./view-custom`);
  }

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
    if (laserPositions.length < 5) {
      convFail = true;
      setErrorMessageLasers("Please add at least 5 laser positions.");
    }
    if (!convFail) {
      const newCustomWorkout = {
        id: "0",
        name: name,
        type: "Custom",
        durationBetweenLasers: numDurationBetweenLasers,
        laserDuration: numLaserDuration,
        numColumns: 8,
        numRows: 4,
        numPositions: 32,
        laserPositions: laserPositions,
        creatorId: FIREBASE_AUTH.currentUser?.uid,
        description: description
      }
      await addWorkout(newCustomWorkout);
      console.log("Saved Custom Routine:", newCustomWorkout);
      setButtonText("Workout Saved! Exit");
      setIsSaved(true);
      // setButtonDisabled(true);
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
        <Text style={styles.title} variant="headlineMedium">
          Routine Settings and Content
        </Text>
        <Text variant="bodyMedium">
          Input the workout settings and click on the grid to add laser positions.
        </Text>
        <Button style={styles.saveButton} mode='contained' onPress={buttonText == "Workout Saved! Exit" ? handleNavigateBack : handleSaveRoutine}>
          <Text style={[styles.buttonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>
            {buttonText}
          </Text>
        </Button>
        <Text style={styles.title} variant="titleLarge">
          Time (seconds)
        </Text>
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
        <Text style={styles.title} variant="titleLarge">
          Add Laser Positions
        </Text>
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

/**
 * LaserGridInput Component - grid input component that allows users to input laser positions that are stored in the laserPositions state variable
 * 
 * @param {Object} props - component props
 * @param {number} props.numColumns - number of columns in the grid
 * @param {number} props.numRows - number of rows in the grid
 * @param {number[]} [props.laserPositions] - current array of inputted laser positions
 * @param {(positions: number[]) => void} [props.setLaserPositions] - function to update the array of inputted laser positions
 * 
 * @returns {JSX.Element} - pressable grid where each cell represents a selectable laser position
 */
const LaserGridInput: React.FC<LaserGridProps> = ({ numColumns, numRows, setLaserPositions, laserPositions }) => {
  const colorScheme = useColorScheme();
  
  const handleLaserPositionPress = (row: number, column: number) => {
    const newPosition = row * 8 + column;
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
  },
  saveButton: {
    width: '100%',
    height: 48,
    marginTop: 16,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
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
  scrollViewContainer: {
    flex: 1,
    width: '100%',
    marginTop: 16,
  },
  laserGridInputContainer : {
    height: 160,
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
  errorText: {
    color: 'pink',
    textAlign: 'left',
    width: '100%',
    marginTop: 8,
  },
});