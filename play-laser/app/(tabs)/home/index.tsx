import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from '@/components/Themed';
import { PaperProvider, Text, ActivityIndicator } from 'react-native-paper';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useEffect, useState, useCallback } from 'react';
import { fetchUsers, FIREBASE_AUTH, fetchHistory } from '@/FirebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

/**
 * HomeScreen Component - home screen for the Playzer app
 * 
 * @returns {JSX.Element} - React component that renders the UI
 * 
 * displays welcome message
 * provides navigation bar that allows users to navigate to the "Workout" and "Profile" tabs
 */
export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].button;
  const backgroundColor = Colors[colorScheme ?? 'light'].progressBackground;

  const [recentWorkouts, setRecentWorkouts] = useState<string[][]>([]);
  
  console.log(recentWorkouts);
  useFocusEffect(
    useCallback(() => {
      const fetchUserHistory = async () => {
        const user = FIREBASE_AUTH.currentUser;
        if (user) {
          const fetchedRecentWorkouts = await fetchHistory(user.uid);
          setRecentWorkouts(fetchedRecentWorkouts);
        } else {
          setRecentWorkouts([]);
        }
      };
  
      fetchUserHistory();
    }, [])
  );

  if(!recentWorkouts) {
    return (
      <PaperProvider>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText} variant="displayLarge">
            Loading user information...
          </Text>
          <ActivityIndicator animating={true} size={100}/>
        </View>
      </PaperProvider>
    );
  }

  const numWorkouts = recentWorkouts.length;
  let numGoal = 5;
  let level = 1;
  // LVL 1 (5), LVL 2 (10), LVL 3 (25), LVL 4 (50), LVL 5 (100), LVL 6 (100+)
  if (numWorkouts >= 100) {
    numGoal = 250;
    level = 6;
  } else if (numWorkouts >= 50) {
    numGoal = 100;
    level = 5;
  } else if (numWorkouts >= 25) {
    numGoal = 50;
    level = 4;
  } else if (numWorkouts >= 10) {
    numGoal = 25;
    level = 3;
  } else if (numWorkouts >= 5) {
    numGoal = 10;
    level = 2;
  }
  const numNeeded = numGoal - numWorkouts;

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title} variant="headlineSmall">
          You are on
        </Text>
        <Text style={styles.title} variant="displayLarge">
          Level {level}
        </Text>
        <AnimatedCircularProgress
          style={styles.progress}
          size={250}
          width={25}
          fill={(numWorkouts / numGoal) * 100} // 0 to 100
          tintColor={tintColor}
          backgroundColor={backgroundColor}
        >
          {
            () => (
              <Text variant="displayLarge">
                {`${numWorkouts}/${numGoal}`}
              </Text>
            )
          }
        </AnimatedCircularProgress>
        <Text style={styles.title} variant="headlineMedium">
          Complete {numNeeded} more {numNeeded == 1 ? "workout" : "workouts"} to level up!
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
    padding: 50,
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 32,
  },
  loadingText: {
    textAlign: 'center',
  },
  progress: {
    margin: 40,
  }
});
