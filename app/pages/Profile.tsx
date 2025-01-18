import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { auth } from "../config/firbase.config";
import { useNavigation } from "@react-navigation/native";
import { RegisterScreenNavigationProp } from "../types/types";
import PageStyles from "../styles/PageStyles";

function Profile() {
  const user = auth.currentUser;
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const handleLogout = () => {
    auth.signOut();
    navigation.navigate("Login");
  };

  return (
    <View style={PageStyles.container}>
      <Text style={PageStyles.title}>
        Welcome, {user?.displayName || "User"}!
      </Text>
      <Text style={PageStyles.label}>Email: {user?.email}</Text>
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
