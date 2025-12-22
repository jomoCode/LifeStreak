import { useTextStyles } from "@/hooks/styles/useStyles";
import { ReactNode } from "react";
import { Text } from "react-native";

type TitleProps = {
  children: ReactNode;
  variant: "lg" | "med" | "sm";
  color?: string;
  align?: "center" | "left" | "right";
};

const Title = ({ children, variant, color, align }: TitleProps) => {
  const style = useTextStyles();
  const textSize = variant === "lg" ? 30 : variant === "med" ? 20 : 16;
  return (
    <Text
      style={[
        style.lsTitle,
        { fontSize: textSize },
        color ? { color: color } : {},
      ]}
    >
      {children}
    </Text>
  );
};

const LsText = ({ children, variant, color, align }: TitleProps) => {
  const style = useTextStyles();
  const textSize = variant === "lg" ? 25 : variant === "med" ? 18 : 14;

  return (
    <Text
      style={[
        style.lsText,
        { fontSize: textSize },
        color ? { color: color } : null,
        align ? { textAlign: align } : null,
      ]}
    >
      {children}
    </Text>
  );
};

export { LsText, Title };
