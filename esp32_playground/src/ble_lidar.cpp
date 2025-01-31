#include "ble_lidar.h"

uint8_t BLE_LIDAR::duration_btwn_lasers;
uint8_t BLE_LIDAR::laser_duration;
uint8_t BLE_LIDAR::cols;
uint8_t BLE_LIDAR::rows;
uint8_t BLE_LIDAR::num_pos;

std::vector<uint8_t> BLE_LIDAR::positions;
BLECharacteristic *pCharacteristic;

void BLE_LIDAR::BLE_init(){
    TFMini.begin(115200, SERIAL_8N1, RX, TX); // start sensor serial data collection
    BLE_setup();
}

// LiDAR Distance Retrieval Function
void BLE_LIDAR::getDistance(int* distance) {
  static char i = 0;
  int checksum = 0; 
  static int rx[9];
  if(TFMini.available())
  {  
    rx[i] = TFMini.read();
    if(rx[0] != HEADER) {
      i = 0;
    } 
    else if(i == 1 && rx[1] != HEADER) {
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

uint8_t BLE_LIDAR::calculate_distance()
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

void BLE_LIDAR::output_distance()
{
  // Retrieve LiDAR Distance in centimeters
  int distance = 0;

  getDistance(&distance);
  while(!distance && distance < 10000) {
    getDistance(&distance);
  }

  Serial.print("Distance in centimeters: "+ String(distance));
  
}

void BLE_LIDAR::lidar_notify(uint8_t dist_ft)
{
  uint16_t dist = uint16_t(dist_ft);
  pCharacteristic->setValue(dist);
  pCharacteristic->notify();
}


void BLE_LIDAR::MyCallbacks::onWrite(BLECharacteristic *pCharacteristic) {
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

void BLE_LIDAR::BLE_setup(){
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

  pCharacteristic->setCallbacks(new MyCallbacks());

  pService->start();
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();
}

void BLE_LIDAR::reset_workout(){
  duration_btwn_lasers = 0;
  laser_duration = 0;
  cols = 0;
  rows = 0;
  num_pos = 0;
  positions.clear();
}

uint8_t BLE_LIDAR::get_DBL(){
  return duration_btwn_lasers;
}

uint8_t BLE_LIDAR::get_LD(){
  return laser_duration;
}
uint8_t BLE_LIDAR::get_C(){
  return cols;
}
uint8_t BLE_LIDAR::get_R(){
  return rows;
}
uint8_t BLE_LIDAR::get_NP(){
  return num_pos;
}
std::vector<uint8_t> BLE_LIDAR::get_P(){
  return positions;
}