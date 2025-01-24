import { initializeApp } from "firebase/app";
import { FacebookAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import * as Facebook from 'expo-facebook';
import { AccessToken, LoginManager } from "react-native-fbsdk-next";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID
};

let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  if (error.message.includes("already exists")) {
    app = firebase.app(); 
  } else {
    throw error; 
  }
}

// connect= (accessToken , config)=> {
//   let one = firebase.app().database["fbApp"];
//   one.auth().currentUser.getToken()
//     .then(idToken => firebase.auth.GoogleAuthProvider.credential(idToken, accessToken))
//     .then(credential => {
//       let two = firebase.initializeApp(config, `[${config.apiKey}]`);
//       return two.auth().signInWithCredential(credential);
//     })
//     .catch(console.warn)
//     .then(console.info);
// }

// two.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
//   .then(function(result) {
//     return one.auth().signInWithCredential(result.credential);
//   });

export const auth = getAuth(app);
export const db = getFirestore(app);
export const facebookProvider = new FacebookAuthProvider();

// export const facebookLogin = async () => {
//   try {
//     await Facebook.initializeAsync('1342506793432889');
//     const {
//       type,
//       token,
//     } = await Facebook.logInWithReadPermissionsAsync({
//       permissions: ["public_profile"],
//     });
//     if (type === "success") {
//       const response = await fetch(
//         `https://graph.facebook.com/me?access_token=${token}`
//       );
//       Alert.alert("Logged in!", `Hi ${(await response.json()).name}!`);
//     } else {
//     }
//   } catch ({ message }) {
//     alert(`Facebook Login Error: ${message}`);
//   }
// }

export const facebookLogin = async () => {
  try {
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    
    if (result.isCancelled) {
      throw new Error('User cancelled login');
    }
    const data = await AccessToken.getCurrentToken();
    
    if (!data) {
      throw new Error('Something went wrong obtaining access token');
    }
    const credential = FacebookAuthProvider.credential(data.accessToken);
    const userCredential = await signInWithCredential(auth, credential);
    
    return userCredential.user;
  } catch (error) {
    console.error('Facebook Login Error:', error);
    throw error;
  }
};
