import { useButtonStyles } from "@/hooks/styles/useStyles";
import React, { ReactNode, useEffect, useRef } from "react";
import { Animated, Pressable, Text, View, ViewStyle } from "react-native";

type ButtonProps = {
  onPress: () => void;
  children?: ReactNode;
  accessibilityLabel?: string;
  text?: string;
};

const LsButton = ({
  onPress,
  children,
  accessibilityLabel,
  text,
}: ButtonProps) => {
  const styles = useButtonStyles();
  if (text && children) {
    throw new Error(
      "Wrong use of lsButton component: Button cannot have child and text"
    );
  }

  if (styles) {
    return (
      <Pressable
        onPress={onPress}
        style={styles.container}
        accessibilityLabel={accessibilityLabel}
      >
        <View style={styles.content}>
          {text ? <Text>{text}</Text> : children}
        </View>
      </Pressable>
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
