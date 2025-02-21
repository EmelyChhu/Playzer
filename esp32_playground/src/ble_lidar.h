#ifndef BLE_LIDAR_H
#define BLE_LIDAR_H

#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <HardwareSerial.h>
#include <stdint.h>
#include <sys/_stdint.h>


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
    BLECharacteristic *pCharacteristic;

    static std::vector<uint8_t> positions;
    bool deviceConnected; 
    int lidar_distance_cm;

    BLE_LIDAR() { // Default constructor
        pCharacteristic = nullptr;
        deviceConnected = false;
        lidar_distance_cm = 0;
        BLE_init();
        reset_workout();
    };

    void getDistance(int* distance);

    double calculate_distance();

    void output_distance();
    
    void lidar_notify(double dist_ft);

    class MyCallbacks : public BLECharacteristicCallbacks {
        public:
        MyCallbacks(BLE_LIDAR* lidarInstance) : lidar(lidarInstance) {} // Constructor to store instance
        void onWrite(BLECharacteristic *pCharacteristic) override;

        private:
        BLE_LIDAR* lidar;  // Pointer to BLE_LIDAR instance

    };

    class MyServerCallbacks : public BLEServerCallbacks {
        public:
        MyServerCallbacks(BLE_LIDAR* lidarInstance) : lidar(lidarInstance) {} // Constructor to store instance
        void onConnect(BLEServer* pServer);
        void onDisconnect(BLEServer* pServer);

        private:
        BLE_LIDAR* lidar;  // Pointer to BLE_LIDAR instance
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

    // LiDAR Constants - serial port
    HardwareSerial& TFMini = Serial;
};

#endif // BLE_LIDAR_H