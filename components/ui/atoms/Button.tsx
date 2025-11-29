import { buttonStyles } from "@/lib/styles/Styles";
import React from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

type ButtonProps = {
  onPress: () => void;
  text: string;
};

const Button = ({ onPress, text }: ButtonProps) => {
  const theme = useColorScheme() === "dark" ? "dark" : "light";
  const styles = buttonStyles(theme);
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.content}>
        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

export { Button };
