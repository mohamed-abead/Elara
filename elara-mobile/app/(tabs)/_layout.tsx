// app/(tabs)/_layout.tsx
import React from "react";
import { Tabs, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  IconButton,
  Spinner,
  Text,
  VStack,
  useTheme,
  useToken,
} from "native-base";
import { ThemedHeader } from "@/components/ThemedHeader";
import ScreenContainer from "@/components/ScreenContainer";
import { useAuth } from "@/hooks/useAuth";

export default function TabsLayout() {
  const theme = useTheme();
  const { session, loading } = useAuth();

  // Typed references (IntelliSense + compile-time safety)
  const bg = theme.colors.semantic.background;
  const active = theme.colors.brand[500];
  const inactive = theme.colors.semantic.textPrimary;

  // Only needed because tabBarStyle is a plain React style object (not a NB prop)
  const [bgHex] = useToken("colors", ["semantic.background"]);

  if (loading) {
    return (
      <ScreenContainer>
        <VStack flex={1} justifyContent="center" alignItems="center" space={3}>
          <Spinner color="brand.400" accessibilityLabel="Checking session" />
          <Text color="semantic.textSecondary">Verifying your access…</Text>
        </VStack>
      </ScreenContainer>
    );
  }

  if (!session) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: true,
        header: ({ options, route }) => (
          <ThemedHeader title={(options.title as string) ?? route.name} />
        ),
        tabBarStyle: { backgroundColor: bgHex },
        tabBarActiveTintColor: active,
        tabBarInactiveTintColor: inactive,
        tabBarShowLabel: true,
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
          header: ({ options, route }) => (
            <ThemedHeader
              title={(options.title as string) ?? route.name}
              right={
                <IconButton
                  variant="ghost"
                  _icon={{
                    as: Ionicons,
                    name: "notifications-outline",
                    size: "lg",
                    color: inactive, 
                  }}
                  _pressed={{ opacity: 0.7 }}
                />
              }
            />
          ),
        }}
      />

      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
          header: ({ options, route }) => (
            <ThemedHeader
              title={(options.title as string) ?? route.name}
              right={
                <IconButton
                  variant="ghost"
                  _icon={{
                    as: Ionicons,
                    name: "settings-outline",
                    size: "lg",
                    color: inactive, // ✅ typed reference
                  }}
                  _pressed={{ opacity: 0.7 }}
                />
              }
            />
          ),
        }}
      />
    </Tabs>
  );
}
