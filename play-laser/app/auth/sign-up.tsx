import { StyleSheet } from 'react-native';
import { useState, useEffect, useLayoutEffect } from 'react';

import { View } from '@/components/Themed';
import { PaperProvider, Text, Button, TextInput, Checkbox } from 'react-native-paper';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

import { FIREBASE_AUTH, addUsers } from '@/FirebaseConfig';
// import { createUserWithEmailAndPassword } from 'firebase/auth';

/**
 * isValidName Function - checks whether a given name is a valid string that doesn't contain numbers or special characters aside from - and space
 * 
 * @param {string} - user entered name
 * @returns {boolean} - if the name is valid
 */
export function isValidName(name : string) : boolean {
  return /^[A-Za-z]+([ -][A-Za-z]+)*$/.test(name.trim());
}

/**
 * isValidEmail Function - checks whether a given email has a localPart@domain.com format
 * 
 * @param {string} - user entered email
 * @returns {boolean} - if the email is valid
 */
export function isValidEmail(email : string) : boolean {
  const atIndex = email.indexOf("@");
  if (atIndex == -1 || atIndex == 0 || atIndex == email.length - 1) {
    return false;
  }
  const domain = email.substring(atIndex + 1);
  const periodIndex = domain.indexOf(".");
  if (periodIndex == -1 || periodIndex == 0 || periodIndex == domain.length - 1) {
    return false;
  }
  return true;
}

/**
 * isValidPassword Function - checks whether a given password is equal to or longer than 8 characters
 * 
 * @param {string} - user entered password
 * @returns {boolean} - if the password is valid
 */
export function isValidPassword(password : string) : boolean {
  return (password.length >= 8 ? true : false);
}

/**
 * SignUpScreen Component - sign up screen for the Playzer app
 * 
 * @returns {JSX.Element} - React component that renders the UI
 * 
 * provides "Email" text input box that allows users to enter their email
 * provides "Password" text input box that allows users to enter their password
 * provides "Sign up" button that logs users into the app and creates a new account if the entered information is valid
 */
export default function SignUpScreen() {
    const navigation = useNavigation();
    
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [validNameInput, setValidNameInput] = useState(true);
    const [validEmailInput, setValidEmailInput] = useState(true);
    const [validPasswordInput, setValidPasswordInput] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [checked, setChecked] = useState(false);

    const auth = FIREBASE_AUTH;

    const handleSignUp = async () => {
      const validName = isValidName(name)
      const validEmail = isValidEmail(email)
      const validPassword = isValidPassword(password)
      
      setValidNameInput(validName);
      setValidEmailInput(validEmail);
      setValidPasswordInput(validPassword);

      if (validName && validEmail && validPassword) {
        setButtonDisabled(false);
        try {
          // const response = await createUserWithEmailAndPassword(auth, email, password);
          // console.log(response);
          addUsers(name, email, password);
          alert('Account created succesfully!')
          router.push("../(tabs)/home")
        }
        catch (error : any) {
          console.log(error);
          alert('Registration failed: ' + error.message);
        }
        finally {
          setButtonDisabled(true);
        }
      }
    }

    useEffect(() => {
      if (name != "" && email != "" && password != "") {
        setButtonDisabled(false);
      } else {
        setButtonDisabled(true);
      }
    }, [name, email, password]);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.label} variant="titleMedium">
          Full Name
        </Text>
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                mode="outlined"
                error={validNameInput ? false : true}
                textColor={validNameInput ? undefined : "pink"}
                label="Name"
                value={name}
                onChangeText={setName}/>
        </View>
        {!validNameInput ? <Text style={styles.errorText}>Please enter a string with 1+ characters.</Text> : null}
        <Text style={styles.label} variant="titleMedium">
          Email
        </Text>
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                mode="outlined"
                error={validEmailInput ? false : true}
                textColor={validEmailInput ? undefined : "pink"}
                label="Email"
                value={email}
                onChangeText={setEmail}/>
        </View>
        {!validEmailInput ? <Text style={styles.errorText}>Please enter a valid email.</Text> : null}
        <Text style={styles.label} variant="titleMedium">
          Password
        </Text>
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                mode="outlined"
                secureTextEntry={!showPassword}
                error={validPasswordInput ? false : true}
                textColor={validPasswordInput ? undefined : "pink"}
                label="Password"
                value={password}
                onChangeText={setPassword}/>
        </View>
        <Text style={validPasswordInput ? styles.subtitle : styles.subtitleError}>
          Passwords must contain at least 8 characters.
        </Text>
        {!validPasswordInput ? <Text style={styles.errorText}>Please enter a valid password.</Text> : null}
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => {
              setChecked(!checked);
              setShowPassword(!showPassword);
            }}
          />
          <Text>
            Show password
          </Text>
        </View>
        <Button style={styles.button} mode="contained" onPress={handleSignUp} disabled={buttonDisabled}>
            Sign up
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
  checkboxContainer: {
    width: '100%',
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 6,
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
  subtitle: {
    textAlign: 'left',
    width: '100%',
    marginBottom: 8,
  },
  subtitleError: {
    textAlign: 'left',
    width: '100%',
    marginBottom: 8,
    color: 'pink',
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
    marginBottom: 0,
    height: 40,
  },
  button: {
    width: '100%',
    marginTop: 20,
  },
  errorText: {
    textAlign: 'left',
    width: '100%',
    color: 'pink',
  },
});