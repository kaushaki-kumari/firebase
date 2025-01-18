import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/index";
import { AppDispatch } from "../store/index";
import { logoutUser } from "../reducer/userActions";
import PageStyles from "../styles/PageStyles";
import { RegisterScreenNavigationProp } from "../types/types";

function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (!user) {
      navigation.navigate("Login");
    }
  }, [user, navigation]);

  if (!user) {
    return null; 
  }

  const handleLogout = () => {
    dispatch(logoutUser());
    navigation.navigate("Login");
  };

  return (
    <View style={PageStyles.container}>
      <Text style={PageStyles.title}>Welcome, {user.firstName || "User"}!</Text>
      <Text style={PageStyles.label}>First Name: {user.firstName}</Text>
      <Text style={PageStyles.label}>Last Name: {user.lastName}</Text>
      <Text style={PageStyles.label}>Email: {user.email}</Text>
      <Text style={PageStyles.label}>Mobile Number: {user.mobileNo}</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={PageStyles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Profile;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#3182ce",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    padding: 10,
    cursor: "pointer",
  },
});
