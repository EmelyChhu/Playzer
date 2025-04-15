# Playzer
### Production Release Completed Work
- Software
    - Workout Flow
        - Added auditory cues throughout workout start and complete
        - Improved user experience user after navigating away from page
    - Home Page
        - Added feature for user levels based on number of workouts completed
- Hardware
    - Calibration
        - Better accuracy of play area height and width
    - Improved Enclosure
        - Modeled more space-efficient enclosure and reprinted laser mount
        - New enclosure to be implemented for the showcase date
      
### Beta Build Completed Work
- Software
    - Add device-randomized workout flow
    - User can start a workout with completely random positions
    - User inputs values for desired laserDuration, durationBetweenLasers, and number of laser positions
    - Add options for custom workout creation
    - User can now input a name and description for new custom workouts
    - Extend workout flow for all workouts
    - Generates buttons for all workouts rather than only one workout
    - User can view/start all premade and custom workouts
    - Add PreviousWorkoutCard component
    - Create base component for user workout history
    - Displays card for each completed workout by the user
    - Add name field to account creation flow
    - Create Users database that stores user’s name and workout history
    - Displays user’s name on Profile screen
    - Rework flow to connect and disconnect from the device
    - If the device disconnects, they are navigated back to the connection screen and can reconnect
    - Made connectedDevice a global variable so users only have to connect once during a session
- Hardware
    - Added support for up to 20 position
    - Increased maximum number of positions from 7 to 2
    - Increased bluetooth maximum transmission to 42 bytes for large data send
    - Fixed the lidar rescan bug -- works as intended when hitting the rescan butto
    - Bluetooth connection connect and disconnect fully implemented
    - Easy for the user to connect and disconnect from the Playzer and vice vers
    - Added support for stop to stop the Playzer once the user requests to sto
    - Soldered the hardware components to the PC
    - Validated the PCB
    - Modeled 3d printed enclosure to package the device

### Alpha Build Completed Work
- Hardware
    - PCB designed and ordered
    - Bluetooth device -> phone implemented
    - Printed out laser and motor mounts
    - LiDaR sensor integrated with the app

- Software
    - Refactored button and laser card components
    - Refactored workout screen flow
    - Added screen to display device distance from wall
    - Integrated communication with LiDar sensor
    - Added unit tests for sign in and backend methods
 
- Bugs
    - Software
        - If the user presses the button to save a custom workout repeatedly in the first few seconds, it will save the workout multiple times
        - Currently the button is disabled after the workout is fully saved, but a fix will disable it once the save button is pressed once
    - Hardware
        - Not applicable :)


- Bugs
    - Software
        - Submission button for Sign up, Log in, and Create a custom routine Screens
            - The button for these screens should be disabled until text has been input in all boxes
            - Currently there is an issue with the button’s background color when the isDisabled property is used, so all buttons have been enabled
            - Logic and error handling have been implemented to prevent the user from submitting when inputted information is incorrect
        - React Native Paper Button Component Light/Dark mode color schemes
            - Currently there is an issue with the button’s background color and text switching properly when the user switches between Light and Dark mode that may be related to breaking change from Expo SDK 51 to 52
            - A potential fix involves creating a custom themed element within the project
    - Hardware
        - LiDaR sensor delay
            - There is a delay in the distance sensor information being updated. Even if the sensor sits in 1 position for a long time, it takes around 30-40 times of calling the getDistance() function for it to update to the right value. When the sensor position changes, there is a delay in that information being updated as well. 


### Design Prototype Completed Work
- Hardware
    - Fixing the LiDaR sensor data collection
        - Had to deal with garbage values that were not correct (in the ten thousands)
    - Data processing of LiDaR sensor
        - Converting to feet, getting averages, etc.
    - Adding communication protocol to receive various types of workout information in the app
    - Complete motor and laser mount CAD designs
    - Wrote functions that execute workouts that specify time betwenn lasers, laser duration, laser positions, and number of columns and rows
- Software
    - Fix color scheming for Light/Dark mode
        - Expo SDK 52 update required refactoring of color scheme use
    - Add base Home and Profile screens
    - Implement Start a Premade Workout Flow
        - Add screen for viewing premade workouts and a specific workout's details
        - Establish communication protocol with ESP32 and create connection screen
    - Implement Create a Custom Workout Routine Flow
        - Add screen for user to view custom workouts and create a custom workout
    - Add user authentication flow for Sign Up and Log In Screens
        - Connected to Firebase database
- Bugs
    - Submission button for Sign up, Log in, and Create a custom routine Screens
        - The button for these screens should be disabled until text has been input in all boxes
        - Currently there is an issue with the button’s background color when the isDisabled property is used, so all buttons have been enabled
        - Logic and error handling have been implemented to prevent the user from submitting when inputted information is incorrect
    - React Native Paper Button Component Light/Dark mode color schemes
        - Currently there is an issue with the button’s background color and text switching properly when the user switches between Light and Dark mode that may be related to breaking change from Expo SDK 51 to 52
        - A potential fix involves creating a custom themed element within the project

### Pre-Alpha Build Completed Work
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
- Known Bugs 
    - Submission button for Sign up and Log in Screens
        - The button should be disabled whenever the email and password fields are empty
        - Currently the button is disabled in its initial state and is enabled once input is added to both fields
        - However, if the user deletes their input, the button is still enabled when it should be disabled
        - A fix for this will involve editing the useEffect for the buttonDisabled state to check if the values are empty and disabling the button if they are
        
### Project Architecture
![image](https://github.com/user-attachments/assets/9d2da04c-8161-4ee3-b575-c6d6e70aa303)  

**Hardware**  
The ESP32 system is composed of the ESP32 DevKit-C, TFmini Plus LiDaR sensor, motors and a laser. At the heart of the system is the ESP32 device, which acts as the brains and connects all of these components together. It allows for communication to happen with the Playzer Mobile App via bluetooth using the bluetooth low energy module on the device.

**Software**  
The Playzer Mobile App is built using React Native, TypeScript, and Expo, which enables us to develop for both iOS and Android devices simultaneously. The React Native Paper UI Library is utilized to develop the user interface, and the app communicates with the Playzer device’s ESP32 via Bluetooth using the react-native-ble-plx library. The Playzer database, which stores user information, will be stored locally using SQLite and remotely using Firebase.
