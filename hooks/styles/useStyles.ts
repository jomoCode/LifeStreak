import { useColors } from "@/hooks/useColors";
import { Dimensions, StyleSheet } from "react-native";

type Theme = "light" | "dark";
const { width, height } = Dimensions.get("window");

export const useGeneralStyles = () => {
  const Colors = useColors();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
      justifyContent: "center",
      alignItems: "center",
    },
    item: {
      width,
      height,
      alignItems: "center",
      padding: 20,
    },
    headerContainer: {
      flexDirection: "row",
      width: "100%",
      height: "auto",
      justifyContent: "space-between",
    },
    logo: {
      width: 100,
      height: 40,
      marginBottom: 20,
    },
    logoLarge: {
      width: 100,
      height: 100,
    },
    skipButton: {
      backgroundColor: "#DDEFF0",
      height: 40,
      width: 80,
      justifyContent: "center",
    },
    skipButtonText: {
      color: Colors.buttonTomato,
    },
    mainImage: {
      flex: 0.7,
      width: "100%",
      height: "100%",
      marginTop: 40,
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
      marginTop: 20,
    },
    subTitle: {
      fontSize: 16,
      textAlign: "center",
      color: Colors.text,
      marginTop: 10,
      width: "90%",
    },
    dotsContainer: {
      flexDirection: "row",
      marginTop: 40,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: "lightgray",
      marginHorizontal: 5,
    },
    activeDot: {
      backgroundColor: Colors.tabIconDefault,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "80%",
      marginBottom: 20,
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      borderRadius: 20,
      backgroundColor: Colors.buttonTomato,
    },
    buttonText: {
      color: Colors.text,
      fontWeight: "bold",
      marginRight: 5,
    },
    previousButton: {
      backgroundColor: Colors.buttonTomato,
      width: 60,
    },
    nextButton: {
      width: 200,
      justifyContent: "center",
    },
  });
};

export const useOnboardingStyles = () => {
  const Colors = useColors();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
      justifyContent: "center",
      alignItems: "center",
    },
    item: {
      width,
      height,
      alignItems: "center",
      padding: 20,
    },
    headerContainer: {
      flexDirection: "row",
      width: "100%",
      height: "auto",
      justifyContent: "space-between",
    },
    logo: {
      width: 100,
      height: 40,
      marginBottom: 20,
    },
    skipButton: {
      backgroundColor: "#DDEFF0",
      height: 40,
      width: 80,
      justifyContent: "center",
    },
    skipButtonText: {
      color: Colors.buttonTomato,
    },
    mainImage: {
      flex: 0.7,
      width: "100%",
      height: "100%",
      marginTop: 40,
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
      marginTop: 20,
    },
    subTitle: {
      fontSize: 16,
      textAlign: "center",
      color: Colors.text,
      marginTop: 10,
      width: "90%",
    },
    dotsContainer: {
      flexDirection: "row",
      marginTop: 40,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: "lightgray",
      marginHorizontal: 5,
    },
    activeDot: {
      backgroundColor: Colors.tabIconDefault,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "80%",
      marginBottom: 20,
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      borderRadius: 20,
      backgroundColor: Colors.buttonTomato,
    },
    buttonText: {
      color: Colors.text,
      fontWeight: "bold",
      marginRight: 5,
    },
    previousButton: {
      backgroundColor: Colors.buttonTomato,
      width: 60,
    },
    nextButton: {
      width: 200,
      justifyContent: "center",
    },
  });
};
export const useButtonStyles = () => {
  const Colors = useColors();
  return StyleSheet.create({
    container: {
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      width: 120,
      height: 60,
      borderWidth: 3,
      borderColor: Colors.border,
      backgroundColor: Colors.buttonTomato,
    },
    content: { width: "100%", justifyContent: "center", alignItems: "center" },
    text: {
      color: Colors.text,
      textAlign: "center",
      fontFamily: "Bangers-Regular",
      fontSize: 25,
      width: "100%",
    },
  });
};

export const useActionButtonStyles = () => {
  const color = useColors();
  return StyleSheet.create({
    modalButtonContainer: {
      width: "100%",
      justifyContent: "center",
      alignItems: "flex-end",
      padding: 20,
    },
    modalButton: {
      backgroundColor: color.background,
      justifyContent: "center",
      alignItems: "center",
      width: 60,
      height: 60,
      borderRadius: 30,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 4,
    },
  });
};

export const useTextStyles = () => {
  const Colors = useColors();
  return StyleSheet.create({});
};
