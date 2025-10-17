// theme/tokens/colors.ts

// Brand palettes (raw hex scales)
export const brandPalette = {
  gold: {
    50: "#FDF7E8",
    100: "#F8E6B8",
    200: "#F4D989",
    300: "#F0CB5B",
    400: "#EBBD2C",
    500: "#F2B705",
    600: "#C29104",
    700: "#916C03",
    800: "#614802",
    900: "#302401",
  },
  forest: { 900: "#0F2A1E" },
  ivory: { 500: "#EDE8DA" },
};

// Semantic roles (generic tokens used across the app)
export const semanticColors = {
  background: brandPalette.forest[900],
  surface: brandPalette.gold[50],
  textPrimary: brandPalette.ivory[500],
  textSecondary: brandPalette.gold[300],
  primary: brandPalette.gold[500],
  primaryPressed: brandPalette.gold[600],
  accent: brandPalette.gold[400],
  border: brandPalette.gold[800],
};
