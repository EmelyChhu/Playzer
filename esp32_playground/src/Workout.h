#ifndef WORKOUT_H
#define WORKOUT_H

#include "Constants.h"
#include <cmath>

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

    int prev_bot_DC;
    int prev_top_DC;

    int curr_bot_DC;
    int curr_top_DC;
    int delta_top;
    int delta_bot;


    void go_to_position(uint8_t* pos);
    void go_to_position_slide(uint8_t* pos);
    
    uint8_t decode_position_row(uint8_t *pos);

    uint8_t decode_position_col(uint8_t *pos);


public:

    // Constructor
    Workout(bool random, bool slide, uint16_t duration_btwn, uint16_t lsr_duration, 
    uint8_t h, uint8_t w, std::vector<uint8_t> pos, u_int8_t num_positions);

    void calibrate(double dist_ft);
    void checkRandom();

    void show_bounds();
    bool execute();
    void return_to_base();

    void turn_off_laser();

    ~Workout() {
        positions.clear(); // Free allocated memory
    }

};

#endif // WORKOUT_H
