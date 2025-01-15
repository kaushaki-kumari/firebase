import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import * as ImagePicker from "expo-image-picker";
import {
  createUserWithEmailAndPassword,
  AuthError,
  AuthErrorCodes,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firbase.config";
import {
  setUserData,
  setLoading,
  setErrorMessage,
  resetUserState,
} from "../features/userSlice";
import { RootState } from "../store";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

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
  const {
    firstName,
    lastName,
    mobileNo,
    email,
    password,
    confirmPassword,
    errorMessage,
    loading,
  } = user;
  const [image, setImage] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    mobileNo: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const resetForm = () => {
    dispatch(resetUserState());
    setImage(null);
    setErrors({
      firstName: "",
      lastName: "",
      mobileNo: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  useEffect(() => {
    const resetFormField = navigation.addListener("focus", () => {
      resetForm();
    });

    return resetFormField;
  }, [navigation]);

  useEffect(() => {
    return () => {
      dispatch(
        setUserData({
          firstName: "",
          lastName: "",
          mobileNo: "",
          email: "",
          password: "",
          confirmPassword: "",
        })
      );
      dispatch(setErrorMessage(null));
      dispatch(setLoading(false));
      setImage(null);
      setErrors({
        firstName: "",
        lastName: "",
        mobileNo: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    };
  }, [dispatch]);

  const handleInputChange = (field: string, value: string) => {
    dispatch(setUserData({ [field]: value }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: validateField(field, value),
    }));
  };

  const validateField = (field: string, value: string) => {
    let error = "";
    switch (field) {
      case "firstName":
        if (!value) {
          error = "First name is required.";
        } else if (value.length < 3) {
          error = "First name must be at least 3 characters.";
        }
        break;
      case "lastName":
        if (!value) {
          error = "Last name is required.";
        } else if (value.length < 3) {
          error = "Last name must be at least 3 characters.";
        }
        break;
      case "mobileNo":
        if (!value) {
          error = "Mobile number is required.";
        } else if (value.length !== 10) {
          error = "Mobile number must be 10 digits.";
        }
        break;
      case "email":
        if (!value) {
          error = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Please enter a valid email address.";
        }
        break;
      case "password":
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        if (!value) {
          error = "Password is required.";
        } else if (!passwordRegex.test(value)) {
          error =
            "Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character.";
        }
        break;
      case "confirmPassword":
        if (value !== password) {
          error = "Passwords do not match.";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleSignup = async () => {
    let formIsValid = true;

    const newErrors = {
      firstName: validateField("firstName", firstName),
      lastName: validateField("lastName", lastName),
      mobileNo: validateField("mobileNo", mobileNo),
      email: validateField("email", email),
      password: validateField("password", password),
      confirmPassword: validateField("confirmPassword", confirmPassword),
    };

    if (!image) {
      newErrors.image = "Profile image is required.";
      formIsValid = false;
    }

    Object.values(newErrors).forEach((error) => {
      if (error) formIsValid = false;
    });

    setErrors(newErrors);
    if (!formIsValid) return;
    dispatch(setErrorMessage(null));
    dispatch(setLoading(true));

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", userCredential.user.uid), {
        firstName,
        lastName,
        mobileNo,
        email,
        profileImage: image,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      alert("User registered successfully");
      dispatch(
        setUserData({
          firstName: "",
          lastName: "",
          mobileNo: "",
          email: "",
          password: "",
          confirmPassword: "",
        })
      );
      setImage(null);
      navigation.navigate("Login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        const firebaseError = error as AuthError;

        const errorMessages: Record<string, string> = {
          [AuthErrorCodes.WEAK_PASSWORD]:
            "Password should be at least 6 characters.",
          [AuthErrorCodes.EMAIL_EXISTS]: "The email address is already in use.",
          [AuthErrorCodes.INVALID_EMAIL]: "The email address is invalid.",
        };

        dispatch(
          setErrorMessage(
            errorMessages[firebaseError.code] ||
              "An error occurred, please try again."
          )
        );
      } else {
        dispatch(setErrorMessage("An unexpected error occurred."));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled) {
      dispatch(setErrorMessage("No image selected. Please select an image."));
    } else {
      dispatch(setErrorMessage(null));
      setImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={(text) => handleInputChange("firstName", text)}
        style={styles.input}
      />
      {errors.firstName && (
        <Text style={styles.errorMessage}>{errors.firstName}</Text>
      )}

      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={(text) => handleInputChange("lastName", text)}
        style={styles.input}
      />
      {errors.lastName && (
        <Text style={styles.errorMessage}>{errors.lastName}</Text>
      )}
      <TextInput
        placeholder="Mobile Number"
        value={mobileNo}
        onChangeText={(text) => handleInputChange("mobileNo", text)}
        keyboardType="phone-pad"
        style={styles.input}
      />
      {errors.mobileNo && (
        <Text style={styles.errorMessage}>{errors.mobileNo}</Text>
      )}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => handleInputChange("email", text)}
        keyboardType="email-address"
        style={styles.input}
      />
      {errors.email && <Text style={styles.errorMessage}>{errors.email}</Text>}

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => handleInputChange("password", text)}
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
      </View>
      {errors.password && (
        <Text style={styles.errorMessage}>{errors.password}</Text>
      )}

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={(text) => handleInputChange("confirmPassword", text)}
          secureTextEntry={!isConfirmPasswordVisible}
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
        >
          <Ionicons
            name={isConfirmPasswordVisible ? "eye" : "eye-off"}
            size={20}
            color="#3182ce"
          />
        </TouchableOpacity>
      </View>
      {errors.confirmPassword && (
        <Text style={styles.errorMessage}>{errors.confirmPassword}</Text>
      )}
      <TouchableOpacity onPress={pickImage} style={styles.imagePickerContainer}>
        <Ionicons name="image" size={40} color="#3182ce" />
        <Text style={styles.imagePickerText}>Select Profile Image</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {errors.image && (
        <Text style={styles.errorMessage}>{errors.image}</Text>
      )}

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
    fontSize: 24,
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

export default Register;
