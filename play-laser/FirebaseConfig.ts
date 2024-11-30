// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: "playzer-6caf3.firebaseapp.com",
  projectId: "playzer-6caf3",
  storageBucket: "playzer-6caf3.firebasestorage.app",
  messagingSenderId: "844436250817",
  appId: "1:844436250817:web:2e118a776e559af4943440",
  measurementId: "G-DQS04RHYVP"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
//const analytics = getAnalytics(app);

const FirebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
};