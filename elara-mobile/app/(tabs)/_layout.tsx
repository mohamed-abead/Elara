// app/(tabs)/_layout.tsx
import React, { useCallback } from "react";
import { Tabs, Redirect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  HStack,
  IconButton,
  Spinner,
  Text,
  VStack,
  useTheme,
  useToken,
  useToast,
} from "native-base";
import { ThemedHeader } from "@/components/ThemedHeader";
import ScreenContainer from "@/components/ScreenContainer";
import { useAuth } from "@/hooks/useAuth";

export default function TabsLayout() {
  const theme = useTheme();
  const router = useRouter();
  const toast = useToast();
  const { session, loading, signOut } = useAuth();

  // Typed references (IntelliSense + compile-time safety)
  const bg = theme.colors.semantic.background;
  const active = theme.colors.brand[500];
  const inactive = theme.colors.semantic.textPrimary;

  // Only needed because tabBarStyle is a plain React style object (not a NB prop)
  const [bgHex] = useToken("colors", ["semantic.background"]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      router.replace("/(auth)");
    } catch (error: any) {
      toast.show({
        title: "Sign out failed",
        description: error?.message ?? "Please try again.",
        bgColor: "error.600",
      });
    }
  }, [router, signOut, toast]);

  const primaryHeaderActions = (
    <HStack space={1}>
      <IconButton
        variant="ghost"
        _icon={{
          as: Ionicons,
          name: "notifications-outline",
          size: "lg",
          color: inactive,
        }}
        _pressed={{ opacity: 0.7 }}
        accessibilityLabel="Notifications"
      />
      <IconButton
        variant="ghost"
        _icon={{
          as: Ionicons,
          name: "log-out-outline",
          size: "lg",
          color: inactive,
        }}
        _pressed={{ opacity: 0.7 }}
        accessibilityLabel="Sign out"
        onPress={handleSignOut}
      />
    </HStack>
  );

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
              right={primaryHeaderActions}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="transfer"
        options={{
          title: "Transfer",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="swap-horizontal-outline"
              color={color}
              size={size}
            />
          ),
          header: ({ options, route }) => (
            <ThemedHeader
              title={(options.title as string) ?? route.name}
              right={primaryHeaderActions}
            />
          ),
        }}
      />
    </Tabs>
  );
}
