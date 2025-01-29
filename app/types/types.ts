import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Profile: undefined;
  login: undefined;
  register: undefined;
  main: undefined;
};

export type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;
