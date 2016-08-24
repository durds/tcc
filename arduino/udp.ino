#include <SPI.h>
#include <Ethernet.h>
#include <EthernetUdp.h>

byte arduinoMac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
IPAddress arduinoIP(192, 168, 0, 177); // desired IP for Arduino
unsigned int arduinoPort = 8888;      // port of Arduino

IPAddress receiverIP(192, 168, 0, 5); // IP of udp packets receiver
unsigned int receiverPort = 5000;      // port to listen on my PC

EthernetUDP Udp;

int sensorPin = A0; //define sensor pin
int sensorValue;
char packetBuffer[UDP_TX_PACKET_MAX_SIZE];
void setup() {
  pinMode(10, OUTPUT);   // sets the pin as output
  Serial.begin(9600);
  Ethernet.begin(arduinoMac,arduinoIP);
  Udp.begin(arduinoPort);
}

void loop() {
  sensorValue = analogRead(sensorPin);//read sensor value from 0 to 1023 
  byte valueInBytes[2] = {lowByte(sensorValue), highByte(sensorValue)}; //convert it to byte array
  Serial.println(sensorValue);
  Udp.beginPacket(receiverIP, receiverPort); //start udp packet
  Udp.write(valueInBytes, 2); //write sensor data to udp packet
  Udp.endPacket(); // end packet

  int packetSize = Udp.parsePacket();
  if(packetSize) {
    Serial.print("Received packet of size ");
    Serial.println(packetSize);
    Serial.print("From ");
    IPAddress remote = Udp.remoteIP();
    for (int i =0; i < 4; i++)
    {
      Serial.print(remote[i], DEC);
      if (i < 3)
      {
        Serial.print(".");
      }
    }
    Serial.print(", port ");
    Serial.println(Udp.remotePort());

    // read the packet into packetBufffer
    Udp.read(packetBuffer,UDP_TX_PACKET_MAX_SIZE);
    Serial.println("Contents:");
    Serial.println(packetBuffer);
    if(packetBuffer[0] == 'h') {
      analogWrite(10, 255);
    } else {
      analogWrite(10, 0);
    }
  }

  delay(100);
}
