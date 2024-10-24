import { StyleSheet } from 'react-native';
import { useState, useEffect, useLayoutEffect } from 'react';

import { View } from '@/components/Themed';
import { PaperProvider, Text, Button, TextInput } from 'react-native-paper';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

export default function EntryScreen() {
    const navigation = useNavigation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const handleLogIn = () => {
        router.push("../(tabs)")
    }

    useEffect(() => {
        if (email != "" && password != "") {
            setButtonDisabled(false);
        }
    }, [email, password]);

    useLayoutEffect(() => {
        navigation.setOptions({
          title: 'Log In',
          headerBackTitle: 'Back',
        });
      }, [navigation]);

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
                onChangeText={setEmail}/>
        </View>
        <Text style={styles.label} variant="titleMedium">
          Password
        </Text>
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                mode="outlined"
                label="Password"
                value={password}
                onChangeText={setPassword}/>
        </View>
        <Button style={styles.button} mode="contained" disabled={buttonDisabled} onPress={handleLogIn}>
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
  }
});
