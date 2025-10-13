import { Redirect, Tabs } from "expo-router";
import React from "react";
import { Center, Spinner, useColorModeValue } from "native-base";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuth } from "@/hooks/use-auth";

export default function TabLayout() {
  const { session, loading } = useAuth();
  const colorScheme = useColorScheme();
  const bg = useColorModeValue("background.50", "surface.100");

  if (loading) {
    return (
      <Center flex={1} bg={bg}>
        <Spinner color="primary.400" />
      </Center>
    );
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
