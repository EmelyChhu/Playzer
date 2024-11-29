#ifndef WORKOUT_H
#define WORKOUT_H

#include "Constants.h"

class Workout {
private:

    int year;

public:
    // Constructor
    Workout(int time_between, int carModel, int carYear){

    }

    // Getter methods
    int getMake() const {
        return year;
    }
    
};

#endif // WORKOUT_H
