import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { Button, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { RegisterScreenNavigationProp } from '../types/types';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://twitter.com/i/oauth2/authorize",
  tokenEndpoint: "https://twitter.com/i/oauth2/token",
  revocationEndpoint: "https://twitter.com/i/oauth2/revoke",
};

export default function App() {
const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: 'bERzeTdfMUhiTUM1bHhDZVpnSEU6MTpjaQ',
      redirectUri: makeRedirectUri({
        scheme: 'myapp',
      }),
      usePKCE: true,
      scopes: [
        "tweet.read",
      ],
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      navigation.navigate('Profile');
    }
  }, [response, navigation]); 
  return (
    <Button
      disabled={!request}
      title="Login"
      onPress={() => {
        promptAsync();
      }}
    />
  );
}
