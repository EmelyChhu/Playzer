#ifndef BLE_LIDAR_H
#define BLE_LIDAR_H

#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <HardwareSerial.h>


// UUID Generator: https://www.uuidgenerator.net/
#define SERVICE_UUID        "0e5b8089-499c-45a4-abf8-a03b72e250f3"
#define NUM_CHARACTERISTIC_UUID "615a8742-09c4-4e94-a410-a9db961335d1"
#define TX 1
#define RX 3
#define HEADER 0x59

class BLE_LIDAR {
public:
    static uint8_t duration_btwn_lasers;
    static uint8_t laser_duration;
    static uint8_t cols;
    static uint8_t rows;
    static uint8_t num_pos;

    static std::vector<uint8_t> positions;

    BLE_LIDAR() { // Default constructor
        BLE_init();
        reset_workout();
    };

    void getDistance(int* distance);

    uint8_t calculate_distance();

    void output_distance();

    class MyCallbacks : public BLECharacteristicCallbacks {
        void onWrite(BLECharacteristic *pCharacteristic);
    };

    void reset_workout();

    uint8_t get_DBL();

    uint8_t get_LD();
    uint8_t get_C();
    uint8_t get_R();
    uint8_t get_NP();
    std::vector<uint8_t> get_P();

private:

    void BLE_setup();

    void BLE_init();

    // LiDAR Constants
    HardwareSerial& TFMini = Serial1;
};

#endif // BLE_LIDAR_H