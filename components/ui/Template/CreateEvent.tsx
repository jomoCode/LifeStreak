import { LsButton } from "@/components/ui/atoms/LsButton";
import { useGeneralStyles } from "@/hooks/styles/useStyles";
import { useColors } from "@/hooks/useColors";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import { Image, StyleSheet, Text, TextInput, View } from "react-native";

type FieldType = "text" | "number" | "date" | "time" | "select";


type CreateEventProps = {
  title: string;
  placeholder?: string;
  value: string | number | Date;
  fieldType: FieldType;
  options?: { label: string; value: string | number }[]; // used if select
  min?: number; // for number picker
  max?: number; // for number picker
  onChange: (value: string | number | Date) => void;
  onNext?: () => void;
  onPrev?: () => void;
};

export default function CreateEvent({
  title,
  placeholder,
  value,
  fieldType,
  options,
  min,
  max,
  onChange,
  onNext,
  onPrev,
}: CreateEventProps) {
  const styles = useGeneralStyles();
  const colors = useColors();

  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const handleIncrement = () => {
    if (typeof value === "number") {
      if (max == null || value < max) onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (typeof value === "number") {
      if (min == null || value > min) onChange(value - 1);
    }
  };

  const renderField = () => {
    switch (fieldType) {
      case "text":
        return (
          <TextInput
            placeholder={placeholder}
            placeholderTextColor="#999"
            style={localStyles.input}
            value={String(value ?? "")}
            onChangeText={onChange}
          />
        );

      case "number":
        return min != null || max != null ? (
          // number picker
          <View style={localStyles.numberPicker}>
            <LsButton onPress={handleDecrement}>
              <Text style={{ fontSize: 20, color: colors.text }}>−</Text>
            </LsButton>
            <Text style={localStyles.numberValue}>{value}</Text>
            <LsButton onPress={handleIncrement}>
              <Text style={{ fontSize: 20, color: colors.text }}>+</Text>
            </LsButton>
          </View>
        ) : (
          <TextInput
            placeholder={placeholder}
            keyboardType="numeric"
            style={localStyles.input}
            value={String(value ?? "")}
            onChangeText={(text) => onChange(Number(text))}
          />
        );

      case "date":
        return (
          <>
            <TextInput
              value={
                value instanceof Date
                  ? value.toISOString().slice(0, 10)
                  : String(value ?? "")
              }
              style={localStyles.input}
              editable={false}
              onPressIn={() => setShowDatePicker(true)}
            />
            {showDatePicker && (
              <DateTimePicker
                value={value instanceof Date ? value : new Date()}
                mode="date"
                onChange={(_, selected) => {
                  setShowDatePicker(false);
                  if (selected) onChange(selected);
                }}
              />
            )}
          </>
        );

   case "time":
  return (
    <>
      <TextInput
        value={
          value instanceof Date
            ? value.toTimeString().slice(0, 5) // "HH:MM"
            : String(value ?? "")
        }
        style={localStyles.input}
        editable={false}
        onPressIn={() => setShowDatePicker(true)}
      />
      {showDatePicker && (
        <DateTimePicker
          value={value instanceof Date ? value : new Date()}
          mode="time"
          is24Hour={true}
          onChange={(_, selected) => {
            setShowDatePicker(false);
            if (selected) onChange(selected);
          }}
        />
      )}
    </>
  );


      case "select":
        return (
          <View style={localStyles.selectBox}>
            {options?.map((opt) => (
              <LsButton key={String(opt.value)} onPress={() => onChange(opt.value)}>
                <Text style={{ color: colors.text }}>{opt.label}</Text>
              </LsButton>
            ))}
          </View>
        );

      default:
        return null;
    }
  };

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
          {renderField()}
        </View>

        <View style={{ height: "50%", justifyContent: "center" }}>
          <View>
            {onPrev && (
              <LsButton onPress={onPrev}>
                <MaterialIcons name="arrow-back" size={35} color={colors.text} />
              </LsButton>
            )}
            {onNext && (
              <LsButton onPress={onNext}>
                <MaterialIcons name="arrow-forward" size={35} color={colors.text} />
              </LsButton>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  logoContainer: {
    paddingVertical: 10,
    height: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
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
    fontWeight: "bold",
    color: "orange",
    textAlign: "center",
  },
  input: {
    width: 290,
    backgroundColor: "#EDEDED",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 8,
    fontSize: 20,
  },
  selectBox: {
    width: 290,
    paddingVertical: 10,
    alignItems: "center",
    gap: 10,
  },
  numberPicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 200,
    marginVertical: 8,
  },
  numberValue: {
    fontSize: 20,
    textAlign: "center",
    width: 60,
  },
});
