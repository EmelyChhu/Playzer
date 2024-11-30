#include "Workout.h"

void setup() { 
    Serial.begin(115200);
    pinMode(LASER_PIN, OUTPUT);
    digitalWrite(LASER_PIN, LOW);

    ledcSetup(PWM_CHANNEL_BOT_SERVO, PWM_FREQ, PWM_RESOLUTION);
    ledcSetup(PWM_CHANNEL_TOP_SERVO, PWM_FREQ, PWM_RESOLUTION);

    ledcAttachPin(BOT_MOTOR_PIN, PWM_CHANNEL_BOT_SERVO);
    ledcAttachPin(TOP_MOTOR_PIN, PWM_CHANNEL_TOP_SERVO);

    ledcWrite(PWM_CHANNEL_TOP_SERVO, BASE_DUTY_CYCLE);
    ledcWrite(PWM_CHANNEL_BOT_SERVO, BASE_DUTY_CYCLE);
}

void loop() {
    /*
    Workout(uint8_t id, uint16_t duration_btwn, uint16_t lsr_duration, 
            uint8_t cols, uint8_t rows, uint8_t* pos, uint8_t num_pos)
    */
    uint8_t size = 12;
    uint8_t* pattern = new uint8_t[12];
    for (size_t i = 0; i < size; i++) {
        pattern[i] = i;
    }

    Workout test_workout;
    test_workout = Workout(1, 2, 2, 6, 4, pattern, size);
    // test_workout = Workout();

    test_workout.execute();

}