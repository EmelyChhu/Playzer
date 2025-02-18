import { Workout } from './index';

export type LaserPositionCardProps = {
  workout: Workout,
  index: number,
  laserPosition: number;
}

export type LaserGridProps = {
  numColumns: number,
  numRows: number,
  numPositions: number,
  laserPosition?: number,
  setLaserPositions?: React.Dispatch<React.SetStateAction<number[]>>,
  laserPositions?: number[],
}

export type PreviousWorkoutProps = {
  date: Date,
  workoutId: string,
}
