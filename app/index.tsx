import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import AppNavigator from "./pages/_layout"

const Index = () => {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};
export default Index;
