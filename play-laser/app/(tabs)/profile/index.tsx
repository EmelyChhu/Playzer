import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from '@/components/Themed';
import { Text, Button, PaperProvider } from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

/**
 * ProfileScreen Component - profile screen for the Playzer app
 * 
 * @returns {JSX.Element} - React component that renders the UI
 * 
 * displays the user's profile picture, name, and recent workouts (TODO)
 * provides "Edit Profile" button that allows users to navigate to a screen to edit their profile (TODO)
 * provides gear icon button that allows users to navigate to the Settings page (`(tabs)/profile/settings`)
 */
export default function ProfileScreen() {
  const colorScheme = useColorScheme();

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={[styles.profileContainer, {backgroundColor: Colors[colorScheme ?? 'light'].headerBackground}]}>
          <FontAwesome
                style={styles.icon}
                name="user-circle"
                size={75}
                color={Colors[colorScheme ?? 'light'].button}
              />
          <Text style={styles.title}>User</Text>
          <Button style={styles.editButton} mode="contained">Edit Profile</Button>
        </View>
        <View style={styles.recentWorkoutsContainer}>
          <Text style={styles.header}>Recent Workouts</Text>
            <Text variant="bodyLarge">
              You haven't completed a workout yet! Complete a workout to see it here.
            </Text>
        </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  profileContainer: {
    width: '100%',
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentWorkoutsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 32,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  icon: {
    marginBottom: 8,
  },
  editButton: {
    width: 200,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 12,
  }
});
