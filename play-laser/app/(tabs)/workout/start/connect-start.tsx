import { StyleSheet, PermissionsAndroid } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from '@/components/Themed';
import { PaperProvider, Button, TextInput, Text, ActivityIndicator } from 'react-native-paper';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { BleManager } from 'react-native-ble-plx';
import { useState, useEffect, useRef } from 'react';
import { btoa, atob } from 'react-native-quick-base64';
import { Workout } from '@/types';
import { router } from 'expo-router';

import DeviceModal from "./../../../device-connection-modal";
import useBLE from "../../../../useBLE";
import { fetchWorkouts } from "@/FirebaseConfig";

export default function ConnectStartScreen() {
  const colorScheme = useColorScheme();
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    heartRate,
    disconnectFromDevice,
    sendData,
  } = useBLE();

  // const connectedDevice = false;

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [workoutDuration, setWorkoutDuration] = useState(150);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [screenState, setScreenState] = useState(2);    // possible states: 1 (connection), 2 (sync distance), 3 (workout), 4 (workout complete)
  const [distance, setDistance] = useState(0);

  const handleStartStop = () => {
    setIsRunning(prevState => !prevState);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  useEffect(() => {
    if (isRunning) {
      if (time < workoutDuration) {
        const id = setInterval(() => {
          setTime(prevTime => prevTime + 1);
        }, 1000);
        setIntervalId(id);
  
        return () => {
          clearInterval(id);
        };
      } else {
        setIsRunning(false);
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
  }, [isRunning, time, workoutDuration]);

  useEffect(() => {
    const workoutId = "1"; // TESTING BASIC 1 PREMADE ROUTINE
    // console.log("Fetching workout with ID:", workoutId);

    const loadWorkout = async () => {
      const fetchedWorkout = await fetchWorkouts(workoutId);
      // console.log("Fetched workout:", fetchedWorkout);
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
    data <<= BigInt(6);

    for (let i = workout.laserPositions.length - 1; i >= 0; i--) {
      data |= BigInt(workout.laserPositions[i]); // 6 bits for each laserPosition
      data <<= BigInt(6);
    }
    
    data >>= BigInt(1);
    data |= BigInt(workout.laserPositions.length);  // 5 bits for number of laserPositions
    
    return data;
  }

  const handleStartWorkout = () => {
    handleStartStop();
    const data = encodeWorkoutData(workout);
    console.log(data.toString(16));
    if (connectedDevice) {
      sendData(connectedDevice, data);
    }
  }

  function ConnectionScreen() {
    useEffect(() => {
      if (connectedDevice) {
        setScreenState(2);
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
          
          <View style={{flexDirection:'row'}}>
            <Text style={[styles.infoText, {color: Colors[colorScheme ?? 'light'].button}]}>
              {distance} m
            </Text>
            <Button
              style={styles.smallButton}
              mode='contained'
              onPress={() => {
                handleStartWorkout(); // TODO: Get distance from wall
              }}
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
      </View>
    );
  }
  
  function WorkoutScreen() {
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
            handleStartWorkout();
          }}
        >
          <Text style={[styles.buttonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>
            {(isRunning ? "Stop workout" : "Start workout")}
          </Text>
        </Button>
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

// sync distance), 3 (workout), 4 (workout complete)

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
