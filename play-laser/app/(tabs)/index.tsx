import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View, Text } from '@/components/Themed';
import { PaperProvider } from 'react-native-paper';

export default function HomeScreen() {
  return (
    <PaperProvider>
      <View style={styles.container}>
        {/* <Text style={styles.title}>Home</Text> */}
        <Text style={styles.subtitle}>Welcome to Playzer</Text>
        {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}
        {/* <EditScreenInfo path="app/(tabs)/index.tsx" /> */}
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
