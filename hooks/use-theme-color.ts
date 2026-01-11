/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type ColorName = keyof typeof Colors.light & keyof typeof Colors.dark;

const useThemeColor = () => {
  const theme = useColorScheme() ?? "light";
  return (colorName: ColorName) => Colors[theme][colorName];
};
export { useThemeColor };
