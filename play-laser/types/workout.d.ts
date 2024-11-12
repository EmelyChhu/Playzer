export type Workout = {
    id: string;
    name: string;
    type: string;
    timeBetweenLasers: number;
    timeOfLasers: number;
    numPositions: number;
    laserPositions: number[];
    creatorId?: id;
    description?: string;
    icon?: string;
}
