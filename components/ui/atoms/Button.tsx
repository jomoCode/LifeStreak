import { Colors } from "@/constants/theme";
import { buttonStyles } from "@/lib/styles/Styles";
import React, { ReactNode } from "react";
import { useColorScheme, View } from "react-native";
import { Button as RnaButton } from "react-native-paper";

type Mode =
  | "text"
  | "outlined"
  | "contained"
  | "elevated"
  | "contained-tonal"
  | undefined;

type ButtonProps = {
  onPress: () => void;
  text: string;
  mode?: Mode;
  children: ReactNode;
};

const Button = ({ onPress, text, mode, children }: ButtonProps) => {
  const theme = useColorScheme() === "dark" ? "dark" : "light";
  const styles = buttonStyles(theme);
  return (
    <RnaButton
      onPress={onPress}
      mode={mode}
      rippleColor={Colors[theme].tint}
      compact={true}
      contentStyle={{ padding: 0 }}
    >
      <View style={styles.container}>
        <View style={styles.content}>{children}</View>
      </View>
    </RnaButton>
  );
};

export { Button };
