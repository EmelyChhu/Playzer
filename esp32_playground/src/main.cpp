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
    // pCharacteristic = new BLECharacteristic();

    Serial.println("Characteristic defined! Now you can read it in your phone!");
}

void loop() {

    uint8_t dist_ft = bluetooth_obj->calculate_distance();
    bluetooth_obj->lidar_notify(dist_ft);

    // while (!bluetooth_obj->get_C() && !bluetooth_obj->get_R()){}

    // Workout test_workout;
    // test_workout = Workout( 1, 
    //                         bluetooth_obj->get_DBL(), 
    //                         bluetooth_obj->get_LD()*1000, 
    //                         bluetooth_obj->get_C(), 
    //                         bluetooth_obj->get_R(), 
    //                         bluetooth_obj->get_P(), 
    //                         bluetooth_obj->get_NP());

    // test_workout.execute();

    // bluetooth_obj->reset_workout();

}