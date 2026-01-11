import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance, useColorScheme } from "react-native";

// Optional: persist preference
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeType = "light" | "dark";

type ThemeContextProps = {
  theme: ThemeType;
  setTheme: (mode: ThemeType) => void;
  toggleTheme: () => void;
  resetToSystem: () => void;
  isUsingSystemSetting: boolean;
}
type ThemeProviderProp =  { children: React.ReactNode }
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const LsThemeProvider = ({ children }:ThemeProviderProp) => {
  const systemTheme = useColorScheme() === "dark" ? "dark" : "light";

  const [theme, setThemeState] = useState<ThemeType>(systemTheme);
  const [isUsingSystemSetting, setIsUsingSystemSetting] = useState(true);

  // Load manual preference
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("APP_THEME");
      if (saved) {
        setThemeState(saved as ThemeType);
        setIsUsingSystemSetting(false);
      }
    })();
  }, []);

  // Sync with system theme if using system mode
  useEffect(() => {
    if (isUsingSystemSetting) {
      setThemeState(systemTheme);
    }
  }, [isUsingSystemSetting, systemTheme]);

  const setTheme = async (mode: ThemeType) => {
    setThemeState(mode);
    setIsUsingSystemSetting(false);
    await AsyncStorage.setItem("APP_THEME", mode);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  const resetToSystem = async () => {
    setIsUsingSystemSetting(true);
    await AsyncStorage.removeItem("APP_THEME");
    setThemeState(systemTheme);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, toggleTheme, resetToSystem, isUsingSystemSetting }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeController = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useThemeController must be used within ThemeProvider");
  return context;
};
