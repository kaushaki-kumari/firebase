import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Profile: undefined;
  login: undefined;
  Register: undefined;
  Main: undefined;
  Twitter:undefined;
};

export type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;
