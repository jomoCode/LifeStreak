import { LsButton } from "@/components/ui/atoms/LsButton";
import { StreakFormValues, useStreakForm } from "@/context/useCreateStreakForm";
import { useGeneralStyles } from "@/hooks/styles/useStyles";
import React from "react";
import { Image, Text, TextInput, View, StyleSheet } from "react-native";

type CreateEventProps = {
  title: string;
  placeholder: string;
  field: keyof StreakFormValues;
};

const CreateEvent = ({ title, placeholder, field }: CreateEventProps) => {
  const styles = useGeneralStyles();
  const lsForm = useStreakForm();

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

        <LsButton
          onPress={() => submit((values) => console.log("submit ok", values))}
        >
          Next
        </LsButton>
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
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
  },
});

export default CreateEvent;