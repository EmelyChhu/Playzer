#include "ble_lidar.h"
#include "string.h"
using namespace std;

uint8_t BLE_LIDAR::duration_btwn_lasers;
uint8_t BLE_LIDAR::laser_duration;
uint8_t BLE_LIDAR::cols;
uint8_t BLE_LIDAR::rows;
uint8_t BLE_LIDAR::num_pos;

std::vector<uint8_t> BLE_LIDAR::positions;

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

double BLE_LIDAR::calculate_distance()
{
  // get the average distance here, polls it 
  // Retrieve LiDAR Distance in centimeters
  int sum = 0;

  for(int i = 0; i < 100; i++)
  {
    getDistance(&lidar_distance_cm);
    while(!lidar_distance_cm && lidar_distance_cm < 10000) 
    {
      getDistance(&lidar_distance_cm);
    }
    sum += lidar_distance_cm;
  }

  // get average
  double avg_distance = sum / 100;  
  
  // number of centimeters in 1 foot : 30.48
  double feet = avg_distance / 30.48;
  Serial.println("\t AVG Distance in feet: "+ String(feet));
  return feet;
} 

void BLE_LIDAR::MyServerCallbacks::onConnect(BLEServer *pServer)
{
  Serial.println("Phone connected");
  lidar->deviceConnected = true;
}

void BLE_LIDAR::MyServerCallbacks::onDisconnect(BLEServer *pServer)
{
  lidar->deviceConnected = false;
  Serial.println("Phone disconnected, restarting advertising");
  pServer->startAdvertising(); // restart advertising
}

void BLE_LIDAR::MyCallbacks::onWrite(BLECharacteristic *pCharacteristic) {
  std::string value = pCharacteristic->getValue();
  if (value.length() > 0) {
    for (int i = 0; i < value.length(); i++) {
      Serial.print(value[i]);  // Print each character or byte
    }
    Serial.println();

    // app requesting LiDaR
    if (value == "RESCAN")
    {
      // send the lidar data
      double dist_ft = lidar->calculate_distance();
      lidar->lidar_notify(dist_ft);
    }
    // app is sending workout data
    else
    {
      uint64_t dec_num = std::stoull(value.c_str()); 

      // first uint64 being sent
      if (!(dec_num & 0x1))
      {
        num_pos = (dec_num >> 1) & 0x1F; // 5 bits

        // up to 11 positions
        if(num_pos <= 11)
        {
          for (uint8_t i = 0; i < num_pos; i++)
          {
            positions.push_back((dec_num >> 6 + (5*i)) & 0x1F); // each position is 5 bits
          }
        }
        else if (num_pos > 11)
        {
          for (uint8_t i = 0; i < 11; i++)
          {
            positions.push_back((dec_num >> 6 + (5*i)) & 0x1F); // each position is 5 bits
          }
        }

        Serial.println("Number of Positions: "+ String(num_pos));
        // print out the laser positions
        Serial.print("Laser Positions: "); 
        for (uint8_t i = 0; i < positions.size(); i++)
        {
          Serial.print(String(positions[i]) + " "); // each position is 5 bits
        }
        Serial.println();
      }
      // second uint64 being sent
      else if (dec_num & 0x1)
      {
        // if num positions is > 11, get the rest of the positions
        if(num_pos > 11)
        {
          for (uint8_t i = 0; i < num_pos - 11; i++)
          {
            positions.push_back((dec_num >> 1 + (5*i)) & 0x1F); // each position is 5 bits
          }
        }

        // get the rest of the data
        cols = (dec_num >> 46) & 0xF; // 4 bits
        rows = (dec_num >> 46 + 4) & 0xF; // 4 bits
        duration_btwn_lasers = (dec_num >> 46 + 8) & 0xF; // 4 bits
        laser_duration = (dec_num >> 46 + 12) & 0xF; // 4 bits

        Serial.println("Number received:" + String(dec_num));
        Serial.println("Duration Btwn Lasers: "+ String(duration_btwn_lasers) + "\t Laser Duration: "+ String(laser_duration));
        Serial.println("Rows: "+ String(rows) + "\t Columns: "+ String(cols));
        

        // print out the laser positions
        Serial.print("Laser Positions: "); 
        for (uint8_t i = 0; i < positions.size(); i++)
        {
          Serial.print(String(positions[i]) + " "); // each position is 5 bits
        }
        Serial.println();
      }
    }

  }
}

void BLE_LIDAR::BLE_setup(){
  // BLE Setup
  BLEDevice::init("Playzer");
  BLEServer *pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks(this));
  BLEService *pService = pServer->createService(SERVICE_UUID);
  
  pCharacteristic =
    pService->createCharacteristic(
      NUM_CHARACTERISTIC_UUID, 
      BLECharacteristic::PROPERTY_READ | 
      BLECharacteristic::PROPERTY_WRITE | 
      BLECharacteristic::PROPERTY_NOTIFY
    );
  pCharacteristic->setValue("hello world");
  pCharacteristic->setCallbacks(new MyCallbacks(this));

  pService->start();
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();
}

void BLE_LIDAR::lidar_notify(double dist_ft)
{
  if (this->pCharacteristic == nullptr) {
        Serial.println("Characteristic not initialized");
        return;
    }
  std::string dist = std::to_string(dist_ft);
  pCharacteristic->setValue(dist);
  pCharacteristic->notify();
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