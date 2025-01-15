import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import AppNavigator from "./components/AppNavigator";

const Index = () => {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

export default Index;
