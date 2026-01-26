import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const isDevice = Platform.OS !== "web"; // Simple check if expo-device is missing

  if (isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      // alert('Failed to get push token for push notification!');
      return;
    }
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        // throw new Error('Project ID not found');
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
    } catch (e) {
      token = `${e}`;
    }
  } else {
    // alert('Must use physical device for Push Notifications');
  }

  return token;
}

export async function scheduleHydrationReminders(
  frequency: number, // minutes
  start: string, // "HH:mm"
  end: string, // "HH:mm"
  tone: "playful" | "neutral",
) {
  // Cancel existing notifications first
  await Notifications.cancelAllScheduledNotificationsAsync();

  const [startHour, startMin] = start.split(":").map(Number);
  const [endHour, endMin] = end.split(":").map(Number);

  const playfulMessages = [
    "Hey! Your water bottle is feeling a bit lonely. 💧",
    "Time for a quick sip! Your future self will thank you. ✨",
    "Stay fresh! A little water goes a long way. 🌊",
    "Hydration alert! Don't let your plants be the only ones drinking today. 🌿",
    "Glug glug! Time to top up. 🥛",
  ];

  const neutralMessages = [
    "Hydration reminder: It's time to drink some water.",
    "Stay hydrated. Drink water at regular intervals.",
    "Time for your scheduled water intake.",
    "Maintain your hydration goals. Drink water now.",
    "Daily reminder: Don't forget to hydrate.",
  ];

  const messages = tone === "playful" ? playfulMessages : neutralMessages;

  // We'll schedule reminders every 'frequency' minutes between start and end
  // Since Expo doesn't support complex "between X and Y every Z minutes" easily in a single trigger,
  // we'll schedule individual notifications for the day if frequency is low,
  // or use a repeating trigger if it's a fixed interval that fits.

  // For simplicity and reliability within the active window, we'll schedule
  // several upcoming notifications.

  const now = new Date();
  let current = new Date();
  current.setHours(startHour, startMin, 0, 0);

  // If start is after end, assume it spans across midnight (though UI usually handles this)
  // For now, let's assume standard day windows.

  const endTimestamp = new Date();
  endTimestamp.setHours(endHour, endMin, 0, 0);

  // If start is after end, end is tomorrow
  if (startHour > endHour || (startHour === endHour && startMin > endMin)) {
    endTimestamp.setDate(endTimestamp.getDate() + 1);
  }

  // Schedule for the next 48 hours to ensure coverage
  const maxDays = 2;
  for (let day = 0; day < maxDays; day++) {
    let dayStart = new Date();
    dayStart.setDate(dayStart.getDate() + day);
    dayStart.setHours(startHour, startMin, 0, 0);

    let dayEnd = new Date();
    dayEnd.setDate(dayEnd.getDate() + day);
    dayEnd.setHours(endHour, endMin, 0, 0);

    if (startHour > endHour) dayEnd.setDate(dayEnd.getDate() + 1);

    let scheduleTime = new Date(dayStart);
    while (scheduleTime <= dayEnd) {
      if (scheduleTime > now) {
        const message = messages[Math.floor(Math.random() * messages.length)];

        await Notifications.scheduleNotificationAsync({
          content: {
            title: tone === "playful" ? "Drip Drip! 💧" : "Hydration Reminder",
            body: message,
            sound: true,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: scheduleTime,
          },
        });
      }
      scheduleTime = new Date(scheduleTime.getTime() + frequency * 60000);
    }
  }
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
