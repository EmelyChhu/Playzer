import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from '@/components/Themed';
import { PaperProvider, Text, Button } from 'react-native-paper';

export default function TabOneScreen() {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title}variant="displayLarge">
          Welcome to PlayLaser!
        </Text>
        <Button mode="contained">Sign up</Button>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <EditScreenInfo path="app/(tabs)/index.tsx" />
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
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
