import { Slot, Stack } from "expo-router";
import "react-native-reanimated";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { DbProvider } from "@/context/useBackend";
import { LsThemeProvider } from "@/context/useTheme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import * as Font from "expo-font";
import { useEffect, useState } from "react";
import { PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const themeHook = useColorScheme();
  const theme = themeHook === "dark" ? "dark" : "light";
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load fonts
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Bangers-Regular": require("../assets/fonts/Bangers-Regular.ttf"),
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
        <DbProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <SafeAreaView>
              <Slot />
            </SafeAreaView>
          </Stack>
        </DbProvider>
      </PaperProvider>
    </LsThemeProvider>
  );
}
