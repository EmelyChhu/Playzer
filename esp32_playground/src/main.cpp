#include "Workout.h"
#include "ble_lidar.h"

BLE_LIDAR *bluetooth_obj;

void setup() { 
    Serial.begin(115200);
    Serial.println("Starting the Playzer!");

    pinMode(LASER_PIN, OUTPUT);
    digitalWrite(LASER_PIN, LOW);

    ledcSetup(PWM_CHANNEL_BOT_SERVO, PWM_FREQ, PWM_RESOLUTION);
    ledcSetup(PWM_CHANNEL_TOP_SERVO, PWM_FREQ, PWM_RESOLUTION);

    ledcAttachPin(BOT_MOTOR_PIN, PWM_CHANNEL_BOT_SERVO);
    ledcAttachPin(TOP_MOTOR_PIN, PWM_CHANNEL_TOP_SERVO);

    ledcWrite(PWM_CHANNEL_TOP_SERVO, BASE_DUTY_CYCLE);
    ledcWrite(PWM_CHANNEL_BOT_SERVO, BASE_DUTY_CYCLE);

    bluetooth_obj = new BLE_LIDAR();

    Serial.println("Characteristic defined! Now you can read it in your phone!");
}

void loop() { 

    // std::vector<uint8_t> test_pos;
    // for (int x = 0; x < 32; x++){
    //     test_pos.push_back((x));
    // }
    // // test_workout = Workout();
    // Workout workout(true,
    //         true,
    //         4, 
    //         2, 
    //         10, 
    //         10, 
    //         test_pos, 
    //         32);

    // workout.calibrate(6.0);
    // // workout.calibrate(bluetooth_obj->calculate_distance());

    // while(workout.execute())
    // workout.return_to_base();

    // delay(5000);


    if(bluetooth_obj->deviceConnected)
    {
        while (!bluetooth_obj->get_H() && !bluetooth_obj->get_W())
        {
            // polls the distance to get an accurate lidar sensor reading
            bluetooth_obj->getDistance(&bluetooth_obj->lidar_distance_cm);
        }
        
        Workout workout(bluetooth_obj->get_RAND(),
                        bluetooth_obj->get_SLIDE(),
                        bluetooth_obj->get_DBL(), 
                        bluetooth_obj->get_LD(), 
                        bluetooth_obj->get_H(), 
                        bluetooth_obj->get_W(), 
                        bluetooth_obj->get_P(), 
                        bluetooth_obj->get_NP());

        workout.calibrate(bluetooth_obj->calculate_distance());

        workout.show_bounds();

        while(!bluetooth_obj->stop() && workout.execute())
        workout.return_to_base();
        workout.turn_off_laser();

        bluetooth_obj->reset_workout();
    }
}