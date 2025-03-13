#include "Workout.h"

void turn_on_laser(){
    // write high to the laser pin
    digitalWrite(LASER_PIN, HIGH);

}

void turn_off_laser(){
    // write low to the laser pin
    digitalWrite(LASER_PIN, LOW);
}

Workout::Workout(bool random, bool slide, uint16_t duration_btwn, uint16_t lsr_duration, 
uint8_t height, uint8_t width, std::vector<uint8_t> pos, uint8_t num_positions) :
random(random), slide(slide), height(height), width(width), positions(pos), num_positions(num_positions)
{
    duration_btwn_lasers_ms = duration_btwn * 1000;
    laser_duration_ms = lsr_duration * 1000;
    height = height * 2; 
    width = width * 2;

    base_col = (int)(height / 2);
    base_row = width;
    positions_index = 0;

    if (random){ // checking if positions should be random
        std::srand(std::time(0));

        for (uint8_t i = 0; i < num_positions; i++){
            positions[i] = (std::rand() % 32) + 1;
        }
    }

}

void Workout::calibrate(double dist_ft){

    int col_divs = int(std::atan(width / 2 / dist_ft) * (180 / M_PI) / ANGLE_PER_DUTY_CYCLE);
    div_per_col = int(col_divs / 8) ? col_divs % 8 > 3 : int(col_divs / 8) + 1;

    int row_divs = int(std::atan(height / dist_ft) * (180 / M_PI) / ANGLE_PER_DUTY_CYCLE);
    div_per_row = int(row_divs / 4) ? row_divs % 8 > 1 : int(row_divs / 8) + 1;

}

uint8_t Workout::decode_position_row(uint8_t *pos){
    return (int)((*pos) / NUM_COLUMNS);
} 

uint8_t Workout::decode_position_col(uint8_t *pos){
    return (*pos) % NUM_COLUMNS;
} 

void Workout::go_to_position(uint8_t *pos){
    if (slide){
        prev_bot_DC = curr_bot_DC;
        prev_top_DC = curr_top_DC;
    }
    curr_bot_DC = BASE_DUTY_CYCLE + div_per_col*(base_col - decode_position_col(pos));
    curr_top_DC = BASE_DUTY_CYCLE + div_per_row*(base_row - decode_position_row(pos));
    
    Serial.println("BOT duty cycle:");
    Serial.println(curr_bot_DC);

    Serial.println("TOP duty cycle:");
    Serial.println(curr_top_DC);

    if (!slide) {
        ledcWrite(PWM_CHANNEL_BOT_SERVO, curr_bot_DC);
        ledcWrite(PWM_CHANNEL_TOP_SERVO, curr_top_DC);
        delay(MOVEMENT_DELAY);
    }else{
        delta_top = curr_top_DC - prev_top_DC;
        delta_bot = curr_bot_DC - prev_bot_DC;


        // needs more work
        ledcWrite(PWM_CHANNEL_BOT_SERVO, prev_bot_DC + (delta_bot/2));
        ledcWrite(PWM_CHANNEL_TOP_SERVO, prev_top_DC + (delta_top/2));
        delay(duration_btwn_lasers_ms/2);

        ledcWrite(PWM_CHANNEL_BOT_SERVO, curr_bot_DC);
        ledcWrite(PWM_CHANNEL_TOP_SERVO, curr_top_DC);
        delay(duration_btwn_lasers_ms/2);
        //

    }
} 

void Workout::return_to_base(){
    // recenter laser position
    ledcWrite(PWM_CHANNEL_BOT_SERVO, BASE_DUTY_CYCLE);
    ledcWrite(PWM_CHANNEL_TOP_SERVO, BASE_DUTY_CYCLE);
}

bool Workout::execute(){
    if (positions_index >= num_positions){
        return_to_base();
        return false;
    }

    Serial.println("position:");
    Serial.println(positions[positions_index]);

    go_to_position(&(positions[positions_index]));

    turn_on_laser();

    delay(laser_duration_ms);

    if (!slide){
        turn_off_laser();
        delay(duration_btwn_lasers_ms);
    }

    positions_index++;

    return true;
}
