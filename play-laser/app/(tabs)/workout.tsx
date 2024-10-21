import { StyleSheet, PermissionsAndroid } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { Button, TextInput } from 'react-native-paper';
import { BleManager } from 'react-native-ble-plx';
import { useState, useEffect, useRef } from 'react';
import { btoa, atob } from 'react-native-quick-base64';

// const bleManager = new BleManager();

// // Android Bluetooth Permission
// async function requestLocationPermission() {
//   try {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
//       {
//         title: "Location permission for bluetooth scanning",
//         message:
//           "Grant location permission to allow the app to scan for Bluetooth devices",
//         buttonNeutral: "Ask Me Later",
//         buttonNegative: "Cancel",
//         buttonPositive: "OK",
//       }
//     );
//     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//       console.log("Location permission for bluetooth scanning granted");
//     } else {
//       console.log("Location permission for bluetooth scanning denied");
//     }
//   } catch (err) {
//     console.warn(err);
//   }
// }

// requestLocationPermission();

const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const STEP_DATA_CHAR_UUID = "beefcafe-36e1-4688-b7f5-00000000000b";

export default function WorkoutScreen() {
  const [deviceID, setDeviceID] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Searching...");
  const [time, setTime] = useState("");
  const [stepCount, setStepCount] = useState(0);
  const [stepDataChar, setStepDataChar] = useState(null);

  // const deviceRef = useRef(null);

  // const searchAndConnectToDevice = () => {
  //   bleManager.startDeviceScan(null, null, (error, device) => {
  //     if (error) {
  //       console.error(error);
  //       setConnectionStatus("Error searching for devices");
  //       return;
  //     }
  //     if (device.name === "Step-Sense") {
  //       bleManager.stopDeviceScan();
  //       setConnectionStatus("Connecting...");
  //       connectToDevice(device);
  //     }
  //   });
  // };

  // useEffect(() => {
  //   searchAndConnectToDevice();
  // }, []);

  // const connectToDevice = (device) => {
  //   return device
  //     .connect()
  //     .then((device) => {
  //       setDeviceID(device.id);
  //       setConnectionStatus("Connected");
  //       deviceRef.current = device;
  //       return device.discoverAllServicesAndCharacteristics();
  //     })
  //     .then((device) => {
  //       return device.services();
  //     })
  //     .then((services) => {
  //       let service = services.find((service) => service.uuid === SERVICE_UUID);
  //       return service.characteristics();
  //     })
  //     .then((characteristics) => {
  //       let stepDataCharacteristic = characteristics.find(
  //         (char) => char.uuid === STEP_DATA_CHAR_UUID
  //       );
  //       setStepDataChar(stepDataCharacteristic);
  //       stepDataCharacteristic.monitor((error, char) => {
  //         if (error) {
  //           console.error(error);
  //           return;
  //         }
  //         const rawStepData = atob(char.value);
  //         console.log("Received step data:", rawStepData);
  //         setStepCount(rawStepData);
  //       });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setConnectionStatus("Error in Connection");
  //     });
  // };

  // useEffect(() => {
  //   const subscription = bleManager.onDeviceDisconnected(
  //     deviceID,
  //     (error, device) => {
  //       if (error) {
  //         console.log("Disconnected with error:", error);
  //       }
  //       setConnectionStatus("Disconnected");
  //       console.log("Disconnected device");
  //       setStepCount(0); // Reset the step count
  //       if (deviceRef.current) {
  //         setConnectionStatus("Reconnecting...");
  //         connectToDevice(deviceRef.current)
  //           .then(() => setConnectionStatus("Connected"))
  //           .catch((error) => {
  //             console.log("Reconnection failed: ", error);
  //             setConnectionStatus("Reconnection failed");
  //           });
  //       }
  //     }
  //   );
  //   return () => subscription.remove();
  // }, [deviceID]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout</Text>
      <Text>{connectionStatus}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text>Time between laser intervals:</Text>
      <TextInput style={styles.input} value={time} onChangeText={setTime}></TextInput>
      <Button mode="contained" onPress={() => console.log("Send data to ESP32 with " + time + " second intervals")}>Start workout</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  }
});
