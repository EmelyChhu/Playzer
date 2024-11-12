import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from '@/components/Themed';
import { Text, Button } from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <View style={[styles.profileContainer, {backgroundColor: Colors[colorScheme ?? 'light'].headerBackground}]}>
        <FontAwesome
              style={styles.icon}
              name="user-circle"
              size={75}
              color={Colors[colorScheme ?? 'light'].text}
            />
        <Text style={styles.title}>User</Text>
        <Button style={styles.editButton} mode="contained">Edit Profile</Button>
      </View>
      {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}
      <View style={styles.recentActivitiesContainer}>
        <Text style={styles.title}>Recent Activities</Text>
      </View>
    </View>
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
  recentActivitiesContainer: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    color: 'white',
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
    borderRadius: 0,
  },
});
