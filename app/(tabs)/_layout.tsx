import { Tabs } from "expo-router";
import { Calendar, Droplets, Settings as SettingsIcon } from "lucide-react-native";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[(colorScheme ?? "light") as "light" | "dark"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors[(colorScheme ?? "light") as "light" | "dark"].background,
          paddingTop: 0,
          marginTop: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Today",
          tabBarIcon: ({ color }) => <Droplets size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="track"
        options={{
          title: "Track",
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <SettingsIcon size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
