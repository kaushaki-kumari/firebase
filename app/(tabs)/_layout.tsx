import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./Home";
import AddPostScreen from "./AddPost";
import ProfileScreen from "./Profile";
import Icon from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

const getTabBarIcon = (routeName: string, color: string, size: number) => {
  const iconMap: { [key: string]: string } = {
    home: "home-outline",
    addPost: "add-circle-outline",
    profile: "person-outline",
  };

  const iconName = iconMap[routeName] || "alert-circle-outline"; 
  return <Icon name={iconName} size={size} color={color} />;
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => getTabBarIcon(route.name, color, size),
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
        headerShown: false, 
      })}
    >
      <Tab.Screen name="home" component={HomeScreen} />
      <Tab.Screen name="addPost" component={AddPostScreen} />
      <Tab.Screen name="profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
