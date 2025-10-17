import { extendTheme } from "native-base";
import { brandPalette, semanticColors } from "./tokens/colors";
import { spacing } from "./tokens/spacing";
import {
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
} from "./tokens/typography";
import { radii } from "./tokens/radius";
import { shadows } from "./tokens/shadows";


export default extendTheme({
  config: { initialColorMode: "dark" },
  colors: {
    brand: brandPalette.gold, // use this as colorScheme="brand"
    ...brandPalette, // optional: direct access to gold/forest/ivory
    semantic: semanticColors, // surfaces & text roles
  },
  space: spacing,
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
  radii,
  shadows,
});
