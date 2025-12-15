import { ReactNode } from "react";
import { useGeneralStyles } from "@/hooks/styles/useStyles";
import { useColors } from "@/hooks/useColors";
import { View } from "react-native";
import { Modal } from "react-native-paper";

type LsAlertContainerProps = {
  children: ReactNode;
  alertType: "error" | "success" | "warning";
  visible: boolean;
  onDismiss: () => void;
};

export const LsAlertContainer = ({
  children,
  alertType,
  visible,
  onDismiss,
}: LsAlertContainerProps) => {
  const colors = useColors();
  const { LsGoalContaninerContainer, LsGoalContaninerMain } =
    useGeneralStyles();

  const alertStyles = {
    error: colors.danger,
    warning: colors.warning,
    success: colors.success,
  };

  return (
    <Modal
      visible={visible}
      dismissableBackButton
      onDismiss={onDismiss}
      style={{ justifyContent: "center", alignItems: "center" }}
    >
      <View
        style={{
          ...LsGoalContaninerContainer,
          height: 300,
          width: 300,
        }}
      >
        <View
          style={{
            ...LsGoalContaninerMain,
            flexDirection: "column",
            borderColor: alertStyles[alertType],
          }}
        >
          {children}
        </View>
      </View>
    </Modal>
  );
};


