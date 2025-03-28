// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth"; 
import { getFirestore, 
  collection, getDocs, addDoc,
  doc, getDoc, setDoc, deleteDoc,
  query, where, updateDoc, arrayUnion 
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

const FirebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
};

export const addUsers = async (name: string, email: string, password: string) => {
  try {
    const credentials = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
    const user = credentials.user;

    // PUT NAME INTO FIRESTORE 
    await setDoc(doc(FIREBASE_DB, "Users", user.uid), {
      name: name
  });

  console.log("User registered successfully:", user.uid);
  return user;
  }
  
  catch (error) {
    console.error("Error signing up:", error);
  }
};

export const fetchUsers = async (userId: string): Promise<string | null> => {
  try {
    const userDocRef = doc(FIREBASE_DB, "Users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if(!userDocSnap.exists()) {
      console.log("No user found!");
      return null;
    }

    const userData = userDocSnap.data();
    return userData.name || "Unnamed User";
  }
  catch(error) {
    console.error("Error fetching user name:", error);
    return null;
  }
};

export const fetchWorkouts = async (DocId: string): Promise<Workout | null> => { 
  // verify that the collection exist, remove async parameters
  try {
    const workoutDocRef = doc(FIREBASE_DB, "Workout", DocId);
    const workoutDocSnap = await getDoc(workoutDocRef);

    if (!workoutDocSnap.exists()) {
      console.log("No such document!");
      return null;
    }

    const workoutData = workoutDocSnap.data();

    const workout: Workout = {
      id: workoutData.id || "0", // defaults to 0 if none is provided
      name: workoutData.name || "Unnamed Workout",  
      type: workoutData.type || "Unknown Type",  
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

export const fetchHistory = async (UserDocId: string)=> {
  try {
    console.log("WORKOUT HISTORY:");
    const user = FIREBASE_AUTH.currentUser;
    if (!user) {
      console.log("No user logged in.");
      return;
    }

    const userDocRef = doc(FIREBASE_DB, "Users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      console.log("User document does not exist.");
      return [];
    }

    const userData = userDocSnap.data();
    const workoutHistory = userData.workoutHistory || [];
    console.log(workoutHistory);
    return workoutHistory;
  } 
  catch (error) {
    console.error("Error fetching workout history:", error);
    return [];
  }
};

export const addRecent = async (DocId: string) => {
  try {
    // console.log("ATTEMPTING TO STORE RECENT WORKOUT")
    const user = FIREBASE_AUTH.currentUser;
    if (!user) {
      console.log("No user logged in.");
      return;
    }

    const userDocRef = doc(FIREBASE_DB, "Users", user.uid);
    const workoutDocRef = doc(FIREBASE_DB, "Workout", DocId);

    const userDocSnap = await getDoc(userDocRef);
    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, { workoutHistory: [] });
    }

    let workoutName = "Random Workout";
    const currentDate = new Date().toISOString().split("T")[0];

    const workoutDocSnap = await getDoc(workoutDocRef);
    if (!workoutDocSnap.exists()) {
      const workoutData = workoutDocSnap.data();
      if (workoutData) {
        workoutName = workoutData.name;
      } else {
        workoutName = "Random Workout";
      }
    }
    else {
      console.log(`No workout found with ID: ${DocId}, assuming it is a random workout.`);
    }

    let workoutHistory = [];
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      workoutHistory = userData.workoutHistory || [];
    }

    const newEntry = { id: DocId, name: workoutName, date: currentDate };
    const updatedHistory = [newEntry, ...workoutHistory];
    console.log(updatedHistory);

    // const updatedHistory = [[DocId, workoutName, currentDate], ...workoutHistory];

    // PUT HISTORY INTO FIRESTORE
    await setDoc(userDocRef, { workoutHistory: updatedHistory }, { merge: true });

    console.log("Recent workout stored successfully!");
  }
  catch (error) {
    console.log("Error saving recent workout:", error);
  }
};

export const addWorkout = async (workoutData: any) => {
  const workoutsCollectionRef = collection(FIREBASE_DB, "Workout");

  try {
    const docRef = await addDoc(workoutsCollectionRef, workoutData);
    console.log("Workout successfully added with ID:", docRef.id);
  }
  catch (error) {
    console.error("Error adding workout:", error);
  }
};

// removes workout document from the collection
export const removeWorkout = async (DocId: string) => {
  try {
    await deleteDoc(doc(FIREBASE_DB, "Workout", DocId));
    console.log("Workout successfully removed.");
  }
  catch (error) {
    console.error("Error removing workout from Firestore.");
  }
}

// Return an array containing arrays of Workout [type, name, doc id]
export const getWorkoutDocuments = async () => {
  try {
    const querySnapshot = await getDocs(collection(FIREBASE_DB, "Workout"));

    if (querySnapshot.empty) {
      console.log("No workout documents found!");
      return [];
    }

    const workouts = querySnapshot.docs.map(doc => ([
      doc.data().type || "Unknown Type",
      doc.data().name || "Unnamed Workout",
      doc.id
    ]));

    console.log(workouts);
    return workouts;
  } 

  catch (error) {
    console.error("Error fetching Workout document IDs:", error);
    return [];
  }
};

// Returns an array of arrays of Workout [name, doc id]
export const getWorkoutTypeDocs = async (workoutType: string) => {
  try {
    const workoutsDocRef = collection(FIREBASE_DB, "Workout");
    const user = FIREBASE_AUTH.currentUser?.uid;
    let q;

    if (workoutType === "Custom") {
      console.log("UID:", user);

      if(!user) {
        console.log("No user found!");
        return [];
       }
       
      q = query( workoutsDocRef, 
        where("creatorId", "==", user)
      );
    }
    else {
    q = query(workoutsDocRef, 
      where("type", "==", workoutType));
    }

    const querySnapshot = await getDocs(q);

    if(querySnapshot.empty) {
      console.log("No workouts found for user:", user);
      return [];
    }

    const userWorkouts = querySnapshot.docs.map(doc => {
      const name = doc.data().name || "Unnamed Workout";
      const match = name.match(/\d+/); 
      const num = match ? parseInt(match[0], 10) : Infinity; 
      return { name, id: doc.id, num };
    })
      .sort((a, b) => a.num - b.num).map(workout => [workout.name, workout.id]);
    return userWorkouts;
  }

  catch(error) {
    console.error("Error fetching workouts: ", error);
    return [];
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