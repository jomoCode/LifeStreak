import { CreateEventLayoutHeader } from "@/components/ui/atoms/CreateEventLayoutHeader";
import { useGeneralStyles } from "@/hooks/styles/useStyles";
import { Stack } from "expo-router";
import { View } from "react-native";

const Layout = () => {
  const styles = useGeneralStyles();
  return (
    <>
      <CreateEventLayoutHeader />
      <View style={styles.createEventLayoutContainer}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </>
  );
};
export default Layout;
