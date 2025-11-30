import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { LsThemeProvider } from "@/context/useTheme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import * as Font from "expo-font";
import { useEffect, useState } from "react";
import { PaperProvider } from "react-native-paper";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const themeHook = useColorScheme();
  const theme = themeHook === "dark" ? "dark" : "light";
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load fonts
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Bangers-Regular": require("../assets/fonts/Bangers-Regular.ttf"),
        // Add more fonts here if needed
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <IconSymbol color={Colors[theme].icon} name="timer" size={50} />;
  }

  return (
    <LsThemeProvider>
      <PaperProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </PaperProvider>
    </LsThemeProvider>
  );
}
