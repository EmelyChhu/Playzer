#include <Arduino.h>
#include <ESP32Servo.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <HardwareSerial.h>

// UUID Generator: https://www.uuidgenerator.net/
#define SERVICE_UUID        "0e5b8089-499c-45a4-abf8-a03b72e250f3"
#define NUM_CHARACTERISTIC_UUID "615a8742-09c4-4e94-a410-a9db961335d1"
#define TX 1
#define RX 3

// LiDAR Constants
const int HEADER = 0x59;
HardwareSerial TFMini(0);

// Workout variables
uint8_t duration_btwn_lasers, laser_duration, cols, rows, num_pos;
std::vector<uint8_t> positions;

// LiDAR Distance Retrieval Function
void getDistance(int* distance) {
  static char i = 0;
  int checksum = 0; 
  static int rx[9];
  if(TFMini.available())
  {  
    rx[i] = TFMini.read();
    if(rx[0] != 0x59) {
      i = 0;
    } 
    else if(i == 1 && rx[1] != 0x59) {
      i = 0;
    } 
    else if(i == 8) {
      checksum = rx[0] + rx[1] + rx[2] + rx[3] + rx[4] + rx[5] + rx[6] + rx[7];
      if(rx[8] == (checksum & 0xff)) {
        *distance = rx[2] + (rx[3] << 8);
      }
      i = 0;
    } else 
    {
      i++;
    } 
  }  
}

uint8_t calculate_distance()
{
  // get the average distance here, polls it 
  // Retrieve LiDAR Distance in centimeters
  int centimeters = 0;
  int sum = 0;

  for(int i = 0; i < 30; i++)
  {
    getDistance(&centimeters);
    while(!centimeters && centimeters < 10000) 
    {
      getDistance(&centimeters);
    }
    sum += centimeters;
  }

  // get average
  double avg_distance = sum / 30;  
  
  // number of centimeters in 1 foot : 30.48
  uint8_t feet = uint8_t(avg_distance / 30.48);
  Serial.println("\t AVG Distance in feet: "+ String(feet));
  return feet;
} 

void output_distance()
{
  // Retrieve LiDAR Distance in centimeters
  int distance = 0;

  getDistance(&distance);
  while(!distance && distance < 10000) {
    getDistance(&distance);
  }

  Serial.print("Distance in centimeters: "+ String(distance));
  
}

// BLE Characteristic Callback Class
class MyCallbacks : public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      std::string value = pCharacteristic->getValue();
      if (value.length() > 0) {
        // convert data received to a 64 bit integer
        for (int i = 0; i < value.length(); i++) {
          Serial.print(value[i]);  // Print each character or byte
        }
        Serial.println();

        uint64_t dec_num = std::stoull(value.c_str());

        num_pos = dec_num & 0x1F; // 5 bits
        // array of the numbers
        for (uint8_t i = 0; i < num_pos; i++)
        {
          positions.push_back((dec_num >> 5 + (6*i)) & 0x3F); // each position is 6 bits
        }

        int after_lasers = 5 + (6 * num_pos);

        cols = (dec_num >> after_lasers) & 0xF; // 4 bits
        rows = (dec_num >> after_lasers + 4) & 0xF; // 4 bits
        laser_duration = (dec_num >> after_lasers + 8) & 0xF; // 4 bits
        duration_btwn_lasers = (dec_num >> after_lasers + 12) & 0xF; // 4 bits
        
        Serial.println("Number received:" + String(dec_num));
        Serial.println("Duration Btwn Lasers: "+ String(duration_btwn_lasers) + "\t Laser Duration: "+ String(laser_duration));
        Serial.println("Rows: "+ String(rows) + "\t Columns: "+ String(cols));
        Serial.println("Number of Positions: "+ String(num_pos));

        // print out the laser positions
        Serial.print("Laser Positions: "); 
        for (uint8_t i = 0; i < positions.size(); i++)
        {
          Serial.print(String(positions[i]) + " "); // each position is 6 bits
        }
      }
    }
};

void ble_setup(){
  // BLE Setup
  BLEDevice::init("Playzer");
  BLEServer *pServer = BLEDevice::createServer();
  BLEService *pService = pServer->createService(SERVICE_UUID);
  
  BLECharacteristic *pCharacteristic =
    pService->createCharacteristic(
      NUM_CHARACTERISTIC_UUID, 
      BLECharacteristic::PROPERTY_READ | 
      BLECharacteristic::PROPERTY_WRITE | 
      BLECharacteristic::PROPERTY_NOTIFY
    );

  pCharacteristic->setValue("Hello World says Sharika");
  pCharacteristic->setCallbacks(new MyCallbacks());

  pService->start();
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();
}

void setup() {
  // Initialize Serial
  Serial.begin(115200);
  Serial.println("Starting the Playzer!");
  TFMini.begin(115200, SERIAL_8N1, RX, TX); // start sensor serial data collection

  ble_setup();

  Serial.println("Characteristic defined! Now you can read it in your phone!");
}

void loop() {
  //output_distance();
  // Slight delay between cycles
  delay(100);
  //calculate_distance();
  //delay(100);
}