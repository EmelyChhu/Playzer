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

    if(bluetooth_obj->deviceConnected)
    {
        while (!bluetooth_obj->get_C() && !bluetooth_obj->get_R())
        {
            // polls the distance to get an accurate lidar sensor reading
            bluetooth_obj->getDistance(&bluetooth_obj->lidar_distance_cm);
        }

        Workout test_workout;
        // test_workout = Workout();
        test_workout = Workout( 1, 
                                bluetooth_obj->get_DBL(), 
                                bluetooth_obj->get_LD(), 
                                bluetooth_obj->get_C(), 
                                bluetooth_obj->get_R(), 
                                bluetooth_obj->get_P(), 
                                bluetooth_obj->get_NP());

        test_workout.execute();

        bluetooth_obj->reset_workout();
    }

    

}