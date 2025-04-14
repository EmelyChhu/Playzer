import { Workout } from './index';

export type LaserPositionCardProps = {
  workout: Workout,
  index: number,
  laserPosition: number;
  removeButton?: boolean;
  removeLaserPosition?: (index: number) => void;
}

export type LaserGridProps = {
  numColumns: number,
  numRows: number,
  numPositions: number,
  laserPosition?: number,
  setLaserPositions?: React.Dispatch<React.SetStateAction<number[]>>,
  laserPositions?: number[],
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>,
  setPressedPosition?: React.Dispatch<React.SetStateAction<number | null>>,
}

export type PreviousWorkoutProps = {
  date: string,
  workoutId: string,
  name: string,
}
