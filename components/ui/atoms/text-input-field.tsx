import { useColorScheme } from "@/hooks/use-color-scheme.web";
import { useEffect, useState } from "react";
import { KeyboardTypeOptions, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";

type StreakTextInputProps = {
  label?: string;
  type?: KeyboardTypeOptions;
  onStreakTextChange: (text: string) => void;
};

const StreakTextInput = ({
  label,
  type,
  onStreakTextChange,
}: StreakTextInputProps) => {
  const colorScheme = useColorScheme() ?? "light";
  const [text, setText] = useState("");

  useEffect(() => {
    onStreakTextChange(text);
  }, [text]);


  return (
    <TextInput
      label={label ?? "Enter text"}
      value={text}
      keyboardType={type ? type : "default"}
      onChangeText={(text) => setText(text)}
      style={colorScheme === "light" ? styles.lightInput : styles.darkInput}
    />
  );
};

export { StreakTextInput };

const styles = StyleSheet.create({
  lightInput: {
    color: "black",
  },
  darkInput: {
    color: "white",
  },
});
