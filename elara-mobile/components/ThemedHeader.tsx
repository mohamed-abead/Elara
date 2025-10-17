import React from "react";
import { Platform } from "react-native";
import {
  Box,
  HStack,
  IconButton,
  Text,
  StatusBar,
  useTheme,
  useToken,
} from "native-base";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  title?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
};

export function ThemedHeader({ title = "Elara", left, right }: Props) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  // Typed access (✅ IntelliSense + compile-time safety)
  const bg = theme.colors.semantic.background;
  const border = theme.colors.semantic.border;
  const text = theme.colors.semantic.textPrimary;

  // Only for non-NativeBase props (StatusBar)
  const [bgHex] = useToken("colors", ["semantic.background"]);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={bgHex} />

      <Box
        accessibilityRole="header"
        bg="semantic.background"
        pt={insets.top}
        px={4}
        pb={3}
        borderBottomWidth={Platform.OS === "web" ? 1 : 0}
        borderBottomColor="semantic.border"
        shadow={2}
        style={
          Platform.OS === "android"
            ? { elevation: theme.shadows[2].elevation }
            : undefined
        }
      >
        <HStack alignItems="center" justifyContent="space-between" space={3}>
          <Box w={10}>
            {left ?? (
              <IconButton
                variant="ghost"
                _icon={{
                  as: Ionicons,
                  name: "chevron-back",
                  size: "lg",
                  color: text, // ✅ typed reference
                }}
                _pressed={{ opacity: 0.7 }}
                isDisabled
              />
            )}
          </Box>

          <Text
            color="semantic.textPrimary"
            fontFamily="heading"
            fontWeight="semibold"
            fontSize="lg"
            textAlign="center"
            numberOfLines={1}
            flex={1}
          >
            {title}
          </Text>

          <Box minW={10} alignItems="flex-end">
            {right ?? null}
          </Box>
        </HStack>
      </Box>
    </>
  );
}
