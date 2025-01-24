import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { loginUser } from "../reducer/userActions";
import { clearErrors } from "../reducer/userSlice";
import { RegisterScreenNavigationProp } from "../types/types";
import PasswordInput from "../components/PasswordInput";
import PageStyles from "../styles/PageStyles";
import { validateEmail } from "../utils/ValidateEmail";
import { FormData } from "../utils/userData";
interface Errors {
  email?: string;
  password?: string;
}
import SocialIcon from "../components/SocialIcon";
import App from "../components/twitter";
import LoginScreen from "../components/FacebookAuth";

function Login() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { loading, errorMessage } = useSelector(
    (state: RootState) => state.user
  );

  const handleClearErrors = () => {
    setErrors({});
    dispatch(clearErrors());
  };

  const handleLogin = async () => {
    handleClearErrors();
    const newErrors: Errors = {};

    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(result)) {
      navigation.navigate("Main");
    }
  };

  const handleEmailChange = (text: string) => {
    setFormData({ ...formData, email: text });
    handleClearErrors();

    if (text && !validateEmail(text)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email format",
      }));
    }
  };

  return (
    <View style={PageStyles.container}>
      <Text style={PageStyles.title}>Login Your Account</Text>
      <View style={PageStyles.inputContainer}>
        <Text style={PageStyles.label}>Email</Text>
        <TextInput
          placeholder="Email"
          value={formData.email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
          style={PageStyles.input}
        />
        {errors.email !== undefined && errors.email !== "" && (
          <Text style={PageStyles.fieldError}>{errors.email}</Text>
        )}
      </View>

      <View style={PageStyles.inputContainer}>
        <Text style={PageStyles.label}>Password</Text>
        <PasswordInput
          placeholder="Password"
          value={formData.password}
          onChangeText={(text) => {
            setFormData({ ...formData, password: text });
            handleClearErrors();
          }}
          errorMessage={
            errors.password !== undefined && errors.password !== ""
              ? errors.password
              : ""
          }
        />
        {errorMessage !== undefined && errorMessage !== "" && (
          <Text style={PageStyles.errorMessage}>{errorMessage}</Text>
        )}
      </View>

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
      <SocialIcon />
      <App />
      <LoginScreen />
    </View>
  );
}

export default Login;
