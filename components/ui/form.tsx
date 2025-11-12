import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { ReactNode, useState } from "react";
import {
  Controller,
  DefaultValues,
  FieldErrors,
  FieldValues,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import {
  Button,
  KeyboardType,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { ObjectSchema } from "yup";

//===================================TYPES==========================================
//===================================TYPES==========================================

type InputProps = {
  name: string;
  placeholder: string;
  label?: string;
  required?: boolean;
  type?: "auth" | "default" | "password";
  labelStyles?: TextStyle;
  keyboardType?: KeyboardType;
};

type FormProps<T extends FieldValues> = {
  children: ReactNode;
  onSubmit: (data: T) => void;
  defaultValues: DefaultValues<T>;
  validationSchema: ObjectSchema<any>;
  buttonText?: string;
  title?: string;
  titleStyles?: TextStyle;
  buttonStyles?: ViewStyle;
  buttonTextStyles?: TextStyle;
};

//===================================VARIANTS==========================================
//===================================VARIANTS==========================================
const inputStyleVariants = {
  auth: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#111827",
  },
  default: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
  },
  password: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#111827",
    paddingRight: 48,
  },
};

//===================================COMPONENTS==========================================
//===================================COMPONENTS==========================================

const Form = <T extends FieldValues>({
  onSubmit,
  validationSchema,
  defaultValues,
  buttonText = "submit",
  children,
  title,
  titleStyles,
  buttonStyles,
  buttonTextStyles,
}: FormProps<T>) => {
  const methods = useForm<T>({
    defaultValues,
    resolver: yupResolver(
      validationSchema
    ) as import("react-hook-form").Resolver<T, any, T>,
  });

  return (
    <FormProvider {...methods}>
      <View style={{ padding: 16 }}>
        {title && (
          <Text
            style={[
              {
                fontSize: 24,
                fontWeight: 600,
                textAlign: "center",
                marginVertical: 5,
              },
              titleStyles,
            ]}
          >
            {title}
          </Text>
        )}
        {children}
        <Button title={buttonText} onPress={methods.handleSubmit(onSubmit)} />
      </View>
    </FormProvider>
  );
};

const FormField = ({
  name,
  required,
  label,
  placeholder,
  type = "default",
  labelStyles,
  keyboardType,
}: InputProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const fieldError = errors[name as keyof FieldErrors];

  return (
    <View style={{ marginBottom: 12 }}>
      {label && (
        <Text style={[{ marginBottom: 4, opacity: 0.5 }, labelStyles]}>
          {label}
        </Text>
      )}
      <Controller
        control={control}
        rules={{ required }}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={[
              {
                ...inputStyleVariants.default,
              },
              type === "auth" && inputStyleVariants.auth,
            ]}
            keyboardType={keyboardType}
          />
        )}
      />
      {fieldError && (
        <Text style={{ color: "red", marginTop: 4 }}>
          {fieldError.message?.toString()}
        </Text>
      )}
    </View>
  );
};

const SecureField = ({
  name,
  label,
  placeholder,
  labelStyles,
  keyboardType,
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const fieldError = errors[name as keyof FieldErrors];

  return (
    <View style={{ marginBottom: 12 }}>
      {label && (
        <Text style={[{ marginBottom: 4, opacity: 0.5 }, labelStyles]}>
          {label}
        </Text>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <View
            style={{
              position: "relative",
            }}
          >
            <TextInput
              style={[inputStyleVariants.password]}
              placeholder={placeholder}
              value={value}
              onChangeText={onChange}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              keyboardType={keyboardType}
            />
            <TouchableOpacity
              style={{
                position: "absolute",
                right: 12,
                top: 14,
                width: 20,
                height: 20,
              }}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#6b7280"
              />
            </TouchableOpacity>
          </View>
        )}
      />
      {fieldError && (
        <Text style={{ color: "red", marginTop: 4 }}>
          {fieldError.message?.toString()}
        </Text>
      )}
    </View>
  );
};

export { Form, FormField, SecureField };
