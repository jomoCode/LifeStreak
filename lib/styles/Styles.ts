import { Colors } from "@/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

type Theme = "light" | "dark";
const { width, height } = Dimensions.get("window");

export const Styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[theme].background,
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
      color: Colors[theme].buttonTomato,
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
      color: Colors[theme].text,
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
      backgroundColor: Colors[theme].tabIconDefault,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      width: "80%",
      marginBottom: 20,
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      borderRadius: 20,
      backgroundColor: Colors[theme].buttonTomato,
    },
    buttonText: {
      color: Colors[theme].text,
      fontWeight: "bold",
      marginRight: 5,
    },
    previousButton: {
      backgroundColor: Colors[theme].buttonTomato,
      width: 60,
    },
    nextButton: {
      width: 200,
      justifyContent: "center",
    },
  });

export const buttonStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      width: 120,
      height: 60,
      borderWidth: 3,
      borderColor: Colors[theme].border,
      backgroundColor: Colors[theme].buttonTomato,
    },
    content: { width: "100%", justifyContent: "center", alignItems: "center" },
    text: {
      color: Colors[theme].text,
      textAlign: "center",
      fontFamily: "Bangers-Regular",
      fontSize: 25,
    },
  });

export const textStyles = (theme: Theme) =>
  StyleSheet.create({
    buttonText: {
      color: Colors[theme].text,
      textAlign: "center",
      fontFamily: "Bangers-Regular",
      fontSize: 25,
    },
  });
