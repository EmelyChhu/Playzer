// #include <BLEDevice.h>
// #include <BLEUtils.h>
// #include <BLEServer.h>
// #include <Arduino.h> 
// #include <ESP32Servo.h>

// // See the following for generating UUIDs:
// // https://www.uuidgenerator.net/

// #define SERVICE_UUID        "0e5b8089-499c-45a4-abf8-a03b72e250f3"
// #define NUM_CHARACTERISTIC_UUID "615a8742-09c4-4e94-a410-a9db961335d1"

// class MyCallbacks : public BLECharacteristicCallbacks {
//     void onWrite(BLECharacteristic *pCharacteristic) {
//       std::string value = std::string((const char*)pCharacteristic->getValue().c_str());

//       if (value.length() > 0) {
//         Serial.print("Time between laser intervals: ");

//         for (int i = 0; i < value.length(); i++) {
//           Serial.print(value[i]);  // Print each character or byte
//         }

//         Serial.println();  // Print a newline after the value
//       }

//       pCharacteristic->setValue("");  // Set to an empty string temporarily
//     }
// };

// void setup() {
//   Serial.begin(115200);
//   Serial.println("Starting BLE work!");

//   BLEDevice::init("PlayLaser");
//   BLEServer *pServer = BLEDevice::createServer();
//   BLEService *pService = pServer->createService(SERVICE_UUID);
  
//   // create the characteristic
//   BLECharacteristic *pCharacteristic =
//     pService->createCharacteristic(NUM_CHARACTERISTIC_UUID, BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_NOTIFY);

//   pCharacteristic->setValue("Hello World says Sharika");

//   pCharacteristic->setCallbacks(new MyCallbacks());

//   pService->start();
//   // BLEAdvertising *pAdvertising = pServer->getAdvertising();  // this still is working for backward compatibility
//   BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
//   pAdvertising->addServiceUUID(SERVICE_UUID);
//   pAdvertising->setScanResponse(true);
//   pAdvertising->setMinPreferred(0x06);  // functions that help with iPhone connections issue
//   pAdvertising->setMinPreferred(0x12);
//   BLEDevice::startAdvertising();
//   Serial.println("Characteristic defined! Now you can read it in your phone!");

// }

// void loop() {
//   delay(2000);
// }
