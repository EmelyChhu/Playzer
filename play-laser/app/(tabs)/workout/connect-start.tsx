import { StyleSheet, PermissionsAndroid } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from '@/components/Themed';
import { PaperProvider, Button, TextInput, Text, ActivityIndicator, Portal, Dialog, SegmentedButtons } from 'react-native-paper';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { BleManager } from 'react-native-ble-plx';
import { useState, useEffect, useRef } from 'react';
import { btoa, atob } from 'react-native-quick-base64';
import { Workout, randomWorkout } from '@/types';
import { router } from 'expo-router';
import { useAudioPlayer } from 'expo-audio';

const audioSource = require('../../../assets/audio/done.mp3');

import DeviceModal from "../../device-connection-modal";
import { useBLEContext } from "@/BLEContext"
import { fetchWorkouts, addRecent } from "@/FirebaseConfig";
import { useLocalSearchParams } from 'expo-router';

/**
 * ConnectStartScreen Component - screen that provides the flow for connecting to a device and starting a workout routine
 * 
 * @returns {JSX.Element} - React component that renders the UI
 * 
 * ScreenState 1 - Connection: provides an interface to connect to the Playzer device
 * ScreenState 2 - Sync Distance: provides a live feed of the device's distance from the wall using a LiDar sensor
 * ScreenState 3 - Settings: provides an interface to input desired grid size and sliding settings
 * ScreenState 4 - Workout: provides an interface to begin a workout routine and a timer to track the progress
 * ScreenState 5 Workout Complete: provides a message that the workout is completed and "Exit" button
 */
