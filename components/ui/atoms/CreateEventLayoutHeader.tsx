import { useGeneralStyles } from "@/hooks/styles/useStyles";
import React from "react";
import { Image, Text, View } from "react-native";

export const CreateEventLayoutHeader = () => {
  const styles = useGeneralStyles();
  return (
    <View style={styles.createEventHeaderContainer}>
      <View style={styles.createEventHeaderInnerContainer}>
        <Image
          source={require("../../../assets/images/fire.png")}
          width={10}
          height={10}
          style={styles.createEventHeaderImage}
        />
        <Text style={styles.createEventHeaderText}>
          <Text style={styles.createEventHeaderInnerText}>L</Text>ife Streak
        </Text>
      </View>
    </View>
  );
};
