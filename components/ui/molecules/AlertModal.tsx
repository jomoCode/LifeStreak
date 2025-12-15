import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LsAlertContainer } from "../atoms/AlertModalContainer";
import { LsText, Title } from "../atoms/Title";
import { View } from "react-native";
import { LsButton } from "../atoms/LsButton";
import { useColors } from "@/hooks/useColors";

type LsAlertProps = {
  streakName: string;
  alertType: "error" | "success" | "warning";
  message: string;
  open: boolean;
  dismissModal: () => void;
  handleLeftButton: () => void;
  leftButtonText: string;
  handleRightButton?: () => void;
  rightButtonText?: string;
};

export const LsAlert = ({
  streakName,
  alertType,
  message,
  open,
  dismissModal,
  handleLeftButton,
  leftButtonText,
  handleRightButton,
  rightButtonText,
}: LsAlertProps) => {
  const colors = useColors();

  const alertStyles = {
    error: colors.danger,
    warning: colors.warning,
    success: colors.success,
  };

  return (
    <LsAlertContainer
      alertType={alertType}
      visible={open}
      onDismiss={dismissModal}
    >
      <Title variant="med" color={alertStyles[alertType]}>
        {streakName}{" "}
        <MaterialCommunityIcons
          name="fire"
          size={25}
          color={alertStyles[alertType]}
        />
      </Title>

      <LsText variant="med">{message}</LsText>

      <View style={{ flexDirection: "row", gap: 4, paddingBottom: 5 }}>
        <LsButton
          length="short"
          onPress={() => {
            handleLeftButton();
            dismissModal();
          }}
          borderColor={alertStyles[alertType]}
        >
          <Title variant="sm">{leftButtonText}</Title>
        </LsButton>

        {rightButtonText && handleRightButton && (
          <LsButton
            length="short"
            onPress={() => {
              handleRightButton();
              dismissModal();
            }}
          >
            <Title variant="sm">{rightButtonText}</Title>
          </LsButton>
        )}
      </View>
    </LsAlertContainer>
  );
};
