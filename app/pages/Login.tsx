import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import {
  ActivityIndicator,
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
import {RegisterScreenNavigationProp} from "../types/types"
import PasswordInput from "../components/PasswordInput";
import PageStyles from "../styles/PageStyles";
import { validateEmail } from "../utils/ValidateEmail";

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
    <View style={PageStyles.container}>
      <Text style={PageStyles.title}>Login Your Account</Text>
      <View style={PageStyles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={formData.email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
          style={PageStyles.input}
        />
        {errors.email && (
          <Text style={PageStyles.fieldError}>{errors.email}</Text>
        )}
      </View>

      <View style={PageStyles.inputContainer}>
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
      {reduxError && <Text style={PageStyles.errorMessage}>{reduxError}</Text>}
      <TouchableOpacity
        onPress={handleLogin}
        style={[PageStyles.button, loading && PageStyles.buttonDisabled]}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={PageStyles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <View style={PageStyles.footer}>
        <Text style={PageStyles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={PageStyles.footerLink}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Login;
