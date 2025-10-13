import { extendTheme } from "native-base";

// Constrained to only these hex values:
// #F9A620, #FFD449, #AAB03C, #548C2F, #104911
const palette = {
  primary: {
    lightest: "#FFD449",  // Bright yellow
    light: "#F9A620",     // Orange
    medium: "#AAB03C",    // Olive green
    dark: "#548C2F",      // Forest green
    darkest: "#104911",   // Deep green
  },
};

export const elaraTheme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  colors: {
    primary: palette.primary,
  },
  fonts: {
    heading: "System",
    body: "System",
    mono: "SpaceMono",
  },
  radii: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    "2xl": 32,
  },
  space: {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: "primary",
        rounded: "lg",
        _text: {
          fontWeight: "600",
        },
      },
      variants: {
        solid: ({ colorScheme }: { colorScheme: string }) => ({
          bg: `${colorScheme}.medium`,
          _text: { color: "primary.darkest" },
          _pressed: { bg: `${colorScheme}.dark` },
          _disabled: { opacity: 0.6 },
        }),
        outline: ({ colorScheme }: { colorScheme: string }) => ({
          borderColor: `${colorScheme}.medium`,
          _text: { color: `${colorScheme}.darkest` },
          _pressed: { bg: `${colorScheme}.lightest` },
        }),
        ghost: ({ colorScheme }: { colorScheme: string }) => ({
          _text: { color: `${colorScheme}.darkest` },
          _pressed: { bg: `${colorScheme}.lightest` },
        }),
      },
    },
    Input: {
      defaultProps: {
        variant: "unstyled",
        height: 12,
        px: 4,
        py: 3,
        fontSize: "md",
        bg: "primary.lightest",
        borderRadius: "lg",
        borderWidth: 1,
        borderColor: "primary.dark",
        color: "primary.darkest",
        _focus: {
          borderColor: "primary.dark",
          bg: "primary.light",
        },
        _input: {
          selectionColor: "primary.lightest",
        },
      },
    },
    Heading: {
      baseStyle: {
        color: "primary.darkest",
        fontWeight: "700",
      },
    },
    Text: {
      baseStyle: {
        color: "primary.darkest",
      },
    },
    VStack: {
      baseStyle: {
        space: 4,
      },
    },
    HStack: {
      baseStyle: {
        space: 3,
        alignItems: "center",
      },
    },
    Divider: {
      defaultProps: {
        bg: "primary.dark",
      },
    },
  },
});

export type ElaraThemeType = typeof elaraTheme;

declare module "native-base" {
  interface ICustomTheme extends ElaraThemeType {}
}
