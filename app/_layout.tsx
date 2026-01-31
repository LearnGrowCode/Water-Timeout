import { HydrationProvider, UnitType, useHydration } from '@/lib/hydration-store';
import { registerForPushNotificationsAsync } from '@/lib/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function NotificationHandler({ children }: { children: React.ReactNode }) {
  const { addEvent, loading } = useHydration();
  const processedNotifications = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (loading) return;

    // Full response logging for debugging
    const debugSub = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("FULL RESPONSE:", JSON.stringify(response, null, 2));
    });

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const id = response.notification.request.identifier;
      const actionIdentifier = response.actionIdentifier;

      console.log("ACTION:", actionIdentifier);

      if (actionIdentifier && ['sip', 'quarter', 'half', 'full'].includes(actionIdentifier)) {
        if (!processedNotifications.current.has(id)) {
          addEvent(actionIdentifier as UnitType, id);
          processedNotifications.current.add(id);
          // Dismiss the notification after action
          Notifications.dismissNotificationAsync(id);
        }
      }
    });

    return () => {
      debugSub.remove();
      subscription.remove();
    };
  }, [addEvent, loading]);

  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function checkFirstLaunch() {
      try {
        const hasSeen = await AsyncStorage.getItem('water-timeout-onboarding-completed');
        if (hasSeen !== 'true') {
          // Allow a small delay for navigation to be ready
          setTimeout(() => {
            router.replace('/onboarding');
          }, 100);
        }
      } catch (e) {
        console.error('Failed to check onboarding status', e);
      } finally {
        setIsReady(true);
      }
    }

    checkFirstLaunch();
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <HydrationProvider>
      <NotificationHandler>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false, animation: 'fade' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </NotificationHandler>
    </HydrationProvider>
  );
}
