import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PageStyles from "../styles/PageStyles";

interface PasswordInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  errorMessage?: string;
}
const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChangeText,
  placeholder,
  errorMessage,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.passwordContainer}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!isPasswordVisible}
        style={PageStyles.input}
      />
      <TouchableOpacity
        style={styles.eyeIcon}
        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
      >
        <Ionicons
          name={isPasswordVisible ? "eye" : "eye-off"}
          size={20}
          color="#3182ce"
        />
      </TouchableOpacity>
      {errorMessage && <Text style={PageStyles.errorMessage}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  passwordContainer: {
    position: "relative",
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 15,
  },
});

export default PasswordInput;
