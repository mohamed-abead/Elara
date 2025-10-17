// types/native-base.d.ts
import type theme from "../theme"; // your extended theme (theme/index.ts default export)

// Infer your concrete theme shape
type ElaraTheme = typeof theme;

// Augment NativeBase to use your theme type
declare module "native-base" {
  // This tells NativeBase/TypeScript that your theme is the source of truth
  interface ICustomTheme extends ElaraTheme {}
}
