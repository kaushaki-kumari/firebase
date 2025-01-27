import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { handleFacebookLogin, handleGoogleLogin, handleTwitterLogin } from "../reducer/SocialAuth";
import { RegisterScreenNavigationProp } from "../types/types";
import { useNavigation } from "expo-router";

export default function SocialIcon() {
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const handleLogin = async (type: string) => {
    try {
      let userData;
      if (type === "google") {
        userData = await handleGoogleLogin();
      } else if (type === "twitter") {
        userData = await handleTwitterLogin();
      } else if (type === "facebook") {
        userData = await handleFacebookLogin();
      } else {
        alert(`${type} login coming soon!`);
        return;
      }
      console.log("navigate");
      navigation.navigate("Main");
      console.log(`${type} login successfully:`, userData);
    } catch (error) {
      console.error(`${type} login error:`, error);
    }
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handleLogin("google")}>
        <FontAwesome name="google" size={30} color="#3182ce" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleLogin("facebook")}>
        <FontAwesome name="facebook" size={30} color="#3182ce" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleLogin("twitter")}>
        <FontAwesome name="twitter" size={30} color="#3182ce" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 20,
    marginTop: 10,
  },
});
