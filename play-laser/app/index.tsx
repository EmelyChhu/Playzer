import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from '@/components/Themed';
import { PaperProvider, Text, Button } from 'react-native-paper';
import { router } from 'expo-router';

export default function EntryScreen() {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title}variant="displayLarge">
          Welcome to PlayLaser!
        </Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Button mode="contained" onPress={() => router.push("/(tabs)")}>Sign up</Button>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    padding: 25,
    textAlign: 'center',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
