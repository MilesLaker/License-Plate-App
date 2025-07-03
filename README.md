# PlateSpotter – U.S. License Plate Tracker

by Miles Laker for CS153a Brandeis University  
This is an [Expo](https://expo.dev/) project created with `create-expo-app`.
My final build with all working features is the FINALBUILDPEERREVIEW.js file, if you wish to run this version use that file instead of app.js


---

### 1. Install dependencies

```bash
npm install
```

### 2. Start the app

```bash
npx expo start
```

In the output, you'll find options to open the app in a:

- [development build](https://docs.expo.dev/development/build-intro/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/client), a limited sandbox for trying out app development with Expo

---

##  App Features

-  Track which U.S. license plates you’ve seen on a road trip
-  Real time compass using your phone’s magnetometer
-  Add notes to each license plate you see
-  Geotag the location where you spotted the plate
-  View all tagged plates on a full U.S. map
-  Saves your data locally using `AsyncStorage`

---

##  How it Works

- Multi-screen navigation powered by **React Navigation**
- Phone sensors (location + compass) via `expo-location` and `expo-sensors`
- Data persistence using `@react-native-async-storage/async-storage`
- Notes and map markers are tied to each license plate type per state

---

##  Project Structure

All major files live inside the `App.js` root file. Assets like plate images and the compass are in the `/assets` directory.
