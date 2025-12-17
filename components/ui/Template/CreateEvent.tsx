import { LsButton } from "@/components/ui/atoms/LsButton";
import { CreateStreakFormProps } from "@/context/CreateStreakForm_";
import { useGeneralStyles } from "@/hooks/styles/useStyles";
import { EventType } from "@/lib/CRUDE_sqlite";
import { MaterialIcons } from "@expo/vector-icons";
import React, { ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { Text, View } from "react-native";

type Field = EventType;
type CreateEventProps = {
  field: Field;
  moveToNextStep: () => void;
  title: string;
  children: ReactNode;
};

const CreateEvent = ({
  field,
  moveToNextStep,
  title,
  children,
}: CreateEventProps) => {
  const styles = useGeneralStyles();
  return (
    <View style={styles.crePageContainer}>
      <View style={{ minHeight: 100 }}>
        <Text style={styles.crePageTitle}>{title}</Text>
        <View style={{ flex: 1, marginTop:20, }}>{children}</View>
      </View>

      <View style={styles.crePageButtonContainer}>
        <LsButton
          onPress={() => {
            moveToNextStep();
          }}
        >
          <MaterialIcons
            name="arrow-forward"
            size={35}
            style={styles.crePageButtonIcon}
          />
        </LsButton>
      </View>
    </View>
  );
};

export { CreateEvent };
