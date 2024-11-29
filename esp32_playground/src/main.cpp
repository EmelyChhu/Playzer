#include "Workout.h"

const float ANGLE_PER_DUTY_CYCLE = 200.0 / SPREAD;

void setup() {

    ledcSetup(PWM_CHANNEL_BOT_SERVO, PWM_FREQ, PWM_RESOLUTION);
    ledcSetup(PWM_CHANNEL_TOP_SERVO, PWM_FREQ, PWM_RESOLUTION);

    ledcAttachPin(BOT_MOTOR_PIN, PWM_CHANNEL_BOT_SERVO);
    ledcAttachPin(TOP_MOTOR_PIN, PWM_CHANNEL_TOP_SERVO);


    ledcWrite(PWM_CHANNEL_TOP_SERVO, BASE_DUTY_CYCLE);
    ledcWrite(PWM_CHANNEL_BOT_SERVO, BASE_DUTY_CYCLE);
}

void loop() {


    ledcWrite(PWM_CHANNEL_BOT_SERVO, MIN_DUTY_CYCLE);
    delay(5000);
    ledcWrite(PWM_CHANNEL_BOT_SERVO, BASE_DUTY_CYCLE);
    delay(5000);
    ledcWrite(PWM_CHANNEL_BOT_SERVO, MAX_DUTY_CYCLE);
    delay(5000);

}