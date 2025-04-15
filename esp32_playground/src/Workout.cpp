#include "Workout.h"

void turn_on_laser(){
    // write high to the laser pin
    digitalWrite(LASER_PIN, HIGH);

}

void Workout::turn_off_laser(){
    // write low to the laser pin
    digitalWrite(LASER_PIN, LOW);
}

Workout::Workout(bool random, bool slide, uint16_t duration_btwn, uint16_t lsr_duration, 
uint8_t h, uint8_t w, std::vector<uint8_t> pos, uint8_t num_positions) :
random(random), slide(slide), positions(pos), num_positions(num_positions)
{
    duration_btwn_lasers_ms = duration_btwn * 1000;
    laser_duration_ms = lsr_duration * 1000;
    height = h * 2; 
    width = w * 2;

    base_col = NUM_COLUMNS / 2;
    base_row = NUM_ROWS - 1;
    positions_index = 0;

    curr_bot_DC = curr_top_DC = BASE_DUTY_CYCLE;

    if (random){ // checking if positions should be random
        std::srand(std::time(0));

        for (uint8_t i = 0; i < num_positions; i++){
            positions[i] = (std::rand() % 32);
        }
    }

}

void Workout::calibrate(double dist_ft){

    Serial.println(width);
    Serial.println(dist_ft);
    Serial.println(std::atan(width / (2 * dist_ft)));

    // col divs based on half the width
    /*
        playzer
          /|
         / |
        /  |
       /   | dist
      /    |
     /     |
    /      |
    --------
        w/2
    */
    int col_divs = 2 * int(std::atan(width / (2 * dist_ft)) * (180 / 3.14) / ANGLE_PER_DUTY_CYCLE);
    div_per_col = col_divs % 8 < 4 ? int(col_divs / 8) : int(col_divs / 8) + 1;
    if (div_per_col > 12) div_per_col = 12;

    int row_divs = int(std::atan(height / dist_ft) * (180 / 3.14) / ANGLE_PER_DUTY_CYCLE);
    div_per_row = row_divs % 4 < 2 ? int(row_divs / 4) : int(row_divs / 4) + 1;
    if (div_per_row > 10) div_per_row = 10;

}

uint8_t Workout::decode_position_row(uint8_t *pos){
    return (int)((*pos) / NUM_COLUMNS);
} 

uint8_t Workout::decode_position_col(uint8_t *pos){
    return (*pos) % (NUM_COLUMNS);
} 

void Workout::go_to_position(uint8_t *pos){
    curr_bot_DC = BASE_DUTY_CYCLE + div_per_col*(base_col - decode_position_col(pos));
    curr_top_DC = BASE_DUTY_CYCLE + div_per_row*(base_row - decode_position_row(pos));
    
    Serial.println("BOT duty cycle:");
    Serial.println(curr_bot_DC);

    Serial.println("TOP duty cycle:");
    Serial.println(curr_top_DC);

    ledcWrite(PWM_CHANNEL_BOT_SERVO, curr_bot_DC);
    ledcWrite(PWM_CHANNEL_TOP_SERVO, curr_top_DC);
    delay(MOVEMENT_DELAY);
} 

void Workout::go_to_position_slide(uint8_t *pos){
    prev_bot_DC = curr_bot_DC;
    prev_top_DC = curr_top_DC;
    
    curr_bot_DC = BASE_DUTY_CYCLE + div_per_col*(base_col - decode_position_col(pos));
    curr_top_DC = BASE_DUTY_CYCLE + div_per_row*(base_row - decode_position_row(pos));
    
    Serial.println("BOT duty cycle:");
    Serial.println(curr_bot_DC);

    Serial.println("TOP duty cycle:");
    Serial.println(curr_top_DC);

    delta_top = curr_top_DC - prev_top_DC;
    delta_bot = curr_bot_DC - prev_bot_DC;
    
    if (delta_top == 0 && delta_bot == 0){
        ledcWrite(PWM_CHANNEL_BOT_SERVO, curr_bot_DC);
        ledcWrite(PWM_CHANNEL_TOP_SERVO, curr_top_DC);
        delay(duration_btwn_lasers_ms);
        return;
    }

    int small_itr = 0;
    int i = 0;

    if (abs(delta_top) > abs(delta_bot)){
        while(abs(i) < abs(delta_top)){
            i += delta_top / abs(delta_top);
            ledcWrite(PWM_CHANNEL_TOP_SERVO, prev_top_DC + i);
            Serial.print("top DC: ");
            Serial.println(prev_top_DC+i);
            if ((abs(delta_bot) > abs(small_itr))&& ((delta_top % (int)(delta_top/delta_bot)) == 0)){
                small_itr += int(delta_bot / abs(delta_bot));
                ledcWrite(PWM_CHANNEL_BOT_SERVO, prev_bot_DC + small_itr);
                Serial.print("bot DC: ");
                Serial.println(prev_bot_DC+small_itr);
            }else {
                ledcWrite(PWM_CHANNEL_BOT_SERVO, curr_bot_DC);
            }
            delay(int(duration_btwn_lasers_ms/abs(delta_top)));
        }
    } else {
        while(abs(i) < abs(delta_bot)){
            i += delta_bot / abs(delta_bot);
            ledcWrite(PWM_CHANNEL_BOT_SERVO, prev_bot_DC + i);
            Serial.print("bot DC: ");
            Serial.println(prev_bot_DC+i);
            if ((abs(delta_top) > abs(small_itr)) && ((delta_bot % (int)(delta_bot/delta_top)) == 0)){
                small_itr += int(delta_top / abs(delta_top));
                ledcWrite(PWM_CHANNEL_TOP_SERVO, prev_top_DC + small_itr);
                Serial.print("top DC: ");
                Serial.println(prev_top_DC+small_itr);
            } else {
                ledcWrite(PWM_CHANNEL_TOP_SERVO, curr_top_DC);
            }
            delay(int(duration_btwn_lasers_ms/abs(delta_bot)));
        }        
    }
} 

void Workout::return_to_base(){
    // recenter laser position
    ledcWrite(PWM_CHANNEL_BOT_SERVO, BASE_DUTY_CYCLE);
    ledcWrite(PWM_CHANNEL_TOP_SERVO, BASE_DUTY_CYCLE);
}

void Workout::show_bounds(){
    
    uint8_t bounds[4] = {0, 7, 31, 24};

    go_to_position(&bounds[0]);
    turn_on_laser();
    delay(900);
    for (int i = 1; i < 4; i++){
        go_to_position(&bounds[i]);
        delay(900);
    }
    go_to_position(&bounds[0]);
    delay(900);
    turn_off_laser();
    return_to_base();
    delay(500);

}

bool Workout::execute(){
    if (positions_index >= num_positions){
        return_to_base();
        return false;
    }

    Serial.println("position:");
    Serial.println(positions[positions_index]);

    if (!slide)
        go_to_position(&(positions[positions_index]));
    else
        go_to_position_slide(&(positions[positions_index]));

    turn_on_laser();

    delay(laser_duration_ms);

    if (!slide){
        turn_off_laser();
        delay(duration_btwn_lasers_ms);
    }

    positions_index++;

    return true;
}
