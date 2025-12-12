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
    /*
**
**
  CREATE EVENT LAYOUT STYLES
  CREATE EVENT LAYOUT STYLES
 **
 **
 */

    createEventLayoutContainer: { flex: 1, padding: 30 },
    /*
**
**
  CREATE EVENT HEADER STYLES
  CREATE EVENT HEADER STYLES
 **
 **
 */
    createEventHeaderContainer: {
      flexDirection: "row",
      height: "20%",
      width: "100%",
      backgroundColor: Colors.background,
      justifyContent: "center",
      alignItems: "center",
    },
    createEventHeaderInnerContainer: {
      flexDirection: "row",
      alignItems: "flex-end",
    },
    createEventHeaderImage: { height: 60, width: 50, alignSelf: "center" },
    createEventHeaderText: {
      color: Colors.text,
      fontSize: 20,
      fontStyle: "italic",
      fontWeight: "bold",
    },
    createEventHeaderInnerText: { fontSize: 25 },

    /*
**
  CREATE EVENT GENERAL STYLES
  CREATE EVENT GENERAL STYLES
 **
 */
    crePageContainer: {
      flex: 1,
      flexDirection: "column",
      maxHeight: "100%",
      justifyContent: "space-between",
      paddingBottom: 20,
    },
    crePageTitle: { fontSize: 18, textAlign: "center" },
    crePageLabel: {
      fontWeight: "bold",
      fontSize: 20,
      marginBottom: 5,
      color: Colors.background,
    },
    crePageInput: {
      fontSize: 18,
      backgroundColor: Colors.tint,
      borderRadius: 8,
      padding: 10,
    },
    crePageButtonIcon: {
      color: Colors.text,
    },
    crePageButtonContainer: {
      flexDirection: "column",
      justifyContent: "flex-end",
      alignItems: "flex-end",
      width: "100%",
    },
    /*
**
  LsGoal Container STYLES
  LsGoal Container STYLES
 **
 */
    LsGoalContaninerContainer: {
      width: "100%",
      height: 70,
      backgroundColor: Colors.button,
      padding: 2,
      borderRadius: 10,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 1, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 4,
    },
    LsGoalContaninerMain: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      backgroundColor: Colors.button,
      borderWidth: 2,
      borderColor: "yellow",
      borderRadius: 10,
    },
  });
};

export const useOnboardingStyles = () => {
  const Colors = useColors();

  return StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: 20,
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
      backgroundColor: Colors.button,
    },
    short: { width: 120 },
    long: { width: "100%" },
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
      backgroundColor: color.button,
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
  const colors = useColors();

  return StyleSheet.create({
    lsTitle: {
      color: colors.text,
      fontWeight: "condensedBold",
      fontFamily: "Bangers-Regular",
    },
  });
};

export const useScreenStyles = () => {
  const Colors = useColors();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
      padding: 20,
    },
  });
};
