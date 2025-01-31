import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  login: undefined;
  register: undefined;
  main: undefined;
  home:undefined
};

export interface User {
  id: string;
  name: string;
}

export interface UserTag {
  tagId: string;
  firstName: string | null;
  lastName: string | null;
  uid: string;
}


export type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "main"
>;
