import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from '@/components/Themed';
import { PaperProvider, Text } from 'react-native-paper';

/**
 * HomeScreen Component - home screen for the Playzer app
 * 
 * @returns {JSX.Element} - React component that renders the UI
 * 
 * displays welcome message
 * provides navigation bar that allows users to navigate to the "Workout" and "Profile" tabs
 */
export default function HomeScreen() {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title} variant="displayLarge">
          Welcome to Playzer!
        </Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text style={styles.subtitle} variant="bodyLarge">
          Navigate to the "Workout" tab to start training!
        </Text>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
