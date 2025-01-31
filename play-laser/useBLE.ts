/* eslint-disable no-bitwise */
import { useMemo, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from "react-native-ble-plx";

import * as ExpoDevice from "expo-device";

import base64 from "react-native-base64";
import {atob, btoa} from 'react-native-quick-base64';

const SERVICE_UUID = "0e5b8089-499c-45a4-abf8-a03b72e250f3";
const NUM_CHARACTERISTIC_UUID = "615a8742-09c4-4e94-a410-a9db961335d1";

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  connectToDevice: (deviceId: Device) => Promise<void>;
  disconnectFromDevice: () => void;
  connectedDevice: Device | null;
  allDevices: Device[];
  distance: number;
  sendData(
    device: Device,
    data: bigint,
  ): Promise<void>;
  isDialogVisible: boolean;
  setIsDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * React Hook to manage Bluetooh Low Energy (BLE) connections
 * 
 * @returns {BluetoothLowEnergyApi} - object with functions and state variables for BLE interactions
 * 
 * @property {() => void} scanForPeripherals - scans for BLE devices
 * @property {() => Promise<boolean>} requestPermissions - requests necessary Bluetooth permissions
 * @property {(device: Device) => Promise<void>} connectToDevice - connects to the selected BLE device
 * @property {Device[]} allDevices - list of discovered BLE devices
 * @property {Device | null} connectedDevice - currently connected BLE device
 * @property {() => void} disconnectFromDevice - disconnects from the connected BLE device
 * @property {number} distance - last received distance measurement from the LiDar sensor
 * @property {(device: Device, data: bigint) => Promise<void>} sendData - sends data to the connected BLE device
 * @property {boolean} isDialogVisible - indicates if an error dialog should be displayed
 * @property {(visible: boolean) => void} setIsDialogVisible - sets the visibility of the error dialog
 */
function useBLE(): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [distance, setDistance] = useState<number>(0);
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const requestAndroid31Permissions = async () => {
    // const bluetoothScanPermission = await PermissionsAndroid.request(
    //   PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    //   {
    //     title: "Location Permission",
    //     message: "Bluetooth Low Energy requires Location",
    //     buttonPositive: "OK",
    //   }
    // );
    // const bluetoothConnectPermission = await PermissionsAndroid.request(
    //   PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    //   {
    //     title: "Location Permission",
    //     message: "Bluetooth Low Energy requires Location",
    //     buttonPositive: "OK",
    //   }
    // );
    // const fineLocationPermission = await PermissionsAndroid.request(
    //   PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //   {
    //     title: "Location Permission",
    //     message: "Bluetooth Low Energy requires Location",
    //     buttonPositive: "OK",
    //   }
    // );
    let bluetoothScanPermission;
    let bluetoothConnectPermission;
    let fineLocationPermission;
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      bluetoothScanPermission = granted;
      bluetoothConnectPermission = granted;
      fineLocationPermission = granted;
    } catch (error) {
      console.warn(error);
    }

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const scanForPeripherals = () =>
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
        setIsDialogVisible(true);
      }
      if (device && device.name?.includes("Playzer")) {
        setAllDevices((prevState: Device[]) => {
          if (!isDuplicteDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });

  const connectToDevice = async (device: Device) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();
      startStreamingData(deviceConnection);
    } catch (error) {
      console.log("FAILED TO CONNECT", error);
      setIsDialogVisible(true);
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      setDistance(0);
    }
  };

  const onDistanceUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.log(error);
      setIsDialogVisible(true);
      return -1;
    } else if (!characteristic?.value) {
      console.log("No Data was recieved");
      return -1;
    }

    const decodedValue = atob(characteristic.value);
    console.log(decodedValue);
    setDistance(Number(decodedValue));
  };

  const startStreamingData = async (device: Device) => {
    if (device) {
      device.monitorCharacteristicForService(
        SERVICE_UUID,
        NUM_CHARACTERISTIC_UUID,
        onDistanceUpdate
      );
    } else {
      console.log("No Device Connected");
    }
  };

  const sendData = async (device: Device, data: bigint) => {
    try {
      await bleManager.writeCharacteristicWithoutResponseForDevice(
        device.id,
        SERVICE_UUID,
        NUM_CHARACTERISTIC_UUID,
        btoa(`${data}`),
      );
    } catch (error) {
      console.log(error);
      setIsDialogVisible(true);
    }
  };

  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
    distance,
    sendData,
    isDialogVisible,
    setIsDialogVisible,
  };
}

export default useBLE;