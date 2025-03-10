import React, { FC, useCallback } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  Modal,
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { View } from '@/components/Themed';
import { Device } from "react-native-ble-plx";
import { Button } from 'react-native-paper';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

type DeviceModalListItemProps = {
  item: ListRenderItemInfo<Device>;
  connectToPeripheral: (device: Device) => void;
  closeModal: () => void;
};

type DeviceModalProps = {
  devices: Device[];
  visible: boolean;
  connectToPeripheral: (device: Device) => void;
  closeModal: () => void;
};

/**
 * DeviceModalListItem Component - button that displays a nearby Playzer device and allows user to connect to them
 * 
 * @returns {JSX.Element} - React component that renders the UI
 * 
 * displays the name of the device
 * pressing the button will connect to the given device
 */
const DeviceModalListItem: FC<DeviceModalListItemProps> = (props) => {
  const colorScheme = useColorScheme();
  const { item, connectToPeripheral, closeModal } = props;

  const connectAndCloseModal = useCallback(() => {
    connectToPeripheral(item.item);
    closeModal();
  }, [closeModal, connectToPeripheral, item.item]);

  return (
    <TouchableOpacity
      onPress={connectAndCloseModal}
      style={[modalStyle.ctaButton, {backgroundColor: Colors[colorScheme ?? 'light'].button}]}
    >
      <Text style={[modalStyle.ctaButtonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>{item.item.name}</Text>
    </TouchableOpacity>
  );
};

/**
 * DeviceModal Component - screen that displays nearby Playzer devices and allows user to connect to them
 * 
 * @returns {JSX.Element} - React component that renders the UI
 * 
 * displays instructional message
 * displays button with the name of the device that connects the given device to the phone
 * provides "Close connection window" button that closes the modal and navigates to the connect-start page (`/(tabs)/workout/connect-start.tsx`)
 */
const DeviceModal: FC<DeviceModalProps> = (props) => {
  const colorScheme = useColorScheme();
  const { devices, visible, connectToPeripheral, closeModal } = props;

  const renderDeviceModalListItem = useCallback(
    (item: ListRenderItemInfo<Device>) => {
      return (
        <DeviceModalListItem
          item={item}
          connectToPeripheral={connectToPeripheral}
          closeModal={closeModal}
        />
      );
    },
    [closeModal, connectToPeripheral]
  );

  return (
    <Modal
      style={modalStyle.modalContainer}
      animationType="slide"
      transparent={false}
      visible={visible}
    >
      <View style={modalStyle.modalTitle}>
        <Text style={[modalStyle.modalTitleText, {color: Colors[colorScheme ?? 'light'].text}]}>
          Tap on a device to connect
        </Text>
        <FlatList
          contentContainerStyle={modalStyle.modalFlatlistContiner}
          data={devices}
          renderItem={renderDeviceModalListItem}
        />
        <Button style={modalStyle.closeModalButton} mode="contained" onPress={() => closeModal()}>
          <Text>Close connection window</Text>
        </Button>
      </View>
    </Modal>
  );
};

const modalStyle = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  modalFlatlistContiner: {
    flex: 1,
    justifyContent: "center",
  },
  modalCellOutline: {
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
  },
  modalTitle: {
    flex: 1,
    padding: 16,
  },
  modalTitleText: {
    marginTop: 40,
    fontSize: 40,
    fontWeight: "bold",
    marginHorizontal: 20,
    textAlign: "center",
  },
  ctaButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  closeModalButton: {
    width: '100%',
    height: 48,
    marginVertical: 16,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default DeviceModal;