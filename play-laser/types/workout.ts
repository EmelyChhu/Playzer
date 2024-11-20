export type Workout = {
    id: string;
    name: string;
    type: string;
    durationBetweenLasers: number;
    laserDuration: number;
    numColumns: number,
    numRows: number,
    numPositions: number;
    laserPositions: number[];
    creatorId?: string;
    description?: string;
    icon?: string;
}

const exampleWorkout1: Workout = {
    id: "1",
    name: "Basic 1",
    type: "Basic",
    durationBetweenLasers: 5,
    laserDuration: 5,
    numColumns: 8,
    numRows: 4,
    numPositions: 32,
    laserPositions: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31],
    description: "This is a basic workout where the targets travel horizontally.",
}

const exampleWorkout2: Workout = {
    id: "2",
    name: "Basic 2",
    type: "Basic",
    durationBetweenLasers: 10,
    laserDuration: 3,
    numColumns: 8,
    numRows: 4,
    numPositions: 32,
    laserPositions: [32, 16, 6, 22, 28, 12, 2, 18],
    description: "This is a basic workout where the targets travel vertically.",
}

const exampleWorkout3: Workout = {
    id: "3",
    name: "Basic 3",
    type: "Basic",
    durationBetweenLasers: 5,
    laserDuration: 10,
    numColumns: 8,
    numRows: 4,
    numPositions: 32,
    laserPositions: [1, 25, 18, 11, 4, 28, 21, 14, 7, 31, 24],
    description: "This is a basic workout where the targets travel diagonally.",
}

export const exampleWorkouts: Workout[] = [exampleWorkout1, exampleWorkout2, exampleWorkout3];