export default function ConnectStartScreen() {
  const colorScheme = useColorScheme();
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    setConnectedDevice,
    distance,
    disconnectFromDevice,
    sendData,
    isDialogVisible,
    setIsDialogVisible,
    screenState,
    setScreenState
  } = useBLEContext();

  // const connectedDevice = true;
  // const screenState = 3;

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [workoutDuration, setWorkoutDuration] = useState(150);
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [sliding, setSliding] = useState("");

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

  const encodeWorkoutData2 = (workout: Workout, width: number, height: number, sliding: number): bigint => {
    const widthDiv = Math.floor(width / 2);
    const heightDiv = Math.floor(height / 2);

    let data = BigInt(0);
    if (workout.id == "RANDOM") {
      data |= BigInt(1); // 1 bit for deviceRandomized
    } else {
      data |= BigInt(0); // 1 bit for deviceRandomized
    }
    data <<= BigInt(1); 
    data |= BigInt(sliding);  // 1 bit for sliding
    data <<= BigInt(4);
    data |= BigInt(workout.laserDuration);  // 4 bits for laserDuration
    data <<= BigInt(4);
    data |= BigInt(workout.durationBetweenLasers);  // 4 bits for durationBetweenLasers
    data <<= BigInt(4);
    data |= BigInt(widthDiv);  // 4 bits for width
    data <<= BigInt(4);
    data |= BigInt(heightDiv);  // 4 bits for height
    data <<= BigInt(5);

    for (let i = 19; i >= 11; i--) {
      if (i <= workout.laserPositions.length - 1) {
        data |= BigInt(workout.laserPositions[i]); // 5 bits for each laserPosition
      }
      data <<= BigInt(5);
    }
    data >>= BigInt(4);
    data |= BigInt(1);  // 1 bit for data packet 1
    
    return data;
  }

  const encodeWorkoutData1 = (workout: Workout): bigint => {
    let data = BigInt(0);
    for (let i = 10; i >= 0; i--) {
      if (i <= workout.laserPositions.length - 1) {
        data |= BigInt(workout.laserPositions[i]); // 5 bits for each laserPosition
      }
      data <<= BigInt(5);
    }
    
    data |= BigInt(workout.laserPositions.length);  // 5 bits for number of laserPositions
    data <<= BigInt(1);
    data |= BigInt(0);  // 1 bit for data packet 1
    
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
    console.log("device:", connectedDevice);
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
      console.log("device", connectedDevice)
      if (connectedDevice) {
        sendData(connectedDevice, "RESCAN");    // send signal to rescan distance
        console.log("Rescanning distance");
      } else {
        console.log("Error: No device connected")
        setConnectedDevice(null);
        setIsDialogVisible(true);
        setScreenState(1);
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

  function SettingsScreen() {
    const colorScheme = useColorScheme();
  
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorMessageSliding, setErrorMessageSliding] = useState("");
    const [errorWidth, setErrorWidth] = useState(false);
    const [errorHeight, setErrorHeight] = useState(false);
  
    useEffect(() => {
      setWidth(width);
    }, [width]);
  
    useEffect(() => {
      setHeight(height);
    }, [height]);
  
    useEffect(() => {
      setSliding(sliding);
    }, [sliding]);
  
    const handleStartRoutine = async () => {
      const numWidth = parseFloat(width);
      const numHeight = parseFloat(height);
      let convFail = false;
      setErrorMessage("");
      setErrorMessageSliding("");
      setErrorWidth(false);
      setErrorHeight(false);
  
      if (!(!isNaN(numWidth) && Number.isInteger(numWidth) && numWidth % 2 == 0 && numWidth >= 2 && numWidth <= 30)) {
        convFail = true;
        setErrorMessage("Please enter an even integer between 2-30.");
        setErrorWidth(true);
      }
      if (!(!isNaN(numHeight) && Number.isInteger(numHeight) && numHeight % 2 == 0 && numHeight >= 2 && numHeight <= 30)) {
        convFail = true;
        setErrorMessage("Please enter an even integer between 2-30.");
        setErrorHeight(true);
      }
      if (sliding == "") {
        convFail = true;
        setErrorMessageSliding("Please select a laser type.");
      }
      if (!convFail) {
        setScreenState(4);
      }
    }
  
    useEffect(() => {
      if (width !== "" && height !== "" && sliding !== "") {
        setButtonDisabled(false);
      } else {
        setButtonDisabled(true);
      }
    }, [width, height, sliding]);
  
    return (
      <View style={styles.settingsContainer}>
        <Text style={styles.settingsTitle} variant="headlineMedium">
          Set Routine Settings
        </Text>
        <Text variant="bodyMedium">
          Input the settings for your workout routine.
        </Text>
        <Button style={styles.saveButton} mode='contained' onPress={handleStartRoutine}>
          <Text style={[styles.buttonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>
            Confirm settings
          </Text>
        </Button>
        <Text style={styles.settingsTitle} variant="titleLarge">
          Grid Size (feet)
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            mode="outlined"
            label="Width"
            value={width}
            onChangeText={setWidth}
            error={errorWidth}
          />
          <TextInput
            style={styles.input}
            mode="outlined"
            label="Height"
            value={height}
            onChangeText={setHeight}
            error={errorHeight}
          />
        </View>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        <Text style={styles.settingsTitle} variant="titleLarge">
          Laser Type
        </Text>
        <SegmentedButtons
          style={styles.segmentedButton}
          value={sliding}
          onValueChange={setSliding}
          buttons={[
            {
              value: '0',
              label: 'Blinking',
              icon: 'dots-grid',
            },
            {
              value: '1',
              label: 'Sliding',
              icon: 'line-scan'
            },
          ]}
        />
        {errorMessageSliding ? 
          <Text style={styles.errorText}>     
            {errorMessageSliding}
          </Text>
        : null}
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

    const player = useAudioPlayer(audioSource);

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
          player.play()
          setTimeout(() => setScreenState(5), 2000);
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

    const handleStartWorkout = async () => {
      if (connectedDevice) {
        const data1 = encodeWorkoutData1(workout);
        sendData(connectedDevice, data1);    // send workout data packet 1 to device
        console.log("Workout data 1 sent to device:", data1.toString(16));

        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const data2 = encodeWorkoutData2(workout, width, height, sliding);
        sendData(connectedDevice, data2);    // send workout data packet 2 to device
        console.log("Workout data 2 sent to device:", data2.toString(16));

        console.log("Workout sent to device:", workout);
      } else {
        console.log("Error: No device connected")
        setIsDialogVisible(true);
        setScreenState(1);
      }
      
      setWorkoutState(2);   // set workout state to running
      setTime(0);
    }

    const handleStopWorkout = () => {
      setWorkoutState(3);   // set workout state to stop
      
      if (connectedDevice) {
        sendData(connectedDevice, "STOP");    // send signal to stop workout
        console.log("Stopping workout");
      } else {
        console.log("Error: No device connected")
        setConnectedDevice(null);
        setIsDialogVisible(true);
        setScreenState(1);
      }
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
    const handleExit = async () => {
      setScreenState(1);
      const recentWorkout = await addRecent(workoutId);
      console.log(recentWorkout);
      router.push("../../workout");
    }

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
          onPress={() => handleExit()}
        >
          <Text style={[styles.buttonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>
            Exit and Save
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
            return <SettingsScreen />;
          case 4:
            return <WorkoutScreen />;
          case 5:
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
  buttonText: {
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 48,
    marginVertical: 16,
    justifyContent: 'center',
  },
  smallButton: {
    width: 100,
    height: 48,
    marginVertical: 16,
    marginLeft: 32,
    justifyContent: 'center',
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
  },
  settingsContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 16,
    paddingBottom: 0,
  },
  settingsTitle: {
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 4,
    marginTop: 8,
  },
  subtitle: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  saveButton: {
    width: '100%',
    height: 48,
    marginTop: 16,
    justifyContent: 'center',
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
  segmentedButton: {
    marginTop: 6,
  },
});
