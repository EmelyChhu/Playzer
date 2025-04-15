import React from 'react';
import { StyleSheet } from 'react-native';

import { View } from '@/components/Themed';
import { PaperProvider, Text, Button } from 'react-native-paper';import FontAwesome from '@expo/vector-icons/FontAwesome';
import { RelativePathString, router } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

/**
 * NavigationButton Component - button with text, an icon, and the ability to navigate to a given page
 * 
 * @param {Object} props - component props
 * @param {"medium" | "small"} props.size - size of the button
 * @param {RelativePathString} [props.path] - relative path to navigate to when pressed (optional)
 * @param {string} props.text - text displayed on the button.
 * @param {string} [props.icon] - name of the FontAwesome icon to display (optional)
 * 
 * @returns {JSX.Element} - styled button that may include an icon and text
 */
export default function NavigationButton(
  props: {
    size: string,
    path?: RelativePathString,
    text: string,
    icon?: string
  }
) {
  const colorScheme = useColorScheme();
  const { size, path, text, icon } = props;
  
  return (
    <Button
      style={size == "medium" ? styles.mediumContainer : styles.smallContainer}
      mode='contained'
      onPress={path ? () => router.push(path) : undefined}
    >
      <View style={styles.contentContainer}>
        {icon
          ?
          <FontAwesome
            style={styles.icon}
            name={icon}
            size={25}
            color={Colors[colorScheme ?? 'light'].buttonText}
          />
          : 
          undefined
        }
        <Text style={[styles.text, {color: Colors[colorScheme ?? 'light'].buttonText}]}>
          {text}
        </Text>
      </View> 
    </Button>
  );
}

const styles = StyleSheet.create({
  smallContainer: {
    width: 128,
    height: 80,
    marginVertical: 8,
    justifyContent: 'center',
    marginRight: 16,
  },
  mediumContainer: {
    width: '48%',
    height: 96,
    marginVertical: 16,
    justifyContent: 'center',
  },
  contentContainer: {
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  icon: {
    marginBottom: 4,
  }
});
