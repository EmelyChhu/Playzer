// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getFirestore, 
  collection, getDocs,
  doc, getDoc,
  query, where 
} from "firebase/firestore";
import { Workout } from '@/types';

// import { getAnalytics } from "firebase/analytics";
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

export const fetchWorkouts = async (workoutId: string): Promise<Workout | null> => { 
  //const db = getFirestore()

  // verify that the collection exist, remove async parameters
  /*
  const workoutsCollection = collection(db, 'Workout')
  try {
    const querySnapshot = await getDocs(workoutsCollection)
    querySnapshot.forEach((doc) => {
      console.log(`Document ID: ${doc.id}`, doc.data());
    });*/

  // call for the premade workouts
  const workoutsDocRef = collection(FIREBASE_DB, "Workout");
  const workoutsQuery = query(workoutsDocRef, where("id", "==", workoutId));
  // console.log("Fetching workout from path:", workoutsDocRef.path);
  try {
    const querySnapshot = await getDocs(workoutsQuery);
    if (querySnapshot.empty) {
      console.log("No such document!");
      return null;
    }

    const workoutDoc = querySnapshot.docs[0];
    const workoutData = workoutDoc.data();
    // console.log("Workout Data:", workoutData);

    const workout: Workout = {
      id: workoutData.id || "0", // defaults to 0 if none is provided
      name: workoutData.name || "Unnamed Workout",  
      type: workoutData.type || "Unknown",  
      durationBetweenLasers: workoutData.durationBetweenLasers || 1,  
      laserDuration: workoutData.laserDuration || 1,
      numColumns: workoutData.numColumns || 8,
      numRows: workoutData.numRows || 4,
      numPositions: workoutData.numPositions || 32,
      laserPositions: workoutData.laserPositions || [],
      creatorId: workoutData?.creatorId || undefined,  // optional
      description: workoutData?.description || "",  // optional
      icon: workoutData?.icon || undefined,  // optional
    }; 
    return workout;
  }
  catch (error) {
    console.error("Error fetching workouts:", error);
    return null;
  }
};

export const countDocumentsInCollection = async (collectionName: string) => {
  try {
    const collectionRef = collection(FIREBASE_DB, collectionName);
    const querySnapshot = await getDocs(collectionRef);
    const documentCount = querySnapshot.size;

    console.log(`The collection "${collectionName}" contains ${documentCount} documents.`);
    return documentCount;
  } 
  catch (error) {
    console.error("Error counting documents in collection:", error);
    return 0;
  }
};