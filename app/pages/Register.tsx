import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  Alert,
  Platform,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store/index";
import { registerUser } from "../reducer/userActions";
import { setErrorMessage } from "../reducer/userSlice";
import { RootState } from "../store";
import SuccessMessageModal from "../components/modal/SuccessMessageModal";
import { useNavigation } from "@react-navigation/native";
import PasswordInput from "../components/PasswordInput";
import { userState } from "../utils/userData";
import PageStyles from "../styles/PageStyles";
import { RegisterScreenNavigationProp } from "../types/types";
import { validateEmail } from "../utils/ValidateEmail";
import SocialIcon from "../components/SocialAuth";

const Register = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const user = useSelector((state: RootState) => state.user);
  const { errorMessage, loading } = user;
  const [form, setForm] = useState<userState>({
    firstName: "",
    lastName: "",
    mobileNo: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: "",
  });
  const [errors, setErrors] = useState<userState>({
    firstName: "",
    lastName: "",
    mobileNo: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: "",
  });
  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      mobileNo: "",
      email: "",
      password: "",
      confirmPassword: "",
      image: "",
    });
    setErrors({
      firstName: "",
      lastName: "",
      mobileNo: "",
      email: "",
      password: "",
      confirmPassword: "",
      image: "",
    });
  };
  const [isSuccessMessageModalVisible, setSuccessMessageModalVisible] =
    useState(false);

  useEffect(() => {
    const resetFormField = navigation.addListener("focus", () => {
      resetForm();
      dispatch(setErrorMessage(null));
    });

    return resetFormField;
  }, [navigation]);

  const validateField = (field: string, value: string) => {
    let error = "";
    const val = value ? value.toString() : "";

    if (field === "firstName") {
      if (!val.trim()) error = "First name is required.";
      else if (val.length < 3)
        error = "First name must be at least 3 characters.";
    }
    if (field === "lastName") {
      if (!val.trim()) error = "Last name is required.";
      else if (val.length < 3)
        error = "Last name must be at least 3 characters.";
    }
    if (field === "mobileNo") {
      if (!val.trim()) error = "Mobile number is required.";
      else if (!/^\d{10}$/.test(val))
        error = "Mobile number must be 10 digits.";
    }
    if (field === "email") {
      if (!val.trim()) error = "Email is required.";
      else if (!validateEmail(val))
        error = "Please enter a valid email address.";
    }
    if (field === "password") {
      if (!val.trim()) error = "Password is required.";
      else {
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        if (!passwordRegex.test(val)) {
          error =
            "Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character.";
        }
      }
    }
    if (field === "confirmPassword") {
      if (val !== form.password) error = "Passwords do not match.";
    }
    if (field === "image") {
      if (!val.trim()) error = "Profile image is required.";
    }
    return error;
  };

  const handleInputChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    const error = validateField(field, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error,
    }));
  };

  const handleSignup = async () => {
    let formIsValid = true;
    const newErrors: Partial<userState> = {};

    const fields: (keyof userState)[] = [
      "firstName",
      "lastName",
      "mobileNo",
      "email",
      "password",
      "confirmPassword",
      "image",
    ];

    fields.forEach((field) => {
      const value = form[field];
      const error = validateField(field, value);
      newErrors[field] = error;
      if (error) formIsValid = false;
    });

    setErrors((prevErrors) => ({ ...prevErrors, ...newErrors }));

    if (!formIsValid) return;

    try {
      const result = await (dispatch as AppDispatch)(
        registerUser({
          firstName: form.firstName,
          lastName: form.lastName,
          mobileNo: form.mobileNo,
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword,
        })
      );

      if (registerUser.fulfilled.match(result)) {
        resetForm();
        setSuccessMessageModalVisible(true);
      } else {
        console.error("Registration failed:", result);
      }
    } catch (error) {
      console.error("An error occurred during signup:", error);
    }
  };

  const handleModalClose = () => {
    setSuccessMessageModalVisible(false);
    navigation.navigate("login");
  };

  const pickImage = async (source: "camera" | "gallery") => {
    let result;
    if (source === "camera") {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "Camera access is required.");
        return;
      }

      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }

    if (!result.canceled) {
      setForm({ ...form, image: result.assets[0].uri });
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: "",
      }));
      dispatch(setErrorMessage(null));
    } else {
      dispatch(setErrorMessage("No image selected. Please select an image."));
    }
  };

  return (
    <>
      <ImageBackground
        source={{
          uri: "https://www.stockvault.net/data/2019/08/28/268866/preview16.jpg",
        }}
        style={PageStyles.background}
      >
        <StatusBar style="dark" backgroundColor="#f9fafb" />
        <ScrollView contentContainerStyle={PageStyles.container}>
          <Text style={PageStyles.title}>
            Register Now – Start Your Journey
          </Text>

          <View style={PageStyles.inputContainer}>
            <Text style={PageStyles.label}>First name</Text>
            <TextInput
              placeholder="Enter your first name"
              value={form.firstName}
              onChangeText={(text) => handleInputChange("firstName", text)}
              style={PageStyles.input}
              autoCapitalize="none"
            />
            {errors.firstName && (
              <Text style={PageStyles.errorMessage}>{errors.firstName}</Text>
            )}
          </View>

          <View style={PageStyles.inputContainer}>
            <Text style={PageStyles.label}>Last name</Text>
            <TextInput
              placeholder="Enter your last name"
              value={form.lastName}
              onChangeText={(text) => handleInputChange("lastName", text)}
              style={PageStyles.input}
              autoCapitalize="none"
            />
            {errors.lastName && (
              <Text style={PageStyles.errorMessage}>{errors.lastName}</Text>
            )}
          </View>

          <View style={PageStyles.inputContainer}>
            <Text style={PageStyles.label}>Mobile number</Text>
            <TextInput
              placeholder="Enter your mobile number"
              value={form.mobileNo}
              onChangeText={(text) => handleInputChange("mobileNo", text)}
              keyboardType="phone-pad"
              style={PageStyles.input}
            />
            {errors.mobileNo && (
              <Text style={PageStyles.errorMessage}>{errors.mobileNo}</Text>
            )}
          </View>

          <View style={PageStyles.inputContainer}>
            <Text style={PageStyles.label}>Email</Text>
            <TextInput
              placeholder="Enter your email"
              value={form.email}
              onChangeText={(text) => handleInputChange("email", text)}
              keyboardType="email-address"
              style={PageStyles.input}
              autoCapitalize="none"
            />
            {errors.email && (
              <Text style={PageStyles.errorMessage}>{errors.email}</Text>
            )}
          </View>

          <View style={PageStyles.inputContainer}>
            <Text style={PageStyles.label}>Password</Text>
            <PasswordInput
              value={form.password}
              onChangeText={(text) => handleInputChange("password", text)}
              placeholder="Enter your password"
              errorMessage={errors.password}
            />
          </View>

          <View style={PageStyles.inputContainer}>
            <Text style={PageStyles.label}>Confirm password</Text>
            <PasswordInput
              value={form.confirmPassword}
              onChangeText={(text) =>
                handleInputChange("confirmPassword", text)
              }
              placeholder="Confirm your password"
              errorMessage={errors.confirmPassword}
            />
          </View>

          <View style={PageStyles.inputContainer}>
            <Text style={PageStyles.label}>Profile image</Text>
            <View style={PageStyles.imagePickerContainer}>
              <TouchableOpacity
                onPress={() => pickImage("gallery")}
                style={PageStyles.imageContent}
              >
                <Ionicons name="image" size={32} color="#3182ce" />
                <Text style={PageStyles.imagePickerText}>From Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => pickImage("camera")}
                style={PageStyles.imageContent}
              >
                <Ionicons name="camera" size={32} color="#3182ce" />
                <Text style={PageStyles.imagePickerText}>From Camera</Text>
              </TouchableOpacity>
            </View>
            {form.image && (
              <Image source={{ uri: form.image }} style={PageStyles.image} />
            )}
            {errors.image && (
              <Text style={PageStyles.errorMessage}>{errors.image}</Text>
            )}
          </View>

          {errorMessage && (
            <Text style={PageStyles.errorMessage}>{errorMessage}</Text>
          )}

          <TouchableOpacity
            onPress={handleSignup}
            style={[PageStyles.button, loading && PageStyles.buttonDisabled]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={PageStyles.buttonText}>Sign up</Text>
            )}
          </TouchableOpacity>

          <View style={PageStyles.footer}>
            <Text style={PageStyles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("login")}>
              <Text style={PageStyles.footerLink}>Login</Text>
            </TouchableOpacity>
          </View>
          {Platform.OS === "web" && <SocialIcon />}
          <SuccessMessageModal
            visible={isSuccessMessageModalVisible}
            onClose={handleModalClose}
            message="User registered successfully!"
            text="Go to Login"
          />
        </ScrollView>
      </ImageBackground>
    </>
  );
};

export default Register;
