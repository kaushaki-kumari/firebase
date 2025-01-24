import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { Button,  View } from 'react-native';


WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://twitter.com/i/oauth2/authorize",
  tokenEndpoint: "https://twitter.com/i/oauth2/token",
  revocationEndpoint: "https://twitter.com/i/oauth2/revoke",
};

export default function HomeScreen() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: 'bERzeTdfMUhiTUM1bHhDZVpnSEU6MTpjaQ',
      redirectUri: makeRedirectUri({
        scheme: 'com.anonymous.myapp',
      }),
      usePKCE: true,
      scopes: [
        "tweet.read",
      ],
    },
    discovery
  );

  useEffect(() => {
    console.log(response)
    if (response?.type === 'success') {
      const { code } = response.params;
      console.log(code)
    }
  }, [response]);

  return (
    <View style={{paddingTop: 80}}>

      <Button
        disabled={!request}
        title="Login"
        onPress={() => {
          promptAsync();
        }}
      />
    </View>
  );
}