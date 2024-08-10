import { createBox, createText, createTheme } from "@shopify/restyle";
import Animated from "react-native-reanimated";
import { colors } from "./colors";
import { textVariants } from "./text-variants";

const theme = createTheme({
  colors: colors,
  spacing: {
    "1": 4,
    "2": 8,
    "3": 12,
    "3.5": 14,
    "4": 16,
    "5": 20,
    "5.5": 22,
    "6": 24,
    "10": 40,
    "11": 44,
    "12": 48,
    "13": 56,
  },
  borderRadii: {
    none: 0,
    rounded: 4,
    "rounded-xl": 8,
    "rounded-2xl": 10,
    "rounded-3xl": 12,
    "rounded-4xl": 16,
    "rounded-5xl": 20,
    "rounded-7xl": 28,
  },
  textVariants,
  
  shadows: {
    light: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 5,
    },
    heavy: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 7,
    },
  },
  borders: {
    thin: {
      borderWidth: 1,
    },
    thick: {
      borderWidth: 2,
    },
  },
});

export type Theme = typeof theme;

export const Box = createBox<Theme>();
export const Text = createText<Theme>();
export const AnimatedText = Animated.createAnimatedComponent(Text);
export const AnimatedBox = Animated.createAnimatedComponent(Box);

export default theme;
