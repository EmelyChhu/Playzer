#ifndef WORKOUT_H
#define WORKOUT_H

#include "Constants.h"

class Workout {
private:
    bool random;
    bool slide;
    uint16_t duration_btwn_lasers_ms;
    uint16_t laser_duration_ms;
    uint8_t height;
    uint8_t width;
    std::vector<uint8_t> positions;
    uint8_t num_positions;
    uint8_t positions_index;

    uint8_t base_row;
    uint8_t base_col;

    uint8_t div_per_col;
    uint8_t div_per_row;

    uint8_t prev_bot_DC = 0;
    uint8_t prev_top_DC = 0;

    uint8_t curr_bot_DC = 0;
    uint8_t curr_top_DC = 0;
    int delta_top;
    int delta_bot;


    void go_to_position(uint8_t* pos);
    
    uint8_t decode_position_row(uint8_t *pos);

    uint8_t decode_position_col(uint8_t *pos);


public:
    // Default constructor
    Workout();

    // Constructor
    Workout(bool random, bool slide, uint16_t duration_btwn, uint16_t lsr_duration, 
    uint8_t height, uint8_t width, std::vector<uint8_t> pos, u_int8_t num_positions);

    void calibrate(double dist_ft);
    void checkRandom();

    bool execute();
    void return_to_base();

    ~Workout() {
        positions.clear(); // Free allocated memory
    }

};

#endif // WORKOUT_H
