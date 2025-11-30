import { useButtonStyles, useOnboardingStyles } from "@/hooks/styles/useStyles";
import { useColors } from "@/hooks/useColors";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Router, useRouter } from "expo-router";
import * as React from "react";
import { FlatList, Image, Text, View, type ViewToken } from "react-native";
import { LsButton } from "../atoms/LsButton";

type ViewAbleItems = { viewableItems: ViewToken[] };
const updateOnboardingStatus = async () => {
  try {
    await AsyncStorage.setItem("onBoarding", JSON.stringify({ status: true }));
  } catch (error) {
    console.error(`Error updating onboarding status: ${error}`);
  }
};

export const onBoardingScreenPages = [
  {
    id: "1",
    title: "Dream Bigger",
    subTitle: "Set goals that move you",
    image: require("../../../assets/images/onBoarding_1.png"),
  },
  {
    id: "2",
    title: "Stay Consistent",
    subTitle: "Build a daily rhythm of growth",
    image: require("../../../assets/images/onBoarding_2.png"),
  },
  {
    id: "3",
    title: "See Your Progress",
    subTitle: "Watch your efforts turn into results",
    image: require("../../../assets/images/onBoarding_3.png"),
  },
];

const handleSkip = (router: Router) => {
  updateOnboardingStatus();
  router.replace("/");
};

const OnboardingScreen = () => {
  // Hooks
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const router = useRouter();
  const styles = useOnboardingStyles();
  const buttonStyles = useButtonStyles();
  const colors = useColors();
  const flatListRef = React.useRef<FlatList<
    (typeof onBoardingScreenPages)[number]
  > | null>(null);

  // HELPERS
  const handleNext = () => {
    if (currentIndex < onBoardingScreenPages.length - 1) {
      try {
        flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      } catch (error) {
        console.error(`Error scrolling to next item: ${error}`);
      }
    } else {
      updateOnboardingStatus();
      router.replace("/(tabs)");
    }
  };

  const onViewableItemsChanged = React.useCallback(
    ({ viewableItems }: ViewAbleItems) => {
      const ViewableItem = viewableItems[0].index;
      const ViewableItemsNotEmpty = viewableItems.length > 0;
      const ViewableItemsNotPopulatedWithNull = ViewableItem !== null;

      if (ViewableItemsNotEmpty && ViewableItemsNotPopulatedWithNull) {
        setCurrentIndex(ViewableItem);
      }
    },
    []
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={onBoardingScreenPages}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.headerContainer}>
              {/* Logo */}
              <Image
                source={require("../../../assets/images/life-streak.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <LsButton
                onPress={() => {
                  handleSkip(router);
                }}
              >
                <Text style={buttonStyles.text ?? { color: "white" }}>
                  Skip
                </Text>
              </LsButton>
            </View>
            {/* Main Image */}
            <Image
              style={styles.mainImage}
              source={item.image}
              resizeMode="contain"
            />
            <View style={styles.dotsContainer}>
              {onBoardingScreenPages.map((_, index) => (
                <View
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  key={index}
                  style={[
                    styles.dot,
                    currentIndex === index && styles.activeDot,
                  ]}
                />
              ))}
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subTitle}>{item.subTitle}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
      />

      <View style={styles.buttonContainer}>
        <LsButton
          onPress={() => {
            if (currentIndex >= 1) {
              try {
                flatListRef.current?.scrollToIndex({
                  index: currentIndex - 1,
                });
              } catch (error) {
                console.error(`Error scrolling to previous item: ${error}`);
              }
            }
          }}
        >
          <MaterialIcons name="arrow-back" size={35} color={colors.text} />
        </LsButton>
        <LsButton onPress={handleNext}>
          <MaterialIcons name="arrow-forward" size={35} color={colors.text} />
        </LsButton>
      </View>
    </View>
  );
};

export default OnboardingScreen;
