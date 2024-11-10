#include <Arduino.h> 
#include <HardwareSerial.h>

const int HEADER = 0x59;

// Variables
int dist;
int a, b, c, d, e, f, check, i;

#define TX 1
#define RX 3

HardwareSerial mySerial(0);

int getDist(){
  delay(10);
  if (mySerial.available() >= 9)
  {
    // Serial.println("first check");
    // // Check for first header byte
    // uint8_t rd = mySerial.read();
    // Serial.println(String(rd));
    if(mySerial.read() == HEADER)
    {
    // Check for second header byte
      if(mySerial.read() == HEADER)
      {
        // Read all 6 data bytes
        a = mySerial.read();
        b = mySerial.read();
        c = mySerial.read();
        d = mySerial.read();
        e = mySerial.read();
        f = mySerial.read();

        // Read checksum byte
        check = (a + b + c + d + e + f + HEADER + HEADER);
        // Compare lower 8 bytes of checksum
        if(mySerial.read() == (check & 0xff))
        {
          // Calculate distance
          dist = (a + (b * 256));
          // return result
          return dist;
        }
      }
    }
  }
  else
    return -1;
} 

void setup() {
  Serial.begin(115200);
  Serial.print("serial started");
  mySerial.begin(115200, SERIAL_8N1, RX, TX);
}

void loop() {
    // Serial.println("attempt read");

  // get distance 
  Serial.println(String(getDist()));
}