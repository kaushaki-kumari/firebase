import React, { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { useAuthRequest } from 'expo-auth-session';
import { Button, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { RegisterScreenNavigationProp } from '../types/types';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://twitter.com/i/oauth2/authorize",
  tokenEndpoint: "https://twitter.com/i/oauth2/token",
  revocationEndpoint: "https://twitter.com/i/oauth2/revoke",
};
type TwitterUser = {
  data: {
    id: string;
    name: string;
    username: string;
  };
};

export default function App() {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [userInfo, setUserInfo] = useState<TwitterUser | null>(null); 

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: 'bERzeTdfMUhiTUM1bHhDZVpnSEU6MTpjaQ',
      redirectUri: 'https://0997-119-82-95-248.ngrok-free.app/Twitter',
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
      fetch('/https://twitter.com/i/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: 'bERzeTdfMUhiTUM1bHhDZVpnSEU6MTpjaQ',
          redirect_uri: 'https://0997-119-82-95-248.ngrok-free.app/Twitter',
          grant_type: 'authorization_code',
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          const accessToken = data.access_token;

          fetch('https://api.twitter.com/2/users/me', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
            .then((response) => response.json())
            .then((userData: TwitterUser) => {
              setUserInfo(userData); 
              navigation.navigate('login');
            })
            .catch((error) => console.error('Error fetching user data:', error));
        })
        .catch((error) => console.error('Error exchanging code for token:', error));
    }
  }, [response, navigation]);

  return (
    <>
      <Button
        disabled={!request}
        title="Login with Twitter"
        onPress={() => {
          promptAsync();
        }}
      />
      {userInfo && (
        <Text>{`Hello, ${userInfo.data.name}`}</Text>
      )}
    </>
  );
}
