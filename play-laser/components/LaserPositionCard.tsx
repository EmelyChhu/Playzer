import React from 'react';
import { StyleSheet } from 'react-native';

import { View } from '@/components/Themed';
import { Text } from 'react-native-paper';import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LaserPositionCardProps, LaserGridProps } from '@/types';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

/**
 * LaserPositionCard Component - card representing a laser position and the index of that laser within a workout routine
 * 
 * @param {LaserPositionCardProps} props - component props
 * @param {Workout} props.workout - object for the given workout
 * @param {number} props.laserPosition - the position of the laser within the grid
 * @param {number} props.index - the index of the laser in the workout routine
 * 
 * @returns {JSX.Element} - styled card displaying a laser position within the grid
 */
export default function LaserPositionCard(
  props: LaserPositionCardProps
) {
  const colorScheme = useColorScheme();
  const { workout, laserPosition, index } = props;
  
  return (
    <View style={[styles.laserPositionCard, {backgroundColor: Colors[colorScheme ?? 'light'].button}]}>
      <LaserGrid 
        numColumns={workout.numColumns}
        numRows={workout.numRows} 
        numPositions={workout.numPositions} 
        laserPosition={laserPosition} 
      />
      <Text style={[styles.text, {color: Colors[colorScheme ?? 'light'].buttonText}]}>
        Laser {index + 1}
      </Text>
    </View>
  );
}

/**
 * LaserGrid Component - grid representation of laser positions in a workout routine where the laser position is highlighted
 * 
 * @param {LaserGridProps} props - component props
 * @param {number} props.numColumns - number of columns in the workout grid
 * @param {number} props.numRows - number of rows in the workout grid
 * @param {number | undefined} props.laserPosition - position of the laser
 * 
 * @returns {JSX.Element} - grid of dots with the current laser position highlighted
 */
const LaserGrid: React.FC<LaserGridProps> = ({
  numColumns,
  numRows,
  laserPosition
}) => {
  const colorScheme = useColorScheme();
  const laserPositionRow = laserPosition != undefined ? Math.floor(laserPosition / numColumns) : -1;
  const laserPositionColumn = laserPosition != undefined ? (laserPosition % numColumns) : -1;

  const rows = [];
  for (let i = 0; i < numRows; i++) {
    const columns = [];
    for (let j = 0; j < numColumns; j++) {
      columns.push(
        <View key={`${i}-${j}`} style={[styles.gridItem, {backgroundColor: Colors[colorScheme ?? 'light'].button}]}>
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
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  gridItem: {
    width: 8,
    height: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  text: {
    fontSize: 16,
    marginLeft: 8,
  },
});
