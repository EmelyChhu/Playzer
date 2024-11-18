import { Workout } from './index';

export type LaserPositionCardProps = {
  workout: Workout,
  laserPosition: number;
}

export type LaserGridProps = {
  numColumns: number,
  numRows: number,
  numPositions: number,
  laserPosition: number,
}
