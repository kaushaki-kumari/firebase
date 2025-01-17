import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
        style={styles.input}
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
      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
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
  input: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    color: "#4a5568",
    fontSize: 16,
   
    width: "100%",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 15,
  },
  errorMessage: {
    color: "#e53e3e",
    marginBottom: 10,
    textAlign: "left",
    fontSize: 12,
    marginTop: 4,
  },
});

export default PasswordInput;
