import { CreateEventLayoutHeader } from "@/components/ui/atoms/CreateEventLayoutHeader";
import { CreateStreakForm } from "@/context/CreateStreakForm_";
import { useGeneralStyles } from "@/hooks/styles/useStyles";
import { Stack } from "expo-router";
import { View } from "react-native";
const Layout = () => {
  const styles = useGeneralStyles();
  return (
    <CreateStreakForm>
      <CreateEventLayoutHeader />
      <View style={styles.createEventLayoutContainer}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </CreateStreakForm>
  );
};
export default Layout;
