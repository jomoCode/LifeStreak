import { View } from "react-native";
import { LsAlertContainer } from "../atoms/AlertModalContainer";
import { LsButton } from "../atoms/LsButton";
import { LsText, Title } from "../atoms/Title";
import { ReactNode } from "react";

type LsGoalProps = {
  title: string;
  scheduled: string;
  message: ReactNode;
  open: boolean;
  dismissModal: () => void;
  ButtonText: string;
};

export const LsGoalModal = ({
  title,
  scheduled,
  message,
  open,
  dismissModal,
  ButtonText,
}: LsGoalProps) => {
  //   const colors = useColors();

  return (
    <LsAlertContainer
      alertType={"success"}
      visible={open}
      onDismiss={dismissModal}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "space-evenly",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Title variant="med" color="black">
          {title}
        </Title>
        <LsText variant="sm" color="black">
          Scheduled:{scheduled}
        </LsText>
        <LsText variant="sm" color="black">
          {message}
        </LsText>

        <LsButton onPress={dismissModal} length="short" text={ButtonText} />
      </View>
    </LsAlertContainer>
  );
};
