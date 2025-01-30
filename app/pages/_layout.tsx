import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Register from "./Register";
import TabNavigator from "../(tabs)/_layout";
import Login from "./Login";
import { ActivityIndicator, View } from "react-native";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        setIsLoggedIn(!!userData);  
      } catch (error) {
        console.error("Error checking auth status", error);
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  const initialRoute = isLoggedIn ? "main" : "login";

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen
        name="register"
        component={Register}
        options={{
          headerShown: false,
          cardStyle: { flex: 1 }, 
        }}
      />
      <Stack.Screen
        name="login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
