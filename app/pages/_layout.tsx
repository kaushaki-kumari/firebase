import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Register from "./Register";

import TabNavigator from "../(tabs)/_layout";
import TwitterPage from "./TwitterPage";
import Login from "./Login";


const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="login">
          <Stack.Screen
        name="Register"
        component={Register}
        options={{
          headerShown: false,
          cardStyle: {
            flex: 1,
          },
        }}
      />
      <Stack.Screen
        name="login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
      name="Twitter"
      component={TwitterPage}
      options={{headerShown:false}}
      />
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
