// /*
//  * SPDX-FileCopyrightText: 2010-2022 Espressif Systems (Shanghai) CO LTD
//  *
//  * SPDX-License-Identifier: CC0-1.0
//  */

// #include <Arduino.h> 
// #include <ESP32Servo.h>

// const uint8_t BOT_MOTOR_PIN = 25;
// const uint8_t TOP_MOTOR_PIN = 26;

// #define BOT_MOTOR_PWM    0
// #define TOP_MOTOR_PWM    1


// const uint16_t MAX_PWM = 2^12 - 1;

// Servo bottom_servo;
// Servo top_servo;

// uint8_t top_base_ang = 110;
// uint8_t bot_base_ang = 90;


// void setup(){
//     ESP32PWM::allocateTimer(0);
// 	ESP32PWM::allocateTimer(1);
// 	ESP32PWM::allocateTimer(2);
// 	ESP32PWM::allocateTimer(3);

//     Serial.begin(921600);
//     Serial.println("Hello from the setup");


//     bottom_servo.setPeriodHertz(50);
//     bottom_servo.attach(BOT_MOTOR_PIN, 1000, 2000);
//     top_servo.setPeriodHertz(50);
//     top_servo.attach(TOP_MOTOR_PIN, 1000, 2000);

//     bottom_servo.write(bot_base_ang); 
//     delay(1000);
//     top_servo.write(top_base_ang); 


// }

// void loop(){

//     delay(3000);
//     Serial.println("top left");
//     bottom_servo.write(bot_base_ang+30); 
//     delay(1000);
//     top_servo.write(top_base_ang + 20); 


//     Serial.println("top right");

//     for (int i = 30; i >= -30; i -= 1) { // goes from 180 degrees to 0 degrees
//         bottom_servo.write(bot_base_ang + i);              // tell servo to go to position in variable 'pos'
//         delay(100);                       // waits 15 ms for the servo to reach the position
//     }

//     Serial.println("bottom right");

//     for (int i = 20; i >= 0; i--){
//         top_servo.write(top_base_ang + i);
//         delay(100);
//     }

//     Serial.println("bottom left");

//     for (int i = -30; i <= 30; i += 1) { // goes from 180 degrees to 0 degrees
//         bottom_servo.write(bot_base_ang + i);              // tell servo to go to position in variable 'pos'
//         delay(100);                       // waits 15 ms for the servo to reach the position
//     }

// }