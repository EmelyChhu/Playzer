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
 * CreateCustomRoutine1Screen Component - screen that provides the first page for users to create and save a new custom routine
 * 
 * @returns {JSX.Element} - React component that renders the UI
 * 
 * provides "Next" button that verifies whether the user input is valid and navigates to the next page if it is
 * provides "Name" text input box that allows users to enter the name of the workout
 * provides "Description" text input box that allows users to enter the description of the workout
 */
export default function CreateCustomRoutine1Screen() {
  const colorScheme = useColorScheme();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [errorMessageName, setErrorMessageName] = useState("");
  const [errorMessageDescription, setErrorMessageDescription] = useState("");
  const [errorName, setErrorName] = useState(false);
  const [errorDescription, setErrorDescription] = useState(false);

  useEffect(() => {
    setName(name);
  }, [name]);

  useEffect(() => {
    setDescription(description);
  }, [description]);

  const handleSaveRoutine = async () => {
    let convFail = false;
    setErrorMessageName("");
    setErrorMessageDescription("");
    setErrorName(false);
    setErrorDescription(false);

    if (name == "") {
      convFail = true;
      setErrorMessageName("Please enter a string with 1-8 characters.");
      setErrorName(true);
    }
    if (description == "") {
      convFail = true;
      setErrorMessageDescription("Please enter a string with 1+ characters.");
      setErrorDescription(true);
    }
    if (!convFail) {
      router.push(`./create-custom-2?name=${name}&description=${description}`);
    }
  }

  useEffect(() => {
    if (name !== "" && description !== "") {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [name, description]);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title} variant="headlineMedium">
          Routine Information
        </Text>
        <Text variant="bodyMedium">
          Input information about your new custom routine.
        </Text>
        <Button style={styles.saveButton} mode='contained' onPress={handleSaveRoutine}>
          <Text style={[styles.buttonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>
            Next
          </Text>
        </Button>
        <Text style={styles.title} variant="titleLarge">
          Name
        </Text>
        <TextInput
          style={styles.largeInput}
          mode="outlined"
          label="Name"
          value={name}
          onChangeText={setName}
          error={errorName}
        />
        {errorName ? 
          <Text style={styles.errorText}>     
            {errorMessageName}
          </Text>
        : null}
        <Text style={styles.title} variant="titleLarge">
          Description
        </Text>
        <TextInput
          style={styles.largeInput}
          mode="outlined"
          label="Description"
          value={description}
          onChangeText={setDescription}
          error={errorDescription}
        />
        {errorDescription ? 
          <Text style={styles.errorText}>     
            {errorMessageDescription}
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
