import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Profile: undefined;
  Login: undefined;
  Register: undefined;
};

export type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;
