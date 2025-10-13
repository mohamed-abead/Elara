import { extendTheme } from "native-base";

const palette = {
  auric: {
    50: "#F9F4E5",
    100: "#F1E3BA",
    200: "#E5D28E",
    300: "#D9C163",
    400: "#CFA741",
    500: "#C2962E",
    600: "#A37721",
    700: "#825A18",
    800: "#5F3E10",
    900: "#3A2608",
  },
  midnight: {
    50: "#E6ECF7",
    100: "#C5D1EA",
    200: "#9DB6DD",
    300: "#739AD0",
    400: "#4F80C2",
    500: "#3664A9",
    600: "#284D84",
    700: "#1B365E",
    800: "#10213B",
    900: "#070F1F",
  },
  charcoal: {
    50: "#F5F6F8",
    100: "#E2E6ED",
    200: "#CBD1DA",
    300: "#B1B9C5",
    400: "#8C96A7",
    500: "#687180",
    600: "#4F5766",
    700: "#39404D",
    800: "#242A33",
    900: "#11141B",
  },
};

export const elaraTheme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  colors: {
    primary: palette.auric,
    secondary: palette.midnight,
    neutral: palette.charcoal,
    background: {
      50: "#FBFCFF",
      100: "#EDF1FA",
      200: "#D4DDEE",
      300: "#B1C4E0",
      400: "#8FA9CF",
      500: "#6A8CBE",
      600: "#4C6CA1",
      700: "#344D78",
      800: "#1F2E4F",
      900: "#0A1328",
    },
    surface: {
      100: "#101522",
      200: "#141B2E",
      300: "#192135",
      400: "#1E273F",
      500: "#242E4A",
      600: "#2C3857",
    },
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
          bg: `${colorScheme}.500`,
          _text: { color: "secondary.900" },
          _pressed: { bg: `${colorScheme}.600` },
          _disabled: { opacity: 0.6 },
        }),
        outline: ({ colorScheme }: { colorScheme: string }) => ({
          borderColor: `${colorScheme}.400`,
          _text: { color: `${colorScheme}.300` },
          _pressed: { bg: `${colorScheme}.900` },
        }),
        ghost: ({ colorScheme }: { colorScheme: string }) => ({
          _text: { color: `${colorScheme}.300` },
          _pressed: { bg: "surface.200" },
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
        bg: "surface.200",
        borderRadius: "lg",
        borderWidth: 1,
        borderColor: "surface.500",
        color: "coolGray.50",
        _focus: {
          borderColor: "primary.400",
          bg: "surface.300",
        },
        _input: {
          selectionColor: "primary.300",
        },
      },
    },
    Heading: {
      baseStyle: {
        color: "coolGray.50",
        fontWeight: "700",
      },
    },
    Text: {
      baseStyle: {
        color: "coolGray.200",
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
        bg: "surface.400",
      },
    },
  },
});

export type ElaraThemeType = typeof elaraTheme;

declare module "native-base" {
  interface ICustomTheme extends ElaraThemeType {}
}
