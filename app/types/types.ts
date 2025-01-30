import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  login: undefined;
  register: undefined;
  main: undefined;
  home:undefined
};

export type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "main"
>;
