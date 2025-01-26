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
  heartRate: number;
  sendData(
    device: Device,
    data: bigint,
  ): Promise<void>;
  readData(
    device: Device
  ): Promise<string | null>;
}

function useBLE(): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [heartRate, setHeartRate] = useState<number>(0);

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
    } catch (err) {
      console.warn(err);
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
    } catch (e) {
      console.log("FAILED TO CONNECT", e);
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      setHeartRate(0);
    }
  };

  const onHeartRateUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.log(error);
      return -1;
    } else if (!characteristic?.value) {
      console.log("No Data was recieved");
      return -1;
    }

    const rawData = base64.decode(characteristic.value);
    let innerHeartRate: number = -1;

    const firstBitValue: number = Number(rawData) & 0x01;

    if (firstBitValue === 0) {
      innerHeartRate = rawData[1].charCodeAt(0);
    } else {
      innerHeartRate =
        Number(rawData[1].charCodeAt(0) << 8) +
        Number(rawData[2].charCodeAt(2));
    }

    setHeartRate(innerHeartRate);
  };

  const startStreamingData = async (device: Device) => {
    if (device) {
      device.monitorCharacteristicForService(
        SERVICE_UUID,
        NUM_CHARACTERISTIC_UUID,
        onHeartRateUpdate
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
    }
  };

  const readData = async (device: Device): Promise<string | null> => {
    try {
      const characteristic = await bleManager.readCharacteristicForDevice(
        device.id,
        SERVICE_UUID,
        NUM_CHARACTERISTIC_UUID
      );
  
      if (characteristic?.value) {
        // Decode the Base64-encoded value
        const decodedValue = Buffer.from(characteristic.value, 'base64').toString('utf-8');
        console.log('Read data:', decodedValue);
        return decodedValue; // Return the decoded value
      } else {
        console.warn('Characteristic value is null');
        return null;
      }
    } catch (error) {
      console.error('Error reading data:', error);
      return null;
    }
  };

  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
    heartRate,
    sendData,
    readData
  };
}

export default useBLE;