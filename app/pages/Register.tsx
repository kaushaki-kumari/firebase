import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SuccessMessageModal from "../modal/SuccessMessageModal";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppDispatch } from "../store/index";
import { registerUser } from "../reducer/userActions";
import * as ImagePicker from "expo-image-picker";
import { setErrorMessage } from "../reducer/userSlice";
import { RootState } from "../store";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import PasswordInput from "../components/PasswordInput";
import {FormState} from "../userInfo/userData"
import { ErrorState } from "../userInfo/userData";
type RootStackParamList = {
  Register: undefined;
  Login: undefined;
};

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

const Register = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const user = useSelector((state: RootState) => state.user);
  const { errorMessage, loading } = user;
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    mobileNo: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: "",
  });
  const [errors, setErrors] = useState<ErrorState>({
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
      else if (!/\S+@\S+\.\S+/.test(val))
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
    const newErrors: Partial<ErrorState> = {};

    const fields: (keyof FormState)[] = [
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
    navigation.navigate("Login");
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setForm({ ...form, image: result.assets[0].uri });
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: "",
      }));
    } else {
      dispatch(setErrorMessage("No image selected. Please select an image."));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register Now – Start Your Journey</Text>
      <TextInput
        placeholder="First Name"
        value={form.firstName}
        onChangeText={(text) => handleInputChange("firstName", text)}
        style={styles.input}
      />
      {errors.firstName && (
        <Text style={styles.errorMessage}>{errors.firstName}</Text>
      )}

      <TextInput
        placeholder="Last Name"
        value={form.lastName}
        onChangeText={(text) => handleInputChange("lastName", text)}
        style={styles.input}
      />
      {errors.lastName && (
        <Text style={styles.errorMessage}>{errors.lastName}</Text>
      )}
      <TextInput
        placeholder="Mobile Number"
        value={form.mobileNo}
        onChangeText={(text) => handleInputChange("mobileNo", text)}
        keyboardType="phone-pad"
        style={styles.input}
      />
      {errors.mobileNo && (
        <Text style={styles.errorMessage}>{errors.mobileNo}</Text>
      )}
      <TextInput
        placeholder="Email"
        value={form.email}
        onChangeText={(text) => handleInputChange("email", text)}
        keyboardType="email-address"
        style={styles.input}
      />
      {errors.email && <Text style={styles.errorMessage}>{errors.email}</Text>}

      <PasswordInput
        value={form.password}
        onChangeText={(text) => handleInputChange("password", text)}
        placeholder="Password"
        errorMessage={errors.password}
      />

      <PasswordInput
        value={form.confirmPassword}
        onChangeText={(text) => handleInputChange("confirmPassword", text)}
        placeholder="Confirm Password"
        errorMessage={errors.confirmPassword}
      />
      <TouchableOpacity onPress={pickImage} style={styles.imagePickerContainer}>
        <Ionicons name="image" size={40} color="#3182ce" />
        <Text style={styles.imagePickerText}>Select Profile Image</Text>
      </TouchableOpacity>
      {form.image && (
        <Image source={{ uri: form.image }} style={styles.image} />
      )}
      {errors.image && <Text style={styles.errorMessage}>{errors.image}</Text>}

      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
      <TouchableOpacity
        onPress={handleSignup}
        style={[styles.button, loading && styles.buttonDisabled]}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>
      <SuccessMessageModal
        visible={isSuccessMessageModalVisible}
        onClose={handleModalClose}
        message="User registered successfully!"
        text="Go to Login"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f9fafb",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2d3748",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    color: "#4a5568",
    fontSize: 16,
    marginBottom: 13,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  errorMessage: {
    color: "#e53e3e",
    marginBottom: 10,
    marginLeft: "auto",
    marginRight: "auto",
  },
  button: {
    backgroundColor: "#3182ce",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: "center",
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
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    resizeMode: "cover",
    marginBottom: 8,
  },
  imagePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    justifyContent: "center",
  },
  imagePickerText: {
    marginLeft: 10,
    fontSize: 20,
    color: "#3182ce",
    fontWeight: "600",
  },
});

export default Register;
