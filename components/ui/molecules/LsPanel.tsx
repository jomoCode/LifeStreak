import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { LsText } from "../atoms/Title";

type CardAppearanceEnum =
  | {
      readonly icon: "close";
      readonly backgroundColor: "#ff4d4f";
    }
  | {
      readonly icon: "check";
      readonly backgroundColor: "#ffd700";
    }
  | {
      readonly icon: "dots-horizontal";
      readonly backgroundColor: "#4caf50";
    };
type LsPanelProps = {
  onPanelPress: () => void;
  cardSize: number;
  cardMargin: number;
  cardAppearance: CardAppearanceEnum;
  text: string;
  status: string;
};

const LsPanel = ({
  onPanelPress,
  cardSize,
  cardMargin,
  cardAppearance,
  text,
  status,
}: LsPanelProps) => {
  return (
    <TouchableOpacity
      style={{
        width: cardSize,
        height: cardSize,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "black",
        margin: cardMargin,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        overflow: "hidden",
      }}
      onPress={onPanelPress}
    >
      {/* Faded background icon */}
      <MaterialCommunityIcons
        name={cardAppearance.icon}
        size={cardSize * 0.8}
        color={`${cardAppearance.backgroundColor}33`}
        style={{
          position: "absolute",
          top: "10%",
          left: "10%",
          zIndex: 0,
        }}
      />

      {/* Card text */}
      <View style={{ zIndex: 1, alignItems: "center" }}>
        <LsText variant="sm" color="black" align="center">
          {text}
        </LsText>
        <LsText variant="sm" color="black" align="center">
          {status}
        </LsText>
      </View>
    </TouchableOpacity>
  );
};

export { LsPanel };
