// theme/tokens/typography.ts

// Families: keep it simple; you can swap later (e.g., Inter, SF Pro, etc.)
export const fonts = {
  heading: "System", // iOS/Android system UI font
  body: "System",
  mono: "SpaceMono", // already loaded by the template
} as const;

// Sizes (rem-ish scale in dp). Add/remove as you like.
export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
} as const;

// Weights
export const fontWeights = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

// Line heights to match sizes (tweak to taste)
export const lineHeights = {
  xs: 16,
  sm: 18,
  md: 22,
  lg: 24,
  xl: 26,
  "2xl": 30,
  "3xl": 36,
  "4xl": 42,
} as const;
