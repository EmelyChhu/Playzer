#ifndef CONSTANTS_h
#define CONSTANTS_h

#include <ESP32Servo.h>

#define LASER_PIN 26 // Replace with the GPIO pin you want to toggle
#define MOVEMENT_DELAY 300

const uint8_t BOT_MOTOR_PIN = 14;
const uint8_t TOP_MOTOR_PIN = 12;

const int PWM_CHANNEL_BOT_SERVO = 0;
const int PWM_CHANNEL_TOP_SERVO = 1;
const int PWM_FREQ = 100;
const int PWM_RESOLUTION = 10;

const uint32_t MAX_DUTY_CYCLE = 275;
const uint32_t MIN_DUTY_CYCLE = 37;
const uint32_t BASE_DUTY_CYCLE = (int)((MIN_DUTY_CYCLE + MAX_DUTY_CYCLE) / 2);

const uint32_t SPREAD = MAX_DUTY_CYCLE - MIN_DUTY_CYCLE + 1;
const float ANGLE_PER_DUTY_CYCLE = 200.0 / SPREAD;

#endif
