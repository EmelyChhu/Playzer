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

import { addWorkout } from "@/FirebaseConfig";
import { FIREBASE_AUTH } from "@/FirebaseConfig";

/**
 * StartRandomRoutineScreen Component - screen that provides an interface for users to edit settings for a device randomized routine
 * 
 * @returns {JSX.Element} - React component that renders the UI
 * 
 * provides "Start Random Routine" button that verifies whether the user input is valid and navigates to the start workout routine screen if it is
 * provides "Laser" text input box that allows users to enter the duration of each laser
 * provides "Between Lasers" text input box that allows users to enter the duration between each laser
 * provides "Number of Laser Positions" text input box that allows users to enter the number of laser positions
 */
export default function StartRandomRoutineScreen() {
  const colorScheme = useColorScheme();

  const [workoutDuration, setWorkoutDuration] = useState(0);
  const [durationBetweenLasers, setDurationBetweenLasers] = useState("");
  const [laserDuration, setLaserDuration] = useState("");
  const [laserPositions, setLaserPositions] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageNumLaserPositions, setErrorMessageNumLaserPositions] = useState("");
  const [errorLaserDuration, setErrorLaserDuration] = useState(false);
  const [errorDurationBetweenLasers, setErrorDurationBetweenLasers] = useState(false);
  const [errorNumLaserPositions, setErrorNumLaserPositions] = useState(false);

  useEffect(() => {
    setDurationBetweenLasers(durationBetweenLasers);
  }, [durationBetweenLasers]);

  useEffect(() => {
    setLaserDuration(laserDuration);
  }, [laserDuration]);

  useEffect(() => {
    setLaserPositions(laserPositions);
  }, [laserPositions]);

  const handleStartRoutine = async () => {
    const numLaserDuration = parseFloat(laserDuration);
    const numDurationBetweenLasers = parseFloat(durationBetweenLasers);
    const numLaserPositions = parseFloat(laserPositions);
    let convFail = false;
    setErrorMessage("");
    setErrorMessageNumLaserPositions("");
    setErrorLaserDuration(false);
    setErrorDurationBetweenLasers(false);
    setErrorNumLaserPositions(false);

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
    if (!(!isNaN(numLaserPositions) && Number.isInteger(numLaserPositions) && numLaserPositions >= 1 && numLaserPositions <= 20)) {
      convFail = true;
      setErrorMessageNumLaserPositions("Please enter an integer between 1-20.");
      setErrorNumLaserPositions(true);
    }
    if (!convFail) {
      router.push(`./connect-start?workoutId=RANDOM&laserDuration=${numLaserDuration}&durationBetweenLasers=${numDurationBetweenLasers}&numLaserPositions=${numLaserPositions}`);
    }
  }

  useEffect(() => {
    if (durationBetweenLasers !== "" && laserDuration !== "" && laserPositions !== "") {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [durationBetweenLasers, laserDuration]);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title} variant="headlineMedium">
          Set Routine Settings
        </Text>
        <Text variant="bodyMedium">
          Input the settings for your device randomized routine.
        </Text>
        <Button style={styles.saveButton} mode='contained' onPress={handleStartRoutine}>
          <Text style={[styles.buttonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>
            Start Workout
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
          Number of Laser Positions
        </Text>
        <TextInput
          style={styles.largeInput}
          mode="outlined"
          label="Number of Laser Positions"
          value={laserPositions}
          onChangeText={setLaserPositions}
          error={errorNumLaserPositions}
        />
        {errorMessageNumLaserPositions ? 
          <Text style={styles.errorText}>     
            {errorMessageNumLaserPositions}
          </Text>
        : null}
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
  saveButton: {
    width: '100%',
    height: 48,
    marginTop: 16,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
  },
  input: {
    width: '48%',
    marginRight: 8,
    height: 40,
  },
  largeInput: {
    width: '100%',
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