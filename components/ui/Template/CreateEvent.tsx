import { LsButton } from "@/components/ui/atoms/LsButton";
import { StreakFormValues, useStreakForm } from "@/context/useCreateStreakForm";
import { useGeneralStyles } from "@/hooks/styles/useStyles";
import React from "react";
import { Image, Text, TextInput, View } from "react-native";

type FormValues = {
  goalTitle: string;
};

type createEventProps = {
  title: string;
  placeholder: string;
  field: keyof StreakFormValues;
};

const CreateEvent = ({ title, placeholder, field }: createEventProps) => {
  const styles = useGeneralStyles();
  const lsForm = useStreakForm();

  const form = lsForm.form;
  const handlers = lsForm.setters;
  const errors = lsForm.errors;
  const submit = lsForm.submit;
  const formhandler = handlers[field];
  const value = form[field];
  return (
    <View style={styles.container}>
      <View
        style={{
          paddingVertical: 10,
          height: "20%",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <Image
          source={require("../../../assets/images/fire.png")}
          style={styles.logoLarge}
          resizeMode="contain"
        />
      </View>

      <View
        style={{
          width: "100%",
          height: "70%",
          borderRadius: 150,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          padding: 20,
        }}
      >
        <Text>{title}</Text>
        <TextInput
          value={String(value)}
          onChangeText={formhandler}
          placeholder={placeholder}
        />
        {errors[field] ? (
          <Text style={{ color: "red" }}>{errors[field]}</Text>
        ) : null}

        <LsButton
          onPress={() => submit((values) => console.log("submit ok", values))}
        >
          next
        </LsButton>
      </View>
    </View>
  );
};

export default CreateEvent;
