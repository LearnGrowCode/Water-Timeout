import { HydrationProvider, UnitType, useHydration } from '@/lib/hydration-store';
import { registerForPushNotificationsAsync, setupNotificationCategories } from '@/lib/notifications';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
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
  const { addEvent, settings } = useHydration();

  useEffect(() => {
    setupNotificationCategories(settings.notificationActions);
  }, [settings.notificationActions]);

  const lastResponse = Notifications.useLastNotificationResponse();
  const processedNotifications = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (lastResponse && lastResponse.notification.request.identifier) {
      const id = lastResponse.notification.request.identifier;
      const actionIdentifier = lastResponse.actionIdentifier;

      if (!processedNotifications.current.has(id)) {
        if (actionIdentifier && ['sip', 'quarter', 'half', 'full'].includes(actionIdentifier)) {
          addEvent(actionIdentifier as UnitType);
          processedNotifications.current.add(id);
        }
      }
    }
  }, [lastResponse, addEvent]);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const id = response.notification.request.identifier;
      const actionIdentifier = response.actionIdentifier;

      if (!processedNotifications.current.has(id)) {
        if (actionIdentifier && ['sip', 'quarter', 'half', 'full'].includes(actionIdentifier)) {
          addEvent(actionIdentifier as UnitType);
          processedNotifications.current.add(id);
        }
      }
    });

    return () => subscription.remove();
  }, [addEvent]);

  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

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
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </NotificationHandler>
    </HydrationProvider>
  );
}
