import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from '@/components/Themed';
import { PaperProvider, Text, Button } from 'react-native-paper';
import { router } from 'expo-router';

/**
 * EntryScreen Component - main entry screen for the Playzer app
 * 
 * @returns {JSX.Element} - React component that renders the UI
 * 
 * displays welcome message
 * provides "Sign up" button that navigates to the sign-up page (`/auth/sign-up`)
 * provides "Log in" button that navigates to the log-in page (`/auth/log-in`)
 */
export default function EntryScreen() {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title}variant="displayLarge">
          Welcome to Playzer!
        </Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Button style={styles.button} mode="contained" onPress={() => router.push("/auth/sign-up")}>Sign up</Button>
        <Button style={styles.button} textColor='red' onPress={() => router.push("/auth/log-in")}>Log in</Button>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    padding: 25,
    textAlign: 'center',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  button: {
    margin: 10,
  },
});
