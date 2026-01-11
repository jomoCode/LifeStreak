import { CreateEventLayoutHeader } from "@/components/ui/atoms/CreateEventLayoutHeader";
import { useGeneralStyles } from "@/hooks/styles/useStyles";
import { Stack } from "expo-router";
import { View } from "react-native";

const Layout = () => {
  const styles = useGeneralStyles();
  return (
    <View style={{flex:1}}>
      <CreateEventLayoutHeader />
      <View style={styles.createEventLayoutContainer}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </View>
  );
};
export default Layout;
