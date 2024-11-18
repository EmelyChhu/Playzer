import { Stack, Link } from 'expo-router';

import { Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';import { useColorScheme } from '@/components/useColorScheme';

export default function ProfileStackLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack>
      <Stack.Screen 
        name="index"
        options={{
            headerShown: true,
            headerTitle: 'Profile',
            headerRight: () => (
              <Link href="/profile/settings" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="cog"
                      size={25}
                      color={Colors[colorScheme ?? 'light'].text}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            ),
          }}
      />
      <Stack.Screen 
        name="settings"
        options={{ 
          headerShown: true,
          headerTitle: "Settings",
        }} 
      />
    </Stack>
  );
}