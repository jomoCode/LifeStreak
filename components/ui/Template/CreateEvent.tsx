import { LsButton } from "@/components/ui/atoms/LsButton";
import { StreakFormValues, useStreakForm } from "@/context/useCreateStreakForm";
import { useGeneralStyles } from "@/hooks/styles/useStyles";
import { useColors } from "@/hooks/useColors";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TextInput, View } from "react-native";

type CreateEventProps = {
  title: string;
  placeholder: string;
  field: keyof StreakFormValues;
  prevUrl?: string;
};

const CreateEvent = ({
  title,
  placeholder,
  field,
  prevUrl,
}: CreateEventProps) => {
  const styles = useGeneralStyles();
  const colors = useColors();
  const lsForm = useStreakForm();
  const router = useRouter();

  const form = lsForm.form;
  const handlers = lsForm.setters;
  const errors = lsForm.errors;
  const submit = lsForm.submit;

  const formHandler = handlers[field];
  const value = form[field];

  // Safely convert value to string
  const displayValue = value != null ? String(value) : "";

  return (
    <View style={styles.container}>
      <View style={localStyles.logoContainer}>
        <Image
          source={require("../../../assets/images/fire.png")}
          style={styles.logoLarge}
          resizeMode="contain"
        />
      </View>

      <View style={localStyles.formContainer}>
        <View style={{ height: "50%", justifyContent: "flex-end" }}>
          <Text style={localStyles.title}>{title}</Text>

          <TextInput
            value={displayValue}
            onChangeText={formHandler}
            placeholder={placeholder}
            style={localStyles.input}
            placeholderTextColor="#999"
          />

          {errors[field] && (
            <Text style={localStyles.errorText}>{errors[field]}</Text>
          )}
        </View>
        {/* <LsButton
          onPress={() => submit((values) => console.log("submit ok", values))}
        >
         <MaterialCommunityIcons name="arrow-right-thick" size={30}/>
          <Text>Next</Text>
        </LsButton> */}

        <View style={{ height: "50%", justifyContent: "center" }}>
          <View style={{}}>
            {prevUrl && (
              <LsButton
                onPress={() => {
                  router.back();
                }}
              >
                <MaterialIcons
                  name="arrow-back"
                  size={35}
                  color={colors.text}
                />
              </LsButton>
            )}
            <LsButton onPress={() => ""}>
              <MaterialIcons
                name="arrow-forward"
                size={35}
                color={colors.text}
              />
            </LsButton>
          </View>
        </View>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  logoContainer: {
    paddingVertical: 10,
    height: "20%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
    height: "70%",
    borderRadius: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight:'bold',
    color: "orange",
    textAlign: "center",
  },
  input: {
    width: 290,
    backgroundColor: "#EDEDED",
    borderWidth: 0,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 8,
    fontSize: 20,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
  },
});

export default CreateEvent;
