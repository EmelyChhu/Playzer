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
    laserPositions: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30],
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
    laserPositions: [31, 15, 5, 21, 27, 11, 1, 17],
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
    laserPositions: [0, 24, 17, 10, 3, 27, 20, 13, 6, 30, 23],
    description: "This is a basic workout where the targets travel diagonally.",
}

const exampleWorkout4: Workout = {
    id: "4",
    name: "Random 1",
    type: "Random",
    durationBetweenLasers: 5,
    laserDuration: 10,
    numColumns: 8,
    numRows: 4,
    numPositions: 32,
    laserPositions: [19, 17, 27, 23],
    description: "This is a random workout.",
}

const exampleWorkout5: Workout = {
    id: "5",
    name: "Random 2",
    type: "Random",
    durationBetweenLasers: 5,
    laserDuration: 10,
    numColumns: 8,
    numRows: 4,
    numPositions: 32,
    laserPositions: [30, 6, 10, 13],
    description: "This is a random workout.",
}

const exampleWorkout6: Workout = {
    id: "6",
    name: "Random 3",
    type: "Random",
    durationBetweenLasers: 5,
    laserDuration: 10,
    numColumns: 8,
    numRows: 4,
    numPositions: 32,
    laserPositions: [10, 31, 13, 14],
    description: "This is a random workout.",
}

const exampleWorkout7: Workout = {
    id: "7",
    name: "Football",
    type: "Sport-Specific",
    durationBetweenLasers: 5,
    laserDuration: 10,
    numColumns: 8,
    numRows: 4,
    numPositions: 32,
    laserPositions: [0, 2, 4, 6],
    description: "This is a sport-specific football workout.",
}

const exampleWorkout8: Workout = {
    id: "8",
    name: "Soccer",
    type: "Sport-Specific",
    durationBetweenLasers: 5,
    laserDuration: 10,
    numColumns: 8,
    numRows: 4,
    numPositions: 32,
    laserPositions: [0, 7, 24, 31],
    description: "This is a sport-specific soccer workout.",
}

const exampleWorkout9: Workout = {
    id: "9",
    name: "Tennis",
    type: "Sport-Specific",
    durationBetweenLasers: 5,
    laserDuration: 10,
    numColumns: 8,
    numRows: 4,
    numPositions: 32,
    laserPositions: [8, 10, 12, 14],
    description: "This is a sport-specific tennis workout.",
}

export const randomWorkout: Workout = {
    id: "0",
    name: "Device Randomized",
    type: "Random",
    durationBetweenLasers: 1,
    laserDuration: 2,
    numColumns: 8,
    numRows: 4,
    numPositions: 32,
    laserPositions: [63, 63, 63, 63],
    description: "This is a sport-specific tennis workout.",
}

export const exampleWorkouts: Workout[] = [exampleWorkout1, exampleWorkout2, exampleWorkout3, exampleWorkout4, exampleWorkout5, exampleWorkout6, exampleWorkout7, exampleWorkout8, exampleWorkout9];
