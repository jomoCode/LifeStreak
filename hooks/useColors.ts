import { Colors } from "@/constants/theme";
import { useThemeController } from "@/context/useTheme";

export const useColors = () => {
  const { theme } = useThemeController();
  const mode = theme === "light";
  const color = mode ? Colors["light"] : Colors["dark"];
  return color;
};
