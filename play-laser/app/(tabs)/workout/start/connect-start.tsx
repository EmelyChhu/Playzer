import { StyleSheet, PermissionsAndroid } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from '@/components/Themed';
import { PaperProvider, Button, TextInput, Text, ActivityIndicator, Portal, Dialog } from 'react-native-paper';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useState, useEffect, useRef } from 'react';
import { Workout } from '@/types';
import { router } from 'expo-router';

import DeviceModal from "./../../../device-connection-modal";
import { fetchWorkouts } from "@/FirebaseConfig";

export default function ConnectStartScreen() {
  const colorScheme = useColorScheme();

  const connectedDevice = true;
  const distance = 5;

  const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [workoutDuration, setWorkoutDuration] = useState(150);
  const [screenState, setScreenState] = useState(1);    // possible states: 1 (connection), 2 (sync distance), 3 (workout), 4 (workout complete)

  useEffect(() => {
    const workoutId = "1"; // TESTING BASIC 1 PREMADE ROUTINE
    console.log("Fetching workout with ID:", workoutId);

    const loadWorkout = async () => {
      const fetchedWorkout = await fetchWorkouts(workoutId);
      console.log("Fetched workout:", fetchedWorkout);
      setWorkout(fetchedWorkout);
      if (fetchedWorkout) {
        setWorkoutDuration(fetchedWorkout.laserPositions.length * (fetchedWorkout.durationBetweenLasers + fetchedWorkout.laserDuration));
      }
    };
    loadWorkout();
  }, []);

  if(!workout) {
    return (
      <PaperProvider>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText} variant="displayLarge">
            Loading workout...
          </Text>
          <ActivityIndicator animating={true} size={100}/>
        </View>
      </PaperProvider>
    );
  }

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    setIsModalVisible(true);
  };

  const encodeWorkoutData = (workout: Workout): bigint => {
    let data = BigInt(0);

    data |= BigInt(workout.laserDuration) << BigInt(4);  // 4 bits for laserDuration
    data |= BigInt(workout.durationBetweenLasers);
    data <<= BigInt(4);
    data |= BigInt(workout.numRows);  // 4 bits for numRows
    data <<= BigInt(4);
    data |= BigInt(workout.numColumns);  // 4 bits for numColumns
    data <<= BigInt(6);

    for (let i = workout.laserPositions.length - 1; i >= 0; i--) {
      data |= BigInt(workout.laserPositions[i]); // 6 bits for each laserPosition
      data <<= BigInt(6);
    }
    
    data >>= BigInt(1);
    data |= BigInt(workout.laserPositions.length);  // 5 bits for number of laserPositions
    
    return data;
  }

  function ConnectionScreen() {
    useEffect(() => {
      if (connectedDevice) {
        setScreenState(2);
        console.log("Device connected.");
      }
    }, [connectedDevice]);

    return (
      <View  style={styles.container}>
        <View style={styles.infoContainer}>
          <Text style={[styles.infoText, {color: Colors[colorScheme ?? 'light'].text}]}>
            Connect a device to start the workout
          </Text>
        </View>
        <DeviceModal
            closeModal={hideModal}
            visible={isModalVisible}
        />
        <Button
          style={styles.button}
          mode='contained'
          onPress={() => {
            openModal(); // Open the device connection modal
          }}
        >
          <Text style={[styles.buttonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>
            Connect device
          </Text>
        </Button>
        <Portal>
          <Dialog visible={isDialogVisible} onDismiss={() => setIsDialogVisible(false)}>
            <Dialog.Title>Error</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">
                Unable to connect to the device. Please restart the app and try again.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setIsDialogVisible(false)}>Dismiss</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    );
  }
  
  function SyncDistanceScreen() {

    return (
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <Text style={[styles.infoText, {color: Colors[colorScheme ?? 'light'].text}]}>
            Position the device at the desired wall distance
          </Text>
          <Text style={[styles.infoText, {color: Colors[colorScheme ?? 'light'].button}]}>
            {distance} ft
          </Text>
        </View>
        <Button
          style={styles.button}
          mode='contained'
          onPress={() => {
            setScreenState(3);
          }}
        >
          <Text style={[styles.buttonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>
            Confirm distance
          </Text>
        </Button>
        <Portal>
          <Dialog visible={isDialogVisible} onDismiss={() => setIsDialogVisible(false)}>
            <Dialog.Title>Error</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">
                Unable to connect to the device. Please restart the app and try again.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setIsDialogVisible(false)}>Dismiss</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    );
  }
  
  function WorkoutScreen() {
    const [workoutState, setWorkoutState] = useState(1);   // possible states: 1 (start), 2 (running -> stop), 3 (restart)
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  
    useEffect(() => {
      if (workoutState == 2) {
        if (time < workoutDuration) {
          const id = setInterval(() => {
            setTime(prevTime => prevTime + 1);
          }, 1000);
          setIntervalId(id);
    
          return () => {
            clearInterval(id);
          };
        } else {
          setScreenState(4);
          if (intervalId) {
            clearInterval(intervalId);
          }
        }
      }
    
      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    }, [workoutState, time, workoutDuration]);

    const handleStartWorkout = () => {
      setWorkoutState(2);   // set workout state to running
      setTime(0);
      const data = encodeWorkoutData(workout);
      console.log("Workout data sent to device:", data.toString(16));

      if (connectedDevice) {
        // send workout data to device
      } else {
        console.log("Error: No device connected")
        setIsDialogVisible(true);
      }
    }

    const handleStopWorkout = () => {
      setWorkoutState(3);   // set workout state to stop
      
      // TODO: send signal to device to stop
      // if (connectedDevice) {
      //   sendData(connectedDevice, data);
      // } else {
      //   console.log("Error: No device connected")
      // }
    }

    return (
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <Text style={[styles.numText, {color: Colors[colorScheme ?? 'light'].button}]}>
            {Math.floor(time / 60)}m {time % 60}s
          </Text>
          <Text style={[styles.infoText, {color: Colors[colorScheme ?? 'light'].text}]}>
            elapsed
          </Text>
          <Text style={[styles.numText, {color: Colors[colorScheme ?? 'light'].button}]}>
            {Math.floor((workoutDuration - time) / 60)}m {(workoutDuration - time) % 60}s
          </Text>
          <Text style={[styles.infoText, {color: Colors[colorScheme ?? 'light'].text}]}>
            remaining
          </Text>
        </View>
        <Button
          style={styles.button}
          mode='contained'
          onPress={() => {
            workoutState == 2 ? handleStopWorkout() : handleStartWorkout();
          }}
        >
          <Text style={[styles.buttonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>
            {(() => {
              switch (workoutState) {
                case 1:
                  return "Start workout";
                case 2:
                  return "Stop workout";
                case 3:
                  return "Restart workout";
              }
            })()}
          </Text>
        </Button>
        <Portal>
          <Dialog visible={isDialogVisible} onDismiss={() => setIsDialogVisible(false)}>
            <Dialog.Title>Error</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">
                Unable to connect to the device. Please restart the app and try again.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setIsDialogVisible(false)}>Dismiss</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    );
  }
  
  function WorkoutCompleteScreen() {
    return (
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <Text style={[styles.infoText, {color: Colors[colorScheme ?? 'light'].text}]}>
            Workout completed!
          </Text>
        </View>
        <Button
          style={styles.button}
          mode='contained'
          onPress={() => router.push("../../workout")}
        >
          <Text style={[styles.buttonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>
            Exit
          </Text>
        </Button>
      </View>
    );
  }

  return (
    <PaperProvider>
      {(() => {
        switch (screenState) {
          case 1:
            return <ConnectionScreen />;
          case 2:
            return <SyncDistanceScreen />;
          case 3:
            return <WorkoutScreen />;
          case 4:
            return <WorkoutCompleteScreen />;
          default:
            return (
              <View style={styles.container}>
                <View style={styles.infoContainer}>
                  <Text style={[styles.infoText, { color: Colors[colorScheme ?? 'light'].text }]}>
                    Error: Please restart the app and try again
                  </Text>
                </View>
              </View>
            );
        }
      })()}
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
  },
  infoContainer: {
    flex: 1,
    height: '60%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 32,
  },
  loadingText: {
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  input: {
    height: 40,
    width: 100,
    margin: 12,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 48,
    marginVertical: 16,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallButton: {
    width: 100,
    height: 48,
    marginVertical: 16,
    marginLeft: 32,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    textAlign: 'center',
    fontSize: 60,
    marginBottom: 6,
  },
  numText: {
    textAlign: 'center',
    fontSize: 75,
    marginTop: 6,
  }
});
