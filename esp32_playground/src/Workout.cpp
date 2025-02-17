#include "Workout.h"

void turn_on_laser(){
    // write high to the laser pin
    digitalWrite(LASER_PIN, HIGH);

}

void turn_off_laser(){
    // write low to the laser pin
    digitalWrite(LASER_PIN, LOW);
}

Workout::Workout(uint8_t id, uint16_t duration_btwn, uint16_t lsr_duration, 
uint8_t cols, uint8_t rows, std::vector<uint8_t> pos, uint8_t num_positions) :
id(id), columns(cols), rows(rows), positions(pos), num_positions(num_positions)
{
    duration_btwn_lasers_ms = duration_btwn * 1000;
    laser_duration_ms = lsr_duration * 1000;

    base_col = (int)(columns / 2);
    base_row = rows - 1;

    calibrate();

}

Workout::Workout() // creates default workout for testing
{
    id = 0;
    columns = 6;
    rows = 4;
    num_positions = 12;

    positions.resize(12); 
    for (size_t i = 1; i < num_positions+1; i++) {
        positions[i-1] = i;
    }

    duration_btwn_lasers_ms = 1 * 1000;
    laser_duration_ms = 2 * 1000;

    base_col = (int)(columns / 2);
    base_row = rows - 1;

    div_per_col = 5;
    div_per_row = 6;
    

}

void Workout::calibrate(uint8_t dist_ft){
    if (dist_ft < 5){
        div_per_col = 5;  // placeholder
        div_per_row = 6;  // placeholder
    } else if (dist_ft < 10){
        div_per_col = 4;
        div_per_row = 5;
    } else if (dist_ft < 15){
        div_per_col = 3;
        div_per_row = 4;
    } else if (dist_ft < 20){
        div_per_col = 2;
        div_per_row = 3;
    } else{
        div_per_col = 1;
        div_per_row = 2;
    }
}

uint8_t Workout::decode_position_row(uint8_t *pos){
    return (int)((*pos) / columns);
} 

uint8_t Workout::decode_position_col(uint8_t *pos){
    return (*pos) % columns;
} 

void Workout::go_to_position(uint8_t *pos){
    Serial.println("BOT duty cycle:");
    Serial.println(BASE_DUTY_CYCLE + div_per_col*(base_col - decode_position_col(pos)));
    ledcWrite(PWM_CHANNEL_BOT_SERVO, BASE_DUTY_CYCLE + div_per_col*(base_col - decode_position_col(pos)));
    
    Serial.println("TOP duty cycle:");
    Serial.println(BASE_DUTY_CYCLE + div_per_row*(base_row - decode_position_row(pos)));
    ledcWrite(PWM_CHANNEL_TOP_SERVO, BASE_DUTY_CYCLE + div_per_row*(base_row - decode_position_row(pos)));
} 

void Workout::return_to_base(){
    // recenter laser position
    ledcWrite(PWM_CHANNEL_BOT_SERVO, BASE_DUTY_CYCLE);
    ledcWrite(PWM_CHANNEL_TOP_SERVO, BASE_DUTY_CYCLE);
}

void Workout::execute(){
    if (positions[0] == 63){ // checking if positions should be random
        for (uint8_t i = 0; i < num_positions; i++){
            std::srand(std::time(0));
            positions[i] = (std::rand() % 32);
        }
    }

    for (uint8_t i = 0; i < num_positions; i++){

        Serial.println("position:");
        Serial.println(positions[i]);

        go_to_position(&(positions[i]));

        delay(MOVEMENT_DELAY);

        turn_on_laser();

        delay(laser_duration_ms);

        turn_off_laser();

        delay(duration_btwn_lasers_ms);

        return_to_base();
    }
}