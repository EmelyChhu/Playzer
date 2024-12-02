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
    connectedDevice,
    heartRate,
    disconnectFromDevice,
    sendData,
  } = useBLE();

  // const connectedDevice = true;

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [time, setTime] = useState("");
  // console.log(workout);

  useEffect(() => {
    const workoutId = "1"; // TESTING BASIC 1 PREMADE ROUTINE
    // console.log("Fetching workout with ID:", workoutId);

    const loadWorkout = async () => {
      const fetchedWorkout = await fetchWorkouts(workoutId);
      // console.log("Fetched workout:", fetchedWorkout);
      setWorkout(fetchedWorkout);
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

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title} variant="headlineMedium">{workout.name}</Text> */}
      {/* <Text style={styles.title}>Workout!</Text> */}
      {/*<Text>{connectionStatus}</Text>*/}
      {/* <Button
        style={styles.button}
        mode='contained'
        onPress={() => {
          if (connectedDevice) {
            // sendData(connectedDevice, time); // Send data to the device
            console.log("Workout started")
          } else {
            openModal(); // Open the device connection modal
          }
        }}
      >
        <Text style={[styles.buttonText, {color: Colors[colorScheme ?? 'light'].text}]}>
          {connectedDevice ? "Start workout" : "Connect device"}
        </Text>
      </Button>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}
      
      {connectedDevice ?
        <View style={styles.infoContainer}>
          <Text style={[styles.numText, {color: Colors[colorScheme ?? 'light'].button}]}>
            2m 45s
          </Text>
          <Text style={[styles.infoText, {color: Colors[colorScheme ?? 'light'].text}]}>
            elapsed
          </Text>
          <Text style={[styles.numText, {color: Colors[colorScheme ?? 'light'].button}]}>
            4
          </Text>
          <Text style={[styles.infoText, {color: Colors[colorScheme ?? 'light'].text}]}>
            laser positions remaining
          </Text>
        </View>
      :
        <View style={styles.infoContainer}>
          <Text style={[styles.infoText, {color: Colors[colorScheme ?? 'light'].text}]}>
            Connect a device to start the workout
          </Text>
        </View>
      }
      {/* {connectedDevice ? (
          <>
            <Text>Device Connected</Text>
          </>
        ) : (
          <Text>
            Please Connect to a Device
          </Text>
        )} */}
      {/* {connectedDevice ?
        <View>
          <Text>Time between laser intervals:</Text>
          <TextInput style={styles.input} value={time} onChangeText={setTime}></TextInput>
          <Button style={styles.button} mode="contained" onPress={() => sendData(connectedDevice, time)}>Start workout</Button>
        </View>
      : null}
      {connectedDevice ? (
          <>
            <Text>Device Connected</Text>
          </>
        ) : (
          <Text>
            Please Connect to a Device
          </Text>
        )} */}
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
            console.log("Workout started")
          } else {
            openModal(); // Open the device connection modal
          }
        }}
      >
        <Text style={[styles.buttonText, {color: Colors[colorScheme ?? 'light'].text}]}>
          {connectedDevice ? "Start workout" : "Connect device"}
        </Text>
      </Button>
    </View>
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
  },
  numText: {
    textAlign: 'center',
    fontSize: 75,
    marginTop: 12,
  }
});
