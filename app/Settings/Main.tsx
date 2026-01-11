import { LsButton } from "@/components/ui/atoms/LsButton";
import { useThemeController } from "@/context/useTheme";
import React from "react";
import { Text, View } from "react-native";

const Main = () => {
  const { theme, toggleTheme, setTheme, resetToSystem } = useThemeController();
  return (
    <View>
      <Text>Current theme: {theme}</Text>

      <LsButton onPress={toggleTheme}>Toggle Theme</LsButton>
      <LsButton onPress={() => setTheme("dark")}>Set Dark</LsButton>
      <LsButton onPress={() => setTheme("light")}>Set Light</LsButton>
      <LsButton onPress={resetToSystem}>Use System Theme</LsButton>
    </View>
  );
};

export default Main;
