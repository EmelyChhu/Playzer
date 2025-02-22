import { StyleSheet, ScrollView } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from '@/components/Themed';
import { Text, Button, PaperProvider } from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { PreviousWorkoutProps } from '@/types';
import { useEffect, useState, useCallback } from 'react';
import { fetchUsers, FIREBASE_AUTH, fetchHistory } from '@/FirebaseConfig';
import { useFocusEffect } from '@react-navigation/native';

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
  const date = new Date(2025, 1, 17);
  // const recentWorkouts = [[date, "1"], [date, "1"]];
  // const recentWorkouts = await fetchRecent("BZa3BZs25YKy14acgWxD");
  const [name, setName] = useState<string | null>(null);
  const [recentWorkouts, setRecentWorkouts] = useState<string[][]>([]);

  console.log(recentWorkouts);
  useFocusEffect(
    useCallback(() => {
      const fetchDisplayNameAndHistory = async () => {
        const user = FIREBASE_AUTH.currentUser;
        if (user) {
          const fetchedName = await fetchUsers(user.uid);
          setName(fetchedName);
          const fetchedRecentWorkouts = await fetchHistory(user.uid);
          setRecentWorkouts(fetchedRecentWorkouts);
        } else {
          setName("User");
          setRecentWorkouts([]);
        }
      };
  
      fetchDisplayNameAndHistory();
    }, [])
  );

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
          <Text style={styles.title}>{name || "User"}</Text>
          <Button style={styles.editButton} mode="contained">Edit Profile</Button>
        </View>
        <View style={styles.recentWorkoutsContainer}>
          <Text style={styles.header}>Recent Workouts</Text>
          {recentWorkouts.length == 0 ? 
            <Text style={styles.emptyStateText} variant="bodyLarge">
              You haven't completed a workout yet! Complete a workout to see it here.
            </Text>
            :
            <View style={styles.scrollViewContainer}>
              <ScrollView>
                {recentWorkouts.map((workout, index) => (
                  <PreviousWorkoutCard
                    key={index}
                    date={workout.date}
                    workoutId={workout.workoutId}
                    name={workout.name}
                  />
                ))}
              </ScrollView>
            </View>
          }
        </View>
      </View>
    </PaperProvider>
  );
}

/**
 * PreviousWorkoutCard Component - card with date and name of previous workout
 * 
 * @param {Object} props - component props
 * @param {Date} props.date - date of workout
 * @param {string} props.workoutId - documentId of workout
 * @param {string} props.name - name of workout
 * 
 * @returns {JSX.Element} - styled card that includes icon and text
 */
const PreviousWorkoutCard: React.FC<PreviousWorkoutProps> = ({date, workoutId, name}) => {
  const colorScheme = useColorScheme();

  const formatDate = (date: string) => {
    const [year, month, day] = date.split('-')
    return `${month}/${day}/${year}`;
  }

  return (
    <View style={[styles.card, {backgroundColor: Colors[colorScheme ?? 'light'].button}]}>
      <FontAwesome
        style={styles.workoutIcon}
        name="crosshairs"
        size={50}
        color={Colors[colorScheme ?? 'light'].buttonText}
      />
      <View style={styles.infoContainer}>
        <Text style={[styles.dateText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>
          {formatDate(date)}
        </Text>
        <Text style={[styles.workoutNameText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>
          {name}
        </Text>
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
  scrollViewContainer: {
    flex: 1,
    width: '100%',
    marginTop: 4,
    marginBottom: 150,
  },
  infoContainer: {
    flex: 1,
    // width: '100%',
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  profileContainer: {
    width: '100%',
    height: 225,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentWorkoutsContainer: {
    paddingHorizontal: 16,
    width: '100%',
    height: '100%',
    // backgroundColor: 'white',
    // paddingVertical: 24,
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
  workoutIcon: {
    marginLeft: 8,
    marginRight: 14,
  },
  editButton: {
    width: 200,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 12,
    marginTop: 24,
  },
  emptyStateText: {
    // marginHorizontal: 16,
  },
  card: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    padding: 8,
    borderRadius: 16,
    marginBottom: 12,
    height: 75,
  },
  dateText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  workoutNameText: {
    fontSize: 18,
    textAlign: 'left',
  },
});
