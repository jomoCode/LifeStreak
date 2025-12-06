import { useActionButtonStyles } from "@/hooks/styles/useStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, View } from "react-native";

type ActionButtonTypes ={
  handleSubmit: () => void;
} 

export const ActionButton = ({
  handleSubmit,
}:ActionButtonTypes ) => {
  const styles = useActionButtonStyles();
  return (
    <View style={styles.modalButtonContainer}>
      <Pressable
        style={styles.modalButton}
        onPress={handleSubmit}
        accessibilityRole="button"
      >
        <MaterialCommunityIcons name="plus" size={40} color="white" />
      </Pressable>
    </View>
  );
};
