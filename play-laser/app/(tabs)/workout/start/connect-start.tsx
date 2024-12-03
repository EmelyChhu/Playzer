import { StyleSheet, PermissionsAndroid } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from '@/components/Themed';
import { PaperProvider, Button, TextInput, Text } from 'react-native-paper';
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
    // connectedDevice,
    heartRate,
    disconnectFromDevice,
    sendData,
  } = useBLE();

  const connectedDevice = true;

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [workoutDuration, setWorkoutDuration] = useState(150);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

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
        <View style={styles.container}>
          <Text>Loading workout...</Text> 
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

  const decodeWorkoutData = (workout: Workout): bigint => {
    let data = BigInt(0);
    data |= BigInt(workout.laserDuration) << BigInt(4);  // 4 bits for laserDuration
    data |= BigInt(workout.durationBetweenLasers) << BigInt(4);  // 4 bits for durationBetweenLasers
    data |= BigInt(workout.numRows) << BigInt(4);  // 4 bits for numRows
    data |= BigInt(workout.numColumns) << BigInt(4);  // 4 bits for numColumns
    data |= BigInt(workout.laserPositions.length) << BigInt(5);  // 5 bits for number of laserPositions
    for (let i = 0; i < workout.laserPositions.length; i++) {
      data |= BigInt(workout.laserPositions[i]) << BigInt(6)  // 6 bits for each laserPosition
    }
    data = data >> BigInt(6);
    // console.log(data.toString(16));
    return data;
  }

  const handleStartWorkout = () => {
    handleStartStop();
    const data = decodeWorkoutData(workout);
    if (connectedDevice) {
      sendData(connectedDevice, data);
    }
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        {connectedDevice ?
          (time == workoutDuration ?
            <View style={styles.infoContainer}>
              <Text style={[styles.infoText, {color: Colors[colorScheme ?? 'light'].text}]}>
                Workout completed!
              </Text>
            </View>
            :
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
            </View>)
        :
          <View style={styles.infoContainer}>
            <Text style={[styles.infoText, {color: Colors[colorScheme ?? 'light'].text}]}>
              Connect a device to start the workout
            </Text>
          </View>
        }
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
            if (connectedDevice) {
              // sendData(connectedDevice, time); // Send data to the device
              handleStartWorkout();
            } else {
              openModal(); // Open the device connection modal
            }
          }}
        >
          <Text style={[styles.buttonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>
            {connectedDevice ? (isRunning ? "Stop workout" : "Start workout") : "Connect device"}
          </Text>
        </Button>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginLeft: 8,
  },
  button: {
    width: '100%',
    height: 48,
    marginVertical: 16,
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
