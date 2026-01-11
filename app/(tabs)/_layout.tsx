import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol, IconSymbolName } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Tabs } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

type TabConfig = {
  name: string;
  title: string;
  icon: IconSymbolName;
};

const TAB_CONFIG: TabConfig[] = [
  {
    name: "index",
    title: "Home",
    icon: "figure.gymnastics.circle",
  },
  {
    name: "Adherence",
    title: "Adherence",
    icon: "flame",
  },
];

const TabLayout = () => {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <SafeAreaView>
        {TAB_CONFIG.map(({ name, title, icon }) => (
          <Tabs.Screen
            key={name}
            name={name}
            options={{
              title,
              tabBarIcon: ({ color }) => (
                <IconSymbol size={28} name={icon} color={color} />
              ),
            }}
          />
        ))}
      </SafeAreaView>
    </Tabs>
  );
};
export default TabLayout;
