import { Colors } from "@/constants/theme";
import { useButtonStyles } from "@/hooks/styles/useStyles";
import React, { ReactNode, useEffect, useRef } from "react";
import { Animated, useColorScheme, View, ViewStyle } from "react-native";
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
  mode?: Mode;
  children: ReactNode;
  accessibilityLabel?: string;
};

const LsButton = ({
  onPress,
  mode,
  children,
  accessibilityLabel,
}: ButtonProps) => {
  const theme = useColorScheme() === "dark" ? "dark" : "light";
  const styles = useButtonStyles();

  if (styles) {
    return (
      <RnaButton
        onPress={onPress}
        mode={mode}
        rippleColor={Colors[theme].tint}
        compact={true}
        style={styles.container}
        accessibilityLabel={accessibilityLabel}
      >
        <View style={styles.content}>{children}</View>
      </RnaButton>
    );
  } else {
    return <LsPulsating />;
  }
};

export { LsButton };

//DEFAULT BUTTON
type LsPulsatingProps = { style?: ViewStyle };

export const LsPulsating = ({ style }: LsPulsatingProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const styles = style ?? pulsatingButtonStyles;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.7,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [scaleAnim, opacityAnim]);

  return (
    <Animated.View
      style={[
        style ?? (styles as ViewStyle),
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    />
  );
};

const pulsatingButtonStyles = {
  borderRadius: 30,
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
  width: 120,
  height: 60,
  borderWidth: 3,
  borderColor: "#cccccc",
  backgroundColor: "#ff6347",
};
