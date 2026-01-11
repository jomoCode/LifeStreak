import { useGeneralStyles } from "@/hooks/styles/useStyles";
import { ReactNode } from "react";
import { TouchableOpacity, View } from "react-native";

type LsGoalContainerProps = {
  children: ReactNode;
  onPress: () => void;
};

const LsGoalContainer = ({ children, onPress }: LsGoalContainerProps) => {
  const styles = useGeneralStyles();
  return (
    <TouchableOpacity
      style={styles.LsGoalContaninerContainer}
      onPress={onPress}
    >
      <View style={styles.LsGoalContaninerMain}>{children}</View>
    </TouchableOpacity>
  );
};

export { LsGoalContainer };
