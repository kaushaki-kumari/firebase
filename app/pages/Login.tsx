import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FirebaseError } from "firebase/app";
import { AppDispatch, RootState } from "../store";
import { setErrorMessage } from "../reducer/userSlice";
import { auth } from "../config/firbase.config";
import PasswordInput from "../components/PasswordInput";

type RootStackParamList = {
  Profile: undefined;
  Login: undefined;
  Register: undefined;
};

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const reduxError = useSelector((state: RootState) => state.user.errorMessage);

  const clearErrors = () => {
    setErrors({});
    dispatch(setErrorMessage(null));
  };

  const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const handleLogin = async () => {
    clearErrors();
    const newErrors: typeof errors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigation.navigate("Profile");
    } catch (error) {
      const firebaseError = error as FirebaseError;
      console.log("Firebase error code:", firebaseError.code);
      if (firebaseError.code === "auth/invalid-credential") {
        dispatch(
          setErrorMessage(
            "Invalid credentials, please check your email or password"
          )
        );
      } else if (firebaseError.code === "auth/network-request-failed") {
        dispatch(
          setErrorMessage("Network error. Please check your connection.")
        );
      } else {
        console.log("Unhandled error code:", firebaseError.code);
        dispatch(setErrorMessage("An unexpected error occurred."));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (text: string) => {
    setFormData({ ...formData, email: text });
    clearErrors();

    if (text && !validateEmail(text)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email format",
      }));
    } else {
      clearErrors();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Your Account</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={formData.email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        {errors.email && <Text style={styles.fieldError}>{errors.email}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <PasswordInput
          placeholder="Password"
          value={formData.password}
          onChangeText={(text) => {
            setFormData({ ...formData, password: text });
            clearErrors();
          }}
          errorMessage={errors.password}
        />
      </View>
      {reduxError && <Text style={styles.errorMessage}>{reduxError}</Text>}
      <TouchableOpacity
        onPress={handleLogin}
        style={[styles.button, loading && styles.buttonDisabled]}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.loginLink}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f9fafb",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2d3748",
    marginBottom: 10,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    marginBottom: 13,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    color: "#4a5568",
    fontSize: 16,
    width: "100%",
  },
  fieldError: {
    color: "#e53e3e",
    fontSize: 12,
    marginTop: 4,
    paddingHorizontal: 2,
  },
  button: {
    backgroundColor: "#3182ce",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: "center",
    marginTop: 15,
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  buttonDisabled: {
    backgroundColor: "#94a3b8",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  errorMessage: {
    color: "#e53e3e",
    marginBottom: 15,
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  footer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    color: "#4a5568",
  },
  loginLink: {
    color: "#3182ce",
    fontWeight: "600",
  },
});

export default Login;
