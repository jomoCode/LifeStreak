import { useTextStyles } from "@/hooks/styles/useStyles";
import { Text } from "react-native";


type TitleProps = {
  children: string;
  variant: "lg" | "med" | "sm";
};

const Title = ({ children, variant }: TitleProps) => {
  const style = useTextStyles();
  const textSize = variant === "lg" ? 30 : variant === "med" ? 20 : 16;
  return (
    <Text style={[style.lsTitle, { fontSize: textSize }]}>{children}</Text>
  );
};

export { Title };
