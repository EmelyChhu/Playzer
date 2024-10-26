# PlayLaser-Mobile-App
**Completed Work**
- Hardware
- ESP32 System
    - Ran an intro program to ensure device works 
    - Set up bluetooth connection code to communicate with a device
      ![image](https://github.com/user-attachments/assets/654ecb2c-8793-4f6b-afc0-9c513149a785)
    - First draft CAD model of servo motor mount
      - Laser mount not implemented yet
      <img width="254" alt="image" src="https://github.com/user-attachments/assets/5c731df4-eb0f-451c-a3a8-81fb58c8de3a">
      <img width="290" alt="image" src="https://github.com/user-attachments/assets/a76c276f-9f8a-4671-b186-cbae50ed17db">
    - Demo / proved viability of servo motor system and ESP32
- Software
    - Frontend
      - Foundational app structure with screen navigation
        - Authentication
          - Entry screen
            - Entry points to Sign up and Log in screens
          - Sign up screen
            - Email and password input
            - Input validation and visual error handling
          - Log in screen
            - Email and password input
        - Main App with navigation bar
          - Home screen
          - Workout screen
            - Entry point to communicate with ESP32
          - Profile screen
            - Settings screen
              - Log out button
            <img width="499" alt="image" src="https://github.com/user-attachments/assets/574fef34-2afd-4e7e-b887-794f27c41432">
      - Communication with ESP32
        - Send user input to ESP32 using react-native-ble-plx library
    - Backend
      - Implement database to store information using MongoDB
        
**Project Architecture**
![image](https://github.com/user-attachments/assets/9d2da04c-8161-4ee3-b575-c6d6e70aa303)

      
