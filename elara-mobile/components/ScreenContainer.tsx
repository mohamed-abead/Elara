import { ReactNode } from "react";
import { Box, useTheme } from "native-base";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useToken } from "native-base";

type Props = {
  children: ReactNode;
  padding?: number | string; // uses theme.space scale if number
  edges?: ("top" | "bottom" | "left" | "right")[];
  statusBarStyle?: "light" | "dark" | "auto";
};

export default function ScreenContainer({
  children,
  padding = 6,
  edges = ["top", "bottom"],
  statusBarStyle = "light",
}: Props) {
  const [textColor] = useToken("colors", ["semantic.textSecondary"]);
  console.log("textSecondary resolves to:", textColor);

  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const bg = theme.colors.semantic.background;

  return (
    <>
      <StatusBar style={statusBarStyle} backgroundColor={bg} />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: bg, // ✅ typed theme color
          paddingTop: edges.includes("top") ? insets.top : 0,
          paddingBottom: edges.includes("bottom") ? insets.bottom : 0,
        }}
      >
        <Box flex={1} bg="semantic.background" p={padding}>
          {children}
        </Box>
      </SafeAreaView>
    </>
  );
}
