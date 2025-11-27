import { onBoardingStyles } from "@/lib/styles/onboarding_styles";
import { Router, useRouter } from "expo-router";
import * as React from "react";
import {
  Button,
  FlatList,
  Image,
  Text,
  useColorScheme,
  View,
  type ViewToken,
} from "react-native";

type ViewAbleItems = { viewableItems: ViewToken[] };
const updateOnboardingStatus = () => {
  try {
    localStorage.setItem("onBoarding", JSON.stringify({ status: true }));
  } catch (error) {
    console.error(`Error updating onboarding status: ${error}`);
  }
};

export const onBoardingScreenPages = [
  {
    id: "1",
    title: "Achieve your every goal",
    subTitle: "Specify your goal",
    image: require("../../../assets/images/la.png"),
  },
  {
    id: "2",
    title: "Create a streak plan",
    subTitle: " Life streak- How much time can you devote to your goals",
    image: require("../../../assets/images/la.png"),
  },
  {
    id: "3",
    title: "Track your adherance",
    subTitle:
      "Effortlessly track your efforts & Stay Motivated with visual Progress Reports",
    image: require("../../../assets/images/la.png"),
  },
];

const getTitleKey = (id: string) => {
  switch (id) {
    case "1":
      return "";
    case "2":
      return "";
    case "3":
      return "";
    default:
      return "";
  }
};

const getSubTitleKey = (id: string) => {
  switch (id) {
    case "1":
      return "";
    case "2":
      return "";
    case "3":
      return "";
    default:
      return "";
  }
};

const handleSkip = (router: Router) => {
  updateOnboardingStatus();
  router.replace("/");
};

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const theme = useColorScheme() === "dark" ? "dark" : "light";
  const styles = onBoardingStyles(theme);

  const flatListRef = React.useRef<FlatList<
    (typeof onBoardingScreenPages)[number]
  > | null>(null);

  const router = useRouter();

  const handleNext = () => {
    if (currentIndex < onBoardingScreenPages.length - 1) {
      try {
        flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      } catch (error) {
        console.error(`Error scrolling to next item: ${error}`);
      }
    } else {
      updateOnboardingStatus();
      router.replace("/");
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
                source={require("../../../assets/images/la.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Button
                title="click"
                onPress={() => {
                  handleSkip(router);
                }}
              />
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
            <Text style={styles.title}>{getTitleKey(item.id)}</Text>
            <Text style={styles.subTitle}>{getSubTitleKey(item.id)}</Text>
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
        <Button
          onPress={() => {
            if (currentIndex >= 1) {
              try {
                flatListRef.current?.scrollToIndex({ index: currentIndex - 1 });
              } catch (error) {
                console.error(`Error scrolling to previous item: ${error}`);
              }
            }
          }}
          title="left"
        />

        <Button onPress={handleNext} title="right" />
      </View>
    </View>
  );
};

export default OnboardingScreen;
