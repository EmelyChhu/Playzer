import { StyleSheet, ScrollView, Pressable } from 'react-native';
import { useState, useEffect } from 'react';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from '@/components/Themed';
import { PaperProvider, Text, Button } from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Workout, exampleWorkouts } from '@/types';
import { router } from 'expo-router';
import { LaserPositionCardProps, LaserGridProps } from '@/types';

export default function CreateCustomRoutineScreen() {
  const colorScheme = useColorScheme();
  const workouts = exampleWorkouts;

  const [workoutDuration, setWorkoutDuration] = useState(0);
  const [durationBetweenLasers, setDurationBetweenLasers] = useState(0);
  const [laserDuration, setLaserDuration] = useState(0);
  const [laserPositions, setLaserPositions] = useState<number[]>([]);

  useEffect(() => {
    // perform calculation for workoutDuration
    setWorkoutDuration(durationBetweenLasers * laserDuration);
  }, [durationBetweenLasers, laserDuration, laserPositions]);

  useEffect(() => {
    setDurationBetweenLasers(durationBetweenLasers);
  }, [durationBetweenLasers]);

  useEffect(() => {
    setLaserDuration(laserDuration);
  }, [laserDuration]);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title} variant="headlineMedium">Create a Routine</Text>
        <Text variant="bodyMedium">
          Click on points on the grid in the order you'd like the laser positions to be and choose your workout settings.
        </Text>
        <Button style={styles.saveButton} mode='contained'>
          <Text style={[styles.buttonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>
            Save Custom Routine
          </Text>
        </Button>
        <Text style={styles.title} variant="titleLarge">Workout Details</Text>
        <Text variant="bodyMedium">
          <Text style={{ fontWeight: 'bold' }}>Workout Duration: </Text>
          {Math.floor(workoutDuration / 60)} minutes {workoutDuration % 60} seconds
        </Text>
        <Text variant="bodyMedium">
          <Text style={{ fontWeight: 'bold' }}>Laser Duration: </Text>
          {laserDuration} seconds
        </Text>
        <Text variant="bodyMedium">
          <Text style={{ fontWeight: 'bold' }}>Duration Between Lasers: </Text>
          {durationBetweenLasers} seconds
        </Text>
        <View style={styles.laserGridInputContainer}>
          <LaserGridInput 
            numColumns={8}
            numRows={4} 
            numPositions={32}
            setLaserPositions={setLaserPositions}
            laserPositions={laserPositions}
          />
        </View>
        <View style={styles.scrollViewContainer}>
          <ScrollView>
            {laserPositions.map((laserPosition, index) => (
              <LaserPositionCard
                key={index}
                workout={workouts[0]}
                index={index}
                laserPosition={laserPosition}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </PaperProvider>
  );
}

const LaserPositionCard: React.FC<LaserPositionCardProps> = ({ workout, laserPosition, index }) => {
  const colorScheme = useColorScheme();
  return (
    <View style={[styles.laserPositionCard, {backgroundColor: Colors[colorScheme ?? 'light'].button}]}>
      <LaserGrid 
        numColumns={workout.numColumns}
        numRows={workout.numRows} 
        numPositions={workout.numPositions} 
        laserPosition={laserPosition} 
      />
      <Text style={[styles.buttonText, {color: Colors[colorScheme ?? 'light'].buttonText}]}>
        Laser {index + 1}
      </Text>
    </View>
  )
}

const LaserGridInput: React.FC<LaserGridProps> = ({ numColumns, numRows, numPositions, laserPosition, setLaserPositions, laserPositions }) => {
  const colorScheme = useColorScheme();
  const laserPositionRow = laserPosition != undefined ? Math.floor((laserPosition - 1) / numColumns) : -1;
  const laserPositionColumn = laserPosition != undefined ? (laserPosition - 1) % numColumns : -1;
  
  const handleLaserPositionPress = (row: number, column: number) => {
    const newPosition = row * 8 + column + 1;
    if (setLaserPositions && laserPositions) {
      setLaserPositions([...laserPositions, newPosition]);
    }
  };

  const rows = [];
  for (let i = 0; i < numRows; i++) {
    const columns = [];
    for (let j = 0; j < numColumns; j++) {
      columns.push(
        <View key={`${i}-${j}`} style={styles.gridItem}>
          <Pressable onPress={() => handleLaserPositionPress(i, j)}>
            <FontAwesome
              name="dot-circle-o"
              size={32}
              color={Colors[colorScheme ?? 'light'].button} 
            />
          </Pressable>
        </View>
      );
    }
    rows.push(
      <View key={i} style={styles.gridRow}>
        {columns}
      </View>
    );
  }

  return (
    <View style={styles.laserGridInput}>
      {rows}
    </View>
  )
}

const LaserGrid: React.FC<LaserGridProps> = ({ numColumns, numRows, numPositions, laserPosition }) => {
  const colorScheme = useColorScheme();
  const laserPositionRow = laserPosition != undefined ? Math.floor((laserPosition - 1) / numColumns) : -1;
  const laserPositionColumn = laserPosition != undefined ? (laserPosition - 1) % numColumns : -1;

  const rows = [];
  for (let i = 0; i < numRows; i++) {
    const columns = [];
    for (let j = 0; j < numColumns; j++) {
      columns.push(
        <View key={`${i}-${j}`} style={[styles.gridItemInput, {backgroundColor: Colors[colorScheme ?? 'light'].button}]}>
          <FontAwesome
            name="dot-circle-o"
            size={9}
            color={(laserPositionRow == i && laserPositionColumn == j) ? "#422f7f" : "white"} 
          />
        </View>
      );
    }
    rows.push(
      <View key={i} style={[styles.gridRow, {backgroundColor: Colors[colorScheme ?? 'light'].button}]}>
        {columns}
      </View>
    );
  }

  return (
    <View style={[styles.laserGrid, {backgroundColor: Colors[colorScheme ?? 'light'].button}]}>
      {rows}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 4,
  },
  subtitle: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  buttonText: {
    fontSize: 16,
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingTop: 2,  // TODO: make vertical centering automatic
  },
  saveButton: {
    width: '100%',
    height: 48,
    marginVertical: 16,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  routineButtonsContainer: {
    height: 92,
  },
  routineButton: {
    width: 128,
    height: 80,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  routineButtonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  routineButtonText: {
    fontSize: 16,
    marginTop: 4,
    textAlign: 'center',
  },
  laserPositionCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 16,
    marginBottom: 16,
  },
  laserGrid: {
    marginRight: 32,
  },
  laserGridInput: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  gridItem: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  gridItemInput: {
    width: 8,
    height: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  scrollViewContainer: {
    flex: 1,
    width: '100%',
    marginTop: 16,
  },
  laserGridInputContainer : {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  }
});
