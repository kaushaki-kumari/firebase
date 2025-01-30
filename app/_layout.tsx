import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import AppNavigator from "./pages/_layout"
import ToastManager from "toastify-react-native";

const Index = () => {
  return (
    <Provider store={store}>
       <ToastManager />
      <AppNavigator />
    </Provider>
  );
};
export default Index;
