import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { auth } from '../config/firbase.config'; 

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
type RootStackParamList = {
  Profile: undefined;
  Login: undefined;
};
type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;
function Profile() {
  const user = auth.currentUser; 
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const handleLogout = () => {
    auth.signOut();
    navigation.navigate('Login'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user?.displayName || 'User'}!</Text>
      <Text>Email: {user?.email}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default Profile;
