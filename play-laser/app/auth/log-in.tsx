import { StyleSheet } from 'react-native';
import { useState, useEffect, useLayoutEffect } from 'react';

import { View } from '@/components/Themed';
import { PaperProvider, Text, Button, TextInput } from 'react-native-paper';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

import { FIREBASE_AUTH } from '@/FirebaseConfig';
import { signInWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
// import { fetchWorkouts } from "@/FirebaseConfig";
import { countDocumentsInCollection } from "@/FirebaseConfig";

/**
 * LogInScreen Component - log in screen for the Playzer app
 * 
 * @returns {JSX.Element} - React component that renders the UI
 * 
 * provides "Email" text input box that allows users to enter their email
 * provides "Password" text input box that allows users to enter their password
 * provides "Log in" button that logs users into the app if the entered information is valid
 */
export default function LogInScreen() {
    const navigation = useNavigation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const auth = FIREBASE_AUTH;

    const handleLogIn = async () => {
      setErrorMessage("");
      setButtonDisabled(false);
      try {
        const response = await signInWithEmailAndPassword(auth, email, password);
        // below line generates the user id after they have signed in
        console.log("User signed in:", response.user.uid); 

        /* test for premade workout collection
        const workouts = await fetchWorkouts();
        console.log("Fetched workouts:", workouts);*/
        
        countDocumentsInCollection("Workout");

        router.push("../(tabs)/home")
      }
      catch(error : any) {
        const firebaseError = error as FirebaseError;
        if(firebaseError.code === 'auth/invalid-email') {
          setErrorMessage("Invalid email.");
        }
        else if(firebaseError.code === 'auth/invalid-credential') {
          setErrorMessage("Incorrect password. Please try again.");
        }
        else {
          console.error(error);
          setErrorMessage("An unexpected error occurred. Please try again.");
        }
      }
      finally {
        setButtonDisabled(true);
      }
    }

    useEffect(() => {
        if (email != "" && password != "") {
            setButtonDisabled(false);
        }
    }, [email, password]);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title} variant="displaySmall">
          Log In
        </Text>
        <Text style={styles.label} variant="titleMedium">
          Email
        </Text>
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                mode="outlined"
                label="Email"
                value={email}
                onChangeText={setEmail}
                error={!!errorMessage}
                />
        </View>
        <Text style={styles.label} variant="titleMedium">
          Password
        </Text>
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                mode="outlined"
                secureTextEntry={true}
                label="Password"
                value={password}
                onChangeText={setPassword}
                error={!!errorMessage}/>
          </View>
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        <Button style={styles.button} mode="contained" onPress={handleLogIn}>
            Log in
        </Button>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
  },
  title: {
    padding: 25,
    textAlign: 'center',
  },
  label: {
    textAlign: 'left',
    width: '100%',
    marginTop: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  inputContainer: {
    width: '100%',
    height: 60,
  },
  input: {
    marginBottom: 40,
    height: 40,
  },
  button: {
    width: '100%',
    marginTop: 20,
  },
  errorText: {
    color: 'pink',
    textAlign: 'left',
    width: '100%',
  },
});