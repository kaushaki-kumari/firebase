import React from 'react';
import { Button, View } from 'react-native';
import { facebookLogin } from '../config/firbase.config';

const LoginScreen = () => {
  return (
    <View>
      <Button title="Login with Facebook" onPress={facebookLogin} />
    </View>
  );
};

export default LoginScreen;
