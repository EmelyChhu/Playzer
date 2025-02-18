import { StyleSheet, PermissionsAndroid } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from '@/components/Themed';
import { PaperProvider, Button, TextInput, Text, ActivityIndicator, Portal, Dialog } from 'react-native-paper';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { BleManager } from 'react-native-ble-plx';
import { useState, useEffect, useRef } from 'react';
import { btoa, atob } from 'react-native-quick-base64';
import { Workout, randomWorkout } from '@/types';
import { router } from 'expo-router';

import DeviceModal from "./../../../device-connection-modal";
import useBLE from "../../../../useBLE";
import { fetchWorkouts } from "@/FirebaseConfig";
import { useLocalSearchParams } from 'expo-router';

/**
 * ConnectStartScreen Component - screen that provides the flow for connecting to a device and starting a workout routine
 * 
 * @returns {JSX.Element} - React component that renders the UI
 * 
 * ScreenState 1 - Connection: provides an interface to connect to the Playzer device
 * ScreenState 2 - Sync Distance: provides a live feed of the device's distance from the wall using a LiDar sensor
 * ScreenState 3 - Workout: provides an interface to begin a workout routine and a timer to track the progress
 * ScreenState 4 Workout Complete: provides a message that the workout is completed and "Exit" button
 */
export default function ConnectStartScreen() {
  const colorScheme = useColorScheme();
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    distance,
    disconnectFromDevice,
    sendData,
    isDialogVisible,
    setIsDialogVisible,
  } = useBLE();

  const connectedDeviceRef = useRef(connectedDevice); 

  useEffect(() => {
    connectedDeviceRef.current = connectedDevice;
  }, [connectedDevice]);

  useEffect(() => {
    return () => {
      if (connectedDeviceRef.current) {
        console.log("Disconnecting from device due to user navigating away from page.");
        disconnectFromDevice();
      }
    };
  }, []);

  // const connectedDevice = true;

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [workoutDuration, setWorkoutDuration] = useState(150);
  const [screenState, setScreenState] = useState(1);    // possible states: 1 (connection), 2 (sync distance), 3 (workout), 4 (workout complete)

  const { workoutId, laserDuration, durationBetweenLasers, numLaserPositions } = useLocalSearchParams();

  useEffect(() => {
    // const workoutId = "1"; // TESTING BASIC 1 PREMADE ROUTINE
    console.log("Fetching workout with ID:", workoutId);

    const loadWorkout = async () => {
      const fetchedWorkout = await fetchWorkouts(workoutId);
      console.log("Fetched workout:", fetchedWorkout);
      setWorkout(fetchedWorkout);
      if (fetchedWorkout) {
        setWorkoutDuration(fetchedWorkout.laserPositions.length * (fetchedWorkout.durationBetweenLasers + fetchedWorkout.laserDuration));
      }
    };

    if (workoutId != "RANDOM") {
      loadWorkout();
    } else {
      randomWorkout.laserDuration = Number(laserDuration);
      randomWorkout.durationBetweenLasers = Number(durationBetweenLasers);
      randomWorkout.laserPositions = Array(Number(numLaserPositions)).fill(0);
      setWorkout(randomWorkout);
      setWorkoutDuration(randomWorkout.laserPositions.length * (randomWorkout.durationBetweenLasers + randomWorkout.laserDuration));
    }
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

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
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
    data <<= BigInt(5);

    for (let i = workout.laserPositions.length - 1; i >= 0; i--) {
      data |= BigInt(workout.laserPositions[i]); // 5 bits for each laserPosition
      data <<= BigInt(5);
    }
    
    data |= BigInt(workout.laserPositions.length);  // 5 bits for number of laserPositions
    
    return data;
  }

  /**
   * ConnectionScreen Component - screen that provides the flow for connecting to a device
   * 
   * @returns {JSX.Element} - React component that renders the UI
   * 
   * provides "Connect device" button that opens the DeviceConnectionModal
   * successful connection will change the ScreenState to 2
   */
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
            connectToPeripheral={connectToDevice}
            devices={allDevices}
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
  
  /**
   * SyncDistanceScreen Component - screen that allows users to determine the device's distance from the wall
   * 
   * @returns {JSX.Element} - React component that renders the UI
   * 
   * provides live feed of device's distance from the wall using the LiDar sensor
   * provides "Confirm distance" button that will change the ScreenState to 3
   */
  function SyncDistanceScreen() {
    const handleRescanDistance = () => {
      if (connectedDevice) {
        sendData(connectedDevice, "RESCAN");    // send signal to rescan distance
        console.log("Rescanning distance");
      } else {
        console.log("Error: No device connected")
        setIsDialogVisible(true);
      }
    }

    return (
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <Text style={[styles.infoText, {color: Colors[colorScheme ?? 'light'].text}]}>
            Position the device at the desired wall distance
          </Text>
          <View style={styles.distanceContainer}>
            <Text style={[styles.infoText, {color: Colors[colorScheme ?? 'light'].button}]}>
              {distance.toFixed(1)} ft
            </Text>
            <Button 
              style={styles.smallButton}
              mode='contained'
              onPress={() => handleRescanDistance()}
            >
              <Text style={[styles.buttonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>
                Rescan
              </Text>
            </Button>
          </View>
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
  
  /**
   * WorkoutScreen Component - screen that provides the flow for starting a workout routine
   * 
   * @returns {JSX.Element} - React component that renders the UI
   * 
   * WorkoutState 1 - Start: provides "Start workout" button that will send a signal to the Playzer device to start the workout along with the workout information
   * WorkoutState 2 - Running: displays the time elapsed and time remaining in the workout and provides a "Stop workout" button that will stop the stopwatches and send a signal to the device to stop the workout (TODO)
   * WorkoutState 3 - Restart: provides a "Restart workout" button that will resend the signal to start the workout and restart the stopwatches
   */
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

      if (connectedDevice) {
        const data = encodeWorkoutData(workout);
        sendData(connectedDevice, data);    // send workout data to device
        console.log("Workout data sent to device:", data.toString(16));
        console.log("Workout sent to device:", workout);
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
  
  /**
   * WorkoutCompleteScreen Component - screen that notifies users they have completed the workout
   * 
   * @returns {JSX.Element} - React component that renders the UI
   * 
   * provides "Exit" button that will navigate to the Workout Screen (`(tabs)/workout/index`)
   */
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
  distanceContainer: {
    flexDirection: 'row',
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
